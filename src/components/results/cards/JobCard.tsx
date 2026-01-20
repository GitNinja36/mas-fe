import type { JobToBeDone } from '../../../types'
import { formatPercentage } from '../utils/formatters'
import { DesiredOutcomeCard } from './DesiredOutcomeCard'
import { FrustrationCard } from './FrustrationCard'
import { Lightbulb } from 'lucide-react'

interface JobCardProps {
  job: JobToBeDone
  index: number
}

const jobBadgeConfig = {
  0: { bg: 'bg-[#FF3B00]/20', text: 'text-[#FF3B00]', label: 'PRIMARY' },
  1: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'SECONDARY' },
  2: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'TERTIARY' },
}

export function JobCard({ job, index }: JobCardProps) {
  const badgeConfig = jobBadgeConfig[index as keyof typeof jobBadgeConfig] || jobBadgeConfig[2]

  return (
    <div className="bg-[#080808] rounded-xl border border-white/10 p-6">
      {/* Job Title & Adoption Rate */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`text-xs font-bold px-2 py-1 rounded-full mb-2 w-fit ${badgeConfig.bg} ${badgeConfig.text}`}>
            {badgeConfig.label}
          </div>
          <h4 className="text-lg font-bold text-white">{job.title}</h4>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#FF3B00]">{formatPercentage(job.adoption, 1)}</div>
          <div className="text-xs text-gray-400">of users</div>
        </div>
      </div>

      {/* Job Description */}
      <p className="text-gray-300 mb-6 italic">&quot;{job.description}&quot;</p>

      {/* Desired Outcomes */}
      {job.desired_outcomes.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-200 mb-3">✓ Desired Outcomes</h5>
          <div className="grid gap-2 md:grid-cols-2">
            {job.desired_outcomes.map((outcome, i) => (
              <DesiredOutcomeCard key={i} outcome={outcome} />
            ))}
          </div>
        </div>
      )}

      {/* Frustration Points */}
      {job.frustrations.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-200 mb-3">✗ Current Frustrations</h5>
          <div className="grid gap-2 md:grid-cols-2">
            {job.frustrations.map((frustration, i) => (
              <FrustrationCard key={i} frustration={frustration} />
            ))}
          </div>
        </div>
      )}

      {/* Design Implications */}
      {job.design_implications.length > 0 && (
        <div className="rounded-lg bg-[#FF3B00]/10 border border-[#FF3B00]/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#FF3B00]" />
            <h5 className="text-sm font-semibold text-[#FF3B00]">Design Implications</h5>
          </div>
          <ul className="space-y-2 text-sm text-gray-200">
            {job.design_implications.map((impl, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#FF3B00]">→</span>
                <span>{impl}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
