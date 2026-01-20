import type { AgentSummary, AgentMode, EnhancedManagerSurveyResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000'

export async function fetchAgents(): Promise<AgentSummary[]> {
  try {
    const response = await fetch(`${API_BASE}/agents`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return []
  }
}

export async function conductSurvey(
  question: string,
  options: string[],
  agentMode: AgentMode = '1x',
  cohortQuery: string = '',
  selectedUserCount?: number | null
): Promise<EnhancedManagerSurveyResponse> {
  try {
    const response = await fetch(`${API_BASE}/survey-manager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        options,
        mock: true,
        agent_mode: agentMode,
        cohort_query: cohortQuery || '',
        selected_user_count: selectedUserCount || null
      })
    })
    
    if (!response.ok) {
      let detail = ''
      try {
        const data = await response.json()
        detail = data?.detail || JSON.stringify(data)
      } catch {
        try { detail = await response.text() } catch {}
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`API error: ${response.status}${suffix}`)
    }
    
    const result = await response.json() as EnhancedManagerSurveyResponse
    return result
  } catch (error) {
    console.error('Failed to conduct survey:', error)
    throw error
  }
}

export { API_BASE }
