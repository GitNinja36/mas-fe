import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { ChevronDown } from 'lucide-react'  
import { formatConfidence } from '../utils/formatters'
import { getPlatformColor } from '../utils/colorMap'

interface PanelReasoningCardProps {
  synthesizedSummary: string
  agentSamples: any[]
}

const CARDS_PER_PAGE = 6 // 2 columns x 3 rows

export function PanelReasoningCard({
  synthesizedSummary,
  agentSamples
}: PanelReasoningCardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())
  const totalPages = Math.ceil((agentSamples?.length || 0) / CARDS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const endIndex = startIndex + CARDS_PER_PAGE
  const currentAgents = agentSamples?.slice(startIndex, endIndex) || []

  const toggleExpanded = (agentId: string) => {
    setExpandedAgents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(agentId)) {
        newSet.delete(agentId)
      } else {
        newSet.add(agentId)
      }
      return newSet
    })
  }

  const isExpanded = (agentId: string) => expandedAgents.has(agentId)

  return (
    <div className="space-y-6">
      {/* Synthesized Summary */}
      {synthesizedSummary && synthesizedSummary.trim() && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-3">
            SYNTHESIZED SUMMARY
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {synthesizedSummary}
          </p>
        </div>
      )}

      {/* Individual Agent Responses */}
      {agentSamples && agentSamples.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 pt-8">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider">
              Agent Reasoning
            </h3>
          </div>

          {/* Agent Cards Grid - 2 columns x 3 rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3">
            {currentAgents.map((agent, idx) => {
              const globalIndex = startIndex + idx
              const platformColor = getPlatformColor(agent.platform)
              const agentId = agent.agent_id || `agent-${globalIndex}`
              const expanded = isExpanded(agentId)
              // Show reasoning_summary when collapsed (show more), reasoning when expanded (show less)
              const reasoningText = expanded 
                ? (agent.reasoning || agent.reasoning_summary || 'No reasoning available')
                : (agent.reasoning_summary || agent.reasoning || 'No reasoning available')
              
              return (
                <div
                  key={agentId}
                  className="bg-[#080808] rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white border-2 flex-shrink-0"
                      style={{
                        backgroundColor: `${platformColor}20`,
                        borderColor: `${platformColor}40`
                      }}
                    >
                      {globalIndex + 1}
                    </div>
                    <span className="text-sm font-medium text-white">
                      Agent_{globalIndex + 1}
                    </span>
                    <button
                      onClick={() => toggleExpanded(agentId)}
                      className="ml-auto flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                        </>
                      )}
                    </button>
                  </div>
                  <blockquote className={`text-sm text-gray-300 italic border-l-2 border-white/10 pl-3 mb-3 transition-all duration-300 ease-in-out ${expanded ? '' : 'line-clamp-3'}`}>
                    "{reasoningText}"
                  </blockquote>
                  <div className="flex flex-wrap gap-2 justify-between">
                    {/* agent.confidence */}
                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                      {formatConfidence(agent.confidence, 0)} : {agent.choice}
                    </span>

                    {/* agent.platform */}
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded capitalize"
                      style={{
                        backgroundColor: `${platformColor}20`,
                        color: platformColor,
                        border: `1px solid ${platformColor}40`
                      }}
                    >
                      {agent.platform}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                Previous
              </button>
              <span className="text-xs font-mono text-gray-500 ml-4 mr-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="ml-4">Next</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}