import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artist Lineup',
  description: 'Meet the artists performing at Davapalooza 2026.',
}

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
