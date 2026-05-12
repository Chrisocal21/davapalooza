import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Photos',
  description: 'Share your Davapalooza photos with the community.',
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
