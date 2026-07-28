/**
 * Event configuration — update this file each year.
 *
 * To add a new year:
 *   1. Add an entry to EVENTS below.
 *   2. Drop the flyer into /public/flyers/ matching the flyerJpg / flyerPdf paths.
 *   3. Add artists via the admin dashboard for that year.
 *
 * Everything else on the site (lineup page, past events, "coming soon" banners)
 * updates automatically based on the dates here.
 */

export interface EventConfig {
  year: number
  /** Full event date/time — used to determine upcoming vs. past */
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
    date: new Date('2026-07-25T12:00:00'),
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
  //   date: new Date('2027-07-XX T12:00:00'),
  //   location: 'Griffin St, Oceanside, CA',
  //   address: 'Griffin Street, South Oceanside, CA',
  //   doors: '12 Noon',
  //   bandsStart: '1pm',
  //   flyerJpg: '/flyers/DAVAPALOOZA27.jpg',
  //   flyerPdf: '/flyers/DAVAPALOOZA27.pdf',
  // },
]

/** The next upcoming event, or null if all events have passed */
export function getUpcomingEvent(): EventConfig | null {
  const now = new Date()
  return (
    EVENTS.filter(e => e.date > now).sort((a, b) => a.year - b.year)[0] ?? null
  )
}

/** All events that have already happened, most recent first */
export function getPastEvents(): EventConfig[] {
  const now = new Date()
  return EVENTS.filter(e => e.date <= now).sort((a, b) => b.year - a.year)
}

/** The highest year in EVENTS + 1 — used for "next year coming soon" banner */
export function getNextPlannedYear(): number {
  if (EVENTS.length === 0) return new Date().getFullYear() + 1
  return Math.max(...EVENTS.map(e => e.year)) + 1
}
