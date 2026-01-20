import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ArrowRight, Trash2 } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useSurveyContext } from '../context/SurveyContext'
import { fetchAgents, conductSurvey } from '../api'
import { SAMPLE_QUESTIONS, MAX_QUESTIONS } from '../constants'
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
      console.error('Failed to load agents:', err)
    }
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

  async function handleMultiSurvey() {
    // Use the active question for the survey
    const activeQuestion = questions[activeQuestionIndex]

    if (!activeQuestion.question.trim() || activeQuestion.options.filter((opt) => opt.trim()).length < 2) {
      setError('Please add a complete question with at least 2 options')
      return
    }

    if (!activeQuestion.cohortQuery?.trim()) {
      setError('Please provide a Cohort Query for the question')
      return
    }

    if (activeQuestion.cohortCount === null || activeQuestion.cohortCount === undefined) {
      setError('Please click "Check" button to verify user count before starting the survey')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSurveyProgress({ current: 0, total: 1 })
      setSurveyResult(null)

      const result = await conductSurvey(
        activeQuestion.question,
        activeQuestion.options.filter((opt) => opt.trim()),
        activeQuestion.agentMode || '1x',
        activeQuestion.cohortQuery || '',
        activeQuestion.selectedUserCount || null
      )

      setSurveyProgress({ current: 1, total: 1 })
      setSurveyResult(result)
      navigate('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Survey failed')
    } finally {
      setLoading(false)
      setSurveyProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />
      <div className="noise-overlay" />

      <Navigation />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Create Your Survey
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Add up to {MAX_QUESTIONS} questions and get sequential responses from AI agents.
            </p>
          </div>


          {/* Survey Card */}
          <TechCard variant="floating" className="h-fit" compact={true}>
            <TechCardHeader compact={true}>
              <div className="flex items-start justify-between w-full">
                <div>
                  <TechCardTitle compact={true}>Survey Questions</TechCardTitle>
                  <TechCardDescription compact={true}>
                    Add multiple questions for comprehensive agent analysis
                  </TechCardDescription>
                </div>
                {/* Clear Button - Top Right */}
                <button
                  onClick={() => {
                    updateQuestion(activeQuestionIndex, 'question', '')
                    updateQuestion(activeQuestionIndex, 'options', ['', '', ''])
                  }}
                  disabled={loading}
                  className="px-3 py-1.5 rounded border border-white/20 text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all duration-300 flex items-center gap-1.5 text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </TechCardHeader>
            <TechCardContent>
              <div className="space-y-4">
                <QuestionEditor
                  questions={questions}
                  activeQuestionIndex={activeQuestionIndex}
                  onQuestionChange={updateQuestion}
                  onOptionChange={handleOptionChange}
                  onAddQuestion={addQuestion}
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
                <div className="flex justify-center mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={handleMultiSurvey}
                    disabled={
                      loading || 
                      questions.every((q) => !q.question.trim()) ||
                      questions.some((q) => {
                        // If cohort query exists, cohort count must be set (user must have clicked check)
                        const hasCohortQuery = q.cohortQuery?.trim()
                        if (hasCohortQuery) {
                          return q.cohortCount === null || q.cohortCount === undefined
                        }
                        return false
                      }) ||
                      questions.some((q) => q.isCheckingCohort === true)
                    }
                    className="group relative bg-[#FF3B00] px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-500 text-black hover:bg-white hover:shadow-xl hover:shadow-[#FF3B00]/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3 whitespace-nowrap overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 flex-shrink-0" />
                        <span>Launch Survey</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                {loading && surveyProgress.total > 0 && (
                  <div className="mt-4">
                    <ProgressBar
                      current={surveyProgress.current}
                      total={surveyProgress.total}
                      showLabel={true}
                    />
                    <p className="text-center text-sm text-gray-400 mt-2 font-mono">
                      {surveyProgress.current === surveyProgress.total
                        ? '✓ Survey complete!'
                        : `Processing survey... ${Math.min(surveyProgress.current + 1, surveyProgress.total)}/${surveyProgress.total}`}
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {error && <InlineError error={error} className="mt-4" />}
              </div>
            </TechCardContent>
          </TechCard>

          {/* Tips Section */}
          <div className="mt-12">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Pro Tips</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group p-5 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#FF3B00] font-bold">01</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm">Be Specific</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Clear, focused questions yield better insights from AI agents.
                </p>
              </div>
              <div className="group p-5 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#FF3B00] font-bold">02</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm">Use Cohorts</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Target specific demographics for more relevant responses.
                </p>
              </div>
              <div className="group p-5 bg-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FF3B00]/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FF3B00]/10 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#FF3B00] font-bold">03</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm">5x Mode</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Use 5x for important decisions needing diverse perspectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
