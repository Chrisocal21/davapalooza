'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'

const AMOUNTS = [5, 10, 25, 50]

const CASHTAG = '$motodave66'
/** Cash App fills in the amount when it is added to the end of the link. */
const cashAppUrl = (amount: number | null) =>
  `https://cash.app/${CASHTAG}${amount ? `/${amount}` : ''}`

const USES = [
  'Equipment and stage maintenance',
  'Food & hydration for artists, staff, and guests',
  'Keeping the block clean and beautiful',
  'Safety and security',
  "Funding next year's event",
]

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <>
      <PageHeader
        eyebrow="Free to attend · Run by neighbors"
        title="Support Davapalooza"
        lede="Help us keep the block party alive"
      />

      <div className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Give */}
          <section
            aria-labelledby="give-title"
            className="rounded-md border-2 border-ink bg-paper p-6 shadow-print-lg sm:p-10"
          >
            {/* Headline */}
            <h2 id="give-title" className="font-display text-display-md text-sun-red">
              Every Dollar Helps
            </h2>
            <p className="mt-4 max-w-xl text-xl leading-snug text-ink">
              Davapalooza is a free community event made possible by neighbors like you.
            </p>

            {/* Amount picker */}
            <fieldset className="mt-9">
              <legend className="eyebrow mb-3 text-muted">Choose an amount</legend>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {AMOUNTS.map((amt) => {
                  const active = selected === amt
                  return (
                    <button
                      key={amt}
                      type="button"
                      aria-pressed={active}
                      // Tapping the chosen amount again clears it.
                      onClick={() => setSelected(active ? null : amt)}
                      className={`rounded border-2 pb-3 pt-4 font-display text-3xl leading-none transition-[transform,box-shadow,background-color,border-color] duration-150 sm:text-4xl ${
                        active
                          ? '-translate-x-0.5 -translate-y-0.5 border-ink bg-sun-yellow text-ink shadow-print'
                          : 'border-ink/25 bg-cream text-ink hover:border-ink'
                      }`}
                    >
                      ${amt}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Donate buttons */}
            <div className="mt-8 flex flex-col items-start gap-4">
              <Button href={cashAppUrl(selected)} size="lg" className="w-full sm:w-auto">
                <Icon name="heart" size={19} className="-mt-0.5 hidden sm:block" />
                {selected ? `Donate $${selected} via Cash App` : 'Donate via Cash App'}
                <Icon name="arrow-up-right" size={18} className="-mt-0.5" />
              </Button>
              <p className="font-mono text-sm tracking-wide text-muted">
                Cash App · <span className="font-bold text-ink">{CASHTAG}</span>
              </p>
            </div>
          </section>

          {/* Where it goes */}
          <section aria-labelledby="uses-title">
            <h2 id="uses-title" className="font-display text-display-md text-ink">
              Where Your Money Goes
            </h2>
            <ol className="mt-6 border-t-2 border-ink">
              {USES.map((text, i) => (
                <li key={text} className="flex items-baseline gap-5 border-b border-ink/15 py-4">
                  <span className="font-mono text-xs tracking-widest text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xl leading-snug text-ink">{text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-l-4 border-sun-yellow pl-4 text-lg leading-snug text-ink/85">
              Davapalooza is organized by community volunteers. All donations go directly to event costs.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
