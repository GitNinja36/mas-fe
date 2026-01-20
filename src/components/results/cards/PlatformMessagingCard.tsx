import { useState } from 'react'
import type { PlatformMessaging } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { getPlatformColor } from '../utils/colorMap'
import { getPlatformLogoUrl } from '../utils/platformLogos'
import { Lightbulb, Copy } from 'lucide-react'

interface PlatformMessagingCardProps {
  platformMessaging: PlatformMessaging
  options: string[]
}

export function PlatformMessagingCard({ platformMessaging, options }: PlatformMessagingCardProps) {
  const platformColor = getPlatformColor(platformMessaging.platform)
  const platformName = platformMessaging.platform.replace(/_/g, ' ')
  const platformLogoUrl = getPlatformLogoUrl(platformMessaging.platform)
  const [imageError, setImageError] = useState(false)

  // Get winning option (highest percentage)
  const winningEntry = Object.entries(platformMessaging.effectiveness).sort(
    ([, a], [, b]) => b.percentage - a.percentage
  )[0]

  return (
    <div className="bg-[#080808] rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 flex flex-col min-h-[600px]">
      {/* Platform Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
        {platformLogoUrl && !imageError ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <img
              src={platformLogoUrl}
              alt={platformName}
              className="w-8 h-8 object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ backgroundColor: platformColor }}
          >
            {platformName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-semibold text-gray-100 capitalize text-base">{platformName}</span>
      </div>

      {/* Option Effectiveness Bars */}
      <div className="space-y-3 mb-4 flex-1">
        {Object.entries(platformMessaging.effectiveness)
          .sort(([, a], [, b]) => b.percentage - a.percentage)
          .map(([choiceLetter, effectiveness]) => {
            const optionIndex = choiceLetter.charCodeAt(0) - 65
            const option = options[optionIndex] || `Option ${choiceLetter}`
            const isWinning = winningEntry && choiceLetter === winningEntry[0]

            return (
              <div key={choiceLetter} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 line-clamp-1">{option}</span>
                  <span className={`text-sm font-bold flex-shrink-0 ml-2 ${isWinning ? 'text-[#FF3B00]' : 'text-gray-500'}`}>
                    {formatPercentage(effectiveness.percentage, 1)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinning
                        ? 'bg-gradient-to-r from-[#FF3B00] to-yellow-500'
                        : 'bg-gradient-to-r from-gray-600 to-gray-500'
                    }`}
                    style={{ width: `${effectiveness.percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
      </div>

      {/* Recommended Message */}
      <div className="rounded-lg bg-[#FF3B00]/10 border border-[#FF3B00]/30 p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-[#FF3B00]" />
          <span className="text-xs font-semibold text-[#FF3B00]">Top Message</span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">
          {platformMessaging.recommended_message}
        </p>
      </div>

      {/* Ad Copy Ideas */}
      {winningEntry && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Copy className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400">Ad Copy Ideas</span>
          </div>
          <div className="space-y-2">
            {platformMessaging.effectiveness[winningEntry[0]]?.ad_copy_ideas.map((copy, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-300 bg-white/5 p-2 rounded border border-white/5 cursor-pointer hover:border-[#FF3B00]/40 hover:bg-white/10 transition-all duration-200"
              >
                &quot;{copy}&quot;
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
