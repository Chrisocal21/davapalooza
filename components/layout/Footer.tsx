import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl text-primary mb-2">
              DAVAPALOOZA
            </h3>
            <p className="text-muted text-sm">
              South O Block Party
            </p>
            <p className="text-muted text-sm font-mono mt-2">
              #SouthOBlockParty
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl text-text mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-muted hover:text-primary transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-muted hover:text-primary transition-colors">
                  Artist Lineup
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted hover:text-primary transition-colors">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted hover:text-primary transition-colors">
                  Submit Photos
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-xl text-text mb-3">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <Link href="/donate" className="text-muted hover:text-primary transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Davapalooza. All rights reserved.</p>
          <p className="mt-2">
            Made with <span className="text-secondary">♥</span> for South O
          </p>
        </div>
      </div>
    </footer>
  )
}
