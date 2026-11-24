'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// The button (not just opening the link) does the unsubscribing, so mail
// scanners that pre-open links can't unsubscribe people by accident.
export default function UnsubscribePage() {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')

  const unsubscribe = async () => {
    setState('working')
    try {
      const token = new URLSearchParams(window.location.search).get('t') || ''
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ t: token }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="min-h-[60vh] py-16 px-4">
      <div className="max-w-md mx-auto">
        <SectionHeader title="Unsubscribe" subtitle="Stop store launch emails" as="h1" />
        <Card className="p-8 mt-8 text-center">
          {state === 'done' ? (
            <>
              <p className="text-text font-semibold mb-2">You&apos;re off the list.</p>
              <p className="text-muted text-sm mb-6">No more store emails from us. Thanks for the interest!</p>
              <Link href="/" className="text-primary underline underline-offset-4">
                Back to the site
              </Link>
            </>
          ) : (
            <>
              <p className="text-muted mb-6">Tap below to stop getting emails about the Davapalooza store.</p>
              <Button variant="primary" onClick={unsubscribe} disabled={state === 'working'}>
                {state === 'working' ? 'Working...' : 'Unsubscribe'}
              </Button>
              {state === 'error' && (
                <p role="alert" className="mt-4 text-sm font-semibold text-red-ink">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
