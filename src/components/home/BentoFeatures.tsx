import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../../assets/loading.json'

// Pulsing Lock Icon with Glow Effect
function PulsingLockIcon() {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full bg-[#FF3B00]/20 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute inset-0 rounded-full bg-[#FF3B00]/10 animate-pulse" style={{ animationDuration: '1.5s' }} />
      
      {/* Lock icon */}
      <div className="relative z-10">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-[#FF3B00] drop-shadow-[0_0_8px_rgba(255,59,0,0.9)]"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
    </div>
  )
}

// Animated Bars for Throughput
function AnimatedBars() {
  const [heights, setHeights] = useState([40, 60, 30, 80, 50])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(prev => prev.map(() => Math.floor(Math.random() * 60) + 20))
    }, 1500)
    return () => clearInterval(interval)
  }, [])
  
  const opacities = [0.2, 0.4, 0.6, 0.8, 1]
  
  return (
    <div className="w-full h-16 rounded flex items-end px-1 gap-1 bg-white/10">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1/5 rounded-sm transition-all duration-1000 ease-in-out"
          style={{
            height: `${h}%`,
            backgroundColor: `rgba(255, 59, 0, ${opacities[i]})`
          }}
        />
      ))}
    </div>
  )
}

// Typewriter for Quality Shield
function TypewriterText() {
  const lines = [
    '> VALIDATING...',
    '> BIAS CHECK: PASS',
    '> CONSISTENCY: 98.2%'
  ]
  const [displayedLines, setDisplayedLines] = useState<string[]>(['', '', ''])
  
  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    
    const typeChar = () => {
      if (lineIndex >= lines.length) {
        // Reset after pause
        setTimeout(() => {
          setDisplayedLines(['', '', ''])
          lineIndex = 0
          charIndex = 0
          setTimeout(typeChar, 500)
        }, 3000)
        return
      }
      
      const currentLine = lines[lineIndex]
      if (charIndex <= currentLine.length) {
        setDisplayedLines(prev => {
          const newLines = [...prev]
          newLines[lineIndex] = currentLine.slice(0, charIndex)
          return newLines
        })
        charIndex++
        setTimeout(typeChar, 50)
      } else {
        lineIndex++
        charIndex = 0
        setTimeout(typeChar, 300)
      }
    }
    
    typeChar()
  }, [])
  
  return (
    <div className="font-mono text-[10px] text-green-300/70">
      {displayedLines.map((line, i) => (
        <div key={i} className="h-4">{line}<span className="animate-pulse">|</span></div>
      ))}
    </div>
  )
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let animationId: number
    let timeoutId: ReturnType<typeof setTimeout>
    
    const runAnimation = () => {
      const duration = 5000        // ← TIMER: Total animation duration (ms)
      const pauseDuration = 2000   // ← PAUSE: Wait time at target before restart
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Linear progress to ensure we reach exactly target
        const current = progress * target
        setCount(current)
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        } else {
          // Ensure we're exactly at target
          setCount(target)
          // Pause at target, then restart
          timeoutId = setTimeout(() => {
            setCount(0)
            timeoutId = setTimeout(runAnimation, 300)
          }, pauseDuration)
        }
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    runAnimation()
    
    return () => {
      cancelAnimationFrame(animationId)
      clearTimeout(timeoutId)
    }
  }, [target])
  
  return (
    <div className="text-2xl font-display font-bold text-white z-10 transition-opacity duration-300">
      {count.toFixed(1)}
    </div>
  )
}

