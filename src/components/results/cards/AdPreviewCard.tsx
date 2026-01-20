import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import type { CampaignMessaging, EnhancedManagerSurveyResponse } from '../../../types'

interface AdPreviewCardProps {
  campaignMessaging: CampaignMessaging
  result: EnhancedManagerSurveyResponse
}

type ToneType = 'FORMAL' | 'CASUAL' | 'URGENT'

const platformIcons: Record<string, { icon: string; color: string; name: string }> = {
  linkedin: { icon: 'in', color: 'bg-blue-600', name: 'LinkedIn' },
  twitter: { icon: '𝕏', color: 'bg-black', name: 'Twitter' },
  tiktok: { icon: '♪', color: 'bg-black', name: 'TikTok' },
  instagram: { icon: '📷', color: 'bg-gradient-to-br from-purple-600 to-pink-600', name: 'Instagram' },
  youtube: { icon: '▶', color: 'bg-red-600', name: 'YouTube' },
  email: { icon: '✉', color: 'bg-gray-600', name: 'Email' },
}

function getPlatformFromMessaging(campaignMessaging: CampaignMessaging): string {
  if (!campaignMessaging.platform_messaging) return 'linkedin'
  const platforms = Object.keys(campaignMessaging.platform_messaging)
  if (platforms.length === 0) return 'linkedin'
  
  // Find platform with highest effectiveness
  let topPlatform = platforms[0]
  let topScore = 0
  
  platforms.forEach(platform => {
    const messaging = campaignMessaging.platform_messaging[platform]
    const effectiveness = Object.values(messaging.effectiveness)
    const maxPercentage = Math.max(...effectiveness.map(e => e.percentage))
    if (maxPercentage > topScore) {
      topScore = maxPercentage
      topPlatform = platform
    }
  })
  
  return topPlatform.toLowerCase()
}

function generateAdCopy(
  tone: ToneType,
  campaignMessaging: CampaignMessaging,
  result: EnhancedManagerSurveyResponse
): string {
  if (!campaignMessaging.platform_messaging) {
    return 'No messaging data available'
  }
  
  const platform = getPlatformFromMessaging(campaignMessaging)
  const platformMessaging = campaignMessaging.platform_messaging[platform] || Object.values(campaignMessaging.platform_messaging)[0]
  
  if (!platformMessaging) {
    return 'No messaging data available'
  }

  const winningChoice = result.choice_distribution.winning_choice
  const winningPercentage = result.choice_distribution.winning_percentage
  const optionIndex = winningChoice.charCodeAt(0) - 65
  const winningOption = result.options[optionIndex] || winningChoice
  
  // Extract benefit from reasoning
  const allReasoning = Object.values(result.agent_responses_grouped)
    .flatMap(group => group.responses || [])
    .filter(r => r.choice === winningChoice)
    .map(r => r.reasoning)
    .join(' ')
  
  // Simple benefit extraction
  const benefitMatch = allReasoning.match(/(?:because|since|as|enables|allows|helps|provides|offers|delivers)[^.!?]{0,80}/i)
  const extractedBenefit = benefitMatch 
    ? benefitMatch[0].replace(/^(because|since|as|enables|allows|helps|provides|offers|delivers)\s+/i, '').trim()
    : 'delivers results'
  
  // Generate platform-specific hashtag
  const platformLower = platform.toLowerCase()
  const hashtag = platformLower.includes('linkedin') ? 'Productivity' :
                   platformLower.includes('tiktok') ? 'Trending' :
                   platformLower.includes('twitter') ? 'Innovation' :
                   platformLower.includes('instagram') ? 'Lifestyle' : 'Productivity'

  if (tone === 'FORMAL') {
    return `Data shows that ${winningPercentage.toFixed(0)}% of professionals prefer ${winningOption}.\n\nWhy? Because it ${extractedBenefit} unlike the alternatives.\n\nDon't settle for less. #${hashtag} #${winningOption.replace(/\s+/g, '')}`
  } else if (tone === 'CASUAL') {
    return `Simple, effective, just ${extractedBenefit}.\n\n${winningPercentage.toFixed(0)}% of people are choosing ${winningOption} for a reason. Join them! 🔥\n\n#${hashtag} #${winningOption.replace(/\s+/g, '')}`
  } else {
    return `Limited time - ${winningOption} is the clear winner.\n\n${winningPercentage.toFixed(0)}% of users prefer it because it ${extractedBenefit}.\n\nAct now before you miss out! ⚡\n\n#${hashtag} #${winningOption.replace(/\s+/g, '')}`
  }
}

export function AdPreviewCard({ campaignMessaging, result }: AdPreviewCardProps) {
  const [selectedTone, setSelectedTone] = useState<ToneType>('FORMAL')
  const [copied, setCopied] = useState(false)
  
  const platform = getPlatformFromMessaging(campaignMessaging)
  const platformInfo = platformIcons[platform] || { icon: '📱', color: 'bg-gray-600', name: platform }
  const adCopy = generateAdCopy(selectedTone, campaignMessaging, result)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(adCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    // Cycle through tones
    const tones: ToneType[] = ['FORMAL', 'CASUAL', 'URGENT']
    const currentIndex = tones.indexOf(selectedTone)
    setSelectedTone(tones[(currentIndex + 1) % tones.length])
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-white font-bold mb-2">
        📢 Winning Ad Copy
      </h3>
      <p className="text-xs font-normal text-gray-500 mb-6">
        Generated from user reasoning
      </p>

      {/* The Preview Card */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden flex-1 flex flex-col">
        {/* Fake Platform Header */}
        <div className="bg-[#222] p-3 flex items-center gap-2 border-b border-white/5">
          <div className={`w-6 h-6 rounded ${platformInfo.color} flex items-center justify-center text-[10px] text-white font-bold`}>
            {platformInfo.icon}
          </div>
          <span className="text-xs text-gray-400">
            Previewing: <span className="text-white font-bold">{platformInfo.name} / {selectedTone}</span>
          </span>
        </div>

        {/* The Content */}
        <div className="p-6 flex-1 flex items-center">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {adCopy}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#111] p-3 border-t border-white/5 flex justify-end gap-2">
          <button
            onClick={handleRegenerate}
            className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} /> Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="text-xs bg-white text-black font-bold px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1 transition-colors"
          >
            <Copy size={12} /> {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
      
      {/* Variation Selector Pills */}
      <div className="flex gap-2 mt-4">
        {(['FORMAL', 'CASUAL', 'URGENT'] as ToneType[]).map((tone) => (
          <button
            key={tone}
            onClick={() => setSelectedTone(tone)}
            className={`px-3 py-1 rounded-full border text-xs transition-colors ${
              selectedTone === tone
                ? 'border-[#FF3B00] text-[#FF3B00] bg-[#FF3B00]/10'
                : 'border-white/10 text-gray-400 hover:border-[#FF3B00]/50'
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  )
}
