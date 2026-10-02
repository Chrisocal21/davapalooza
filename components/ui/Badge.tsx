import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'approved' | 'pending' | 'flagged' | 'rejected'
  className?: string
}

export default function Badge({ children, variant = 'pending', className = '' }: BadgeProps) {
  const variantStyles = {
    approved: 'bg-success/10 text-success border-success/50',
    pending:  'bg-sun-yellow/30 text-ink border-sun-orange',
    flagged:  'bg-sun-red/10 text-red-ink border-red-ink/50',
    rejected: 'bg-ink/5 text-muted border-ink/25',
  }

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 pt-[0.3rem] pb-[0.2rem] font-mono text-[0.6875rem] font-bold uppercase leading-none tracking-[0.12em] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
