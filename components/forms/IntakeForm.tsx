'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Field, { FormError } from '@/components/ui/Field'
import { FormPage, FormSuccess, Steps } from '@/components/ui/FormLayout'
import type { IconName } from '@/components/ui/Icon'

export interface IntakeFieldDef {
  key: string
  label: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
  hint?: string
  /** Span both columns on wide screens */
  wide?: boolean
}

interface Props {
  /** volunteers | sponsors | supporters */
  type: string
  eyebrow: string
  title: string
  lede: string
  asideTitle: string
  asideItems: string[]
  fields: IntakeFieldDef[]
  submitLabel: string
  successIcon: IconName
  successTitle: string
  successBody: string
}

export default function IntakeForm(p: Props) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(p.fields.map(f => [f.key, ''])),
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`/api/intake/${p.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <FormSuccess
        icon={p.successIcon}
        title={p.successTitle}
        actions={
          <Button href="/" variant="secondary">
            Back to the Block Party
          </Button>
        }
      >
        {p.successBody}
      </FormSuccess>
    )
  }

  return (
    <FormPage
      eyebrow={p.eyebrow}
      title={p.title}
      lede={p.lede}
      aside={<Steps title={p.asideTitle} items={p.asideItems} />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
          {p.fields.map(f => {
            const id = `f_${f.key}`
            const common = {
              id,
              value: form[f.key],
              required: f.required,
              placeholder: f.placeholder,
              className: 'field',
            }
            return (
              <Field
                key={f.key}
                label={f.label}
                htmlFor={id}
                required={f.required}
                hint={f.hint}
                className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                {f.type === 'textarea' ? (
                  <textarea {...common} rows={4} onChange={e => set(f.key, e.target.value)} />
                ) : f.type === 'select' ? (
                  <select {...common} onChange={e => set(f.key, e.target.value)}>
                    <option value="">Choose one…</option>
                    {f.options?.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input {...common} type={f.type ?? 'text'} onChange={e => set(f.key, e.target.value)} />
                )}
              </Field>
            )
          })}
        </div>

        <FormError>{error}</FormError>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Sending...' : p.submitLabel}
        </Button>
      </form>
    </FormPage>
  )
}
