import type { CampaignMessaging } from '../../../types'
import { Calendar } from 'lucide-react'

interface CampaignTimelineCardProps {
  campaignTimeline: CampaignMessaging['campaign_timeline']
}

export function CampaignTimelineCard({ campaignTimeline }: CampaignTimelineCardProps) {
  // Support both old format (phase1/phase2/phase3) and new format (phases array)
  let phases: Array<{ time: string; title: string; action: string; budget_allocation?: string }>
  
  if (campaignTimeline.phases && campaignTimeline.phases.length > 0) {
    // New format
    phases = campaignTimeline.phases.map(p => ({
      time: p.time || p.duration || '',
      title: p.title || p.action || '',
      action: p.action || p.description || '',
      budget_allocation: p.budget_allocation,
    }))
  } else {
    // Legacy format fallback
    const phase1 = (campaignTimeline as any).phase1
    const phase2 = (campaignTimeline as any).phase2
    const phase3 = (campaignTimeline as any).phase3
    
    phases = [
      { time: 'Week 1-2', title: phase1?.action || '', action: phase1?.description || phase1?.action || '', budget_allocation: '' },
      { time: 'Week 3-4', title: phase2?.action || '', action: phase2?.description || phase2?.action || '', budget_allocation: '' },
      { time: 'Week 5+', title: phase3?.action || '', action: phase3?.description || phase3?.action || '', budget_allocation: '' },
    ]
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#FF3B00]" />
          <h3 className="text-white font-bold flex items-center gap-2">
            🚀 Launch Strategy
          </h3>
        </div>
        {campaignTimeline.strategy_type && (
          <span className="text-xs bg-[#FF3B00]/20 text-[#FF3B00] px-2 py-1 rounded border border-[#FF3B00]/20">
            {campaignTimeline.strategy_type}
          </span>
        )}
      </div>

      {/* Vertical Steps with Connector Line */}
      <div className="space-y-0 relative flex-1">
        {/* The Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#FF3B00] to-transparent opacity-30"></div>

        {phases.map((phase, i) => (
          <div key={i} className="relative flex gap-4 pb-8 last:pb-0 group">
            {/* Number Bubble */}
            <div className="w-10 h-10 rounded-full bg-[#111] border border-[#FF3B00]/50 flex items-center justify-center z-10 text-[#FF3B00] font-bold shadow-[0_0_15px_rgba(255,59,0,0.2)] flex-shrink-0">
              {i + 1}
            </div>
            
            {/* Content Card */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex justify-between mb-1">
                <span className="text-[#FF3B00] font-bold text-sm uppercase tracking-wider">
                  {phase.time}
                </span>
                {phase.budget_allocation && (
                  <span className="text-xs text-gray-500">Budget: {phase.budget_allocation}</span>
                )}
              </div>
              <h4 className="text-white font-bold mb-1">{phase.title}</h4>
              <p className="text-sm text-gray-400">{phase.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
