interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'default' | 'white' | 'accent'
}

export function LoadingSpinner({ size = 'md', className = '', color = 'default' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    default: 'border-[#FF3B00] border-t-transparent',
    white: 'border-white border-t-transparent',
    accent: 'border-[#FF3B00] border-t-transparent'
  }

  return (
    <div
      className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingScreen({ message = 'Loading Enhanced AI System...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="spinner-enhanced w-20 h-20 mx-auto mb-6"></div>
          <div className="absolute inset-0 animate-ping rounded-full w-20 h-20 border-4 border-orange-500/30 mx-auto"></div>
        </div>
        <p className="text-white font-bold text-2xl mb-2 text-glow">{message}</p>
        <p className="text-gray-400 text-lg">Initializing intelligent agents</p>
      </div>
    </div>
  )
}
