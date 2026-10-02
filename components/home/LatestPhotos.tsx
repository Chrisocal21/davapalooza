'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import SectionHeader from '@/components/ui/SectionHeader'

interface Photo {
  id: string
  handle: string
  caption?: string | null
  imageUrl: string
}

// One big photo and a block of small ones. How many small ones depends on how
// many photos exist, so the grid always closes into a clean rectangle.
function pick(photos: Photo[]): { feature: Photo | null; rest: Photo[] } {
  if (photos.length >= 9) return { feature: photos[0], rest: photos.slice(1, 9) }
  if (photos.length >= 5) return { feature: photos[0], rest: photos.slice(1, 5) }
  return { feature: null, rest: photos.slice(0, 4) }
}

export default function LatestPhotos() {
  // null while loading
  const [photos, setPhotos] = useState<Photo[] | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => setPhotos(data.photos || []))
      .catch(() => setPhotos([]))
  }, [])

  const { feature, rest } = pick(photos ?? [])

  return (
    <section aria-labelledby="photos-title" className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeader
          id="photos-title"
          align="left"
          size="lg"
          eyebrow="From the block"
          title="Latest Photos"
          subtitle="Community snapshots from the block"
          action={
            <Button href="/gallery" variant="secondary">
              View Full Gallery
              <Icon name="arrow-right" size={18} className="-mt-0.5" />
            </Button>
          }
        />

        <div className="mt-10 sm:mt-12">
          {photos === null ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" aria-hidden="true">
              <div className="skeleton col-span-2 row-span-2 aspect-square rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="rounded-md border-2 border-dashed border-ink/30 px-6 py-14 text-center">
              <Icon name="camera" size={36} className="mx-auto text-ink/50" />
              <p className="mx-auto mt-4 max-w-md text-xl leading-snug text-ink">
                No photos yet. Be the first to share your Davapalooza moments!
              </p>
              <Button href="/submit" className="mt-7">
                Submit Your Photos
              </Button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {feature && (
                <li className="col-span-2 row-span-2">
                  <PhotoTile photo={feature} feature />
                </li>
              )}
              {rest.map((photo, i) => (
                // On a phone, a second block of four would push the page too long.
                <li key={photo.id} className={i >= 4 ? 'hidden md:block' : ''}>
                  <PhotoTile photo={photo} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function PhotoTile({ photo, feature = false }: { photo: Photo; feature?: boolean }) {
  return (
    <Link
      href="/gallery"
      className="group relative block aspect-square overflow-hidden rounded bg-ink/10"
      aria-label={`${photo.caption || `Photo by ${photo.handle}`} — open the gallery`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
      />
      <span
        className={`absolute bottom-0 left-0 max-w-full truncate bg-ink px-2.5 pb-1.5 pt-2 font-mono text-[0.6875rem] leading-none tracking-wide text-cream transition-opacity duration-200 ${
          feature ? 'sm:text-xs' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        }`}
      >
        {photo.handle}
      </span>
    </Link>
  )
}
