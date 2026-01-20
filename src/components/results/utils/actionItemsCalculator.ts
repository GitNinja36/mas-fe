/**
 * Action items calculation utility
 * Generates actionable items and talk track from survey results
 */

import type {
  ChoiceDistribution,
  ImplementationRoadmap,
  ActionItemsData,
  ActionItem,
} from '../../../types'

interface ActionItemsInput {
  recommended_direction: string
  key_findings: string[]
  implementation_roadmap?: ImplementationRoadmap
  choice_distribution: ChoiceDistribution
}

/**
 * Generates action items from survey results
 */
function generateActionItems(
  input: ActionItemsInput
): ActionItem[] {
  const { recommended_direction, key_findings, implementation_roadmap, choice_distribution } = input

  const items: ActionItem[] = []

  // P0: Start development on winning option
  const winningChoice = choice_distribution.winning_choice
  const winningOption = winningChoice
    ? `Option ${winningChoice}`
    : recommended_direction.split(':')[0] || 'Winning option'

  if (implementation_roadmap) {
    const phase1 = implementation_roadmap.phases.find((p) => p.phase === 'PHASE 1: NOW')
    if (phase1 && phase1.options.length > 0) {
      const firstOption = phase1.options[0]
      items.push({
        title: `Start development on ${firstOption.option}`,
        completed: false,
        priority: 'P0',
        due_date: 'Next week',
      })
    }
  } else {
    items.push({
      title: `Start development on ${winningOption}`,
      completed: false,
      priority: 'P0',
      due_date: 'Next week',
    })
  }

  // P1: Schedule user interviews
  const runnerUp = choice_distribution.runner_up
  if (runnerUp) {
    items.push({
      title: `Schedule user interviews with ${runnerUp} group`,
      completed: false,
      priority: 'P1',
      due_date: 'Within 2 weeks',
    })
  }

  // P1: Test with real users
  items.push({
    title: 'Test with 50 real users next week',
    completed: false,
    priority: 'P1',
    due_date: 'Next week',
  })

  // P2: Review key findings
  if (key_findings.length > 0) {
    items.push({
      title: `Review and validate: ${key_findings[0]}`,
      completed: false,
      priority: 'P2',
    })
  }

  // P2: Plan implementation phases
  if (implementation_roadmap && implementation_roadmap.phases.length > 1) {
    items.push({
      title: 'Plan Q2 implementation phases',
      completed: false,
      priority: 'P2',
      due_date: 'Within 1 month',
    })
  }

  return items
}

/**
 * Generates talk track for stakeholders
 */
function generateTalkTrack(input: ActionItemsInput): {
  what_won: string
  why_it_won: string[]
  next_step: string
} {
  const { recommended_direction, key_findings } = input

  const whatWon = recommended_direction || 'The survey identified a clear winner'
  const whyItWon = key_findings.length > 0 ? key_findings.slice(0, 3) : ['Strong preference from survey responses']
  const nextStep = "Let's start development next week"

  return {
    what_won: whatWon,
    why_it_won: whyItWon,
    next_step: nextStep,
  }
}

/**
 * Calculates action items data
 */
export function calculateActionItems(input: ActionItemsInput): ActionItemsData {
  const items = generateActionItems(input)
  const talkTrack = generateTalkTrack(input)

  return {
    items,
    talk_track: talkTrack,
  }
}
