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
  selectedUserCount?: number | null
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

// ============================================================================
// Enhanced Survey Response Types
// ============================================================================

export interface ChoiceStats {
  option: string
  count: number
  percentage: number
  confidence_avg: number
  confidence_median: number
  primary_reasoning: string
}

export interface ChoiceDistribution {
  choices: Record<string, ChoiceStats>
  winning_choice: string
  winning_percentage: number
  runner_up: string | null
  runner_up_percentage: number | null
  clear_winner: boolean
}

export interface DetailedAgentResponse {
  agent_id: string
  platform: string
  choice: string
  selected_text: string
  confidence: number
  confidence_percent: number
  reasoning: string
  reasoning_summary: string
  decision_factors: string[]
  persona_traits_used: string[]
  context_analysis: {
    primary: string
    complexity: 'simple' | 'moderate' | 'complex'
  }
  reasoning_confidence_alignment: 'High' | 'Medium' | 'Low'
}

export interface AgentResponseGroup {
  platform: string
  total_agents: number
  responses: DetailedAgentResponse[]
  platform_consensus: number
  platform_insights: string
}

export interface OverallMetrics {
  consistency_score: number
  average_confidence: number
  response_agreement: number
  confidence_variance: number
}

export interface CompetitiveMetric {
  metric_name: string
  option: string
  performance: number // 0-100
  context: string
}

export interface CompetitiveAnalysis {
  winning_option: string
  competitive_strength: number
  alternative_signals: Record<string, string>
  competitive_metrics: CompetitiveMetric[]
  market_gaps: string[]
}

export interface SignalScore {
  name: string
  platform: string
  score: number // 0-100
  trend: string
  context: string
}

export interface SignalLensAnalysis {
  category: string
  signals: Record<string, SignalScore>
  top_platform: string
  convergence_strength: number
}

export interface ReasoningPattern {
  pattern: string
  frequency: number
  platforms: string[]
  confidence_avg: number
}

export interface DecisionFactor {
  factor: string
  impact_score: number
  platforms_influenced: string[]
  agent_mentions: number
}

export interface SynthesizedInsight {
  title: string
  description: string
  confidence: number
  evidence_count: number
  supporting_factors: string[]
  potential_bias: string | null
}

export interface RiskOrBlindSpot {
  risk_type: string
  description: string
  severity: string
  mitigation: string
}

export interface Methodology {
  total_agents: number
  cohort_description: string
  simulation_type: string
  coverage: string[]
  statistical_margin_of_error: string
  confidence_interval: string
  distribution_method: string
  agents_per_platform: Record<string, number>
  reasoning_method: string
}

export interface PerformanceMetrics {
  response_time_ms: number
  api_calls_made: number
  token_usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  cache_hit_rate: number
}

export interface ImplementationPhase {
  phase: 'PHASE 1: NOW' | 'PHASE 2: Q2' | 'PHASE 3: BACKLOG' | 'AVOID'
  timeline: string
  options: Array<{
    option: string
    preference_percentage: number
    dev_effort_days: number
    difficulty?: 'Low' | 'Medium' | 'High'
    roi_score?: number
    rationale: string
    blockers?: string[]
    dependencies?: string[]
  }>
  rationale: string
  blockers?: string[]
  dependencies?: string[]
  dev_effort_days: number
  preference_percentage: number
}

export interface ImplementationRoadmap {
  phases: ImplementationPhase[]
  estimated_total_timeline: string
  total_dev_effort_days: number
  skip_reasons?: string[]
}

export interface MessageEffectiveness {
  percentage: number
  top_drivers: string[]
  message: string
  ad_copy_ideas: string[]
}

export interface PlatformMessaging {
  platform: string
  effectiveness: Record<string, MessageEffectiveness>
  emotional_drivers: Record<string, number>
  recommended_message: string
  tone_variations: {
    formal: string
    casual: string
    urgent: string
  }
}

export interface ToneVariation {
  type: 'FORMAL' | 'CASUAL' | 'URGENT'
  best_for: string[]
  template: string
}

