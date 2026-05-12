'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageViewer from '@/components/ui/ImageViewer'

interface GalleryPhoto {
  id: string;
  submission_id: string;
  handle: string;
  caption: string | null;
  watermarked_r2_key: string;
  approved_at: string;
  imageUrl: string;
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [trashedPhotos, setTrashedPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [showTrash, setShowTrash] = useState(false)

  useEffect(() => {
    fetchPhotos()
    fetchTrash()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrash = async () => {
    try {
      const response = await fetch('/api/admin/trash')
      if (response.ok) {
        const data = await response.json()
        setTrashedPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Failed to fetch trash:', error)
    }
  }

  const handleMoveToTrash = async (id: string) => {
    if (!confirm('Move this photo to trash? You can restore it later.')) return

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        fetchPhotos()
        fetchTrash()
      }
    } catch (error) {
      console.error('Failed to move to trash:', error)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch('/api/admin/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        fetchPhotos()
        fetchTrash()
      }
    } catch (error) {
      console.error('Failed to restore:', error)
    }
  }

  const openViewer = (index: number) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  const displayPhotos = showTrash ? trashedPhotos : photos

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="Gallery Management" subtitle="Manage approved photos" align="left" />
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex gap-4">
          <Button
            variant={!showTrash ? 'primary' : 'secondary'}
            onClick={() => setShowTrash(false)}
          >
            Gallery ({photos.length})
          </Button>
          <Button
            variant={showTrash ? 'primary' : 'secondary'}
            onClick={() => setShowTrash(true)}
          >
            Trash ({trashedPhotos.length})
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-4xl font-display text-primary mb-2">{photos.length}</p>
            <p className="text-muted text-sm">Published Photos</p>
          </Card>
          <Card className="p-6">
            <p className="text-4xl font-display text-text mb-2">{trashedPhotos.length}</p>
            <p className="text-muted text-sm">In Trash</p>
          </Card>
          <Card className="p-6">
            <p className="text-4xl font-display text-text mb-2">
              {new Set(photos.map(p => p.handle)).size}
            </p>
            <p className="text-muted text-sm">Contributors</p>
          </Card>
        </div>

        {/* Photo Grid */}
        {displayPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">
              {showTrash 
                ? 'Trash is empty' 
                : 'No approved photos yet. Review and approve submissions from the moderation queues.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayPhotos.map((photo, index) => (
              <Card key={photo.id} className="overflow-hidden">
                <div 
                  className="aspect-square bg-surface border-b border-border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openViewer(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || `Photo by ${photo.handle}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-mono text-sm text-primary">{photo.handle}</p>
                    {photo.caption && <p className="text-text text-sm mt-1">{photo.caption}</p>}
                  </div>
                  <div className="text-muted text-xs font-mono">
                    <p>Approved: {new Date(photo.approved_at).toLocaleDateString()}</p>
                  </div>
                  {showTrash ? (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleRestore(photo.id)}
                    >
                      Restore to Gallery
                    </Button>
                  ) : (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleMoveToTrash(photo.id)}
                    >
                      Move to Trash
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Image Viewer */}
        {viewerOpen && displayPhotos.length > 0 && (
          <ImageViewer
            images={displayPhotos.map(p => ({
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
