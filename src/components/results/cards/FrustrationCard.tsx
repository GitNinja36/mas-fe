import type { FrustrationPoint } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { XCircle } from 'lucide-react'

interface FrustrationCardProps {
  frustration: FrustrationPoint
}

export function FrustrationCard({ frustration }: FrustrationCardProps) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="text-sm text-gray-200">{frustration.text}</div>
        <div className="text-xs text-gray-400 mt-1">{formatPercentage(frustration.percentage, 1)} experience this</div>
      </div>
    </div>
  )
}
