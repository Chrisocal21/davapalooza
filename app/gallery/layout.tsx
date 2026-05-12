import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Community photos from Davapalooza — South O Block Party.',
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
