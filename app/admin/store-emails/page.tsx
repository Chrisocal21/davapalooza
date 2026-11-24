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
  last_emailed_at?: string | null
}

const DEFAULT_SUBJECT = 'The Davapalooza store is open!'
const DEFAULT_MESSAGE =
  'The wait is over. The Davapalooza merch store is officially open.\n\nTees, hoodies, hats, posters and more. Every purchase helps fund the event.'

export default function AdminStoreEmailsPage() {
  const [emails, setEmails] = useState<StoreEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [mailReady, setMailReady] = useState(false)
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const [testTo, setTestTo] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/store-emails')
      .then(r => (r.ok ? r.json() : { emails: [] }))
      .then(d => {
        setEmails(d.emails || [])
        setMailReady(!!d.mailConfigured)
      })
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

  const send = async (test: boolean) => {
    setStatus(null)
    if (test && !testTo.trim()) {
      setStatus({ ok: false, text: 'Enter your own email to send a test.' })
      return
    }
    if (!test && !confirm(`Send this to all ${emails.length} people on the waitlist? This can't be undone.`)) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/store-emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, testTo: test ? testTo.trim() : undefined }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus({
          ok: true,
          text: test
            ? `Test sent to ${testTo.trim()}. Check your inbox (and spam).`
            : `Sent to ${d.sent} ${d.sent === 1 ? 'person' : 'people'}${d.failed ? ` (${d.failed} failed)` : ''}.`,
        })
        if (!test) {
          const now = new Date().toISOString()
          setEmails(prev => prev.map(e => ({ ...e, last_emailed_at: now })))
        }
      } else {
        setStatus({ ok: false, text: d.error || 'Something went wrong.' })
      }
    } catch {
      setStatus({ ok: false, text: 'Something went wrong.' })
    } finally {
      setSending(false)
    }
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

  const field = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-text'

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

        <Card className="p-5 mb-6">
          <h2 className="font-display text-lg text-text mb-1">Announce the store</h2>
          <p className="text-sm text-muted mb-4">
            Emails everyone on the waitlist with a button to the shop. Each email has its own unsubscribe link.
          </p>
          {!mailReady && !loading && (
            <p className="text-sm mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-muted">
              Email sending isn&apos;t set up yet, so the send buttons are off. It needs a Resend API key and a sender address.
            </p>
          )}
          <label className="block text-xs font-mono text-muted mb-1" htmlFor="mail-subject">
            Subject
          </label>
          <input
            id="mail-subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            maxLength={150}
            className={`${field} mb-3`}
          />
          <label className="block text-xs font-mono text-muted mb-1" htmlFor="mail-message">
            Message (a &quot;Shop the merch&quot; button is added automatically)
          </label>
          <textarea
            id="mail-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            maxLength={5000}
            className={`${field} mb-3`}
          />
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-mono text-muted mb-1" htmlFor="mail-test">
                Send a test to
              </label>
              <input
                id="mail-test"
                type="email"
                value={testTo}
                onChange={e => setTestTo(e.target.value)}
                placeholder="you@example.com"
                className={field}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={() => send(true)} disabled={!mailReady || sending}>
              Send test
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => send(false)}
              disabled={!mailReady || sending || emails.length === 0}
            >
              {sending ? 'Sending...' : `Send to all ${emails.length}`}
            </Button>
          </div>
          {status && (
            <p role="status" className={`mt-3 text-sm font-semibold ${status.ok ? 'text-primary' : 'text-red-ink'}`}>
              {status.text}
            </p>
          )}
        </Card>

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
                  <p className="text-xs text-muted font-mono">
                    {new Date(e.captured_at).toLocaleString()}
                    {e.last_emailed_at && ` · emailed ${new Date(e.last_emailed_at).toLocaleDateString()}`}
                  </p>
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
