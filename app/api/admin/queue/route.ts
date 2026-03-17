// API Route: GET /api/admin/queue
// Fetch submissions by queue type (looks_good or needs_review)

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'looks_good' | 'needs_review' | null;

    if (!type || (type !== 'looks_good' && type !== 'needs_review')) {
      return NextResponse.json(
        { error: 'Invalid queue type. Must be "looks_good" or "needs_review"' },
        { status: 400 }
      );
    }

    const db = getDB();
    const submissions = await submissionQueries.getByQueue(db, type);

    // Add public URLs to original images
    const submissionsWithUrls = submissions.map(sub => ({
      ...sub,
      imageUrl: getPublicUrl(sub.original_r2_key),
    }));

    return NextResponse.json({
      queue: type,
      submissions: submissionsWithUrls,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}
