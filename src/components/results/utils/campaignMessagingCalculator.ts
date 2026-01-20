/**
 * Campaign messaging calculation utility
 * Calculates platform-specific messaging effectiveness from survey data
 */

import type {
  ChoiceDistribution,
  DecisionFactor,
  AgentResponseGroup,
  CampaignMessaging,
  PlatformMessaging,
  MessageEffectiveness,
  ToneVariation,
} from '../../../types'

interface CampaignInput {
  agent_responses_grouped: Record<string, AgentResponseGroup>
  choice_distribution: ChoiceDistribution
  decision_factors: DecisionFactor[]
  options: string[]
  confidence_in_recommendation?: number
  overall_metrics?: { average_confidence?: number }
  agent_responses_list?: Array<{ platform: string; choice: string; reasoning: string; confidence?: number }>
  platforms_surveyed?: string[]
}

/**
 * Extracts emotional drivers from agent reasoning text
 */
function extractEmotionalDrivers(responses: Array<{ reasoning: string }>): Record<string, number> {
  const drivers: Record<string, number> = {}
  const driverKeywords: Record<string, string[]> = {
    roi: ['roi', 'return', 'investment', 'profit', 'revenue', 'efficiency', 'productivity'],
    trust: ['trust', 'reliable', 'secure', 'safe', 'proven', 'established', 'credible'],
    speed: ['speed', 'fast', 'quick', 'instant', 'immediate', 'rapid', 'swift'],
    convenience: ['convenient', 'easy', 'simple', 'effortless', 'accessible', 'user-friendly'],
    trendy: ['trendy', 'trending', 'popular', 'viral', 'hot', 'current', 'modern'],
    fun: ['fun', 'entertaining', 'enjoyable', 'engaging', 'exciting', 'playful'],
    professional: ['professional', 'business', 'enterprise', 'corporate', 'serious', 'formal'],
    authentic: ['authentic', 'genuine', 'real', 'honest', 'transparent', 'sincere'],
    quality: ['quality', 'premium', 'high-end', 'excellent', 'superior', 'best'],
    value: ['value', 'affordable', 'cheap', 'budget', 'cost-effective', 'economical'],
  }

  responses.forEach((response) => {
    const reasoningLower = response.reasoning.toLowerCase()
    Object.entries(driverKeywords).forEach(([driver, keywords]) => {
      keywords.forEach((keyword) => {
        if (reasoningLower.includes(keyword)) {
          drivers[driver] = (drivers[driver] || 0) + 1
        }
      })
    })
  })

  return drivers
}

/**
 * Gets top emotional drivers sorted by frequency
 */
function getTopDrivers(drivers: Record<string, number>, limit: number = 3): string[] {
  return Object.entries(drivers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([driver]) => driver.toUpperCase())
}

/**
 * Calculates message effectiveness for a platform/option combination
 */
function calculateMessageEffectiveness(
  platformResponses: Array<{ choice: string }>,
  choiceLetter: string
): number {
  if (platformResponses.length === 0) return 0
  const matchingResponses = platformResponses.filter((r) => r.choice === choiceLetter)
  return (matchingResponses.length / platformResponses.length) * 100
}

/**
 * Generates recommended message based on platform, option, and drivers
 */
function generateRecommendedMessage(
  platform: string,
  option: string,
  topDrivers: string[],
  effectiveness: number
): string {
  const driver = topDrivers[0] || 'value'
  const platformLower = platform.toLowerCase()

  if (platformLower.includes('linkedin') || platformLower.includes('reddit')) {
    return `Maximize ${driver.toLowerCase()} with ${option} for professional audiences`
  } else if (platformLower.includes('tiktok') || platformLower.includes('instagram')) {
    return `Join the ${driver.toLowerCase()} movement with ${option}`
  } else if (platformLower.includes('youtube')) {
    return `Discover how ${option} delivers ${driver.toLowerCase()} for your needs`
  } else {
    return `${effectiveness.toFixed(0)}% of ${platform} users prefer ${option} for ${driver.toLowerCase()}`
  }
}

/**
 * Generates ad copy ideas for a platform/option combination
 */
