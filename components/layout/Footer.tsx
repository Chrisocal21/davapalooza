import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="bg-ink mt-auto">
      {/* Sunset stripe at top of footer */}
      <div className="h-[3px] bg-sunset" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
              <Logo height={44} />
              <span className="font-display text-2xl text-cream leading-none">South O Block Party</span>
            </Link>
            <p className="text-cream/50 text-sm font-mono">
              #SouthOBlockParty
            </p>
            <p className="text-cream/40 text-xs font-mono mt-1">
              southoblockparty.com
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-xl text-cream mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/lineup" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Lineup
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  News &amp; Updates
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Submit Photos
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-display text-xl text-cream mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bands" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Play the Show
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  Set Up a Booth
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/southoblockparty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/60 hover:text-cream transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/60 hover:text-cream transition-colors text-sm">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-8 pt-8 text-center text-cream/40 text-xs font-mono">
          <p>&copy; {new Date().getFullYear()} South O Block Party. Free community event.</p>
          <p className="mt-1">Live Music. Good People. Strong Community.</p>
          <p className="mt-3">
            <Link href="/legal" className="underline hover:text-cream/70 transition-colors">
              Liability Disclaimer &amp; Terms
            </Link>
            {' · '}
            <Link href="/about" className="underline hover:text-cream/70 transition-colors">
              About
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

