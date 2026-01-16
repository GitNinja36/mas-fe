import { Shield, RefreshCw } from 'lucide-react'
import { TechButton } from '../ui/TechButton'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Shield className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-6">Connection Error</h1>
        <p className="text-gray-400 text-lg mb-8">{error}</p>
        {onRetry && (
          <TechButton variant="premium" size="lg" onClick={onRetry}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Connection
          </TechButton>
        )}
      </div>
    </div>
  )
}

export function InlineError({ error, className = '' }: { error: string; className?: string }) {
  return (
    <div className={`bg-red-900/20 border border-red-500/25 rounded-lg p-3 ${className}`}>
      <p className="text-xs text-red-400 font-medium">{error}</p>
    </div>
  )
}
