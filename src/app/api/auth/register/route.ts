import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and Email are required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return NextResponse.json({ success: false, message: 'A user with this email already exists' }, { status: 409 });
    }

    const role = 'user';
    const newUser = await User.create({
      id: `u-${Date.now()}`,
      name,
      email: normalized,
      role,
      avatar: `https://i.pravatar.cc/150?u=${name}`
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
