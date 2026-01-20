/**
 * Roadmap calculation utility
 * Calculates implementation phases from survey data
 */

import type {
  ChoiceDistribution,
  DecisionFactor,
  RiskOrBlindSpot,
  ImplementationRoadmap,
  ImplementationPhase,
} from '../../../types'

interface RoadmapInput {
  choice_distribution: ChoiceDistribution
  decision_factors: DecisionFactor[]
  risks_and_blindspots: RiskOrBlindSpot[]
  options: string[]
}

/**
 * Estimates development effort in days based on option text complexity (NOT preference)
 * Uses keyword analysis and text length to determine T-shirt sizing
 */
function estimateDevEffort(option: string): { effort: number; difficulty: 'Low' | 'Medium' | 'High' } {
  const textLower = option.toLowerCase()
  
  // High effort keywords (complex features)
  const highEffortKeywords = [
    'integration', 'ai', 'artificial intelligence', 'machine learning', 'system', 'platform',
    'automated', 'analytics', 'dashboard', 'api', 'database', 'infrastructure', 'architecture',
    'blockchain', 'cryptocurrency', 'enterprise', 'scalable', 'distributed', 'real-time',
    'synchronization', 'migration', 'transformation', 'algorithm', 'optimization'
  ]
  
  // Medium effort keywords
  const mediumEffortKeywords = [
    'feature', 'update', 'content', 'report', 'add', 'edit', 'delete', 'manage',
    'settings', 'preferences', 'notification', 'filter', 'search', 'export', 'import'
  ]
  
  // Low effort keywords (simple features)
  const lowEffortKeywords = [
    'toggle', 'switch', 'button', 'link', 'text', 'label', 'color', 'theme',
    'icon', 'badge', 'tooltip', 'popup', 'modal', 'dialog'
  ]
  
  // Check for high effort keywords
  const hasHighEffortKeyword = highEffortKeywords.some(keyword => textLower.includes(keyword))
  const hasMediumEffortKeyword = mediumEffortKeywords.some(keyword => textLower.includes(keyword))
  const hasLowEffortKeyword = lowEffortKeywords.some(keyword => textLower.includes(keyword))
  
  // Determine difficulty and effort
  if (hasHighEffortKeyword || option.length > 60) {
    return { effort: 45, difficulty: 'High' }
  } else if (hasMediumEffortKeyword || (option.length > 30 && option.length <= 60)) {
    return { effort: 14, difficulty: 'Medium' }
  } else if (hasLowEffortKeyword || option.length <= 20) {
    return { effort: 5, difficulty: 'Low' }
  } else {
    // Default to medium if unclear
    return { effort: 14, difficulty: 'Medium' }
  }
}

/**
 * Determines urgency multiplier from decision factors and risks
 */
function getUrgencyMultiplier(
  option: string,
  decisionFactors: DecisionFactor[],
  risks: RiskOrBlindSpot[]
): number {
  // Check if any decision factor mentions "blocks" or "urgent"
  const blockingFactors = decisionFactors.filter(
    (factor) =>
      factor.factor.toLowerCase().includes('block') ||
      factor.factor.toLowerCase().includes('urgent') ||
      factor.factor.toLowerCase().includes('critical')
  )
  
  if (blockingFactors.length > 0) {
    return 1.0
  }
  
  // Check if any risk mentions blocking
  const blockingRisks = risks.filter(
    (risk) =>
      risk.description.toLowerCase().includes('block') ||
      risk.description.toLowerCase().includes('prevent') ||
      (risk.severity === 'High' && risk.description.toLowerCase().includes(option.toLowerCase()))
  )
  
  if (blockingRisks.length > 0) {
    return 0.9
  }
  
  return 0.7
}

/**
 * Extracts dependencies from risks and decision factors
 */
function extractDependencies(
  option: string,
  risks: RiskOrBlindSpot[],
  allOptions: string[]
): string[] {
  const dependencies: string[] = []
  
  // Check risks for mentions of other options
  risks.forEach((risk) => {
    if (risk.description.toLowerCase().includes(option.toLowerCase())) {
      allOptions.forEach((otherOption) => {
        if (
          otherOption !== option &&
          risk.description.toLowerCase().includes(otherOption.toLowerCase())
        ) {
          dependencies.push(otherOption)
        }
      })
    }
  })
  
  return [...new Set(dependencies)]
}

/**
 * Extracts blockers from high-severity risks
 */
function extractBlockers(option: string, risks: RiskOrBlindSpot[]): string[] {
  return risks
    .filter(
      (risk) =>
        risk.severity === 'High' &&
        risk.description.toLowerCase().includes(option.toLowerCase())
    )
    .map((risk) => risk.description)
}

