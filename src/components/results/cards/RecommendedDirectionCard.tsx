import { Download } from 'lucide-react'
import { toast } from 'react-toastify'
import { formatPercentage, formatConfidence, formatConfidenceLevel } from '../utils/formatters'

interface RecommendedDirectionCardProps {
  recommendedDirection: string
  confidenceInRecommendation: number
  responseAgreement: number
  averageConfidence: number
}

export function RecommendedDirectionCard({
  recommendedDirection,
  confidenceInRecommendation,
  responseAgreement,
  averageConfidence
}: RecommendedDirectionCardProps) {
  const confidenceLevel = formatConfidenceLevel(averageConfidence)

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-3">
            RECOMMENDED DIRECTION
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            {recommendedDirection || 'No recommendation available'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="text-xs font-mono text-green-400">
                {formatPercentage(responseAgreement * 100, 0)} Agreement
              </span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-xs font-mono text-blue-400">
                {confidenceLevel} Confidence
              </span>
            </span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-sm font-medium text-blue-300 transition-all duration-300 hover:scale-105"
          onClick={() => {
            // Placeholder for export functionality
            toast.info('Export functionality coming soon!')
          }}
        >
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </button>
      </div>
    </div>
  )
}
