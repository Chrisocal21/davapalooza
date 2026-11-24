// GET /api/admin/bands — list band inquiries (admin)
// PATCH /api/admin/bands — update status / admin notes

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { resolveYear, listYears, buildFilter } from '@/lib/admin/year';
import { getIntakeYear } from '@/lib/events';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // optional filter

    const year = resolveYear(searchParams);

    const db = getDB();
    const f = buildFilter(status, year);
    const { results } = await db
      .prepare(`SELECT * FROM band_inquiries ${f.sql} ORDER BY submitted_at DESC`)
      .bind(...f.binds)
      .all();
    const years = await listYears(db, 'band_inquiries');
    return NextResponse.json({ inquiries: results, year, years, current: getIntakeYear() });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching band inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
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
        `UPDATE band_inquiries SET status = COALESCE(?, status), admin_notes = COALESCE(?, admin_notes) WHERE id = ?`
      )
      .bind(status ?? null, admin_notes ?? null, id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating band inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await getDB().prepare(`DELETE FROM band_inquiries WHERE id = ?`).bind(id).run();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting band inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
