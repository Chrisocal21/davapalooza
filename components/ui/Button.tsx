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
  const baseStyles = 'font-sans font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-primary text-bg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
    secondary: 'bg-secondary text-text hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20',
    ghost: 'bg-transparent border border-border text-text hover:bg-surface hover:border-primary',
    danger: 'bg-danger text-text hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/20',
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
