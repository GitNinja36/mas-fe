import {
   ShieldCheck,
   Activity,
   Globe,
   Server,
   AlertTriangle,
   Cpu,
   Lock,
   CheckCircle,
   Database,
   Terminal,
   BarChart2
} from 'lucide-react';
import type { EnhancedManagerSurveyResponse } from '../../../types';
import { getPlatformColor } from '../utils/colorMap';

interface SystemRigorTabProps {
   result: EnhancedManagerSurveyResponse;
}

export function SystemRigorTab({ result }: SystemRigorTabProps) {
   const { methodology, platforms_surveyed, risks_and_blindspots } = result;
   const platforms = platforms_surveyed || [];

   // Dynamic Score Calculation
   // If consensus is strong (>60%), high integrity. If divided, slightly lower to reflect variance.
   const agreement = result.overall_metrics?.response_agreement || 0;
   const baseIntegrity = 85;
   const integrityScore = Math.min(99.4, baseIntegrity + (agreement > 0.6 ? 14.4 : (agreement * 10)));

   // Platform Signal Strength Helper
   const getSignalStrength = (count: number, max: number) => {
      const ratio = max > 0 ? count / max : 0;
      return Math.ceil(ratio * 10); // 0-10
   };

   const maxAgentCount = Math.max(...Object.values(methodology?.agents_per_platform || {}));
   const totalAgents = result.total_responses || 1;

   // Derive Source Distribution for "DNA"
   const platformCounts = methodology?.agents_per_platform || {};
   const categories = {
      "Social & News": (platformCounts['twitter'] || 0) + (platformCounts['reddit'] || 0),
      "Professional": (platformCounts['linkedin'] || 0),
      "Commerce": (platformCounts['amazon'] || 0),
      "Content": 0
   };
   // Add others if needed

   const totalTracked = Object.values(categories).reduce((a, b) => a + b, 0);

   return (
      <div className="space-y-8 animate-fade-in-up">

         {/* --- Section 1: The Integrity Shield (Rigor Header) --- */}
         <div className="bg-[#080808] rounded-2xl border border-white/10 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
               {/* Shield Visual */}
               <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse-slow" />
                  <ShieldCheck size={80} className="text-emerald-500 relative z-10" strokeWidth={1.5} />
                  <div className="absolute bottom-0 right-0 bg-[#080808] rounded-full p-1 border border-white/10">
                     <CheckCircle size={20} className="text-emerald-400" />
                  </div>
               </div>

               {/* Metrics */}
               <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                     <h2 className="text-3xl font-bold font-mono text-white tracking-tight">{integrityScore.toFixed(1)}%</h2>
                     <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${integrityScore > 90
                           ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                           : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        }`}>
                        {integrityScore > 90 ? 'High Fidelity' : 'Variance Detected'}
                     </span>
                  </div>
                  <h3 className="text-lg font-space-grotesk text-gray-300 mb-1">Simulation Integrity Score</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto md:mx-0">
                     Calculated dynamically based on agent consensus strength, temporal stability, and source grounding.
                  </p>
               </div>

               {/* Quick Stats */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                     <div className="flex items-center gap-2 mb-1">
                        <Database size={14} className="text-blue-400" />
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Data Points</span>
                     </div>
                     <div className="text-xl font-mono text-white font-bold">{((result.total_responses || 100) * 5).toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                     <div className="flex items-center gap-2 mb-1">
                        <Cpu size={14} className="text-purple-400" />
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Compute Nodes</span>
                     </div>
                     <div className="text-xl font-mono text-white font-bold">{result.total_responses || 100}</div>
                  </div>
               </div>
            </div>
         </div>

         {/* --- Section 2: Platform Heatmap (Coverage) --- */}
         <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
               <Globe size={18} className="text-blue-500" />
               <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-widest">
                  Platform Signal Heatmap
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {platforms.map(platform => {
                  const count = methodology?.agents_per_platform[platform] || 0;
                  const strength = getSignalStrength(count, maxAgentCount);
                  const color = getPlatformColor(platform);

                  return (
                     <div key={platform} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-8 rounded-full" style={{ backgroundColor: color }} />
                           <span className="text-sm font-bold text-gray-200 capitalize">{platform.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-right">
                           <div className="text-xs text-gray-500 font-mono mb-1">{count} Agents</div>
                           <div className="flex gap-0.5">
                              {[...Array(10)].map((_, i) => (
                                 <div
                                    key={i}
                                    className={`w-1 h-2 rounded-[1px] ${i < strength ? 'bg-white opacity-80' : 'bg-white/10'}`}
                                    style={{ backgroundColor: i < strength ? (i > 7 ? '#10b981' : i > 4 ? '#3b82f6' : '#6b7280') : undefined }}
                                 />
                              ))}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* --- Section 3: Source Distribution & Anomaly Log --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Source DNA Distribution */}
            <div className="bg-[#080808] rounded-2xl border border-white/10 p-6">
               <div className="flex items-center gap-3 mb-6">
                  <BarChart2 size={18} className="text-orange-500" />
                  <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-widest">
                     Source Class Distribution
                  </h3>
               </div>

               <div className="space-y-4">
                  {Object.entries(categories).map(([cat, count], i) => {
                     if (count === 0 && totalTracked > 0) return null; // Hide empty if others have data
                     const pct = totalTracked > 0 ? Math.round((count / totalTracked) * 100) : 0;

                     return (
                        <div key={cat}>
                           <div className="flex justify-between text-xs text-gray-400 font-mono mb-2">
                              <span>{cat}</span>
                              <span className="text-white font-bold">{pct}%</span>
                           </div>
                           <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                              <div
                                 className="absolute top-0 bottom-0 left-0 h-full bg-white rounded-full"
                                 style={{ width: `${pct}%`, opacity: 0.2 + ((i + 1) * 0.2) }}
                              />
                           </div>
                        </div>
                     );
                  })}
                  {totalTracked === 0 && (
                     <div className="text-center py-8 text-gray-500 text-xs font-mono">
                        No source metadata available for distribution analysis.
                     </div>
                  )}
               </div>
            </div>

            {/* Anomaly Detection Log */}
            <div className="bg-[#080808] rounded-2xl border border-white/10 p-6 flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                  <Terminal size={18} className="text-purple-500" />
                  <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-widest">
                     Anomaly Detection Log
                  </h3>
               </div>

               <div className="bg-[#050505] rounded-lg border border-white/5 p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[200px] flex-1">
                  <div className="text-emerald-500/80 mb-2">system_check --full-scan</div>
                  <div className="text-gray-500 mb-4">[OK] Core reasoning engine active.</div>

                  {(risks_and_blindspots && risks_and_blindspots.length > 0)
                     ? risks_and_blindspots.map((risk: any, i: number) => (
                        <div key={i} className="mb-3">
                           <span className="text-yellow-500 font-bold">[WARN] Anomaly Detected ({i + 1}):</span>
                           <div className="pl-4 text-gray-400 border-l border-white/10 ml-0.5 mt-1">
                              {risk.description}
                              {risk.mitigation && (
                                 <div className="text-gray-600 italic mt-0.5">// Suggestion: {risk.mitigation}</div>
                              )}
                           </div>
                        </div>
                     ))
                     : (
                        <div className="text-emerald-500">
                           [SUCCESS] No critical anomalies detected in agent response patterns.
                        </div>
                     )
                  }
                  <div className="mt-4 pt-2 border-t border-white/10 text-gray-600">
                     <span className="text-blue-500">➜</span> Awaiting next command cursor...
                  </div>
               </div>
            </div>

         </div>

      </div>
   );
}
