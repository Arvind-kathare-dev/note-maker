import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    // Determine if this looks like an admin email
    const isAdminEmail =
      normalized.includes('admin') ||
      normalized === 'john@example.com' ||
      normalized === 'jane@example.com' ||
      normalized === 'admin@littleseeds.com' ||
      normalized === 'admin@example.com';

    // Find or auto-create admin user for known admin emails
    let dbUser = await User.findOne({ email: normalized });

    if (!dbUser) {
      if (isAdminEmail) {
        // Auto-create the admin account on first login
        dbUser = await User.create({
          id: `admin-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          email: normalized,
          role: 'admin',
          password: password || 'admin',
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalized)}`,
        });
      } else {
        return NextResponse.json({ success: false, message: 'User not found. Please register first.' }, { status: 404 });
      }
    }

    const isAdminRole = dbUser.role === 'SUPER_ADMIN' || dbUser.role === 'admin' || dbUser.role === 'ADMIN';
    const isClientRole = dbUser.role === 'CLIENT';

    // AUTO-ELEVATE: if the email looks like admin but stored role is 'user', upgrade it
    if (isAdminEmail && !isAdminRole && !isClientRole) {
      await User.findOneAndUpdate({ email: normalized }, { role: 'admin' });
      dbUser.role = 'admin';
    }

    // For CLIENT accounts: require password verification
    if (isClientRole) {
      if (!password) {
        return NextResponse.json({ success: false, message: 'Password is required for client accounts.' }, { status: 400 });
      }
      if (dbUser.password && dbUser.password !== password) {
        return NextResponse.json({ success: false, message: 'Invalid password. Please check your credentials.' }, { status: 401 });
      }
      if (!dbUser.assignedProjectId) {
        return NextResponse.json({ success: false, message: 'No project assigned to this account. Contact your administrator.' }, { status: 403 });
      }
    }

    // For Admin accounts: verify email is authorized
    if (dbUser.role === 'admin' || dbUser.role === 'SUPER_ADMIN' || dbUser.role === 'ADMIN') {
      if (!isAdminEmail) {
        return NextResponse.json({ success: false, message: 'Access denied. Admin role requires an authorized admin email.' }, { status: 403 });
      }
      // Optional: verify admin password if one is stored
      if (dbUser.password && password && dbUser.password !== password) {
        return NextResponse.json({ success: false, message: 'Invalid password.' }, { status: 401 });
      }
    }

    // Return user data (never expose raw password)
    const userData = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      avatar: dbUser.avatar,
      assignedProjectId: dbUser.assignedProjectId || null,
      preferences: dbUser.preferences,
    };

    return NextResponse.json({ success: true, data: userData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
