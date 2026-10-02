import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  /**
   * flat   — quiet cream panel with a hairline edge (default)
   * raised — ink edge and hard offset shadow, for the things that should pop
   */
  variant?: 'flat' | 'raised'
}

export default function Card({ children, className = '', onClick, variant = 'flat' }: CardProps) {
  const surface =
    variant === 'raised'
      ? 'bg-surface border-2 border-ink shadow-print'
      : 'bg-surface border border-ink/15'
  const clickable = onClick
    ? 'cursor-pointer transition-[transform,box-shadow,border-color] duration-150 hover:border-ink hover:-translate-y-0.5 hover:shadow-print'
    : ''

  return (
    <div className={`${surface} rounded-md ${clickable} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
