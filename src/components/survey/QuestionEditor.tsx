import { useState } from 'react'
import { Plus, Trash2, Sparkles, X, RotateCw } from 'lucide-react'
import type { SurveyQuestion, AgentMode } from '../../types'
import { AgentModeSelector } from './AgentModeSelector'
import { queryCohort } from '../../lib/api'

interface QuestionEditorProps {
  questions: SurveyQuestion[]
  activeQuestionIndex: number
  onQuestionChange: (index: number, field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort', value: string | string[] | AgentMode | number | null | boolean) => void
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
  const [cohortError, setCohortError] = useState<string | null>(null)

  const handleCohortQuery = async () => {
    const query = currentQuestion?.cohortQuery?.trim()
    if (!query || disabled) return

    onQuestionChange(activeQuestionIndex, 'isCheckingCohort', true)
    setCohortError(null)
    
    try {
      const response = await queryCohort({ message: query })
      onQuestionChange(activeQuestionIndex, 'cohortCount', response.user_count)
    } catch (error) {
      setCohortError(error instanceof Error ? error.message : 'Failed to fetch cohort count')
      onQuestionChange(activeQuestionIndex, 'cohortCount', null)
    } finally {
      onQuestionChange(activeQuestionIndex, 'isCheckingCohort', false)
    }
  }

  return (
    <div className="space-y-6">
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
              className={`group px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeQuestionIndex === index
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

        {/* Cohort Query Section */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                Improved your Survey 
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
              if (!disabled) {
                onQuestionChange(activeQuestionIndex, 'cohortQuery', e.target.value)
                onQuestionChange(activeQuestionIndex, 'cohortCount', null)
                setCohortError(null)
              }
            }}
            disabled={disabled || isLoadingCohort}
            className={`w-full p-4 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-600 focus:ring-1 transition-all duration-300 text-sm font-mono ${
              disabled || isLoadingCohort
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
            <div className="flex items-center justify-between gap-2 text-xs text-[#FF3B00] font-mono">
              <div className="flex items-center gap-2">
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
                  <span>Targeting : {cohortCount} users</span>
                ) : null}
              </div>
            </div>
          )}
        </div>

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
            className={`w-full p-4 bg-[#0a0a0a] border border-white/10 rounded-xl h-28 text-white placeholder-gray-600 focus:border-[#FF3B00]/50 focus:ring-1 focus:ring-[#FF3B00]/20 transition-all duration-300 text-sm font-mono resize-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            placeholder="Enter your survey question here..."
          />

          {/* Sample Questions */}
          {!disabled && (
            <div className="flex flex-wrap gap-2">
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
            </div>
          )}
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
                  className={`flex-1 p-2 bg-transparent border-none text-sm text-white placeholder-gray-600 focus:outline-none font-mono ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
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
