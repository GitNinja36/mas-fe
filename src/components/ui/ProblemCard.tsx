// Helper component for the left side items
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function ProblemCard({ icon, title, sub, delay }: { icon: string, title: string, sub: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ x: 4, scale: 1.01 }}
      transition={{ delay: delay, type: "spring", stiffness: 200 }}
      className="group relative"
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />

      {/* Card Content */}
      <div className="relative flex items-center gap-3 bg-gradient-to-br from-[#0F0F0F] to-[#050505] border border-white/5 p-3 rounded-xl shadow-lg hover:shadow-red-900/10 group-hover:border-red-500/20 transition-all duration-300">

        {/* Icon Container with Glass Effect */}
        <div className="relative p-2 rounded-lg bg-[#1a0505] border border-red-500/10 text-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.05)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:bg-[#2a0505] group-hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Render specific icon based on prop */}
          <div className="relative z-10">
            {icon === 'alert' && <AlertCircle className="w-4 h-4" />}
            {icon === 'refresh' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
            )}
            {icon === 'clock' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            )}
          </div>
        </div>

        <div>
          <span className="text-sm font-bold text-gray-200 tracking-wide block mb-0.5 group-hover:text-red-100 transition-colors">{title}</span>
          <span className="text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">{sub}</span>
        </div>
      </div>
    </motion.div>
  )
}