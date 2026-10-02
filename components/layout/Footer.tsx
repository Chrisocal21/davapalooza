import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/ui/Icon'
import { SITE, SOCIALS } from '@/lib/site'

const EXPLORE = [
  { href: '/gallery', label: 'Photo Gallery' },
  { href: '/lineup', label: 'Lineup' },
  { href: '/news', label: 'News & Updates' },
  { href: '/submit', label: 'Submit Photos' },
  { href: '/donate', label: 'Donate' },
  { href: '/about', label: 'About' },
]

const GET_INVOLVED = [
  { href: '/bands', label: 'Play the Show' },
  { href: '/vendors', label: 'Set Up a Booth' },
]

const linkCls =
  'inline-block py-1 text-lg font-medium text-cream/75 underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-cream hover:decoration-sun-yellow'

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-ink text-cream">
      {/* Sunset stripe at top of footer */}
      <div className="h-1 bg-sunset-h" aria-hidden="true" />

      <div className="shell pb-10 pt-16 sm:pt-20 lg:pt-24">
        <p className="font-display text-[clamp(2.75rem,11.5vw,9rem)] leading-[0.86] tracking-[0.005em]">
          <span className="block">Live Music.</span>
          <span className="block">Good People.</span>
          <span className="block text-sun-yellow">Strong Community.</span>
        </p>

        <div className="mt-14 grid gap-12 border-t border-cream/15 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              aria-label={`${SITE.event} — ${SITE.name}, home`}
              className="inline-block rounded transition-opacity hover:opacity-80"
            >
              <Logo tone="cream" size="lg" />
            </Link>
            <p className="mt-5 max-w-sm text-lg leading-snug text-cream/70">
              Free community block party on Griffin St, Oceanside CA.
            </p>
            <p className="mt-5 font-mono text-sm tracking-wide text-cream/55">{SITE.hashtags.join(' · ')}</p>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-explore" className="lg:col-span-3 lg:col-start-7">
            <h2 id="footer-explore" className="eyebrow mb-4 text-sun-yellow">
              Explore
            </h2>
            <ul>
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get Involved */}
          <nav aria-labelledby="footer-involved" className="lg:col-span-3">
            <h2 id="footer-involved" className="eyebrow mb-4 text-sun-yellow">
              Get Involved
            </h2>
            <ul>
              {GET_INVOLVED.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {SOCIALS.instagram && (
                <li>
                  <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-2`}>
                    <Icon name="instagram" size={17} />
                    Instagram
                  </a>
                </li>
              )}
              {SOCIALS.tiktok && (
                <li>
                  <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-2`}>
                    <Icon name="tiktok" size={17} />
                    TikTok
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="eyebrow mt-14 flex flex-col gap-4 border-t border-cream/15 pt-6 text-cream/55 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} South O Block Party. Free community event.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal" className="underline underline-offset-4 transition-colors hover:text-cream">
              Liability Disclaimer &amp; Terms
            </Link>
            <Link href="/about" className="underline underline-offset-4 transition-colors hover:text-cream">
              About
            </Link>
            <span>{SITE.domain}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
