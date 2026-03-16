import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const clickableClass = onClick ? 'cursor-pointer hover:border-primary transition-all' : ''
  
  return (
    <div 
      className={`bg-surface border border-border rounded-lg ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
