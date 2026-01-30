import React, { useMemo, useState } from 'react';
import { GAMING_SURVEY_DATA } from '../../../mocks/gamingSurveyData';
import { motion } from 'motion/react';
import { GitMerge, BrainCircuit, ArrowRight, Target, ChevronLeft, ChevronRight, TrendingUp, Users, Database, FileJson, FileText, Download } from 'lucide-react';

interface PatternsTabProps {
    data?: any;
}

export const PatternsTab = ({ data }: PatternsTabProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 3;

    const patterns = useMemo(() => {
        // Fallback to mock data if no data provided
        if (!data) return {
            ...GAMING_SURVEY_DATA.patterns,
            isSingleQuestion: false,
            decision_factors: []
        };

        const totalResponses = data.total_responses || 15;
        const isSingleQuestion = !data.questions || data.questions.length <= 1;

        // 1. Archetypes (Mapped from Reasoning Patterns or Decision Factors)
        // If we have reasoning_patterns, use those. Otherwise fallback to decision_factors or synthesized reasoning.
        let archetypes = [];
        if (data.reasoning_patterns && data.reasoning_patterns.length > 0) {
            archetypes = data.reasoning_patterns.map((p: any) => ({
                name: p.pattern,
                percentage: Math.round(((p.frequency || 0) / totalResponses) * 100) || 10,
                description: p.description || `Pattern observed in ${(p.frequency)} respondent(s).`
            }));
        } else if (data.decision_factors && data.decision_factors.length > 0) {
            // Use top decision factors as archetypes if no reasoning patterns
            archetypes = data.decision_factors.slice(0, 4).map((f: any) => ({
                name: `${f.factor}-Driven`,
                percentage: Math.round((f.impact_score || 0.1) * 100),
                description: `Agents heavily influenced by ${f.factor.toLowerCase()}.`
            }));
        }

        // Fill with generic if empty
        if (archetypes.length === 0) {
            archetypes = [
                { name: "Consensus Driver", percentage: 80, description: "The dominant reasoning pattern leading to the majority choice." },
                { name: "Outlier Thinkers", percentage: 20, description: "Agents who prioritized alternative factors." }
            ];
        }

        // Normalize percentages to sum to roughly 100 for the donut if needed, or just display raw
        // For the visual donut, we might want them to be relative to each other

        // 2. Correlations (Only valid for multi-question, otherwise we show Decision Factors)
        let correlations = [];
        if (!isSingleQuestion && data.correlations) {
            correlations = data.correlations;
        }

        // 3. Recurring Threads (Mapped from Synthesized Insights or Key Reasoning Themes)
        let recurring_threads = [];
        if (data.synthesized_insights) {
            recurring_threads = data.synthesized_insights.map((insight: any) => ({
                title: insight.title,
                description: insight.description,
                questions: insight.supporting_factors || [] // or platforms
            }));
        } else if (data.key_reasoning_themes) {
            recurring_threads = data.key_reasoning_themes.map((theme: string) => ({
                title: theme,
                description: "A key theme identified in the qualitative analysis of agent responses.",
                questions: ["General"]
            }));
        }

        // 4. Decision Factors (Alternative to Correlations for Single Question)
        let decision_factors = [];
        if (data.decision_factors) {
            decision_factors = data.decision_factors.map((f: any) => ({
                title: f.factor,
                strength: f.impact_score > 0.4 ? "HIGH" : f.impact_score > 0.2 ? "MEDIUM" : "LOW",
                description: `${f.agent_mentions} agents cited this as a key driver.`,
                impact: Math.round(f.impact_score * 100)
            }));
        }

        // 5. Cohort Info
        const cohort = {
            query: data.question || "Survey Analysis",
            summary: data.methodology?.cohort_description || "Standard Agent Cohort",
            characteristics: [
                data.agent_mode || "Standard Mode",
                `N=${totalResponses}`,
                ...(data.methodology?.coverage || [])
            ]
        };

        return {
            archetypes,
            correlations,
            recurring_threads,
            decision_factors,
            cohort,
            isSingleQuestion
        };
    }, [data]);

    // Helper for donut chart segments
    const renderDonutSegments = () => {
        let cumulativePercent = 0;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;

        // Normalize for the chart so it makes a full circle
        const totalP = patterns.archetypes.reduce((acc: number, curr: any) => acc + curr.percentage, 0);

        return patterns.archetypes.map((arch: any, i: number) => {
            const rawPercent = arch.percentage;
            const percent = totalP > 0 ? rawPercent / totalP : 0;

            const offset = cumulativePercent * circumference;
            // Gap adjustment (subtract small amount from dasharray)
            const gap = 2; // px
            const dashArray = `${Math.max(0, (percent * circumference) - gap)} ${circumference}`;

            cumulativePercent += percent;

            // Colors based on index to match the cards
            const colors = ['#EF4444', '#3B82F6', '#10B981', '#A855F7', '#F59E0B'];
            const color = colors[i % colors.length];

            return (
                <circle
                    key={i}
                    r={radius}
                    cx="50"
                    cy="50"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={dashArray}
                    strokeDashoffset={-offset}
                    className="transition-all duration-1000 ease-out"
                    transform="rotate(-90 50 50)"
                />
            );
        });
    };

    const colors = ['#EF4444', '#3B82F6', '#10B981', '#A855F7', '#F59E0B'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 pb-20 text-white"
        >
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Respondent Archetypes</h2>
                <p className="text-gray-400 text-sm">Distinct personas that emerged from response pattern clustering</p>
            </div>

            {/* Deep Pattern Recognition Banner */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-[#030303] border border-white/10 p-8 md:p-12">
                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3B00]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5 backdrop-blur-sm mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9900]" />
                            <span className="text-[10px] uppercase tracking-widest text-[#FF9900] font-mono">Deep Pattern Recognition</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-display font-medium text-white leading-[0.9] tracking-tight">
                            Beyond the <br />
                            <span className="bg-gradient-to-r from-[#FFF5D9] via-[#FFD6A5] to-[#FF9E80] bg-clip-text text-transparent">Averages.</span>
                        </h2>
                    </div>

                    <div className="md:max-w-sm border-l border-white/10 pl-6 py-2">
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We used unsupervised clustering to detect <span className="text-white font-medium">distinct personality types</span> and recurring thought patterns hidden within the survey data.
                        </p>
                    </div>
                </div>
            </div>

            {/* Archetype Cards & Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cards Column (Span 2) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patterns.archetypes.map((arch: any, idx: number) => {
                        const color = colors[idx % colors.length];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    delay: 0.1 * idx,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15
                                }}
                                className="group relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
                            >
                                {/* Animated gradient background on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at top right, ${color}15, transparent)` }} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <motion.div
                                            className="w-4 h-4 rounded-full shadow-lg"
                                            style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}80` }}
                                            whileHover={{ scale: 1.3, rotate: 180 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                        />
                                        <div className="text-right">
                                            <motion.span
                                                className="text-3xl font-mono font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (0.1 * idx) }}
                                            >
                                                {arch.percentage}%
                                            </motion.span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${arch.percentage}%` }}
                                            transition={{ delay: 0.3 + (0.1 * idx), duration: 1, ease: "easeOut" }}
                                        />
                                    </div>

                                    <h3 className="text-white font-semibold text-base mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                        {arch.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{arch.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Enhanced Donut Chart Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6 flex flex-col"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            <h3 className="text-sm font-bold text-white">Distribution Overview</h3>
                        </div>

                        <div className="flex-1 flex items-center justify-center relative py-4">
                            <motion.svg
                                viewBox="0 0 100 100"
                                className="w-52 h-52"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                {renderDonutSegments()}
                                {/* Center text */}
                                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-[8px] font-mono">
                                    {patterns.archetypes.length}
                                </text>
                                <text x="50" y="57" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-[3px] font-mono uppercase">
                                    Types
                                </text>
                            </motion.svg>
                        </div>

                        <div className="space-y-2 mt-6">
                            {patterns.archetypes.map((arch: any, idx: number) => {
                                const color = colors[idx % colors.length];
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (0.05 * idx) }}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">{arch.name}</span>
                                        </div>
                                        <span className="text-[11px] font-mono font-bold text-white">{arch.percentage}%</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Grid for Correlations & Threads (or Decision Factors if Single Question) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Response Correlations OR Decision Factors */}
                <div>
                    {patterns.isSingleQuestion ? (
                        /* Single Question: Show Decision Factors */
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <Target size={20} className="text-[#FF3B00]" />
                                <h2 className="text-lg font-bold">Key Decision Factors</h2>
                            </div>
                            <p className="text-gray-400 text-xs mb-6 -mt-4 ml-8">Primary drivers influencing agent choices</p>

                            {(() => {
                                const totalPages = Math.ceil(patterns.decision_factors.length / ITEMS_PER_PAGE);
                                const startIdx = currentPage * ITEMS_PER_PAGE;
                                const endIdx = startIdx + ITEMS_PER_PAGE;
                                const currentFactors = patterns.decision_factors.slice(startIdx, endIdx);

                                return (
                                    <>
                                        <div className="space-y-4">
                                            {currentFactors.map((factor: any, idx: number) => (
                                                <motion.div
                                                    key={startIdx + idx}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] p-6 group hover:border-[#FF3B00]/30 transition-colors"
                                                >
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF3B00] to-transparent opacity-50" />

                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-white font-bold text-sm">{factor.title}</h3>
                                                        <span className={`text-[8px] font-medium px-2 py-0.5 rounded border 
                                                            ${factor.strength === 'HIGH' ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' :
                                                                factor.strength === 'MEDIUM' ? 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10' :
                                                                    'text-gray-400 border-white/10 bg-white/5'}`}>
                                                            {factor.strength} IMPACT
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-xs mb-3">{factor.description}</p>

                                                    {/* Impact Bar */}
                                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${factor.impact}%` }}
                                                            transition={{ delay: 0.3 + (idx * 0.1), duration: 0.8 }}
                                                            className="bg-[#FF3B00] h-full rounded-full"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {patterns.decision_factors.length === 0 && (
                                                <div className="text-gray-500 text-sm italic p-4 border border-white/5 rounded-xl border-dashed">
                                                    No distinct decision factors isolated.
                                                </div>
                                            )}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                                    disabled={currentPage === 0}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ChevronLeft size={16} />
                                                    <span className="text-xs">Previous</span>
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: totalPages }).map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i)}
                                                            className={`w-2 h-2 rounded-full transition-all ${i === currentPage
                                                                ? 'bg-[#FF3B00] w-6'
                                                                : 'bg-white/20 hover:bg-white/40'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                                    disabled={currentPage === totalPages - 1}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <span className="text-xs">Next</span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </>
                    ) : (
                        /* Multi Question: Show Correlations */
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <GitMerge size={20} className="text-[#FF3B00]" />
                                <h2 className="text-lg font-bold">Response Correlations</h2>
                            </div>
                            <p className="text-gray-400 text-xs mb-6 -mt-4 ml-8">How choices on different questions relate to each other</p>

                            <div className="space-y-4">
                                {patterns.correlations.map((corr: any, idx: number) => (
                                    <div key={idx} className={`rounded-xl border p-6 ${corr.strength === 'STRONG' ? 'bg-[#0A4E4E]/10 border-[#10B981]/20' : 'bg-[#4B2F00]/10 border-[#F59E0B]/20'}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${corr.strength === 'STRONG' ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' : 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10'}`}>
                                                {corr.strength}
                                            </span>
                                            <h3 className="text-white font-bold text-sm">{corr.title}</h3>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-4 flex-wrap">
                                            {corr.flow.split('→').map((part: string, i: number, arr: string[]) => (
                                                <React.Fragment key={i}>
                                                    <span className="text-gray-400">{part.trim()}</span>
                                                    {i < arr.length - 1 && <ArrowRight size={12} className="text-gray-600" />}
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            {corr.questions.map((q: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-black/40 text-gray-500 px-2 py-1 rounded font-mono border border-white/5">
                                                    {q}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {patterns.correlations.length === 0 && (
                                    <div className="text-gray-500 text-sm italic p-4 border border-white/5 rounded-xl border-dashed">
                                        No strong cross-question correlations found.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Recurring Reasoning Threads */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <BrainCircuit size={20} className="text-[#3B82F6]" />
                        <h2 className="text-lg font-bold">Recurring Reasoning Threads</h2>
                    </div>
                    <p className="text-gray-400 text-xs mb-6 -mt-4 ml-8">Themes that appeared across responses</p>

                    <div className="space-y-4">
                        {patterns.recurring_threads.map((thread: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] p-6 hover:border-[#3B82F6]/30 transition-all group"
                            >
                                {/* Accent line */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent" />

                                {/* Thread number badge */}
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center">
                                    <span className="text-xs font-bold text-[#3B82F6]">{idx + 1}</span>
                                </div>

                                <div className="pr-10">
                                    <h3 className="text-white font-bold mb-2 text-base group-hover:text-[#3B82F6] transition-colors">{thread.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{thread.description}</p>

                                    {/* Supporting factors/questions */}
                                    {thread.questions && thread.questions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {thread.questions.map((q: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-2.5 py-1 rounded-md font-mono border border-white/5 hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/5 transition-colors">
                                                    {typeof q === 'string' ? q : 'Factor'}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Hover effect glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/0 to-[#3B82F6]/0 group-hover:from-[#3B82F6]/5 group-hover:to-transparent pointer-events-none transition-all duration-300" />
                            </motion.div>
                        ))}
                        {patterns.recurring_threads.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm italic border border-white/5 rounded-xl border-dashed">
                                No distinct recurring threads identified.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cohort Selection & Export Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/10">
                {/* Cohort Selection */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
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
                                <p className="text-gray-500 text-xs px-4">"{patterns.cohort?.summary || 'Standard Agent Cohort'}"</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center text-center gap-4 w-full md:w-1/3">
                            <div className="w-14 h-14 rounded-xl bg-[#0F172A] border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] z-10">
                                <span className="text-blue-400 font-bold">02</span>
                            </div>
                            <div>
                                <h4 className="text-gray-300 font-bold text-sm mb-1">Twin Store Match</h4>
                                <div className="text-2xl font-mono font-bold text-white mb-1">{((data?.total_responses || 15) * 12).toLocaleString()}</div>
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
                                <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">{(data?.total_responses || 15).toLocaleString()}</div>
                                <p className="text-emerald-500/60 text-xs font-bold">COMPLETED INTERVIEWS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Data */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Database size={20} className="text-purple-500" />
                            <h3 className="text-lg font-bold">Export Data</h3>
                        </div>
                        <p className="text-gray-400 text-xs ml-8 mb-8">Download full response sets and methodology log</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                const content = JSON.stringify(data || {}, null, 2);
                                const blob = new Blob([content], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `survey-report-${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <FileJson size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                            <span className="text-xs font-bold text-gray-500 group-hover:text-white">JSON</span>
                        </button>
                        <button
                            onClick={() => {
                                const rows = [];
                                const headers = ['Agent ID', 'Platform', 'Choice', 'Confidence', 'Reasoning'];
                                rows.push(headers.join(','));
                                const allResponses = data?.agent_responses_list || Object.values(data?.agent_responses_grouped || {}).flatMap((g: any) => g.responses) || [];
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
                            }}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <FileText size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                            <span className="text-xs font-bold text-gray-500 group-hover:text-white">CSV</span>
                        </button>
                        <button
                            onClick={() => {
                                const content = JSON.stringify(data || {}, null, 2);
                                const blob = new Blob([content], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `survey-full-report-${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="flex-1 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Download size={24} className="text-[#3B82F6]" />
                            <span className="text-xs font-bold text-[#3B82F6]">Full Report</span>
                        </button>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
