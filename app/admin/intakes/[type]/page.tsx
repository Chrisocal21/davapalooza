'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import YearSelect from '@/components/admin/YearSelect'
import Button from '@/components/ui/Button'
import { getIntake } from '@/lib/intakes'

type Item = Record<string, string | null> & { id: string; status: string; submitted_at: string }

const BADGE: Record<string, 'approved' | 'flagged' | 'pending'> = {
  new: 'pending',
  reviewed: 'pending',
  accepted: 'approved',
  confirmed: 'approved',
  declined: 'flagged',
  archived: 'flagged',
}

export default function AdminIntakePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const config = getIntake(type)
  if (!config) notFound()

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState('')
  const [yearInfo, setYearInfo] = useState<{ years: number[]; current: number }>({ years: [], current: new Date().getFullYear() })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/intakes/${type}${year ? `?year=${year}` : ''}`)
      .then(r => (r.ok ? r.json() : { items: [] }))
      .then(d => {
        setItems(d.items || [])
        if (d.years) setYearInfo({ years: d.years, current: d.current })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, year])

  const patch = async (id: string, body: Record<string, string>) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/intakes/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      })
      if (res.ok) setItems(prev => prev.map(i => (i.id === id ? { ...i, ...body } : i)))
    } finally {
      setSaving(null)
    }
  }

  const remove = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"? This can't be undone.`)) return
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/intakes/${type}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setItems(prev => prev.filter(x => x.id !== id))
        setExpandedId(null)
      }
    } finally {
      setSaving(null)
    }
  }

  const newCount = items.filter(i => i.status === 'new').length
  const detailFields = config.fields.filter(f => f.key !== config.titleField)
  const emailKey = config.fields.find(f => f.key === 'email' || f.key === 'contact_email')?.key
  const subtitle = (i: Item) =>
    [i.contact_name, i[emailKey ?? ''], i.role].filter(Boolean).join(' · ')

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionHeader title={config.label} subtitle={config.description} align="left" />
            {newCount > 0 && <p className="text-sm text-primary font-mono mt-1">{newCount} new</p>}
          </div>
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors text-sm">
            ← Dashboard
          </Link>
        </div>

        <YearSelect years={yearInfo.years} current={yearInfo.current} value={year} onChange={setYear} />

        {loading ? (
          <p className="text-muted text-center py-16">Loading...</p>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted">Nothing here yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const isOpen = expandedId === item.id
              return (
                <Card key={item.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                    className="w-full text-left p-5 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-text truncate">{item[config.titleField]}</p>
                      <p className="text-sm text-muted truncate">{subtitle(item)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-xs text-muted font-mono hidden md:block">
                        {new Date(item.submitted_at).toLocaleDateString()}
                      </p>
                      <Badge variant={BADGE[item.status] ?? 'pending'}>{item.status}</Badge>
                      <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border p-5 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {detailFields.map(f => {
                          const v = item[f.key]
                          if (!v) return null
                          const href = f.key.includes('email')
                            ? `mailto:${v}`
                            : f.key.includes('phone')
                              ? `tel:${v}`
                              : /^https?:\/\//.test(v)
                                ? v
                                : undefined
                          return (
                            <div key={f.key} className={f.key === 'message' || f.key === 'other_info' ? 'md:col-span-2' : ''}>
                              <span className="text-muted font-mono">{f.label}: </span>
                              {href ? (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {v}
                                </a>
                              ) : (
                                <span className="text-text whitespace-pre-wrap">{v}</span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {config.statuses.map(s => (
                            <button
                              key={s}
                              onClick={() => patch(item.id, { status: s })}
                              disabled={saving === item.id}
                              className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                                item.status === s
                                  ? 'border-primary text-primary bg-primary/10'
                                  : 'border-border text-muted hover:border-primary hover:text-primary'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Admin Notes</p>
                        <textarea
                          value={notes[item.id] ?? item.admin_notes ?? ''}
                          onChange={e => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                          rows={3}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                        />
                        <Button
                          onClick={() => patch(item.id, { admin_notes: notes[item.id] ?? '' })}
                          disabled={saving === item.id}
                          variant="primary"
                          size="sm"
                          className="mt-2"
                        >
                          {saving === item.id ? 'Saving...' : 'Save Notes'}
                        </Button>
                        <Button
                          onClick={() => remove(item.id, String(item[config.titleField]))}
                          disabled={saving === item.id}
                          variant="danger"
                          size="sm"
                          className="mt-2 ml-2"
                        >
                          Delete
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
