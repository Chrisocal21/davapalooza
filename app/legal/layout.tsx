import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal notices, liability disclaimer, and terms for South O Block Party.',
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
