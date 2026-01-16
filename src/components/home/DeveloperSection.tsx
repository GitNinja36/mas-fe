import { useState, useEffect } from 'react'

// Animated Number Counter
function AnimatedNumber({ target, duration = 1000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  
  useEffect(() => {
    setValue(0)
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])
  
  return <span>{target % 1 === 0 ? Math.floor(value) : value.toFixed(1)}{suffix}</span>
}

// Dynamic Comparison Bar
function ComparisonBar({ value, color = 'orange' }: { value: number; color?: 'orange' | 'gray' }) {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    setWidth(0)
    const timeout = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(timeout)
  }, [value])
  
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          color === 'orange' 
            ? 'bg-gradient-to-r from-[#FF3B00] to-yellow-500' 
            : 'bg-gray-500'
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// Cycling Cohort Animation
function CyclingCohort() {
  const cohorts = ['Tech Founders', 'Gen-Z Users', 'Enterprise CTOs', 'Startup PMs', 'Data Scientists']
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex(prev => (prev + 1) % cohorts.length)
        setFade(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <span className={`text-xs text-purple-400 font-mono transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {cohorts[index]}
    </span>
  )
}

// Pulsing Dot Indicator (right to left glow)
function PulsingDots({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: max }).map((_, i) => {
        const isActive = i >= (max - count) // Glow from right to left
        return (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              isActive 
                ? 'bg-[#FF3B00] shadow-[0_0_10px_rgba(255,59,0,0.6)] scale-110' 
                : 'bg-white/20 scale-100'
            }`}
            style={{ 
              animationDelay: `${(max - 1 - i) * 100}ms`,
              animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          />
        )
      })}
    </div>
  )
}

