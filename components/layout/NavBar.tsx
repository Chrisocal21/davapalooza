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
    { href: '/artists', label: 'Artists' },
    { href: '/news', label: 'News' },
    { href: '/donate', label: 'Donate' },
    { href: '/submit', label: 'Submit Photos' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border">
      {/* Gradient accent stripe */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl text-primary hover:text-primary/80 transition-colors">
            DAVAPALOOZA
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${active ? 'text-primary' : 'text-text hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              )
            })}
            <span className="text-muted cursor-not-allowed">
              Store <span className="text-xs">(Coming Soon)</span>
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
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
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block transition-colors py-2 ${active ? 'text-primary' : 'text-text hover:text-primary'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            <span className="block text-muted py-2">
              Store <span className="text-xs">(Coming Soon)</span>
            </span>
          </div>
        </div>
      )}
    </nav>
  )
}
