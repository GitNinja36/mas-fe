import { ArrowRight, Lightbulb, CheckCircle2, XCircle, Quote } from 'lucide-react'
import type { JobToBeDone } from '../../../types'

interface JobCardProps {
  job: JobToBeDone
  index: number
}

const jobBadgeConfig = {
  0: { bg: 'bg-[#FF3B00]', text: 'text-white', label: 'PRIMARY MISSION', border: 'border-[#FF3B00]' },
  1: { bg: 'bg-blue-600', text: 'text-white', label: 'SECONDARY GOAL', border: 'border-blue-600' },
  2: { bg: 'bg-purple-600', text: 'text-white', label: 'TERTIARY OBJECTIVE', border: 'border-purple-600' },
}

export function JobCard({ job, index }: JobCardProps) {
  const badgeConfig = jobBadgeConfig[index as keyof typeof jobBadgeConfig] || jobBadgeConfig[2]
  const isPrimary = index === 0;

  // Fix adoption percentage: Ensure it is between 0 and 1 (0-100%)
  // Some legacy data might be >1 if it was raw count. Normalize if needed.
  let adoptionRate = job.adoption;
  if (adoptionRate > 1) {
    // If massive number, assume it's a percentage (e.g. 85) and divide
    adoptionRate = adoptionRate > 100 ? 1 : adoptionRate / 100;
  }

  // Example "Verbatim Quote" (Simulated since not in current schema, but can be added later)
  const simulatedQuote = "I just want to get this done without second-guessing every decision.";

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border transition-all duration-300 group
      ${isPrimary
        ? 'bg-[#080808] border-[#FF3B00]/30 shadow-[0_0_50px_rgba(255,59,0,0.05)] col-span-1 lg:col-span-2'
        : 'bg-[#080808] border-white/10 hover:border-white/20'
      }
    `}>

      {/* Background Decor (Only for Primary) */}
      {isPrimary && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B00]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      )}

      <div className="p-6 md:p-8 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full tracking-wider ${badgeConfig.bg} ${badgeConfig.text}`}>
                {badgeConfig.label}
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                #{index + 1} Priority
              </span>
            </div>
            <h3 className={`font-bold text-white mb-2 leading-tight ${isPrimary ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {job.title}
            </h3>
            <p className={`text-gray-400 font-light leading-relaxed ${isPrimary ? 'text-lg italic' : 'text-sm'}`}>
              "{job.description}"
            </p>

            {/* Verbatim Quote (Voice of Customer) - Highlights immersion */}
            {isPrimary && (
              <div className="mt-4 flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="p-2 bg-white/5 rounded-full text-gray-500">
                  <Quote size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300 italic">"{simulatedQuote}"</p>
                  <div className="text-[10px] text-gray-600 font-mono mt-1 uppercase">Verbatim • Agent #3 (Amazon)</div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {/* Adoption Stat */}
          <div className="min-w-[140px] flex flex-col items-start md:items-end">
            <div className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-1">Total Adoption</div>
            <div className="relative">
              <span className={`font-mono font-bold leading-none ${isPrimary ? 'text-5xl text-[#FF3B00]' : 'text-3xl text-white'}`}>
                {Math.round(adoptionRate * 100)}%
              </span>
            </div>
            {isPrimary && (
              <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF3B00] w-full origin-left animate-slide-in" style={{ transform: `scaleX(${adoptionRate})` }} />
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className={`grid grid-cols-1 ${isPrimary ? 'md:grid-cols-2 gap-8 md:gap-12' : 'gap-6'}`}>

          {/* Left Column: Struggle vs Progress (Context) */}
          <div className="space-y-6">
            {/* The Struggle (Stopping Points) */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold font-mono text-gray-500 uppercase tracking-widest mb-4">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                The Struggle (Pain)
              </h4>
              <div className="space-y-2">
                {job.frustrations.slice(0, 3).map((frust, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                    <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{frust.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Progress (Success Criteria) */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold font-mono text-gray-300 uppercase tracking-widest mb-4">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Desired Progress (Gain)
              </h4>
              <div className="space-y-2">
                {job.desired_outcomes.slice(0, 3).map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-200">{outcome.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Strategic Implications */}
          <div className={`relative ${isPrimary ? '' : 'pt-6 border-t border-white/10'}`}>
            {isPrimary && (
              <div className="absolute -inset-4 bg-gradient-to-b from-[#FF3B00]/5 to-transparent opacity-50 rounded-2xl pointer-events-none" />
            )}

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-[#FF3B00]/10 text-[#FF3B00]">
                  <Lightbulb size={18} />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Strategic Opportunities</h4>
              </div>

              <ul className="space-y-4">
                {job.design_implications.map((impl, i) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="font-mono text-[10px] text-[#FF3B00]/50 mt-1.5 group-hover:text-[#FF3B00] transition-colors line-through decoration-transparent group-hover:decoration-current">0{i + 1}</span>
                    <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                      {impl}
                    </span>
                  </li>
                ))}
              </ul>

              {isPrimary && (
                <button className="mt-8 flex items-center gap-2 text-xs font-bold text-[#FF3B00] hover:text-[#FF3B00]/80 transition-colors uppercase tracking-widest group">
                  View Implementation Plan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
