import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, RefreshCw, CheckCircle, Users, TrendingUp, Sparkles, ChevronDown, MessageSquare, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useSurveyContext } from '../context/SurveyContext'
import { AnalysisModal } from '../components'

export default function ResultsPage() {
  const navigate = useNavigate()
  const {
    multiSurveyResult,
    activeResultIndex,
    setActiveResultIndex,
    resetSurvey
  } = useSurveyContext()

  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showAgentDetails, setShowAgentDetails] = useState(false)
  const [agentResponsePage, setAgentResponsePage] = useState(1)
  const RESPONSES_PER_PAGE = 6

  // Redirect if no results
  useEffect(() => {
    if (!multiSurveyResult) {
      navigate('/agent')
    }
  }, [multiSurveyResult, navigate])

  if (!multiSurveyResult) {
    return null
  }

  const currentQuestion = multiSurveyResult.questions[activeResultIndex]
  
  // Calculate overall consistency from all questions
  const overallConsistency = multiSurveyResult.questions.reduce((acc, q) => {
    return acc + (q.analytics?.consistency_score || 0)
  }, 0) / multiSurveyResult.questions.length * 100

  // Calculate average confidence
  const avgConfidence = multiSurveyResult.questions.reduce((acc, q) => {
    const responses = Object.values(q.agent_responses || {}) as any[]
    const qConf = responses.reduce((sum, r) => sum + (r.confidence || 0), 0) / (responses.length || 1)
    return acc + qConf
  }, 0) / multiSurveyResult.questions.length * 100

  function handleNewSurvey() {
    resetSurvey()
    navigate('/agent')
  }

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />
      <div className="noise-overlay" />

      <Navigation />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/agent')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#FF3B00] transition-colors mb-8 font-mono text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Survey
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono text-green-400">ANALYSIS COMPLETE</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Survey Results
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Your AI agents have processed all questions. Review the insights below.
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#FF3B00]" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Questions</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {multiSurveyResult.overall_analytics.total_questions}
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#FF3B00]" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Responses</span>
              </div>
              <div className="text-2xl font-display font-bold text-[#FF3B00]">
                {multiSurveyResult.overall_analytics.total_responses}
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 hover:border-green-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Consistency</span>
              </div>
              <div className="text-2xl font-display font-bold text-green-500">
                {overallConsistency.toFixed(1)}%
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 hover:border-purple-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Confidence</span>
              </div>
              <div className="text-2xl font-display font-bold text-purple-400">
                {avgConfidence.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          {multiSurveyResult.questions.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {multiSurveyResult.questions.map((question, index) => (
                <button
                  key={`result-tab-${index}`}
                  onClick={() => {
                    setActiveResultIndex(index)
                    setAgentResponsePage(1) // Reset pagination when switching questions
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    activeResultIndex === index
                      ? 'bg-[#FF3B00] text-black font-bold'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-[#FF3B00]/30 hover:text-white'
                  }`}
                >
                  <span>Q{index + 1}</span>
                  <span className="opacity-70 max-w-[120px] truncate">
                    {question.question.substring(0, 25)}...
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Current Question Results */}
          {currentQuestion && (
            <div className="bg-[#080808] rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
              {/* Question Header */}
              <div className="mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-[#FF3B00] bg-[#FF3B00]/10 px-2 py-1 rounded">
                    QUESTION {activeResultIndex + 1}
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl text-white">
                  "{currentQuestion.question}"
                </h2>
              </div>

              {/* Choice Distribution */}
              {currentQuestion.analytics?.choice_distribution && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider">Choice Distribution</h3>
                  {currentQuestion.options.map((option, optIndex) => {
                    const choiceLetter = String.fromCharCode(65 + optIndex)
                    const countData: any = currentQuestion.analytics.choice_distribution[choiceLetter]
                    const count =
                      typeof countData === 'object' && countData !== null && 'count' in countData
                        ? (countData as { count: number }).count
                        : typeof countData === 'number'
                          ? countData
                          : 0
                    const percentage = currentQuestion.analytics?.total_responses
                      ? Math.round((count / currentQuestion.analytics.total_responses) * 100)
                      : 0
                    const isWinner = percentage === Math.max(...currentQuestion.options.map((_, i) => {
                      const letter = String.fromCharCode(65 + i)
                      const data: any = currentQuestion.analytics.choice_distribution[letter]
                      const c = typeof data === 'object' && data !== null && 'count' in data ? data.count : typeof data === 'number' ? data : 0
                      return currentQuestion.analytics?.total_responses ? Math.round((c / currentQuestion.analytics.total_responses) * 100) : 0
                    }))

                    return (
                      <div key={`option-${optIndex}`} className={`p-4 rounded-xl border transition-all duration-300 ${isWinner ? 'bg-[#FF3B00]/5 border-[#FF3B00]/30' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isWinner ? 'bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/30' : 'bg-white/10 text-gray-400 border border-white/10'}`}>
                              {choiceLetter}
                            </div>
                            <span className="text-white font-medium text-sm">{option}</span>
                            {isWinner && <span className="text-[10px] font-mono text-[#FF3B00] bg-[#FF3B00]/10 px-2 py-0.5 rounded">WINNER</span>}
                          </div>
                          <span className={`text-sm font-mono font-bold ${isWinner ? 'text-[#FF3B00]' : 'text-gray-400'}`}>
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-gradient-to-r from-[#FF3B00] to-yellow-500' : 'bg-gray-600'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Analytics Summary */}
              {currentQuestion.analytics && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                    <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Consistency Score</div>
                    <div className="text-xl font-display font-bold text-green-500">
                      {(currentQuestion.analytics.consistency_score * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                    <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">Total Responses</div>
                    <div className="text-xl font-display font-bold text-[#FF3B00]">
                      {currentQuestion.analytics.total_responses}
                    </div>
                  </div>
                </div>
              )}

              {/* Decision Factors */}
              {currentQuestion.analytics?.decision_factors && currentQuestion.analytics.decision_factors.length > 0 && (
                <div className="pt-6 mt-6 border-t border-white/5">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">Key Decision Factors</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.analytics.decision_factors.map((factor, index) => (
                      <span key={index} className="text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 border border-[#FF3B00]/20 px-3 py-1.5 rounded-lg">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agent Insights Summary */}
          {currentQuestion?.agent_responses && Object.keys(currentQuestion.agent_responses).length > 0 && (
            <div className="bg-[#080808] rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Agent Insights</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.keys(currentQuestion.agent_responses).length} agents responded
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAgentDetails(!showAgentDetails)
                    setAgentResponsePage(1) // Reset to first page when toggling
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#FF3B00] transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#FF3B00]/30"
                >
                  <Eye className="w-3 h-3" />
                  {showAgentDetails ? 'Hide Details' : 'View Details'}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAgentDetails ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Quick Summary - Always Visible */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {(() => {
                  const responses = Object.values(currentQuestion.agent_responses) as any[]
                  const choiceCounts: { [key: string]: number } = {}
                  let totalConf = 0
                  responses.forEach((r: any) => {
                    choiceCounts[r.choice] = (choiceCounts[r.choice] || 0) + 1
                    totalConf += r.confidence || 0
                  })
                  const topChoice = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1])[0]
                  const avgConf = (totalConf / responses.length * 100).toFixed(0)
                  const agreement = topChoice ? ((topChoice[1] / responses.length) * 100).toFixed(0) : '0'
                  
                  return (
                    <>
                      <div className="text-center p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                        <div className="text-2xl font-bold text-[#FF3B00] mb-1">{topChoice?.[0] || '-'}</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase">Top Choice</div>
                      </div>
                      <div className="text-center p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                        <div className="text-2xl font-bold text-green-500 mb-1">{agreement}%</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase">Agreement</div>
                      </div>
                      <div className="text-center p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                        <div className="text-2xl font-bold text-purple-400 mb-1">{avgConf}%</div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase">Avg Confidence</div>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Sample Reasoning - Always Visible */}
              <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#FF3B00]" />
                  <span className="text-xs font-mono text-gray-500 uppercase">Sample Reasoning</span>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "{(Object.values(currentQuestion.agent_responses)[0] as any)?.reasoning || 'No reasoning provided'}"
                </p>
              </div>

              {/* Detailed Responses - Collapsible with Pagination */}
              {showAgentDetails && (
                <div className="pt-4 border-t border-white/5">
                  {(() => {
                    const allResponses = Object.entries(currentQuestion.agent_responses)
                    const totalPages = Math.ceil(allResponses.length / RESPONSES_PER_PAGE)
                    const startIndex = (agentResponsePage - 1) * RESPONSES_PER_PAGE
                    const endIndex = startIndex + RESPONSES_PER_PAGE
                    const paginatedResponses = allResponses.slice(startIndex, endIndex)
                    
                    return (
                      <>
                        {/* Header with pagination info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xs font-mono text-gray-500 uppercase">
                            All Agent Responses
                          </div>
                          <div className="text-xs font-mono text-gray-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, allResponses.length)} of {allResponses.length}
                          </div>
                        </div>
                        
                        {/* Response Cards - 2 per row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {paginatedResponses.map(([agentId, response]: [string, any], index) => {
                            const actualIndex = startIndex + index
                            return (
                              <div key={agentId} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center text-[10px] font-mono text-[#FF3B00]">
                                      {actualIndex + 1}
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">Agent {actualIndex + 1}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 px-2 py-0.5 rounded">
                                      {response.choice || 'N/A'}
                                    </span>
                                    {response.confidence && (
                                      <span className="text-xs font-mono text-green-400">
                                        {(response.confidence * 100).toFixed(0)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {response.reasoning && (
                                  <p className="text-xs text-gray-400 pl-8 line-clamp-2">
                                    {response.reasoning}
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                            <button
                              onClick={() => setAgentResponsePage(prev => Math.max(1, prev - 1))}
                              disabled={agentResponsePage === 1}
                              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-[#FF3B00]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                  key={page}
                                  onClick={() => setAgentResponsePage(page)}
                                  className={`w-8 h-8 rounded-lg text-xs font-mono transition-all duration-300 ${
                                    agentResponsePage === page
                                      ? 'bg-[#FF3B00] text-black font-bold'
                                      : 'border border-white/10 text-gray-400 hover:text-white hover:border-[#FF3B00]/30'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => setAgentResponsePage(prev => Math.min(totalPages, prev + 1))}
                              disabled={agentResponsePage === totalPages}
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
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowAnalysis(true)}
              className="px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Full Analysis
            </button>
            <button
              onClick={handleNewSurvey}
              className="bg-[#FF3B00] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-500 text-black hover:bg-white hover:shadow-lg hover:shadow-[#FF3B00]/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Survey
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Analysis Modal */}
      {showAnalysis && (
        <AnalysisModal result={multiSurveyResult} onClose={() => setShowAnalysis(false)} />
      )}
    </div>
  )
}
