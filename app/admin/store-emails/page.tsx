'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface StoreEmail {
  id: string
  email: string
  captured_at: string
}

export default function AdminStoreEmailsPage() {
  const [emails, setEmails] = useState<StoreEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/admin/store-emails')
      .then(r => (r.ok ? r.json() : { emails: [] }))
      .then(d => setEmails(d.emails || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const remove = async (e: StoreEmail) => {
    if (!confirm(`Remove ${e.email} from the waitlist?`)) return
    const res = await fetch('/api/admin/store-emails', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: e.id }),
    })
    if (res.ok) setEmails(prev => prev.filter(x => x.id !== e.id))
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(emails.map(e => e.email).join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const downloadCsv = () => {
    const rows = ['email,signed_up', ...emails.map(e => `${e.email},${e.captured_at}`)]
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'store-waitlist.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionHeader title="Store Waitlist" subtitle="People waiting for the merch store" align="left" />
            <p className="text-sm text-primary font-mono mt-1">{emails.length} signed up</p>
          </div>
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors text-sm">
            ← Dashboard
          </Link>
        </div>

        {emails.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={copyAll}>
              {copied ? 'Copied!' : 'Copy all emails'}
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadCsv}>
              Download CSV
            </Button>
          </div>
        )}

        {loading ? (
          <p className="text-muted text-center py-16">Loading...</p>
        ) : emails.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted">No signups yet.</p>
          </Card>
        ) : (
          <Card className="divide-y divide-border">
            {emails.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <a href={`mailto:${e.email}`} className="text-text hover:text-primary truncate block">
                    {e.email}
                  </a>
                  <p className="text-xs text-muted font-mono">{new Date(e.captured_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => remove(e)}
                  className="text-sm text-danger underline underline-offset-4 hover:no-underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
