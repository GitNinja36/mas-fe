import React from 'react'

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
}

export function FloatingElement({ children, delay = 0 }: FloatingElementProps) {
  return (
    <div
      className="animate-float will-change-transform"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

export function ParticleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  )
}
