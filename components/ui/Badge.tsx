import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'approved' | 'pending' | 'flagged' | 'rejected'
  className?: string
}

export default function Badge({ children, variant = 'pending', className = '' }: BadgeProps) {
  const variantStyles = {
    approved: 'bg-success/20 text-success border-success',
    pending: 'bg-warning/20 text-warning border-warning',
    flagged: 'bg-danger/20 text-danger border-danger',
    rejected: 'bg-muted/20 text-muted border-muted',
  }
  
  return (
    <span className={`inline-block px-3 py-1 text-xs font-mono font-bold rounded-full border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
