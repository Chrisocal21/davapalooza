// GET /api/admin/intakes/[type]?status= — list submissions (admin)
// PATCH /api/admin/intakes/[type] — update status / admin notes

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { getIntake } from '@/lib/intakes';

type Ctx = { params: Promise<{ type: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  const config = getIntake((await params).type);
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    await requireAuth();
    const status = new URL(request.url).searchParams.get('status');
    const db = getDB();
    const stmt = status
      ? db.prepare(`SELECT * FROM ${config.table} WHERE status = ? ORDER BY submitted_at DESC`).bind(status)
      : db.prepare(`SELECT * FROM ${config.table} ORDER BY submitted_at DESC`);
    const { results } = await stmt.all();
    return NextResponse.json({ items: results });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error fetching intakes:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const config = getIntake((await params).type);
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    await requireAuth();
    const { id, status, admin_notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    if (status && !config.statuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await getDB()
      .prepare(`UPDATE ${config.table} SET status = COALESCE(?, status), admin_notes = COALESCE(?, admin_notes) WHERE id = ?`)
      .bind(status ?? null, admin_notes ?? null, id)
      .run();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error updating intake:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const config = getIntake((await params).type);
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    await requireAuth();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await getDB().prepare(`DELETE FROM ${config.table} WHERE id = ?`).bind(id).run();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error deleting intake:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
