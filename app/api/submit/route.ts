// API Route: POST /api/submit
// Handles photo submission from public users

import { NextRequest, NextResponse } from 'next/server';
import { getDB, submissionQueries } from '@/lib/db';
import { uploadToR2, R2_PATHS, isValidImageType, isValidFileSize, getFileExtension } from '@/lib/r2';
import { checkSubmissionText } from '@/lib/moderation/textFilter';
import { scanImage } from '@/lib/moderation/imageScan';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    const file = formData.get('photo') as File;
    const handle = formData.get('handle') as string;
    const platform = formData.get('platform') as string;
    const caption = formData.get('caption') as string;
    const name = formData.get('name') as string;
    const agreement = formData.get('agreement') as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'Photo is required' },
        { status: 400 }
      );
    }

    if (!handle) {
      return NextResponse.json(
        { error: 'Social handle is required' },
        { status: 400 }
      );
    }

    if (agreement !== 'true') {
      return NextResponse.json(
        { error: 'You must agree to the terms' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and HEIC images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File size must be under 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique submission ID
    const submissionId = crypto.randomUUID();
    const fileExtension = getFileExtension(file.name);

    // Upload original file to R2
    const r2Key = R2_PATHS.submissions.pending(submissionId, fileExtension);
    await uploadToR2(r2Key, buffer, file.type);

    // Run moderation checks
    const textResult = checkSubmissionText(handle, caption);
    const imageResult = await scanImage(buffer);

    // Determine queue based on moderation results
    let queue: 'looks_good' | 'needs_review';
    let status: 'looks_good' | 'needs_review';

    if (textResult === 'pass' && imageResult === 'pass') {
      queue = 'looks_good';
      status = 'looks_good';
    } else {
      queue = 'needs_review';
      status = 'needs_review';
    }

    // Save submission to database
    const db = getDB();
    
    await submissionQueries.create(db, {
      id: submissionId,
      handle: handle.trim(),
      platform: platform || undefined,
      caption: caption || undefined,
      name: name || undefined,
      original_r2_key: r2Key,
    });

    // Update with moderation results
    await submissionQueries.updateModerationResults(db, submissionId, {
      text_filter_result: textResult,
      image_scan_result: imageResult,
      status,
      queue,
    });

    return NextResponse.json(
      {
        message: 'Photo submitted successfully! It will be reviewed shortly.',
        id: submissionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your submission. Please try again.' },
      { status: 500 }
    );
  }
}
