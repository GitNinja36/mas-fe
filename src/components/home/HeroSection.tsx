import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <section id="hero" className="flex flex-col overflow-hidden w-full h-screen relative items-center justify-center">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-6 pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 border px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm border-white/10 bg-white/5 animate-fade-in-up">
          <span className="text-[10px] text-accent uppercase tracking-widest font-mono text-[#FF3B00] text-glow">
            Multi-Agent Survey Intelligence Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="md:text-9xl leading-[0.9] text-6xl font-bold tracking-tighter font-display mb-8 text-white animate-fade-in-up animation-delay-100">
          Validate Ideas<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
            In Minutes
          </span>
        </h1>

        {/* Description */}
        <p className="md:text-xl leading-relaxed text-lg font-medium max-w-2xl mx-auto mb-10 text-gray-400 animate-fade-in-up animation-delay-200">
          Run AI-twin powered market validation before you
          <span className="block mt-4 flex flex-wrap justify-center gap-3">
            {['Build', 'Launch', 'Invest'].map((word, i) => (
              <span key={word} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold tracking-wide shadow-lg shadow-black/20 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                {word}
              </span>
            ))}
          </span>
        </p>

        {/* Feature strips - Structured for Premium Feel */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-14 max-w-5xl mx-auto animate-fade-in-up animation-delay-300">
          {[
            "No delays or bias",
            "Real human behavioral signals",
            "Decision-ready reports",
            "Designed for founders & product teams"
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A]/80 border border-white/5 backdrop-blur-sm hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/5 transition-all group cursor-default"
            >
              <div className="w-5 h-5 rounded-full bg-[#FF3B00]/10 flex items-center justify-center group-hover:bg-[#FF3B00] transition-colors">
                <Check size={12} className="text-[#FF3B00] group-hover:text-black transition-colors" />
              </div>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up animation-delay-500">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/survey')
              } else {
                navigate('/login')
              }
            }}
            className="group relative bg-[#FF3B00] px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto btn-magnetic hover:bg-[#ff5722] hover:scale-105 active:scale-95 text-black overflow-hidden rounded-lg shadow-[0_0_20px_rgba(255,59,0,0.3)] hover:shadow-[0_0_40px_rgba(255,59,0,0.5)]"
          >
            <span className="relative z-10">Validate your Idea</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
          </button>
          <button
            onClick={() => {
              const section = document.getElementById('pipeline')
              section?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 border border-white/10 font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto btn-magnetic text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/30 rounded-lg active:scale-95"
          >
            View Sample Report
          </button>
        </div>
      </div>
    </section>
  )
}