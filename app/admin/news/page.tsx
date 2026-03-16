'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// TODO: Fetch from API
const mockNewsPosts: Array<{ id: string; title: string; body: string; publishedAt: string }> = []

export default function AdminNewsPage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Publishing news:', formData)
    // TODO: Wire to API
    setShowForm(false)
    setFormData({ title: '', body: '' })
  }

  const handleDelete = (id: string) => {
    console.log('Deleting post:', id)
    // TODO: Wire to API
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="News Management" subtitle="Create and manage news posts" align="left" />
          <Link href="/admin/dashboard" className="text-muted hover:text-primary transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create News Post'}
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-2xl font-display text-text mb-6">Create News Post</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-text text-sm mb-2">Body *</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary resize-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary">Publish Post</Button>
            </form>
          </Card>
        )}

        {/* News List */}
        {mockNewsPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted text-lg">No news posts yet. Click "+ Create News Post" to get started.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockNewsPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-muted text-sm font-mono mb-2">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                    <h4 className="text-2xl font-display text-primary mb-3">{post.title}</h4>
                    <p className="text-text">{post.body}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>Delete</Button>
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
