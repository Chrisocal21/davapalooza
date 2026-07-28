// POST /api/vendors — public vendor registration form submission

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

    const businessName = sanitize(body.business_name);
    const contactName = sanitize(body.contact_name);
    const contactEmail = sanitize(body.contact_email);
    const productDescription = sanitize(body.product_description);

    if (!businessName || !contactName || !contactEmail || !productDescription) {
      return NextResponse.json(
        { error: 'business_name, contact_name, contact_email, and product_description are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();

    const db = getDB();
    await db
      .prepare(
        `INSERT INTO vendor_registrations
         (id, business_name, contact_name, contact_email, contact_phone,
          product_description, space_needs, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        businessName,
        contactName,
        contactEmail,
        sanitize(body.contact_phone),
        productDescription,
        sanitize(body.space_needs),
        submittedAt
      )
      .run();

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
