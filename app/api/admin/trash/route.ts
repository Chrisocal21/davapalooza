// API Route: GET /api/admin/trash - Get trashed photos
// API Route: POST /api/admin/trash - Restore a photo from trash

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, galleryQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET() {
  try {
    await requireAuth();

    const db = getDB();
    const photos = await galleryQueries.getTrashed(db);

    const photosWithUrls = photos.map(photo => ({
      ...photo,
      imageUrl: getPublicUrl(photo.watermarked_r2_key),
    }));

    return NextResponse.json({
      photos: photosWithUrls,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching trash:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trash' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    await galleryQueries.restoreFromTrash(db, id);

    return NextResponse.json({
      message: 'Photo restored from trash',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error restoring photo:', error);
    return NextResponse.json(
      { error: 'Failed to restore photo' },
      { status: 500 }
    );
  }
}
