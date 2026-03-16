import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/layout/NavBar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Davapalooza | South O Block Party',
  description: 'Community block party event in South O - photos, artists, news, and more',
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
