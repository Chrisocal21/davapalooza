// API Route: POST /api/admin/approve
// Approve a submission and add to gallery with watermark

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries, galleryQueries } from '@/lib/db';
import { downloadFromR2, uploadToR2, R2_PATHS, getFileExtension } from '@/lib/r2';
import { watermarkPhoto } from '@/lib/watermark';

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

    // Download original image from R2
    const originalImage = await downloadFromR2(submission.original_r2_key);

    // Watermark + cap the size. If the Images service can't read the photo this
    // returns the original, so approving always works.
    const originalExt = getFileExtension(submission.original_r2_key);
    let originalType = 'image/jpeg';
    if (originalExt === 'png') originalType = 'image/png';
    if (originalExt === 'heic' || originalExt === 'heif') originalType = 'image/heic';

    const wm = await watermarkPhoto(originalImage, originalType);
    const watermarkedKey = R2_PATHS.gallery(id, wm.applied ? 'jpg' : originalExt);
    await uploadToR2(watermarkedKey, wm.bytes, wm.contentType);

    // Update submission status
    await submissionQueries.approve(db, id, watermarkedKey);

    // Add to gallery table
    await galleryQueries.create(db, {
      id: crypto.randomUUID(),
      submission_id: id,
      handle: submission.handle,
      caption: submission.caption,
      watermarked_r2_key: watermarkedKey,
      year: submission.event_year,
    });

    return NextResponse.json({
      message: 'Submission approved and added to gallery',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error approving submission:', error);
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    );
  }
}
