'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge'
import Icon, { type IconName } from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import { EVENTS } from '@/lib/events'
import { bySetTime } from '@/lib/format'

interface Artist {
  id: string
  name: string
  genre: string | null
  bio: string | null
  set_time: string | null
  instagram: string | null
  tiktok: string | null
  spotify: string | null
  website: string | null
  photoUrl: string | null
  year: number
}

function SocialLink({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/70 transition-colors hover:border-sun-yellow hover:bg-sun-yellow hover:text-ink focus-visible:outline-sun-yellow"
    >
      <Icon name={icon} size={15} />
    </a>
  )
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const hasSocials = artist.instagram || artist.tiktok || artist.spotify || artist.website
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border-2 border-ink bg-ink shadow-print transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#D62D38]">
      {/* Photo area */}
      <div className="relative aspect-square overflow-hidden">
        {artist.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artist.photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
        ) : (
          // No photo: the act's running-order number, set like a gig poster
          <div className="halftone flex h-full w-full items-center justify-center bg-ink-soft text-cream/10">
            <span className="select-none font-display text-[7rem] leading-none text-cream/15">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

        {/* Name + genre overlaid at bottom of photo */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-[2rem] leading-[0.95] tracking-wide text-cream">{artist.name}</h3>
          {artist.genre && <p className="eyebrow mt-1.5 text-sun-yellow">{artist.genre}</p>}
        </div>

        {/* Set time badge */}
        {artist.set_time && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-sm bg-sun-yellow px-2 pb-1 pt-1.5 font-mono text-xs font-bold leading-none text-ink">
            <Icon name="clock" size={12} />
            {artist.set_time}
          </div>
        )}
      </div>

      {/* Bio */}
      {artist.bio && (
        <p className="line-clamp-3 px-4 pt-3 text-[0.95rem] leading-snug text-cream/75">{artist.bio}</p>
      )}

      {/* Social links */}
      {hasSocials && (
        <div className="mt-auto flex gap-2 px-4 pb-4 pt-4">
          {artist.instagram && (
            <SocialLink href={`https://instagram.com/${artist.instagram}`} icon="instagram" label={`${artist.name} on Instagram`} />
          )}
          {artist.tiktok && (
            <SocialLink href={`https://tiktok.com/@${artist.tiktok}`} icon="tiktok" label={`${artist.name} on TikTok`} />
          )}
          {artist.spotify && <SocialLink href={artist.spotify} icon="spotify" label={`${artist.name} on Spotify`} />}
          {artist.website && <SocialLink href={artist.website} icon="link" label={`${artist.name} website`} />}
        </div>
      )}
      {!hasSocials && artist.bio && <div className="pb-4" />}
    </article>
  )
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  useEffect(() => {
    fetch('/api/artists')
      .then(r => r.json())
      .then(data => { setArtists(data.artists || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const years = [...new Set(artists.map(a => a.year))].sort((a, b) => b - a)
  const filtered = selectedYear === 'all' ? artists : artists.filter(a => a.year === selectedYear)
  const byYear = filtered.reduce<Record<number, Artist[]>>((acc, a) => {
    (acc[a.year] ??= []).push(a)
    return acc
  }, {})
  const displayYears = Object.keys(byYear).map(Number).sort((a, b) => b - a)
  const eventsByYear = Object.fromEntries(EVENTS.map(e => [e.year, e]))

  const tabCls = (active: boolean) =>
    `whitespace-nowrap rounded-full border-2 px-4 pb-1.5 pt-2 font-mono text-sm font-bold leading-none transition-colors ${
      active
        ? 'border-ink bg-ink text-cream'
        : 'border-ink/25 bg-transparent text-ink hover:border-ink'
    }`

  return (
    <>
      {/* Hero */}
      <PageHeader
        size="xl"
        tone="ink"
        eyebrow="Oceanside, CA · Est. 2024"
        title="The Legends"
        lede="Every act that's ever graced the Davapalooza stage"
      >
        {!loading && artists.length > 0 && (
          // Term first in the markup (as a definition list needs), number first on screen.
          <dl className="flex gap-10">
            <div className="flex flex-col-reverse">
              <dt className="eyebrow mt-1 text-cream/60">Acts</dt>
              <dd className="font-display text-6xl leading-none text-sun-yellow">{artists.length}</dd>
            </div>
            <div className="flex flex-col-reverse border-l border-cream/15 pl-10">
              <dt className="eyebrow mt-1 text-cream/60">{years.length === 1 ? 'Year' : 'Years'}</dt>
              <dd className="font-display text-6xl leading-none text-sun-yellow">{years.length}</dd>
            </div>
          </dl>
        )}
      </PageHeader>

      {/* Content */}
      <div className="bg-cream py-14 sm:py-20">
        <div className="shell">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="skeleton aspect-[4/5] rounded-md" />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="rounded-md border-2 border-dashed border-ink/30 px-6 py-20 text-center">
              <p className="font-display text-display-md text-ink">Lineup coming soon</p>
              <p className="eyebrow mt-3 text-muted">Stay tuned for artist announcements.</p>
            </div>
          ) : (
            <>
              {/* Year filter tabs */}
              {years.length > 1 && (
                <div className="mb-12 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by year">
                  <button type="button" aria-pressed={selectedYear === 'all'} onClick={() => setSelectedYear('all')} className={tabCls(selectedYear === 'all')}>
                    All Years
                  </button>
                  {years.map(y => (
                    <button type="button" key={y} aria-pressed={selectedYear === y} onClick={() => setSelectedYear(y)} className={tabCls(selectedYear === y)}>
                      {y}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-20">
                {displayYears.map((year, yi) => {
                  const ev = eventsByYear[year]
                  const sorted = [...byYear[year]].sort(bySetTime)
                  return (
                    <section key={year} aria-labelledby={`year-${year}`}>
                      {/* Year section header */}
                      <div className="mb-8 border-t-2 border-ink pt-5">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <h2 id={`year-${year}`} className="font-display text-display-md text-ink">
                            Davapalooza {year}
                          </h2>
                          {yi === 0 && <Badge variant="approved">Most Recent</Badge>}
                        </div>
                        <p className="eyebrow mt-2 flex flex-wrap gap-x-3 gap-y-1 text-muted">
                          {ev && (
                            <>
                              <span>{ev.location}</span>
                              <span aria-hidden="true">·</span>
                              <span>Doors {ev.doors}</span>
                              <span aria-hidden="true">·</span>
                              <span>Bands start {ev.bandsStart}</span>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span>{sorted.length} {sorted.length === 1 ? 'act' : 'acts'}</span>
                        </p>
                      </div>

                      {/* Artist grid */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sorted.map((artist, i) => (
                          <ArtistCard key={artist.id} artist={artist} index={i} />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
