// POST /api/bands — public band inquiry form submission

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

function sanitize(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const bandName = sanitize(body.band_name);
    const contactName = sanitize(body.contact_name);
    const contactEmail = sanitize(body.contact_email);

    if (!bandName || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: 'band_name, contact_name, and contact_email are required' },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();

    const db = getDB();
    await db
      .prepare(
        `INSERT INTO band_inquiries
         (id, band_name, contact_name, contact_email, contact_phone, genres,
          instagram, tiktok, spotify, website, other_info, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        bandName,
        contactName,
        contactEmail,
        sanitize(body.contact_phone),
        sanitize(body.genres),
        sanitize(body.instagram),
        sanitize(body.tiktok),
        sanitize(body.spotify),
        sanitize(body.website),
        sanitize(body.other_info),
        submittedAt
      )
      .run();

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Band inquiry submission error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
