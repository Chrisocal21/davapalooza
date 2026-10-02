'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field, { FieldGroup, FormError } from '@/components/ui/Field'
import { FormPage, FormSuccess, Steps } from '@/components/ui/FormLayout'

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
      <FormSuccess
        icon="tent"
        title="You're on the list!"
        actions={
          <Button href="/" variant="secondary">
            Head Home
          </Button>
        }
      >
        Thanks for reaching out. We&apos;ll be in touch soon with next steps.
      </FormSuccess>
    )
  }

  return (
    <FormPage
      eyebrow="Vendor booths"
      title="Set Up a Booth"
      lede="Vendors work for tips — no fees, no sales. Tell us about your setup and we'll be in touch."
      aside={
        <Steps
          title="Good to know"
          items={[
            'Vendors set up booths and work for tips.',
            'There are no fees to participate and no sales commissions collected.',
            'Food, art, a trade, or anything else that fits the neighborhood vibe.',
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Business info */}
        <Field label="Business / Vendor Name" htmlFor="business_name" required>
          <input
            id="business_name"
            type="text"
            value={form.business_name}
            onChange={e => set('business_name', e.target.value)}
            placeholder="Your Business Name"
            autoComplete="organization"
            className="field"
            required
          />
        </Field>

        <Field label="What do you offer / do?" htmlFor="product_description" required>
          <textarea
            id="product_description"
            value={form.product_description}
            onChange={e => set('product_description', e.target.value)}
            rows={3}
            placeholder="Food, art, hair braiding, etc. — quick description of what you bring."
            className="field"
            required
          />
        </Field>

        <Field label="Space / Setup Needs" htmlFor="space_needs">
          <input
            id="space_needs"
            type="text"
            value={form.space_needs}
            onChange={e => set('space_needs', e.target.value)}
            placeholder="10x10 tent, food truck, table only..."
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

        <FormError>{error}</FormError>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Sending...' : 'Request a Booth'}
        </Button>
      </form>
    </FormPage>
  )
}
