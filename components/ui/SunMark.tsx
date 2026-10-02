/**
 * The setting sun — the brand's sunset colours as a disc that breaks into
 * bands toward the horizon. It is the "O" in South O.
 *
 * Drawn as plain paths (no clip-paths or ids) so any number can sit on a page.
 */

const R = 50

const BANDS = [
  { from: 0, to: 0.4, fill: '#EFB936' },       // sun yellow
  { from: 0.44, to: 0.6, fill: '#E78B39' },    // sun orange
  { from: 0.65, to: 0.775, fill: '#D62D38' },  // sun red
  { from: 0.83, to: 0.92, fill: '#E23548' },   // sun red deep
] as const

/** Half-width of the disc at height y. */
const halfWidth = (y: number) => Math.sqrt(Math.max(0, R * R - (y - R) * (y - R)))
const n = (v: number) => Number(v.toFixed(2))

/** Slice of the disc between two heights, given as fractions of its diameter. */
function band(from: number, to: number) {
  const y1 = from * 2 * R
  const y2 = to * 2 * R
  const w1 = halfWidth(y1)
  const w2 = halfWidth(y2)
  return [
    `M${n(R - w1)} ${n(y1)}`,
    `L${n(R + w1)} ${n(y1)}`,
    `A${R} ${R} 0 0 1 ${n(R + w2)} ${n(y2)}`,
    `L${n(R - w2)} ${n(y2)}`,
    `A${R} ${R} 0 0 1 ${n(R - w1)} ${n(y1)}`,
    'Z',
  ].join(' ')
}

const PATHS = BANDS.map(({ from, to, fill }) => ({ d: band(from, to), fill }))

interface SunMarkProps {
  className?: string
  /** Set when the mark stands alone as the only label for something. */
  title?: string
}

export default function SunMark({ className = '', title }: SunMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {PATHS.map(({ d, fill }) => (
        <path key={fill} d={d} fill={fill} />
      ))}
    </svg>
  )
}
