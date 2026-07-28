'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface BandInquiry {
  id: string
  band_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  genres: string | null
  instagram: string | null
  tiktok: string | null
  spotify: string | null
  website: string | null
  other_info: string | null
  submitted_at: string
  status: string
  admin_notes: string | null
}

const STATUS_COLORS: Record<string, 'approved' | 'flagged' | 'pending'> = {
  new: 'pending',
  reviewed: 'pending',
  accepted: 'approved',
  declined: 'flagged',
  archived: 'flagged',
}

const STATUSES = ['new', 'reviewed', 'accepted', 'declined', 'archived']

const PROMOTE_DEFAULT = { year: new Date().getFullYear().toString(), set_time: '', bio: '' }

export default function AdminBandsPage() {
  const [inquiries, setInquiries] = useState<BandInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const [promoteForm, setPromoteForm] = useState(PROMOTE_DEFAULT)
  const [promoteStatus, setPromoteStatus] = useState<Record<string, 'success' | 'error'>>({})
  const [promoting, setPromoting] = useState(false)

  useEffect(() => { fetchInquiries() }, [])

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/bands')
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries || [])
      }
    } catch { /* empty */ } finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setSaving(id)
    try {
      await fetch('/api/admin/bands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    } finally { setSaving(null) }
  }

  const handlePromote = async (inquiry: BandInquiry) => {
    setPromoting(true)
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiry.band_name,
          genre: inquiry.genres || '',
          bio: promoteForm.bio || inquiry.other_info || '',
          year: parseInt(promoteForm.year),
          set_time: promoteForm.set_time || '',
          instagram: inquiry.instagram || '',
          tiktok: inquiry.tiktok || '',
          spotify: inquiry.spotify || '',
          website: inquiry.website || '',
        }),
      })
      if (res.ok) {
        setPromoteStatus(prev => ({ ...prev, [inquiry.id]: 'success' }))
        setPromotingId(null)
        // Auto-set status to accepted
        if (inquiry.status !== 'accepted') {
          await fetch('/api/admin/bands', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: inquiry.id, status: 'accepted' }),
          })
          setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'accepted' } : i))
        }
      } else {
        setPromoteStatus(prev => ({ ...prev, [inquiry.id]: 'error' }))
      }
    } catch {
      setPromoteStatus(prev => ({ ...prev, [inquiry.id]: 'error' }))
    } finally {
      setPromoting(false)
    }
  }

  const saveNotes = async (id: string) => {
    setSaving(id)
    try {
      await fetch('/api/admin/bands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_notes: notes[id] ?? '' }),
      })
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, admin_notes: notes[id] ?? i.admin_notes } : i))
    } finally { setSaving(null) }
  }

  const newCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionHeader title="Band Inquiries" subtitle="Artist interest form submissions" align="left" />
            {newCount > 0 && (
              <p className="text-sm text-primary font-mono mt-1">{newCount} new</p>
            )}
          </div>
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors text-sm">
            ← Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-muted text-center py-16">Loading...</p>
        ) : inquiries.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted">No band inquiries yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inquiry => {
              const isOpen = expandedId === inquiry.id
              return (
                <Card key={inquiry.id} className="overflow-hidden">
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : inquiry.id)}
                    className="w-full text-left p-5 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-text truncate">{inquiry.band_name}</p>
                      <p className="text-sm text-muted truncate">
                        {inquiry.contact_name} · {inquiry.contact_email}
                        {inquiry.genres ? ` · ${inquiry.genres}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-xs text-muted font-mono hidden md:block">
                        {new Date(inquiry.submitted_at).toLocaleDateString()}
                      </p>
                      <Badge variant={STATUS_COLORS[inquiry.status] ?? 'pending'}>
                        {inquiry.status}
                      </Badge>
                      <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-border p-5 space-y-5">
                      {/* Contact + links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <Detail label="Email" value={inquiry.contact_email} href={`mailto:${inquiry.contact_email}`} />
                        {inquiry.contact_phone && <Detail label="Phone" value={inquiry.contact_phone} href={`tel:${inquiry.contact_phone}`} />}
                        {inquiry.genres && <Detail label="Genres" value={inquiry.genres} />}
                        {inquiry.instagram && <Detail label="Instagram" value={`@${inquiry.instagram}`} href={`https://instagram.com/${inquiry.instagram}`} />}
                        {inquiry.tiktok && <Detail label="TikTok" value={`@${inquiry.tiktok}`} href={`https://tiktok.com/@${inquiry.tiktok}`} />}
                        {inquiry.spotify && <Detail label="Spotify" value="Open link" href={inquiry.spotify} />}
                        {inquiry.website && <Detail label="Website" value={inquiry.website} href={inquiry.website} />}
                      </div>

                      {inquiry.other_info && (
                        <div>
                          <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Other Info</p>
                          <p className="text-sm text-text whitespace-pre-wrap">{inquiry.other_info}</p>
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(inquiry.id, s)}
                              disabled={saving === inquiry.id}
                              className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                                inquiry.status === s
                                  ? 'border-primary text-primary bg-primary/10'
                                  : 'border-border text-muted hover:border-primary hover:text-primary'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admin notes */}
                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Admin Notes</p>
                        <textarea
                          value={notes[inquiry.id] ?? (inquiry.admin_notes || '')}
                          onChange={e => setNotes(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                          rows={3}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                        />
                        <Button
                          onClick={() => saveNotes(inquiry.id)}
                          disabled={saving === inquiry.id}
                          variant="primary"
                          size="sm"
                          className="mt-2"
                        >
                          {saving === inquiry.id ? 'Saving...' : 'Save Notes'}
                        </Button>
                      </div>

                      {/* Add to Lineup */}
                      <div className="border-t-2 border-primary/30 pt-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
                            ⚡ Add to Artist Lineup
                          </p>
                          {promoteStatus[inquiry.id] === 'success' && (
                            <span className="text-xs font-mono text-success">Profile created!</span>
                          )}
                          {promoteStatus[inquiry.id] === 'error' && (
                            <span className="text-xs font-mono text-danger">Failed — try again</span>
                          )}
                        </div>
                        {promotingId !== inquiry.id ? (
                          <Button
                            onClick={() => {
                              setPromoteForm({ ...PROMOTE_DEFAULT, bio: inquiry.other_info || '' })
                              setPromotingId(inquiry.id)
                            }}
                            variant="secondary"
                            size="sm"
                          >
                            {promoteStatus[inquiry.id] === 'success' ? 'Add Again' : 'Create Artist Profile'}
                          </Button>
                        ) : (
                          <div className="space-y-3 bg-surface/20 rounded-lg p-4 border border-border">
                            <p className="text-xs text-muted font-mono">
                              This will create a profile for <strong className="text-text">{inquiry.band_name}</strong> with their inquiry data pre-filled.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-mono text-muted mb-1">Year *</label>
                                <input
                                  type="number"
                                  value={promoteForm.year}
                                  onChange={e => setPromoteForm(f => ({ ...f, year: e.target.value }))}
                                  className="w-full px-3 py-2 bg-bg border border-border rounded text-text text-sm focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-mono text-muted mb-1">Set Time</label>
                                <input
                                  type="text"
                                  value={promoteForm.set_time}
                                  onChange={e => setPromoteForm(f => ({ ...f, set_time: e.target.value }))}
                                  placeholder="e.g. 2:30 PM"
                                  className="w-full px-3 py-2 bg-bg border border-border rounded text-text text-sm focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-mono text-muted mb-1">Bio (for public profile)</label>
                              <textarea
                                value={promoteForm.bio}
                                onChange={e => setPromoteForm(f => ({ ...f, bio: e.target.value }))}
                                rows={3}
                                placeholder="Band bio for the public showcase..."
                                className="w-full px-3 py-2 bg-bg border border-border rounded text-text text-sm focus:outline-none focus:border-primary resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handlePromote(inquiry)}
                                disabled={promoting || !promoteForm.year}
                                variant="primary"
                                size="sm"
                              >
                                {promoting ? 'Creating...' : 'Confirm — Add to Lineup'}
                              </Button>
                              <Button
                                onClick={() => setPromotingId(null)}
                                variant="secondary"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <span className="text-muted font-mono">{label}: </span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {value}
        </a>
      ) : (
        <span className="text-text">{value}</span>
      )}
    </div>
  )
}
