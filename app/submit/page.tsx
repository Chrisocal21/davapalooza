'use client'

import { useState, useRef } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    handle: '',
    platform: '',
    caption: '',
    name: '',
    agreed: false,
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      if (photoFile) formDataToSend.append('photo', photoFile)
      formDataToSend.append('handle', formData.handle)
      if (formData.platform) formDataToSend.append('platform', formData.platform)
      if (formData.caption) formDataToSend.append('caption', formData.caption)
      if (formData.name) formDataToSend.append('name', formData.name)
      formDataToSend.append('agreement', 'true')

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = formData.handle && formData.agreed && photoPreview

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-display text-primary mb-4">Thanks for Submitting!</h2>
          <p className="text-text text-lg mb-8">
            Your photo is in review. We&apos;ll get it up on the gallery soon!
          </p>
          <Button variant="secondary" onClick={() => {
            setSubmitted(false)
            setPhotoPreview(null)
            setPhotoFile(null)
            setFormData({ handle: '', platform: '', caption: '', name: '', agreed: false })
          }}>
            Submit Another Photo
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Submit Your Photos"
          subtitle="Share your Davapalooza moments"
        />

        <Card className="mt-8 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Drag & Drop Zone */}
            <div>
              <label className="block text-text font-medium mb-2">
                Photo <span className="text-secondary">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-8
                  ${dragOver ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-surface/50'}
                  ${photoPreview ? 'p-0 border-solid border-border overflow-hidden' : ''}`}
              >
                {photoPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Preview" className="w-full max-h-96 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-mono text-sm">Click to change photo</p>
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-muted mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-text font-medium mb-1">Drop your photo here</p>
                    <p className="text-muted text-sm font-mono">or click to browse · JPG, PNG, HEIC · Max 10MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Handle */}
            <div>
              <label className="block text-text font-medium mb-2">
                Social Handle <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
                required
              />
              <p className="text-muted text-sm mt-1 font-mono">Appears as a watermark on your photo</p>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-text font-medium mb-2">Platform (optional)</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select platform</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="x">X</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-text font-medium mb-2">Caption (optional)</label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Tell us about this moment..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-muted text-sm mt-1 font-mono text-right">{formData.caption.length}/200</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-text font-medium mb-2">Name (optional)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className="mt-1 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                required
              />
              <span className="text-muted text-sm group-hover:text-text transition-colors">
                I confirm I took this photo and grant permission to display it on southoblockparty.com <span className="text-secondary">*</span>
              </span>
            </label>

            {error && <p className="text-danger text-sm font-mono">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isFormValid || submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Photo'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}


