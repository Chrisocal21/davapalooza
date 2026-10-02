import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lineup',
  description: 'Who is playing Davapalooza — the lineup, set times and flyer for South O Block Party.',
}

export default function LineupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
