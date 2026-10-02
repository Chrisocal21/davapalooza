import React from 'react'
import Icon, { type IconName } from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'

interface FormPageProps {
  eyebrow?: string
  title: string
  lede?: React.ReactNode
  /** Short notes shown beside the form on wide screens, under it on a phone */
  aside?: React.ReactNode
  children: React.ReactNode
}

/** Shared frame for the three form pages: page header, form panel, side notes. */
export function FormPage({ eyebrow, title, lede, aside, children }: FormPageProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lede={lede} />
      <div className="bg-cream py-12 sm:py-16 lg:py-20">
        <div className={`shell grid gap-12 ${aside ? 'lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16' : ''}`}>
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-print-lg sm:p-9">{children}</div>
          {aside && <aside className="lg:sticky lg:top-28 lg:self-start">{aside}</aside>}
        </div>
      </div>
    </>
  )
}

/** Numbered side notes: "how it works" in three or four plain lines. */
export function Steps({ title, items }: { title: string; items: React.ReactNode[] }) {
  return (
    <div>
      <h2 className="eyebrow mb-4 text-muted">{title}</h2>
      <ol className="border-t-2 border-ink">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 border-b border-ink/15 py-4">
            <span className="font-display text-3xl leading-none text-sun-red">{i + 1}</span>
            <span className="pt-0.5 text-[1.0625rem] leading-snug text-ink">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

interface FormSuccessProps {
  icon: IconName
  title: string
  children: React.ReactNode
  /** Buttons or links offered after the message */
  actions?: React.ReactNode
}

/** Full-page confirmation shown in place of a form once it has been sent. */
export function FormSuccess({ icon, title, children, actions }: FormSuccessProps) {
  return (
    <div className="flex min-h-[72vh] items-center justify-center bg-sky px-5 py-16">
      <div
        role="status"
        className="w-full max-w-xl animate-rise rounded-md border-2 border-ink bg-cream p-8 text-center shadow-print-lg sm:p-12"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun-yellow text-ink">
          <Icon name={icon} size={30} />
        </span>
        <h1 className="mt-6 font-display text-display-md text-ink">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-lg leading-snug text-ink/85">{children}</p>
        {actions && <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">{actions}</div>}
      </div>
    </div>
  )
}
