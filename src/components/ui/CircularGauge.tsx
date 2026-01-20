interface CircularGaugeProps {
  value: number // 0-1 for percentage, or actual number for display
  label: string
  color?: string
  size?: number
  strokeWidth?: number
  displayValue?: string | number // Override the displayed value
  isPercentage?: boolean // If false, display as number
  showPercentage?: boolean // Show % symbol
}

export function CircularGauge({
  value,
  label,
  color = '#FF3B00',
  size = 120,
  strokeWidth = 12,
  displayValue,
  isPercentage = true,
  showPercentage = true
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // For percentage display, use value directly; for numbers, calculate percentage from max
  const percentage = isPercentage ? Math.min(value, 1) : Math.min(value / 100, 1)
  const offset = circumference - percentage * circumference

  const displayText = displayValue !== undefined 
    ? String(displayValue)
    : isPercentage 
      ? `${Math.round(value * 100)}${showPercentage ? '%' : ''}`
      : String(value)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${size >= 120 ? 'text-2xl' : 'text-xl'} font-display font-bold text-white`}>
            {displayText}
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase mt-1 text-center px-1">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}
