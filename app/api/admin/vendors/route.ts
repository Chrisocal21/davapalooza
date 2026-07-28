// GET /api/admin/vendors — list vendor registrations (admin)
// PATCH /api/admin/vendors — update status / admin notes

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = getDB();
    const query = status
      ? db.prepare(
          `SELECT * FROM vendor_registrations WHERE status = ? ORDER BY submitted_at DESC`
        ).bind(status)
      : db.prepare(`SELECT * FROM vendor_registrations ORDER BY submitted_at DESC`);

    const { results } = await query.all();
    return NextResponse.json({ registrations: results });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching vendor registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const validStatuses = ['new', 'reviewed', 'accepted', 'declined', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = getDB();
    await db
      .prepare(
        `UPDATE vendor_registrations SET status = COALESCE(?, status), admin_notes = COALESCE(?, admin_notes) WHERE id = ?`
      )
      .bind(status ?? null, admin_notes ?? null, id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating vendor registration:', error);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}
