import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { SurveyQuestion, EnhancedManagerSurveyResponse, AgentSummary, AgentMode, PolymarketData } from '../types'

interface SurveyContextType {
  // Questions state
  questions: SurveyQuestion[]
  setQuestions: React.Dispatch<React.SetStateAction<SurveyQuestion[]>>
  activeQuestionIndex: number
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>

  // Results state
  surveyResult: EnhancedManagerSurveyResponse | null
  setSurveyResult: React.Dispatch<React.SetStateAction<EnhancedManagerSurveyResponse | null>>

  // Agents state
  agents: AgentSummary[]
  setAgents: React.Dispatch<React.SetStateAction<AgentSummary[]>>

  // Loading and error states
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  surveyProgress: { current: number; total: number }
  setSurveyProgress: React.Dispatch<React.SetStateAction<{ current: number; total: number }>>

  // Helper functions
  addQuestion: () => void
  removeQuestion: (index: number) => void
  updateQuestion: (index: number, field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort' | 'selectedUserCount' | 'isPolymarket' | 'marketId' | 'polymarketData', value: string | string[] | AgentMode | number | null | boolean | PolymarketData | undefined) => void
  handleOptionChange: (questionIndex: number, optionIndex: number, value: string) => void
  addOption: (questionIndex: number) => void
  removeOption: (questionIndex: number, optionIndex: number) => void
  resetSurvey: () => void
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

const MAX_QUESTIONS = 10

const initialQuestion: SurveyQuestion = {
  id: '1',
  question: '',
  options: ['', '', ''],
  agentMode: '1x',
  cohortQuery: '',
  cohortCount: null,
  isCheckingCohort: false,
  selectedUserCount: null,
  isPolymarket: false,
  marketId: undefined,
  polymarketData: undefined
}

export function SurveyProvider({ children }: { children: ReactNode }) {
  // Questions state
  const [questions, setQuestions] = useState<SurveyQuestion[]>([{ ...initialQuestion }])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  // Results state
  const [surveyResult, setSurveyResult] = useState<EnhancedManagerSurveyResponse | null>(null)

  // Agents state
  const [agents, setAgents] = useState<AgentSummary[]>([])

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [surveyProgress, setSurveyProgress] = useState({ current: 0, total: 0 })

  function addQuestion() {
    if (questions.length >= MAX_QUESTIONS) return
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', ''],
      agentMode: '1x',
      cohortQuery: '',
      cohortCount: null,
      isCheckingCohort: false,
      selectedUserCount: null,
      isPolymarket: false,
      polymarketData: undefined
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestionIndex(questions.length)
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
    setActiveQuestionIndex(Math.max(0, Math.min(activeQuestionIndex, newQuestions.length - 1)))
  }

  function updateQuestion(
    index: number,
    field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort' | 'selectedUserCount' | 'isPolymarket' | 'marketId' | 'polymarketData',
    value: string | string[] | AgentMode | number | null | boolean | PolymarketData | undefined
  ) {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions]
      // Create a shallow copy of the question being updated to avoid mutation
      const updatedQuestion = { ...newQuestions[index] }

      if (field === 'question') {
        updatedQuestion.question = value as string
      } else if (field === 'options') {
        updatedQuestion.options = value as string[]
      } else if (field === 'agentMode') {
        updatedQuestion.agentMode = value as AgentMode
      } else if (field === 'cohortQuery') {
        updatedQuestion.cohortQuery = value as string
        // Reset cohortCount and selectedUserCount when query changes
        updatedQuestion.cohortCount = null
        updatedQuestion.selectedUserCount = null
      } else if (field === 'cohortCount') {
        updatedQuestion.cohortCount = value as number | null
        // Initialize selectedUserCount to cohortCount when it's first set
        if (value !== null && updatedQuestion.selectedUserCount === null) {
          updatedQuestion.selectedUserCount = value as number
        }
      } else if (field === 'isCheckingCohort') {
        updatedQuestion.isCheckingCohort = value as boolean
      } else if (field === 'selectedUserCount') {
        updatedQuestion.selectedUserCount = value as number | null
      } else if (field === 'isPolymarket') {
        updatedQuestion.isPolymarket = value as boolean
      } else if (field === 'marketId') {
        updatedQuestion.marketId = value as string
      } else if (field === 'polymarketData') {
        updatedQuestion.polymarketData = value as PolymarketData | undefined
      }

      newQuestions[index] = updatedQuestion
      return newQuestions
    })
  }

  function handleOptionChange(questionIndex: number, optionIndex: number, value: string) {
    const newOptions = [...questions[questionIndex].options]
    newOptions[optionIndex] = value
    updateQuestion(questionIndex, 'options', newOptions)
  }

  function addOption(questionIndex: number) {
    const currentOptions = questions[questionIndex].options
    if (currentOptions.length >= 6) return
    const newOptions = [...currentOptions, '']
    updateQuestion(questionIndex, 'options', newOptions)
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const currentOptions = questions[questionIndex].options
    if (currentOptions.length <= 2) return
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex)
    updateQuestion(questionIndex, 'options', newOptions)
  }

  function resetSurvey() {
    setQuestions([{ ...initialQuestion, id: Date.now().toString() }])
    setActiveQuestionIndex(0)
    setSurveyResult(null)
    setError(null)
    setSurveyProgress({ current: 0, total: 0 })
  }

  return (
    <SurveyContext.Provider
      value={{
        questions,
        setQuestions,
        activeQuestionIndex,
        setActiveQuestionIndex,
        surveyResult,
        setSurveyResult,
        agents,
        setAgents,
        loading,
        setLoading,
        error,
        setError,
        surveyProgress,
        setSurveyProgress,
        addQuestion,
        removeQuestion,
        updateQuestion,
        handleOptionChange,
        addOption,
        removeOption,
        resetSurvey
      }}
    >
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurveyContext() {
  const context = useContext(SurveyContext)
  if (context === undefined) {
    throw new Error('useSurveyContext must be used within a SurveyProvider')
  }
  return context
}
