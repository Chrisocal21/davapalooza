'use client'

import { useState, useEffect } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import ImageViewer from '@/components/ui/ImageViewer'
import PageHeader from '@/components/ui/PageHeader'
import {
  EVENTS,
  formatEventDate,
  getUpcomingEvent,
  getPastEvents,
  getNextPlannedYear,
  type EventConfig,
} from '@/lib/events'
import { SOCIALS } from '@/lib/site'

interface Artist {
  id: string
  name: string
  genre: string | null
  bio: string | null
  set_time: string | null
  sort_order: number
  photoUrl: string | null
}

interface Flyer {
  src: string
  alt: string
}

/**
 * `initialNow` is the server's clock at render time, so the first paint agrees
 * with the server about which event is upcoming. The effect then switches to
 * the visitor's own clock.
 */
export default function LineupView({ initialNow }: { initialNow: number }) {
  const [now, setNow] = useState(initialNow)
  const [artistsByYear, setArtistsByYear] = useState<Record<number, Artist[]>>({})
  const [flyer, setFlyer] = useState<Flyer | null>(null)
  const [loading, setLoading] = useState(true)

  const upcomingEvent = getUpcomingEvent(new Date(now))
  const pastEvents = getPastEvents(new Date(now))
  const nextYear = getNextPlannedYear()

  useEffect(() => {
    setNow(Date.now())
  }, [])

  useEffect(() => {
    Promise.all(
      EVENTS.map(e => e.year).map(year =>
        fetch(`/api/artists?year=${year}`)
          .then(r => r.json())
          .then(data => ({ year, artists: (data.artists || []) as Artist[] }))
          .catch(() => ({ year, artists: [] as Artist[] }))
      )
    ).then(results => {
      const map: Record<number, Artist[]> = {}
      results.forEach(({ year, artists }) => { map[year] = artists })
      setArtistsByYear(map)
      setLoading(false)
    })
  }, [])

  return (
    <>
      {/* ── Upcoming or Coming Soon banner ── */}
      {upcomingEvent ? (
        <>
          <PageHeader
            eyebrow={`${upcomingEvent.address} · Doors ${upcomingEvent.doors}`}
            title={`Davapalooza ${upcomingEvent.year}`}
            lede={formatEventDate(upcomingEvent)}
          />
          <section className="bg-cream py-16 sm:py-20">
            <div className="shell">
              <EventBlock
                event={upcomingEvent}
                artists={artistsByYear[upcomingEvent.year] || []}
                loading={loading}
                onFlyerClick={setFlyer}
              />
            </div>
          </section>
        </>
      ) : (
        <PageHeader
          size="xl"
          eyebrow="Next up"
          title={
            <>
              <span className="sr-only">Davapalooza </span>
              {nextYear}
            </>
          }
          lede={
            <>
              Davapalooza {nextYear} is in the works.
              <span className="mt-1 block text-lg text-ink/85 sm:text-xl">
                Date and lineup will be announced here first.
              </span>
            </>
          }
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            {SOCIALS.instagram && (
              <Button href={SOCIALS.instagram} size="lg">
                Follow for Updates
                <Icon name="arrow-up-right" size={18} className="-mt-0.5" />
              </Button>
            )}
            <Button href="/bands" variant="paper" size="lg">
              Play the Show
            </Button>
          </div>
        </PageHeader>
      )}

      {/* ── Past Events ── */}
      {pastEvents.length > 0 && (
        <section
          aria-labelledby="past-title"
          className={`bg-cream pb-20 sm:pb-24 ${upcomingEvent ? 'border-t-2 border-ink/10 pt-16 sm:pt-20' : 'pt-14 sm:pt-16'}`}
        >
          <div className="shell">
            <h2 id="past-title" className="eyebrow mb-6 text-muted">
              {upcomingEvent ? 'Past Events' : 'Most Recent'}
            </h2>
            <div>
              {pastEvents.map((event, i) => (
                <PastEventSection
                  key={event.year}
                  event={event}
                  artists={artistsByYear[event.year] || []}
                  loading={loading}
                  onFlyerClick={setFlyer}
                  isMostRecent={i === 0 && !upcomingEvent}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      {flyer && (
        <ImageViewer
          images={[{ id: flyer.src, url: flyer.src, alt: flyer.alt }]}
          initialIndex={0}
          onClose={() => setFlyer(null)}
          showShare={false}
        />
      )}
    </>
  )
}

/* ──────────────────────────────────────────── */

/** Flyer, event details and lineup for one year. */
function EventBlock({
  event, artists, loading, onFlyerClick, past = false,
}: {
  event: EventConfig; artists: Artist[]; loading: boolean
  onFlyerClick: (f: Flyer) => void; past?: boolean
}) {
  // Under the page title these are h2s; inside a past year they sit under that year's h3.
  const Heading = past ? 'h4' : 'h2'
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
      <div className="space-y-8">
        {event.flyerJpg && <FlyerCard event={event} onFlyerClick={onFlyerClick} />}

        <div>
          <Heading className="eyebrow mb-3 text-muted">Event Details</Heading>
          <dl className="border-t-2 border-ink">
            <Detail label="Date" value={formatEventDate(event)} />
            <Detail label="Location" value={event.location} />
            {!past && <Detail label="Doors" value={event.doors} />}
            {!past && <Detail label="Music starts" value={event.bandsStart} />}
            <Detail label="Admission" value="Free" />
          </dl>
        </div>
      </div>

      <ArtistList artists={artists} loading={loading} year={event.year} past={past} Heading={Heading} />
    </div>
  )
}

function PastEventSection({
  event, artists, loading, onFlyerClick, isMostRecent,
}: {
  event: EventConfig; artists: Artist[]; loading: boolean
  onFlyerClick: (f: Flyer) => void; isMostRecent: boolean
}) {
  const [open, setOpen] = useState(isMostRecent)
  const panelId = `event-${event.year}`

  return (
    <div className="border-t-2 border-ink">
      <h3>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
        >
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-display-md text-ink transition-colors group-hover:text-sun-red">
              Davapalooza {event.year}
            </span>
            {isMostRecent && <Badge variant="approved">Most Recent</Badge>}
          </span>
          <span className="flex shrink-0 items-center gap-2.5 text-ink">
            <span className="eyebrow hidden sm:inline">{open ? 'Collapse' : 'Expand'}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors group-hover:bg-ink group-hover:text-cream">
              <Icon
                name="chevron-down"
                size={20}
                className={`transition-transform duration-300 ease-out-expo ${open ? 'rotate-180' : ''}`}
              />
            </span>
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="animate-fade-in pb-12 pt-2 sm:pb-16">
          <EventBlock event={event} artists={artists} loading={loading} onFlyerClick={onFlyerClick} past />
        </div>
      )}
    </div>
  )
}

function FlyerCard({
  event, onFlyerClick,
}: {
  event: EventConfig; onFlyerClick: (f: Flyer) => void
}) {
  if (!event.flyerJpg) return null
  const alt = `Davapalooza ${event.year} flyer`
  return (
    <div>
      <button
        type="button"
        onClick={() => onFlyerClick({ src: event.flyerJpg!, alt: `${alt} — full size` })}
        // Letter-sized frame reserved up front so the page doesn't jump when the
        // flyer loads; a flyer of another shape is fitted inside it, never cropped.
        className="group relative block aspect-[17/22] w-full -rotate-1 overflow-hidden rounded-sm border-2 border-ink bg-white shadow-print-lg transition-transform duration-300 ease-out-expo hover:rotate-0"
        aria-label={`View ${event.year} flyer full size`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.flyerJpg} alt={alt} decoding="async" className="h-full w-full object-contain" />
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border-2 border-ink bg-sun-yellow px-3 pb-1.5 pt-2 font-mono text-[0.6875rem] font-bold uppercase leading-none tracking-[0.12em] text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Icon name="expand" size={13} />
          Enlarge
        </span>
      </button>
      {event.flyerPdf && (
        <a
          href={event.flyerPdf}
          download
          className="eyebrow mt-5 inline-flex items-center gap-2 font-bold text-ink"
        >
          <Icon name="download" size={15} />
          <span className="link">Download PDF</span>
        </a>
      )}
    </div>
  )
}

function ArtistList({
  artists, loading, year, past = false, Heading,
}: {
  artists: Artist[]; loading: boolean; year: number; past?: boolean; Heading: 'h2' | 'h4'
}) {
  const heading = past ? `${year} Lineup` : "This Year's Lineup"

  if (loading) {
    return (
      <div aria-hidden="true">
        <div className="skeleton mb-4 h-4 w-32 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-ink/15 py-4">
            <div className="skeleton h-9 rounded" style={{ width: `${70 - i * 9}%` }} />
          </div>
        ))}
      </div>
    )
  }

  if (artists.length === 0) {
    return (
      <div>
        <Heading className="eyebrow mb-3 text-muted">{heading}</Heading>
        <p className="rounded-md border-2 border-dashed border-ink/30 px-6 py-12 text-center text-lg text-ink">
          {past ? `No artist records for ${year}.` : `Lineup for ${year} will be announced soon.`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <Heading className="eyebrow mb-3 text-muted">{heading}</Heading>
      <ol className="border-b border-ink/15">
        {[...artists]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((artist, i) => (
            <li
              key={artist.id}
              className="grid grid-cols-[2rem_1fr] items-baseline gap-x-3 border-t border-ink/15 py-3.5 first:border-t-2 first:border-ink sm:grid-cols-[2.5rem_1fr_auto] sm:gap-x-5 sm:py-4"
            >
              <span className="font-mono text-xs tracking-wider text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[2rem] leading-[0.95] tracking-wide text-ink sm:text-[2.75rem]">
                {artist.name}
              </span>
              <span className="eyebrow col-start-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1 sm:col-start-3 sm:justify-end sm:pt-0">
                {artist.genre && <span className="text-muted">{artist.genre}</span>}
                {artist.set_time && <span className="font-bold text-red-ink">{artist.set_time}</span>}
              </span>
            </li>
          ))}
      </ol>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink/15 py-3">
      <dt className="eyebrow w-32 shrink-0 text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  )
}
