import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Davapalooza | South O Block Party',
    template: '%s | Davapalooza',
  },
  description: 'Free community block party on Griffin St, Oceanside CA — July 25, 2026. Live music, photos, and good vibes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://southoblockparty.com'),
  openGraph: {
    type: 'website',
    siteName: 'Davapalooza',
    title: 'Davapalooza | South O Block Party',
    description: 'Free community block party on Griffin St, Oceanside CA — July 25, 2026.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Davapalooza | South O Block Party',
    description: 'Free community block party on Griffin St, Oceanside CA — July 25, 2026.',
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
