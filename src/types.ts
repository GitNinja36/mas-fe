// Type definitions for the application
export interface AgentSummary {
  user_id: string
  professional_role: string
  personality_traits: string[]
  core_values: string[]
  decision_style: string
  risk_tolerance: string
  tech_adoption: string
  active_platforms: string[]
  response_count: number
}

export interface SurveyQuestion {
  id: string
  question: string
  options: string[]
  agentMode?: AgentMode
  cohortQuery?: string
  cohortCount?: number | null
  isCheckingCohort?: boolean
}

export interface QuestionResult {
  question: string
  options: string[]
  agent_responses: { [userId: string]: any }
  analytics: {
    total_responses: number
    choice_distribution: { [choice: string]: number }
    confidence_scores: { [userId: string]: number }
    consistency_score: number
    average_confidence: number
    decision_factors: string[]
    primary_context: string
  }
}

export interface MultiSurveyResult {
  questions: QuestionResult[]
  overall_analytics: {
    total_questions: number
    total_responses: number
    agent_consistency: { [userId: string]: number }
    cross_question_patterns: string[]
    dominant_decision_factors: string[]
  }
}

export type AgentMode = '1x' | '3x' | '5x'
