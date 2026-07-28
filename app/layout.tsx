import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
