import type { DesiredOutcome } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { CheckCircle } from 'lucide-react'

interface DesiredOutcomeCardProps {
  outcome: DesiredOutcome
}

export function DesiredOutcomeCard({ outcome }: DesiredOutcomeCardProps) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="text-sm text-gray-200">{outcome.text}</div>
        <div className="text-xs text-gray-400 mt-1">{formatPercentage(outcome.percentage, 1)} want this</div>
      </div>
    </div>
  )
}
