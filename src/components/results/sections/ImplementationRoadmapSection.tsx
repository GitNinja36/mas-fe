import { useMemo, useState } from 'react'
import type { EnhancedManagerSurveyResponse } from '../../../types'
import { PhaseCard } from '../cards/PhaseCard'
import { calculateImplementationRoadmap } from '../utils/roadmapCalculator'
import { formatLargeNumber } from '../utils/formatters'
import { AlertCircle, Lightbulb, TrendingUp, Calendar, Rocket, ChevronDown, ChevronUp } from 'lucide-react'

interface ImplementationRoadmapSectionProps {
  result: EnhancedManagerSurveyResponse
}

export function ImplementationRoadmapSection({ result }: ImplementationRoadmapSectionProps) {
  const [showRejected, setShowRejected] = useState(false)

  // Use backend data if available, otherwise calculate from survey data
  const roadmap = useMemo(() => {
    if (result.implementation_roadmap) {
      return result.implementation_roadmap
    }

    // Fallback: calculate from existing data
    return calculateImplementationRoadmap({
      choice_distribution: result.choice_distribution,
      decision_factors: result.decision_factors,
      risks_and_blindspots: result.risks_and_blindspots,
      options: result.options,
    })
  }, [result])

  if (!roadmap || roadmap.phases.length === 0) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <p className="text-sm text-gray-400">No implementation roadmap data available</p>
      </div>
    )
  }

  // Separate active phases from AVOID
  const activePhases = roadmap.phases.filter((p) => p.phase !== 'AVOID')
  const avoidPhase = roadmap.phases.find((p) => p.phase === 'AVOID')
  const hasOnlyAvoidPhase = roadmap.phases.length === 1 && roadmap.phases[0].phase === 'AVOID'

  // Calculate dynamic column count based on active phases
  const activePhaseCount = activePhases.length
  const gridCols = activePhaseCount === 1 ? 'lg:grid-cols-1' : activePhaseCount === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'

  // Calculate velocity indicator
  const avgROI = activePhases.length > 0
    ? activePhases.reduce((sum, phase) => {
        const phaseROI = phase.options.reduce((optSum, opt) => {
          return optSum + (opt.roi_score || 0)
        }, 0) / (phase.options.length || 1)
        return sum + phaseROI
      }, 0) / activePhases.length
    : 0

  const velocityLabel = avgROI > 10 ? 'High' : avgROI > 5 ? 'Medium' : 'Low'

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
          Implementation Roadmap
        </h3>
        {hasOnlyAvoidPhase ? (
          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-display font-bold text-red-400 mb-2">
                    No Recommended Implementation Path
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    All survey options received minimal or no preference from agents. This suggests the options may not align with your target audience's needs or preferences.
                  </p>
                  <div className="bg-[#0a0a0a] rounded-lg border border-white/5 p-4 mt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="text-xs font-mono text-yellow-400 uppercase mb-2">Recommended Actions</h5>
                        <ul className="space-y-2 text-xs text-gray-400">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>Review the survey question to ensure it's clear and relevant to your audience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>Consider adding more specific or differentiated options</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>Check if the agent personas match your target demographic</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span>Run the survey again with refined options or a different question</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className={`w-4 h-4 ${
                velocityLabel === 'High' ? 'text-green-400' : velocityLabel === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
              }`} />
              <div className="text-xs font-mono text-gray-500 uppercase">
                Est. Velocity
              </div>
            </div>
            <div className={`text-lg font-display font-bold ${
              velocityLabel === 'High' ? 'text-green-400' : velocityLabel === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              {velocityLabel}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div className="text-xs font-mono text-gray-500 uppercase">
                Timeline
              </div>
            </div>
            <div className={`text-lg font-display font-bold ${hasOnlyAvoidPhase ? 'text-gray-500' : 'text-blue-400'}`}>
              {hasOnlyAvoidPhase ? 'N/A' : roadmap.estimated_total_timeline}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <div className="text-xs font-mono text-gray-500 uppercase">
                Dev Effort
              </div>
            </div>
            <div className="text-lg font-display font-bold text-green-400">
              {formatLargeNumber(roadmap.total_dev_effort_days)}d
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
              </div>
              <div className="text-xs font-mono text-gray-500 uppercase">
                Options
              </div>
            </div>
            <div className="text-lg font-display font-bold text-orange-400">
              {roadmap.phases.reduce((sum, p) => sum + p.options.length, 0)}
            </div>
          </div>
        </div>
        {roadmap.skip_reasons && roadmap.skip_reasons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">
              Skip Reasons
            </div>
            <ul className="space-y-1">
              {roadmap.skip_reasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-gray-400">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Active Phases Grid - Dynamic Columns */}
      {activePhases.length > 0 && (
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
          {activePhases.map((phase) => (
            <PhaseCard key={phase.phase} phase={phase} />
          ))}
          
          {/* Empty State for Capacity Available */}
          {activePhases.length < 3 && (
            <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-70 transition-opacity">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-white font-bold mb-1">Roadmap Clear</h3>
              <p className="text-sm text-gray-400">
                High-priority items are scheduled. You have capacity for new initiatives in Q2.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rejected Options - Collapsed Section */}
      {avoidPhase && avoidPhase.options.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <button
            onClick={() => setShowRejected(!showRejected)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full group"
          >
            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-mono">
              {avoidPhase.options.length}
            </span>
            <span className="text-sm font-medium">Rejected / Deprioritized Options</span>
            {showRejected ? (
              <ChevronUp className="w-4 h-4 ml-auto group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto group-hover:text-white transition-colors" />
            )}
          </button>
          
          {showRejected && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {avoidPhase.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex items-start justify-between gap-2 hover:border-red-500/20 transition-colors"
                >
                  <span className="text-gray-400 text-sm flex-1">{opt.option}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {opt.difficulty && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px]">
                        {opt.difficulty}
                      </span>
                    )}
                    <span className="text-red-500 text-xs font-mono">{opt.preference_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dependencies Diagram (if any dependencies exist) */}
      {roadmap.phases.some((phase) =>
        phase.options.some((opt) => opt.dependencies && opt.dependencies.length > 0)
      ) && (
        <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
          <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            Dependencies
          </h3>
          <div className="space-y-3">
            {roadmap.phases.map((phase) =>
              phase.options
                .filter((opt) => opt.dependencies && opt.dependencies.length > 0)
                .map((opt, idx) => (
                  <div
                    key={`${phase.phase}-${idx}`}
                    className="bg-[#0a0a0a] rounded-lg border border-white/5 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-medium text-white flex-shrink-0">
                        {opt.option}
                      </span>
                      <span className="text-xs text-gray-500">→</span>
                      <div className="flex flex-wrap gap-2 flex-1">
                        {opt.dependencies?.map((dep, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
