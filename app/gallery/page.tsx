import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'

// TODO: Fetch from API
const mockPhotos: Array<{
  id: string;
  handle: string;
  caption: string;
  watermarkedUrl: string;
  submittedAt: string;
}> = []

export default function GalleryPage() {
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
            Showing {mockPhotos.length} photos
          </div>
          <select className="bg-surface border border-border text-text px-4 py-2 rounded-lg font-sans">
            <option>All Years</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>

        {/* Masonry Grid */}
        {mockPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg mb-4">No photos yet. Be the first to submit!</p>
            <Link href="/submit" className="text-primary hover:text-primary/80 font-medium">
              Submit a Photo →
            </Link>
          </Card>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {mockPhotos.map((photo) => (
              <Card key={photo.id} className="gallery-tile break-inside-avoid overflow-hidden">
                <div className="aspect-square bg-surface flex items-center justify-center border-b border-border">
                  <span className="text-muted text-sm">Photo Preview</span>
                </div>
                <div className="p-4">
                  <p className="font-mono text-sm text-primary mb-1">{photo.handle}</p>
                  <p className="text-text text-sm mb-2">{photo.caption}</p>
                  <p className="text-muted text-xs font-mono">
                    {new Date(photo.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination - only show if there are photos */}
        {mockPhotos.length > 0 && (
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 bg-surface border border-border rounded-lg text-text hover:border-primary transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-bg rounded-lg font-medium">
              1
            </button>
            <button className="px-4 py-2 bg-surface border border-border rounded-lg text-text hover:border-primary transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-surface border border-border rounded-lg text-text hover:border-primary transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
