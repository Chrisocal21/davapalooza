'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import ImageViewer from '@/components/ui/ImageViewer'
import PageHeader from '@/components/ui/PageHeader'
import ShareButton from '@/components/ui/ShareButton'

interface GalleryPhoto {
  id: string;
  submission_id: string;
  handle: string;
  caption: string | null;
  watermarked_r2_key: string;
  approved_at: string;
  imageUrl: string;
  year: number | null;
}

function photoYear(p: GalleryPhoto): number {
  return p.year ?? new Date(p.approved_at).getFullYear()
}

const count = (n: number) => `${n} photo${n !== 1 ? 's' : ''}`

function PhotoCard({ photo, onOpen }: { photo: GalleryPhoto; onOpen: () => void }) {
  return (
    <figure className="gallery-tile mb-4 break-inside-avoid overflow-hidden rounded border border-ink/15 bg-paper sm:mb-5">
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full cursor-zoom-in overflow-hidden bg-ink/10 focus-visible:outline-offset-[-3px]"
        aria-label={`Open photo by ${photo.handle}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.imageUrl}
          alt={photo.caption || `Photo by ${photo.handle}`}
          loading="lazy"
          decoding="async"
          className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      </button>
      <figcaption className="flex items-start justify-between gap-3 px-4 pb-3.5 pt-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-bold tracking-wide text-red-ink">{photo.handle}</p>
          {photo.caption && <p className="mt-1 text-[0.95rem] leading-snug text-ink">{photo.caption}</p>}
          <p className="mt-1.5 font-mono text-xs tracking-wide text-muted">
            <time dateTime={photo.approved_at}>
              {new Date(photo.approved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </p>
        </div>
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/gallery`}
          text={`Check out this photo from Davapalooza by ${photo.handle}! #SouthOBlockParty`}
          variant="icon"
          className="shrink-0"
        />
      </figcaption>
    </figure>
  )
}

const masonry = 'columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 xl:columns-4'

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setPhotos(data.photos || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // All distinct years, most recent first
  const years = [...new Set(photos.map(photoYear))].sort((a, b) => b - a)

  const filtered = selectedYear === 'all' ? photos : photos.filter(p => photoYear(p) === selectedYear)

  // For "all" view, group by year descending
  const byYear = filtered.reduce<Record<number, GalleryPhoto[]>>((acc, p) => {
    const y = photoYear(p)
    ;(acc[y] ??= []).push(p)
    return acc
  }, {})
  const groupedYears = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  // The viewer steps through photos in the order they appear on the page.
  const ordered = selectedYear === 'all' ? groupedYears.flatMap(y => byYear[y]) : filtered

  const openViewer = (photo: GalleryPhoto) => {
    setViewerIndex(ordered.findIndex(p => p.id === photo.id))
    setViewerOpen(true)
  }

  const chipCls = (active: boolean) =>
    `rounded-full border-2 px-4 pb-1.5 pt-2 font-mono text-sm font-bold leading-none transition-colors ${
      active ? 'border-ink bg-ink text-cream' : 'border-ink/25 bg-transparent text-ink hover:border-ink'
    }`

  return (
    <>
      <PageHeader
        eyebrow="Community-submitted"
        title="Photo Gallery"
        lede="Community snapshots from the block"
      >
        <Button href="/submit" size="lg">
          <Icon name="camera" size={20} className="-mt-0.5" />
          Submit a Photo
        </Button>
      </PageHeader>

      <div className="min-h-[50vh] bg-cream py-12 sm:py-16">
        <div className="shell">
          {/* Year filter + count */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-5">
            {!loading && years.length > 0 ? (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by year">
                <button type="button" aria-pressed={selectedYear === 'all'} onClick={() => setSelectedYear('all')} className={chipCls(selectedYear === 'all')}>
                  All Years
                </button>
                {years.map(y => (
                  <button type="button" key={y} aria-pressed={selectedYear === y} onClick={() => setSelectedYear(y)} className={chipCls(selectedYear === y)}>
                    {y}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}
            <p className="eyebrow text-muted" aria-live="polite">
              {loading ? 'Loading…' : count(filtered.length)}
            </p>
          </div>

          {loading ? (
            <div className={masonry} aria-hidden="true">
              {[72, 100, 130, 88, 120, 76, 104, 92].map((ratio, i) => (
                <div key={i} className="skeleton mb-4 break-inside-avoid rounded sm:mb-5" style={{ paddingBottom: `${ratio}%` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border-2 border-dashed border-ink/30 px-6 py-16 text-center">
              <Icon name="camera" size={36} className="mx-auto text-ink/50" />
              <p className="mt-4 text-xl text-ink">No photos yet. Be the first to submit!</p>
              <Button href="/submit" className="mt-7">
                Submit a Photo
                <Icon name="arrow-right" size={18} className="-mt-0.5" />
              </Button>
            </div>
          ) : selectedYear !== 'all' ? (
            // Single year — flat masonry grid
            <div className={masonry}>
              {filtered.map(photo => <PhotoCard key={photo.id} photo={photo} onOpen={() => openViewer(photo)} />)}
            </div>
          ) : (
            // All years — grouped sections
            <div className="space-y-14">
              {groupedYears.map(year => (
                <section key={year} aria-labelledby={`gallery-${year}`}>
                  <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 id={`gallery-${year}`} className="font-display text-display-md text-ink">
                      Davapalooza {year}
                    </h2>
                    <p className="eyebrow text-muted">{count(byYear[year].length)}</p>
                  </div>
                  <div className={masonry}>
                    {byYear[year].map(photo => <PhotoCard key={photo.id} photo={photo} onOpen={() => openViewer(photo)} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer */}
      {viewerOpen && ordered.length > 0 && (
        <ImageViewer
          images={ordered.map(p => ({
            id: p.id,
            url: p.imageUrl,
            handle: p.handle,
            caption: p.caption,
          }))}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  )
}
