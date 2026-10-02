'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Field, { FormError } from '@/components/ui/Field'
import { FormPage, FormSuccess, Steps } from '@/components/ui/FormLayout'
import Icon from '@/components/ui/Icon'

const MAX_BYTES = 10 * 1024 * 1024
const EMPTY = { handle: '', platform: '', caption: '', name: '', agreed: false }

export default function SubmitPage() {
  const [formData, setFormData] = useState(EMPTY)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  // Some browsers can't draw HEIC, so the preview can fail even for a good file.
  const [previewFailed, setPreviewFailed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  // Release the preview's object URL when it is replaced or the page is left.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const processFile = (file: File) => {
    if (file.size > MAX_BYTES) {
      setError('That photo is over 10MB. Pick a smaller one and try again.')
      return
    }
    setError('')
    setPreviewFailed(false)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
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

  const isFormValid = formData.handle && formData.agreed && photoFile

  if (submitted) {
    return (
      <FormSuccess
        icon="check"
        title="Thanks for Submitting!"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false)
                setPhotoPreview(null)
                setPhotoFile(null)
                setFormData(EMPTY)
              }}
            >
              Submit Another Photo
            </Button>
            <Button href="/gallery" variant="ghost">
              View Full Gallery
            </Button>
          </>
        }
      >
        Your photo is in review. We&apos;ll get it up on the gallery soon!
      </FormSuccess>
    )
  }

  return (
    <FormPage
      eyebrow="Community-submitted"
      title="Submit Your Photos"
      lede="Share your Davapalooza moments"
      aside={
        <Steps
          title="How it works"
          items={[
            'Anyone who attends can submit their photos for review.',
            'We moderate everything before it goes live.',
            'Approved photos go into the public gallery.',
          ]}
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Drag & Drop Zone */}
        <div>
          <p className="mb-1.5 text-[0.95rem] font-semibold leading-tight text-ink" id="photo-label">
            Photo
            <span className="ml-1 text-red-ink" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </p>
          {/* The real input stays in the tab order (visually hidden, not display:none)
              so the drop zone works from the keyboard too. */}
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/heic"
            onChange={handlePhotoChange}
            aria-labelledby="photo-label"
            aria-describedby="photo-hint"
            className="peer sr-only"
          />
          <label
            htmlFor="photo"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 text-center transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
              photoPreview
                ? 'border-solid border-ink bg-ink'
                : dragOver
                  ? 'border-dashed border-ink bg-sun-yellow/40 px-6 py-12'
                  : 'border-dashed border-ink/40 bg-cream px-6 py-12 hover:border-ink hover:bg-sun-yellow/20'
            }`}
          >
            {photoPreview ? (
              <>
                {previewFailed ? (
                  <span className="flex flex-col items-center gap-3 px-6 py-12 text-cream">
                    <Icon name="camera" size={32} />
                    <span className="break-all font-mono text-sm">{photoFile?.name}</span>
                    <span className="text-sm text-cream/70">No preview for this file type. It will still upload.</span>
                  </span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={photoPreview}
                    alt="Preview of your photo"
                    onError={() => setPreviewFailed(true)}
                    className="max-h-[28rem] w-full object-contain"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/85 px-4 pb-2.5 pt-3 font-mono text-xs uppercase tracking-[0.14em] text-cream transition-colors group-hover:bg-sun-red">
                  <Icon name="upload" size={14} />
                  Click to change photo
                </span>
              </>
            ) : (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-sun-yellow text-ink">
                  <Icon name="upload" size={24} />
                </span>
                <span className="mt-4 text-lg font-semibold text-ink">Drop your photo here</span>
                <span id="photo-hint" className="mt-1 font-mono text-sm text-muted">
                  or click to browse · JPG, PNG, HEIC · Max 10MB
                </span>
              </>
            )}
          </label>
        </div>

        {/* Handle */}
        <Field label="Social Handle" htmlFor="handle" required hint="Appears as a watermark on your photo">
          <input
            id="handle"
            type="text"
            value={formData.handle}
            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            placeholder="@yourhandle"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="field"
            required
          />
        </Field>

        <div className="grid gap-7 sm:grid-cols-2">
          {/* Platform */}
          <Field label="Platform (optional)" htmlFor="platform">
            <select
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="field"
            >
              <option value="">Select platform</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X</option>
              <option value="other">Other</option>
            </select>
          </Field>

          {/* Name */}
          <Field label="Name (optional)" htmlFor="name">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              autoComplete="name"
              className="field"
            />
          </Field>
        </div>

        {/* Caption */}
        <Field
          label="Caption (optional)"
          htmlFor="caption"
          hint={<span className="block text-right font-mono tabular-nums">{formData.caption.length}/200</span>}
        >
          <textarea
            id="caption"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="Tell us about this moment..."
            maxLength={200}
            rows={3}
            className="field"
          />
        </Field>

        {/* Agreement */}
        <label className="flex cursor-pointer items-start gap-3.5 rounded border-2 border-ink/15 bg-cream p-4 transition-colors hover:border-ink/40">
          <input
            type="checkbox"
            checked={formData.agreed}
            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
            className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-sun-red"
            required
          />
          <span className="text-[0.98rem] leading-snug text-ink">
            I confirm I took this photo and grant permission to display it on southoblockparty.com
            <span className="ml-1 text-red-ink" aria-hidden="true">*</span>
          </span>
        </label>

        <FormError>{error}</FormError>

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
    </FormPage>
  )
}