function generateAdCopyIdeas(
  platform: string,
  option: string,
  effectiveness: number,
  topDrivers: string[]
): string[] {
  const platformLower = platform.toLowerCase()
  const driver = topDrivers[0] || 'value'
  const ideas: string[] = []

  // Platform-specific ad copy templates
  if (platformLower.includes('linkedin')) {
    ideas.push(`${effectiveness.toFixed(0)}% of professionals prefer ${option}`)
    ideas.push(`Increase ${driver.toLowerCase()} by 45% in first month`)
    ideas.push(`Enterprise-grade ${option} with SMB pricing`)
  } else if (platformLower.includes('tiktok') || platformLower.includes('instagram')) {
    ideas.push(`Everyone's switching to ${option}`)
    ideas.push(`POV: You've been missing out on ${option}`)
    ideas.push(`This ${driver.toLowerCase()} trend hits different 🔥`)
  } else if (platformLower.includes('youtube')) {
    ideas.push(`Why ${effectiveness.toFixed(0)}% of creators choose ${option}`)
    ideas.push(`The ${option} that actually works`)
    ideas.push(`Stop wasting time - try ${option} today`)
  } else {
    ideas.push(`${effectiveness.toFixed(0)}% of ${platform} users prefer ${option}`)
    ideas.push(`Join the ${driver.toLowerCase()} movement`)
    ideas.push(`${option}: Built for ${driver.toLowerCase()}`)
  }

  return ideas.slice(0, 4)
}

/**
 * Generates tone variations for a platform
 */
function generateToneVariations(
  platform: string,
  option: string,
  topDrivers: string[]
): { formal: string; casual: string; urgent: string } {
  const driver = topDrivers[0] || 'value'
  const platformLower = platform.toLowerCase()

  return {
    formal: `Backed by enterprise data and proven ${driver.toLowerCase()}, ${option} delivers measurable results for professional teams.`,
    casual: `The ${option} that actually works for busy people. Simple, effective, just ${driver.toLowerCase()}.`,
    urgent: `Limited time - secure your ${option} access before availability runs out. Join ${driver.toLowerCase()} leaders today.`,
  }
}

/**
 * Determines best platforms for each tone
 */
function getBestPlatformsForTone(tone: 'FORMAL' | 'CASUAL' | 'URGENT'): string[] {
  switch (tone) {
    case 'FORMAL':
      return ['linkedin', 'reddit', 'professional networks']
    case 'CASUAL':
      return ['instagram', 'tiktok', 'twitter', 'casual platforms']
    case 'URGENT':
      return ['email', 'sms', 'direct response']
    default:
      return []
  }
}

/**
 * Extracts primary benefit from agent reasoning
 */
