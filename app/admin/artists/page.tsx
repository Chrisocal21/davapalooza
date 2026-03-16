'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// TODO: Fetch from API
const mockArtists: Array<{ id: string; name: string; genre: string; year: number; setTime: string; bio: string }> = []

export default function AdminArtistsPage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    bio: '',
    year: '2026',
    setTime: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving artist:', formData)
    // TODO: Wire to API
    setShowForm(false)
    setFormData({ name: '', genre: '', bio: '', year: '2026', setTime: '' })
  }

  const handleDelete = (id: string) => {
    console.log('Deleting artist:', id)
    // TODO: Wire to API
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="Artist Management" subtitle="Manage lineup" align="left" />
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Artist'}
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-2xl font-display text-text mb-6">Add New Artist</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text text-sm mb-2">Genre *</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text text-sm mb-2">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text text-sm mb-2">Set Time</label>
                  <input
                    type="text"
                    value={formData.setTime}
                    onChange={(e) => setFormData({ ...formData, setTime: e.target.value })}
                    placeholder="e.g., 3:00 PM"
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text text-sm mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" variant="primary">Save Artist</Button>
            </form>
          </Card>
        )}

        {/* Artist List */}
        {mockArtists.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">No artists added yet. Click &quot;+ Add Artist&quot; to get started.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockArtists.map((artist) => (
              <Card key={artist.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-2xl font-display text-primary mb-2">{artist.name}</h4>
                    <p className="text-muted font-mono text-sm mb-2">{artist.genre} • {artist.year}</p>
                    <p className="text-text mb-2">{artist.bio}</p>
                    <p className="text-muted text-sm">Set Time: {artist.setTime}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(artist.id)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
