'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Artist {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  year: number;
  set_time: string | null;
}

export default function AdminArtistsPage() {
  const [showForm, setShowForm] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    bio: '',
    year: '2026',
    setTime: '',
  })

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/admin/artists')
      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists || [])
      }
    } catch (error) {
      console.error('Failed to fetch artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving artist:', formData)
    
    try {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          genre: formData.genre,
          bio: formData.bio,
          year: parseInt(formData.year),
          set_time: formData.setTime,
        }),
      })
      
      if (response.ok) {
        setShowForm(false)
        setFormData({ name: '', genre: '', bio: '', year: '2026', setTime: '' })
        fetchArtists()
      } else {
        const error = await response.json()
        alert('Failed to create artist: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating artist:', error)
      alert('Failed to create artist')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artist?')) return

    try {
      const response = await fetch('/api/admin/artists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      
      if (response.ok) {
        fetchArtists()
      }
    } catch (error) {
      console.error('Error deleting artist:', error)
    }
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
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">Loading...</p>
          </Card>
        ) : artists.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">No artists added yet. Click &quot;+ Add Artist&quot; to get started.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {artists.map((artist) => (
              <Card key={artist.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-2xl font-display text-primary mb-2">{artist.name}</h4>
                    <p className="text-muted font-mono text-sm mb-2">{artist.genre || 'No genre'} • {artist.year}</p>
                    {artist.bio && <p className="text-text mb-2">{artist.bio}</p>}
                    {artist.set_time && <p className="text-muted text-sm">Set Time: {artist.set_time}</p>}
                  </div>
                  <div className="flex gap-2">
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
