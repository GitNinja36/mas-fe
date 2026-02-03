import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import LightningIcon from '../../assets/lightning.svg'
import { ProblemCard } from '../ui/ProblemCard'

export function StopBuildingSection() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative p-3">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5500]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5500]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Stop building
                <br />
                in the <span className="text-[#FF3B00]">dark.</span>
              </h2>
              <p className="text-medium text-gray-400 font-light leading-relaxed max-w-lg">
                Most teams spend months building products before
                discovering what customers actually want.
              </p>
            </div>

            {/* Pain Points */}
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <AlertCircle className="w-5 h-5 text-[#FF3B00]" />
                </div>
                <div>
                  <h3 className="text-large font-bold mb-1">Guesswork is expensive.</h3>
                  <p className="text-gray-400 text-sm">Every pivot costs engineering velocity and morale.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5 text-[#FF3B00]"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-large font-bold mb-1">Late validation is worse.</h3>
                  <p className="text-gray-400 text-sm">Discovering a flaw at launch is 100x costlier than at ideation.</p>
                </div>
              </div>
            </div>

            {/* Quote Line */}
            <div className="border-l-2 border-[#FF3B00] pl-6 py-1 my-8">
              <p className="text-medium font-medium text-white">
                Banza lets you test direction before committing time,
                capital, and team velocity.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap sm:flex-row items-start sm:items-center gap-6 pt-2">
              <button
                onClick={() => navigate('/survey')}
                className="bg-[#FF3B00] hover:bg-[#E63500] text-white px-6 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,59,0,0.3)]"
              >
                Validate an idea <ArrowRight className="w-5 h-5" />
              </button>

              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 39C6 39 0 24 0 24S6 9 24 9s24 15 24 15-6 15-24 15zm0-24c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zm0 15c-3.312 0-6-2.688-6-6h6l-4.242-4.242A5.97 5.97 0 0 1 24 18c3.312 0 6 2.688 6 6s-2.688 6-6 6z" />
                </svg>
                See a sample report in 30 seconds.
              </button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full perspective-1000"
          >
            {/* Header Badge - Moved Outside & Above */}
            <div className="absolute -top-6 right-8 z-30 pointer-events-none">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  default: { delay: 0.5, type: "spring" }
                }}
                className="bg-zinc-900/80 backdrop-blur-md border border-white/10 pl-2.5 pr-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl ring-1 ring-white/5"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF3B00]/10 border border-[#FF3B00]/20">
                  <img src={LightningIcon} alt="Lightning" className="w-2.5 h-2.5 animate-pulse opacity-80" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-300">Validation takes minutes</span>
              </motion.div>
            </div>

            {/* Main Container Card */}
            <motion.div
              initial={{ opacity: 0, rotateY: 10 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-[#080808] to-[#000000] border border-white/10 rounded-[2.5rem] min-h-[400px] h-auto w-full overflow-hidden shadow-2xl ring-1 ring-white/5 group select-none flex flex-col justify-center py-8"
            >

              {/* Subtle Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />

              {/* Ambient Glows */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-[#FF3B00]/10 blur-[120px] rounded-full pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-[#6344F5]/5 blur-[120px] rounded-full pointer-events-none"
              />

              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white/20 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0], y: [0, -60] }}
                  transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
                  style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                />
              ))}

              {/* Central Divider Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px z-10 hidden md:block overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
                />
              </div>

              {/* Central Glowing Node with Icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="relative flex items-center justify-center cursor-pointer group/node"
                >
                  <div className="w-10 h-10 bg-[#0A0A0A] border border-[#FF3B00]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,59,0,0.2)] z-20 relative ring-4 ring-[#080808]">
                    <ArrowRight className="text-[#FF3B00] w-4 h-4 stroke-[3px] group-hover/node:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-[#FF3B00]/20 animate-ping opacity-20 scale-150 duration-[3000ms]"></div>
                </motion.div>
              </div>

              {/* Grid Layout */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 h-full items-center">

                {/* LEFT SIDE: PROBLEM */}
                <div className="flex flex-col justify-center px-6 md:pl-10 md:pr-12 space-y-4 relative">
                  {/* Item 1 */}
                  <ProblemCard icon="alert" title="Assumptions" sub="Guesswork is risky" delay={0.3} />
                  {/* Item 2 */}
                  <div className="md:ml-8">
                    <ProblemCard icon="refresh" title="Rework" sub="Costly pivots" delay={0.4} />
                  </div>
                  {/* Item 3 */}
                  <ProblemCard icon="clock" title="Wasted Weeks" sub="Time lost forever" delay={0.5} />
                </div>


                {/* RIGHT SIDE: SOLUTION - Enhanced Layout */}
                <div className="flex flex-col justify-center px-6 md:pr-10 md:pl-12 space-y-4 relative">

                  {/* Visual Connector Line for Right Side Flow */}
                  <div className="absolute left-[3.5rem] top-10 bottom-10 w-px hidden md:block overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: "100%" }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                      className="w-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
                    />
                  </div>

                  {/* Card 1: Verdict */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative z-10 md:ml-4"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl" />
                    <div className="relative bg-[#0F0F0F] border border-white/5 p-3 rounded-xl shadow-lg hover:border-emerald-500/20 transition-all duration-300 flex items-center gap-3">
                      {/* Status Dot */}
                      <div className="w-8 h-8 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5 group-hover:text-emerald-400 transition-colors">Verdict</span>
                        <div className="text-gray-200 text-sm font-bold tracking-tight group-hover:text-white transition-colors">Validated Market Fit</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 2: Confidence (HERO) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                    viewport={{ once: true }}
                    className="relative md:ml-[-1.5rem] z-20 group perspective-500"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B00]/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="bg-[#080808] border border-white/10 p-5 rounded-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/5 group-hover:ring-[#FF3B00]/30 transition-all duration-500">

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/5 via-transparent to-transparent opacity-100" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#1a0505] border border-[#FF3B00]/20 text-[#FF3B00] px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,59,0,0.1)]">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest drop-shadow-sm">Confidence Score</span>
                          </div>
                        </div>

                        <div className="flex items-end gap-2">
                          <span className="text-5xl font-bold text-white tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">94</span>
                          <span className="text-sm font-medium text-zinc-600 mb-1">/ 100</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "94%" }}
                          transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-gradient-to-r from-[#FF3B00] to-[#FF6600] shadow-[0_0_15px_rgba(255,59,0,0.4)]"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3: Next Step */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative z-10 md:ml-4"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl" />
                    <div className="bg-[#0F0F0F] border border-white/5 p-3 rounded-xl shadow-lg relative overflow-hidden hover:border-blue-500/20 transition-all duration-300">
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-zinc-900 ring-1 ring-white/5 rounded-lg text-zinc-500 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 group-hover:text-blue-400 transition-colors">Next Step</div>
                          <div className="text-gray-200 text-sm font-bold group-hover:text-white transition-colors">Finalize High-Fidelity UI</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
