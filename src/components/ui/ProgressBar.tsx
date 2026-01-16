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
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">
            Processing {current + 1}/{total}
          </span>
          <span className="text-xs text-orange-400 font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
