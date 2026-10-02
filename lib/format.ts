/** Small formatting helpers shared by the public pages. */

/** Convert "1:00 PM", "3pm", "12 Noon" -> minutes since midnight for sorting. Unknown times sort last. */
export function parseSetTime(t: string | null | undefined): number {
  if (!t) return 9999
  const s = t.trim().toLowerCase().replace('noon', '12:00 pm').replace('midnight', '12:00 am')
  const match = s.match(/(\d+)(?::(\d+))?\s*(am|pm)?/)
  if (!match) return 9999
  let h = parseInt(match[1])
  const min = parseInt(match[2] || '0')
  const ampm = match[3]
  if (ampm === 'pm' && h !== 12) h += 12
  if (ampm === 'am' && h === 12) h = 0
  return h * 60 + min
}

/** Running order: by set time, then by the order set in the admin. */
export function bySetTime<T extends { set_time: string | null; sort_order?: number }>(a: T, b: T): number {
  return parseSetTime(a.set_time) - parseSetTime(b.set_time) || (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

/**
 * "July 27, 2026". Always in Pacific time, so a post reads the same date on the
 * server, in the list, and for a visitor in another time zone.
 */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  })
}

/** First `len` characters of a post body, cut on a word and finished with an ellipsis. */
export function excerpt(body: string, len = 120): string {
  const flat = body.replace(/\s+/g, ' ').trim()
  if (flat.length <= len) return flat
  const cut = flat.slice(0, len)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > len * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** True when a stored file key points at a PDF rather than an image. */
export function isPdf(key: string | null | undefined): boolean {
  return !!key && key.toLowerCase().endsWith('.pdf')
}
