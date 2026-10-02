import SunMark from '@/components/ui/SunMark'

interface LogoProps {
  /** Ink for light fields (sky, cream), cream for the ink field. */
  tone?: 'ink' | 'cream'
  size?: 'md' | 'lg'
  className?: string
}

const SIZES = {
  md: { mark: 'h-9 w-9', name: 'text-[1.7rem]', sub: 'text-[0.6rem] tracking-[0.19em]' },
  lg: { mark: 'h-14 w-14', name: 'text-[2.6rem]', sub: 'text-[0.72rem] tracking-[0.22em]' },
} as const

/**
 * Site logo: sun mark + wordmark.
 * Single reference point — do not recreate logo markup elsewhere.
 * It is drawn inline, so there is no image file to load (or to go missing).
 */
export default function Logo({ tone = 'ink', size = 'md', className = '' }: LogoProps) {
  const s = SIZES[size]
  return (
    <span className={`inline-flex items-center gap-2.5 ${tone === 'cream' ? 'text-cream' : 'text-ink'} ${className}`}>
      <SunMark className={`${s.mark} shrink-0`} />
      <span className="flex flex-col leading-none">
        <span className={`font-display ${s.name} leading-[0.85] tracking-wide`}>Davapalooza</span>
        <span className={`font-sans font-bold uppercase ${s.sub} mt-1`}>South O Block Party</span>
      </span>
    </span>
  )
}
