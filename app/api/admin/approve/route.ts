// API Route: POST /api/admin/approve
// Approve a submission and add to gallery with watermark

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, submissionQueries, galleryQueries } from '@/lib/db';
import { downloadFromR2, uploadToR2, R2_PATHS, getFileExtension } from '@/lib/r2';

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

    // TODO: Apply watermark when we have a Workers-compatible solution
    // For now, just copy the original image to gallery
    const watermarkedImage = originalImage;

    // Upload to gallery folder
    const fileExtension = getFileExtension(submission.original_r2_key);
    const watermarkedKey = R2_PATHS.gallery(id, fileExtension);
    
    // Determine content type from extension
    let contentType = 'image/jpeg';
    if (fileExtension === 'png') contentType = 'image/png';
    if (fileExtension === 'heic' || fileExtension === 'heif') contentType = 'image/heic';
    
    await uploadToR2(watermarkedKey, watermarkedImage, contentType);

    // Update submission status
    await submissionQueries.approve(db, id, watermarkedKey);

    // Add to gallery table
    await galleryQueries.create(db, {
      id: crypto.randomUUID(),
      submission_id: id,
      handle: submission.handle,
      caption: submission.caption,
      watermarked_r2_key: watermarkedKey,
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
