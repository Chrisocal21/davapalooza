import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import TornEdge from '@/components/ui/TornEdge'

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="About the Block Party"
            subtitle="Live Music. Good People. Strong Community."
          />
        </div>
      </section>

      <TornEdge fill="#FDF0DA" />

      {/* Body */}
      <section className="bg-surface py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-10">

          <div>
            <h3 className="font-display text-3xl text-ink mb-3">What it is</h3>
            <p className="text-text leading-relaxed">
              South O Block Party — also known as Davapalooza — is a free, community-run block
              party held on Griffin Street in South Oceanside, CA. It started as a
              neighborhood gathering and has grown into a full day of live music, community
              vendors, and good people showing up for each other.
            </p>
            <p className="text-text leading-relaxed mt-4">
              There is no admission fee. There is no corporate sponsor calling the shots.
              This is for the neighborhood, by the neighborhood.
            </p>
            <p className="text-muted text-xs font-mono mt-4">
              It is also, technically, a birthday party for Dave. But we are just here for the music.
            </p>
          </div>

          <div>
            <h3 className="font-display text-3xl text-ink mb-3">The music</h3>
            <p className="text-text leading-relaxed">
              Local and regional artists play across the day. All genres are welcome — the
              lineup has always reflected what the community actually listens to. If you want
              to play, fill out the band inquiry form and we will be in touch.
            </p>
          </div>

          <div>
            <h3 className="font-display text-3xl text-ink mb-3">The vendors</h3>
            <p className="text-text leading-relaxed">
              Vendors set up booths and work for tips. There are no fees to participate and
              no sales commissions collected. If you want to bring food, art, a trade, or
              anything else that fits the neighborhood vibe, reach out.
            </p>
          </div>

          <div>
            <h3 className="font-display text-3xl text-ink mb-3">The photos</h3>
            <p className="text-text leading-relaxed">
              The gallery on this site is community-submitted. Anyone who attends can submit
              their photos for review. Approved photos go into the public gallery. We
              moderate everything before it goes live.
            </p>
          </div>

          <div>
            <h3 className="font-display text-3xl text-ink mb-3">Where and when</h3>
            <p className="text-text leading-relaxed">
              Griffin Street, South Oceanside, CA.
              <br />
              July 25, 2026. Doors open at noon. Music runs through the evening.
            </p>
          </div>

          {/* CTA row */}
          <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans font-semibold">
            <Link href="/lineup" className="text-primary hover:underline">
              See the lineup
            </Link>
            <Link href="/bands" className="text-primary hover:underline">
              Play the show
            </Link>
            <Link href="/vendors" className="text-primary hover:underline">
              Set up a booth
            </Link>
          </div>

          <p className="text-muted text-xs font-mono pt-2">
            Questions?{' '}
            <a
              href="https://www.instagram.com/southoblockparty"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text"
            >
              Find us on Instagram.
            </a>
          </p>

        </div>
      </section>

      <TornEdge fill="#45BEE4" flip />

      {/* Legal nudge */}
      <section className="py-10 px-4 text-center">
        <p className="text-muted text-sm font-mono">
          Attending or participating means you have read and agree to our{' '}
          <Link href="/legal" className="underline hover:text-text">
            liability disclaimer and terms
          </Link>
          .
        </p>
      </section>

    </div>
  )
}
