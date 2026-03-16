'use client'

import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// TODO: Fetch from API
const queueStats = {
  looksGood: 0,
  needsReview: 0,
  totalApproved: 0,
  totalRejected: 0,
}

const recentActivity: Array<{ id: number; action: string; handle: string; time: string }> = []

export default function AdminDashboard() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="Admin Dashboard" subtitle="Moderation & Management" align="left" />
          <Link href="/" className="text-muted hover:text-primary transition-colors">
            ← Back to Site
          </Link>
        </div>

        {/* Queue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/admin/queue/looks-good">
            <Card className="p-8 hover:border-success transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-display text-text">Looks Good</h3>
                <Badge variant="approved">Auto-triaged</Badge>
              </div>
              <p className="text-6xl font-display text-success mb-2">
                {queueStats.looksGood}
              </p>
              <p className="text-muted">submissions ready to review</p>
            </Card>
          </Link>

          <Link href="/admin/queue/needs-review">
            <Card className="p-8 hover:border-warning transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-display text-text">Needs Review</h3>
                <Badge variant="flagged">Flagged</Badge>
              </div>
              <p className="text-6xl font-display text-warning mb-2">
                {queueStats.needsReview}
              </p>
              <p className="text-muted">submissions flagged for review</p>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-primary mb-2">
              {queueStats.totalApproved}
            </p>
            <p className="text-muted text-sm">Total Approved</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-danger mb-2">
              {queueStats.totalRejected}
            </p>
            <p className="text-muted text-sm">Total Rejected</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-text mb-2">
              {queueStats.looksGood + queueStats.needsReview}
            </p>
            <p className="text-muted text-sm">Pending</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-text mb-2">
              {queueStats.totalApproved + queueStats.totalRejected + queueStats.looksGood + queueStats.needsReview}
            </p>
            <p className="text-muted text-sm">Total Submissions</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-2xl font-display text-text mb-6">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-muted text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.action === 'Approved' ? 'approved' : 'rejected'}>
                      {item.action}
                    </Badge>
                    <span className="text-text font-mono">{item.handle}</span>
                  </div>
                  <span className="text-muted text-sm">{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/admin/gallery">
            <Card className="p-6 hover:border-primary transition-all cursor-pointer">
              <h4 className="text-xl font-display text-text mb-2">Gallery</h4>
              <p className="text-muted text-sm">Manage approved photos</p>
            </Card>
          </Link>
          <Link href="/admin/artists">
            <Card className="p-6 hover:border-primary transition-all cursor-pointer">
              <h4 className="text-xl font-display text-text mb-2">Artists</h4>
              <p className="text-muted text-sm">Add/edit artist lineup</p>
            </Card>
          </Link>
          <Link href="/admin/news">
            <Card className="p-6 hover:border-primary transition-all cursor-pointer">
              <h4 className="text-xl font-display text-text mb-2">News</h4>
              <p className="text-muted text-sm">Create/edit news posts</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
