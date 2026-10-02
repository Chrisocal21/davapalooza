'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import SectionHeader from '@/components/ui/SectionHeader'
import { getFeaturedYear } from '@/lib/events'
import { bySetTime } from '@/lib/format'

interface Artist {
  id: string
  name: string
  genre: string | null
  set_time: string | null
  sort_order: number
  year: number
}

/** How many acts the home page lists before sending people to the full lineup. */
const MAX_ROWS = 8

/**
 * The lineup, set the way the flyer sets it: a numbered running order in big type.
 * Shows the next event's lineup, or the most recent one once that event has passed.
 */
export default function LineupTeaser({ initialNow }: { initialNow: number }) {
  const year = getFeaturedYear(new Date(initialNow))
  // null while loading
  const [artists, setArtists] = useState<Artist[] | null>(null)

  useEffect(() => {
    if (year === null) {
      setArtists([])
      return
    }
    fetch(`/api/artists?year=${year}`)
      .then(r => r.json())
      .then(data => setArtists(((data.artists || []) as Artist[]).sort(bySetTime).slice(0, MAX_ROWS)))
      .catch(() => setArtists([]))
  }, [year])

  return (
    <section aria-labelledby="lineup-title" className="relative isolate overflow-hidden bg-ink py-20 text-cream sm:py-24 lg:py-28">
      <div className="halftone-lg fade-to-bl pointer-events-none absolute right-0 top-0 -z-10 h-80 w-[34rem] max-w-[75%] text-cream/10" />

      <div className="shell">
        <SectionHeader
          id="lineup-title"
          align="left"
          size="lg"
          tone="cream"
          eyebrow={year ? `Davapalooza ${year}` : undefined}
          title="The Lineup"
          subtitle="Artists bringing the heat"
          action={
            <Button href="/artists" variant="secondary" onDark>
              See All Artists
              <Icon name="arrow-right" size={18} className="-mt-0.5" />
            </Button>
          }
        />

        <div className="mt-10 sm:mt-12">
          {artists === null ? (
            <div aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-t border-cream/15 py-5">
                  <div className="skeleton-dark h-10 rounded sm:h-12" style={{ width: `${55 - i * 7}%` }} />
                </div>
              ))}
            </div>
          ) : artists.length === 0 ? (
            <p className="border-y border-cream/15 py-12 text-center font-display text-display-sm text-cream/80">
              Artist lineup coming soon!
            </p>
          ) : (
            <ol className="border-b border-cream/15">
              {artists.map((artist, i) => (
                <li
                  key={artist.id}
                  className="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 border-t border-cream/15 py-4 transition-colors hover:border-cream/40 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-6 sm:py-5"
                >
                  <span className="font-mono text-xs tracking-wider text-cream/60 sm:text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[2.5rem] leading-[0.92] tracking-wide text-cream transition-colors group-hover:text-sun-yellow sm:text-6xl lg:text-7xl">
                    {artist.name}
                  </span>
                  <span className="eyebrow col-start-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1.5 sm:col-start-3 sm:justify-end sm:pt-0 sm:text-right">
                    {artist.genre && <span className="text-cream/60">{artist.genre}</span>}
                    {artist.set_time && <span className="text-sun-yellow">{artist.set_time}</span>}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
