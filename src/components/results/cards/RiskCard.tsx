import type { RiskOrBlindSpot } from '../../../types'
import { AlertTriangle, ShieldAlert, AlertCircle } from 'lucide-react'

interface RiskCardProps {
  risk: RiskOrBlindSpot
}

const iconMap = [AlertTriangle, ShieldAlert, AlertCircle]

export function RiskCard({ risk }: RiskCardProps) {
  const Icon = iconMap[risk.severity.length % iconMap.length] || AlertTriangle

  return (
    <div className="bg-[#080808] rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-display font-bold text-white mb-2 line-clamp-2">
            {risk.risk_type || risk.description}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
            {risk.mitigation || risk.description}
          </p>
        </div>
      </div>
    </div>
  )
}
