import type { ChoiceDistribution, OverallMetrics, Methodology, CompetitiveAnalysis } from '../../../types'
import { CircularGauge } from '../../ui/CircularGauge'
import { formatPercentage, formatConfidenceLevel, formatCoverage } from '../utils/formatters'

interface ChoiceLandscapeCardProps {
  choiceDistribution: ChoiceDistribution
  options: string[]
  overallMetrics: OverallMetrics
  methodology: Methodology
  platformsSurveyed: string[]
  totalResponses: number
  competitiveAnalysis?: CompetitiveAnalysis | null
}

export function ChoiceLandscapeCard({
  choiceDistribution,
  options,
  overallMetrics,
  methodology,
  platformsSurveyed,
  totalResponses,
  competitiveAnalysis
}: ChoiceLandscapeCardProps) {
  if (!choiceDistribution || !choiceDistribution.choices) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
          Choice Landscape
        </h3>
        <p className="text-sm text-gray-400">No distribution data available</p>
      </div>
    )
  }

  // Create entries for all options, including those with 0%
  const allChoices = options.map((optionText, index) => {
    const choiceKey = String.fromCharCode(65 + index) // A, B, C, D, E...
    const stats = choiceDistribution.choices?.[choiceKey] || {
      count: 0,
      percentage: 0,
      confidence_avg: 0,
      confidence_median: 0,
      primary_reasoning: ''
    }
    return [choiceKey, stats, optionText] as const
  })

  // Sort by percentage (highest first), but keep all options
  const sortedChoices = allChoices.sort((a, b) => b[1].percentage - a[1].percentage)

  const panelSize = methodology?.total_agents || totalResponses || 0
  const confidence = overallMetrics?.average_confidence ?? 0
  const confidenceLevel = formatConfidenceLevel(confidence)
  const coverage = formatCoverage(platformsSurveyed?.length || 0)

  // Determine confidence color based on level
  const getConfidenceColor = (conf: number): string => {
    if (conf >= 0.8) return '#10B981' // Green for high
    if (conf >= 0.5) return '#F59E0B' // Yellow/Amber for medium
    return '#EF4444' // Red for low
  }
  const confidenceColor = getConfidenceColor(confidence)

  return (
    <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
      <div className="mb-6">
        <h3 className="text-sm font-display font-bold text-white mb-1">
          Choice Landscape
        </h3>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
          Preference Distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Bars - Left Side */}
        <div className="lg:col-span-2">
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
            {sortedChoices.map(([choiceKey, stats, optionText]) => {
            const isWinner = choiceKey === choiceDistribution.winning_choice

            return (
              <div key={choiceKey} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        isWinner
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/10 text-gray-400 border border-white/10'
                      }`}
                    >
                      {choiceKey}
                    </span>
                    <span className={`text-sm font-medium ${isWinner ? 'text-white' : 'text-gray-400'}`}>
                      {optionText}
                    </span>
                    {isWinner && (
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        WINNER
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-mono font-bold ${isWinner ? 'text-blue-400' : 'text-gray-500'}`}>
                    {formatPercentage(stats.percentage)}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isWinner
                        ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                          : stats.percentage > 0
                          ? 'bg-gray-600'
                          : 'bg-gray-800'
                    }`}
                      style={{ width: `${Math.max(stats.percentage, 0)}%` }}
                  />
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Circular Gauges - Right Side */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-4 flex flex-col items-center">
            <CircularGauge
              value={panelSize}
              label="RESPONSE"
              color="#3B82F6"
              size={100}
              strokeWidth={8}
              displayValue={panelSize}
              isPercentage={false}
              showPercentage={false}
            />
          </div>
          <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-4 flex flex-col items-center">
            <CircularGauge
              value={competitiveAnalysis?.competitive_strength ?? 0}
              label="Dominance"
              color="#10B981"
              size={100}
              strokeWidth={8}
            />
          </div>
          <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-4 flex flex-col items-center">
            <CircularGauge
              value={confidence}
              label="CONFIDENCE"
              color={confidenceColor}
              size={100}
              strokeWidth={8}
              displayValue={confidenceLevel}
              isPercentage={true}
              showPercentage={false}
            />
          </div>
          <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-4 flex flex-col items-center">
            <CircularGauge
              value={coverage / 100}
              label="COVERAGE"
              color="#3B82F6"
              size={100}
              strokeWidth={8}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
