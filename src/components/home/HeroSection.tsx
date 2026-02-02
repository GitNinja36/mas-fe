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
        <p className="md:text-xl leading-relaxed text-lg font-medium max-w-2xl mx-auto mb-8 text-gray-400 animate-fade-in-up animation-delay-200">
          Run AI-twin powered market validation before you<br />
          <span className="text-gray-200">Build, Launch, Invest.</span>
        </p>

        {/* Feature strips - Structured for Premium Feel */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-12 max-w-4xl mx-auto animate-fade-in-up animation-delay-300">
          {[
            "No delays or bias",
            "Real human behavioral signals",
            "Decision-ready reports",
            "Designed for founders & product teams"
          ].map((feature, index, array) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest hover:text-white transition-colors cursor-default">
                {feature}
              </span>
              {index < array.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[#FF3B00]/50" />
              )}
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
