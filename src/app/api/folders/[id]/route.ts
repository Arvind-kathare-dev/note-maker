import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Folder from '@/models/Folder';
import Document from '@/models/Document';

// PUT update a folder by custom ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updatedFolder = await Folder.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updatedFolder) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFolder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a folder by custom ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedFolder = await Folder.findOneAndDelete({ id });

    if (!deletedFolder) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 });
    }

    // Reset folderId of all documents nested inside it to null (orphan safety)
    await Document.updateMany({ folderId: id }, { $set: { folderId: null } });

    return NextResponse.json({ success: true, message: 'Folder deleted and manuals unsorted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
