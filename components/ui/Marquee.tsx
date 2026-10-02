interface MarqueeProps {
  items: readonly string[]
  /** Ink band with cream type (default) or yellow band with ink type */
  tone?: 'ink' | 'yellow'
  className?: string
}

const TONES = {
  ink: 'bg-ink text-cream border-ink',
  yellow: 'bg-sun-yellow text-ink border-ink',
} as const

// The list is repeated so one run is wider than any screen; the track holds two
// runs and slides exactly one run's width, which makes the loop seamless.
// (Item styles are in globals.css under "Marquee".)
const REPEAT = 6

/**
 * Scrolling ticker band. Pure CSS; it stands still for anyone who has asked
 * for reduced motion. Screen readers get the list once, not on a loop.
 */
export default function Marquee({ items, tone = 'ink', className = '' }: MarqueeProps) {
  const run = Array.from({ length: REPEAT }, () => items).flat()

  return (
    <div className={`overflow-hidden border-y-2 ${TONES[tone]} ${className}`}>
      <p className="sr-only">{items.join('. ')}.</p>
      <div className="flex w-max animate-marquee pause-on-hover" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-run">
            {run.map((item, i) => (
              <li key={i} className="marquee-item">
                <span>{item}</span>
                <span className="sun-dot" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
