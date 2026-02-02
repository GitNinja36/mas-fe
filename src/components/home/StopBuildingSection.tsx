import { useNavigate } from 'react-router-dom'

export function StopBuildingSection() {
  return (
    <section className="py-32 bg-[#050505] relative z-20 overflow-hidden">
      {/* Background Effects - Aurora Style */}
      <div className="absolute inset-0 tech-grid opacity-20 mask-gradient" />
      {/* Primary Spotlight (Orange) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF3B00]/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      {/* Secondary Ambient Light (Purple/Blue hue for depth) */}
      <div className="absolute top-1/2 left-1/2 translate-x-1/4 -translate-y-1/4 w-[600px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-5xl md:text-6xl text-white mb-12 tracking-tight animate-fade-in-up">
          Stop Building in the <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">Dark</span>
        </h2>

        <div className="glass-panel-premium p-8 md:p-12 rounded-2xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="space-y-10 relative z-10">
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              Most teams spend months building products before discovering what
              customers actually want.
            </p>

            {/* Elegant Separator */}
            <div className="flex items-center justify-center gap-4 opacity-50">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B00]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <p className="font-display font-bold text-3xl md:text-4xl leading-tight">
              <span className="text-white drop-shadow-lg">Guesswork is expensive.</span>
              <br className="my-3 block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B00] via-[#FF8A00] to-[#FF3B00] bg-[length:200%_auto] animate-shine text-glow-strong">
                Late validation is worse.
              </span>
            </p>

            <p className="text-lg text-gray-400 font-medium">
              Banza lets you test direction before committing time, capital,
              and team velocity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
