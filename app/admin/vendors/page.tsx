'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface VendorRegistration {
  id: string
  business_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  product_description: string
  space_needs: string | null
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

export default function AdminVendorsPage() {
  const [registrations, setRegistrations] = useState<VendorRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { fetchRegistrations() }, [])

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/vendors')
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.registrations || [])
      }
    } catch { /* empty */ } finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setSaving(id)
    try {
      await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } finally { setSaving(null) }
  }

  const saveNotes = async (id: string) => {
    setSaving(id)
    try {
      await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_notes: notes[id] ?? '' }),
      })
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, admin_notes: notes[id] ?? r.admin_notes } : r))
    } finally { setSaving(null) }
  }

  const newCount = registrations.filter(r => r.status === 'new').length

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionHeader title="Booth Sign-ups" subtitle="Vendor booth requests (tip-based)" align="left" />
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
        ) : registrations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted">No vendor registrations yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map(reg => {
              const isOpen = expandedId === reg.id
              return (
                <Card key={reg.id} className="overflow-hidden">
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : reg.id)}
                    className="w-full text-left p-5 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-text truncate">{reg.business_name}</p>
                      <p className="text-sm text-muted truncate">
                        {reg.contact_name} · {reg.contact_email}
                        {reg.space_needs ? ` · ${reg.space_needs}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-xs text-muted font-mono hidden md:block">
                        {new Date(reg.submitted_at).toLocaleDateString()}
                      </p>
                      <Badge variant={STATUS_COLORS[reg.status] ?? 'pending'}>
                        {reg.status}
                      </Badge>
                      <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-border p-5 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <Detail label="Email" value={reg.contact_email} href={`mailto:${reg.contact_email}`} />
                        {reg.contact_phone && <Detail label="Phone" value={reg.contact_phone} href={`tel:${reg.contact_phone}`} />}
                        {reg.space_needs && <Detail label="Space Needs" value={reg.space_needs} />}
                      </div>

                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">What they&apos;re selling</p>
                        <p className="text-sm text-text whitespace-pre-wrap">{reg.product_description}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(reg.id, s)}
                              disabled={saving === reg.id}
                              className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                                reg.status === s
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
                          value={notes[reg.id] ?? (reg.admin_notes || '')}
                          onChange={e => setNotes(prev => ({ ...prev, [reg.id]: e.target.value }))}
                          rows={3}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                        />
                        <Button
                          onClick={() => saveNotes(reg.id)}
                          disabled={saving === reg.id}
                          variant="primary"
                          size="sm"
                          className="mt-2"
                        >
                          {saving === reg.id ? 'Saving...' : 'Save Notes'}
                        </Button>
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
