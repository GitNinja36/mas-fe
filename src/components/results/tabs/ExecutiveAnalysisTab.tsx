import type { EnhancedManagerSurveyResponse } from '../../../types'
import { RecommendedDirectionCard } from '../cards/RecommendedDirectionCard'
import { ChoiceLandscapeCard } from '../cards/ChoiceLandscapeCard'
import { WhyWonCard } from '../cards/WhyWonCard'
import { PanelReasoningCard } from '../cards/PanelReasoningCard'
import { InsightCard } from '../cards/InsightCard'
import { RiskCard } from '../cards/RiskCard'

interface ExecutiveAnalysisTabProps {
  result: EnhancedManagerSurveyResponse
}

export function ExecutiveAnalysisTab({ result }: ExecutiveAnalysisTabProps) {
  const {
    overall_metrics,
    choice_distribution,
    executive_summary,
    key_findings,
    recommended_direction,
    confidence_in_recommendation,
    synthesized_insights,
    agent_responses_list,
    methodology,
    platforms_surveyed,
    total_responses,
    risks_and_blindspots,
    decision_factors,
    differentiation_factors
  } = result

  // Safe defaults for missing data
  const responseAgreement = overall_metrics?.response_agreement ?? 0
  const averageConfidence = overall_metrics?.average_confidence ?? 0
  const confidenceInRec = confidence_in_recommendation ?? 0

  // Prepare Decision Factors data - show what factors influenced the decision
  const decisionFactorsData = decision_factors && decision_factors.length > 0
    ? decision_factors
        .sort((a, b) => b.impact_score - a.impact_score)
        .slice(0, 3)
        .map(factor => ({
          title: factor.factor,
          description: `Mentioned by ${factor.agent_mentions} agent${factor.agent_mentions !== 1 ? 's' : ''}${factor.platforms_influenced.length > 0 ? `\nPlatforms: ${factor.platforms_influenced.join(', ')}` : ''}`
        }))
    : differentiation_factors && differentiation_factors.length > 0
    ? differentiation_factors.slice(0, 3).map((factor) => ({
        title: factor,
        description: `Key differentiating factor for the winning choice`
      }))
    : key_findings && key_findings.length > 0
    ? key_findings.slice(0, 3).map((finding, idx) => ({
        title: `Key Finding ${idx + 1}`,
        description: finding
      }))
    : []

  // Filter out consensus-related synthesized insights (redundant)
  const filteredInsights = synthesized_insights?.filter(insight => {
    const title = insight.title.toLowerCase()
    const description = insight.description.toLowerCase()
    return !title.includes('consensus') && 
           !title.includes('strong') && 
           !description.includes('achieved') && 
           !description.includes('% of votes')
  }) || []

  // Get all agent responses for panel reasoning
  const agentSamples = agent_responses_list || []

  return (
    <div className="space-y-8 p-3">
      {/* 1. Recommended Direction - Full Width, Prominent */}
      {recommended_direction && (
        <RecommendedDirectionCard
          recommendedDirection={recommended_direction}
          confidenceInRecommendation={confidenceInRec}
          responseAgreement={responseAgreement}
          averageConfidence={averageConfidence}
        />
      )}

      {/* 2. Choice Landscape - Two Column Layout */}
      {choice_distribution && (
        <ChoiceLandscapeCard
          choiceDistribution={choice_distribution}
          options={result.options || []}
          overallMetrics={overall_metrics}
          methodology={methodology}
          platformsSurveyed={platforms_surveyed || []}
          totalResponses={total_responses}
          competitiveAnalysis={result.competitive_analysis}
        />
      )}

      {/* 3. Decision Factors & Synthesized Insights & Risks */}
      {(decisionFactorsData.length > 0 || filteredInsights.length > 0 || (risks_and_blindspots && risks_and_blindspots.length > 0)) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-white">
              Insights & Analysis
          </h3>
          </div>
          <div className="overflow-x-auto pb-2 -mx-2 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 min-w-max items-stretch">
              {/* Decision Factors Cards */}
              {decisionFactorsData.map((item, idx) => (
                <div key={`decision-factor-${idx}`} className="flex-shrink-0 w-80 flex">
              <WhyWonCard
                title={item.title}
                description={item.description}
              />
                </div>
              ))}
              {/* Synthesized Insights Cards */}
              {filteredInsights.map((insight, idx) => (
                <div key={`insight-${idx}`} className="flex-shrink-0 w-80 flex">
                  <InsightCard insight={insight} />
                </div>
              ))}
              {/* Risks & Blind Spots Cards */}
              {risks_and_blindspots && risks_and_blindspots.map((risk, idx) => (
                <div key={`risk-${idx}`} className="flex-shrink-0 w-80 flex">
                  <RiskCard risk={risk} />
                </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. How the Panel Reasoned - Full Width */}
      {(executive_summary || agentSamples.length > 0) && (
        <PanelReasoningCard
          synthesizedSummary={executive_summary || synthesized_insights?.[0]?.description || ''}
          agentSamples={agentSamples}
        />
      )}
    </div>
  )
}
