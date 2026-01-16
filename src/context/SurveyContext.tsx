import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { SurveyQuestion, MultiSurveyResult, AgentSummary, AgentMode } from '../types'

interface SurveyContextType {
  // Questions state
  questions: SurveyQuestion[]
  setQuestions: React.Dispatch<React.SetStateAction<SurveyQuestion[]>>
  activeQuestionIndex: number
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  
  // Results state
  multiSurveyResult: MultiSurveyResult | null
  setMultiSurveyResult: React.Dispatch<React.SetStateAction<MultiSurveyResult | null>>
  activeResultIndex: number
  setActiveResultIndex: React.Dispatch<React.SetStateAction<number>>
  
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
  updateQuestion: (index: number, field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort', value: string | string[] | AgentMode | number | null | boolean) => void
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
  isCheckingCohort: false
}

export function SurveyProvider({ children }: { children: ReactNode }) {
  // Questions state
  const [questions, setQuestions] = useState<SurveyQuestion[]>([{ ...initialQuestion }])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  
  // Results state
  const [multiSurveyResult, setMultiSurveyResult] = useState<MultiSurveyResult | null>(null)
  const [activeResultIndex, setActiveResultIndex] = useState(0)
  
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
      isCheckingCohort: false
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
    field: 'question' | 'options' | 'agentMode' | 'cohortQuery' | 'cohortCount' | 'isCheckingCohort', 
    value: string | string[] | AgentMode | number | null | boolean
  ) {
    const newQuestions = [...questions]
    if (field === 'question') {
      newQuestions[index].question = value as string
    } else if (field === 'options') {
      newQuestions[index].options = value as string[]
    } else if (field === 'agentMode') {
      newQuestions[index].agentMode = value as AgentMode
    } else if (field === 'cohortQuery') {
      newQuestions[index].cohortQuery = value as string
      // Reset cohortCount when query changes
      newQuestions[index].cohortCount = null
    } else if (field === 'cohortCount') {
      newQuestions[index].cohortCount = value as number | null
    } else if (field === 'isCheckingCohort') {
      newQuestions[index].isCheckingCohort = value as boolean
    }
    setQuestions(newQuestions)
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
    setMultiSurveyResult(null)
    setActiveResultIndex(0)
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
        multiSurveyResult,
        setMultiSurveyResult,
        activeResultIndex,
        setActiveResultIndex,
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
