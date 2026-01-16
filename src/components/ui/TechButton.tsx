import React from 'react'

interface TechButtonProps {
  children: React.ReactNode
  variant?: 'tech' | 'glow' | 'outline' | 'premium' | 'shimmer'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function TechButton({
  children,
  variant = 'tech',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}: TechButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-lg group relative overflow-hidden will-change-transform'
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  }
  const variantClasses = {
    tech: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]',
    glow: 'bg-gradient-to-r from-orange-500/15 to-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02]',
    outline:
      'border border-orange-500/50 text-orange-400 bg-transparent hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-300 hover:scale-[1.02]',
    premium:
      'bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.03] hover:-translate-y-0.5',
    shimmer:
      'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] animate-shimmer'
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
