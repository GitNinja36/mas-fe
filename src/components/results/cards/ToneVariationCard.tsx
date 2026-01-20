import type { ToneVariation } from '../../../types'

interface ToneVariationCardProps {
  variation: ToneVariation
}

const toneConfig = {
  FORMAL: {
    color: 'blue',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
  },
  CASUAL: {
    color: 'purple',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
  },
  URGENT: {
    color: 'green',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
  },
}

export function ToneVariationCard({ variation }: ToneVariationCardProps) {
  const config = toneConfig[variation.type]

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} hover:border-white/20 transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold ${config.textColor} uppercase tracking-wider`}>
          {variation.type}
        </span>
      </div>
      <p className="text-sm text-gray-200 mb-3 leading-relaxed">{variation.template}</p>
      <div className="pt-3 border-t border-white/5">
        <span className="text-xs text-gray-400">Best for: </span>
        <span className="text-xs text-gray-300">
          {variation.best_for.slice(0, 3).join(', ')}
          {variation.best_for.length > 3 && '...'}
        </span>
      </div>
    </div>
  )
}
