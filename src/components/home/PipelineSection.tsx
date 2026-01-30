import { useState, useEffect } from 'react'

// Typewriter Effect for Question Input
function TypewriterQuestion() {
  const questions = [
    "What features do Gen-Z users prefer for...",
    "Market sentiment for crypto in Q2?",
    "Best pricing strategy for SaaS products?",
    "User preference: dark vs light mode?",
    "Which onboarding flow converts better?"
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentQuestion = questions[currentIndex]

    if (isTyping) {
      if (displayText.length < currentQuestion.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentQuestion.slice(0, displayText.length + 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setCurrentIndex((prev) => (prev + 1) % questions.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentIndex])

  return (
    <div className="relative">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 min-h-[80px]">
        <div className="text-gray-300 font-mono text-sm">
          {displayText}
          <span className="text-[#FF3B00] animate-pulse">|</span>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono">
        <span className="text-gray-500">{displayText.length} characters</span>
        <span className="text-green-400">Quality: {Math.min(98, 60 + Math.floor(displayText.length / 2))}%</span>
      </div>
    </div>
  )
}

// Rotating Template Cards - Clickable with hover effects
function TemplateCards() {
  const templates = [
    { q: "Market sentiment for crypto?", tag: "FINANCE" },
    { q: "Best pricing for SaaS?", tag: "PRICING" },
    { q: "Dark vs light mode?", tag: "UX" },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  // Auto-rotate only when not interacted with
  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % templates.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isAutoRotating])

  // Handle click on template
  const handleTemplateClick = (index: number) => {
    setActiveIndex(index)
    setIsAutoRotating(false)
    // Resume auto-rotation after 10 seconds of no interaction
    setTimeout(() => setIsAutoRotating(true), 10000)
  }

  return (
    <div className="flex gap-2 mt-4">
      {templates.map((t, i) => (
        <div
          key={i}
          onClick={() => handleTemplateClick(i)}
          className={`flex-1 p-3 rounded-lg border transition-all duration-300 cursor-pointer group ${i === activeIndex
            ? 'border-[#FF3B00]/50 bg-[#FF3B00]/10 scale-105'
            : 'border-white/10 bg-white/5 opacity-60 hover:opacity-100 hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/5'
            }`}
        >
          <div className={`text-[10px] font-mono mb-1 transition-colors duration-300 ${i === activeIndex
            ? 'text-[#FF3B00]'
            : 'text-gray-500 group-hover:text-[#FF3B00]'
            }`}>
            {t.tag}
          </div>
          <div className={`text-xs line-clamp-2 transition-colors duration-300 ${i === activeIndex
            ? 'text-gray-300'
            : 'text-gray-400 group-hover:text-gray-300'
            }`}>
            {t.q}
          </div>
        </div>
      ))}
    </div>
  )
}

// Cohort Query Preview with Typewriter
function CohortQueryPreview() {
  const cohorts = [
    "Gamers from Mumbai",
    "Tech professionals aged 25-35",
    "US founders in fintech",
    "Gen-Z social media users",
    "Enterprise CTOs"
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentCohort = cohorts[currentIndex]

    if (isTyping) {
      if (displayText.length < currentCohort.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentCohort.slice(0, displayText.length + 1))
        }, 60)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40)
        return () => clearTimeout(timeout)
      } else {
        setCurrentIndex((prev) => (prev + 1) % cohorts.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentIndex])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-medium">Survey Sample Query</span>
        <span className="text-xs text-gray-500">(Optional)</span>
      </div>
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3">
        <div className="text-gray-400 text-sm font-mono">
          {displayText || <span className="text-gray-600">e.g., 'Gamers from Mumbai'</span>}
          <span className="text-[#FF3B00] animate-pulse">|</span>
        </div>
      </div>
    </div>
  )
}

// Mock Options Preview - With hover effects
function OptionsPreview() {
  const options = ['Option A', 'Option B', 'Option C']

  return (
    <div className="space-y-2 mt-4">
      <div className="text-[10px] text-gray-500 font-mono">AVAILABLE OPTIONS</div>
      {options.map((opt, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 group hover:border-[#FF3B00]/50 hover:bg-[#FF3B00]/5"
        >
          <div className="w-6 h-6 rounded bg-[#FF3B00]/20 border border-[#FF3B00]/50 flex items-center justify-center text-[10px] text-[#FF3B00] font-bold transition-all duration-300 group-hover:bg-[#FF3B00]/30 group-hover:border-[#FF3B00]">
            {String.fromCharCode(65 + i)}
          </div>
          <span className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-200">{opt}</span>
        </div>
      ))}
    </div>
  )
}

export function PipelineSection() {
  return (
    <section id="pipeline" className="py-24 bg-[#050505] relative z-20 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative">
          {/* Left Column: Interactive Question Preview */}
          <div className="order-2 lg:order-1 relative">
            <div className="sticky top-24 w-full bg-[#080808] border rounded-2xl overflow-hidden p-6 shadow-2xl border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div>
                  <div className="text-white font-display font-bold text-lg">Question Builder</div>
                  <div className="text-[10px] text-gray-500 font-mono">LIVE PREVIEW</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-mono">ACTIVE</span>
                </div>
              </div>

              {/* Typewriter Input */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 font-mono mb-2">YOUR QUESTION</div>
                <TypewriterQuestion />
              </div>

              {/* Template Cards */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 font-mono mb-2">SAMPLE QUESTIONS</div>
                <TemplateCards />
              </div>

              {/* Options Preview */}
              <OptionsPreview />

              {/* Cohort Query */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <CohortQueryPreview />
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Text Steps */}
          <div className="order-1 lg:order-2 py-20 pb-0">
            <span className="text-[#FF3B00] font-mono text-xs tracking-widest block mb-5">
              /// HOW IT WORKS
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
              Ask Once and Survey At Scale
            </h2>
            <p className="text-lg mb-8 leading-relaxed text-gray-400">
              Ask one sharp question. Define AI twin cohort. Get decision ready insights in minutes.
            </p>

            {/* Step 1 */}
            <div className="step-item mb-48 pt-10 opacity-35 transition-opacity duration-500">
              <h3 className="text-4xl font-display font-bold mb-4 text-white">Step 1: Ask Questions</h3>
              <p className="text-xl leading-relaxed font-medium text-white/90">
                Turn your ideas into a set of questions ranging from product/feature validation to finding the pulse on trends.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-item mb-48 opacity-35 transition-opacity duration-500">
              <h3 className="text-4xl font-display font-bold mb-4 text-white">Step 2: Shape the Choices</h3>
              <p className="text-xl leading-relaxed font-medium text-white/90">
                Enter the options you want your respondents to have. Banza turns them into clear cut A/B/C comparisons for each AI Twin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-item mb-48 opacity-35 transition-opacity duration-500">
              <h3 className="text-4xl font-display font-bold mb-4 text-white">Step 3: Define the Survey Sample</h3>
              <p className="text-xl leading-relaxed font-medium text-white/90">
                Define your survey sample like "Gamers in New York" or "GenZ in India" and instantly route the question to the right AI Twins. Choose how many AI Twins participate to balance speed, accuracy, and depth.
              </p>
            </div>

            {/* Step 5 */}
            <div className="step-item opacity-35 transition-opacity duration-500">
              <h3 className="text-4xl font-display font-bold mb-4 text-white">Step 5: Get the report</h3>
              <p className="text-xl leading-relaxed font-medium text-white/90">
                Receive downloadable survey report with detailed analysis and clear action items.
              </p>
            </div>

            {/* Spacer */}
            <div className="h-40" />
          </div>
        </div>
      </div>
    </section>
  )
}
