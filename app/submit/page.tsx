'use client'

import { useState } from 'react'
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
    } catch (error) {
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
            {/* Photo Upload */}
            <div>
              <label className="block text-text font-medium mb-2">
                Photo <span className="text-secondary">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={handlePhotoChange}
                className="block w-full text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-bg file:font-medium hover:file:bg-primary/90 cursor-pointer"
                required
              />
              <p className="text-muted text-sm mt-2 font-mono">
                JPG, PNG, or HEIC • Max 10MB
              </p>
              {photoPreview && (
                <div className="mt-4 rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-full" />
                </div>
              )}
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
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
                required
              />
              <p className="text-muted text-sm mt-2 font-mono">
                This will appear as a watermark on your photo
              </p>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-text font-medium mb-2">
                Platform (optional)
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
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
              <label className="block text-text font-medium mb-2">
                Caption (optional)
              </label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Tell us about this moment..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-muted text-sm mt-2 font-mono text-right">
                {formData.caption.length}/200
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-text font-medium mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement"
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                required
              />
              <label htmlFor="agreement" className="text-text text-sm">
                I confirm I took this photo and grant permission to display it on southoblockparty.com <span className="text-secondary">*</span>
              </label>
            </div>

            {/* Submit Button */}
            {error && (
              <p className="text-danger text-sm">{error}</p>
            )}
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
