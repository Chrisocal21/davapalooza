'use client'

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const inputCls =
  'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors'
const labelCls = 'block text-muted text-sm font-mono mb-1'

const EMPTY = {
  business_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  product_description: '',
  space_needs: '',
}

export default function VendorsPage() {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-lg p-10 text-center">
          <p className="text-5xl mb-4">🎪</p>
          <h2 className="text-3xl font-display text-primary mb-3">You&apos;re on the list!</h2>
          <p className="text-muted">
            Thanks for reaching out. We&apos;ll be in touch soon with next steps.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          title="Set Up a Booth"
          subtitle="Vendors work for tips — no fees, no sales. Tell us about your setup and we'll be in touch."
          align="left"
        />

        <Card className="p-8 mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business info */}
            <div>
              <label className={labelCls}>Business / Vendor Name *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
                placeholder="Your Business Name"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>What do you offer / do? *</label>
              <textarea
                value={form.product_description}
                onChange={e => set('product_description', e.target.value)}
                rows={3}
                placeholder="Food, art, hair braiding, etc. — quick description of what you bring."
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Space / Setup Needs</label>
              <input
                type="text"
                value={form.space_needs}
                onChange={e => set('space_needs', e.target.value)}
                placeholder="10x10 tent, food truck, table only..."
                className={inputCls}
              />
            </div>

            {/* Contact */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Contact Info</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Your Name *</label>
                  <input
                    type="text"
                    value={form.contact_name}
                    onChange={e => set('contact_name', e.target.value)}
                    placeholder="Full name"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={e => set('contact_email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone (optional)</label>
                  <input
                    type="tel"
                    value={form.contact_phone}
                    onChange={e => set('contact_phone', e.target.value)}
                    placeholder="(555) 000-0000"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Sending...' : 'Request a Booth'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
