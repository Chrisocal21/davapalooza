'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import ImageViewer from '@/components/ui/ImageViewer'
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

  // Flat index for viewer (preserves click-to-open position)
  const openViewer = (photo: GalleryPhoto) => {
    setViewerIndex(filtered.findIndex(p => p.id === photo.id))
    setViewerOpen(true)
  }

  const PhotoCard = ({ photo }: { photo: GalleryPhoto }) => (
    <Card className="gallery-tile break-inside-avoid overflow-hidden mb-4">
      <div
        className="bg-surface border-b border-border cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
        onClick={() => openViewer(photo)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.imageUrl}
          alt={photo.caption || `Photo by ${photo.handle}`}
          className="w-full h-auto"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-sm text-primary mb-1">{photo.handle}</p>
            {photo.caption && <p className="text-text text-sm mb-2">{photo.caption}</p>}
            <p className="text-muted text-xs font-mono">
              {new Date(photo.approved_at).toLocaleDateString()}
            </p>
          </div>
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/gallery`}
            text={`Check out this photo from Davapalooza by ${photo.handle}! #SouthOBlockParty`}
            variant="icon"
            className="shrink-0 -mt-1 -mr-1"
          />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Photo Gallery"
          subtitle="Community snapshots from the block"
        />

        {/* Year filter tabs */}
        {!loading && years.length > 0 && (
          <div className="mt-8 mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
                selectedYear === 'all'
                  ? 'bg-primary text-bg'
                  : 'bg-surface text-muted hover:text-text border border-border'
              }`}
            >
              All Years
            </button>
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
                  selectedYear === y
                    ? 'bg-primary text-bg'
                    : 'bg-surface text-muted hover:text-text border border-border'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        <div className="mb-4 text-muted font-mono text-sm">
          {loading ? 'Loading...' : `${filtered.length} photo${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">Loading photos...</p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg mb-4">No photos yet. Be the first to submit!</p>
            <Link href="/submit" className="text-primary hover:text-primary/80 font-medium">
              Submit a Photo →
            </Link>
          </Card>
        ) : selectedYear !== 'all' ? (
          // Single year — flat masonry grid
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filtered.map(photo => <PhotoCard key={photo.id} photo={photo} />)}
          </div>
        ) : (
          // All years — grouped sections
          <div className="space-y-12">
            {groupedYears.map(year => (
              <section key={year}>
                <h2 className="text-3xl font-display text-ink mb-4">
                  DAVAPALOOZA {year}
                  <span className="text-muted font-mono text-sm ml-3 font-normal normal-case tracking-normal">
                    {byYear[year].length} photo{byYear[year].length !== 1 ? 's' : ''}
                  </span>
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {byYear[year].map(photo => <PhotoCard key={photo.id} photo={photo} />)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Image Viewer */}
        {viewerOpen && filtered.length > 0 && (
          <ImageViewer
            images={filtered.map(p => ({
              id: p.id,
              url: p.imageUrl,
              handle: p.handle,
              caption: p.caption,
            }))}
            initialIndex={viewerIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </div>
    </div>
  )
}


export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        setPhotos(data.photos || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching gallery:', err);
        setLoading(false);
      });
  }, []);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Photo Gallery" 
          subtitle="Community snapshots from the block"
        />

        {/* Filter Bar */}
        <div className="mt-8 mb-8 flex items-center justify-between">
          <div className="text-muted font-mono text-sm">
            {loading ? 'Loading...' : `Showing ${photos.length} photos`}
          </div>
          <select className="bg-surface border border-border text-text px-4 py-2 rounded-lg font-sans">
            <option>All Years</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">Loading photos...</p>
          </Card>
        ) : photos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg mb-4">No photos yet. Be the first to submit!</p>
            <Link href="/submit" className="text-primary hover:text-primary/80 font-medium">
              Submit a Photo →
            </Link>
          </Card>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className="gallery-tile break-inside-avoid overflow-hidden">
                <div 
                  className="aspect-square bg-surface flex items-center justify-center border-b border-border cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                  onClick={() => openViewer(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || `Photo by ${photo.handle}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-primary mb-1">{photo.handle}</p>
                      {photo.caption && <p className="text-text text-sm mb-2">{photo.caption}</p>}
                      <p className="text-muted text-xs font-mono">
                        {new Date(photo.approved_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ShareButton
                      url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/gallery`}
                      text={`Check out this photo from Davapalooza by ${photo.handle}! #SouthOBlockParty`}
                      variant="icon"
                      className="shrink-0 -mt-1 -mr-1"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Image Viewer */}
        {viewerOpen && photos.length > 0 && (
          <ImageViewer
            images={photos.map(p => ({
              id: p.id,
              url: p.imageUrl,
              handle: p.handle,
              caption: p.caption,
            }))}
            initialIndex={viewerIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
