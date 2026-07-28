import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About South O Block Party — a free community event on Griffin St in Oceanside, CA.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
