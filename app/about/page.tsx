import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import TornEdge from '@/components/ui/TornEdge'
import { SOCIALS } from '@/lib/site'

const FOUNDERS = [
  { name: 'Dave', role: 'Co-Founder', title: 'Executive Producer' },
  { name: 'Steve', role: 'Co-Founder', title: 'Talent & Production Director' },
  { name: 'Chris', role: 'Co-Founder', title: 'Technical Director' },
]

const NEXT_STEPS = [
  { href: '/lineup', label: 'See the lineup' },
  { href: '/bands', label: 'Play the show' },
  { href: '/vendors', label: 'Set up a booth' },
]

/** One chapter of the page: a numbered heading in the margin, the copy beside it. */
function Chapter({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-x-12 gap-y-3 border-t-2 border-ink py-10 sm:py-12 lg:grid-cols-[18rem_1fr]">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted">{n}</p>
        <h2 className="mt-2 font-display text-display-md text-ink">{title}</h2>
      </div>
      <div className="prose-block text-ink">{children}</div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <PageHeader
        eyebrow="Griffin Street · South Oceanside, CA"
        title="About the Block Party"
        lede="Live Music. Good People. Strong Community."
      />

      {/* Body */}
      <div className="bg-cream pb-20 pt-12 sm:pb-24 sm:pt-16">
        <div className="shell">
          {/* The line the whole thing hangs on */}
          <p className="max-w-5xl pb-12 font-display text-display-lg text-ink sm:pb-16">
            This is for the neighborhood, <span className="text-sun-red">by the neighborhood.</span>
          </p>

          <Chapter n="01" title="What it is">
            <p>
              South O Block Party — also known as Davapalooza — is a free, community-run block
              party held on Griffin Street in South Oceanside, CA. It started as a
              neighborhood gathering and has grown into a full day of live music, community
              vendors, and good people showing up for each other.
            </p>
            <p>
              There is no admission fee. There is no corporate sponsor calling the shots.
              This is for the neighborhood, by the neighborhood.
            </p>
            <p className="border-l-4 border-sun-yellow pl-4 font-mono text-[0.9375rem] leading-relaxed text-muted">
              It is also, technically, a birthday party for Dave. But we are just here for the music.
            </p>
          </Chapter>

          <Chapter n="02" title="The music">
            <p>
              Local and regional artists play across the day. All genres are welcome — the
              lineup has always reflected what the community actually listens to. If you want
              to play, fill out the band inquiry form and we will be in touch.
            </p>
          </Chapter>

          <Chapter n="03" title="The vendors">
            <p>
              Vendors set up booths and work for tips. There are no fees to participate and
              no sales commissions collected. If you want to bring food, art, a trade, or
              anything else that fits the neighborhood vibe, reach out.
            </p>
          </Chapter>

          <Chapter n="04" title="The photos">
            <p>
              The gallery on this site is community-submitted. Anyone who attends can submit
              their photos for review. Approved photos go into the public gallery. We
              moderate everything before it goes live.
            </p>
          </Chapter>

          <Chapter n="05" title="Where and when">
            <p>
              Griffin Street, South Oceanside, CA.
              <br />
              July 25, 2026. Doors open at noon. Music runs through the evening.
            </p>
          </Chapter>

          <section className="border-t-2 border-ink py-10 sm:py-12">
            <p className="font-mono text-xs tracking-widest text-muted">06</p>
            <h2 className="mt-2 font-display text-display-md text-ink">The people behind it</h2>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
              {FOUNDERS.map(person => (
                <li
                  key={person.name}
                  className="reveal rounded-md border-2 border-ink bg-paper p-6 shadow-print"
                >
                  <p className="font-display text-[3.25rem] leading-none text-sun-red">{person.name}</p>
                  <p className="eyebrow mt-3 text-muted">{person.role}</p>
                  <p className="mt-1 text-lg font-medium leading-snug text-ink">{person.title}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA row */}
          <nav aria-label="Next steps" className="border-t-2 border-ink">
            <ul className="grid sm:grid-cols-3">
              {NEXT_STEPS.map(({ href, label }) => (
                <li key={href} className="border-b-2 border-ink/15 sm:border-b-0 sm:border-r-2 sm:last:border-r-0">
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-4 py-6 font-display text-display-sm text-ink transition-colors hover:text-sun-red sm:px-6 sm:first:pl-0"
                  >
                    {label}
                    <Icon name="arrow-right" size={24} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {SOCIALS.instagram && (
            <p className="border-t-2 border-ink pt-6 text-lg text-ink">
              Questions?{' '}
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                Find us on Instagram.
              </a>
            </p>
          )}
        </div>
      </div>

      <TornEdge fill="#45BEE4" />

      {/* Legal nudge */}
      <section className="bg-sky px-5 py-12 text-center">
        <p className="mx-auto max-w-2xl text-lg text-ink">
          Attending or participating means you have read and agree to our{' '}
          <Link href="/legal" className="link font-semibold">
            liability disclaimer and terms
          </Link>
          .
        </p>
      </section>
    </>
  )
}
