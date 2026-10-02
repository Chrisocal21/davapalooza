'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field, { FieldGroup, FormError } from '@/components/ui/Field'
import { FormPage, FormSuccess, Steps } from '@/components/ui/FormLayout'

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
      <FormSuccess
        icon="music"
        title="We got it!"
        actions={
          <Button href="/lineup" variant="secondary">
            See the Lineup
          </Button>
        }
      >
        Thanks for reaching out. We&apos;ll be in touch once we review your submission.
      </FormSuccess>
    )
  }

  return (
    <FormPage
      eyebrow="Band inquiry"
      title="Play Davapalooza"
      lede="Fill out the form below and we'll be in touch. All genres welcome."
      aside={
        <Steps
          title="Good to know"
          items={[
            'Local and regional artists play across the day.',
            'All genres are welcome — the lineup has always reflected what the community actually listens to.',
            "Your bio becomes your public profile if you're selected.",
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Band info */}
        <Field label="Band / Artist Name" htmlFor="band_name" required>
          <input
            id="band_name"
            type="text"
            value={form.band_name}
            onChange={e => set('band_name', e.target.value)}
            placeholder="The Whatever Band"
            className="field"
            required
          />
        </Field>

        <Field label="Genre(s)" htmlFor="genres">
          <input
            id="genres"
            type="text"
            value={form.genres}
            onChange={e => set('genres', e.target.value)}
            placeholder="Hip-hop, R&B, funk..."
            className="field"
          />
        </Field>

        {/* Contact */}
        <FieldGroup title="Contact Info">
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
            <Field label="Your Name" htmlFor="contact_name" required>
              <input
                id="contact_name"
                type="text"
                value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className="field"
                required
              />
            </Field>
            <Field label="Email" htmlFor="contact_email" required>
              <input
                id="contact_email"
                type="email"
                value={form.contact_email}
                onChange={e => set('contact_email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="field"
                required
              />
            </Field>
            <Field label="Phone (optional)" htmlFor="contact_phone">
              <input
                id="contact_phone"
                type="tel"
                value={form.contact_phone}
                onChange={e => set('contact_phone', e.target.value)}
                placeholder="(555) 000-0000"
                autoComplete="tel"
                className="field"
              />
            </Field>
          </div>
        </FieldGroup>

        {/* Socials */}
        <FieldGroup title="Links & Socials">
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
            <Field label="Instagram (without @)" htmlFor="instagram">
              <input
                id="instagram"
                type="text"
                value={form.instagram}
                onChange={e => set('instagram', e.target.value)}
                placeholder="yourbandhandle"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="field"
              />
            </Field>
            <Field label="TikTok (without @)" htmlFor="tiktok">
              <input
                id="tiktok"
                type="text"
                value={form.tiktok}
                onChange={e => set('tiktok', e.target.value)}
                placeholder="yourbandhandle"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="field"
              />
            </Field>
            <Field label="Spotify Artist URL" htmlFor="spotify">
              <input
                id="spotify"
                type="url"
                value={form.spotify}
                onChange={e => set('spotify', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
                className="field"
              />
            </Field>
            <Field label="Website" htmlFor="website">
              <input
                id="website"
                type="url"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="https://yoursite.com"
                className="field"
              />
            </Field>
          </div>
        </FieldGroup>

        {/* Other info */}
        <FieldGroup title="About Your Band">
          <Field label="Band Bio" htmlFor="other_info" required>
            <textarea
              id="other_info"
              value={form.other_info}
              onChange={e => set('other_info', e.target.value)}
              rows={5}
              required
              placeholder="Tell us about your band — your sound, your story, what makes you Davapalooza material. This becomes your public profile if you're selected."
              className="field"
            />
          </Field>
        </FieldGroup>

        <FormError>{error}</FormError>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Sending...' : 'Submit Inquiry'}
        </Button>
      </form>
    </FormPage>
  )
}
