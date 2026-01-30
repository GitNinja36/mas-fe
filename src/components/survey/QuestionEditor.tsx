import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2, Sparkles, X, RotateCw } from 'lucide-react'
import type { SurveyQuestion, AgentMode } from '../../types'
import { AgentModeSelector } from './AgentModeSelector'
import { queryCohort } from '../../lib/api'
import { fetchNextPolymarketQuestion } from '../../api'

interface QuestionEditorProps {
  questions: SurveyQuestion[]
  activeQuestionIndex: number
  onQuestionChange: (index: number, field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort' | 'selectedUserCount' | 'isPolymarket' | 'marketId' | 'polymarketData', value: string | string[] | AgentMode | number | null | boolean | import('../../types').PolymarketData | undefined) => void
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void
  onAddQuestion: () => void
  onRemoveQuestion: (index: number) => void
  onSetActiveQuestion: (index: number) => void
  onSampleQuestionSelect: (sampleIndex: number) => void
  onAddOption: (questionIndex: number) => void
  onRemoveOption: (questionIndex: number, optionIndex: number) => void
  sampleQuestions: Array<{ question: string; options: string[] }>
  maxQuestions?: number
  disabled?: boolean
}

export function QuestionEditor({
  questions,
  activeQuestionIndex,
  onQuestionChange,
  onOptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onSetActiveQuestion,
  onSampleQuestionSelect,
  onAddOption,
  onRemoveOption,
  sampleQuestions,
  maxQuestions = 10,
  disabled = false
}: QuestionEditorProps) {
  const currentQuestion = questions[activeQuestionIndex]
  const optionsCount = currentQuestion?.options?.length || 0
  const canAddOption = optionsCount >= 2 && optionsCount < 6
  const canRemoveOption = optionsCount > 2

  const cohortCount = currentQuestion?.cohortCount ?? null
  const isLoadingCohort = currentQuestion?.isCheckingCohort ?? false
  const selectedUserCount = currentQuestion?.selectedUserCount ?? cohortCount ?? 0
  const [cohortError, setCohortError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoadingPolymarket, setIsLoadingPolymarket] = useState(false) // New state
  const sliderRef = useRef<HTMLDivElement>(null)

  const fetchCohortCount = async (query: string) => {
    if (!query.trim() || disabled) return

    onQuestionChange(activeQuestionIndex, 'isCheckingCohort', true)
    setCohortError(null)

    try {
      const response = await queryCohort({ message: query.trim() })
      onQuestionChange(activeQuestionIndex, 'cohortCount', response.user_count)
    } catch (error) {
      setCohortError(error instanceof Error ? error.message : 'Failed to fetch cohort count')
      onQuestionChange(activeQuestionIndex, 'cohortCount', null)
    } finally {
      onQuestionChange(activeQuestionIndex, 'isCheckingCohort', false)
    }
  }

  const handleCohortQuery = async () => {
    const query = currentQuestion?.cohortQuery?.trim()
    if (!query || disabled) return
    await fetchCohortCount(query)
  }

  const handlePolymarketClick = async () => {
    if (disabled || isLoadingPolymarket) return
    setIsLoadingPolymarket(true)

    try {
      const data = await fetchNextPolymarketQuestion()

      // Parse probability (e.g. "75.0%") to yesPrice / noPrice
      const yesPercent = parseFloat(String(data.probability).replace('%', '')) || 50
      const yesPrice = Math.max(0, Math.min(1, yesPercent / 100))
      const noPrice = Math.max(0, Math.min(1, 1 - yesPrice))
      const volume = data.volume_24h ?? 'N/A'

      // Update all fields
      onQuestionChange(activeQuestionIndex, 'question', data.question)
      onQuestionChange(activeQuestionIndex, 'options', ['Yes', 'No'])
      onQuestionChange(activeQuestionIndex, 'agentMode', '5x')
      onQuestionChange(activeQuestionIndex, 'cohortQuery', data.cohort_query)
      onQuestionChange(activeQuestionIndex, 'isPolymarket', true)
      onQuestionChange(activeQuestionIndex, 'marketId', data.market_id)
      onQuestionChange(activeQuestionIndex, 'polymarketData', { yesPrice, noPrice, volume })

      // Trigger cohort check immediately
      // We use the query directly instead of waiting for state update
      await fetchCohortCount(data.cohort_query)

    } catch (error) {
      console.error('Polymarket fetch failed', error)
      // Could show toast here if we had access to toast function
    } finally {
      setIsLoadingPolymarket(false)
    }
  }

  // Initialize selectedUserCount when cohortCount is set
  useEffect(() => {
    if (cohortCount !== null && (currentQuestion?.selectedUserCount === undefined || currentQuestion?.selectedUserCount === null)) {
      onQuestionChange(activeQuestionIndex, 'selectedUserCount', cohortCount)
    }
  }, [cohortCount, activeQuestionIndex, currentQuestion?.selectedUserCount, onQuestionChange])

  const handleSliderChange = (value: number) => {
    if (disabled || isLoadingCohort || cohortCount === null) return
    const clampedValue = Math.max(0, Math.min(value, cohortCount))
    onQuestionChange(activeQuestionIndex, 'selectedUserCount', clampedValue)
  }

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isLoadingCohort || cohortCount === null) return
    setIsDragging(true)
    updateSliderValue(e)
  }

  const handleSliderMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled || isLoadingCohort || cohortCount === null) return
    updateSliderValue(e)
  }

  const handleSliderMouseUp = () => {
    setIsDragging(false)
  }

  const updateSliderValue = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || cohortCount === null) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const value = Math.round(percentage * cohortCount)
    handleSliderChange(value)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleSliderMouseMove)
      document.addEventListener('mouseup', handleSliderMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleSliderMouseMove)
        document.removeEventListener('mouseup', handleSliderMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div className="space-y-6">
      {/* Sample Questions & Polymarket Button */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          {sampleQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => onSampleQuestionSelect(index)}
              className="group flex items-center gap-1.5 text-xs bg-white/5 hover:bg-[#FF3B00]/10 text-gray-400 hover:text-[#FF3B00] px-3 py-1.5 rounded-lg transition-all duration-300 border border-white/10 hover:border-[#FF3B00]/30 font-mono"
            >
              <Sparkles className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              Sample {index + 1}
            </button>
          ))}

          {/* Polymarket Button */}
          <button
            onClick={handlePolymarketClick}
            disabled={isLoadingPolymarket}
            className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF3B00]/20 to-[#FF6B00]/20 border border-[#FF3B00]/30 hover:border-[#FF3B00] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF3B00]/20 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <svg
                className={`w-3.5 h-3.5 text-[#FF3B00] transition-transform duration-300 ${isLoadingPolymarket ? 'animate-spin' : 'group-hover:rotate-12'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isLoadingPolymarket ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                )}
              </svg>
              <span className="text-xs font-mono font-bold text-[#FF3B00] group-hover:text-white transition-colors duration-300">
                {isLoadingPolymarket ? 'Loading...' : 'Polymarket'}
              </span>
            </div>
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF3B00]/0 via-[#FF3B00]/20 to-[#FF3B00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-display font-bold text-white">
            {questions.length} Question{questions.length > 1 ? 's' : ''}
          </span>
          <span className="text-[10px] font-mono text-[#FF3B00] bg-[#FF3B00]/10 border border-[#FF3B00]/30 px-2 py-1 rounded">
            Sequential Processing
          </span>
        </div>
        <button
          onClick={onAddQuestion}
          disabled={disabled || questions.length >= maxQuestions}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#FF3B00]/30 text-[#FF3B00] hover:bg-[#FF3B00]/10 transition-all duration-300 text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Question Tabs */}
      {questions.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {questions.map((question, index) => (
            <button
              key={`question-tab-${index}-${question.id}`}
              onClick={() => onSetActiveQuestion(index)}
              className={`group px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeQuestionIndex === index
                ? 'bg-[#FF3B00] text-black font-bold'
                : disabled
                  ? 'bg-white/5 text-gray-500 border border-white/10 opacity-50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-[#FF3B00]/30 hover:text-white'
                }`}
            >
              <span>Q{index + 1}</span>
              {questions.length > 1 && !disabled && activeQuestionIndex !== index && (
                <Trash2
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveQuestion(index)
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Question Input Section */}
      <div className="space-y-6">

        {/* Question Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">
              Your Question
            </label>
            <span className="text-[10px] font-mono text-gray-600">
              {currentQuestion?.question?.length || 0} characters
            </span>
          </div>
          <textarea
            value={currentQuestion?.question || ''}
            onChange={(e) => !disabled && onQuestionChange(activeQuestionIndex, 'question', e.target.value)}
            disabled={disabled}
            className={`w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl h-28 text-white placeholder-gray-600 focus:border-[#FF3B00]/50 focus:ring-1 focus:ring-[#FF3B00]/20 transition-all duration-300 text-sm font-mono resize-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            placeholder="Enter your survey question here..."
          />

        </div>

        {/* Options Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">
              Available Options
            </label>
            <button
              onClick={() => onAddOption(activeQuestionIndex)}
              disabled={disabled || !canAddOption}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF3B00]/30 text-[#FF3B00] hover:bg-[#FF3B00]/10 transition-all duration-300 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
              Add Option
            </button>
          </div>
          <div className="space-y-2">
            {currentQuestion?.options.map((option, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-[#FF3B00]/30 transition-all duration-300"
              >
                <div className="w-8 h-8 text-xs font-bold text-[#FF3B00] bg-[#FF3B00]/10 rounded-lg flex items-center justify-center border border-[#FF3B00]/30">
                  {String.fromCharCode(65 + index)}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => !disabled && onOptionChange(activeQuestionIndex, index, e.target.value)}
                  disabled={disabled}
                  className={`flex-1 p-2 bg-transparent border-none text-sm text-white placeholder-gray-600 focus:outline-none font-mono ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
                {canRemoveOption && !disabled && (
                  <button
                    onClick={() => onRemoveOption(activeQuestionIndex, index)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title="Remove option"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Query Section */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                Select Survey Sample to target
              </label>
            </div>
            <button
              onClick={handleCohortQuery}
              disabled={disabled || !currentQuestion?.cohortQuery?.trim() || isLoadingCohort}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF3B00]/30 text-[#FF3B00] hover:bg-[#FF3B00]/10 transition-all duration-300 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
              title="Check cohort size"
            >
              <RotateCw className={`w-3 h-3 ${isLoadingCohort ? 'animate-spin' : ''}`} />
              <span>Check</span>
            </button>
          </div>
          <input
            type="text"
            value={currentQuestion?.cohortQuery || ''}
            onChange={(e) => {
              if (!disabled && !isLoadingCohort) {
                onQuestionChange(activeQuestionIndex, 'cohortQuery', e.target.value)
                onQuestionChange(activeQuestionIndex, 'cohortCount', null)
                setCohortError(null)
              }
            }}
            disabled={disabled || isLoadingCohort}
            className={`w-full p-4 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-600 focus:ring-1 transition-all duration-300 text-sm font-mono ${disabled || isLoadingCohort
              ? 'opacity-50 cursor-not-allowed border-white/10'
              : cohortError
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                : 'border-white/10 focus:border-[#FF3B00]/50 focus:ring-[#FF3B00]/20'
              }`}
            placeholder="e.g., 'Gamers from Mumbai', 'Tech professionals aged 25-35'"
          />
          {cohortError && (
            <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {cohortError}
            </div>
          )}
          {(currentQuestion?.cohortQuery || isLoadingCohort) && !cohortError && (
            <div className="flex items-center justify-between gap-4 text-xs text-[#FF3B00] font-mono">
              <div className="flex items-center gap-3 flex-1">
                {isLoadingCohort ? (
                  <span className="flex items-center gap-1">
                    Loading
                    <span className="inline-flex gap-0.2">
                      <span className="animate-[bounce_1s_ease-in-out_infinite]">.</span>
                      <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
                      <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
                    </span>
                  </span>
                ) : cohortCount !== null ? (
                  <>
                    <span className="whitespace-nowrap">Targeting : {cohortCount} users</span>
                    {cohortCount > 0 && !disabled && (
                      <div className="flex items-center gap-3 flex-1 max-w-xs ml-auto">
                        {/* Slider as visual indicator and alternative input method */}
                        <div
                          ref={sliderRef}
                          onMouseDown={disabled || isLoadingCohort ? undefined : handleSliderMouseDown}
                          className={`relative w-full h-2.5 bg-white/5 rounded-full border border-white/10 ${disabled || isLoadingCohort
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer group'
                            }`}
                        >
                          {/* Track fill with gradient */}
                          <div
                            className="absolute h-full bg-gradient-to-r from-[#FF3B00] to-[#FF6B3D] rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,59,0,0.3)]"
                            style={{ width: `${cohortCount > 0 ? (selectedUserCount / cohortCount) * 100 : 0}%` }}
                          />
                          {/* Slider thumb */}
                          <div
                            className={`absolute w-4 h-4 bg-[#FF3B00] rounded-full -translate-y-1/2 top-1/2 shadow-lg shadow-[#FF3B00]/50 transition-all duration-300 ease-out border-2 border-white/20 ${disabled || isLoadingCohort
                              ? ''
                              : isDragging
                                ? 'scale-80 ring-4 ring-[#FF3B00]/30 cursor-grabbing'
                                : 'cursor-grab group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#FF3B00]/40'
                              }`}
                            style={{ left: `calc(${cohortCount > 0 ? (selectedUserCount / cohortCount) * 100 : 0}% - 8px)` }}
                          />
                          {/* Tooltip - shows on hover or drag */}
                          {!disabled && !isLoadingCohort && (
                            <div
                              className={`absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-[#FF3B00]/30 rounded-md px-2.5 py-1 text-white text-[11px] font-mono font-semibold whitespace-nowrap pointer-events-none transition-all duration-200 ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                                }`}
                              style={{ left: `${cohortCount > 0 ? (selectedUserCount / cohortCount) * 100 : 0}%` }}
                            >
                              {selectedUserCount}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1.5 w-2 h-2 bg-gray-900/95 border-r border-b border-[#FF3B00]/30 rotate-45" />
                            </div>
                          )}
                        </div>
                        {/* Text Input for User Count */}
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={cohortCount}
                            value={selectedUserCount || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10)
                              if (!isNaN(value) && value >= 1 && value <= cohortCount) {
                                handleSliderChange(value)
                              } else if (e.target.value === '') {
                                onQuestionChange(activeQuestionIndex, 'selectedUserCount', null)
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value, 10)
                              if (isNaN(value) || value < 1) {
                                onQuestionChange(activeQuestionIndex, 'selectedUserCount', 1)
                              } else if (value > cohortCount) {
                                onQuestionChange(activeQuestionIndex, 'selectedUserCount', cohortCount)
                              }
                            }}
                            disabled={disabled || isLoadingCohort}
                            className={`w-20 px-2 py-1.5 bg-[#0a0a0a] border rounded text-white text-xs font-mono text-center focus:ring-1 transition-all ${disabled || isLoadingCohort
                              ? 'opacity-50 cursor-not-allowed border-white/10'
                              : 'border-white/20 focus:border-[#FF3B00]/50 focus:ring-[#FF3B00]/20'
                              }`}
                            placeholder="0"
                          />
                          <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                            users
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Show selected count when disabled (survey is running) */}
                    {disabled && cohortCount > 0 && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium opacity-50">
                          {selectedUserCount || 0} users selected
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Agent Mode Section */}
        <div className="pt-4 border-t border-white/5">
          <AgentModeSelector
            agentMode={currentQuestion?.agentMode || '1x'}
            onModeChange={(mode) => onQuestionChange(activeQuestionIndex, 'agentMode', mode)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
