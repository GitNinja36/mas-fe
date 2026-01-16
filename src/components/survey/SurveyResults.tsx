import type { MultiSurveyResult } from '../../types'
import { TechCard, TechCardHeader, TechCardTitle, TechCardDescription, TechCardContent } from '../ui/TechCard'
import { TechChip } from '../ui/TechChip'

interface SurveyResultsProps {
  result: MultiSurveyResult
  activeResultIndex: number
  onResultIndexChange: (index: number) => void
}

export function SurveyResults({ result, activeResultIndex, onResultIndexChange }: SurveyResultsProps) {
  const currentQuestion = result.questions[activeResultIndex]

  return (
    <TechCard variant="floating" className="animate-fade-in-up h-fit" compact={true}>
      <TechCardHeader compact={true}>
        <TechCardTitle compact={true}>Multi-Survey Results</TechCardTitle>
        <TechCardDescription compact={true}>
          Sequential responses and comprehensive analysis
        </TechCardDescription>
      </TechCardHeader>
      <TechCardContent>
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/10 p-5 md:p-6 rounded-xl border border-orange-500/25 shadow-lg">
            <div className="text-base font-semibold text-orange-400 mb-4">Survey Complete!</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  {result.overall_analytics.total_questions}
                </div>
                <div className="text-xs text-gray-400 mt-1">Questions Asked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {result.overall_analytics.total_responses}
                </div>
                <div className="text-xs text-gray-400 mt-1">Total Responses</div>
              </div>
            </div>
          </div>

          {result.questions.length > 1 && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {result.questions.map((question, index) => (
                <button
                  key={`result-tab-${index}-${question.question}`}
                  onClick={() => onResultIndexChange(index)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center space-x-1 ${
                    activeResultIndex === index
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-800/40 text-gray-300 border border-orange-500/25 hover:bg-orange-500/15 hover:border-orange-500/35'
                  }`}
                >
                  <span>Q{index + 1}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-4">
              <div className="text-base md:text-lg font-semibold text-white mb-3">
                Question {activeResultIndex + 1} Results:
              </div>

              <div className="bg-gray-800/30 rounded-xl p-4 md:p-5 border border-orange-500/20 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500/15 rounded-md flex items-center justify-center border border-orange-500/20">
                    <span className="text-orange-400 font-semibold text-sm">
                      Q{activeResultIndex + 1}
                    </span>
                  </div>
                  <div className="text-white font-medium">"{currentQuestion.question}"</div>
                </div>

                {currentQuestion.analytics?.choice_distribution && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, optIndex) => {
                      const choiceLetter = String.fromCharCode(65 + optIndex)
                      const countData: any =
                        currentQuestion.analytics.choice_distribution[choiceLetter]
                      const count =
                        typeof countData === 'object' && countData !== null && 'count' in countData
                          ? (countData as { count: number }).count
                          : typeof countData === 'number'
                            ? countData
                            : 0
                      const percentage = currentQuestion.analytics?.total_responses
                        ? Math.round(
                            (count / currentQuestion.analytics.total_responses) * 100
                          )
                        : 0

                      return (
                        <div
                          key={`option-${activeResultIndex}-${optIndex}-${option}`}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-300">{option}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-700 rounded-full h-2 flex items-center">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <TechChip variant="tech" size="sm">
                              {count} ({percentage}%)
                            </TechChip>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </TechCardContent>
    </TechCard>
  )
}
