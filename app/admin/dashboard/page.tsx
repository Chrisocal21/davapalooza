'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface QueueStats {
  looksGood: number
  needsReview: number
  totalApproved: number
  totalRejected: number
  totalPending: number
  totalSubmissions: number
}

interface IntakeCounts {
  bands: number
  vendors: number
}

interface RecentActivity {
  id: string;
  handle: string;
  status: string;
  reviewed_at: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const [queueStats, setQueueStats] = useState<QueueStats>({
    looksGood: 0,
    needsReview: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
    totalSubmissions: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [intakeCounts, setIntakeCounts] = useState<IntakeCounts>({ bands: 0, vendors: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchIntakeCounts()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setQueueStats({
          looksGood: data.queueCounts.looks_good || 0,
          needsReview: data.queueCounts.needs_review || 0,
          totalApproved: data.statusCounts.approved || 0,
          totalRejected: data.statusCounts.rejected || 0,
          totalPending: data.statusCounts.pending || 0,
          totalSubmissions: data.statusCounts.total || 0,
        })
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIntakeCounts = async () => {
    try {
      const [bandsRes, vendorsRes] = await Promise.all([
        fetch('/api/admin/bands?status=new'),
        fetch('/api/admin/vendors?status=new'),
      ])
      const [bandsData, vendorsData] = await Promise.all([
        bandsRes.ok ? bandsRes.json() : { inquiries: [] },
        vendorsRes.ok ? vendorsRes.json() : { registrations: [] },
      ])
      setIntakeCounts({
        bands: (bandsData.inquiries || []).length,
        vendors: (vendorsData.registrations || []).length,
      })
    } catch {
      // non-critical
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <SectionHeader title="Admin Dashboard" subtitle="Moderation & Management" align="left" />
          <Link href="/" className="text-muted hover:text-primary transition-colors text-sm">
            ← Back to Site
          </Link>
        </div>

        {/* ── Photo Moderation ── */}
        <SectionLabel>Photo Moderation</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-primary mb-2">{queueStats.totalApproved}</p>
            <p className="text-muted text-sm">Total Approved</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-danger mb-2">{queueStats.totalRejected}</p>
            <p className="text-muted text-sm">Total Rejected</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-text mb-2">{queueStats.totalPending}</p>
            <p className="text-muted text-sm">Pending</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-display text-text mb-2">{queueStats.totalSubmissions}</p>
            <p className="text-muted text-sm">Total Submissions</p>
          </Card>
        </div>

        {/* ── Intakes ── */}
        <SectionLabel>Intakes</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/admin/bands">
            <Card className="p-6 hover:border-primary transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-display text-text">Band Inquiries</h4>
                {intakeCounts.bands > 0 && (
                  <Badge variant="pending">{intakeCounts.bands} new</Badge>
                )}
              </div>
              <p className="text-muted text-sm">Artist interest form submissions</p>
            </Card>
          </Link>

          <Link href="/admin/vendors">
            <Card className="p-6 hover:border-primary transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-display text-text">Vendor Registrations</h4>
                {intakeCounts.vendors > 0 && (
                  <Badge variant="pending">{intakeCounts.vendors} new</Badge>
                )}
              </div>
              <p className="text-muted text-sm">Market stall &amp; vendor sign-ups</p>
            </Card>
          </Link>

          <ComingSoonCard title="Volunteer Sign-ups" description="Day-of volunteer roster" />
          <ComingSoonCard title="Sponsor Inquiries" description="Paying / backing sponsor tier" />
          <ComingSoonCard title="Supporters" description="Photographer &amp; videographer interest" />
        </div>

        {/* ── Recent Photo Activity ── */}
        <SectionLabel>Recent Photo Activity</SectionLabel>

        <Card className="p-6 mb-12">
          {recentActivity.length === 0 ? (
            <p className="text-muted text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-surface/50 rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={`Submission by ${item.handle}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-primary truncate">{item.handle}</p>
                    <p className="text-xs text-muted">
                      {new Date(item.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={item.status === 'approved' ? 'approved' : 'flagged'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Content Management ── */}
        <SectionLabel>Content Management</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4 mt-2">
      {children}
    </p>
  )
}

function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-6 opacity-50 cursor-not-allowed select-none">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-xl font-display text-text">{title}</h4>
        <span className="text-xs font-mono text-muted border border-border rounded px-2 py-0.5">soon</span>
      </div>
      <p className="text-muted text-sm">{description}</p>
    </Card>
  )
}
