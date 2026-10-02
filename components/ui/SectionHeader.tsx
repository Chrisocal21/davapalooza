import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  /** Small mono label above the title */
  eyebrow?: string
  /** Ink type for light fields (sky, cream), cream type for the ink field */
  tone?: 'ink' | 'cream'
  /** Heading level. A page's one top heading should be h1. */
  as?: 'h1' | 'h2'
  /** Title size. 'lg' is for the big section openers on the home page. */
  size?: 'md' | 'lg'
  /** Links or buttons that belong to the section, set opposite the title on wide screens */
  action?: React.ReactNode
  /** id for the heading, so the section can point at it with aria-labelledby */
  id?: string
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  eyebrow,
  tone = 'ink',
  as: Heading = 'h2',
  size = 'md',
  action,
  id,
}: SectionHeaderProps) {
  const centered = align === 'center'
  const text = tone === 'cream' ? 'text-cream' : 'text-ink'
  const sub = tone === 'cream' ? 'text-cream/75' : 'text-ink/85'

  return (
    <div
      className={
        centered
          ? 'text-center'
          : 'flex flex-col gap-6 text-left sm:flex-row sm:items-end sm:justify-between'
      }
    >
      <div>
        {eyebrow && <p className={`eyebrow mb-3 ${sub}`}>{eyebrow}</p>}
        <Heading id={id} className={`font-display ${size === 'lg' ? 'text-display-lg' : 'text-display-md'} ${text}`}>
          {title}
        </Heading>
        <div className={`mt-4 h-1 w-16 rounded-full bg-sunset-h ${centered ? 'mx-auto' : ''}`} />
        {subtitle && (
          <p className={`mt-4 max-w-2xl text-lg leading-snug sm:text-xl ${sub} ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className={centered ? 'mt-6' : 'shrink-0'}>{action}</div>}
    </div>
  )
}