function extractPrimaryBenefit(responses: Array<{ reasoning: string }>): string {
  const benefitKeywords: Record<string, string[]> = {
    automates: ['automate', 'automatic', 'automation', 'saves time', 'time-saving'],
    simplifies: ['simple', 'easy', 'simplify', 'streamline', 'effortless'],
    improves: ['improve', 'better', 'enhance', 'optimize', 'upgrade'],
    increases: ['increase', 'boost', 'raise', 'grow', 'expand'],
    reduces: ['reduce', 'decrease', 'lower', 'minimize', 'cut'],
  }

  const benefitCounts: Record<string, number> = {}
  
  responses.forEach((response) => {
    const reasoningLower = response.reasoning.toLowerCase()
    Object.entries(benefitKeywords).forEach(([benefit, keywords]) => {
      keywords.forEach((keyword) => {
        if (reasoningLower.includes(keyword)) {
          benefitCounts[benefit] = (benefitCounts[benefit] || 0) + 1
        }
      })
    })
  })

  const topBenefit = Object.entries(benefitCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'improves'

  // Extract a concrete phrase from reasoning
  const allReasoning = responses.map(r => r.reasoning.toLowerCase()).join(' ')
  const phrases = allReasoning.match(/(?:because|since|as|due to|thanks to|enables|allows|helps|provides|offers|delivers|gives)[^.!?]{0,60}/gi) || []
  
  if (phrases.length > 0) {
    return phrases[0]?.replace(/^(because|since|as|due to|thanks to|enables|allows|helps|provides|offers|delivers|gives)\s+/i, '').trim() || topBenefit
  }

  return topBenefit
}

/**
 * Finds the winning platform (highest consensus)
 */
function findWinningPlatform(
  agent_responses_grouped: Record<string, AgentResponseGroup>
): { platform: string; consensus: number } | null {
  let winner: { platform: string; consensus: number } | null = null

  Object.entries(agent_responses_grouped).forEach(([platform, group]) => {
    const consensus = group.platform_consensus || 0
    if (!winner || consensus > winner.consensus) {
      winner = { platform, consensus }
    }
  })

  return winner
}

/**
 * Generates dynamic campaign timeline based on platform and confidence
 */
function generateDynamicCampaignTimeline(
  primaryPlatform: string,
  confidence: number,
  winningChoice: string,
  winningPercentage: number,
  extractedBenefit: string,
  options: string[]
): { strategy_type: string; phases: Array<{ time: string; title: string; action: string; budget_allocation: string }> } {
  const platformLower = primaryPlatform.toLowerCase()
  
  // Determine pace based on platform
  const isFastPaced = platformLower.includes('tiktok') || 
                      platformLower.includes('twitter') || 
                      platformLower.includes('instagram')
  
  const unit = isFastPaced ? 'Days' : 'Weeks'
  const pace = isFastPaced ? 'Sprint' : 'Marathon'
  
  // Determine strategy based on confidence
  const isHighConfidence = confidence > 0.8
  const isLowConfidence = confidence < 0.5
  
  const winningOption = options[winningChoice.charCodeAt(0) - 65] || winningChoice
  
  let strategyType = ''
  let phases: Array<{ time: string; title: string; action: string; budget_allocation: string }> = []

  if (isHighConfidence) {
    strategyType = `${pace} Scale`
    
    phases = [
      {
        time: `First 3 ${unit}`,
        title: 'Blitz Launch',
        action: `Skip testing. Allocate 70% budget immediately to ${primaryPlatform}.`,
        budget_allocation: '60%',
      },
      {
        time: `Next 2 ${unit}`,
        title: 'Rapid Scale',
        action: `Double down on ${primaryPlatform}. Shift remaining budget from other platforms.`,
        budget_allocation: '30%',
      },
      {
        time: `${unit} 6+`,
        title: ' Optimize & Expand',
        action: `Fine-tune messaging based on performance data. Consider expanding to runner-up platforms.`,
        budget_allocation: '10%',
      },
    ]
  } else if (isLowConfidence) {
    strategyType = `${pace} Validation`
    
    phases = [
      {
        time: `First 3 ${unit}`,
        title: '⚖️ Validation Phase',
        action: `Confidence is mixed. Run A/B tests on ${primaryPlatform} vs runner-up platforms.`,
        budget_allocation: '20%',
      },
      {
        time: `Next 2 ${unit}`,
        title: '📊 Analyze Results',
        action: `Review performance metrics. Identify which platform and messaging resonates best.`,
        budget_allocation: '30%',
      },
      {
        time: `${unit} 6+`,
        title: '🚀 Scale Winners',
        action: `Shift 80% budget to top performer. Retire underperforming variations.`,
        budget_allocation: '50%',
      },
    ]
  } else {
    strategyType = `${pace} Balanced`
    
    phases = [
      {
        time: `First 2 ${unit}`,
        title: '🧪 Test Variations',
        action: `Test all message variations across top 3 platforms. Monitor engagement closely.`,
        budget_allocation: '30%',
      },
      {
        time: `Next 2 ${unit}`,
        title: '📈 Scale Winners',
        action: `Double budget on highest performing messages. Reduce spend on low performers.`,
        budget_allocation: '40%',
      },
      {
        time: `${unit} 5+`,
        title: '🎯 Optimize & Shift',
        action: `Shift budget entirely to winner. Retire losers. Optimize remaining campaigns.`,
        budget_allocation: '30%',
      },
    ]
  }

  return { strategy_type: strategyType, phases }
}

/**
 * Calculates campaign messaging from survey data
 */
export function calculateCampaignMessaging(input: CampaignInput): CampaignMessaging {
  const { agent_responses_grouped, choice_distribution, decision_factors, options, agent_responses_list, platforms_surveyed } = input

  const platformMessaging: Record<string, PlatformMessaging> = {}

  // Process each platform
  Object.entries(agent_responses_grouped).forEach(([platform, group]) => {
    let responses = group.responses || []
    
    // Fallback: if responses array is empty, try to get from agent_responses_list
    if (responses.length === 0 && agent_responses_list) {
      responses = agent_responses_list
        .filter(r => r.platform?.toLowerCase() === platform.toLowerCase())
        .map(r => ({
          choice: r.choice,
          reasoning: r.reasoning || '',
          confidence: r.confidence || 0.5,
        })) as any[]
    }
    
    if (responses.length === 0) return

    // Extract emotional drivers
    const emotionalDrivers = extractEmotionalDrivers(responses)
    const topDrivers = getTopDrivers(emotionalDrivers, 3)

    // Calculate effectiveness for each option
    const effectiveness: Record<string, MessageEffectiveness> = {}

    options.forEach((option, index) => {
      const choiceLetter = String.fromCharCode(65 + index) // A, B, C, etc.
      const percentage = calculateMessageEffectiveness(responses, choiceLetter)

      // Get responses for this specific choice
      const choiceResponses = responses.filter((r) => r.choice === choiceLetter)
      const choiceDrivers = extractEmotionalDrivers(choiceResponses)
      const choiceTopDrivers = getTopDrivers(choiceDrivers, 3)

      const message = generateRecommendedMessage(platform, option, choiceTopDrivers, percentage)
      const adCopyIdeas = generateAdCopyIdeas(platform, option, percentage, choiceTopDrivers)

      effectiveness[choiceLetter] = {
        percentage,
        top_drivers: choiceTopDrivers,
        message,
        ad_copy_ideas: adCopyIdeas,
      }
    })

    // Find winning option for this platform
    const winningOption = Object.entries(effectiveness).sort(
      ([, a], [, b]) => b.percentage - a.percentage
    )[0]

    const recommendedMessage = winningOption
      ? generateRecommendedMessage(platform, options[winningOption[0].charCodeAt(0) - 65], topDrivers, winningOption[1].percentage)
      : `Optimize messaging for ${platform} audience`

    const toneVariations = generateToneVariations(platform, options[0] || '', topDrivers)

    platformMessaging[platform] = {
      platform,
      effectiveness,
      emotional_drivers: emotionalDrivers,
      recommended_message: recommendedMessage,
      tone_variations: toneVariations,
    }
  })

  // Find winning platform and calculate confidence
  const winningPlatform = findWinningPlatform(agent_responses_grouped)
  const primaryPlatform = winningPlatform?.platform || Object.keys(agent_responses_grouped)[0] || 'unknown'
  
  // Get confidence score (prefer confidence_in_recommendation, fallback to average_confidence or winning percentage)
  const confidence = input.confidence_in_recommendation ?? 
                     input.overall_metrics?.average_confidence ?? 
                     (choice_distribution.winning_percentage / 100)
  
  // Extract primary benefit from winning choice reasoning
  const winningChoice = choice_distribution.winning_choice
  let winningResponses = Object.values(agent_responses_grouped)
    .flatMap(group => group.responses || [])
    .filter(r => r.choice === winningChoice)
  
  // Fallback: use agent_responses_list if no responses found
  if (winningResponses.length === 0 && agent_responses_list) {
    winningResponses = agent_responses_list
      .filter(r => r.choice === winningChoice)
      .map(r => ({ reasoning: r.reasoning || '' })) as any[]
  }
  
  const extractedBenefit = extractPrimaryBenefit(winningResponses)
  const winningOption = options[winningChoice.charCodeAt(0) - 65] || winningChoice
  
  // Extract stat from winning percentage
  const stat = `${choice_distribution.winning_percentage.toFixed(0)}% of users`
  
  // Generate dynamic message variations with extracted benefits
  const messageVariations: ToneVariation[] = [
    {
      type: 'FORMAL',
      best_for: getBestPlatformsForTone('FORMAL'),
      template: `Backed by ${stat} and proven ${extractedBenefit}, ${winningOption} delivers measurable results.`,
    },
    {
      type: 'CASUAL',
      best_for: getBestPlatformsForTone('CASUAL'),
      template: `Simple, effective, just ${extractedBenefit}. ${winningOption} is the clear choice.`,
    },
    {
      type: 'URGENT',
      best_for: getBestPlatformsForTone('URGENT'),
      template: `Limited time - ${winningOption} delivers ${extractedBenefit}. Act now before availability runs out.`,
    },
  ]

  // If no platform messaging was created, create minimal entries from platforms_surveyed or choice_distribution
  if (Object.keys(platformMessaging).length === 0) {
    const platformsToUse = platforms_surveyed && platforms_surveyed.length > 0 
      ? platforms_surveyed 
      : Object.keys(agent_responses_grouped).length > 0 
        ? Object.keys(agent_responses_grouped)
        : ['linkedin'] // fallback default
    
    platformsToUse.forEach((platform) => {
      const effectiveness: Record<string, MessageEffectiveness> = {}
      options.forEach((option, index) => {
        const choiceLetter = String.fromCharCode(65 + index)
        const percentage = choice_distribution.choices[choiceLetter]?.percentage || 0
        
        effectiveness[choiceLetter] = {
          percentage,
          top_drivers: ['VALUE'],
          message: `${percentage.toFixed(0)}% prefer ${option}`,
          ad_copy_ideas: [`Discover ${option}`, `Try ${option} today`],
        }
      })
      
      platformMessaging[platform] = {
        platform,
        effectiveness,
        emotional_drivers: {},
        recommended_message: `Optimize messaging for ${platform} audience`,
        tone_variations: {
          formal: `Professional messaging for ${platform}`,
          casual: `Casual messaging for ${platform}`,
          urgent: `Urgent messaging for ${platform}`,
        },
      }
    })
  }

  // Generate dynamic campaign timeline
  const campaignTimeline = generateDynamicCampaignTimeline(
    primaryPlatform,
    confidence,
    winningChoice,
    choice_distribution.winning_percentage,
    extractedBenefit,
    options
  )

  return {
    platform_messaging: platformMessaging,
    message_variations: messageVariations,
    campaign_timeline: campaignTimeline,
  }
}
