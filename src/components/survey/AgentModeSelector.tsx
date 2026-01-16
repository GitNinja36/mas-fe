import { Zap, Users, Layers } from 'lucide-react'
import type { AgentMode } from '../../types'

interface AgentModeSelectorProps {
  agentMode: AgentMode
  onModeChange: (mode: AgentMode) => void
  disabled?: boolean
}

export function AgentModeSelector({ agentMode, onModeChange, disabled = false }: AgentModeSelectorProps) {
  const modes: { value: AgentMode; label: string; description: string; icon: typeof Zap; agents: number }[] = [
    {
      value: '1x',
      label: 'Quick',
      description: 'Single agent, fastest response',
      icon: Zap,
      agents: 1,
    },
    {
      value: '3x',
      label: 'Standard',
      description: 'Balanced speed and depth',
      icon: Users,
      agents: 3,
    },
    {
      value: '5x',
      label: 'Pro',
      description: 'Deep insights, all platforms',
      icon: Layers,
      agents: 5,
    }
  ]

  const currentMode = modes.find((m) => m.value === agentMode)

  return (
    <div className="space-y-3">
      <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">
        Agent Mode
      </label>
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = agentMode === mode.value
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => !disabled && onModeChange(mode.value)}
              disabled={disabled}
              className={`relative p-4 rounded-xl text-center transition-all duration-300 border ${
                isActive
                  ? 'bg-[#FF3B00]/10 border-[#FF3B00] scale-[1.02]'
                  : disabled
                  ? 'bg-white/5 border-white/10 opacity-50'
                  : 'bg-white/5 border-white/10 hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/5'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 transition-colors ${isActive ? 'text-[#FF3B00]' : 'text-gray-500'}`} />
              <div className={`text-lg font-bold font-mono transition-colors ${isActive ? 'text-[#FF3B00]' : 'text-white'}`}>
                {mode.value}
              </div>
              <div className={`text-[10px] font-mono mt-1 transition-colors ${isActive ? 'text-[#FF3B00]/80' : 'text-gray-500'}`}>
                {mode.label}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                {mode.agents} Agent{mode.agents > 1 ? 's' : ''}
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Description */}
      <div className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded-xl border border-white/5">
        <div className={`w-2 h-2 rounded-full ${agentMode === '5x' ? 'bg-green-500' : agentMode === '3x' ? 'bg-yellow-500' : 'bg-gray-500'} animate-pulse`} />
        <span className="text-xs text-gray-400 font-mono">{currentMode?.description}</span>
      </div>
    </div>
  )
}
