'use client'

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const inputCls =
  'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors'
const labelCls = 'block text-muted text-sm font-mono mb-1'

const EMPTY = {
  band_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  genres: '',
  instagram: '',
  tiktok: '',
  spotify: '',
  website: '',
  other_info: '',
}

export default function BandsPage() {
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
      const res = await fetch('/api/bands', {
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
          <p className="text-5xl mb-4">🎸</p>
          <h2 className="text-3xl font-display text-primary mb-3">We got it!</h2>
          <p className="text-muted">
            Thanks for reaching out. We&apos;ll be in touch once we review your submission.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          title="Play Davapalooza"
          subtitle="Fill out the form below and we'll be in touch. All genres welcome."
          align="left"
        />

        <Card className="p-8 mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Band info */}
            <div>
              <label className={labelCls}>Band / Artist Name *</label>
              <input
                type="text"
                value={form.band_name}
                onChange={e => set('band_name', e.target.value)}
                placeholder="The Whatever Band"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Genre(s)</label>
              <input
                type="text"
                value={form.genres}
                onChange={e => set('genres', e.target.value)}
                placeholder="Hip-hop, R&B, funk..."
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

            {/* Socials */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Links & Socials</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Instagram (without @)</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={e => set('instagram', e.target.value)}
                    placeholder="yourbandhandle"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>TikTok (without @)</label>
                  <input
                    type="text"
                    value={form.tiktok}
                    onChange={e => set('tiktok', e.target.value)}
                    placeholder="yourbandhandle"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Spotify Artist URL</label>
                  <input
                    type="url"
                    value={form.spotify}
                    onChange={e => set('spotify', e.target.value)}
                    placeholder="https://open.spotify.com/artist/..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => set('website', e.target.value)}
                    placeholder="https://yoursite.com"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Other info */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">About Your Band</p>
              <div>
                <label className={labelCls}>Band Bio *</label>
                <textarea
                  value={form.other_info}
                  onChange={e => set('other_info', e.target.value)}
                  rows={5}
                  required
                  placeholder="Tell us about your band — your sound, your story, what makes you Davapalooza material. This becomes your public profile if you're selected."
                  className={inputCls}
                />
              </div>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
