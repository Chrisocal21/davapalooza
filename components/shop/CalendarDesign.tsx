import { Sun } from './MerchLogo'
import { EVENTS } from '@/lib/events'

/**
 * Oceanside wall calendar (hangs open: photo page over month page, wire-bound
 * in the middle). Each month features a photo of Oceanside by a local
 * photographer, credited on the page. viewBox is 300 × 464 (11 × 17 in hung).
 *
 * The sample photo is a free Unsplash shot of the Oceanside Pier
 * (public/shop/CREDITS.md) standing in for the local photographers' work.
 */

const INK = '#272B2C'
const DISPLAY = { fontFamily: 'var(--font-display), Impact, sans-serif' }
const SANS = { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 700 }
const MONO = { fontFamily: 'var(--font-mono), monospace' }

const YEAR = 2027
const MONTH = 6 // July (0-based)
const MONTH_NAME = 'JULY'
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const PHOTO = { src: '/shop/calendar-photo.jpg', credit: 'MARK NEAL', caption: 'OCEANSIDE PIER' }

/**
 * Oceanside events known as of January 1 go in the grid. Sample entries only:
 * the July 4 holiday and the weekly Thursday Sunset Market. Davapalooza is
 * marked automatically once its year is added to lib/events.ts.
 */
const WEEKLY: Record<number, string> = { 4: 'SUNSET MKT' } // weekday → label
const DATED: Record<number, string> = { 4: 'JULY 4TH' } // day of month → label

function davapaloozaDay(): number | null {
  const e = EVENTS.find(ev => ev.year === YEAR)
  if (!e) return null
  const [y, m, d] = e.date.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }).split('-').map(Number)
  return y === YEAR && m - 1 === MONTH ? d : null
}

export default function CalendarDesign({ id }: { id: string }) {
  const first = new Date(Date.UTC(YEAR, MONTH, 1)).getUTCDay()
  const days = new Date(Date.UTC(YEAR, MONTH + 1, 0)).getUTCDate()
  const rows = Math.ceil((first + days) / 7)
  const gx = 16
  const gw = (300 - 2 * gx) / 7
  const gy = 304
  const rh = 128 / rows
  const dava = davapaloozaDay()

  return (
    <svg viewBox="0 0 300 464" className="block h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-shade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* ── photo page: the month's photo, full bleed. The title lives on the cover only. ── */}
      <rect width="300" height="232" fill="#DDD" />
      <image href={PHOTO.src} x="0" y="0" width="300" height="232" preserveAspectRatio="xMidYMid slice" />
      <rect y="196" width="300" height="36" fill={`url(#${id}-shade)`} />
      <text x="284" y="218" textAnchor="end" fontSize="6.5" fill="#FDF0DA" style={MONO}>
        {PHOTO.caption} · PHOTO: {PHOTO.credit}
      </text>
      <circle cx="150" cy="8" r="3.4" fill="#9C9C9C" />

      {/* ── month page ── */}
      <rect y="232" width="300" height="232" fill="#FBF6EC" />
      <text x={gx} y="274" fontSize="36" fill={INK} style={DISPLAY}>
        {MONTH_NAME}
      </text>
      <text x={300 - gx} y="274" textAnchor="end" fontSize="36" fill="#B3212C" style={DISPLAY}>
        {YEAR}
      </text>
      <line x1={gx} x2={300 - gx} y1="282" y2="282" stroke={INK} strokeWidth="1.6" />
      {DAYS.map((d, i) => (
        <text key={d} x={gx + gw * (i + 0.5)} y="297" textAnchor="middle" fontSize="7" fill={i === 0 ? '#B3212C' : INK} style={MONO}>
          {d}
        </text>
      ))}
      <g stroke={INK} strokeOpacity="0.25" strokeWidth="0.7">
        {Array.from({ length: rows + 1 }, (_, r) => (
          <line key={`h${r}`} x1={gx} x2={300 - gx} y1={gy + r * rh} y2={gy + r * rh} />
        ))}
        {Array.from({ length: 8 }, (_, c) => (
          <line key={`v${c}`} x1={gx + c * gw} x2={gx + c * gw} y1={gy} y2={gy + rows * rh} />
        ))}
      </g>
      {Array.from({ length: days }, (_, i) => {
        const day = i + 1
        const slot = first + i
        const col = slot % 7
        const row = Math.floor(slot / 7)
        const x = gx + col * gw
        const y = gy + row * rh
        const isDava = day === dava
        const labels = [DATED[day], WEEKLY[col]].filter(Boolean) as string[]
        return (
          <g key={i}>
            {isDava && <rect x={x} y={y} width={gw} height={rh} fill="#EFB936" />}
            <text x={x + 3.5} y={y + 10} fontSize="8.5" fill={col === 0 ? '#B3212C' : INK} style={SANS}>
              {day}
            </text>
            {isDava && (
              <>
                <Sun cx={x + gw - 8} cy={y + 8} r={5} />
                <text x={x + 3} y={y + rh - 4} fontSize="5" fill={INK} style={SANS}>
                  DAVAPALOOZA
                </text>
              </>
            )}
            {!isDava &&
              labels.map((l, j) => (
                <text key={l} x={x + 3} y={y + rh - 4 - (labels.length - 1 - j) * 6} fontSize="4.4" fill="#14708F" style={MONO}>
                  {l}
                </text>
              ))}
          </g>
        )
      })}
      <Sun cx={22} cy={449} r={5} />
      <text x="32" y="452" fontSize="6.5" fill={INK} opacity="0.75" style={MONO}>
        SOUTH O BLOCK PARTY · DAVAPALOOZA
      </text>

      {/* wire binding between the pages */}
      <rect y="229" width="300" height="6" fill="#000" opacity="0.08" />
      {Array.from({ length: 34 }, (_, i) => (
        <rect key={i} x={12 + i * 8.2} y="226" width="3.6" height="12" rx="1.8" fill="#3A3F42" />
      ))}
      <rect width="300" height="464" fill="none" stroke="#000" strokeOpacity="0.12" />
    </svg>
  )
}
