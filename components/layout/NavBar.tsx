'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { NAV_CTA, NAV_LINKS, SITE, SOCIALS } from '@/lib/site'

const linkBase =
  "relative pb-1 pt-1.5 font-sans text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:rounded-full after:bg-ink " +
  "after:transition-transform after:duration-300 after:ease-out-expo after:content-['']"

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Navigating closes the menu.
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // While the menu is open: lock page scroll, close on Escape, and keep Tab
  // inside the header so focus can't wander behind the overlay.
  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !headerRef.current) return
      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      ).filter((el) => el.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      {/* Sunset accent stripe */}
      <div className="h-[3px] bg-sunset-h" aria-hidden="true" />

      <nav aria-label="Main" className="border-b-2 border-ink bg-sky">
        <div className="shell flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${SITE.event} — ${SITE.name}, home`}
            className="-ml-1 rounded p-1 transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`${linkBase} ${active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              <li
                className="flex cursor-default items-center gap-2 pt-0.5 font-sans text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink/85"
              >
                Store
                <SoonTag />
              </li>
            </ul>
            <Button href={NAV_CTA.href} size="sm">
              {NAV_CTA.label}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-cream lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] animate-fade-in overflow-y-auto overscroll-contain bg-ink text-cream lg:hidden"
        >
          <div className="shell flex min-h-full flex-col pb-8 pt-4">
            <ul className="flex-1">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href)
                return (
                  <li
                    key={link.href}
                    className="animate-rise border-b border-cream/15"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center justify-between py-4 font-display text-[3.25rem] leading-none tracking-wide ${
                        active ? 'text-sun-yellow' : 'text-cream'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                      <Icon
                        name="arrow-right"
                        size={26}
                        className="text-cream/40 transition-transform group-active:translate-x-1"
                      />
                    </Link>
                  </li>
                )
              })}
              <li
                className="flex animate-rise items-center gap-3 border-b border-cream/15 py-4 font-display text-[3.25rem] leading-none tracking-wide text-cream/45"
                style={{ animationDelay: `${NAV_LINKS.length * 55}ms` }}
              >
                Store
                <SoonTag onDark />
              </li>
            </ul>

            <div
              className="animate-rise space-y-6 pt-8"
              style={{ animationDelay: `${(NAV_LINKS.length + 1) * 55}ms` }}
            >
              <Button href={NAV_CTA.href} variant="secondary" size="lg" onDark className="w-full">
                {NAV_CTA.label}
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {SOCIALS.instagram && (
                  <a
                    href={SOCIALS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-cream"
                  >
                    <Icon name="instagram" size={18} />
                    Instagram
                  </a>
                )}
                <p className="font-mono text-sm tracking-wide text-cream/55">{SITE.hashtags[0]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function SoonTag({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      className={`rounded-sm px-1.5 pb-[0.2rem] pt-[0.3rem] font-mono text-[0.625rem] font-bold leading-none tracking-[0.14em] ${
        onDark ? 'bg-cream/15 text-cream/70' : 'bg-ink text-cream'
      }`}
    >
      SOON
    </span>
  )
}
