import { useState } from 'react'
import { X, Bot, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import type { MultiSurveyResult } from '../../types'

interface AnalysisModalProps {
  result: MultiSurveyResult
  onClose: () => void
}

const RESPONSES_PER_PAGE = 6

export function AnalysisModal({ result, onClose }: AnalysisModalProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4">
      <div className="w-full max-w-5xl bg-[#080808] backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl mt-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
              Agent Reasoning Analysis
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Detailed breakdown of why each AI agent chose their answers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-[#FF3B00] hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Selector Tabs */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {result.questions.map((questionResult, qIndex) => (
              <button
                key={`question-tab-${qIndex}`}
                onClick={() => {
                  setActiveQuestionIndex(qIndex)
                  setCurrentPage(1) // Reset pagination when changing questions
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 whitespace-nowrap ${
                  activeQuestionIndex === qIndex
                    ? 'bg-[#FF3B00] text-black font-bold'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-[#FF3B00]/30 hover:text-white'
                }`}
              >
                <span className="font-bold">Q{qIndex + 1}</span>
                <span className="ml-2 opacity-70">
                  {questionResult.question.length > 30
                    ? `${questionResult.question.substring(0, 30)}...`
                    : questionResult.question}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Question Content */}
        <div className="p-6">
          {result.questions[activeQuestionIndex] && (
            <div>
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                <div className="w-10 h-10 bg-[#FF3B00]/10 rounded-lg flex items-center justify-center border border-[#FF3B00]/30 flex-shrink-0">
                  <span className="text-[#FF3B00] font-bold text-sm">Q{activeQuestionIndex + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    "{result.questions[activeQuestionIndex].question}"
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 font-mono">
                    {Object.keys(result.questions[activeQuestionIndex].agent_responses || {}).length} agent responses
                  </p>
                </div>
              </div>

              {/* Agent Response Cards with Pagination */}
              {(() => {
                const allResponses = Object.entries(result.questions[activeQuestionIndex].agent_responses || {})
                const totalPages = Math.ceil(allResponses.length / RESPONSES_PER_PAGE)
                const startIndex = (currentPage - 1) * RESPONSES_PER_PAGE
                const endIndex = startIndex + RESPONSES_PER_PAGE
                const paginatedResponses = allResponses.slice(startIndex, endIndex)
                
                return (
                  <>
                    {/* Pagination Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-mono text-gray-500">
                        Showing {startIndex + 1}-{Math.min(endIndex, allResponses.length)} of {allResponses.length} responses
                      </div>
                    </div>
                    
                    {/* Response Cards - 2 per row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {paginatedResponses.map(([agentId, response], index) => {
                        const actualIndex = startIndex + index
                        return (
                          <AgentResponseCard
                            key={`${activeQuestionIndex}-${agentId}-${actualIndex}`}
                            agentId={`Agent ${actualIndex + 1}`}
                            response={response}
                          />
                        )
                      })}
                    </div>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-[#FF3B00]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg text-xs font-mono transition-all duration-300 ${
                                currentPage === page
                                  ? 'bg-[#FF3B00] text-black font-bold'
                                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-[#FF3B00]/30'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-[#FF3B00]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentResponseCard({ agentId, response }: { agentId: string; response: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#FF3B00]/30 rounded-lg flex items-center justify-center bg-[#FF3B00]/5">
              <Bot className="w-5 h-5 text-[#FF3B00]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{agentId}</h4>
              <p className="text-[10px] text-gray-500 font-mono">AI Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Choice Badge */}
            <span className="text-sm font-mono text-[#FF3B00] bg-[#FF3B00]/10 px-3 py-1 rounded-lg border border-[#FF3B00]/20">
              Choice: {response.choice || 'N/A'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#FF3B00] bg-white/5 hover:bg-[#FF3B00]/10 border border-white/10 hover:border-[#FF3B00]/30 rounded-lg transition-all duration-300 flex items-center gap-1"
            >
              <span>{isExpanded ? 'Less' : 'More'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Selected Option Display */}
        {response.selection && (
          <div className="mb-4 p-4 bg-[#FF3B00]/5 border border-[#FF3B00]/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF3B00]/10 rounded-lg flex items-center justify-center border border-[#FF3B00]/30">
                <span className="text-lg font-bold text-[#FF3B00]">{response.choice || '?'}</span>
              </div>
              <div>
                <div className="text-[10px] text-[#FF3B00]/70 font-mono uppercase mb-1">Selected Option</div>
                <div className="text-white font-medium">{response.selection}</div>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Bar - Always Visible */}
        {response.confidence && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] text-gray-500 font-mono w-20">Confidence</span>
            <div className="flex-1 bg-white/5 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#FF3B00] to-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${response.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#FF3B00] font-mono font-bold w-12 text-right">
              {Math.round(response.confidence * 100)}%
            </span>
          </div>
        )}

        {/* Expandable Content */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 space-y-4 border-t border-white/5 mt-4">
            {/* Reasoning */}
            {response.reasoning && (
              <div>
                <div className="text-xs font-mono text-gray-500 uppercase mb-2">Reasoning</div>
                <div className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {response.reasoning}
                </div>
              </div>
            )}

            {/* Decision Factors */}
            {response.decision_factors && response.decision_factors.length > 0 && (
              <div>
                <div className="text-xs font-mono text-gray-500 uppercase mb-2">Decision Factors</div>
                <div className="flex flex-wrap gap-2">
                  {response.decision_factors.map((factor: string, idx: number) => (
                    <span key={idx} className="text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 border border-[#FF3B00]/20 px-3 py-1.5 rounded-lg">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Persona Traits */}
            {response.persona_traits_used && response.persona_traits_used.length > 0 && (
              <div>
                <div className="text-xs font-mono text-gray-500 uppercase mb-2">Persona Traits Used</div>
                <div className="flex flex-wrap gap-2">
                  {response.persona_traits_used.map((trait: string, idx: number) => (
                    <span key={idx} className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Context Analysis */}
            {response.context_analysis && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs font-mono text-gray-500 uppercase mb-2">Context Analysis</div>
                <div className="text-sm text-gray-300">
                  <div><span className="text-gray-500">Primary Context:</span> {response.context_analysis.primary_context || 'N/A'}</div>
                  {response.context_analysis.complexity && (
                    <div className="mt-1"><span className="text-gray-500">Complexity:</span> {response.context_analysis.complexity}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
