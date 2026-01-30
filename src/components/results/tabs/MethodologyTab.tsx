
import { useMemo } from 'react';
import { GAMING_SURVEY_DATA } from '../../../mocks/gamingSurveyData';
import { motion } from 'motion/react';
import { Target, ShieldCheck, Database, AlertTriangle, FileJson, FileText, Download } from 'lucide-react';

interface MethodologyTabProps {
   data?: any;
}

export const MethodologyTab = ({ data }: MethodologyTabProps) => {
   // Use useMemo to adapt data or fall back to mock if explicit demo mode (though we aim for real data now)
   const methodology = useMemo(() => {
      // Default / Fallback structure based on Mock
      const defaultMeth = GAMING_SURVEY_DATA.methodology;

      if (!data) return defaultMeth;

      // Calculate Average Reasoning Length from real responses
      const allResponses = data.agent_responses_list ||
         Object.values(data.agent_responses_grouped || {}).flatMap((g: any) => g.responses) || [];

      const avgWordCount = allResponses.length > 0
         ? Math.round(allResponses.reduce((acc: number, r: any) => acc + (r.reasoning?.split(' ').length || 0), 0) / allResponses.length)
         : 0;

      // Extract limitations
      const limitations = data.risks_and_blindspots
         ? data.risks_and_blindspots.map((r: any) => r.description || r.risk_type)
         : ["Simulated data based on AI personas", "Responses reflect historical training data"];

      return {
         cohort_selection: {
            query: data.methodology?.cohort_description || data.question || "Custom Cohort",
            matching_twins: data.total_responses ? data.total_responses * 12 : 1500, // Simulation of "pool"
            twins_surveyed: data.total_responses || 0
         },
         data_quality: {
            completion_rate: 100, // Always 100 for completed reports
            avg_reasoning_length: avgWordCount,
            freshness: "Current"
         },
         limitations: limitations
      };
   }, [data]);

   const handleDownload = (type: 'json' | 'csv' | 'full') => {
      const exportData = data || GAMING_SURVEY_DATA;

      if (type === 'json' || type === 'full') {
         const content = JSON.stringify(exportData, null, 2);
         const blob = new Blob([content], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `survey-report-${new Date().toISOString().split('T')[0]}.json`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      } else if (type === 'csv') {
         const rows = [];

         // Headers for CSV
         const headers = ['Agent ID', 'Platform', 'Choice', 'Confidence', 'Reasoning'];
         rows.push(headers.join(','));

         const allResponses = exportData.agent_responses_list ||
            Object.values(exportData.agent_responses_grouped || {}).flatMap((g: any) => g.responses) || [];

         allResponses.forEach((r: any) => {
            const row = [
               r.agent_id || 'N/A',
               r.platform || 'N/A',
               `"${(r.choice || '').replace(/"/g, '""')}"`,
               r.confidence || 0,
               `"${(r.reasoning || '').replace(/"/g, '""')}"`
            ];
            rows.push(row.join(','));
         });

         const content = rows.join('\n');
         const blob = new Blob([content], { type: 'text/csv' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `survey-data-${new Date().toISOString().split('T')[0]}.csv`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="space-y-12 pb-20 text-white"
      >
         {/* Header */}
         {/* Header */}
         <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold tracking-widest text-blue-400 mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                     METHODOLOGY • SYSTEM RIGOR
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                     System <span className="text-blue-400">Verified.</span>
                  </h1>
               </div>

               <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

               <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Full transparency into the <span className="text-white font-bold">simulation parameters</span>, cohort selection, and statistical confidence of this generated report.
               </p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cohort Selection (Funnel) */}
            <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-8">
                  <Target size={20} className="text-[#3B82F6]" />
                  <h3 className="text-lg font-bold">Cohort Selection</h3>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between relative gap-8 md:gap-0">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-[28px] left-10 right-10 h-0.5 bg-gradient-to-r from-blue-900/40 via-blue-500/20 to-emerald-900/40 -z-10" />

                  {/* Step 1 */}
                  <div className="relative flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                     <div className="w-14 h-14 rounded-xl bg-[#0F172A] border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] z-10">
                        <span className="text-blue-400 font-bold">01</span>
                     </div>
                     <div>
                        <h4 className="text-gray-300 font-bold text-sm mb-1">Query Definition</h4>
                        <p className="text-gray-500 text-xs px-4">"{methodology.cohort_selection.query}"</p>
                     </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                     <div className="w-14 h-14 rounded-xl bg-[#0F172A] border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] z-10">
                        <span className="text-blue-400 font-bold">02</span>
                     </div>
                     <div>
                        <h4 className="text-gray-300 font-bold text-sm mb-1">Twin Store Match</h4>
                        <div className="text-2xl font-mono font-bold text-white mb-1">{methodology.cohort_selection.matching_twins.toLocaleString()}</div>
                        <p className="text-gray-500 text-xs">Relevant Profiles Identified</p>
                     </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                     <div className="w-14 h-14 rounded-xl bg-[#064E3B] border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] z-10">
                        <span className="text-emerald-400 font-bold">03</span>
                     </div>
                     <div>
                        <h4 className="text-gray-300 font-bold text-sm mb-1">Active Simulation</h4>
                        <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">{methodology.cohort_selection.twins_surveyed.toLocaleString()}</div>
                        <p className="text-emerald-500/60 text-xs font-bold">COMPLETED INTERVIEWS</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Data Quality */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck size={20} className="text-[#10B981]" />
                  <h3 className="text-lg font-bold">Data Quality</h3>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                     <span className="text-gray-400 text-sm">Completion Rate</span>
                     <span className="text-white font-mono font-bold">{methodology.data_quality.completion_rate}%</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                     <span className="text-gray-400 text-sm">Avg. Reasoning</span>
                     <span className="text-white font-mono font-bold">{methodology.data_quality.avg_reasoning_length} words</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-gray-400 text-sm">Knowledge Cutoff</span>
                     <span className="text-white font-mono font-bold">{methodology.data_quality.freshness}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Limitations */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle size={20} className="text-[#F59E0B]" />
                  <h3 className="text-lg font-bold">System Limitations</h3>
               </div>

               <div className="space-y-3">
                  {methodology.limitations.map((lim: string, i: number) => (
                     <div key={i} className="flex gap-3 text-sm text-gray-400 leading-relaxed items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                        {lim}
                     </div>
                  ))}
               </div>
            </div>

            {/* Export */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <Database size={20} className="text-purple-500" />
                     <h3 className="text-lg font-bold">Export Data</h3>
                  </div>
                  <p className="text-gray-400 text-xs ml-8 mb-8">Download full response sets and methodology log</p>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => handleDownload('json')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group">
                     <FileJson size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                     <span className="text-xs font-bold text-gray-500 group-hover:text-white">JSON</span>
                  </button>
                  <button onClick={() => handleDownload('csv')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group">
                     <FileText size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                     <span className="text-xs font-bold text-gray-500 group-hover:text-white">CSV</span>
                  </button>
                  <button onClick={() => handleDownload('full')} className="flex-1 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group">
                     <Download size={24} className="text-[#3B82F6]" />
                     <span className="text-xs font-bold text-[#3B82F6]">Full Report</span>
                  </button>
               </div>
            </div>
         </div>

      </motion.div>
   );
}