export function DeveloperSection() {
  const [selectedMode, setSelectedMode] = useState<'quick' | 'standard' | '5x'>('quick')
  
  const modes = [
    { id: 'quick' as const, name: 'QUICK', agents: 1, accuracy: 67, desc: 'Fast results' },
    { id: 'standard' as const, name: 'STANDARD', agents: 3, accuracy: 85, desc: 'Balanced' },
    { id: '5x' as const, name: 'PRO', agents: 5, accuracy: 98, desc: 'Deep insights' },
  ]
  
  // Auto-cycle through modes: QUICK → STANDARD → PRO → repeat
  useEffect(() => {
    const modeOrder: ('quick' | 'standard' | '5x')[] = ['quick', 'standard', '5x']
    let currentIndex = 0
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % modeOrder.length
      setSelectedMode(modeOrder[currentIndex])
    }, 3000) // 3 second delay
    
    return () => clearInterval(interval)
  }, [])
  
  const currentMode = modes.find(m => m.id === selectedMode)!
  const improvement = currentMode.accuracy - 67
  
  return (
    <section id="developers" className="py-24 bg-[#050505] border-t relative z-20 border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div>
          <span className="text-[#FF3B00] font-mono text-xs tracking-widest block mb-4">
            /// AGENT EXPERIENCE
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
            Built for Precision Sampling
          </h2>
          <p className="text-lg mb-8 leading-relaxed text-gray-400">
            No more guess work. Try different modes to pick how many AI twins to sample per question, balancing speed, confidence, accuracy with depth in a click.
          </p>

          {/* Agent Modes */}
          <div className="space-y-6">
            {/* Single Agent Mode */}
            <div className="group flex gap-4 p-4 border border-transparent rounded-lg transition-all cursor-pointer hover:border-white/10">
              <div className="font-mono text-sm group-hover:text-[#FF3B00] text-gray-600">01</div>
              <div>
                <h4 className="font-bold text-white">Single Agent Mode (1x)</h4>
                <p className="text-sm text-gray-500">
                  Run a fast sanity check with one highly aligned AI twin per question perfect for quick validation and copy tweaks.
                </p>
              </div>
            </div>

            {/* Panel Mode */}
            <div className="group flex gap-4 p-4 border border-transparent rounded-lg transition-all cursor-pointer hover:border-white/10">
              <div className="font-mono text-sm group-hover:text-[#FF3B00] text-gray-600">02</div>
              <div>
                <h4 className="font-bold text-white">Panel Mode (3x)</h4>
                <p className="text-sm text-gray-500">
                  Sample three distinct personas per question to see where opinions converge or diverge across your target cohort.
                </p>
              </div>
            </div>

            {/* Swarm Mode */}
            <div className="group flex gap-4 p-4 border border-transparent rounded-lg transition-all cursor-pointer hover:border-white/10">
              <div className="font-mono text-sm group-hover:text-[#FF3B00] text-gray-600">03</div>
              <div>
                <h4 className="font-bold text-white">Swarm Mode (5x)</h4>
                <p className="text-sm text-gray-500">
                  Spin up a small "mini-market" of AI agents, stress-testing each option with rich reasoning, confidence scores, and decision factors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Agent Mode Configuration Panel */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B00] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 to-purple-600" />
          <div className="relative bg-[#0a0a0a] border rounded-lg p-6 shadow-2xl overflow-hidden border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-white/5">
              <span className="text-white font-mono text-sm">AGENT CONFIGURATION</span>
              <span className="text-[#FF3B00] text-xs font-mono border border-[#FF3B00]/30 px-2 py-0.5 rounded animate-pulse">LIVE</span>
            </div>

            {/* Mode Selector Cards */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`relative p-3 rounded-lg border transition-all duration-300 text-center ${
                    selectedMode === mode.id 
                      ? 'border-[#FF3B00] bg-[#FF3B00]/10 scale-105' 
                      : 'border-white/10 hover:border-white/30 bg-white/5 hover:scale-102'
                  }`}
                >
                  <div className={`font-mono text-xs font-bold mb-1 transition-colors duration-300 ${selectedMode === mode.id ? 'text-[#FF3B00]' : 'text-white'}`}>
                    {mode.name}
                  </div>
                  <div className="text-[10px] text-gray-500">{mode.agents} Agent{mode.agents > 1 ? 's' : ''}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{mode.desc}</div>
                  <div className={`text-xs mt-2 font-mono transition-colors duration-300 ${selectedMode === mode.id ? 'text-green-400' : 'text-gray-500'}`}>
                    {mode.accuracy}%
                  </div>
                </button>
              ))}
            </div>

            {/* Live Configuration Preview */}
            <div className="bg-black/50 rounded-lg p-4 mb-6 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-500 font-mono">LIVE CONFIGURATION</span>
              </div>
              
              {/* Agent Count - Dynamic based on mode */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">Agent Count</span>
                <div className="flex items-center gap-3">
                  <PulsingDots count={currentMode.agents} max={5} />
                  <span className="text-xs text-[#FF3B00] font-mono font-bold">{currentMode.agents}/5</span>
                </div>
              </div>
              
              {/* Depth Toggle - Dynamic */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">Depth</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded transition-all duration-300 ${
                  selectedMode === '5x' 
                    ? 'text-[#FF3B00] bg-[#FF3B00]/20 border border-[#FF3B00]/30' 
                    : selectedMode === 'standard' 
                      ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' 
                      : 'text-gray-400 bg-white/5 border border-white/10'
                }`}>
                  {selectedMode === '5x' ? 'Deep Analysis' : selectedMode === 'standard' ? 'Standard' : 'Quick Scan'}
                </span>
              </div>
              
              {/* Cohort - Cycling Animation */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Cohort</span>
                <CyclingCohort />
              </div>
            </div>

            {/* Quality Score - Dynamic */}
            <div className="text-center mb-6 py-4 bg-gradient-to-r from-[#FF3B00]/5 to-purple-500/5 rounded-lg border border-white/5">
              <div className="text-[10px] text-gray-500 font-mono mb-1">ESTIMATED QUALITY SCORE</div>
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber target={currentMode.accuracy} key={selectedMode} suffix="%" />
              </div>
            </div>

            {/* Confidence Comparison - Fully Dynamic */}
            <div className="space-y-3">
              <div className="text-[10px] text-gray-500 font-mono mb-2">CONFIDENCE COMPARISON</div>
              
              {/* Baseline (Quick Mode) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Baseline (Quick)</span>
                  <span className="text-gray-400 font-mono">67%</span>
                </div>
                <ComparisonBar value={67} color="gray" />
              </div>
              
              {/* Selected Mode - Dynamic */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#FF3B00]">{currentMode.name} Mode</span>
                  <span className="text-green-400 font-mono">
                    <AnimatedNumber target={currentMode.accuracy} key={`acc-${selectedMode}`} suffix="%" />
                  </span>
                </div>
                <ComparisonBar value={currentMode.accuracy} color="orange" key={`bar-${selectedMode}`} />
              </div>
              
              {/* Dynamic Improvement Badge */}
              <div className="text-center mt-4">
                <span className={`text-xs font-mono px-3 py-1 rounded-full transition-all duration-500 ${
                  improvement > 20 
                    ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                    : improvement > 10 
                      ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' 
                      : 'text-gray-400 bg-white/5 border border-white/10'
                }`}>
                  +<AnimatedNumber target={improvement} key={`imp-${selectedMode}`} suffix="%" /> improvement
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
