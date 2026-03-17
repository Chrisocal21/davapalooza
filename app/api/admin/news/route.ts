// API Route: /api/admin/news
// CRUD operations for news posts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, newsQueries } from '@/lib/db';
import { uploadToR2, R2_PATHS, getFileExtension, isValidImageType } from '@/lib/r2';

// GET - Fetch all news posts
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const newsPosts = await newsQueries.getAll(db);

    return NextResponse.json({ news: newsPosts });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST - Create new news post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const photo = formData.get('photo') as File | null;

    // Validate required fields
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    const newsId = crypto.randomUUID();
    let photoKey: string | undefined;

    // Upload photo if provided
    if (photo && photo.size > 0) {
      if (!isValidImageType(photo.type)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExtension = getFileExtension(photo.name);
      
      photoKey = R2_PATHS.news(newsId, fileExtension);
      await uploadToR2(photoKey, buffer, photo.type);
    }

    const db = getDB();
    await newsQueries.create(db, {
      id: newsId,
      title,
      body,
      photo_r2_key: photoKey,
    });

    return NextResponse.json({
      message: 'News post created successfully',
      id: newsId,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating news post:', error);
    return NextResponse.json(
      { error: 'Failed to create news post' },
      { status: 500 }
    );
  }
}

// PUT - Update news post
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const photo = formData.get('photo') as File | null;

    if (!id) {
      return NextResponse.json(
        { error: 'News post ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    const updateData: any = {};

    if (title) updateData.title = title;
    if (body) updateData.body = body;

    // Upload new photo if provided
    if (photo && photo.size > 0) {
      if (!isValidImageType(photo.type)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExtension = getFileExtension(photo.name);
      
      const photoKey = R2_PATHS.news(id, fileExtension);
      await uploadToR2(photoKey, buffer, photo.type);
      updateData.photo_r2_key = photoKey;
    }

    await newsQueries.update(db, id, updateData);

    return NextResponse.json({
      message: 'News post updated successfully',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error updating news post:', error);
    return NextResponse.json(
      { error: 'Failed to update news post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete news post
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'News post ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    await newsQueries.deleteById(db, id);

    return NextResponse.json({
      message: 'News post deleted successfully',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting news post:', error);
    return NextResponse.json(
      { error: 'Failed to delete news post' },
      { status: 500 }
    );
  }
}
