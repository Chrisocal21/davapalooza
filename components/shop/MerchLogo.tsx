/**
 * Merch logo — the setting sun from the site mark, built two ways:
 *   • StackedLogo: sun over the DAVAPALOOZA wordmark (tees, hoodies)
 *   • BadgeLogo:   round badge with the name on the ring (hat, stickers, tote)
 *
 * Both return SVG <g> groups so they can be printed onto a product mockup and
 * pick up its folds and shading. Text uses the site's display/sans fonts and
 * `textLength`, so the lockup keeps its proportions whatever the font metrics.
 */

const BANDS = [
  { from: 0, to: 0.4, fill: '#EFB936' },
  { from: 0.44, to: 0.6, fill: '#E78B39' },
  { from: 0.65, to: 0.775, fill: '#D62D38' },
  { from: 0.83, to: 0.92, fill: '#E23548' },
] as const

const n = (v: number) => Number(v.toFixed(2))
const DISPLAY = { fontFamily: 'var(--font-display), "Bebas Neue", Impact, sans-serif' }
const SANS = { fontFamily: 'var(--font-sans), "League Spartan", system-ui, sans-serif', fontWeight: 700 }

/** The banded sun, centred on (cx, cy) with radius r. Visible height is 1.84r. */
export function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const hw = (y: number) => Math.sqrt(Math.max(0, r * r - (y - r) * (y - r)))
  const x0 = cx - r
  const y0 = cy - r
  return (
    <g>
      {BANDS.map(({ from, to, fill }) => {
        const y1 = from * 2 * r
        const y2 = to * 2 * r
        const w1 = hw(y1)
        const w2 = hw(y2)
        const d = [
          `M${n(x0 + r - w1)} ${n(y0 + y1)}`,
          `L${n(x0 + r + w1)} ${n(y0 + y1)}`,
          `A${r} ${r} 0 0 1 ${n(x0 + r + w2)} ${n(y0 + y2)}`,
          `L${n(x0 + r - w2)} ${n(y0 + y2)}`,
          `A${r} ${r} 0 0 1 ${n(x0 + r - w1)} ${n(y0 + y1)}`,
          'Z',
        ].join(' ')
        return <path key={fill} d={d} fill={fill} />
      })}
    </g>
  )
}

/** Sun over the wordmark. (x, y) is the top-left; height is about 0.68 × w. */
export function StackedLogo({
  x,
  y,
  w,
  ink = '#272B2C',
  accent = '#B3212C',
}: {
  x: number
  y: number
  w: number
  ink?: string
  accent?: string
}) {
  const r = w * 0.2
  const cx = x + w / 2
  const title = y + w * 0.57
  return (
    <g>
      <Sun cx={cx} cy={y + r} r={r} />
      <text
        x={cx}
        y={title}
        textAnchor="middle"
        fontSize={w * 0.22}
        textLength={w}
        lengthAdjust="spacingAndGlyphs"
        fill={ink}
        style={DISPLAY}
      >
        DAVAPALOOZA
      </text>
      <text
        x={cx}
        y={title + w * 0.1}
        textAnchor="middle"
        fontSize={w * 0.062}
        textLength={w * 0.84}
        lengthAdjust="spacingAndGlyphs"
        fill={accent}
        style={SANS}
      >
        SOUTH O BLOCK PARTY
      </text>
    </g>
  )
}

/** Round badge: name on the ring, sun in the middle. `id` must be unique per page. */
export function BadgeLogo({
  id,
  cx,
  cy,
  R,
  ink = '#272B2C',
  fill = 'none',
  accent = '#B3212C',
}: {
  id: string
  cx: number
  cy: number
  R: number
  ink?: string
  fill?: string
  accent?: string
}) {
  const rt = R * 0.74 // top text baseline (glyphs grow outward)
  const rb = R * 0.89 // bottom text baseline (glyphs grow inward)
  return (
    <g>
      <defs>
        <path id={`${id}-top`} d={`M${cx - rt} ${cy} A${rt} ${rt} 0 0 1 ${cx + rt} ${cy}`} />
        <path id={`${id}-bot`} d={`M${cx - rb} ${cy} A${rb} ${rb} 0 0 0 ${cx + rb} ${cy}`} />
      </defs>
      <circle cx={cx} cy={cy} r={R} fill={fill} stroke={ink} strokeWidth={R * 0.055} />
      <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke={ink} strokeWidth={R * 0.03} />
      <text fontSize={R * 0.2} fill={ink} style={DISPLAY} letterSpacing={R * 0.02}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          DAVAPALOOZA
        </textPath>
      </text>
      <text fontSize={R * 0.12} fill={accent} style={SANS} letterSpacing={R * 0.02}>
        <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">
          SOUTH O BLOCK PARTY
        </textPath>
      </text>
      <circle cx={cx - R * 0.81} cy={cy} r={R * 0.035} fill={ink} />
      <circle cx={cx + R * 0.81} cy={cy} r={R * 0.035} fill={ink} />
      <Sun cx={cx} cy={cy - R * 0.02} r={R * 0.4} />
    </g>
  )
}
