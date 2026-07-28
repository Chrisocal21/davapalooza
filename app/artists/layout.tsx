import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Legends — Davapalooza',
  description: 'Every act that has ever graced the Davapalooza stage.',
}

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
