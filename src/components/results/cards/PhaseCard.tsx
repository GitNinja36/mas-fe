import type { ImplementationPhase } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface PhaseCardProps {
  phase: ImplementationPhase
}

const phaseConfig = {
  'PHASE 1: NOW': {
    color: 'green',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-400',
    icon: CheckCircle,
  },
  'PHASE 2: Q2': {
    color: 'yellow',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400',
    icon: Clock,
  },
  'PHASE 3: BACKLOG': {
    color: 'orange',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    icon: Clock,
  },
  'AVOID': {
    color: 'red',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-400',
    icon: XCircle,
  },
}

export function PhaseCard({ phase }: PhaseCardProps) {
  const config = phaseConfig[phase.phase]
  const Icon = config.icon

  const isAvoidPhase = phase.phase === 'AVOID'
  
  return (
    <div className={`rounded-xl border p-5 hover:border-white/20 transition-all duration-300 h-full flex flex-col ${
      isAvoidPhase 
        ? 'bg-gradient-to-br from-red-500/5 to-[#080808] border-red-500/20' 
        : 'bg-[#080808] border-white/10'
    }`}>
      {/* Phase Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-display font-bold uppercase tracking-wider ${
            isAvoidPhase ? 'text-red-400' : 'text-white'
          }`}>
            {phase.phase}
          </h3>
          <p className={`text-xs font-mono mt-1 ${
            isAvoidPhase ? 'text-red-500/70' : 'text-gray-500'
          }`}>
            {phase.timeline}
          </p>
        </div>
      </div>

      {/* Phase Summary */}
      <div className="mb-4">
        <p className={`text-xs leading-relaxed ${
          isAvoidPhase ? 'text-red-300/80' : 'text-gray-400'
        }`}>
          {phase.rationale}
        </p>
        <div className={`flex items-center gap-4 mt-3 text-xs p-2 rounded-lg ${
          isAvoidPhase ? 'bg-red-500/10' : 'bg-[#0a0a0a]'
        }`}>
          <div className="text-gray-500">
            <span className="font-mono">Effort: </span>
            <span className={`font-semibold ${
              isAvoidPhase ? 'text-red-400' : 'text-gray-300'
            }`}>
              {phase.dev_effort_days}d
            </span>
          </div>
          <div className="text-gray-500">
            <span className="font-mono">Preference: </span>
            <span className={`font-semibold ${
              isAvoidPhase ? 'text-red-400' : 'text-gray-300'
            }`}>
              {formatPercentage(phase.preference_percentage, 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[280px] [scrollbar-width:thin] [scrollbar-color:#333_transparent]">
        {phase.options.length === 0 ? (
          <div className={`rounded-lg border p-4 text-center ${
            isAvoidPhase 
              ? 'bg-red-500/5 border-red-500/10' 
              : 'bg-[#0a0a0a] border-white/5'
          }`}>
            <p className={`text-xs italic ${
              isAvoidPhase ? 'text-red-400/70' : 'text-gray-500'
            }`}>
              No options in this phase
            </p>
          </div>
        ) : (
          phase.options.map((option, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-3 hover:border-white/10 transition-all duration-200 ${
                isAvoidPhase 
                  ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' 
                  : 'bg-[#0a0a0a] border-white/5 hover:bg-[#0f0f0f]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium text-white flex-1 line-clamp-2">
                  {option.option}
                </h4>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-xs font-bold ${
                    option.preference_percentage > 40 
                      ? 'text-green-400' 
                      : option.preference_percentage > 0 
                        ? 'text-yellow-400' 
                        : 'text-gray-600'
                  }`}>
                    {formatPercentage(option.preference_percentage, 1)}
                  </span>
                </div>
              </div>
              
              {/* Difficulty and ROI Badges */}
              {(option.difficulty || option.roi_score !== undefined) && (
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {option.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      option.difficulty === 'Low'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : option.difficulty === 'Medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {option.difficulty} Effort (~{option.dev_effort_days}d)
                    </span>
                  )}
                  {option.roi_score !== undefined && (
                    <>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-400">
                        ROI: <span className="font-semibold text-blue-400">{option.roi_score.toFixed(1)}</span>
                      </span>
                    </>
                  )}
                </div>
              )}
              {option.preference_percentage > 0 || phase.phase === 'AVOID' ? (
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
                  {option.rationale}
                </p>
              ) : null}
              {option.blockers && option.blockers.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-mono text-red-400 uppercase mb-1">Blockers:</p>
                      {option.blockers.map((blocker, bIdx) => (
                        <p key={bIdx} className="text-xs text-gray-500 line-clamp-1">
                          {blocker}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {option.dependencies && option.dependencies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-xs font-mono text-gray-500 uppercase mb-1">Dependencies:</p>
                  <div className="flex flex-wrap gap-1">
                    {option.dependencies.map((dep, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Phase Blockers (if any) */}
      {phase.blockers && phase.blockers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-mono text-red-400 uppercase mb-2">Phase Blockers:</p>
              {phase.blockers.map((blocker, idx) => (
                <p key={idx} className="text-xs text-gray-500 mb-1 line-clamp-2">
                  {blocker}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
