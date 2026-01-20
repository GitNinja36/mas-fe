import { useMemo } from 'react'
import type { EnhancedManagerSurveyResponse } from '../../../types'
import { PlatformMessagingCard } from '../cards/PlatformMessagingCard'
import { CampaignTimelineCard } from '../cards/CampaignTimelineCard'
import { AdPreviewCard } from '../cards/AdPreviewCard'
import { calculateCampaignMessaging } from '../utils/campaignMessagingCalculator'
import { Megaphone } from 'lucide-react'

interface CampaignMessagingSectionProps {
  result: EnhancedManagerSurveyResponse
}

export function CampaignMessagingSection({ result }: CampaignMessagingSectionProps) {
  // Use backend data if available, otherwise calculate from survey data
  const campaignMessaging = useMemo(() => {
    if (result.campaign_messaging) {
      return result.campaign_messaging
    }

    // Fallback: calculate from existing data
    return calculateCampaignMessaging({
      agent_responses_grouped: result.agent_responses_grouped,
      choice_distribution: result.choice_distribution,
      decision_factors: result.decision_factors,
      options: result.options,
      confidence_in_recommendation: result.confidence_in_recommendation,
      overall_metrics: result.overall_metrics,
      agent_responses_list: result.agent_responses_list,
      platforms_surveyed: result.platforms_surveyed,
    })
  }, [result])

  if (!campaignMessaging || !campaignMessaging.platform_messaging || Object.keys(campaignMessaging.platform_messaging).length === 0) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <p className="text-sm text-gray-400">No campaign messaging data available</p>
      </div>
    )
  }

  const platforms = Object.values(campaignMessaging.platform_messaging)

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#FF3B00]/10 border border-[#FF3B00]/30 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-[#FF3B00]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">Campaign Messaging Hub</h3>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
              Platform-Specific Messaging Effectiveness
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          Discover which messages resonate on each platform and get ready-to-use ad copy ideas
          tailored to your audience.
        </p>
      </div>

      {/* Platform Messaging - Conditional Layout */}
      <div className="bg-[#080808] rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
          Platform Messaging Effectiveness
        </h3>
        {platforms.length === 1 ? (
          // Full width for 1 platform
          <div className="w-full">
            <PlatformMessagingCard
              key={platforms[0].platform}
              platformMessaging={platforms[0]}
              options={result.options}
            />
          </div>
        ) : platforms.length === 2 ? (
          // Grid layout for 2 cards - each takes 50% width
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <PlatformMessagingCard
                key={platform.platform}
                platformMessaging={platform}
                options={result.options}
              />
            ))}
          </div>
        ) : (
          // Horizontal scroll for more than 2 cards
          <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
            <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
              {platforms.map((platform) => (
                <div key={platform.platform} className="flex-shrink-0 w-[420px]">
                  <PlatformMessagingCard
                    platformMessaging={platform}
                    options={result.options}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Campaign Timeline and Ad Preview - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Timeline - Left Side */}
        <CampaignTimelineCard campaignTimeline={campaignMessaging.campaign_timeline} />

        {/* Ad Preview - Right Side */}
        <AdPreviewCard campaignMessaging={campaignMessaging} result={result} />
      </div>
    </div>
  )
}
