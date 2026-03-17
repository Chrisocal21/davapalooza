// API Route: GET /api/artists
// Public endpoint to fetch artist lineup

import { NextRequest, NextResponse } from 'next/server';
import { getDB, artistQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const db = getDB();
    const artists = year 
      ? await artistQueries.getByYear(db, parseInt(year))
      : await artistQueries.getAll(db);

    // Add public URLs for photos
    const artistsWithUrls = artists.map(artist => ({
      ...artist,
      photoUrl: artist.photo_r2_key ? getPublicUrl(artist.photo_r2_key) : null,
    }));

    return NextResponse.json({
      artists: artistsWithUrls,
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}
