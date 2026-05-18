import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    // Find the user in our MongoDB database
    let dbUser = await User.findOne({ email: normalized });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found. Please register first.' }, { status: 404 });
    }

    const isAdminEmail = normalized.includes('admin') || 
                         normalized === 'john@example.com' || 
                         normalized === 'jane@example.com' || 
                         normalized === 'admin@veloc.com' || 
                         normalized === 'admin@example.com';

    const hasAdminRole = dbUser.role === 'SUPER_ADMIN' || dbUser.role === 'admin';

    if (isAdminEmail && !hasAdminRole) {
      return NextResponse.json({ success: false, message: 'Access denied. This admin email does not have admin privileges.' }, { status: 403 });
    }

    if (hasAdminRole && !isAdminEmail) {
      return NextResponse.json({ success: false, message: 'Access denied. Admin role requires an authorized admin email.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: dbUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
