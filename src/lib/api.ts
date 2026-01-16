export type AskRequest = {
  question: string
  options: string[]
  persona?: string
  // Back-compat: server still allows preferences, but UI now focuses on persona
  preferences?: Record<string, any>
  provider?: string
  mock?: boolean
}

export type AskResponse = {
  label: string
  selection: string
  reason?: string | null
}

export type MultiAgentRequest = {
  question: string
  options: string[]
  persona?: string
  context?: string // personal, social, market, mixed
  provider?: string
  mock?: boolean
}

export type AgentResponse = {
  agent_type: string
  choice: string
  selection: string
  reason: string
  confidence: number
}

export type MultiAgentResponse = {
  primary_choice: string
  primary_selection: string
  primary_reason: string
  agent_responses: AgentResponse[]
  context: string
  confidence_score: number
  reasoning_breakdown: Record<string, string>
}

// Manager-Agent System Types
export type ManagerSurveyRequest = {
  question: string
  options: string[]
  provider?: string
  mock?: boolean
  force_platforms?: string[]
  relevance_threshold?: string // low, medium, high
  agent_mode?: string // 1x, 3x, or 5x
}

export type PlatformRelevance = {
  platform: string
  score: number
  keywords_matched: string[]
  is_relevant: boolean
}

export type UserResponse = {
  platform: string
  user_id: string
  username: string
  choice: string
  selection: string
  reason: string
  confidence: number
}

export type PlatformResult = {
  platform: string
  user_responses: UserResponse[]
  platform_summary: Record<string, any>
  total_users: number
}

export type ModeMetadata = {
  selected_mode: string
  total_platforms_analyzed: number
  platforms_surveyed: number
  platforms_skipped: number
  skipped_platforms: string[]
  mode_explanation: string
  analysis_time_ms: number
  filtering_time_ms: number
  survey_time_ms: number
}

export type ManagerSurveyResponse = {
  question: string
  options: string[]
  agent_mode?: string
  total_responses: number
  platforms_surveyed?: number
  platform_list?: string[]
  platform_results: Record<string, PlatformResult>
  relevance_analysis: Record<string, PlatformRelevance>
  aggregated_summary: Record<string, any>
  mode_metadata?: ModeMetadata
  response_time_ms?: number
  api_calls_made?: number
  insights: string[]
}

export type PlatformInfo = {
  platforms: string[]
  total_platforms: number
  users_per_platform: Record<string, number>
  total_users: number
}

export type CohortCountRequest = {
  message: string
}

export type CohortCountResponse = {
  cohort_query: string
  user_count: number
  source: string
}

import { getApiBase } from './apiConfig'

const API_BASE = getApiBase()

export async function ask(req: AskRequest): Promise<AskResponse> {
  try {
    const res = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })

    if (!res.ok) {
      // Try to extract server error detail
      let detail = ''
      try {
        const data = await res.json()
        detail = data?.detail || JSON.stringify(data)
      } catch {
        try { detail = await res.text() } catch {}
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`API error: ${res.status}${suffix}`)
    }

    return res.json()
  } catch (err: any) {
    if (err?.name === 'TypeError' || /Failed to fetch/i.test(String(err?.message))) {
      throw new Error('Network error: cannot reach API. Is the server running at ' + API_BASE + ' and CORS allowed?')
    }
    throw err
  }
}

export async function askMultiAgent(req: MultiAgentRequest): Promise<MultiAgentResponse> {
  try {
    const res = await fetch(`${API_BASE}/ask-multi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })

    if (!res.ok) {
      // Try to extract server error detail
      let detail = ''
      try {
        const data = await res.json()
        detail = data?.detail || JSON.stringify(data)
      } catch {
        try { detail = await res.text() } catch {}
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`API error: ${res.status}${suffix}`)
    }

    return res.json()
  } catch (err: any) {
    if (err?.name === 'TypeError' || /Failed to fetch/i.test(String(err?.message))) {
      throw new Error('Network error: cannot reach API. Is the server running at ' + API_BASE + ' and CORS allowed?')
    }
    throw err
  }
}

export async function queryCohort(req: CohortCountRequest): Promise<CohortCountResponse> {
  try {
    const res = await fetch(`${API_BASE}/imint/cohort-count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })

    if (!res.ok) {
      let detail = ''
      try {
        const data = await res.json()
        detail = data?.detail || data?.message || JSON.stringify(data)
      } catch {
        try { detail = await res.text() } catch {}
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`Cohort count API error: ${res.status}${suffix}`)
    }

    return res.json()
  } catch (err: any) {
    if (err?.name === 'TypeError' || /Failed to fetch/i.test(String(err?.message))) {
      throw new Error('Network error: cannot reach cohort count API. Is the server running?')
    }
    throw err
  }
}
