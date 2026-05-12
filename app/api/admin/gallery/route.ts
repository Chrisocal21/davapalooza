// API Route: DELETE /api/admin/gallery
// Move a gallery photo to trash

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, galleryQueries } from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Gallery photo ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    await galleryQueries.moveToTrash(db, id);

    return NextResponse.json({
      message: 'Photo moved to trash',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error moving photo to trash:', error);
    return NextResponse.json(
      { error: 'Failed to move photo to trash' },
      { status: 500 }
    );
  }
}
