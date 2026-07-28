'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import TornEdge from '@/components/ui/TornEdge'
import {
  EVENTS,
  getUpcomingEvent,
  getPastEvents,
  getNextPlannedYear,
  type EventConfig,
} from '@/lib/events'

interface Artist {
  id: string
  name: string
  genre: string | null
  bio: string | null
  set_time: string | null
  sort_order: number
  photoUrl: string | null
}

export default function LineupPage() {
  const [artistsByYear, setArtistsByYear] = useState<Record<number, Artist[]>>({})
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const upcomingEvent = getUpcomingEvent()
  const pastEvents = getPastEvents()
  const nextYear = getNextPlannedYear()
  const allYears = EVENTS.map(e => e.year)

  useEffect(() => {
    if (lightboxSrc) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [lightboxSrc])

  useEffect(() => {
    Promise.all(
      allYears.map(year =>
        fetch(`/api/artists?year=${year}`)
          .then(r => r.json())
          .then(data => ({ year, artists: (data.artists || []) as Artist[] }))
          .catch(() => ({ year, artists: [] }))
      )
    ).then(results => {
      const map: Record<number, Artist[]> = {}
      results.forEach(({ year, artists }) => { map[year] = artists })
      setArtistsByYear(map)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen">

      {/* â”€â”€ Upcoming or Coming Soon banner â”€â”€ */}
      {upcomingEvent ? (
        <UpcomingSection
          event={upcomingEvent}
          artists={artistsByYear[upcomingEvent.year] || []}
          loading={loading}
          onFlyerClick={src => setLightboxSrc(src)}
        />
      ) : (
        <ComingSoonSection nextYear={nextYear} />
      )}

      {/* â”€â”€ Past Events â”€â”€ */}
      {pastEvents.length > 0 && (
        <>
          <TornEdge fill="#FDF0DA" />
          <section className="bg-surface py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-4xl text-ink mb-10">
                {upcomingEvent ? 'Past Events' : 'Most Recent'}
              </h2>
              <div className="space-y-8">
                {pastEvents.map((event, i) => (
                  <PastEventSection
                    key={event.year}
                    event={event}
                    artists={artistsByYear[event.year] || []}
                    loading={loading}
                    onFlyerClick={src => setLightboxSrc(src)}
                    isMostRecent={i === 0 && !upcomingEvent}
                  />
                ))}
              </div>
            </div>
          </section>
          <TornEdge fill="#45BEE4" flip />
        </>
      )}

      {/* â”€â”€ Lightbox â”€â”€ */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 text-cream hover:text-primary transition-colors text-4xl w-12 h-12 flex items-center justify-center"
            aria-label="Close"
          >
            Ã—
          </button>
          <div
            className="max-w-2xl max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc}
              alt="Event flyer â€” full size"
              className="w-full h-full object-contain rounded"
            />
          </div>
        </div>
      )}

    </div>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function UpcomingSection({
  event, artists, loading, onFlyerClick,
}: {
  event: EventConfig; artists: Artist[]; loading: boolean; onFlyerClick: (s: string) => void
}) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <SectionHeader
            title={`Davapalooza ${event.year}`}
            subtitle={`${event.address} Â· Doors ${event.doors}`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {event.flyerJpg && (
            <div className="md:col-span-1">
              <FlyerCard event={event} onFlyerClick={onFlyerClick} />
            </div>
          )}
          <div className={event.flyerJpg ? 'md:col-span-2' : 'md:col-span-3'}>
            <Card className="p-6 h-full">
              <h3 className="font-display text-2xl text-ink mb-5">Event Details</h3>
              <dl className="space-y-3 text-sm">
                <Detail label="Date" value={`Saturday, July 25th, ${event.year}`} />
                <Detail label="Location" value={event.location} />
                <Detail label="Doors" value={event.doors} />
                <Detail label="Music starts" value={event.bandsStart} />
                <Detail label="Admission" value="Free" />
              </dl>
            </Card>
          </div>
        </div>
        <ArtistGrid artists={artists} loading={loading} year={event.year} />
      </div>
    </section>
  )
}

function ComingSoonSection({ nextYear }: { nextYear: number }) {
  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-sm text-muted uppercase tracking-widest mb-4">Next up</p>
        <h1 className="font-display text-7xl md:text-9xl text-ink mb-4">{nextYear}</h1>
        <p className="text-text text-lg mb-2">Davapalooza {nextYear} is in the works.</p>
        <p className="text-muted text-sm font-mono mb-10">
          Date and lineup will be announced here first.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://www.instagram.com/southoblockparty" target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg">Follow for Updates</Button>
          </a>
          <Link href="/bands">
            <Button variant="ghost" size="lg">Play the Show</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function PastEventSection({
  event, artists, loading, onFlyerClick, isMostRecent,
}: {
  event: EventConfig; artists: Artist[]; loading: boolean
  onFlyerClick: (s: string) => void; isMostRecent: boolean
}) {
  const [open, setOpen] = useState(isMostRecent)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-center justify-between group mb-6"
      >
        <div className="flex items-center gap-4">
          <h3 className="font-display text-3xl text-ink group-hover:text-primary transition-colors">
            Davapalooza {event.year}
          </h3>
          {isMostRecent && <Badge variant="approved">Most Recent</Badge>}
        </div>
        <span className="text-muted text-xs font-mono group-hover:text-primary transition-colors uppercase tracking-wider">
          {open ? 'â–² collapse' : 'â–¼ expand'}
        </span>
      </button>

      {open && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {event.flyerJpg && (
              <div className="md:col-span-1">
                <FlyerCard event={event} onFlyerClick={onFlyerClick} past />
              </div>
            )}
            <div className={event.flyerJpg ? 'md:col-span-2' : 'md:col-span-3'}>
              <Card className="p-6">
                <dl className="space-y-3 text-sm">
                  <Detail label="Date" value={`Saturday, July 25th, ${event.year}`} />
                  <Detail label="Location" value={event.location} />
                  <Detail label="Admission" value="Free" />
                </dl>
              </Card>
            </div>
          </div>
          <ArtistGrid artists={artists} loading={loading} year={event.year} past />
        </div>
      )}

      <div className="border-t border-border mt-8" />
    </div>
  )
}

function FlyerCard({
  event, onFlyerClick, past = false,
}: {
  event: EventConfig; onFlyerClick: (s: string) => void; past?: boolean
}) {
  if (!event.flyerJpg) return null
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => onFlyerClick(event.flyerJpg!)}
        className="block w-full group relative"
        aria-label={`View ${event.year} flyer full size`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.flyerJpg}
          alt={`Davapalooza ${event.year} flyer`}
          className={`w-full h-auto ${past ? 'opacity-75' : ''} group-hover:opacity-100 transition-opacity`}
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-end justify-center pb-3">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-ink text-cream text-xs font-mono px-3 py-1 rounded">
            enlarge
          </span>
        </div>
      </button>
      {event.flyerPdf && (
        <div className="p-3 border-t border-border text-center">
          <a
            href={event.flyerPdf}
            download
            className="text-xs font-mono text-muted hover:text-primary transition-colors uppercase tracking-wider"
          >
            Download PDF
          </a>
        </div>
      )}
    </Card>
  )
}

function ArtistGrid({
  artists, loading, year, past = false,
}: {
  artists: Artist[]; loading: boolean; year: number; past?: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-ink/10 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }
  if (artists.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted text-sm font-mono">
          {past ? `No artist records for ${year}.` : `Lineup for ${year} will be announced soon.`}
        </p>
      </Card>
    )
  }
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-4">
        {past ? `${year} Lineup` : "This Year's Lineup"}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(artist => (
            <Card key={artist.id} className="p-4">
              <p className="font-display text-lg text-ink leading-tight">{artist.name}</p>
              {artist.genre && <p className="text-muted text-xs font-mono mt-1">{artist.genre}</p>}
              {artist.set_time && <p className="text-primary text-xs font-mono mt-1">{artist.set_time}</p>}
            </Card>
          ))}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted font-mono w-28 shrink-0">{label}</dt>
      <dd className="text-text">{value}</dd>
    </div>
  )
}
