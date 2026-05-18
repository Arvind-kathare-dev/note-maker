import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Folder from '@/models/Folder';

// GET all folders
export async function GET() {
  try {
    await connectToDatabase();
    const folders = await Folder.find({});
    return NextResponse.json({ success: true, data: folders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a folder
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const customId = body.id || Math.random().toString(36).slice(2, 11);

    const newFolder = await Folder.create({
      id: customId,
      name: body.name,
      parentId: body.parentId || null,
      projectId: body.projectId || null,
      icon: body.icon || '📁',
      color: body.color || ''
    });

    return NextResponse.json({ success: true, data: newFolder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
