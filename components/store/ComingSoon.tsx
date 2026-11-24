'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Honeypot from '@/components/ui/Honeypot'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/store-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hp }),
      })
      if (res.ok) {
        setSubmitted(true)
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeader size="xl" eyebrow="Coming Soon" title="Store" />

      <div className="bg-cream py-14 sm:py-20">
        <div className="shell">
          <div className="mx-auto max-w-2xl rounded-md border-2 border-ink bg-paper p-8 text-center shadow-print-lg sm:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun-yellow text-ink">
              <Icon name="bag" size={28} />
            </span>
            <h2 className="mt-6 font-display text-display-lg text-sun-red">Merch is Coming</h2>
            <p className="mx-auto mt-4 max-w-lg text-xl leading-snug text-ink">
              T-shirts, stickers, posters, and more Davapalooza gear will be available soon.
              Get notified when we launch!
            </p>

            <div className="mt-9">
              {submitted ? (
                <p
                  role="status"
                  className="mx-auto flex max-w-md items-center justify-center gap-2.5 rounded border-2 border-success/50 bg-success/10 px-4 py-4 font-semibold text-success"
                >
                  <Icon name="check" size={20} />
                  Thanks! We&apos;ll email you when the store launches.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mx-auto max-w-md">
                  <Honeypot value={hp} onChange={setHp} />
                  <label htmlFor="store-email" className="sr-only">
                    Email address
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="store-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="field flex-1"
                      required
                    />
                    <Button type="submit" variant="primary" disabled={sending}>
                      {sending ? 'Saving...' : 'Notify Me'}
                    </Button>
                  </div>
                  {error && (
                    <p role="alert" className="mt-3 text-sm font-semibold text-red-ink">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>

            <p className="eyebrow mt-10 border-t-2 border-ink/10 pt-6 text-muted">Launching soon</p>
          </div>
        </div>
      </div>
    </>
  )
}
