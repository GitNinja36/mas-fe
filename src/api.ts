import type { AgentSummary, QuestionResult, AgentMode } from './types'

const API_BASE = 'http://127.0.0.1:8000'

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
  cohortQuery: string = ''
): Promise<QuestionResult | null> {
  try {
    const response = await fetch(`${API_BASE}/survey-manager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        options,
        mock: true,
        agent_mode: agentMode,
        cohort_query: cohortQuery || ''
      })
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const result = await response.json()

    const agentResponses: { [userId: string]: any } = {}
    if (result.platform_results) {
      Object.entries(result.platform_results).forEach(([platform, platformResult]: [string, any]) => {
        platformResult.user_responses?.forEach((userResp: any, index: number) => {
          const uniqueKey = `${platform}_${userResp.user_id}_${index}`
          agentResponses[uniqueKey] = {
            choice: userResp.choice,
            selection: userResp.selection,
            reasoning: userResp.reason,
            confidence: userResp.confidence
          }
        })
      })
    }

    const choiceDistribution: { [key: string]: number } = {}
    if (result.aggregated_summary?.overall_breakdown) {
      Object.entries(result.aggregated_summary.overall_breakdown).forEach(([choice, data]: [string, any]) => {
        if (typeof data === 'object' && data !== null && 'count' in data) {
          choiceDistribution[choice] = data.count
        } else if (typeof data === 'number') {
          choiceDistribution[choice] = data
        }
      })
    }

    // Calculate consistency score dynamically
    // Higher score means more agreement among agents
    const totalResponses = result.total_responses || 0
    let consistencyScore = 0
    if (totalResponses > 0) {
      const counts = Object.values(choiceDistribution) as number[]
      const maxCount = Math.max(...counts, 0)
      // Consistency is the percentage of agents that agreed on the top choice
      consistencyScore = maxCount / totalResponses
    }

    // Calculate average confidence from agent responses
    const confidenceScores: { [key: string]: number } = {}
    let totalConfidence = 0
    let confidenceCount = 0
    Object.entries(agentResponses).forEach(([key, resp]: [string, any]) => {
      if (resp.confidence) {
        confidenceScores[key] = resp.confidence
        totalConfidence += resp.confidence
        confidenceCount++
      }
    })
    const avgConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0

    return {
      question: result.question,
      options: result.options,
      agent_responses: agentResponses,
      analytics: {
        total_responses: totalResponses,
        choice_distribution: choiceDistribution,
        confidence_scores: confidenceScores,
        consistency_score: consistencyScore,
        average_confidence: avgConfidence,
        decision_factors: result.insights || [],
        primary_context: 'general'
      }
    }
  } catch (error) {
    console.error('Failed to conduct survey:', error)
    return null
  }
}

export { API_BASE }
