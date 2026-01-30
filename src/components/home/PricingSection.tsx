export function PricingSection() {
  return (
    <section id="pricing" className="skew-target py-32 px-6 bg-[#050505] relative z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-bold text-4xl text-white text-center mb-16">Compute Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Developer Tier */}
          <div className="border border-white/10 p-8 rounded-2xl hover:bg-white/5 transition-colors hover-trigger spotlight-card glass-panel">
            <div className="font-mono text-xs text-gray-500 mb-4 z-10 relative">/ NORMAL</div>
            <div className="text-3xl font-bold text-white mb-6 z-10 relative">
              $0<span className="text-sm font-normal text-gray-500">/mo</span>
            </div>
            <ul className="space-y-4 text-sm text-gray-300 mb-8 font-mono z-10 relative">
              <li className="flex gap-3">
                <span>✓</span> 1000 Credits
              </li>
              <li className="flex gap-3">
                <span>✓</span> 3 Concurrent questions
              </li>
            </ul>
            <button className="w-full py-3 border border-white/20 rounded font-bold uppercase text-xs tracking-wider text-white hover:bg-white hover:text-black transition-all z-10 relative">
              Start Free
            </button>
          </div>

          {/* Production Tier - Popular */}
          <div className="border border-[#FF3B00] bg-[#0a0a0a] p-8 rounded-2xl relative hover-trigger transform md:-translate-y-4 shadow-[0_0_30px_rgba(255,59,0,0.1)] spotlight-card">
            <div className="absolute top-0 right-0 bg-[#FF3B00] text-black text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg z-10">
              Popular
            </div>
            <div className="font-mono text-xs text-[#FF3B00] mb-4 z-10 relative">/ EXPERT</div>
            <div className="text-3xl font-bold text-white mb-6 z-10 relative">
              $0.02<span className="text-sm font-normal text-gray-500">/1k tokens</span>
            </div>
            <ul className="space-y-4 text-sm text-gray-300 mb-8 font-mono z-10 relative">
              <li className="flex gap-3">
                <span className="text-[#FF3B00]">✓</span> 50,000 Credits
              </li>
              <li className="flex gap-3">
                <span className="text-[#FF3B00]">✓</span> 5 Concurrent
              </li>
            </ul>
            <button className="w-full py-3 bg-[#FF3B00] text-black rounded font-bold uppercase text-xs tracking-wider hover:bg-white transition-all z-10 relative">
              balance
            </button>
          </div>

          {/* Cluster Tier */}
          <div className="border border-white/10 p-8 rounded-2xl hover:bg-white/5 transition-colors hover-trigger spotlight-card glass-panel">
            <div className="font-mono text-xs text-gray-500 mb-4 z-10 relative">/ PREMIUM</div>
            <div className="text-3xl font-bold text-white mb-6 z-10 relative">Custom</div>
            <ul className="space-y-4 text-sm text-gray-300 mb-8 font-mono z-10 relative">
              <li className="flex gap-3">
                <span>✓</span> 100,000 Credits
              </li>
              <li className="flex gap-3">
                <span>✓</span> 10 Concurrent questions
              </li>
            </ul>
            <button className="w-full py-3 border border-white/20 rounded font-bold uppercase text-xs tracking-wider text-white hover:bg-white hover:text-black transition-all z-10 relative">
              pro
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
