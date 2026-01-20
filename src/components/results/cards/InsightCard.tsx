import type { SynthesizedInsight } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { TrendingUp, Lightbulb, Target, Zap } from 'lucide-react'

interface InsightCardProps {
  insight: SynthesizedInsight
}

const iconMap = [TrendingUp, Lightbulb, Target, Zap]

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.evidence_count % iconMap.length] || TrendingUp
  const confidenceColor = insight.confidence >= 0.9
    ? 'green'
    : insight.confidence >= 0.7
    ? 'yellow'
    : 'orange'

  return (
    <div className="bg-[#080808] rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300 h-full w-full flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-display font-bold text-white flex-1 line-clamp-2">
              {insight.title}
            </h3>
      </div>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
        {insight.description}
      </p>
          </div>
        </div>
    </div>
  )
}
