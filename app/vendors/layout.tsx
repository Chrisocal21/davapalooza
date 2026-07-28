import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set Up a Booth',
  description: 'Want to set up a booth at Davapalooza 2026? Vendors work for tips — no fees, no sales.',
}

export default function VendorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
