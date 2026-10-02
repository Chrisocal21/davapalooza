import SunMark from '@/components/ui/SunMark'
import EventStatus from '@/components/home/EventStatus'
import { SITE } from '@/lib/site'

/**
 * Home hero: the wordmark set edge to edge on a field of sky, with the sun
 * going down behind it.
 *
 * The wordmark is an SVG so it always spans the full width of the column, at
 * any screen size, without a font-size to tune per breakpoint. Its numbers come
 * from Bebas Neue's metrics: "DAVAPALOOZA" is 4.187em wide with a 0.71em cap
 * height, so at 240 units it fills a 1000 x 176 box. The real heading text is
 * beside it for screen readers and search engines.
 */
export default function Hero({ initialNow }: { initialNow: number }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-sky text-ink">
      {/* Sun on the horizon */}
      <SunMark className="pointer-events-none absolute -bottom-36 -right-24 -z-10 h-[26rem] w-[26rem] animate-sun-rise sm:-right-16 sm:h-[32rem] sm:w-[32rem] lg:-bottom-28 lg:right-[2%] lg:h-[41rem] lg:w-[41rem]" />
      {/* Halftone haze rising from the bottom-left corner */}
      <div className="halftone fade-to-tr pointer-events-none absolute bottom-0 left-0 -z-10 h-72 w-[36rem] max-w-[80%] text-ink/25" />

      <div className="shell pb-16 pt-7 sm:pb-20 sm:pt-9 lg:pb-24 lg:pt-11">
        <div className="eyebrow flex animate-rise items-center justify-between gap-4">
          <p>{SITE.place}</p>
          <p className="hidden sm:block">Free · Est. 2024</p>
        </div>

        <h1 id="hero-title" className="mt-3 animate-rise animate-delay-100 sm:mt-4">
          <span className="sr-only">{SITE.event}</span>
          <svg
            viewBox="0 0 1000 176"
            aria-hidden="true"
            focusable="false"
            className="block h-auto w-full overflow-visible fill-ink font-display tracking-normal"
          >
            <text x="-7" y="173" fontSize="240" textLength="1007" lengthAdjust="spacingAndGlyphs">
              DAVAPALOOZA
            </text>
          </svg>
        </h1>

        <div className="mt-5 animate-rise animate-delay-200 sm:mt-7">
          <p className="font-display text-display-md">{SITE.name}</p>
          <p className="mt-2 font-mono text-[0.9375rem] tracking-wide text-ink/85 sm:text-base">
            {SITE.hashtags.join(' · ')}
          </p>
        </div>

        <div className="animate-rise animate-delay-300">
          <EventStatus initialNow={initialNow} />
        </div>
      </div>
    </section>
  )
}
