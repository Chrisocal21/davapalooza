import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-sans font-bold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary:   'bg-sunset text-cream hover:opacity-90 hover:shadow-lg hover:shadow-sun-red/30 uppercase tracking-wider',
    secondary: 'bg-secondary text-ink hover:opacity-90 hover:shadow-lg hover:shadow-sun-yellow/30 uppercase tracking-wider',
    ghost:     'bg-transparent border-2 border-ink text-ink hover:bg-ink hover:text-cream',
    danger:    'bg-danger text-cream hover:opacity-90 hover:shadow-lg hover:shadow-danger/30',
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
