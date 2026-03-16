'use client'

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function StorePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire to API to save email
    console.log('Email submitted:', email)
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <SectionHeader 
          title="Store" 
          subtitle="Coming Soon"
        />

        <Card className="mt-12 p-12 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-surface rounded-full border-4 border-primary/20 flex items-center justify-center">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-4xl font-display text-primary mb-4">
              Merch is Coming
            </h2>
            <p className="text-text text-lg mb-6">
              T-shirts, stickers, posters, and more Davapalooza gear will be available soon. 
              Get notified when we launch!
            </p>
          </div>

          {submitted ? (
            <div className="bg-success/10 border border-success rounded-lg p-6">
              <p className="text-success font-medium">
                ✓ Thanks! We&apos;ll email you when the store launches.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <Button type="submit" variant="primary">
                  Notify Me
                </Button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted text-sm font-mono">
              Expected Launch: Summer 2026
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
