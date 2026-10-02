import React from 'react'
import SunMark from '@/components/ui/SunMark'
import TornEdge from '@/components/ui/TornEdge'

interface PageHeaderProps {
  /** Small mono label above the title */
  eyebrow?: string
  /** The page's h1. Usually a string; pass nodes to add screen-reader-only words. */
  title: React.ReactNode
  /** One or two plain sentences under the title */
  lede?: React.ReactNode
  /** Sky field with ink type (default) or ink field with cream type */
  tone?: 'sky' | 'ink'
  /** Colour of the section that follows — the torn edge is cut from it */
  edge?: string
  /** Title size. 'xl' is for short titles that can carry the whole band ("2027", "Legal"). */
  size?: 'lg' | 'xl'
  /** Buttons, stats, filters — anything that belongs under the lede */
  children?: React.ReactNode
}

/**
 * Top band for an inside page: the page's h1 on a field of sky (or ink), the
 * sun going down in the corner, and a torn edge into the page body.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  tone = 'sky',
  edge = '#FDF0DA',
  size = 'lg',
  children,
}: PageHeaderProps) {
  const dark = tone === 'ink'

  return (
    <>
      <header className={`relative isolate overflow-hidden ${dark ? 'bg-ink text-cream' : 'bg-sky text-ink'}`}>
        {/* Sun on the horizon, bottom right */}
        <SunMark className="pointer-events-none absolute -bottom-[6.25rem] -right-12 -z-10 h-52 w-52 sm:-bottom-[10.5rem] sm:-right-10 sm:h-[22rem] sm:w-[22rem] lg:-bottom-[12.5rem] lg:right-[4%] lg:h-[26rem] lg:w-[26rem]" />
        {/* Halftone haze, bottom left */}
        <div
          className={`halftone fade-to-tr pointer-events-none absolute -bottom-2 left-0 -z-10 h-56 w-[28rem] max-w-[70%] ${dark ? 'text-cream/25' : 'text-ink/25'}`}
        />

        <div className="shell pb-14 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
          {eyebrow && (
            <p className={`eyebrow mb-4 animate-rise ${dark ? 'text-sun-yellow' : 'text-ink'}`}>{eyebrow}</p>
          )}
          <h1
            className={`max-w-5xl animate-rise font-display animate-delay-100 ${size === 'xl' ? 'text-display-xl' : 'text-display-lg'}`}
          >
            {title}
          </h1>
          {lede && (
            <p
              className={`mt-5 max-w-2xl animate-rise text-xl leading-snug animate-delay-200 sm:text-2xl ${dark ? 'text-cream/85' : 'text-ink'}`}
            >
              {lede}
            </p>
          )}
          {children && <div className="mt-8 animate-rise animate-delay-300">{children}</div>}
        </div>
      </header>
      <TornEdge fill={edge} />
    </>
  )
}
