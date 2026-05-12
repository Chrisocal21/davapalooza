import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ title, subtitle, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  const lineClass = align === 'center' ? 'mx-auto' : ''

  return (
    <div className={alignClass}>
      <h2 className="text-5xl md:text-6xl font-display text-primary mb-3">
        {title}
      </h2>
      <div className={`w-12 h-[3px] bg-secondary rounded-full mb-3 ${lineClass}`} />
      {subtitle && (
        <p className="text-lg md:text-xl text-muted font-mono">
          {subtitle}
        </p>
      )}
    </div>
  )
}