/**
 * Calculates ROI score for an option (Return on Investment)
 * Formula: (Preference % * 100) / Effort Days
 * Higher ROI = Better investment (more impact per day of effort)
 */
function calculateROIScore(preferencePercentage: number, devEffort: number): number {
  if (devEffort === 0) return 0
  return (preferencePercentage * 100) / devEffort
}

/**
 * Calculates implementation roadmap from survey data
 */
export function calculateImplementationRoadmap(
  input: RoadmapInput
): ImplementationRoadmap {
  const { choice_distribution, decision_factors, risks_and_blindspots, options } = input

  // Calculate ROI scores for each option
  const optionPriorities = options.map((option, index) => {
    // Map option index to choice letter (A, B, C, etc.)
    const choiceKey = String.fromCharCode(65 + index) // A=65, B=66, C=67...
    const choiceStats = choice_distribution.choices[choiceKey]
    const preferencePercentage = choiceStats?.percentage || 0
    
    // Estimate effort based on text complexity (NOT preference)
    const { effort: devEffort, difficulty } = estimateDevEffort(option)
    
    // Calculate ROI score (the "Royal" metric)
    const roiScore = calculateROIScore(preferencePercentage, devEffort)
    
    const dependencies = extractDependencies(option, risks_and_blindspots, options)
    const blockers = extractBlockers(option, risks_and_blindspots)
    
    // Generate rationale from decision factors
    const relevantFactors = decision_factors.filter((factor) =>
      factor.factor.toLowerCase().includes(option.toLowerCase()) ||
      factor.platforms_influenced.some((p) => p.toLowerCase().includes(option.toLowerCase()))
    )
    
    let rationale = ''
    if (relevantFactors.length > 0) {
      rationale = relevantFactors.map((f) => f.factor).join('. ')
    } else if (preferencePercentage === 0) {
      rationale = 'No agent preference detected. Consider revising the option or survey question.'
    } else if (blockers.length > 0) {
      rationale = `Has ${blockers.length} blocker(s) that prevent implementation.`
    } else {
      rationale = `Received ${preferencePercentage.toFixed(1)}% preference from survey responses.`
    }

    return {
      option,
      preferencePercentage,
      devEffort,
      difficulty,
      roiScore,
      dependencies,
      blockers,
      rationale,
    }
  })

  // Sort by ROI score (descending) - higher ROI = better investment
  optionPriorities.sort((a, b) => b.roiScore - a.roiScore)

  // Categorize into phases
  const phase1Options: typeof optionPriorities = []
  const phase2Options: typeof optionPriorities = []
  const phase3Options: typeof optionPriorities = []
  const avoidOptions: typeof optionPriorities = []

  optionPriorities.forEach((opt) => {
    // AVOID: preference < 5% or has high-severity blockers
    if (opt.preferencePercentage < 5 || opt.blockers.length > 0) {
      avoidOptions.push(opt)
    } else if (opt.roiScore > 10 || (opt.preferencePercentage > 40 && opt.difficulty === 'Low')) {
      // PHASE 1: High ROI (>10) OR High preference + Low effort (Quick Wins)
      phase1Options.push(opt)
    } else if (opt.preferencePercentage > 40) {
      // PHASE 2: High preference but lower ROI (Strategic Bets)
      phase2Options.push(opt)
    } else {
      // PHASE 3: Lower preference (Backlog)
      phase3Options.push(opt)
    }
  })

  // Build phases
  const phases: ImplementationPhase[] = []

  if (phase1Options.length > 0) {
    const totalDevEffort = phase1Options.reduce((sum, opt) => sum + opt.devEffort, 0)
    const avgPreference = phase1Options.reduce((sum, opt) => sum + opt.preferencePercentage, 0) / phase1Options.length
    
    phases.push({
      phase: 'PHASE 1: NOW',
      timeline: '0-2 weeks',
      options: phase1Options.map((opt) => ({
        option: opt.option,
        preference_percentage: opt.preferencePercentage,
        dev_effort_days: opt.devEffort,
        difficulty: opt.difficulty,
        roi_score: opt.roiScore,
        rationale: opt.rationale,
        blockers: opt.blockers.length > 0 ? opt.blockers : undefined,
        dependencies: opt.dependencies.length > 0 ? opt.dependencies : undefined,
      })),
      rationale: `High priority options with strong preference (${avgPreference.toFixed(1)}% avg) and immediate value.`,
      dev_effort_days: totalDevEffort,
      preference_percentage: avgPreference,
    })
  }

  if (phase2Options.length > 0) {
    const totalDevEffort = phase2Options.reduce((sum, opt) => sum + opt.devEffort, 0)
    const avgPreference = phase2Options.reduce((sum, opt) => sum + opt.preferencePercentage, 0) / phase2Options.length
    
    phases.push({
      phase: 'PHASE 2: Q2',
      timeline: '6-12 weeks',
      options: phase2Options.map((opt) => ({
        option: opt.option,
        preference_percentage: opt.preferencePercentage,
        dev_effort_days: opt.devEffort,
        difficulty: opt.difficulty,
        roi_score: opt.roiScore,
        rationale: opt.rationale,
        blockers: opt.blockers.length > 0 ? opt.blockers : undefined,
        dependencies: opt.dependencies.length > 0 ? opt.dependencies : undefined,
      })),
      rationale: `Medium priority options with moderate preference (${avgPreference.toFixed(1)}% avg) for Q2 planning.`,
      dev_effort_days: totalDevEffort,
      preference_percentage: avgPreference,
    })
  }

  if (phase3Options.length > 0) {
    const totalDevEffort = phase3Options.reduce((sum, opt) => sum + opt.devEffort, 0)
    const avgPreference = phase3Options.reduce((sum, opt) => sum + opt.preferencePercentage, 0) / phase3Options.length
    
    phases.push({
      phase: 'PHASE 3: BACKLOG',
      timeline: '3+ months',
      options: phase3Options.map((opt) => ({
        option: opt.option,
        preference_percentage: opt.preferencePercentage,
        dev_effort_days: opt.devEffort,
        difficulty: opt.difficulty,
        roi_score: opt.roiScore,
        rationale: opt.rationale,
        blockers: opt.blockers.length > 0 ? opt.blockers : undefined,
        dependencies: opt.dependencies.length > 0 ? opt.dependencies : undefined,
      })),
      rationale: `Lower priority options with limited preference (${avgPreference.toFixed(1)}% avg) for future consideration.`,
      dev_effort_days: totalDevEffort,
      preference_percentage: avgPreference,
    })
  }

  if (avoidOptions.length > 0) {
    const totalDevEffort = avoidOptions.reduce((sum, opt) => sum + opt.devEffort, 0)
    const avgPreference = avoidOptions.reduce((sum, opt) => sum + opt.preferencePercentage, 0) / avoidOptions.length
    const optionsWithBlockers = avoidOptions.filter((opt) => opt.blockers.length > 0)
    
    const skipReasons = optionsWithBlockers
      .map((opt) => `${opt.option}: ${opt.blockers.join('; ')}`)
    
    let avoidRationale = ''
    if (optionsWithBlockers.length === avoidOptions.length) {
      avoidRationale = `All ${avoidOptions.length} option(s) have significant blockers preventing implementation.`
    } else if (avgPreference < 5) {
      avoidRationale = `All options have very low preference (${avgPreference.toFixed(1)}% avg). Consider alternative approaches.`
    } else {
      avoidRationale = `Options with low preference (${avgPreference.toFixed(1)}% avg) or significant blockers.`
    }
    
    phases.push({
      phase: 'AVOID',
      timeline: 'Not recommended',
      options: avoidOptions.map((opt) => ({
        option: opt.option,
        preference_percentage: opt.preferencePercentage,
        dev_effort_days: opt.devEffort,
        difficulty: opt.difficulty,
        roi_score: opt.roiScore,
        rationale: opt.rationale,
        blockers: opt.blockers.length > 0 ? opt.blockers : undefined,
        dependencies: opt.dependencies.length > 0 ? opt.dependencies : undefined,
      })),
      rationale: avoidRationale,
      blockers: skipReasons.length > 0 ? skipReasons : undefined,
      dev_effort_days: totalDevEffort,
      preference_percentage: avgPreference,
    })
  }

  // Calculate totals
  const totalDevEffortDays = phases.reduce((sum, phase) => sum + phase.dev_effort_days, 0)
  
  // Calculate timeline excluding AVOID phase
  const activePhases = phases.filter((p) => p.phase !== 'AVOID')
  let estimatedTotalTimeline = 'N/A'
  if (activePhases.length > 0) {
    if (activePhases.length === 1) {
      estimatedTotalTimeline = activePhases[0].timeline
    } else {
      estimatedTotalTimeline = `${activePhases[0].timeline} - ${activePhases[activePhases.length - 1].timeline}`
    }
  } else if (phases.length > 0 && phases[0].phase === 'AVOID') {
    // Only AVOID phase exists
    estimatedTotalTimeline = 'No recommended timeline'
  }

  const skipReasons = phases
    .find((p) => p.phase === 'AVOID')
    ?.blockers || []

  return {
    phases,
    estimated_total_timeline: estimatedTotalTimeline,
    total_dev_effort_days: totalDevEffortDays,
    skip_reasons: skipReasons.length > 0 ? skipReasons : undefined,
  }
}
