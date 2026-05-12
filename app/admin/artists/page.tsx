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
  social_url: string | null;
  instagram: string | null;
  tiktok: string | null;
  spotify: string | null;
  website: string | null;
  year: number;
  set_time: string | null;
  photoUrl?: string | null;
}

const EMPTY_FORM = { name: '', genre: '', bio: '', year: '2026', setTime: '', instagram: '', tiktok: '', spotify: '', website: '' }

const inputCls = 'w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-muted text-xs font-mono mb-1'

function SocialFields({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border">
      <div>
        <label className={labelCls}>Instagram (without @)</label>
        <input type="text" value={data.instagram || ''} onChange={e => onChange('instagram', e.target.value)} placeholder="handle" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>TikTok (without @)</label>
        <input type="text" value={data.tiktok || ''} onChange={e => onChange('tiktok', e.target.value)} placeholder="handle" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Spotify artist URL</label>
        <input type="url" value={data.spotify || ''} onChange={e => onChange('spotify', e.target.value)} placeholder="https://open.spotify.com/artist/..." className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Website</label>
        <input type="url" value={data.website || ''} onChange={e => onChange('website', e.target.value)} placeholder="https://yoursite.com" className={inputCls} />
      </div>
    </div>
  )
}

export default function AdminArtistsPage() {
  const [showForm, setShowForm] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string | number | File | undefined>>({})
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => { fetchArtists() }, [])

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/admin/artists')
      if (res.ok) setArtists((await res.json()).artists || [])
    } catch { /* empty */ } finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, genre: formData.genre, bio: formData.bio, year: parseInt(formData.year), set_time: formData.setTime, instagram: formData.instagram, tiktok: formData.tiktok, spotify: formData.spotify, website: formData.website }),
    })
    if (res.ok) { setShowForm(false); setFormData(EMPTY_FORM); fetchArtists() }
    else alert('Failed: ' + ((await res.json()).error || 'Unknown'))
  }

  const startEdit = (a: Artist) => {
    setEditingId(a.id)
    setEditData({ name: a.name, genre: a.genre || '', bio: a.bio || '', year: a.year, set_time: a.set_time || '', instagram: a.instagram || '', tiktok: a.tiktok || '', spotify: a.spotify || '', website: a.website || '' })
  }

  const handleUpdate = async (id: string) => {
    const fd = new FormData()
    fd.append('id', id)
    Object.entries(editData).forEach(([k, v]) => { if (v instanceof File) fd.append('photo', v); else fd.append(k, String(v ?? '')) })
    const res = await fetch('/api/admin/artists', { method: 'PUT', body: fd })
    if (res.ok) { setEditingId(null); fetchArtists() }
    else alert('Failed: ' + ((await res.json()).error || 'Unknown'))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artist?')) return
    await fetch('/api/admin/artists', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchArtists()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="Artist Management" subtitle="Manage lineup" align="left" />
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors text-sm">← Dashboard</Link>
        </div>

        <div className="mb-8">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Artist'}</Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-2xl font-display text-text mb-6">Add New Artist</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Genre</label><input type="text" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} placeholder="Hip-Hop, R&B…" className={inputCls} /></div>
                <div><label className={labelCls}>Year *</label><input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className={inputCls} required /></div>
                <div><label className={labelCls}>Set Time</label><input type="text" value={formData.setTime} onChange={e => setFormData({ ...formData, setTime: e.target.value })} placeholder="3:00 PM" className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Bio</label><textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3} className={inputCls + ' resize-none'} /></div>
              <SocialFields data={formData as Record<string, string>} onChange={(k, v) => setFormData(p => ({ ...p, [k]: v }))} />
              <Button type="submit" variant="primary">Save Artist</Button>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : artists.length === 0 ? (
          <Card className="p-12 text-center"><p className="text-muted">No artists yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {artists.map(artist => (
              <Card key={artist.id} className="p-6">
                {editingId === artist.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><label className={labelCls}>Name</label><input type="text" value={(editData.name as string) || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>Genre</label><input type="text" value={(editData.genre as string) || ''} onChange={e => setEditData({ ...editData, genre: e.target.value })} className={inputCls} /></div>
                      <div><label className={labelCls}>Year</label><input type="number" value={editData.year as number || 2026} onChange={e => setEditData({ ...editData, year: parseInt(e.target.value) })} className={inputCls} /></div>
                      <div><label className={labelCls}>Set Time</label><input type="text" value={(editData.set_time as string) || ''} onChange={e => setEditData({ ...editData, set_time: e.target.value })} placeholder="3:00 PM" className={inputCls} /></div>
                    </div>
                    <div><label className={labelCls}>Bio</label><textarea value={(editData.bio as string) || ''} onChange={e => setEditData({ ...editData, bio: e.target.value })} rows={3} className={inputCls + ' resize-none'} /></div>
                    <SocialFields data={editData as Record<string, string>} onChange={(k, v) => setEditData(p => ({ ...p, [k]: v }))} />
                    <div>
                      <label className={labelCls}>Photo (JPG/PNG)</label>
                      <input type="file" accept="image/jpeg,image/png" onChange={e => setEditData({ ...editData, photoFile: e.target.files?.[0] })} className="text-text text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleUpdate(artist.id)}>Save Changes</Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      {artist.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={artist.photoUrl} alt={artist.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-2xl font-display text-primary">{artist.name}</h4>
                        <p className="text-muted font-mono text-sm">{artist.genre || '—'} · {artist.year}{artist.set_time ? ` · ${artist.set_time}` : ''}</p>
                        {artist.bio && <p className="text-text text-sm mt-1 line-clamp-2">{artist.bio}</p>}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {artist.instagram && <span className="text-xs font-mono text-primary">IG: @{artist.instagram}</span>}
                          {artist.tiktok && <span className="text-xs font-mono text-primary">TT: @{artist.tiktok}</span>}
                          {artist.spotify && <span className="text-xs font-mono text-success">Spotify ↗</span>}
                          {artist.website && <span className="text-xs font-mono text-muted">Web ↗</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(artist)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(artist.id)}>Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

  name: string;
  genre: string | null;
  bio: string | null;
  year: number;
  set_time: string | null;
}

