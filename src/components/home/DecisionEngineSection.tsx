const SCREENSHOTS = [
  { src: 'https://res.cloudinary.com/davtv5r1c/image/upload/v1770027844/Screenshot_2026-02-02_at_3.53.53_PM_chzxn0.png', alt: 'Market Discovery Insights' },
  { src: 'https://res.cloudinary.com/davtv5r1c/image/upload/v1770027927/Screenshot_2026-02-02_at_3.55.15_PM_idlvta.png', alt: 'Market Discovery Insights' },
  { src: 'https://res.cloudinary.com/davtv5r1c/image/upload/v1770027957/Screenshot_2026-02-02_at_3.55.47_PM_clrlnh.png', alt: 'Market Discovery Insights' },
]

export function DecisionEngineSection() {
  return (
    <section id="decision-engine" className="py-32 bg-[#050505] relative z-20 border-t border-white/5 overflow-hidden">
      {/* Background Effects - Aurora Style */}
      <div className="absolute inset-0 tech-grid opacity-20 mask-gradient" />
      {/* Primary Spotlight (Orange) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF3B00]/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      {/* Secondary Ambient Light (Purple/Blue hue for depth) */}
      <div className="absolute top-1/2 left-1/2 translate-x-1/4 -translate-y-1/4 w-[600px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#FF3B00] font-mono text-xs tracking-widest uppercase mb-4 block animate-fade-in-up">Visual Intelligence</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white animate-fade-in-up animation-delay-100">
            A Decision <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">Engine</span>
          </h2>
        </div>

        {/* Scroll Container with Gradient Masks for Fade/Focus effect */}
        <div className="relative group/scroll animate-fade-in-up animation-delay-200">
          {/* Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-4 md:px-32">
            {SCREENSHOTS.map(({ src, alt }) => (
              <div
                key={alt}
                className="flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[700px] snap-center group perspective-1000"
              >
                <div className="glass-panel-premium rounded-2xl relative overflow-hidden aspect-[16/10] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_50px_rgba(255,59,0,0.15)] group-hover:border-white/20">
                  {/* Glass sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain bg-[#0a0a0a]"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const wrapper = target.closest('.glass-panel-premium')
                      const placeholder = wrapper?.querySelector('[data-placeholder]') as HTMLElement
                      if (placeholder) placeholder.classList.remove('hidden')
                    }}
                  />
                  <div
                    data-placeholder
                    className="hidden absolute inset-0 bg-[#0a0a0a] flex items-center justify-center border-t border-white/5"
                    aria-hidden
                  >
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 font-mono text-sm">{alt}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-center text-sm text-gray-400 font-mono opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1">
                  {alt}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-gray-500 text-xs font-mono uppercase tracking-widest mt-4 animate-pulse opacity-50">
          <span>← Swipe to explore →</span>
        </div>
      </div>
    </section>
  )
}
