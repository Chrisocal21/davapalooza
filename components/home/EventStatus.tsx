'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import {
  getEventDateParts,
  getEventPhase,
  getNextPlannedYear,
  getUpcomingEvent,
  type EventConfig,
} from '@/lib/events'
import { SOCIALS } from '@/lib/site'

const UNITS = [
  { label: 'Days', ms: 86_400_000, mod: Infinity },
  { label: 'Hours', ms: 3_600_000, mod: 24 },
  { label: 'Minutes', ms: 60_000, mod: 60 },
  { label: 'Seconds', ms: 1_000, mod: 60 },
] as const

/**
 * The part of the hero that depends on the calendar. It reads lib/events.ts and
 * shows one of three things:
 *
 *   upcoming — the date and a live countdown to doors
 *   live     — "happening now", for the day of the party
 *   past     — next year is in the works
 *
 * `initialNow` is the server's clock at render time. Starting from it means the
 * first paint already has the right numbers and matches the server's HTML; the
 * effect then takes over with the visitor's own clock.
 */
export default function EventStatus({ initialNow }: { initialNow: number }) {
  const [now, setNow] = useState(initialNow)

  const event = getUpcomingEvent(new Date(now))
  const phase = event ? getEventPhase(event, new Date(now)) : 'past'
  const counting = phase === 'upcoming'

  useEffect(() => {
    setNow(Date.now())
    // Tick every second only while there is a countdown on screen.
    const id = setInterval(() => setNow(Date.now()), counting ? 1000 : 60_000)
    return () => clearInterval(id)
  }, [counting])

  return (
    <div className="mt-7 sm:mt-9">
      {event && phase !== 'past' ? (
        <Ticket
          stub={<DateStub event={event} />}
          footer={[`Doors ${event.doors}`, `Bands start ${event.bandsStart}`, 'Free']}
        >
          {phase === 'upcoming' ? (
            <Countdown msLeft={event.date.getTime() - now} />
          ) : (
            <p className="flex items-center gap-3.5 whitespace-nowrap font-display text-[2.75rem] leading-none text-ink sm:text-5xl">
              <span className="relative flex h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-red opacity-70" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-sun-red" />
              </span>
              Happening now
            </p>
          )}
        </Ticket>
      ) : (
        <Ticket
          stub={
            <>
              <p className="eyebrow text-ink/70">Next up</p>
              <p className="font-display text-[4.25rem] leading-[0.82] text-sun-red sm:text-[5.5rem]">
                {getNextPlannedYear()}
              </p>
            </>
          }
        >
          <p className="font-display text-display-sm text-ink">
            Davapalooza {getNextPlannedYear()} is in the works.
          </p>
          <p className="mt-2 text-lg leading-snug text-ink/80">
            Date and lineup will be announced here first.
          </p>
        </Ticket>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Button href="/submit" size="lg">
          <Icon name="camera" size={20} className="-mt-0.5" />
          Submit Your Photos
        </Button>
        {phase === 'past' && SOCIALS.instagram ? (
          <Button href={SOCIALS.instagram} variant="paper" size="lg">
            Follow for Updates
            <Icon name="arrow-up-right" size={18} className="-mt-0.5" />
          </Button>
        ) : (
          <Button href="/lineup" variant="paper" size="lg">
            See the Lineup
            <Icon name="arrow-right" size={18} className="-mt-0.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Cream ticket: a stub on the left, a perforation, the details on the right,
 * and an optional strip of facts along the bottom.
 */
function Ticket({
  stub,
  footer,
  children,
}: {
  stub: React.ReactNode
  footer?: string[]
  children: React.ReactNode
}) {
  return (
    <div className="w-fit max-w-full rounded-md border-2 border-ink bg-cream shadow-print-lg sm:max-w-xl">
      <div className="flex flex-col sm:flex-row">
        <div className="flex shrink-0 flex-row items-end justify-between gap-4 px-5 pb-3 pt-4 sm:flex-col sm:items-start sm:justify-center sm:gap-1 sm:px-6 sm:py-5">
          {stub}
        </div>
        <div className="flex flex-col justify-center border-t-2 border-dashed border-ink/35 px-5 py-5 sm:border-l-2 sm:border-t-0 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
      {footer && (
        <ul className="eyebrow flex flex-wrap gap-x-5 gap-y-1.5 border-t-2 border-dashed border-ink/35 px-5 py-3 text-ink/85 sm:px-6">
          {footer.map((fact) => (
            <li key={fact} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun-red" aria-hidden="true" />
              {fact}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DateStub({ event }: { event: EventConfig }) {
  const { weekday, month, day, year } = getEventDateParts(event)
  return (
    <>
      <p className="eyebrow text-ink/70">{weekday}</p>
      <p className="font-display text-[4.25rem] leading-[0.82] text-sun-red sm:text-[5.5rem]">
        <span className="sr-only">
          {month} {day}, {year}
        </span>
        <span aria-hidden="true">
          {month} {day}
        </span>
      </p>
      <p className="eyebrow text-ink/70" aria-hidden="true">
        {year}
      </p>
    </>
  )
}

function Countdown({ msLeft }: { msLeft: number }) {
  const left = Math.max(0, msLeft)
  return (
    <div className="flex gap-2 sm:gap-2.5" role="timer" aria-label="Time until doors open">
      {UNITS.map(({ label, ms, mod }) => {
        const value = Math.floor(left / ms) % mod
        return (
          <div key={label} className="min-w-[3.5rem] flex-1 rounded bg-ink px-2 pb-2 pt-2.5 text-center sm:min-w-[4.25rem]">
            <span className="block font-display text-[2.5rem] leading-none tabular-nums text-cream sm:text-5xl">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-cream/65">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
