// API Route: GET /api/admin/dashboard
// Get dashboard statistics and queue counts

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries } from '@/lib/db';

export async function GET() {
  try {
    // Check authentication
    await requireAuth();

    const db = getDB();
    const queueCounts = await submissionQueries.getQueueCounts(db);

    return NextResponse.json({
      queueCounts,
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
