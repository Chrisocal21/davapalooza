'use client'

import { use } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// TODO: Fetch from API
const mockSubmissions: Record<string, Array<any>> = {
  'looks-good': [],
  'needs-review': [],
}

export default function QueuePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const queueType = type as 'looks-good' | 'needs-review'
  const submissions = mockSubmissions[queueType] || []
  
  const title = queueType === 'looks-good' ? 'Looks Good' : 'Needs Review'
  const subtitle = queueType === 'looks-good' ? 'Auto-triaged submissions' : 'Flagged for attention'

  const handleApprove = (id: string) => {
    console.log('Approving:', id)
    // TODO: Wire to API
  }

  const handleReject = (id: string) => {
    console.log('Rejecting:', id)
    // TODO: Wire to API
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title={title} subtitle={subtitle} align="left" />
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Count */}
        <div className="mb-6">
          <p className="text-muted font-mono">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} in queue
          </p>
        </div>

        {/* Submissions Grid */}
        {submissions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">No submissions in this queue</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                {/* Image Preview */}
                <div className="aspect-square bg-surface flex items-center justify-center border-b border-border">
                  <span className="text-muted">Photo Preview</span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-mono text-sm text-primary mb-1">{submission.handle}</p>
                    {submission.platform && (
                      <p className="text-muted text-xs">{submission.platform}</p>
                    )}
                  </div>

                  {submission.caption && (
                    <p className="text-text text-sm">{submission.caption}</p>
                  )}

                  <div className="flex gap-2">
                    <Badge variant={submission.textFilter === 'pass' ? 'approved' : 'flagged'}>
                      Text: {submission.textFilter}
                    </Badge>
                    <Badge variant={submission.imageScan === 'pass' ? 'approved' : 'flagged'}>
                      Image: {submission.imageScan}
                    </Badge>
                  </div>

                  <p className="text-muted text-xs font-mono">
                    Submitted {new Date(submission.submittedAt).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApprove(submission.id)}
                    >
                      ✓ Approve
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleReject(submission.id)}
                    >
                      ✕ Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
