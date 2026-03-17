// API Route: POST /api/admin/reject
// Reject a submission and delete from R2

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries } from '@/lib/db';
import { deleteFromR2 } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    
    // Get submission details
    const submission = await submissionQueries.getById(db, id);
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Delete original file from R2
    await deleteFromR2(submission.original_r2_key);

    // Update submission status
    await submissionQueries.reject(db, id);

    return NextResponse.json({
      message: 'Submission rejected and deleted',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error rejecting submission:', error);
    return NextResponse.json(
      { error: 'Failed to reject submission' },
      { status: 500 }
    );
  }
}
