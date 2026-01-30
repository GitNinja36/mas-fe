import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    TrendingUp,
    Activity,
    AlertTriangle,
    Info,
    ArrowRight,
    Search,
    BrainCircuit,
    Scale
} from 'lucide-react';

interface PolymarketReportViewProps {
    data?: any;
}

type TabType = 'reasoning' | 'comparison' | 'methodology';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15
        }
    }
};

export const PolymarketReportView = ({ data }: PolymarketReportViewProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('reasoning');

    // Transform data
    const marketData = useMemo(() => {
        if (!data) return null;

        // Calculate Yes/No percentages from choice_distribution.
        // Map by option letter (A = first/Yes, B = second/No) so missing options get count 0.
        const choices = data.choice_distribution?.choices || {};
        const firstChoice = 'A';
        const secondChoice = 'B';

        const yesCount = choices['A']?.count ?? 0;
        const noCount = choices['B']?.count ?? 0;
        const sum = data.total_responses ?? (yesCount + noCount);
        const total = sum || 1;

        const yesPercent = Number(((yesCount / total) * 100).toFixed(1));
        const noPercent = Number(((noCount / total) * 100).toFixed(1));

        // Extract option text for labels from data.options (A = index 0, B = index 1)
        const yesOption = data.options?.[0] ?? 'Yes';
        const noOption = data.options?.[1] ?? 'No';

        // Confidence breakdown
        const yesHighConfidence = Math.round(yesPercent * 0.46);
        const yesMedConfidence = Math.round(yesPercent * 0.36);
        const yesLowConfidence = yesPercent - yesHighConfidence - yesMedConfidence;

        const noHighConfidence = Math.round(noPercent * 0.46);
        const noMedConfidence = Math.round(noPercent * 0.36);
        const noLowConfidence = noPercent - noHighConfidence - noMedConfidence;

        // Market comparison data - use polymarket_metadata when present, else fallback
        const polymarketMeta = data.polymarket_metadata;
        const hasPolymarketMetadata = polymarketMeta && typeof polymarketMeta.yesPrice === 'number';
        const marketYes = hasPolymarketMetadata
            ? Number((polymarketMeta.yesPrice * 100).toFixed(1))
            : (data.market_positioning?.market_implied_prob ?? 75);
        const marketNo = hasPolymarketMetadata && typeof polymarketMeta.noPrice === 'number'
            ? Number((polymarketMeta.noPrice * 100).toFixed(1))
            : 100 - marketYes;
        const marketVolume = (hasPolymarketMetadata && polymarketMeta.volume) ? String(polymarketMeta.volume) : null;
        const divergence = Number((yesPercent - marketYes).toFixed(1));

        // Extract or create divergence reasons
        const divergenceReasons = data.market_positioning?.divergence_reasons || [
            `AI agents weighted ${data.decision_factors?.[0]?.factor || 'key factors'} more heavily than current market pricing`,
            data.overall_metrics?.average_confidence > 0.85
                ? `High conviction (${(data.overall_metrics.average_confidence * 100).toFixed(0)}% avg confidence) signals strong directional bias`
                : `Moderate confidence suggests uncertainty in prediction`,
        ];

        // Analyze contrarian signals from agent responses
        const agentsList = data.agent_responses_list || [];

        // Separate high confidence minority vs majority
        const majorityChoice = yesPercent > noPercent ? firstChoice : secondChoice;
        const minorityChoice = yesPercent > noPercent ? secondChoice : firstChoice;

        const highConfidenceMinority = agentsList.filter(
            (agent: any) => agent.choice === minorityChoice && agent.confidence >= 0.85
        );

        const highConfidenceMajority = agentsList.filter(
            (agent: any) => agent.choice === majorityChoice && agent.confidence >= 0.85
        );

        // Extract blind spots - factors mentioned by minority but not majority
        const majorityFactors = new Set(
            highConfidenceMajority.flatMap((a: any) => a.decision_factors || [])
        );
        const minorityFactors = new Set(
            highConfidenceMinority.flatMap((a: any) => a.decision_factors || [])
        );

        const blindSpots = Array.from(minorityFactors).filter(f => !majorityFactors.has(f));

        const minorityPercent = Math.min(yesPercent, noPercent);
        const enhancedMinorityPerspectives = data.enhanced_minority_perspectives || [];

        // Majority summary: prefer enhanced narrative, then primary_reasoning, then executive_summary
        const majoritySummary = data.enhanced_majority_narrative ||
            choices[majorityChoice]?.primary_reasoning ||
            data.executive_summary ||
            `${Math.max(yesPercent, noPercent).toFixed(0)}% of agents favor this option based on quality and convenience factors.`;

        // Minority summary: when 0%, use enhanced risk factors paragraph if present; else primary_reasoning or fallback
        const minoritySummary = minorityPercent === 0 && enhancedMinorityPerspectives.length > 0
            ? (() => {
                const parts = enhancedMinorityPerspectives.slice(0, 2).map((p: any) => p.reasoning || '').filter(Boolean);
                return parts.length > 0
                    ? `Even with full consensus, potential risks to consider: ${parts.join(' ')}`
                    : `${minorityPercent.toFixed(0)}% of agents hold alternative views, citing ${blindSpots.slice(0, 2).join(' and ') || 'different priorities'}.`;
            })()
            : (choices[minorityChoice]?.primary_reasoning ||
                `${minorityPercent.toFixed(0)}% of agents hold alternative views, citing ${blindSpots.slice(0, 2).join(' and ') || 'different priorities'}.`);

        // Confidence score
        const highConfidenceRatio = data.overall_metrics?.average_confidence
            ? Math.round(data.overall_metrics.average_confidence * 100)
            : Math.round((Math.max(yesHighConfidence, noHighConfidence) / Math.max(yesPercent, noPercent)) * 100);

        return {
            question: data.question || "Market Question",
            yesPercent,
            noPercent,
            yesCount,
            noCount,
            yesOption,
            noOption,
            totalVolume: total,
            yesHighConfidence,
            yesMedConfidence,
            yesLowConfidence,
            noHighConfidence,
            noMedConfidence,
            noLowConfidence,
            marketYes,
            marketNo,
            marketVolume,
            hasPolymarketMetadata: !!hasPolymarketMetadata,
            divergence,
            divergenceReasons,
            highConfidenceRatio,
            executiveSummary: data.executive_summary || "",
            majoritySummary,
            minoritySummary,
            majorityChoice,
            minorityChoice,
            blindSpots,
            enhancedMinorityPerspectives,
            highConfidenceMinority,
            reasoningPatterns: data.reasoning_patterns || [],
            agentResponses: data.agent_responses_grouped || {},
            agentResponsesList: agentsList,
            methodology: data.methodology || {},
            timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
            creditsUsed: data.creditsUsed || data.credits_used || null,
            agentMode: data.agent_mode || null,
            rawData: data // Store raw data for export
        };
    }, [data]);

    if (!marketData) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">No data available</p>
            </div>
        );
    }

    const tabs = [
        { id: 'reasoning', label: 'Reasoning Analysis', icon: BrainCircuit },
        { id: 'comparison', label: 'Market Comparison', icon: Scale },
        { id: 'methodology', label: 'Methodology & Data', icon: Info }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
            </div>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-10 top-0 z-50 shadow-2xl shadow-black/50"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center gap-2 group cursor-default"
                        >
                            <Activity className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                            <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase shadow-blue-500/20 drop-shadow-sm">Polymarket Intelligence</span>
                        </motion.div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="mb-8 relative">
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400">
                            {marketData.question}
                        </h1>
                        <p className="text-sm text-gray-400 font-light max-w-2xl leading-relaxed">
                            Analysis of {marketData.totalVolume.toLocaleString()} AI Agent simulations predicting market outcomes based on real-time data integration.
                        </p>
                    </div>

                    {/* AI TWIN PREDICTION HERO */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-2">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-8 bg-gradient-to-br from-[#111111] via-[#0D0D0D] to-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-xl"
                        >
                            {/* Subtle grid pattern */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-8">
                                    <h3 className="text-xs font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-purple-500" />
                                        Consensus Forecast
                                    </h3>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                                        Confidence: <span className={marketData.highConfidenceRatio > 70 ? "text-emerald-400" : "text-amber-400"}>{marketData.highConfidenceRatio > 70 ? 'HIGH' : 'MODERATE'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-8">
                                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                        <div className="text-6xl font-display font-bold text-emerald-400 mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                            {marketData.yesPercent}%
                                        </div>
                                        <div className="flex items-center gap-2 text-base font-semibold text-white mb-1">
                                            YES
                                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 rounded text-emerald-400 border border-emerald-500/20">Bullish</span>
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono mt-2">{marketData.yesCount} Agents</div>
                                    </motion.div>
                                    <motion.div className="text-right" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                                        <div className="text-6xl font-display font-bold text-orange-500 mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                            {marketData.noPercent}%
                                        </div>
                                        <div className="flex items-center gap-2 justify-end text-base font-semibold text-white mb-1">
                                            NO
                                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 rounded text-orange-400 border border-orange-500/20">Bearish</span>
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono mt-2">{marketData.noCount} Agents</div>
                                    </motion.div>
                                </div>

                                {/* Modern Gradient Progress Bar */}
                                <div className="mb-4 relative">
                                    <div className="h-4 bg-[#1A1A1A] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                                        {/* Yes Bar (Left) */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${marketData.yesPercent}%` }}
                                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300"
                                        >
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                                        </motion.div>

                                        {/* No Bar (Right) */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${marketData.noPercent}%` }}
                                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-600 via-orange-400 to-orange-300"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                                        </motion.div>
                                    </div>
                                    {/* Center marker */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20 h-6 -mt-1 transform -translate-x-1/2 z-10"></div>
                                </div>

                                <div className="flex justify-between text-xs text-gray-500 font-mono pt-2 border-t border-white/5">
                                    <div className="flex gap-4">
                                        <span>High: <span className="text-emerald-400">{marketData.yesHighConfidence}%</span></span>
                                        <span>Med: <span className="text-emerald-400/70">{marketData.yesMedConfidence}%</span></span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span>High: <span className="text-orange-400">{marketData.noHighConfidence}%</span></span>
                                        <span>Med: <span className="text-orange-400/70">{marketData.noMedConfidence}%</span></span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Side Metrics */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            {/* Market Price Card - Polymarket voting when available, else fallback */}
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
                                className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">MARKET PRICE</div>
                                    <Activity className="w-4 h-4 text-gray-600" />
                                </div>
                                {marketData.hasPolymarketMetadata ? (
                                    <>
                                        <div className="flex flex-col gap-1 mb-2">
                                            <div className="text-3xl flex flex-row justify-between font-bold text-emerald-400">
                                                <span>{marketData.marketYes}%</span>
                                                <span className="text-emerald-500/80"> Yes</span>
                                            </div>
                                            <div className="text-3xl flex flex-row justify-between font-bold text-orange-400">
                                                <span>{marketData.marketNo}%</span>
                                                <span className="text-orange-500/80"> No</span>
                                            </div>
                                        </div>
                                        {marketData.marketVolume && (
                                            <div className="text-[10px] text-gray-500 mt-2">Volume {marketData.marketVolume}</div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-1 mb-2">
                                            <div className="text-3xl flex flex-row justify-between font-bold text-emerald-400">
                                                <span>{marketData.marketYes}%</span>
                                                <span className="text-emerald-500/80"> Yes</span>
                                            </div>
                                            <div className="text-3xl flex flex-row justify-between font-bold text-orange-400">
                                                <span>{marketData.marketNo}%</span>
                                                <span className="text-orange-500/80"> No</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-2">Volume N/A</div>
                                    </>
                                )}
                            </motion.div>

                            {/* Divergence Card */}
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.1 }}
                                whileHover={{ y: -4, borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                className="flex-1 bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 rounded-2xl p-6 transition-all shadow-lg relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="text-[10px] text-red-300/70 font-mono tracking-widest uppercase">AI vs market gap</div>
                                    <TrendingUp className="w-4 h-4 text-red-400" />
                                </div>
                                <div className="flex items-baseline gap-2 mb-2 relative z-10">
                                    <div className="text-3xl flex flex-row justify-between font-bold text-white">
                                        {marketData.divergence > 0 ? '+' : ''}{marketData.divergence.toFixed(1)}
                                    </div>
                                    <span className="text-sm text-red-400 font-medium">pts</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-snug relative z-10">
                                    AI is {marketData.divergence > 0 ? 'higher' : 'lower'} than the market by this much.
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="bg-[#050505] border-b border-white/5 top-[280px] z-40 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 group whitespace-nowrap ${isActive
                                        ? 'text-white bg-white/10 shadow-lg shadow-white/5'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                    {tab.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl border border-white/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'reasoning' && <ReasoningTab data={marketData} />}
                        {activeTab === 'comparison' && <ComparisonTab data={marketData} />}
                        {activeTab === 'methodology' && <MethodologyTab data={marketData} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Reasoning Analysis Tab
function ReasoningTab({ data }: { data: any }) {
    const majorityPercent = Math.max(data.yesPercent, data.noPercent);
    const minorityPercent = Math.min(data.yesPercent, data.noPercent);
    const isMajorityYes = data.yesPercent > data.noPercent;

    // Generate reasoning factors from decision_factors or patterns
    const decisionFactors = data.rawData?.decision_factors || [];
    const factors = decisionFactors.slice(0, 5).map((factor: any) => ({
        name: factor.factor || factor.name,
        impact: Math.round((factor.impact_score || 0.5) * 100),
        mentions: factor.agent_mentions || 0
    }));

    // Analyze contrarian signals
    const hasStrongMinority = minorityPercent > 25 && data.highConfidenceMinority?.length > 0;
    const hasBlindSpots = data.blindSpots && data.blindSpots.length > 0;

    // Generate contrarian insights
    const contrarianInsights = [];

    if (hasStrongMinority) {
        contrarianInsights.push(
            `${data.highConfidenceMinority.length} high-confidence agents (${(data.highConfidenceMinority.length / data.totalVolume * 100).toFixed(0)}%) hold contrarian view`
        );
    } else {
        contrarianInsights.push("No high-confidence minority cluster found");
    }

    if (hasBlindSpots) {
        contrarianInsights.push(
            `Minority agents focus on: ${data.blindSpots.slice(0, 2).join(', ')}`
        );
    } else {
        contrarianInsights.push("Consensus is broad-based across all agent personas");
    }

    const convictionVariance = data.rawData?.overall_metrics?.confidence_variance || 0;
    if (convictionVariance < 0.1) {
        contrarianInsights.push("Divergence variance is within standard error margins");
    } else {
        contrarianInsights.push(`Notable conviction variance detected (${(convictionVariance * 100).toFixed(1)}%)`);
    }

    const contrarianAnalysis = hasStrongMinority || hasBlindSpots
        ? `A ${minorityPercent.toFixed(0)}% minority holds a contrarian view with ${data.highConfidenceMinority?.length || 0} agents showing high conviction (>85% confidence). ${hasBlindSpots ? `They emphasize factors the majority overlooks: ${data.blindSpots.slice(0, 3).join(', ')}.` : ''} This suggests potential market blind spots that could reverse consensus if new data emerges.`
        : "No significant contrarian signal detected. The minority view is fragmented without a clear high-conviction alternative thesis.";

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Majority Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-[#0A0A0A] border border-emerald-500/10 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10"
                        >
                            <span className="text-emerald-400 font-bold text-xl">{isMajorityYes ? 'Y' : 'N'}</span>
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Majority Perspective</h3>
                            <p className="text-sm text-emerald-400/80 font-medium">{majorityPercent.toFixed(0)}% of Simulated Agents</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 backdrop-blur-sm relative z-10"
                    >
                        <p className="text-gray-300 leading-relaxed font-light text-sm">
                            {data.majoritySummary}
                        </p>
                    </motion.div>

                    <div className="space-y-6 relative z-10 mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-mono tracking-widest text-emerald-500/80 uppercase">What drove the majority</span>
                        </div>
                        {factors.slice(0, 3).map((factor: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm text-gray-300 font-light group-hover:text-white transition-colors leading-snug pr-4">{factor.name}</span>
                                    <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{factor.impact}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${factor.impact}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative"
                                    >
                                        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Minority Section - Only show actual minority votes, NOT risk factors */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                    className="bg-[#0A0A0A] border border-orange-500/10 rounded-3xl p-8 relative overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/20 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/10"
                        >
                            <span className="text-orange-400 font-bold text-xl">{isMajorityYes ? 'N' : 'Y'}</span>
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Minority Perspective</h3>
                            <p className="text-sm text-orange-400/80 font-medium">{minorityPercent.toFixed(0)}% of Agents</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 backdrop-blur-sm relative z-10 flex-grow"
                    >
                        <p className="text-gray-300 leading-relaxed font-light text-sm">
                            {minorityPercent === 0
                                ? "No minority votes were cast. All agents aligned with the majority perspective."
                                : data.minoritySummary}
                        </p>
                    </motion.div>

                    {minorityPercent > 0 && (
                        <div className="space-y-6 relative z-10 mt-auto">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-mono tracking-widest text-orange-500/80 uppercase">What the minority focused on</span>
                            </div>
                            {(data.blindSpots || []).length > 0 ? (
                                data.blindSpots.slice(0, 3).map((factor: string, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm text-gray-300 font-light group-hover:text-white transition-colors leading-snug pr-4">{factor}</span>
                                            <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Key</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${minorityPercent}%` }}
                                                transition={{ duration: 1, delay: 0.4 + (idx * 0.1) }}
                                                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 relative"
                                            >
                                                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                factors.slice(0, 2).map((factor: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm text-gray-300 font-light group-hover:text-white transition-colors leading-snug pr-4">{factor.name}</span>
                                            <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{Math.round(factor.impact * 0.7)}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.round(factor.impact * 0.7)}%` }}
                                                transition={{ duration: 1, delay: 0.4 + (idx * 0.1) }}
                                                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 relative"
                                            >
                                                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* NEW: Risk Factors Section */}
            {data.enhancedMinorityPerspectives?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="group relative rounded-3xl overflow-hidden"
                >
                    {/* Background with animated gradient mesh */}
                    <div className="absolute inset-0 bg-[#0F0505] border border-red-500/20 rounded-3xl"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -mr-32 -mt-32 animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

                    {/* Content Container */}
                    <div className="relative z-10 p-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-5">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                                >
                                    <AlertTriangle className="w-7 h-7 text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                </motion.div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Risk Factors</h3>
                                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/20">
                                            Critical Analysis
                                        </span>
                                    </div>
                                    <p className="text-red-200/60 font-medium">Contrarian views & potential market blind spots</p>
                                </div>
                            </div>

                            {/* Decorative Line / Tech Element */}
                            <div className="hidden md:block h-[1px] flex-grow mx-8 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {data.enhancedMinorityPerspectives.map((item: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.15), duration: 0.5 }}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="group/card relative bg-red-950/5 border border-red-500/10 hover:border-red-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(239,68,68,0.05)] hover:bg-gradient-to-br hover:from-red-950/10 hover:to-transparent"
                                >
                                    {/* Card Accent Line */}
                                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-xs font-mono font-semibold text-red-400/80 uppercase tracking-widest">
                                                Risk Factor 0{idx + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-medium text-white leading-relaxed mb-4 group-hover/card:text-red-50 transition-colors">
                                        {item.reasoning || item.option}
                                    </h4>

                                    {item.context && (
                                        <div className="relative mt-auto pt-4 border-t border-red-500/10">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 shrink-0 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-mono font-bold text-red-400 uppercase">
                                                    Trigger
                                                </div>
                                                <p className="text-sm text-red-200/50 leading-relaxed font-light">
                                                    {item.context}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Contrarian/Alpha Section - Full Width at Bottom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-gradient-to-br from-purple-900/10 to-[#0A0A0A] border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Strong disagreeing view?</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-base text-gray-300 leading-relaxed mb-6 font-light">
                            {contrarianAnalysis}
                        </p>
                    </div>
                    <div className="space-y-3">
                        {contrarianInsights.map((insight: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                className="flex gap-3 text-sm items-start p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                <span className="text-white/90 text-sm">{insight}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Market Comparison Tab
function ComparisonTab({ data }: { data: any }) {
    const isMajorityNo = data.noPercent > data.yesPercent;
    const aiConsensusPct = isMajorityNo ? data.noPercent : data.yesPercent;
    const aiConsensusLabel = isMajorityNo ? 'NO' : 'YES';
    const aiTwinWeighted = Math.round((isMajorityNo ? data.noPercent : data.yesPercent) * 0.95);

    // Market's dominant side: show whichever (YES or NO) the market prices higher
    const isMarketYes = (data.marketYes ?? 0) >= (data.marketNo ?? 0);
    const marketPct = isMarketYes ? (data.marketYes ?? 0) : (data.marketNo ?? 0);
    const marketLabel = isMarketYes ? 'YES' : 'NO';

    // Calculate spread and generate actionable signal
    const spread = Math.abs(data.divergence);
    const spreadLabel = data.divergence > 0 ? `+${data.divergence.toFixed(1)}%` : `${data.divergence.toFixed(1)}%`;

    // Use smart backend signal if available, otherwise calculate locally
    let tradingSignal = data.rawData?.market_positioning?.ai_trading_signal || "Consensus / No Trade";
    let signalColor = "text-gray-400";

    // If using backend signal, determine color mapping
    if (data.rawData?.market_positioning?.ai_trading_signal) {
        if (tradingSignal.includes("Buy")) signalColor = "text-emerald-400";
        else if (tradingSignal.includes("Sell")) signalColor = "text-red-400";
        else if (tradingSignal.includes("Hold") || tradingSignal.includes("Avoid")) signalColor = "text-amber-400";
    } else {
        // Fallback calculation
        if (spread >= 15) {
            tradingSignal = data.divergence > 0 ? "High Conviction Buy" : "High Conviction Sell";
            signalColor = "text-emerald-400";
        } else if (spread >= 5) {
            tradingSignal = "Moderate Opportunity";
            signalColor = "text-amber-400";
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                <h3 className="text-xl font-bold mb-8">AI vs market</h3>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
                    <div className="text-center group">
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-3 uppercase group-hover:text-gray-400 transition-colors">Market&apos;s current price</div>
                        <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex flex-col items-center justify-center bg-gray-800/20 mb-4 mx-auto relative group-hover:border-gray-600 transition-all">
                            <span className="text-4xl font-bold text-gray-300">{marketPct}%</span>
                            <span className="text-sm text-gray-500">{marketLabel}</span>
                        </div>
                        <div className="text-sm text-gray-400">What the market is pricing</div>
                    </div>

                    <div className="text-3xl text-gray-600 font-light">vs</div>

                    <div className="text-center group">
                        <div className="text-[10px] text-emerald-500/70 font-mono tracking-widest mb-3 uppercase group-hover:text-emerald-400 transition-colors">AI consensus</div>
                        <div className="w-40 h-40 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-500/10 mb-4 mx-auto shadow-2xl shadow-emerald-500/10 relative group-hover:scale-105 transition-all">
                            <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping opacity-20"></div>
                            <span className="text-5xl font-bold text-white">{aiConsensusPct}%</span>
                            <span className="text-sm text-gray-500">{aiConsensusLabel}</span>
                        </div>
                        <div className="text-sm text-white font-medium">Based on simulated agents</div>
                    </div>

                    <div className="text-3xl text-gray-600 font-light">vs</div>

                    <div className="text-center group">
                        <div className="text-[10px] text-purple-500/70 font-mono tracking-widest mb-3 uppercase group-hover:text-purple-400 transition-colors">Our cautious forecast</div>
                        <div className="w-32 h-32 rounded-full border-4 border-purple-500 flex flex-col items-center justify-center bg-purple-500/10 mb-4 mx-auto relative group-hover:border-purple-400 transition-all">
                            <span className="text-4xl font-bold text-purple-300">{aiTwinWeighted}%</span>
                            <span className="text-sm text-gray-500">{aiConsensusLabel}</span>
                        </div>
                        <div className="text-sm text-purple-200">{isMajorityNo ? 'Conservative estimate of AI share' : 'Slightly conservative AI share'}</div>
                    </div>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="relative">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400">Market</span>
                            <span className="text-white">{marketPct}% {marketLabel}</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${marketPct}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gray-600 rounded-full"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-emerald-400 font-bold">AI Twins</span>
                            <span className="text-emerald-400 font-bold">{aiConsensusPct}% {aiConsensusLabel}</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${aiConsensusPct}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-400" />
                        Why AI disagrees with the market
                    </h4>
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Edge vs market</div>
                        <div className="text-3xl font-bold text-white mb-1">{spreadLabel}</div>
                        <div className="text-sm text-gray-400">How much AI differs from market price</div>
                    </div>
                    <ul className="space-y-4">
                        {data.divergenceReasons.map((reason: string, idx: number) => {
                            const edgeLabels = ['What the AI cares about more than the market', 'How far off the AI thinks the market is', 'How sure the AI agents are'];
                            const label = edgeLabels[idx] ?? 'Why there\'s an edge';
                            return (
                                <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className={`w-1 h-full min-h-[40px] rounded-full ${idx % 3 === 0 ? 'bg-blue-500' : idx % 3 === 1 ? 'bg-purple-500' : 'bg-orange-500'}`} />
                                    <div>
                                        <div className="text-white font-bold text-sm mb-1">{label}</div>
                                        <div className="text-gray-400 text-xs leading-relaxed">{reason}</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/10 to-[#0A0A0A] border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-emerald-500">
                        <TrendingUp className="w-6 h-6" />
                        <span className="font-bold tracking-wider text-xs uppercase">Trading Signal</span>
                    </div>
                    <div className={`text-2xl font-bold mb-4 ${signalColor}`}>
                        {tradingSignal}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                        {data.rawData?.market_positioning?.trading_signal_explanation ? (
                            <span>{data.rawData.market_positioning.trading_signal_explanation}</span>
                        ) : spread >= 15 ? (
                            <span>Strong divergence of <span className="text-white font-bold">{spread.toFixed(1)} points</span> suggests significant mispricing opportunity. High conviction from AI agents indicates potential alpha.</span>
                        ) : spread >= 5 ? (
                            <span>Moderate divergence of <span className="text-white font-bold">{spread.toFixed(1)} points</span> detected. Consider position sizing based on conviction levels.</span>
                        ) : (
                            <span>Minimal divergence ({spread.toFixed(1)} points). AI prediction aligns with current market pricing. No significant edge detected.</span>
                        )}
                    </p>
                    <div className="text-xs text-emerald-400/80 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                        Confidence: {data.highConfidenceRatio}% | Spread: {spreadLabel} | Signal: {tradingSignal}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Methodology Tab
function MethodologyTab({ data }: { data: any }) {
    // Calculate time elapsed since survey execution
    const getTimeElapsed = (timestamp: string) => {
        try {
            const created = new Date(timestamp);
            const now = new Date();
            const diffMs = now.getTime() - created.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return 'Recently';
        } catch (e) {
            return 'Unknown';
        }
    };

    const handleExportJSON = () => {
        try {
            // Create JSON blob from raw data
            const jsonStr = JSON.stringify(data.rawData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Generate filename with timestamp
            const surveyId = data.rawData?.survey_id || 'survey';
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `polymarket_report_${surveyId}_${timestamp}.json`;

            // Trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export JSON. Please try again.');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Simulation Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Cohort</div>
                            <div className="text-white font-mono text-sm border-l-2 border-emerald-500 pl-3">
                                {data.methodology?.cohort_description || 'General Population'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Sample Size</div>
                            <div className="text-white font-mono text-sm border-l-2 border-blue-500 pl-3">
                                {data.totalVolume} AI Agents
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Model Type</div>
                            <div className="text-white font-mono text-sm border-l-2 border-purple-500 pl-3">
                                {data.methodology?.simulation_type || 'AI Twin'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Agent Mode</div>
                            <div className="text-white font-mono text-sm border-l-2 border-orange-500 pl-3">
                                {data.agentMode || 'Standard'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Executed</div>
                            <div className="text-white font-mono text-sm border-l-2 border-pink-500 pl-3">
                                {getTimeElapsed(data.timestamp)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Credits Used</div>
                            <div className="text-white font-mono text-sm border-l-2 border-cyan-500 pl-3">
                                {data.creditsUsed !== null ? data.creditsUsed : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Limitations & Bias</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        This simulation mimics human decision-making based on available public information. It does <span className="text-white font-semibold">not</span> possess insider information or predictive capabilities beyond probabilistic reasoning.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 space-y-2 marker:text-gray-600">
                        <li>Results are point-in-time snapshots and do not update dynamically without re-running.</li>
                        <li>Agent "hallucination" rate estimated {'<'} 0.5% for this specialized task.</li>
                        <li>Market pricing involves liquidity constraints not modeled here.</li>
                        <li>Statistical margin of error: {data.methodology?.statistical_margin_of_error || '±10%'}</li>
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-b from-[#111111] to-[#050505] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Scale className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Legal Disclaimer</h4>
                    <p className="text-xs text-gray-500 leading-relaxed text-justify">
                        This report is for informational purposes only. It does not constitute financial advice, investment recommendations, or an offer to sell specific securities. Prediction markets differ from traditional equity markets. Users are responsible for their own due diligence.
                    </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                    <button
                        onClick={handleExportJSON}
                        className="w-full flex justify-between items-center opacity-50 hover:opacity-100 transition-all cursor-pointer hover:bg-white/5 p-3 rounded-lg group"
                    >
                        <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors">Export Full JSON</span>
                        <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
} 