export interface CampaignTimelinePhase {
  time: string
  title: string
  action: string
  budget_allocation?: string
  duration?: string
  description?: string
}

export interface CampaignMessaging {
  platform_messaging: Record<string, PlatformMessaging>
  message_variations: ToneVariation[]
  campaign_timeline: {
    strategy_type?: string
    phases?: CampaignTimelinePhase[]
    // Legacy format support
    phase1?: CampaignTimelinePhase
    phase2?: CampaignTimelinePhase
    phase3?: CampaignTimelinePhase
  }
  expected_roi?: {
    estimated_reach?: number
    expected_conversion_rate?: number
    estimated_conversions?: number
  }
}

export interface DesiredOutcome {
  text: string
  percentage: number
}

export interface FrustrationPoint {
  text: string
  percentage: number
}

export interface JobToBeDone {
  id: string
  title: string
  description: string
  adoption: number
  example_reasoning?: string
  desired_outcomes: DesiredOutcome[]
  frustrations: FrustrationPoint[]
  design_implications: string[]
}

export interface JobsToBeDoneAnalysis {
  jobs: JobToBeDone[]
  situation?: string
  canvas_data?: {
    situation: string
    job: string
    outcome: string
  }
}

export interface ChiSquareTest {
  statistic: number
  p_value: number
  degrees_of_freedom: number
  result: 'significant' | 'not_significant'
}

export interface ConfidenceInterval {
  choice: string
  percentage: number
  lower_bound: number
  upper_bound: number
}

export interface PowerAnalysis {
  sample_size: number
  statistical_power: number
  effect_size: number
}

export interface StatisticalAnalysis {
  chi_square_test: ChiSquareTest
  confidence_intervals: ConfidenceInterval[]
  power_analysis: PowerAnalysis
  assumptions: {
    sample_size_adequate: boolean
    expected_frequencies_sufficient: boolean
    is_synthetic: boolean
    warnings: string[]
  }
}

export interface ActionItem {
  title: string
  completed: boolean
  due_date?: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
}

export interface ActionItemsData {
  items: ActionItem[]
  talk_track: {
    what_won: string
    why_it_won: string[]
    next_step: string
  }
}

export interface CompetitorComparison {
  attribute: string
  your_score: number
  competitor_a?: number
  competitor_b?: number
}

export interface WinLossAnalysis {
  winning_on: string[]
  at_risk: string[]
  losing_on: string[]
}

export interface CompetitiveTracking {
  comparison_matrix: CompetitorComparison[]
  win_loss_analysis: WinLossAnalysis
}

export interface EnhancedManagerSurveyResponse {
  question: string
  options: string[]
  agent_mode: string
  total_responses: number
  platforms_surveyed: string[]
  survey_id: string
  choice_distribution: ChoiceDistribution
  agent_responses_grouped: Record<string, AgentResponseGroup>
  agent_responses_list: DetailedAgentResponse[]
  overall_metrics: OverallMetrics
  executive_summary: string
  key_findings: string[]
  recommended_direction: string
  confidence_in_recommendation: number
  competitive_analysis: CompetitiveAnalysis
  market_positioning: Record<string, any>
  differentiation_factors: string[]
  demographic_analysis: Record<string, any> | null
  segment_heatmap: Record<string, any> | null
  signal_lenses: Record<string, SignalLensAnalysis>
  signal_convergence: number
  reasoning_patterns: ReasoningPattern[]
  decision_factors: DecisionFactor[]
  key_reasoning_themes: string[]
  synthesized_insights: SynthesizedInsight[]
  risks_and_blindspots: RiskOrBlindSpot[]
  methodology: Methodology
  performance_metrics: PerformanceMetrics
  implementation_roadmap?: ImplementationRoadmap
  campaign_messaging?: CampaignMessaging
  jobs_to_be_done?: JobsToBeDoneAnalysis
  statistical_analysis?: StatisticalAnalysis
  action_items?: ActionItemsData
  competitive_tracking?: CompetitiveTracking
}
