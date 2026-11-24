// Spam protection for the public forms. Two cheap layers, no CAPTCHA:
//
//  1. Honeypot — every form has a hidden field named `hp`. People never see or
//     fill it; bots that auto-fill every input do. A filled honeypot gets a fake
//     "success" so the bot moves on, and nothing is saved or sent to your phone.
//  2. Rate limit — a fixed-window counter per visitor (hashed IP) in D1, so one
//     source can't flood a form. Fails open: if the check itself errors, the
//     submission goes through rather than blocking a real person.

import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

export const HONEYPOT_FIELD = 'hp';

function readSecret(): string {
  try {
    const { env } = getCloudflareContext();
    const v = (env as unknown as Record<string, unknown>).ADMIN_SESSION_SECRET;
    if (typeof v === 'string' && v) return v;
  } catch {}
  return process.env.ADMIN_SESSION_SECRET || 'dev-salt';
}

async function visitorKey(request: Request): Promise<string> {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';
  const data = new TextEncoder().encode(`${readSecret()}|${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** True if the visitor is within the limit (and counts this request). */
export async function withinRateLimit(
  db: D1Database,
  request: Request,
  scope: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const key = `${scope}:${await visitorKey(request)}`;
    const now = Math.floor(Date.now() / 1000);
    const row = await db
      .prepare(
        `INSERT INTO rate_limits (key, count, window_start) VALUES (?1, 1, ?2)
         ON CONFLICT(key) DO UPDATE SET
           count = CASE WHEN ?2 - window_start > ?3 THEN 1 ELSE count + 1 END,
           window_start = CASE WHEN ?2 - window_start > ?3 THEN ?2 ELSE window_start END
         RETURNING count`,
      )
      .bind(key, now, windowSeconds)
      .first<{ count: number }>();
    return (row?.count ?? 1) <= max;
  } catch (error) {
    console.error('Rate limit check failed (allowing):', error);
    return true;
  }
}

/**
 * Runs both checks. Returns a response to send back immediately (honeypot →
 * fake success, rate limit → 429), or null to carry on with the real work.
 */
export async function guardSubmission(opts: {
  db: D1Database;
  request: Request;
  scope: string;
  honeypot: unknown;
  max?: number;
  windowSeconds?: number;
}): Promise<NextResponse | null> {
  if (typeof opts.honeypot === 'string' && opts.honeypot.trim() !== '') {
    return NextResponse.json({ success: true, id: crypto.randomUUID() }, { status: 201 });
  }
  const ok = await withinRateLimit(opts.db, opts.request, opts.scope, opts.max ?? 8, opts.windowSeconds ?? 3600);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many submissions from your connection — please try again in a little while.' },
      { status: 429 },
    );
  }
  return null;
}