export function BentoFeatures() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const cards = containerRef.current?.querySelectorAll('.spotlight-card')
      cards?.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section id="features" className="py-32 px-6 relative z-20" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b pb-8 border-white/10">
          <div>
            <span className="text-[#FF3B00] font-mono text-xs tracking-widest block mb-2">
              /// CORE
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Survey Intelligence
            </h2>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
              <span className="font-mono text-xs text-white">AGENTS: ACTIVE 24/7</span>
            </div>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              AI Twins Online: +100k
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* AI Twin Engine - Large Card */}
          <div className="md:col-span-2 md:row-span-2 glass-panel spotlight-card rounded-xl overflow-hidden relative group">
            <div className="scan-line" />
            <img
              src="https://res.cloudinary.com/davtv5r1c/image/upload/v1768241001/image_p5pius.jpg"
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"
              alt="AI Twin"
            />
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-black" />
            <div className="absolute top-6 right-6 border px-3 py-1 rounded text-[10px] font-mono text-accent border-white/20 bg-black/50 text-[#FF3B00]">
              PROCESSING_PERSONA_04
            </div>
            <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
              <div className="w-10 h-10 bg-[#FF3B00] flex items-center justify-center mb-4 font-bold text-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z" />
                  <circle cx="12" cy="6" r="2" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2 text-white">AI Twin Synthesis</h3>
              <p className="text-sm max-w-sm text-gray-300">
              Individual AI twin personas fetching on-demand data streams from users across verified self-attested data from 20+ apps, personal interactions, opinions and behavioral signals.
              </p>
            </div>
          </div>

          {/* Response Rate */}
          <div className="md:col-span-1 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-display font-bold text-sm">Response Rate</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mt-1" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-50 h-50 flex items-center justify-center">
                <Lottie animationData={loadingAnimation} loop={true} className="absolute inset-0 w-50 h-50" />
                <AnimatedCounter target={99.5} />
              </div>
              <div className="text-[10px] text-gray-500 mt-2">Completion Guarantee</div>
            </div>
          </div>

          {/* Data Integrity */}
          <div className="md:col-span-1 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-white">
              <PulsingLockIcon />
              <span className="font-display font-bold text-sm">Data Vault</span>
            </div>
            <div className="relative h-30 overflow-hidden font-mono text-[10px] leading-relaxed text-gray-600">
              <div className="animate-[marquee_5s_linear_infinite_reverse] flex flex-col text-center">
                <span>ENCRYPTED_STORAGE_ACTIVE</span>
                <span>GDPR_COMPLIANT</span>
                <span>ZERO_DATA_RETENTION</span>
                <span>END_TO_END_ENCRYPTED</span>
                <span>ANONYMIZED_PERSONAS</span>
                <span>SECURE_TRANSMISSION</span>
                <span>AUDIT_LOG_ENABLED</span>
              </div>
            </div>
            <div className="text-[10px] text-[#FF3B00] mt-2 flex items-center gap-1">
              <span className="w-1 h-1 bg-accent rounded-full text-[#FF3B00]" /> PRIVACY COMPLIANT
            </div>
          </div>

          {/* Agent Throughput */}
          <div className="md:col-span-1 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display font-bold text-sm">Throughput</span>
              <svg width="14" height="14" className="text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="flex-grow flex items-center">
              <AnimatedBars />
            </div>
            <div className="text-right text-[10px] font-mono mt-2 text-white">4.2K RESP/MIN</div>
          </div>

          {/* Quality Shield */}
          <div className="md:col-span-1 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 z-0 bg-green-900/10" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <span className="font-display font-bold text-sm text-white">Quality Shield</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <TypewriterText />
            </div>
          </div>

          {/* Multi-Platform Aperture - Commented out */}
          {/* <div className="md:col-span-2 md:row-span-1 glass-panel spotlight-card rounded-xl p-8 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl mb-2 text-white">5x Aperture Mode</h3>
              <p className="text-xs font-mono text-gray-300">Cross-Platform Intelligence Layer</p>
            </div>
            <AnimatedProgress />
          </div> */}

          {/* Platform Network - Commented out */}
          {/* <div className="md:col-span-2 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="flex justify-between items-center mb-2 z-20 relative">
              <span className="font-display font-bold text-lg text-white">Platform Network</span>
              <span className="text-[#FF3B00] text-xs font-mono border border-[#FF3B00]/30 px-2 py-0.5 rounded">LIVE</span>
            </div>
            <div className="md:col-span-2 md:row-span-1 glass-panel spotlight-card rounded-xl p-6 relative overflow-hidden w-full h-50 mt-4 z-10">
              <PlatformNetworkParticles />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
