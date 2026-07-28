'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge'
import { EVENTS } from '@/lib/events'

/** Convert "1:00 PM", "3pm", "12 Noon" -> minutes since midnight for sorting */
function parseTime(t: string | null): number {
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

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const hasSocials = artist.instagram || artist.tiktok || artist.spotify || artist.website
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-ink border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
      {/* Photo area */}
      <div className="relative aspect-square overflow-hidden">
        {artist.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artist.photoUrl}
            alt={artist.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface/5 to-ink">
            <span className="font-display text-[5rem] text-white/10 select-none leading-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        {/* Name + genre overlaid at bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-3xl font-display text-white leading-none drop-shadow-lg">{artist.name}</h3>
          {artist.genre && (
            <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mt-1">{artist.genre}</p>
          )}
        </div>

        {/* Set time badge */}
        {artist.set_time && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <svg className="w-3 h-3 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
            </svg>
            <span className="text-xs font-mono text-white font-semibold">{artist.set_time}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {artist.bio && (
        <div className="px-4 pt-3 pb-0">
          <p className="text-muted text-xs leading-relaxed line-clamp-2">{artist.bio}</p>
        </div>
      )}

      {/* Social links */}
      {hasSocials && (
        <div className={`px-4 py-3 flex gap-4 border-t border-white/5 ${artist.bio ? 'mt-3' : 'mt-0'}`}>
          {artist.instagram && (
            <a href={`https://instagram.com/${artist.instagram}`} target="_blank" rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors" title="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          )}
          {artist.tiktok && (
            <a href={`https://tiktok.com/@${artist.tiktok}`} target="_blank" rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors" title="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z" />
              </svg>
            </a>
          )}
          {artist.spotify && (
            <a href={artist.spotify} target="_blank" rel="noopener noreferrer"
              className="text-muted hover:text-success transition-colors" title="Spotify">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          )}
          {artist.website && (
            <a href={artist.website} target="_blank" rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors" title="Website">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
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
    `px-4 py-2 rounded-full text-sm font-mono font-semibold whitespace-nowrap transition-all border ${
      active
        ? 'bg-primary border-primary text-white'
        : 'bg-transparent border-border text-muted hover:border-primary/60 hover:text-text'
    }`

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-ink py-20 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,1) 39px, rgba(255,255,255,1) 40px)' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-primary font-mono text-xs tracking-[0.35em] uppercase mb-4">
            Oceanside, CA &nbsp;&middot;&nbsp; Est. 2024
          </p>
          <h1 className="text-7xl md:text-[9rem] font-display text-white leading-none tracking-wide mb-4">
            THE LEGENDS
          </h1>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-muted font-sans text-lg max-w-lg mx-auto">
            Every act that&apos;s ever graced the Davapalooza stage
          </p>
          {!loading && artists.length > 0 && (
            <div className="mt-10 flex justify-center gap-12">
              <div>
                <p className="text-5xl font-display text-secondary">{artists.length}</p>
                <p className="text-xs font-mono text-muted/70 tracking-widest uppercase mt-1">Acts</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-5xl font-display text-secondary">{years.length}</p>
                <p className="text-xs font-mono text-muted/70 tracking-widest uppercase mt-1">
                  {years.length === 1 ? 'Year' : 'Years'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-surface animate-pulse" />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl font-display text-muted tracking-widest">LINEUP COMING SOON</p>
              <p className="text-muted/60 text-sm font-mono mt-3">Stay tuned for artist announcements.</p>
            </div>
          ) : (
            <>
              {/* Year filter tabs */}
              {years.length > 1 && (
                <div className="flex gap-2 mb-12 overflow-x-auto pb-1">
                  <button onClick={() => setSelectedYear('all')} className={tabCls(selectedYear === 'all')}>
                    All Years
                  </button>
                  {years.map(y => (
                    <button key={y} onClick={() => setSelectedYear(y)} className={tabCls(selectedYear === y)}>
                      {y}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-20">
                {displayYears.map((year, yi) => {
                  const ev = eventsByYear[year]
                  const sorted = [...byYear[year]].sort((a, b) => parseTime(a.set_time) - parseTime(b.set_time))
                  return (
                    <section key={year}>
                      {/* Year section header */}
                      <div className="border-l-4 border-primary pl-5 mb-8">
                        <div className="flex items-center gap-4 mb-1">
                          <h2 className="text-5xl font-display text-ink leading-none">DAVAPALOOZA {year}</h2>
                          {yi === 0 && <Badge variant="approved">Most Recent</Badge>}
                        </div>
                        {ev && (
                          <p className="text-muted font-mono text-sm">
                            {ev.location}&nbsp;&middot;&nbsp;Doors {ev.doors}&nbsp;&middot;&nbsp;Bands start {ev.bandsStart}
                          </p>
                        )}
                        <p className="text-muted/60 font-mono text-xs mt-1">{sorted.length} acts</p>
                      </div>

                      {/* Artist grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </div>
  )
}
