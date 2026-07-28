'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/lineup', label: 'Lineup' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/news', label: 'News' },
    { href: '/about', label: 'About' },
    { href: '/submit', label: 'Submit Photos' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-sky/95 backdrop-blur-sm border-b border-ink/20">
      {/* Sunset accent stripe */}
      <div className="h-[3px] bg-sunset" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — replace <Logo /> with the actual asset once /public/logo.png is ready */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl text-ink tracking-wide">Davapalooza</span>
              <span className="font-sans font-bold text-[10px] uppercase tracking-[0.15em] text-ink/60">South O Block Party</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans font-semibold text-sm uppercase tracking-wide transition-colors ${
                    active
                      ? 'text-primary border-b-2 border-primary pb-0.5'
                      : 'text-ink hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <span className="text-ink/40 text-sm font-sans font-semibold uppercase tracking-wide cursor-not-allowed">
              Store
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ink hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-ink/20">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-2 font-sans font-semibold text-sm uppercase tracking-wide border-b border-ink/10 transition-colors ${
                    active ? 'text-primary' : 'text-ink hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            <span className="block py-3 px-2 text-ink/40 text-sm font-sans font-semibold uppercase tracking-wide">
              Store
            </span>
          </div>
        </div>
      )}
    </nav>
  )
}

