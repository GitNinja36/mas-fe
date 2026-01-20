import type { EnhancedManagerSurveyResponse } from '../../../types'
import { getPlatformColor } from '../utils/colorMap'
import { ImplementationRoadmapSection } from '../sections/ImplementationRoadmapSection'
import { CampaignMessagingSection } from '../sections/CampaignMessagingSection'

interface MethodologyTabProps {
  result: EnhancedManagerSurveyResponse
}

export function MethodologyTab({ result }: MethodologyTabProps) {
  const { methodology, platforms_surveyed } = result

  if (!methodology) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <p className="text-sm text-gray-400">No methodology data available</p>
      </div>
    )
  }

  const platforms = platforms_surveyed || []

  return (
    <div className="space-y-6">
    {/* Campaign Messaging Hub */}
    <CampaignMessagingSection result={result} />

    
      {/* Implementation Roadmap */}
      <ImplementationRoadmapSection result={result} />


      {/* Platform Coverage */}
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
          Platform Coverage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {platforms.map((platform) => {
            const agentCount = methodology.agents_per_platform[platform] || 0
            const platformColor = getPlatformColor(platform)
            return (
              <div
                key={platform}
                className="bg-[#0a0a0a] rounded-xl border border-white/5 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platformColor }}
                  />
                  <span className="text-sm font-medium text-white capitalize">
                    {platform.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {agentCount} agents
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
          Total platforms surveyed: {platforms.length}
        </div>
      </div>

    </div>
  )
}
