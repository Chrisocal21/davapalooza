// API Route: GET /api/admin/dashboard
// Get dashboard statistics and queue counts

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries } from '@/lib/db';
import { getPublicUrl } from '@/lib/r2';

export async function GET() {
  try {
    // Check authentication
    await requireAuth();

    const db = getDB();
    const queueCounts = await submissionQueries.getQueueCounts(db);
    const statusCounts = await submissionQueries.getStatusCounts(db);
    const recentActivity = await submissionQueries.getRecentActivity(db, 5);

    // Add public URLs to recent activity
    const activityWithUrls = recentActivity.map(submission => ({
      id: submission.id,
      handle: submission.handle,
      status: submission.status,
      reviewed_at: submission.reviewed_at,
      imageUrl: getPublicUrl(submission.original_r2_key),
    }));

    return NextResponse.json({
      queueCounts,
      statusCounts,
      recentActivity: activityWithUrls,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
