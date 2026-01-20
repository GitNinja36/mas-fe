import type { LucideIcon } from 'lucide-react'
import { Users, Globe, Signal, TrendingUp, CheckCircle, Award } from 'lucide-react'

interface WhyWonCardProps {
  title: string
  description: string
  icon?: LucideIcon
}

const iconMap: LucideIcon[] = [Users, Globe, Signal, TrendingUp, CheckCircle, Award]

export function WhyWonCard({ title, description, icon }: WhyWonCardProps) {
  const Icon = icon || iconMap[0]

  return (
    <div className="bg-[#080808] rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300 h-full w-full flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-display font-bold text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1 whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
