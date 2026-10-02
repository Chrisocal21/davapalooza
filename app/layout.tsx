import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, League_Spartan, Space_Mono } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'

// Fonts are self-hosted by next/font: no request to Google at runtime, no
// render-blocking stylesheet, and the fallback is size-matched so text doesn't
// jump when the real face arrives.
const display = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sans = League_Spartan({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'South O Block Party',
    template: '%s | South O Block Party',
  },
  description: 'Free community block party on Griffin St, Oceanside CA. Live Music. Good People. Strong Community.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://southoblockparty.com'),
  openGraph: {
    type: 'website',
    siteName: 'South O Block Party',
    title: 'South O Block Party',
    description: 'Free community block party on Griffin St, Oceanside CA. Live Music. Good People. Strong Community.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'South O Block Party',
    description: 'Free community block party on Griffin St, Oceanside CA. Live Music. Good People. Strong Community.',
  },
}

export const viewport: Viewport = {
  themeColor: '#45BEE4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:border-2 focus:border-ink focus:bg-sun-yellow focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
