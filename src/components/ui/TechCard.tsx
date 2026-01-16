import React from 'react'

interface TechCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: 'default' | 'premium' | 'glow' | 'floating'
  compact?: boolean
}

export function TechCard({
  children,
  className = '',
  style,
  variant = 'default',
  compact = false
}: TechCardProps) {
  const variantClasses = {
    default:
      'bg-[#0a0a0a] backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:shadow-[#FF3B00]/10 hover:border-white/20',
    premium:
      'bg-gradient-to-br from-[#0a0a0a] to-[#080808] backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-[#FF3B00]/15 hover:border-[#FF3B00]/30',
    glow: 
      'bg-[#080808] backdrop-blur-md border border-[#FF3B00]/20 shadow-xl shadow-[#FF3B00]/5 hover:shadow-2xl hover:shadow-[#FF3B00]/20 hover:border-[#FF3B00]/40',
    floating:
      'bg-[#080808] backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-[#FF3B00]/20 hover:border-[#FF3B00]/30 relative overflow-hidden'
  }

  const padding = compact ? 'p-6 md:p-8' : 'p-8 md:p-10'
  const hoverScale = compact ? '' : 'hover:scale-[1.005]'
  const hoverTranslate = compact ? '' : ''
  const transition = compact
    ? 'transition-all duration-500 ease-out'
    : 'transition-all duration-500 ease-out'
  const transform = compact ? '' : 'will-change-transform'

  return (
    <div
      className={`${variantClasses[variant]} rounded-2xl ${padding} ${transition} ${hoverScale} ${hoverTranslate} ${transform} ${className}`}
      style={style}
    >
      {/* Subtle gradient overlay for floating variant */}
      {variant === 'floating' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function TechCardHeader({
  children,
  className = '',
  compact = false
}: {
  children: React.ReactNode
  className?: string
  compact?: boolean
}) {
  const marginBottom = compact ? 'mb-6 pb-6' : 'mb-8 pb-6'
  return <div className={`${marginBottom} border-b border-white/5 ${className}`}>{children}</div>
}

export function TechCardTitle({
  children,
  className = '',
  compact = false
}: {
  children: React.ReactNode
  className?: string
  compact?: boolean
}) {
  const textSize = compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
  const marginBottom = compact ? 'mb-2' : 'mb-3'
  return (
    <h3
      className={`${textSize} font-display font-bold tracking-tight text-white ${marginBottom} ${className}`}
    >
      {children}
    </h3>
  )
}

export function TechCardDescription({
  children,
  className = '',
  compact = false
}: {
  children: React.ReactNode
  className?: string
  compact?: boolean
}) {
  const textSize = compact ? 'text-sm' : 'text-base'
  return (
    <p className={`text-gray-500 ${textSize} leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export function TechCardContent({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
