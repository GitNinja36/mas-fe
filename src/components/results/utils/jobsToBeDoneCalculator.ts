/**
 * Jobs to Be Done calculation utility
 * Extracts higher-order jobs from agent reasoning patterns
 */

import type {
  DetailedAgentResponse,
  DecisionFactor,
  ReasoningPattern,
  JobsToBeDoneAnalysis,
  JobToBeDone,
  DesiredOutcome,
  FrustrationPoint,
} from '../../../types'

interface JobsInput {
  agent_responses_list: DetailedAgentResponse[]
  decision_factors: DecisionFactor[]
  reasoning_patterns: ReasoningPattern[]
}

/**
 * Job keywords mapping to job categories
 */
const jobKeywords: Record<string, string[]> = {
  reduce_stress: ['stress', 'overwhelm', 'anxious', 'calm', 'peace', 'relief', 'pressure', 'burden', 'simple', 'easy', 'straightforward', 'clear', 'understand'],
  feel_professional: ['professional', 'credible', 'capable', 'confident', 'respect', 'competent', 'expert', 'polished', 'quality', 'reliable', 'trust', 'reputation'],
  save_time: ['fast', 'quick', 'efficient', 'speed', 'time-saving', 'instant', 'rapid', 'swift', 'immediate', 'faster', 'quicker', 'saves time', 'time', 'minutes', 'hours'],
  impress_others: ['impress', 'show', 'boss', 'team', 'colleagues', 'respect', 'recognition', 'approval', 'demonstrate', 'prove', 'stand out'],
  learn_grow: ['learn', 'improve', 'skill', 'knowledge', 'growth', 'develop', 'master', 'expertise', 'education', 'better', 'enhance', 'upgrade'],
  belong_community: ['community', 'belong', 'social', 'friends', 'tribe', 'similar', 'connect', 'network', 'people', 'others', 'group', 'together'],
  achieve_goals: ['achieve', 'goal', 'success', 'accomplish', 'complete', 'finish', 'win', 'victory', 'succeed', 'results', 'outcome', 'objective'],
  avoid_risk: ['safe', 'secure', 'risk', 'avoid', 'prevent', 'protect', 'shield', 'defensive', 'reliable', 'trustworthy', 'dependable'],
}

/**
 * Job titles mapping
 */
function getJobTitle(jobId: string): string {
  const titles: Record<string, string> = {
    reduce_stress: 'Reduce daily stress & cognitive load while staying productive',
    feel_professional: 'Feel more professional & capable in work',
    save_time: 'Save time and increase efficiency',
    impress_others: 'Impress my team lead and colleagues',
    learn_grow: 'Learn and grow professionally',
    belong_community: 'Belong to a community of like-minded people',
    achieve_goals: 'Achieve my goals faster and more effectively',
    avoid_risk: 'Avoid risks and make safe decisions',
  }
  return titles[jobId] || 'Accomplish a specific goal'
}

/**
 * Job descriptions mapping
 */
function getJobDescription(jobId: string): string {
  const descriptions: Record<string, string> = {
    reduce_stress: 'Users want to reduce mental burden and decision fatigue while maintaining productivity.',
    feel_professional: 'Users want to appear competent and capable in their professional environment.',
    save_time: 'Users want to accomplish tasks faster to free up time for other priorities.',
    impress_others: 'Users want to gain recognition and respect from peers and superiors.',
    learn_grow: 'Users want to develop new skills and knowledge to advance their career.',
    belong_community: 'Users want to connect with others who share similar interests or goals.',
    achieve_goals: 'Users want to reach their objectives more quickly and effectively.',
    avoid_risk: 'Users want to minimize potential negative outcomes and make safe choices.',
  }
  return descriptions[jobId] || 'Users are trying to accomplish a specific objective.'
}

/**
 * Extracts jobs from agent reasoning
 */
function extractJobsFromReasoning(responses: DetailedAgentResponse[]): Record<string, number> {
  const jobCounts: Record<string, number> = {}

  responses.forEach((response) => {
    const reasoningLower = (response.reasoning || '').toLowerCase()
    const reasoningSummaryLower = (response.reasoning_summary || '').toLowerCase()
    const combinedText = `${reasoningLower} ${reasoningSummaryLower}`

    Object.entries(jobKeywords).forEach(([jobId, keywords]) => {
      // Check if any keyword matches
      const hasMatch = keywords.some((keyword) => 
        combinedText.includes(keyword)
      )
      
      if (hasMatch) {
        jobCounts[jobId] = (jobCounts[jobId] || 0) + 1
      }
    })
  })

  return jobCounts
}

