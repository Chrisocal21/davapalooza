// Phone notifications for ALL new sign-ups and photos are batched into one summary.
//
//   queueNotification()  — called by each form's API route; just records "something new came in"
//   sendDigest()         — called by the cron in worker.ts; sends ONE notification covering
//                          everything queued since the last one, then clears the queue
//
// Cadence: every 15 minutes on event day, once a day (9am Pacific) on every other day.
// Nothing is sent when nothing is queued, so there are no empty pings.

import type { D1Database } from '@cloudflare/workers-types';
import { notifyAdmin } from '@/lib/notify';
import { EVENTS } from '@/lib/events';

export type NotifyCategory =
  | 'band'
  | 'vendor'
  | 'volunteer'
  | 'sponsor'
  | 'supporter'
  | 'photo_good'
  | 'photo_review';

const CATEGORIES: Record<NotifyCategory, { one: string; many: string; path: string; tag: string }> = {
  band: { one: 'band inquiry', many: 'band inquiries', path: '/admin/bands', tag: 'guitar' },
  vendor: { one: 'vendor registration', many: 'vendor registrations', path: '/admin/vendors', tag: 'tent' },
  volunteer: { one: 'volunteer', many: 'volunteers', path: '/admin/intakes/volunteers', tag: 'raised_hand' },
  sponsor: { one: 'sponsor inquiry', many: 'sponsor inquiries', path: '/admin/intakes/sponsors', tag: 'moneybag' },
  supporter: { one: 'photographer/videographer', many: 'photographers/videographers', path: '/admin/intakes/supporters', tag: 'heart' },
  photo_good: { one: 'photo', many: 'photos', path: '/admin/queue/looks-good', tag: 'camera' },
  photo_review: { one: 'photo to review', many: 'photos to review', path: '/admin/queue/needs-review', tag: 'warning' },
};

/** Records that something new came in. Never throws — a form submission must not fail over this. */
export async function queueNotification(db: D1Database, category: NotifyCategory, detail?: string): Promise<void> {
  try {
    await db
      .prepare('INSERT INTO pending_notifications (id, category, detail, created_at) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), category, (detail ?? '').slice(0, 120), new Date().toISOString())
      .run();
  } catch (error) {
    console.error('Could not queue notification:', error);
  }
}

// ── schedule ────────────────────────────────────────────────────────────────

const TZ = 'America/Los_Angeles';
/** Hour (Pacific) of the once-a-day check on ordinary days. */
const DAILY_CHECK_HOUR = 9;

function pacificDay(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** True on the calendar day (Pacific) of any event in lib/events.ts. */
export function isEventDay(now: Date = new Date()): boolean {
  const today = pacificDay(now);
  return EVENTS.some(e => pacificDay(e.date) === today);
}

/**
 * The cron fires every 15 minutes, but a summary only goes out:
 *   - on event day: every run (every 15 minutes)
 *   - any other day: once, on the first run at/after 9am Pacific
 */
export function shouldRunDigest(now: Date = new Date()): boolean {
  if (isEventDay(now)) return true;
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }).format(now)) % 24;
  const minute = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, minute: 'numeric' }).format(now));
  return hour === DAILY_CHECK_HOUR && minute < 15;
}

// ── digest ──────────────────────────────────────────────────────────────────

export async function sendDigest(env: Record<string, unknown> & { DB: D1Database }): Promise<void> {
  if (!shouldRunDigest()) return;
  const db = env.DB;
  // Taken before reading, so an item that lands mid-run is never cleared unseen.
  const cutoff = new Date().toISOString();

  const { results } = await db
    .prepare('SELECT category, detail FROM pending_notifications WHERE created_at <= ? ORDER BY created_at')
    .bind(cutoff)
    .all<{ category: NotifyCategory; detail: string }>();
  const rows = (results ?? []).filter(r => CATEGORIES[r.category]);
  if (rows.length === 0) return;

  const counts = new Map<NotifyCategory, number>();
  for (const r of rows) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);

  const total = rows.length;
  const only = counts.size === 1 ? [...counts.keys()][0] : null;
  const needsReview = counts.has('photo_review');

  let title: string;
  let message: string;
  if (total === 1) {
    title = `New ${CATEGORIES[rows[0].category].one}`;
    message = rows[0].detail;
  } else {
    title = `${total} new ${only ? CATEGORIES[only].many : 'sign-ups and photos'}`;
    message = [...counts.entries()]
      .map(([cat, n]) => `${n} ${n === 1 ? CATEGORIES[cat].one : CATEGORIES[cat].many}`)
      .join(' · ');
  }

  const ok = await notifyAdmin(
    {
      title,
      message,
      path: only ? CATEGORIES[only].path : '/admin/dashboard',
      tags: [needsReview ? 'warning' : CATEGORIES[rows[0].category].tag],
    },
    env
  );
  if (!ok) return; // keep them queued; the next run tries again

  await db.prepare('DELETE FROM pending_notifications WHERE created_at <= ?').bind(cutoff).run();
}
