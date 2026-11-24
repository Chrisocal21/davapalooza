// POST /api/store-waitlist — "Notify me when the store launches" email capture

import { NextRequest, NextResponse } from 'next/server';
import { getDB, storeEmailQueries } from '@/lib/db';
import { guardSubmission } from '@/lib/spam';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDB();

    const blocked = await guardSubmission({ db, request, scope: 'waitlist', honeypot: body.hp, max: 5 });
    if (blocked) return blocked;

    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Already on the list? Say thanks anyway — no need to reveal that.
    // No phone notification here on purpose: signups show up on the admin dashboard.
    await storeEmailQueries.create(db, email);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Store waitlist error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
