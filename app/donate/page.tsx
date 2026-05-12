'use client'

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const AMOUNTS = [5, 10, 25, 50]

const USES = [
  { icon: '🎸', text: 'Equipment and stage maintenance' },
  { icon: '🍉', text: 'Food & hydration for artists, staff, and guests' },
  { icon: '🧹', text: 'Keeping the block clean and beautiful' },
  { icon: '🛡️', text: 'Safety and security' },
  { icon: '🎉', text: 'Funding next year\'s event' },
]

export default function DonatePage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Support Davapalooza"
          subtitle="Help us keep the block party alive"
        />

        <Card className="mt-12 p-8 md:p-12">
          {/* Headline */}
          <div className="text-center mb-10">
            <h3 className="text-5xl font-display text-primary mb-4">Every Dollar Helps</h3>
            <p className="text-text text-lg leading-relaxed max-w-xl mx-auto">
              Davapalooza is a free community event made possible by neighbors like you.
            </p>
          </div>

          {/* Amount picker */}
          <div className="mb-10">
            <p className="text-muted font-mono text-xs tracking-widest uppercase text-center mb-4">Choose an amount</p>
            <div className="grid grid-cols-4 gap-3">
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelected(amt)}
                  className={`py-4 rounded-xl font-display text-2xl border-2 transition-all
                    ${selected === amt
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Donate buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <a href="https://venmo.com" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">Donate via Venmo</Button>
            </a>
            <a href="https://cash.app" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">Donate via Cash App</Button>
            </a>
          </div>

          {/* Where it goes */}
          <div className="border-t border-border pt-8">
            <h4 className="text-xl font-display text-text mb-5 text-center">Where Your Money Goes</h4>
            <ul className="space-y-3">
              {USES.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-4 bg-bg rounded-lg px-4 py-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-text">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <p className="mt-8 text-center text-muted text-sm">
          Davapalooza is organized by community volunteers. All donations go directly to event costs.
        </p>
      </div>
    </div>
  )
}
