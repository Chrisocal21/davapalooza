import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const clickableClass = onClick ? 'cursor-pointer hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 transition-all' : 'hover:border-border/60'
  
  return (
    <div 
      className={`bg-surface border border-border rounded-lg transition-all ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
