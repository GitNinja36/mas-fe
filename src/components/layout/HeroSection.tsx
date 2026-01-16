import { Sparkles } from 'lucide-react'
import { TechStats } from '../feedback/TechStats'
import { FloatingElement } from './FloatingElement'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/15 to-orange-500/20 border border-orange-500/30 rounded-full px-6 py-2.5 text-sm text-orange-300 mb-10 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium tracking-wide">
              Sequential Multi-Question Survey Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            <span className="block animate-fade-in-up">Enhanced</span>
            <span className="block text-orange-400 mt-2">AI Agents</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-normal">
            Ask up to <span className="text-orange-400 font-semibold">10 different questions</span>{' '}
            and watch AI agents answer them{' '}
            <span className="text-orange-400 font-semibold">sequentially</span> with comprehensive
            analysis.
          </p>
        </div>

        <div className="animate-fade-in-up">
          <TechStats />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
        </FloatingElement>
        <FloatingElement delay={3}>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
        </FloatingElement>
        <FloatingElement delay={1.5}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl"></div>
        </FloatingElement>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
