// POST /api/unsubscribe?t=<token> — remove an address from the store waitlist.
// Called by the Unsubscribe button on /unsubscribe and by mail apps' one-click unsubscribe.

import { NextRequest, NextResponse } from 'next/server';
import { getDB, storeEmailQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let token = request.nextUrl.searchParams.get('t') || '';
    if (!token) {
      const body = await request.json().catch(() => ({}));
      token = typeof body.t === 'string' ? body.t : '';
    }
    // Always answer success so the endpoint can't be used to probe tokens.
    await storeEmailQueries.removeByToken(getDB(), token);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