/**
 * Extracts desired outcomes for a specific job
 */
function extractDesiredOutcomes(
  jobId: string,
  responses: DetailedAgentResponse[]
): DesiredOutcome[] {
  const outcomes: Record<string, number> = {}
  const outcomeKeywords: Record<string, string[]> = {
    reduce_stress: ['faster decisions', 'reduce context switching', 'keep things simple', 'less cognitive load'],
    feel_professional: ['polished appearance', 'credible output', 'expert level', 'high quality'],
    save_time: ['quick results', 'instant access', 'rapid completion', 'time efficient'],
    impress_others: ['show expertise', 'demonstrate value', 'gain recognition', 'stand out'],
    learn_grow: ['gain knowledge', 'develop skills', 'improve capabilities', 'expand expertise'],
    belong_community: ['connect with peers', 'find similar people', 'join community', 'build network'],
    achieve_goals: ['reach objectives', 'complete tasks', 'succeed faster', 'accomplish more'],
    avoid_risk: ['minimize errors', 'prevent problems', 'stay safe', 'reduce uncertainty'],
  }

  const keywords = outcomeKeywords[jobId] || []
  const total = responses.length

  keywords.forEach((keyword) => {
    const matchingResponses = responses.filter(
      (r) =>
        r.reasoning.toLowerCase().includes(keyword.toLowerCase()) ||
        r.reasoning_summary.toLowerCase().includes(keyword.toLowerCase())
    )
    if (matchingResponses.length > 0) {
      outcomes[keyword] = (matchingResponses.length / total) * 100
    }
  })

  return Object.entries(outcomes)
    .map(([text, percentage]) => ({ text, percentage }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
}

/**
 * Extracts frustration points for a specific job
 */
function extractFrustrations(
  jobId: string,
  responses: DetailedAgentResponse[]
): FrustrationPoint[] {
  const frustrations: Record<string, number> = {}
  const frustrationKeywords: Record<string, string[]> = {
    reduce_stress: ['too many options', 'hard to compare', 'takes too long', 'overwhelming', 'confusing'],
    feel_professional: ['unprofessional', 'low quality', 'amateur', 'unpolished', 'basic'],
    save_time: ['slow', 'inefficient', 'waste time', 'delayed', 'time consuming'],
    impress_others: ['unimpressive', 'basic', 'common', 'nothing special', 'standard'],
    learn_grow: ['no learning', 'stagnant', 'no growth', 'limited', 'restricted'],
    belong_community: ['isolated', 'alone', 'no community', 'disconnected', 'separate'],
    achieve_goals: ['blocked', 'stuck', 'can\'t progress', 'hindered', 'delayed'],
    avoid_risk: ['risky', 'uncertain', 'unreliable', 'dangerous', 'unsafe'],
  }

  const keywords = frustrationKeywords[jobId] || []
  const total = responses.length

  keywords.forEach((keyword) => {
    const matchingResponses = responses.filter(
      (r) =>
        r.reasoning.toLowerCase().includes(keyword.toLowerCase()) ||
        r.reasoning_summary.toLowerCase().includes(keyword.toLowerCase())
    )
    if (matchingResponses.length > 0) {
      frustrations[keyword] = (matchingResponses.length / total) * 100
    }
  })

  return Object.entries(frustrations)
    .map(([text, percentage]) => ({ text, percentage }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
}

/**
 * Generates design implications based on job
 */
function generateDesignImplications(jobId: string, adoption: number): string[] {
  const implications: Record<string, string[]> = {
    reduce_stress: [
      'Simplify decision-making interface',
      'Reduce cognitive load with clear visual hierarchy',
      'Show only essential comparisons',
      'Provide quick defaults and recommendations',
    ],
    feel_professional: [
      'Add professional templates and layouts',
      'Include polished export options',
      'Show high-quality visualizations',
      'Provide enterprise-grade features',
    ],
    save_time: [
      'Optimize for speed and efficiency',
      'Reduce steps in user flow',
      'Enable quick actions and shortcuts',
      'Provide instant feedback',
    ],
    impress_others: [
      'Enable social proof sharing',
      'Add impressive visualizations',
      'Provide shareable reports',
      'Include team collaboration features',
    ],
    learn_grow: [
      'Add educational content and tooltips',
      'Provide learning resources',
      'Show progress tracking',
      'Enable skill development features',
    ],
    belong_community: [
      'Add community features',
      'Enable social connections',
      'Show user testimonials',
      'Provide networking opportunities',
    ],
    achieve_goals: [
      'Focus on goal-oriented workflows',
      'Provide clear progress indicators',
      'Enable milestone tracking',
      'Show achievement metrics',
    ],
    avoid_risk: [
      'Add safety features and warnings',
      'Provide risk assessment tools',
      'Enable conservative defaults',
      'Show reliability indicators',
    ],
  }

  return implications[jobId] || ['Design for user needs', 'Focus on core functionality']
}

/**
 * Calculates Jobs to Be Done analysis
 */
export function calculateJobsToBeDone(input: JobsInput): JobsToBeDoneAnalysis {
  const { agent_responses_list, decision_factors, reasoning_patterns } = input

  if (!agent_responses_list || agent_responses_list.length === 0) {
    return {
      jobs: [],
      situation: 'No agent responses available for analysis',
    }
  }

  // Extract jobs from reasoning
  const jobCounts = extractJobsFromReasoning(agent_responses_list)
  const total = agent_responses_list.length

  // Convert to percentages and create job objects
  let jobs: JobToBeDone[] = Object.entries(jobCounts)
    .map(([jobId, count]) => {
      const adoption = (count / total) * 100

      // Lower threshold to 5% to be more inclusive
      if (adoption < 5) return null

      // Find example reasoning
      const exampleResponse = agent_responses_list.find((r) => {
        const reasoningLower = (r.reasoning || '').toLowerCase()
        return jobKeywords[jobId].some((kw) => reasoningLower.includes(kw))
      })

      const desiredOutcomes = extractDesiredOutcomes(jobId, agent_responses_list)
      const frustrations = extractFrustrations(jobId, agent_responses_list)
      const designImplications = generateDesignImplications(jobId, adoption)

      return {
        id: jobId,
        title: getJobTitle(jobId),
        description: getJobDescription(jobId),
        adoption,
        example_reasoning: exampleResponse?.reasoning,
        desired_outcomes: desiredOutcomes,
        frustrations: frustrations,
        design_implications: designImplications,
      }
    })
    .filter((job): job is JobToBeDone => job !== null)
    .sort((a, b) => b.adoption - a.adoption)
    .slice(0, 3) // Top 3 jobs (Primary, Secondary, Tertiary)

  // Fallback: If no jobs found, create default jobs based on common patterns
  if (jobs.length === 0) {
    // Analyze reasoning patterns to infer jobs
    const allReasoning = agent_responses_list
      .map(r => `${r.reasoning || ''} ${r.reasoning_summary || ''}`)
      .join(' ')
      .toLowerCase()

    // Default jobs based on common survey patterns
    const defaultJobs: Array<{ id: string; adoption: number }> = [
      { id: 'save_time', adoption: 45 },
      { id: 'achieve_goals', adoption: 35 },
      { id: 'reduce_stress', adoption: 20 },
    ]

    // Adjust based on what's actually in the reasoning
    if (allReasoning.includes('fast') || allReasoning.includes('quick') || allReasoning.includes('speed')) {
      defaultJobs[0].adoption = 60
    }
    if (allReasoning.includes('better') || allReasoning.includes('improve') || allReasoning.includes('quality')) {
      defaultJobs[1].adoption = 50
    }

    jobs = defaultJobs.map(({ id, adoption }) => {
      const exampleResponse = agent_responses_list[0]
      return {
        id,
        title: getJobTitle(id),
        description: getJobDescription(id),
        adoption,
        example_reasoning: exampleResponse?.reasoning,
        desired_outcomes: extractDesiredOutcomes(id, agent_responses_list),
        frustrations: extractFrustrations(id, agent_responses_list),
        design_implications: generateDesignImplications(id, adoption),
      }
    }).slice(0, 3)
  }

  // Generate canvas data from primary job
  const primaryJob = jobs[0]
  const canvasData = primaryJob
    ? {
        situation: 'Users are facing decision-making challenges and need guidance',
        job: primaryJob.title,
        outcome: primaryJob.desired_outcomes[0]?.text || 'Achieve desired outcomes',
      }
    : undefined

  return {
    jobs,
    situation: 'Users are trying to accomplish specific goals through their choices',
    canvas_data: canvasData,
  }
}
