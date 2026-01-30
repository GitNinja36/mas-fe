import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw, CheckCircle, Search, Filter, ChevronLeft, ChevronRight, X, HelpCircle, Coins, Clock, Download, BarChart3, MessageSquare, TrendingUp, LayoutGrid } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useSurveyContext } from '../context/SurveyContext'
import { useAuth } from '../context/AuthContext'
import { ReportViewV2 } from '../components/results/ReportViewV2'
import { PolymarketReportView } from '../components/results/PolymarketReportView'
import { UserResponsesTab } from '../components/results/tabs/UserResponsesTab'
import { PatternsTab } from '../components/results/tabs/PatternsTab'
import { getSurveyHistory, getSurveyDetails } from '../api'

interface SurveyHistoryItem {
  id: string
  surveyId: string
  question: string
  participantCount: number
  creditsUsed: number
  status: string
  createdAt: string
  completedAt: string | null
}

type TabType = 'executive' | 'patterns' | 'responses'

export default function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { surveyResult, resetSurvey, setSurveyResult } = useSurveyContext()
  const { isAuthenticated } = useAuth()
  const [surveyHistory, setSurveyHistory] = useState<SurveyHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<TabType>('executive')
  const itemsPerPage = 9

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'executive', label: 'Question Results', icon: BarChart3 },
    { id: 'patterns', label: 'Patterns & Archetypes', icon: LayoutGrid },
    { id: 'responses', label: 'User Responses', icon: MessageSquare },
  ]

  // Fetch survey history if no current result or if result is processing/pending
  useEffect(() => {
    if (isAuthenticated) {
      const shouldShowHistory = !surveyResult ||
        (surveyResult as any)?.status === 'processing' ||
        (surveyResult as any)?.status === 'pending'

      if (shouldShowHistory) {
        setShowHistory(true)
        loadSurveyHistory()
      }
    }
  }, [surveyResult, isAuthenticated])

  // Poll for processing surveys every 10 seconds - only update status for pending surveys
  useEffect(() => {
    if (!isAuthenticated || !showHistory) return

    const pendingSurveyIds = surveyHistory
      .filter(s => s.status === 'processing' || s.status === 'pending')
      .map(s => s.id)

    if (pendingSurveyIds.length === 0) return

    const interval = setInterval(async () => {
      // Only update status for pending surveys, don't reload entire history
      try {
        const history = await getSurveyHistory(100)
        const updatedSurveys = history.surveys || []

        // Update only the status of pending surveys without reloading everything
        setSurveyHistory(prevHistory => {
          return prevHistory.map(survey => {
            const updatedSurvey = updatedSurveys.find(us => us.id === survey.id)
            // Only update if survey was pending/processing and status changed
            if (pendingSurveyIds.includes(survey.id) && updatedSurvey) {
              return {
                ...survey,
                status: updatedSurvey.status,
                completedAt: updatedSurvey.completedAt || survey.completedAt
              }
            }
            return survey
          })
        })
      } catch (error: any) {
        // Handle rate limit errors gracefully
        if (error.message?.includes('429') || error.message?.includes('rate limit') || error.message?.includes('Too many requests')) {
          console.warn('Rate limit reached for survey status check, will retry later')
          return
        }
        console.error('Failed to check survey status:', error)
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [surveyHistory, isAuthenticated, showHistory])

  const loadSurveyHistory = async () => {
    setLoadingHistory(true)
    try {
      const history = await getSurveyHistory(100) // Load more for client-side filtering
      setSurveyHistory(history.surveys || [])
      setCurrentPage(1) // Reset to first page when loading new data
    } catch (error: any) {
      // Handle rate limit errors gracefully
      if (error.message?.includes('429') || error.message?.includes('rate limit') || error.message?.includes('Too many requests')) {
        console.warn('Rate limit reached for survey history, please try again later')
        // Keep existing history if available
        return
      }
      console.error('Failed to load survey history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  // Filter and paginate surveys
  const filteredAndPaginatedSurveys = useMemo(() => {
    let filtered = surveyHistory

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(survey =>
        survey.question.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        // Include both 'pending' and 'processing' statuses when filtering for 'pending'
        filtered = filtered.filter(survey => survey.status === 'pending' || survey.status === 'processing')
      } else {
        filtered = filtered.filter(survey => survey.status === statusFilter)
      }
    }

    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = filtered.slice(startIndex, endIndex)

    return {
      surveys: paginated,
      total: filtered.length,
      totalPages
    }
  }, [surveyHistory, searchQuery, statusFilter, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const handleSelectSurvey = async (surveyId: string) => {
    try {
      const surveyData = await getSurveyDetails(surveyId)

      // If survey is still processing, show history with this survey highlighted
      if (surveyData?.status === 'processing' || surveyData?.status === 'pending') {
        // Show history and let polling update the status
        setShowHistory(true)
        await loadSurveyHistory()
        return
      }

      if (surveyData?.mcpResponse) {
        const result = surveyData.mcpResponse as any
        // Add credits information from survey data
        if (surveyData.creditsUsed) {
          result.creditsUsed = surveyData.creditsUsed
        }
        if (surveyData.participantCount) {
          result.participantCount = surveyData.participantCount
        }
        // Add Polymarket flags from survey data (for reports loaded from history)
        if (surveyData.isPolymarket !== undefined) {
          result.isPolymarket_enable = surveyData.isPolymarket
          result.isPolymarket = surveyData.isPolymarket
        }
        setSurveyResult(result)
        setShowHistory(false)
        setActiveTab('executive') // Reset to executive tab
      }
    } catch (error) {
      console.error('Failed to load survey details:', error)
    }
  }

  // Check for surveyId in URL and load that survey automatically
  useEffect(() => {
    const surveyIdFromUrl = searchParams.get('surveyId')
    if (surveyIdFromUrl && isAuthenticated) {
      handleSelectSurvey(surveyIdFromUrl).then(() => {
        // Remove surveyId from URL after loading (in next tick to avoid render warning)
        setTimeout(() => {
          navigate('/results', { replace: true })
        }, 0)
      }).catch(err => {
        console.error('Failed to load survey from URL:', err)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated])

  // Redirect if no results and not authenticated
  useEffect(() => {
    if (!surveyResult && !isAuthenticated) {
      navigate('/survey')
    }
  }, [surveyResult, isAuthenticated, navigate])

  const handleDownload = (type: 'json' | 'csv') => {
    if (!surveyResult) return

    let content = ''
    let mimeType = ''
    let extension = ''

    if (type === 'json') {
      content = JSON.stringify(surveyResult, null, 2)
      mimeType = 'application/json'
      extension = 'json'
    } else {
      // CSV Logic
      const allResponses = (surveyResult as any).agent_responses_list ||
        Object.values((surveyResult as any).agent_responses_grouped || {}).flatMap((g: any) => g.responses) || []

      if (allResponses.length === 0) {
        alert('No response data to export')
        return
      }

      const headers = ['agent_id', 'platform', 'choice', 'confidence', 'reasoning']
      const csvRows = [headers.join(',')]

      for (const row of allResponses) {
        const values = headers.map(header => {
          const val = row[header] || ''
          const escaped = ('' + val).replace(/"/g, '""') // Escape double quotes
          return `"${escaped}"`
        })
        csvRows.push(values.join(','))
      }
      content = csvRows.join('\n')
      mimeType = 'text/csv'
      extension = 'csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survey-report-${new Date().toISOString().split('T')[0]}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Show history view if no current result but user is authenticated
  if (!surveyResult && isAuthenticated && showHistory) {
    const statusOptions = [
      { value: 'all', label: 'All Status' },
      { value: 'completed', label: 'Completed' },
      { value: 'failed', label: 'Failed' },
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
    ]

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return 'Today'
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else if (diffDays < 7) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
      }
    }

    return (
      <div className="min-h-screen bg-[#050505] relative flex flex-col">
        <div className="fixed inset-0 bg-[#050505] -z-50" />
        <div className="noise-overlay" />

        <Navigation />

        <main className={`flex-1 px-4 relative ${isAuthenticated ? 'md:ml-64 pt-8' : 'pt-28 pb-20'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Survey History
              </h1>
              <p className="text-base text-gray-500 max-w-xl mx-auto">
                View and manage your past survey reports and results
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search surveys by question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#FF3B00]/50 focus:ring-1 focus:ring-[#FF3B00]/20 transition-all text-sm font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-12 pr-8 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF3B00]/50 focus:ring-1 focus:ring-[#FF3B00]/20 transition-all text-sm font-mono appearance-none cursor-pointer"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-[#080808]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              {!loadingHistory && (
                <div className="text-xs text-gray-500 font-mono">
                  Showing {filteredAndPaginatedSurveys.surveys.length} of {filteredAndPaginatedSurveys.total} surveys
                  {(searchQuery || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('all')
                      }}
                      className="ml-2 text-[#FF3B00] hover:text-white transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {loadingHistory ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B00]"></div>
                <p className="mt-4 text-gray-400 font-mono text-sm">Loading history...</p>
              </div>
            ) : filteredAndPaginatedSurveys.total === 0 ? (
              <div className="text-center py-20 bg-[#080808] rounded-2xl border border-white/10 spotlight-card">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2 font-mono">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No surveys match your filters'
                    : 'No survey history yet'}
                </p>
                {searchQuery || statusFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                    }}
                    className="text-[#FF3B00] hover:text-white transition-colors text-sm font-mono mt-4"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/survey')}
                    className="bg-[#FF3B00] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black hover:bg-white transition-colors mt-6"
                  >
                    Create Your First Survey
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Survey Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {filteredAndPaginatedSurveys.surveys.map((survey) => (
                    <button
                      key={survey.id}
                      onClick={() => handleSelectSurvey(survey.surveyId)}
                      className="group relative bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 text-left hover:border-[#FF3B00]/40 transition-all duration-500 spotlight-card hover:-translate-y-1.5 overflow-hidden shadow-lg shadow-black/40"
                    >
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Status Badge */}
                      <div className="absolute top-5 right-5 z-10">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${survey.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : survey.status === 'failed'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                          {survey.status === 'processing' ? 'PENDING' : survey.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Question Icon and Text */}
                      <div className="flex items-start gap-5 mb-8 pr-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 group-hover:border-[#FF3B00]/20 group-hover:bg-[#FF3B00]/5 shadow-inner">
                          <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-[#FF3B00] transition-colors duration-300" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-white font-bold font-display text-lg leading-snug line-clamp-2 group-hover:text-[#FF3B00] transition-colors duration-300">
                            {survey.question}
                          </h3>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={12} className="text-[#FF3B00]" />
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Responses</span>
                          </div>
                          <span className="text-2xl font-bold text-white font-display">
                            {survey.participantCount}
                          </span>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Coins size={12} className="text-[#FF3B00]" />
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Credits</span>
                          </div>
                          <span className="text-2xl font-bold text-white font-display">
                            {survey.creditsUsed.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-xs text-gray-500 font-mono">
                            {formatDate(survey.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#FF3B00] opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <span className="text-xs font-bold font-mono tracking-wider">VIEW REPORT</span>
                          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pagination */}
                {filteredAndPaginatedSurveys.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-[#080808] border border-white/10 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/10 transition-all disabled:hover:border-white/10 disabled:hover:bg-[#080808]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, filteredAndPaginatedSurveys.totalPages) }, (_, i) => {
                        let pageNum
                        if (filteredAndPaginatedSurveys.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= filteredAndPaginatedSurveys.totalPages - 2) {
                          pageNum = filteredAndPaginatedSurveys.totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-xl text-sm font-mono transition-all ${currentPage === pageNum
                              ? 'bg-[#FF3B00] text-black font-bold'
                              : 'bg-[#080808] border border-white/10 text-white hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/10'
                              }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(filteredAndPaginatedSurveys.totalPages, prev + 1))}
                      disabled={currentPage === filteredAndPaginatedSurveys.totalPages}
                      className="px-4 py-2 bg-[#080808] border border-white/10 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/10 transition-all disabled:hover:border-white/10 disabled:hover:bg-[#080808]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* New Survey Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate('/survey')}
                className="bg-[#FF3B00] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3B00]/20 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Survey
              </button>
            </div>
          </div>
        </main>

        <div className={isAuthenticated ? 'md:ml-64' : ''} style={{ marginTop: '2rem' }}>
          <Footer />
        </div>
      </div>
    )
  }

  if (!surveyResult) {
    return null
  }

  function handleNewSurvey() {
    resetSurvey()
    navigate('/survey')
  }

  // Check if this is a Polymarket survey
  const isPolymarketReport = (surveyResult as any)?.isPolymarket_enable || (surveyResult as any)?.isPolymarket || false

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />
      <div className="noise-overlay" />

      {/* Hide Sidebar when viewing a report */}
      <div className="hidden">
        <Navigation />
      </div>

      {/* Main Content - No sidebar offset */}
      <main className="flex-1 px-4 relative pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Back Button - Fixed positioning for easy access */}
          <div className="absolute top-8 left-4 md:left-8">
            <button
              onClick={() => {
                setShowHistory(true)
                setSurveyResult(null)
                loadSurveyHistory()
              }}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-xs px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to History
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-10 mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono text-green-400">ANALYSIS COMPLETE</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Survey Report
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto mb-4">
              Based on {surveyResult.total_responses || 0} AI agents{surveyResult.methodology?.cohort_description ? ` representing ${surveyResult.methodology.cohort_description}` : ''}
            </p>
            {/* Credits Used Display */}
            {(surveyResult as any).creditsUsed && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3B00]/10 border border-[#FF3B00]/30 rounded-full">
                <Coins className="w-4 h-4 text-[#FF3B00]" />
                <span className="text-xs font-mono text-[#FF3B00]">
                  {((surveyResult as any).creditsUsed || 0).toLocaleString()} Credits Used
                </span>
              </div>
            )}
          </div>

          {/* Conditional Rendering based on Polymarket flag */}
          {isPolymarketReport ? (
            // Polymarket Report View - No tabs, full report
            <div className="animate-enter">
              <PolymarketReportView data={surveyResult} />
            </div>
          ) : (
            // Regular Multi-Survey Report - With tabs
            <>
              {/* Report Tabs */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                          ? 'bg-[#FF3B00] text-black shadow-lg shadow-[#FF3B00]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="animate-enter">
                {activeTab === 'executive' && (
                  <ReportViewV2 data={surveyResult} />
                )}
                {activeTab === 'patterns' && (
                  <PatternsTab data={surveyResult} />
                )}
                {activeTab === 'responses' && (
                  <UserResponsesTab result={surveyResult} />
                )}
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">


            {/* New Survey Button */}
            <button
              onClick={handleNewSurvey}
              className="bg-[#FF3B00] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3B00]/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Survey
            </button>
          </div>
        </div>
      </main >

      <Footer />
    </div >
  )
}
