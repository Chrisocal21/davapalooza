import React from 'react'
import Icon from '@/components/ui/Icon'

interface FieldProps {
  label: string
  /** id of the control inside — ties the label to it */
  htmlFor: string
  required?: boolean
  /** Helper line under the control */
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/**
 * Label + control + optional hint. Give the control inside `className="field"`
 * and an id that matches `htmlFor`.
 */
export default function Field({ label, htmlFor, required = false, hint, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.95rem] font-semibold leading-tight text-ink">
        {label}
        {required && (
          <>
            <span className="ml-1 text-red-ink" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-sm leading-snug text-muted">{hint}</p>}
    </div>
  )
}

/** Group heading inside a form — "Contact Info", "Links & Socials". */
export function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t-2 border-ink/10 pt-6">
      <legend className="eyebrow float-left mb-5 w-full text-muted">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

/** Inline form error. Announced to screen readers when it appears. */
export function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <p role="alert" className="flex items-start gap-2 rounded border-2 border-red-ink/40 bg-sun-red/10 px-3.5 py-3 text-[0.95rem] font-medium leading-snug text-red-ink">
      <Icon name="alert" size={18} className="mt-0.5" />
      <span>{children}</span>
    </p>
  )
}
