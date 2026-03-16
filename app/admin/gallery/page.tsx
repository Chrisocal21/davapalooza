'use client'

import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// TODO: Fetch from API
const approvedPhotos: Array<{ id: string; handle: string; caption: string; approvedAt: string; views: number }> = []

export default function AdminGalleryPage() {
  const handleRemove = (id: string) => {
    console.log('Removing from gallery:', id)
    // TODO: Wire to API
  }

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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-4xl font-display text-primary mb-2">{approvedPhotos.length}</p>
            <p className="text-muted text-sm">Total Photos</p>
          </Card>
          <Card className="p-6">
            <p className="text-4xl font-display text-text mb-2">
              {approvedPhotos.reduce((sum, p) => sum + p.views, 0)}
            </p>
            <p className="text-muted text-sm">Total Views</p>
          </Card>
          <Card className="p-6">
            <p className="text-4xl font-display text-text mb-2">
              {new Set(approvedPhotos.map(p => p.handle)).size}
            </p>
            <p className="text-muted text-sm">Contributors</p>
          </Card>
        </div>

        {/* Photo Grid */}
        {approvedPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">No approved photos yet. Review and approve submissions from the moderation queues.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {approvedPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-surface flex items-center justify-center border-b border-border">
                  <span className="text-muted text-sm">Photo Preview</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-mono text-sm text-primary">{photo.handle}</p>
                    <p className="text-text text-sm mt-1">{photo.caption}</p>
                  </div>
                  <div className="text-muted text-xs font-mono">
                    <p>Approved: {new Date(photo.approvedAt).toLocaleDateString()}</p>
                    <p>Views: {photo.views}</p>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleRemove(photo.id)}
                  >
                    Remove from Gallery
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
