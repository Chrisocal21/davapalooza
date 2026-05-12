import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support Davapalooza and help keep the block party alive.',
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
