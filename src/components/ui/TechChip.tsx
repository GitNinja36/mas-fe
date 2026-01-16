import React from 'react'

interface TechChipProps {
  children: React.ReactNode
  variant?: 'default' | 'tech' | 'success' | 'premium' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TechChip({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: TechChipProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  }
  const variantClasses = {
    default: 'bg-gray-800/60 text-gray-300 border-gray-700/50',
    tech: 'bg-gradient-to-r from-orange-500/15 to-orange-500/20 text-orange-300 border-orange-500/30 shadow-sm',
    success:
      'bg-gradient-to-r from-green-500/15 to-green-600/20 text-green-300 border-green-500/30 shadow-sm',
    premium:
      'bg-gradient-to-r from-orange-500/20 to-orange-500/25 text-orange-200 border-orange-500/40 shadow-md',
    glow: 'bg-gradient-to-r from-orange-500/20 to-orange-500/25 text-orange-200 border-orange-500/40 shadow-md'
  }

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border transition-all duration-200 hover:scale-105 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
