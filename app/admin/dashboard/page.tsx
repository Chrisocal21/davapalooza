'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function AdminDashboard() {
  const [queueStats, setQueueStats] = useState({
    looksGood: 0,
    needsReview: 0,
    totalApproved: 0,
    totalRejected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setQueueStats({
          looksGood: data.queueCounts.looks_good || 0,
          needsReview: data.queueCounts.needs_review || 0,
          totalApproved: 0, // Will enhance later
          totalRejected: 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
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
          <p className="text-muted text-center py-8">No recent activity</p>
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
