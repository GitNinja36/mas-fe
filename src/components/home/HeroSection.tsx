import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <section id="hero" className="flex flex-col overflow-hidden w-full h-screen relative items-center justify-center">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 border px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm border-white/10 bg-white/5">
          <span className="text-[10px] text-accent uppercase tracking-widest font-mono text-[#FF3B00]">
            Multi-Agent Survey Intelligence Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="md:text-9xl leading-[0.9] text-6xl font-bold tracking-tighter font-display mb-6 text-white animate-fade-in-up">
          Validate Ideas<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-400 to-gray-600">
            In Minutes
          </span>
        </h1>

        {/* Description */}
        <p className="md:text-xl leading-relaxed text-lg font-medium max-w-2xl mx-auto mb-3 text-gray-500">
          200K+ AI Twins built on personal user data deliver authentic survey results, in minutes. 
          No human bias. No long waits. Just Instant Validation.
        </p>
        {/* Footnote */}
        <p className="text-xs text-gray-600 font-mono mb-10 max-w-2xl mx-auto">
          Mood-congruent bias + Interpretation bias
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/survey')
              } else {
                navigate('/login')
              }
            }}
            className="bg-[#FF3B00] px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto btn-magnetic hover:bg-white hover:shadow-lg hover:shadow-[#FF3B00]/20 text-black"
          >
            Launch Survey Now →
          </button>
          <button
            onClick={() => {
              const section = document.getElementById('pipeline')
              section?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 border font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto btn-magnetic border-white/20 text-white hover:bg-white/10"
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  )
}
