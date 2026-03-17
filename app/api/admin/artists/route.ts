// API Route: /api/admin/artists
// CRUD operations for artist lineup

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, artistQueries } from '@/lib/db';
import { uploadToR2, R2_PATHS, deleteFromR2, getFileExtension, isValidImageType } from '@/lib/r2';

// GET - Fetch all artists or by year
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const db = getDB();
    const artists = year 
      ? await artistQueries.getByYear(db, parseInt(year))
      : await artistQueries.getAll(db);

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

// POST - Create new artist
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const genre = formData.get('genre') as string;
    const bio = formData.get('bio') as string;
    const social_url = formData.get('social_url') as string;
    const year = formData.get('year') as string;
    const set_time = formData.get('set_time') as string;
    const photo = formData.get('photo') as File | null;

    // Validate required fields
    if (!name || !year) {
      return NextResponse.json(
        { error: 'Name and year are required' },
        { status: 400 }
      );
    }

    const artistId = crypto.randomUUID();
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
      
      photoKey = R2_PATHS.artists(artistId, fileExtension);
      await uploadToR2(photoKey, buffer, photo.type);
    }

    const db = getDB();
    await artistQueries.create(db, {
      id: artistId,
      name,
      genre: genre || undefined,
      bio: bio || undefined,
      social_url: social_url || undefined,
      photo_r2_key: photoKey,
      year: parseInt(year),
      set_time: set_time || undefined,
    });

    return NextResponse.json({
      message: 'Artist created successfully',
      id: artistId,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}

// PUT - Update artist
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const genre = formData.get('genre') as string;
    const bio = formData.get('bio') as string;
    const social_url = formData.get('social_url') as string;
    const year = formData.get('year') as string;
    const set_time = formData.get('set_time') as string;
    const photo = formData.get('photo') as File | null;

    if (!id) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    const updateData: any = {};

    if (name) updateData.name = name;
    if (genre) updateData.genre = genre;
    if (bio) updateData.bio = bio;
    if (social_url) updateData.social_url = social_url;
    if (year) updateData.year = parseInt(year);
    if (set_time) updateData.set_time = set_time;

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
      
      const photoKey = R2_PATHS.artists(id, fileExtension);
      await uploadToR2(photoKey, buffer, photo.type);
      updateData.photo_r2_key = photoKey;
    }

    await artistQueries.update(db, id, updateData);

    return NextResponse.json({
      message: 'Artist updated successfully',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    );
  }
}

// DELETE - Delete artist
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const db = getDB();
    await artistQueries.deleteById(db, id);

    return NextResponse.json({
      message: 'Artist deleted successfully',
      id,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Failed to delete artist' },
      { status: 500 }
    );
  }
}
