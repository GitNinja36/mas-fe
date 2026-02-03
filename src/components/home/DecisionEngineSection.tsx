import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Target, DollarSign, BarChart3, MousePointerClick, Zap } from 'lucide-react'

// Data for the "Critical Decision" Grid
const DECISION_CARDS = [
  {
    icon: Target,
    title: "Positioning",
    desc: "Pick the message that resonates with your core audience.",
    visualType: "progress",
    visualLabel: "WINNING INSIGHT",
    visualValue: "85%"
  },
  {
    icon: DollarSign,
    title: "Pricing",
    desc: "Test willingness to pay before writing code.",
    visualType: "slider",
    visualLabel: "OPTIMAL POINT",
    visualValue: "$49/mo"
  },
  {
    icon: BarChart3,
    title: "Feature Priority",
    desc: "Know what to build first based on actual demand.",
    visualType: "rank",
    visualLabel: "RANKED PRIORITY",
    visualValue: "Top 1"
  },
  {
    icon: MousePointerClick,
    title: "Landing Hook",
    desc: "Choose the hook that converts visitors into customers.",
    visualType: "ab",
    visualLabel: "A/B SNAPSHOT",
    visualValue: "Winner"
  }
]

export function DecisionEngineSection() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden text-white">

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#FF3B00]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* --- PART 1: HERO DASHBOARD VISUAL --- */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-[#FF3B00]/30 bg-[#FF3B00]/10 px-4 py-1 rounded-full text-[#FF3B00] text-xs font-bold tracking-widest uppercase"
          >
            <Zap className="w-3 h-3" /> Decision Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            See the answer.<br />
            <span className="text-[#FF3B00]">Know what to do next.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Banza turns growth questions into decision-ready reports using validated market logic.
            Move from "maybe" to "execution" in seconds.
          </motion.p>
        </div>

        {/* The Giant Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mb-32 group"
        >
          {/* Glow Behind */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#FF3B00]/20 to-transparent rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

          <motion.div
            className="relative bg-[#080808] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden ring-1 ring-white/5 cursor-pointer backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Scanline / Shimmer Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:animate-shimmer pointer-events-none" />

            {/* Floating decorative elements inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B00]/5 blur-[80px] rounded-full animate-float-slow pointer-events-none" />

            {/* Header of Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <div className="text-xs font-mono text-[#FF3B00] mb-2 uppercase tracking-widest">Validated Report • 2026.02.04</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Executive Summary: Market Expansion</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-500 uppercase">94% Confidence</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: The Verdict (Big Focus) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-[#FF3B00]/10 to-transparent border border-[#FF3B00]/20 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B00]/10 blur-[50px] rounded-full" />

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FF3B00] text-black p-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[#FF3B00] font-bold tracking-wide text-sm">PRIMARY VERDICT</span>
                  </div>

                  <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
                    Based on current market synthesis, <span className="text-[#FF3B00] underline decoration-wavy underline-offset-4">Option A (Direct-to-Consumer)</span> represents the highest ROI path with a 42% faster GTM velocity compared to Option B.
                  </p>
                </div>

                {/* Skeleton Loader Lines for Aesthetic */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 h-24 flex flex-col justify-end">
                      <div className="w-full h-1 bg-white/10 rounded-full mb-2" />
                      <div className="w-2/3 h-1 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Action Panel */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[300px]">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      <div className="h-2 w-full bg-gray-600 rounded-full" />
                    </div>
                  ))}
                </div>

                <button className="w-full bg-[#FF3B00] hover:bg-[#E63500] hover:scale-[1.02] active:scale-[0.98] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,59,0,0.2)] hover:shadow-[0_0_30px_rgba(255,59,0,0.4)] flex items-center justify-center gap-2 group/btn">
                  Execute Strategy <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>


        {/* --- PART 2: "BUILT FOR EVERY DECISION" GRID --- */}
        <div className="relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What you can validate in <span className="text-[#FF3B00]">minutes</span></h2>
            <p className="text-gray-400">Run one question, get decision-ready clarity. No surveys, just rapid intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DECISION_CARDS.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative bg-[#0A0A0A] border border-white/10 hover:border-[#FF3B00]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Icon */}
                <div className="w-12 h-12 bg-[#FF3B00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FF3B00] transition-colors duration-300">
                  <card.icon className="w-6 h-6 text-[#FF3B00] group-hover:text-black transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-grow">{card.desc}</p>

                {/* Mini Visual at Bottom */}
                <div className="mt-auto bg-[#111] rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{card.visualLabel}</div>

                  {/* Render Visual based on Type */}
                  {card.visualType === 'progress' && (
                    <div className="relative pt-1">
                      <div className="flex justify-between text-xs text-white font-bold mb-1">
                        <span>Resonance</span>
                        <span className="text-[#FF3B00]">{card.visualValue}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF3B00] w-[85%]" />
                      </div>
                    </div>
                  )}

                  {card.visualType === 'slider' && (
                    <div className="relative pt-2">
                      <div className="h-1 bg-gray-800 rounded-full relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 bg-[#FF3B00] rounded-full shadow-[0_0_10px_#FF3B00]" />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                        <span>$0</span>
                        <span className="text-white font-bold">{card.visualValue}</span>
                        <span>$100</span>
                      </div>
                    </div>
                  )}

                  {card.visualType === 'rank' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF3B00] font-bold text-xs">01</span>
                        <div className="h-1.5 w-3/4 bg-[#FF3B00] rounded-full" />
                      </div>
                      <div className="flex items-center gap-2 opacity-50">
                        <span className="text-gray-500 font-bold text-xs">02</span>
                        <div className="h-1.5 w-1/2 bg-gray-600 rounded-full" />
                      </div>
                    </div>
                  )}

                  {card.visualType === 'ab' && (
                    <div className="flex gap-2">
                      <div className="h-6 flex-1 bg-[#FF3B00] rounded-sm flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-black" />
                      </div>
                      <div className="h-6 flex-1 bg-gray-800 rounded-sm opacity-50" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}