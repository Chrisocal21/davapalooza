// Shared helpers for the per-year archive of sign-ups (bands, vendors, volunteers…).
//
// Every sign-up row has an `event_year`. New sign-ups are stamped with the
// "intake year" (see getIntakeYear in lib/events.ts), and the admin pages show
// that year by default — so when a year ends, last year's entries drop into the
// archive on their own and the lists start fresh for the next event.

import type { D1Database } from '@cloudflare/workers-types';
import { getIntakeYear } from '@/lib/events';

/**
 * Reads ?year= from an admin list request:
 *   (absent)  → the current intake year
 *   "all"     → null, meaning every year
 *   "2026"    → that year
 */
export function resolveYear(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get('year');
  if (raw === 'all') return null;
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isInteger(n) && n > 1900 && n < 3000 ? n : getIntakeYear();
}

/** Every year that has entries in `table`, plus the current intake year, newest first. */
export async function listYears(db: D1Database, table: string): Promise<number[]> {
  const { results } = await db
    .prepare(`SELECT DISTINCT event_year AS y FROM ${table} WHERE event_year IS NOT NULL`)
    .all<{ y: number }>();
  const years = new Set<number>((results ?? []).map(r => r.y));
  years.add(getIntakeYear());
  return Array.from(years).sort((a, b) => b - a);
}

/** Builds the `WHERE` clause + bindings for the optional status and year filters. */
export function buildFilter(status: string | null, year: number | null) {
  const where: string[] = [];
  const binds: (string | number)[] = [];
  if (status) {
    where.push('status = ?');
    binds.push(status);
  }
  if (year !== null) {
    where.push('event_year = ?');
    binds.push(year);
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', binds };
}
