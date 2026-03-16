import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({ title, subtitle, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <div className={alignClass}>
      <h2 className="text-5xl md:text-6xl font-display text-primary mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted font-mono">
          {subtitle}
        </p>
      )}
    </div>
  )
}
