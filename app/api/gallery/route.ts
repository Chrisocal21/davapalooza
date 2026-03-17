// API Route: GET /api/gallery
// Public endpoint to fetch approved gallery photos

import { NextResponse } from 'next/server';
import { getDB, galleryQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET() {
  try {
    const db = getDB();
    const photos = await galleryQueries.getAll(db);

    // Add public URLs
    const photosWithUrls = photos.map(photo => ({
      ...photo,
      imageUrl: getPublicUrl(photo.watermarked_r2_key),
    }));

    return NextResponse.json({
      photos: photosWithUrls,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}
