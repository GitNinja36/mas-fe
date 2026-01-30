import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ArrowRight, Trash2, Target, Users, Zap } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useSurveyContext } from '../context/SurveyContext'
import { useAuth } from '../context/AuthContext'
import { fetchAgents, conductSurvey, getSurveyDetails } from '../api'
import { SAMPLE_QUESTIONS, MAX_QUESTIONS } from '../constants'
import { POLLING_CONFIG } from '../constants/app'
import { logger } from '../utils/logger'
import {
  TechCard,
  TechCardHeader,
  TechCardTitle,
  TechCardDescription,
  TechCardContent,
  QuestionEditor,
  ProgressBar,
  LoadingSpinner,
  InlineError
} from '../components'

export default function AgentPage() {
  const navigate = useNavigate()
  const { credits, refreshCredits, isAuthenticated } = useAuth()
  const {
    questions,
    activeQuestionIndex,
    setActiveQuestionIndex,
    loading,
    setLoading,
    error,
    setError,
    surveyProgress,
    setSurveyProgress,
    setAgents,
    setSurveyResult,
    addQuestion,
    removeQuestion,
    updateQuestion,
    handleOptionChange,
    addOption,
    removeOption
  } = useSurveyContext()

  useEffect(() => {
    loadAgents()
  }, [])

  async function loadAgents() {
    try {
      const agentData = await fetchAgents()
      setAgents(agentData)
    } catch (err) {
      logger.error('Failed to load agents:', err)
    }
  }

  // Calculate total anticipated cost of the survey
  const calculateTotalCost = () => {
    return questions.reduce((acc, q) => acc + (q.selectedUserCount || 0), 0)
  }

  function handleSampleQuestionSelect(sampleIndex: number) {
    const sample = SAMPLE_QUESTIONS[sampleIndex]
    // Ensure at least 3 options, but don't exceed 6
    const minOptions = Math.max(3, sample.options.length)
    const newOptions = [...sample.options]
    while (newOptions.length < minOptions && newOptions.length < 6) {
      newOptions.push('')
    }
    updateQuestion(activeQuestionIndex, 'question', sample.question)
    updateQuestion(activeQuestionIndex, 'options', newOptions)
  }

  // Wrapper for updateQuestion to enforce credit limits
  const handleUpdateQuestion: typeof updateQuestion = (index, field, value) => {
    if (field === 'selectedUserCount') {
      const newValue = value as number
      const currentCost = questions[index].selectedUserCount || 0
      const otherCost = calculateTotalCost() - currentCost
      const projectedTotal = otherCost + newValue

      // Check if we have credits info and if projected total exceeds available
      if (credits && projectedTotal > credits.availableCredits) {
        setError(`Credit is low: limit is ${credits.availableCredits} users.`)
        return
      }
      // Clear logic-based errors when input is valid
      if (error?.includes('Credit is low')) {
        setError(null)
      }
    }
    updateQuestion(index, field, value)
  }

  // Wrapper for addQuestion to enforce credit limits
  const handleAddQuestion = () => {
    const currentTotal = calculateTotalCost()
    if (credits && currentTotal >= credits.availableCredits) {
      setError(`Credit is low: You have used all ${credits.availableCredits} available credits. Cannot add more questions.`)
      return
    }
    addQuestion()
  }

  async function handleMultiSurvey() {
    // Validate all questions before starting
    const invalidQuestions: string[] = []

    // Check strict credit limit before launch
    const totalCost = calculateTotalCost()
    if (credits && totalCost > credits.availableCredits) {
      setError(`Insufficient credits. You need ${totalCost} but only have ${credits.availableCredits}.`)
      return
    }

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        invalidQuestions.push(`Question ${index + 1}: Missing question text`)
      } else if (q.options.filter((opt) => opt.trim()).length < 2) {
        invalidQuestions.push(`Question ${index + 1}: Need at least 2 options`)
      } else if (!q.cohortQuery?.trim()) {
        invalidQuestions.push(`Question ${index + 1}: Missing cohort query`)
      } else if (q.cohortCount === null || q.cohortCount === undefined) {
        invalidQuestions.push(`Question ${index + 1}: Please click "Check" to verify user count`)
      } else if (!q.selectedUserCount || q.selectedUserCount < 1) {
        invalidQuestions.push(`Question ${index + 1}: Invalid user count (minimum 1)`)
      }
    })

    if (invalidQuestions.length > 0) {
      setError(`Please fix the following issues:\n${invalidQuestions.join('\n')}`)
      return
    }

    // Filter to get only questions with content (non-empty)
    const validQuestions = questions.filter((q) => q.question.trim().length > 0)

    if (validQuestions.length === 0) {
      setError('Please add at least one question')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Process all valid questions sequentially
      const totalQuestions = validQuestions.length
      setSurveyProgress({ current: 0, total: totalQuestions })
      setSurveyResult(null)

      const results: any[] = []

      // Process each question sequentially
      for (let i = 0; i < validQuestions.length; i++) {
        const question = validQuestions[i]

        try {
          setSurveyProgress({ current: i, total: totalQuestions })

          let result = await conductSurvey(
            question.question,
            question.options.filter((opt) => opt.trim()),
            question.agentMode || '1x',
            question.cohortQuery || '',
            question.selectedUserCount || null,
            question.isPolymarket || false,
            question.polymarketData
          )

          // Since we wait for full response, the survey should always be completed
          // But check just in case there's an edge case
          const resultAny = result as any
          // Check status from surveyId field (which contains the survey metadata)
          // The response structure is: { surveyId, creditsUsed, participantCount, ...surveyData }
          const surveyStatus = resultAny.status || (resultAny.surveyId && 'completed')

          // Only poll if status is explicitly processing/pending (shouldn't happen with new flow)
          if (surveyStatus === 'processing' || surveyStatus === 'pending') {
            // Get surveyId from the result (it's included in the response)
            const surveyId = resultAny.surveyId || resultAny.id

            if (surveyId) {
              logger.debug(`Survey ${surveyId} is processing, starting polling...`)

              // Poll until completed (with max retries to prevent infinite loops)
              let pollAttempts = 0
              const maxPollAttempts = POLLING_CONFIG.MAX_ATTEMPTS

              while (pollAttempts < maxPollAttempts) {
                pollAttempts++
                // Wait 3 seconds
                await new Promise(resolve => setTimeout(resolve, 3000))

                try {
                  const details: any = await getSurveyDetails(surveyId)
                  logger.debug(`Polling survey ${surveyId} (attempt ${pollAttempts}): ${details.status}`)

                  if (details.status === 'completed') {
                    // Update result with completed data
                    result = details.mcpResponse || details.result || details
                    if (details.creditsUsed) (result as any).creditsUsed = details.creditsUsed
                    if (details.participantCount) (result as any).participantCount = details.participantCount
                    break
                  } else if (details.status === 'failed') {
                    throw new Error('Survey generation failed')
                  }
                  // Continue polling if processing/pending
                } catch (pollErr: any) {
                  // If it's a 404, the survey might not exist yet - continue polling
                  if (pollErr.message?.includes('not found') || pollErr.message?.includes('404')) {
                    logger.warn(`Polling error (attempt ${pollAttempts}): Survey not found yet, continuing...`)
                    continue
                  }
                  logger.warn('Polling error:', pollErr)
                  // Don't break on transient polling errors
                }
              }

              if (pollAttempts >= maxPollAttempts) {
                logger.error(`Polling timeout: Survey ${surveyId} did not complete after ${maxPollAttempts} attempts`)
                throw new Error('Survey polling timeout - survey did not complete in time')
              }
            }
          }

          results.push(result)

          // Update progress after each question
          setSurveyProgress({ current: i + 1, total: totalQuestions })

          // Small delay between questions to avoid overwhelming the server
          if (i < validQuestions.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (err) {
          logger.error(`Failed to process question ${i + 1}:`, err)
          // Continue with next question even if one fails
          setError(`Question ${i + 1} failed: ${err instanceof Error ? err.message : 'Unknown error'}. Continuing with remaining questions...`)
        }
      }

      // Only navigate if we actually got results
      if (results.length > 0) {
        setSurveyResult(results[results.length - 1])
        setSurveyProgress({ current: totalQuestions, total: totalQuestions })

        // Navigate to results dashboard after all questions complete
        navigate('/results')

        // Refresh credits after navigation (non-blocking)
        refreshCredits().catch(err => logger.warn('Failed to refresh credits:', err))
      } else {
        throw new Error('Survey failed to generate any results. Please check your inputs and try again.')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Survey failed')
    } finally {
      setLoading(false)
      setSurveyProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />
      <div className="fixed inset-0 aurora-bg opacity-40 -z-40" />
      <div className="noise-overlay" />

      <Navigation />

      {/* Main Content */}
      <main className={`flex-1 px-4 ${isAuthenticated ? 'md:ml-64 pt-8' : 'pt-32 pb-20'}`}>
        <div className="max-w-4xl mx-auto relative z-10 transition-all duration-300">

          {/* Header */}
          <div className="text-center mb-12 animate-enter stagger-1">
            <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF3B00] uppercase">
                AI Twin Intelligence
              </span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight tracking-tight">
              Create Your <span className="text-gradient-accent">Survey</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
              Design comprehensive research queries and gather insights from <span className="text-white font-medium">multi-agent simulations</span>.
            </p>
          </div>


          {/* Survey Card */}
          <div className="animate-enter stagger-2">
            <div className="glass-panel-premium rounded-3xl p-1 md:p-2 relative overflow-hidden group">
              {/* Subtle border glow animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <TechCard variant="ghost" className="bg-transparent border-0 shadow-none" compact={true}>
                <TechCardHeader compact={true} className="border-b border-white/5 pb-6 mb-6">
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <TechCardTitle compact={true} className="text-xl">Survey Configuration</TechCardTitle>
                      <TechCardDescription compact={true} className="text-gray-500 mt-1">
                        Define questions and target demographics
                      </TechCardDescription>
                    </div>
                    {/* Clear Button - Top Right */}
                    <button
                      onClick={() => {
                        updateQuestion(activeQuestionIndex, 'question', '')
                        updateQuestion(activeQuestionIndex, 'options', ['', '', ''])
                        updateQuestion(activeQuestionIndex, 'cohortQuery', '')
                        updateQuestion(activeQuestionIndex, 'cohortCount', null)
                        updateQuestion(activeQuestionIndex, 'selectedUserCount', null)
                      }}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all duration-300 flex items-center gap-2 text-xs font-mono font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Form</span>
                    </button>
                  </div>
                </TechCardHeader>
                <TechCardContent>
                  <div className="space-y-8">
                    <QuestionEditor
                      questions={questions}
                      activeQuestionIndex={activeQuestionIndex}
                      onQuestionChange={handleUpdateQuestion}
                      onOptionChange={handleOptionChange}
                      onAddQuestion={handleAddQuestion}
                      onRemoveQuestion={removeQuestion}
                      onSetActiveQuestion={setActiveQuestionIndex}
                      onSampleQuestionSelect={handleSampleQuestionSelect}
                      onAddOption={addOption}
                      onRemoveOption={removeOption}
                      sampleQuestions={SAMPLE_QUESTIONS}
                      maxQuestions={MAX_QUESTIONS}
                      disabled={loading}
                    />

                    {/* Launch Button */}
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleMultiSurvey}
                        disabled={
                          loading ||
                          questions.every((q) => !q.question.trim()) ||
                          questions.some((q) => {
                            const hasCohortQuery = q.cohortQuery?.trim()
                            if (hasCohortQuery) {
                              return q.cohortCount === null || q.cohortCount === undefined
                            }
                            return false
                          }) ||
                          questions.some((q) => q.isCheckingCohort === true)
                        }
                        className="group relative px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-500 inline-flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden bg-[#FF3B00] text-black hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,59,0,0.3)] hover:shadow-[0_0_60px_rgba(255,59,0,0.5)]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" color="white" />
                            <span className="text-white">Processing Simulation...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 flex-shrink-0 fill-current" />
                            <span>Launch Simulation</span>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {loading && surveyProgress.total > 0 && (
                      <div className="mt-8 p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md animate-enter">
                        <ProgressBar
                          current={surveyProgress.current}
                          total={surveyProgress.total}
                          showLabel={true}
                        />
                        <div className="flex items-center justify-between mt-3 text-xs font-mono text-gray-500">
                          <span>Processing Node: {Math.min(surveyProgress.current + 1, surveyProgress.total)} / {surveyProgress.total}</span>
                          <span className="animate-pulse text-[#FF3B00]">ACTIVE</span>
                        </div>
                      </div>
                    )}

                    {/* Error Display */}
                    {error && <InlineError error={error} className="mt-6" />}
                  </div>
                </TechCardContent>
              </TechCard>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-16 animate-enter stagger-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Be Specific', desc: 'Clear, focused questions yield better insights from AI Twins.', icon: Target },
                { title: 'Target Cohorts', desc: 'Filter by demographics for relevant responses.', icon: Users },
                { title: '5x Mode', desc: 'Use 5x for important decisions needing diverse perspectives.', icon: Zap }
              ].map((tip, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-[#0a0a0a]/40 border border-white/5 hover:border-[#FF3B00]/30 hover:bg-[#0a0a0a]/60 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  {/* Hover Gradient Blob */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FF3B00]/5 rounded-full blur-3xl group-hover:bg-[#FF3B00]/10 transition-colors duration-500" />

                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-[#FF3B00]/20 group-hover:bg-[#FF3B00]/10 transition-colors duration-300">
                      <tip.icon className="w-5 h-5 text-gray-400 group-hover:text-[#FF3B00] transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-white text-lg mb-3 tracking-tight group-hover:text-glow-strong transition-all">{tip.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-light group-hover:text-gray-400 transition-colors">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={isAuthenticated ? 'md:ml-64' : ''} style={{ marginTop: '2rem' }}>
        <Footer />
      </div>
    </div>
  )
}
