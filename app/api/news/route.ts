// API Route: GET /api/news
// Public endpoint to fetch news posts

import { NextResponse } from 'next/server';
import { getDB, newsQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET() {
  try {
    const db = getDB();
    const newsPosts = await newsQueries.getAll(db);

    // Add public URLs for photos
    const newsWithUrls = newsPosts.map(post => ({
      ...post,
      photoUrl: post.photo_r2_key ? getPublicUrl(post.photo_r2_key) : null,
    }));

    return NextResponse.json({
      news: newsWithUrls,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
