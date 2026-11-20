// POST /api/intake/[type] — public sign-up forms: volunteers | sponsors | supporters

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getIntake } from '@/lib/intakes';
import { notifyAdmin } from '@/lib/notify';

function sanitize(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim().slice(0, 4000);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getIntake(type);
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const body = await request.json();
    const values: Record<string, string | null> = {};
    for (const f of config.fields) {
      values[f.key] = sanitize(body[f.key]);
      if (f.required && !values[f.key]) {
        return NextResponse.json({ error: `${f.label} is required` }, { status: 400 });
      }
    }

    const email = values.email ?? values.contact_email;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const cols = ['id', ...config.fields.map(f => f.key), 'submitted_at'];
    await getDB()
      .prepare(`INSERT INTO ${config.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
      .bind(id, ...config.fields.map(f => values[f.key]), new Date().toISOString())
      .run();

    await notifyAdmin({
      title: `New ${config.singular}`,
      message: values[config.titleField] ?? '',
      path: `/admin/intakes/${type}`,
      tags: [config.tag],
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error(`${type} submission error:`, error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
