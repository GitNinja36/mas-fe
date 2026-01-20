import { useMemo } from 'react'
import type { EnhancedManagerSurveyResponse } from '../../../types'
import { JobCard } from '../cards/JobCard'
import { calculateJobsToBeDone } from '../utils/jobsToBeDoneCalculator'
import { formatPercentage } from '../utils/formatters'
import { Briefcase } from 'lucide-react'

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

  if (!jobsAnalysis || jobsAnalysis.jobs.length === 0) {
    return (
      <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
        <p className="text-sm text-gray-400">No jobs to be done data available</p>
      </div>
    )
  }

  const primaryJob = jobsAnalysis.jobs[0]

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-[#080808] rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#FF3B00]/10 border border-[#FF3B00]/30 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#FF3B00]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">What Are Users Trying to Accomplish?</h3>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">
              Jobs to Be Done Analysis
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          Below are the deeper goals and jobs that drive user choices, extracted from their reasoning patterns.
        </p>
      </div>

      {/* Primary Job and Secondary Job Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Job */}
        {jobsAnalysis.jobs.length > 0 && (
          <JobCard job={jobsAnalysis.jobs[0]} index={0} />
        )}

        {/* Secondary Job (in place of Jobs Visualization) */}
        {jobsAnalysis.jobs.length > 1 && (
          <JobCard job={jobsAnalysis.jobs[1]} index={1} />
        )}
      </div>

      {/* Secondary Section - Shows Tertiary Job */}
      {jobsAnalysis.jobs.length > 2 && (
        <JobCard job={jobsAnalysis.jobs[2]} index={2} />
      )}

      {/* Tertiary Section - Jobs Visualization and Design Roadmap Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs Visualization */}
        {jobsAnalysis.canvas_data && (
          <div className="bg-[#080808] rounded-xl border border-white/10 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">Jobs Visualization</h3>
            <div className="flex-1 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
              <div className="grid gap-4 grid-cols-1">
                {/* Situation Column */}
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Situation</h4>
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
                    <p className="text-sm text-gray-200">{jobsAnalysis.canvas_data.situation}</p>
                  </div>
                </div>

                {/* Job Column */}
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Job to Be Done</h4>
                  <div className="rounded-lg bg-[#FF3B00]/10 border border-[#FF3B00]/30 p-4">
                    <p className="text-sm text-gray-200">{jobsAnalysis.canvas_data.job}</p>
                  </div>
                </div>

                {/* Outcome Column */}
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Desired Outcome</h4>
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                    <p className="text-sm text-gray-200">{jobsAnalysis.canvas_data.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Roadmap */}
        {primaryJob && primaryJob.design_implications.length > 0 && (
          <div className="bg-[#080808] rounded-xl border border-white/10 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">Design Roadmap Based on Jobs</h3>
            <div className="flex-1 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
              <div className="space-y-6">
                {primaryJob.design_implications.slice(0, 3).map((impl, idx) => {
                  const priorities = ['P0', 'P1', 'P2'] as const
                  const priority = priorities[idx] || 'P2'
                  const adoption = idx === 0 ? primaryJob.adoption : primaryJob.adoption * (0.7 - idx * 0.2)

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-2xl font-bold text-[#FF3B00] min-w-[50px]">{priority}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-100">{impl}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Addresses {formatPercentage(adoption, 1)} of users' {idx === 0 ? 'PRIMARY' : idx === 1 ? 'SECONDARY' : 'TERTIARY'} job
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
