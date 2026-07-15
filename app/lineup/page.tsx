'use client'

import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'

export default function LineupPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [lightboxOpen])

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Yearly Lineup" 
          subtitle="Check out this year's lineup and download flyers"
        />

        {/* 2026 Section */}
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-3xl font-display text-text mb-6">DAVAPALOOZA 2026</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flyer Preview */}
              <Card className="overflow-hidden cursor-pointer group" onClick={() => setLightboxOpen(true)}>
                <div className="relative bg-surface">
                  <img
                    src="/flyers/DAVAPALOOZA26.jpg"
                    alt="DAVAPALOOZA 2026 Flyer"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-bg px-6 py-3 rounded-lg font-medium">
                      Click to Enlarge
                    </div>
                  </div>
                </div>
              </Card>

              {/* Info & Downloads */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-display text-primary mb-4">Event Details</h3>
                  <div className="space-y-3 text-text">
                    <div>
                      <span className="text-muted font-mono text-sm">Date:</span>
                      <p className="text-lg">TBA 2026</p>
                    </div>
                    <div>
                      <span className="text-muted font-mono text-sm">Location:</span>
                      <p className="text-lg">The Block, Davao City</p>
                    </div>
                    <div>
                      <span className="text-muted font-mono text-sm">Time:</span>
                      <p className="text-lg">All Day Event</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-display text-primary mb-4">Download Flyer</h3>
                  <div className="space-y-3">
                    <a 
                      href="/flyers/DAVAPALOOZA26.pdf" 
                      download
                      className="block w-full bg-primary hover:bg-primary/90 text-bg font-medium py-3 px-4 rounded-lg transition-colors text-center"
                    >
                      Download PDF
                    </a>
                    <a 
                      href="/flyers/DAVAPALOOZA26.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-surface hover:bg-surface-lighter border border-border text-text font-medium py-3 px-4 rounded-lg transition-colors text-center"
                    >
                      View Full Size
                    </a>
                  </div>
                </Card>

                <Card className="p-6 bg-surface-lighter">
                  <h3 className="text-lg font-display text-text mb-3">Share the Event</h3>
                  <p className="text-muted text-sm mb-4">
                    Help spread the word about DAVAPALOOZA 2026! Share on social media or send to friends.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-primary/90 text-bg font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                      Share
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Years */}
        <div className="mt-16">
          <h2 className="text-2xl font-display text-muted mb-6">Previous Years</h2>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors text-4xl w-12 h-12 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
          <div 
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/flyers/DAVAPALOOZA26.jpg"
              alt="DAVAPALOOZA 2026 Flyer - Full Size"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
          <Card className="p-12 text-center">
            <p className="text-muted">Stay tuned for archives from previous events!</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
