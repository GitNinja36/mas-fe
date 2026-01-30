import { useMemo } from 'react'
import type { EnhancedManagerSurveyResponse } from '../../../types'
import { JobCard } from '../cards/JobCard'
import { calculateJobsToBeDone } from '../utils/jobsToBeDoneCalculator'
import { Briefcase, Target, Compass, ArrowRight } from 'lucide-react'

interface JobsToBeDoneTabProps {
  result: EnhancedManagerSurveyResponse
}

export function JobsToBeDoneTab({ result }: JobsToBeDoneTabProps) {
  // Use backend data if available, otherwise calculate from survey data
  const jobsAnalysis = useMemo(() => {
    if (result.jobs_to_be_done) {
      return result.jobs_to_be_done
    }

    // Fallback: calculate from existing data
    return calculateJobsToBeDone({
      agent_responses_list: result.agent_responses_list,
      decision_factors: result.decision_factors,
      reasoning_patterns: result.reasoning_patterns,
    })
  }, [result])

  const situation = jobsAnalysis?.canvas_data || {
    situation: "Agents navigating complex trade-offs in current market conditions",
    job: "Find optimal balance between performance and cost",
    outcome: "Maximize ROI without compromising core stability"
  };

  if (!jobsAnalysis || jobsAnalysis.jobs.length === 0) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-400 font-mono">No sufficient data for Jobs analysis.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fade-in-up">

      {/* 1. Hero / Context Canvas */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF3B00] to-purple-600 rounded-full" />
        <div className="pl-6 md:pl-8">
          <h2 className="text-2xl font-bold text-white font-display mb-2">The Customer Job Context</h2>
          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed mb-8">
            Understanding the "Struggle" — users don't buy products, they "hire" them to make progress in a specific situation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Situation */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/10 relative group hover:border-white/20 transition-colors">
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                <Compass size={12} className="text-blue-500" /> Current Situation
              </div>
              <div className="text-sm font-medium text-gray-200 leading-snug">
                {situation.situation}
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 hidden md:block text-gray-700">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* The Job (Struggle) */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/10 border-l-2 border-l-[#FF3B00] relative group shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <div className="text-[10px] font-bold uppercase text-[#FF3B00] mb-2 flex items-center gap-2">
                <Briefcase size={12} /> The Core Job
              </div>
              <div className="text-sm font-medium text-white leading-snug">
                {situation.job}
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 hidden md:block text-gray-700">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Desired Outcome */}
            <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/10 relative group hover:border-white/20 transition-colors">
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                <Target size={12} className="text-emerald-500" /> Success State
              </div>
              <div className="text-sm font-medium text-gray-200 leading-snug">
                {situation.outcome}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 2. Prioritized Jobs (Cards) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest">
            Detected Jobs (Prioritized)
          </h3>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-500">
            {jobsAnalysis.jobs.length} Opportunities Found
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobsAnalysis.jobs.map((job, idx) => (
            <JobCard key={idx} job={job} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
