import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Play Davapalooza',
  description: 'Interested in performing at Davapalooza 2026? Fill out our band inquiry form.',
}

export default function BandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
