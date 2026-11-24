// GET /api/admin/store-emails — the store waitlist (admin)
// DELETE /api/admin/store-emails — remove one address

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, storeEmailQueries } from '@/lib/db';

export async function GET() {
  try {
    await requireAuth();
    const emails = await storeEmailQueries.getAll(getDB());
    return NextResponse.json({ emails });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error fetching store emails:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await storeEmailQueries.remove(getDB(), id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error deleting store email:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
