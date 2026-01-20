import type { ActionItem } from '../../../types'
import { CheckCircle2, Circle } from 'lucide-react'

interface ActionItemCardProps {
  item: ActionItem
  onToggle: () => void
}

export function ActionItemCard({ item, onToggle }: ActionItemCardProps) {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        item.completed
          ? 'bg-green-500/10 border-green-500/30 opacity-60'
          : 'bg-white/5 border-white/10 hover:border-[#FF3B00]/40 hover:bg-white/10'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-sm text-gray-200 cursor-pointer block leading-relaxed">
            {item.title}
          </label>
          {item.due_date && (
            <div className="text-xs text-gray-500 mt-1 font-mono">Due: {item.due_date}</div>
          )}
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded flex-shrink-0 ${
          item.priority === 'P0' ? 'bg-[#FF3B00]/20 text-[#FF3B00]' :
          item.priority === 'P1' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {item.priority}
        </span>
      </div>
    </div>
  )
}
