import React from 'react'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  current,
  total,
  className = '',
  showLabel = false
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0
  const displayCurrent = Math.min(current, total)

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 font-mono">
            {displayCurrent}/{total}
          </span>
          <span className="text-xs text-orange-400 font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#FF3B00] to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
