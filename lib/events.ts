/**
 * Event configuration — update this file each year.
 *
 * To add a new year:
 *   1. Add an entry to EVENTS below.
 *   2. Drop the flyer into /public/flyers/ matching the flyerJpg / flyerPdf paths.
 *   3. Add artists via the admin dashboard for that year.
 *
 * Everything else on the site (home page countdown, lineup page, past events,
 * "coming soon" banners) updates automatically based on the dates here.
 */

export interface EventConfig {
  year: number
  /**
   * Doors — full date and time, WITH the Pacific offset (-07:00 in summer).
   * The offset matters: without it the server (UTC) and a visitor's browser
   * each read the time in their own zone and disagree about when it starts.
   */
  date: Date
  location: string
  address: string
  doors: string
  bandsStart: string
  flyerJpg: string | null
  flyerPdf: string | null
}

export const EVENTS: EventConfig[] = [
  {
    year: 2026,
    date: new Date('2026-07-25T12:00:00-07:00'),
    location: 'Griffin St, Oceanside, CA',
    address: 'Griffin Street, South Oceanside, CA',
    doors: '12 Noon',
    bandsStart: '1pm',
    flyerJpg: '/flyers/DAVAPALOOZA26.jpg',
    flyerPdf: '/flyers/DAVAPALOOZA26.pdf',
  },
  // ── Add 2027 here when ready ──
  // {
  //   year: 2027,
  //   date: new Date('2027-07-XXT12:00:00-07:00'),
  //   location: 'Griffin St, Oceanside, CA',
  //   address: 'Griffin Street, South Oceanside, CA',
  //   doors: '12 Noon',
  //   bandsStart: '1pm',
  //   flyerJpg: '/flyers/DAVAPALOOZA27.jpg',
  //   flyerPdf: '/flyers/DAVAPALOOZA27.pdf',
  // },
]

/** Dates are shown in the event's own time zone, wherever the visitor is. */
const EVENT_TIME_ZONE = 'America/Los_Angeles'

/**
 * How long after doors the event still counts as happening. Doors are at noon
 * and music runs through the evening, so the site treats the whole day as "on"
 * instead of filing the party under past events the minute it starts.
 */
const EVENT_HOURS = 12

export type EventPhase = 'upcoming' | 'live' | 'past'

/** Where an event sits relative to `now`: still to come, on right now, or over. */
export function getEventPhase(event: EventConfig, now: Date = new Date()): EventPhase {
  const start = event.date.getTime()
  const t = now.getTime()
  if (t < start) return 'upcoming'
  if (t < start + EVENT_HOURS * 60 * 60 * 1000) return 'live'
  return 'past'
}

/** The next event — still to come or happening now — or null once every event is over */
export function getUpcomingEvent(now: Date = new Date()): EventConfig | null {
  return (
    EVENTS.filter(e => getEventPhase(e, now) !== 'past').sort((a, b) => a.year - b.year)[0] ?? null
  )
}

/** All events that have already happened, most recent first */
export function getPastEvents(now: Date = new Date()): EventConfig[] {
  return EVENTS.filter(e => getEventPhase(e, now) === 'past').sort((a, b) => b.year - a.year)
}

/** The highest year in EVENTS + 1 — used for "next year coming soon" banner */
export function getNextPlannedYear(): number {
  if (EVENTS.length === 0) return new Date().getFullYear() + 1
  return Math.max(...EVENTS.map(e => e.year)) + 1
}

/** The year the site should be showing a lineup for: the next event, else the latest one */
export function getFeaturedYear(now: Date = new Date()): number | null {
  return getUpcomingEvent(now)?.year ?? getPastEvents(now)[0]?.year ?? null
}

function dateParts(event: EventConfig, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: EVENT_TIME_ZONE, ...options }).formatToParts(event.date)
  return Object.fromEntries(parts.map(p => [p.type, p.value])) as Record<string, string>
}

function ordinal(day: number): string {
  const tens = day % 100
  if (tens >= 11 && tens <= 13) return `${day}th`
  return `${day}${['th', 'st', 'nd', 'rd'][day % 10] ?? 'th'}`
}

/** "Saturday, July 25th, 2026" */
export function formatEventDate(event: EventConfig): string {
  const p = dateParts(event, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  return `${p.weekday}, ${p.month} ${ordinal(Number(p.day))}, ${p.year}`
}

/** "July 25, 2026" */
export function formatEventDateShort(event: EventConfig): string {
  const p = dateParts(event, { month: 'long', day: 'numeric', year: 'numeric' })
  return `${p.month} ${p.day}, ${p.year}`
}

/** The date in pieces, for layouts that set them separately: Saturday / Jul / 25 / 2026 */
export function getEventDateParts(event: EventConfig): { weekday: string; month: string; day: string; year: string } {
  const p = dateParts(event, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  return { weekday: p.weekday, month: p.month, day: p.day, year: p.year }
}
