import type { AgentSummary, AgentMode, EnhancedManagerSurveyResponse } from './types'

// Single API gateway (ts-server); all requests go here in production
const TS_SERVER_BASE = import.meta.env.VITE_TS_SERVER_BASE ?? import.meta.env.VITE_API_BASE ?? 'http://localhost:1556'

// Helper to get valid auth token (refreshes if expired)
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const { getValidAccessToken } = await import('./lib/authApi')
  return await getValidAccessToken()
}

// Helper to create headers with auth
async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const token = await getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function fetchAgents(): Promise<AgentSummary[]> {
  try {
    // Agents go through ts-server proxy to Python backend
    const response = await fetch(`${TS_SERVER_BASE}/agents`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return []
  }
}

export async function estimateSurveyCredits(
  question: string,
  options: string[],
  agentMode: AgentMode = '1x',
  selectedUserCount?: number | null,
  cohortQuery?: string
): Promise<{
  estimatedCredits: number
  remainingCredits: number
  canAfford: boolean
  message: string
}> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/api/surveys/estimate-credits`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        question,
        options,
        agent_mode: agentMode,
        selected_user_count: selectedUserCount || undefined,
        cohort_query: cohortQuery || undefined,
      }),
    })

    if (!response.ok) {
      // Handle 429 rate limit before attempting to parse response
      if (response.status === 429) {
        // Try to get message from response, but don't fail if parsing fails
        try {
          const data = await response.json()
          throw new Error(data.message || 'Rate limit exceeded. Please wait a moment and try again.')
        } catch (parseError) {
          // If JSON parsing fails, use default message
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        }
      }
      if (response.status === 401) {
        throw new Error('Authentication required. Please login.')
      }
      let detail = ''
      try {
        const data = await response.json()
        detail = data?.message || JSON.stringify(data)
      } catch {
        try {
          detail = await response.text()
        } catch { }
      }
      throw new Error(`API error: ${response.status} - ${detail}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Failed to estimate credits:', error)
    throw error
  }
}

export async function conductSurvey(
  question: string,
  options: string[],
  agentMode: AgentMode = '1x',
  cohortQuery: string = '',
  selectedUserCount?: number | null,
  isPolymarket: boolean = false,
  polymarketData?: { yesPrice: number; noPrice: number; volume: string }
): Promise<EnhancedManagerSurveyResponse> {
  try {
    // No timeout - wait for full response (can take up to 3 hours)
    // The backend will wait for the Python server to complete

    const response = await fetch(`${TS_SERVER_BASE}/api/surveys/create`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        question,
        options,
        mock: true,
        agent_mode: agentMode,
        cohort_query: cohortQuery || '',
        selected_user_count: selectedUserCount || null,
        isPolymarket_enable: isPolymarket,
        polymarket_data: polymarketData ?? undefined
      }),
      // No signal/abort controller - wait indefinitely for response
    })

    if (!response.ok) {
      // Handle 429 rate limit before attempting to parse response
      if (response.status === 429) {
        try {
          const data = await response.json()
          throw new Error(data.message || 'Rate limit exceeded. Please wait a moment and try again.')
        } catch (parseError) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        }
      }
      if (response.status === 401) {
        throw new Error('Authentication required. Please login.')
      }
      if (response.status === 402) {
        // Insufficient credits
        try {
          const data = await response.json()
          throw new Error(
            `Insufficient credits. Required: ${data.required || 'unknown'}, Available: ${data.available || 'unknown'}`
          )
        } catch {
          throw new Error('Insufficient credits. Please purchase more credits.')
        }
      }
      if (response.status === 503) {
        throw new Error('Survey service temporarily unavailable. Please try again later.')
      }
      // Note: We no longer handle 202 status - backend waits for full response
      let detail = ''
      try {
        const data = await response.json()
        detail = data?.message || data?.detail || JSON.stringify(data)
      } catch {
        try {
          detail = await response.text()
        } catch { }
      }
      const suffix = detail ? ` - ${detail.slice(0, 200)}` : ''
      throw new Error(`API error: ${response.status}${suffix}`)
    }

    const result = await response.json()
    // The response structure: { success: true, data: { survey: {...}, result: EnhancedManagerSurveyResponse, message: "..." } }
    // Extract survey result and include credits information
    const rawSurveyResult = result.data?.result || result.result || result
    const surveyInfo = result.data?.survey || result.survey

    // Create a new object with credits information instead of mutating the original
    if (surveyInfo && rawSurveyResult) {
      // Safely extract credits information - ensure values are numbers, not functions
      const creditsUsedValue = typeof surveyInfo.creditsUsed === 'number' ? surveyInfo.creditsUsed : 0
      const participantCountValue = typeof surveyInfo.participantCount === 'number' ? surveyInfo.participantCount : 0
      let surveyIdValue: string = ''
      if (surveyInfo.id && typeof surveyInfo.id === 'string') {
        surveyIdValue = surveyInfo.id as string
      } else if (surveyInfo.surveyId && typeof surveyInfo.surveyId === 'string') {
        surveyIdValue = surveyInfo.surveyId as string
      }

      // Create a new object with all properties from rawSurveyResult plus credits info
      const surveyResult = {
        ...rawSurveyResult,
        creditsUsed: creditsUsedValue,
        participantCount: participantCountValue,
        surveyId: surveyIdValue
      }

      return surveyResult
    }

    return rawSurveyResult
  } catch (error: any) {
    console.error('Failed to conduct survey:', error)

    // Show database error toast if applicable
    if (error.message?.includes('database') || error.message?.includes('Database') ||
      error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT')) {
      const { showDatabaseError } = await import('./utils/toast')
      showDatabaseError(error)
    }

    throw error
  }
}

export async function getSurveyHistory(limit: number = 20): Promise<{
  surveys: Array<{
    id: string
    surveyId: string
    question: string
    participantCount: number
    creditsUsed: number
    status: string
    createdAt: string
    completedAt: string | null
  }>
  total: number
}> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/api/surveys/history?limit=${limit}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    })

    if (!response.ok) {
      // Handle 429 rate limit before attempting to parse response
      if (response.status === 429) {
        try {
          const data = await response.json()
          throw new Error(data.message || 'Rate limit exceeded. Please wait a moment and try again.')
        } catch (parseError) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        }
      }
      if (response.status === 401) {
        throw new Error('Authentication required. Please login.')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('Failed to fetch survey history:', error)
    throw error
  }
}

export async function getSurveyDetails(surveyId: string): Promise<any> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/api/surveys/${surveyId}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please login.')
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      if (response.status === 404) {
        throw new Error('Survey not found')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data?.survey || result.survey || result
  } catch (error) {
    console.error('Failed to fetch survey details:', error)
    throw error
  }
}

export async function fetchNextPolymarketQuestion(): Promise<{
  question: string
  cohort_query: string
  event_url: string
  probability: string
  volume_24h?: string
  trending_score: number
  market_id: string
}> {
  try {
    const response = await fetch(`${TS_SERVER_BASE}/api/polymarket/next-question`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('No new Polymarket questions available right now.')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Failed to fetch Polymarket question:', error)
    throw error
  }
}

export { TS_SERVER_BASE as API_BASE }
