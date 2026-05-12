import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and announcements from Davapalooza.',
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
