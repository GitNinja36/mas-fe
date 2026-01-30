import { useState } from 'react';
import {
    MessageSquare,
    TrendingUp,
    Quote,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import type { EnhancedManagerSurveyResponse, DetailedAgentResponse } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface UserResponsesTabProps {
    result: EnhancedManagerSurveyResponse;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 50,
            damping: 20
        } as const
    }
};

export function UserResponsesTab({ result }: UserResponsesTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterChoice, setFilterChoice] = useState<string>('all');

    // Flatten responses
    const allResponses = result.agent_responses_list ||
        Object.values(result.agent_responses_grouped || {}).flatMap(g => g.responses);

    // Filter logic
    const filteredResponses = allResponses.filter(response => {
        const matchesSearch = response.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
            response.agent_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChoice = filterChoice === 'all' || response.choice === filterChoice;
        return matchesSearch && matchesChoice;
    });

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredResponses.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const anchor = document.getElementById('responses-feed-anchor');
            if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const uniqueChoices = Array.from(new Set(allResponses.map(r => r.choice))).sort();

    // Pulse/Stats Calculation for visible items
    const visibleChoices = currentItems.reduce((acc, item) => {
        acc[item.choice] = (acc[item.choice] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-12 pb-24">

            {/* Header: Editorial Context - Reimagined */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-[#050505] border border-white/5 shadow-2xl"
            >
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-[#050505] to-[#050505]" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/6 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 p-10 md:p-14 flex flex-col items-start gap-10">
                    <div className="w-full">
                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-[11px] uppercase font-mono tracking-widest text-orange-300 font-semibold">Live Feed • Qualitative Data</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
                            <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-[0.9] flex-shrink-0">
                                Direct from <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-white">the Source.</span>
                            </h2>

                            <div className="h-full pb-2">
                                <p className="text-lg text-gray-400 font-light leading-relaxed max-w-lg border-l-2 border-white/10 pl-6">
                                    Dive into the raw reasoning streams of <span className="text-white font-medium">{allResponses.length} distinct AI agents</span>.
                                    Understand the "why" behind every decision through platform-specific lenses.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="w-full pt-8 border-t border-white/5 flex flex-wrap gap-8 md:gap-16">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Total Voices</div>
                            <div className="text-2xl font-mono text-white">{allResponses.length}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Unique Perspectives</div>
                            <div className="text-2xl font-mono text-white">{uniqueChoices.length}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Current View</div>
                            <div className="flex items-center gap-3">
                                {Object.entries(visibleChoices).map(([choice, count]) => (
                                    <div key={choice} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                        <span className={`w-1.5 h-1.5 rounded-full ${choice === 'A' ? 'bg-emerald-500' :
                                            choice === 'B' ? 'bg-blue-500' :
                                                choice === 'C' ? 'bg-purple-500' : 'bg-amber-500'
                                            }`} />
                                        <span className="text-white font-mono text-sm font-bold">{choice}:</span>
                                        <span className="text-gray-400 font-mono text-xs">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Controls Toolbar - Redesigned to be Floating & Clean */}
            <div id="responses-feed-anchor" className="sticky top-6 z-30 mb-8 pointer-events-none">
                <div className="pointer-events-auto bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row justify-between gap-4 items-center max-w-5xl mx-auto ring-1 ring-white/5">

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
                        <button
                            onClick={() => setFilterChoice('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 ${filterChoice === 'all'
                                ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            All
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        {uniqueChoices.map(c => (
                            <button
                                key={c}
                                onClick={() => { setFilterChoice(c); setCurrentPage(1); }}
                                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${filterChoice === c
                                    ? 'bg-white/10 text-white border border-white/20 shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${c === 'A' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    c === 'B' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                                        c === 'C' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                    }`} />
                                Option {c}
                            </button>
                        ))}
                    </div>

                    {/* Search - Compact */}
                    <div className="relative w-full md:w-64 mr-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 transition-all font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* The Feed */}
            <AnimatePresence mode="wait">
                {currentItems.length > 0 ? (
                    <motion.div
                        key={currentPage + filterChoice + searchTerm}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {currentItems.map((response, idx) => (
                            <MagazineCard key={`${response.agent_id}-${idx}`} response={response} idx={idx} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 bg-[#0A0A0A] rounded-[2rem] border border-white/5 border-dashed"
                    >
                        <MessageSquare className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                        <p className="text-gray-500 font-mono text-sm mb-6">No perspectives found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterChoice('all'); }}
                            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-mono hover:bg-white/10 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-8 mt-16 py-8 border-t border-white/5">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-mono uppercase tracking-wider font-bold">Prev</span>
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Simple logic for sliding window could be added, here just showing first 5 or logic can be complex
                            // For simplicity, let's just show a range around current page
                            let p = i + 1;
                            if (totalPages > 5) {
                                if (currentPage > 3) p = currentPage - 2 + i;
                                if (p > totalPages) p = totalPages - (4 - i);
                            }

                            if (p < 1) return null;

                            return (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono transition-all duration-300 ${currentPage === p
                                        ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110'
                                        : 'bg-[#0A0A0A] border border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="text-xs font-mono uppercase tracking-wider font-bold">Next</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
}


function MagazineCard({ response, idx }: { response: DetailedAgentResponse, idx: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Aesthetic mapping for choice badges
    const getChoiceStyle = (c: string) => {
        const map: Record<string, string> = {
            'A': 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-500/20 ring-emerald-500/40',
            'B': 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20 ring-blue-500/40',
            'C': 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/20 ring-purple-500/40',
            'D': 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-amber-500/20 ring-amber-500/40',
        };
        // Default with a generic gradient if not A-D
        return map[c] || 'bg-gradient-to-br from-gray-600 to-gray-700 text-white ring-gray-600/40';
    };

    const fullReasoning = response.reasoning.replace(/^[\"']|[\"']$/g, '');
    const isLongText = fullReasoning.length > 220;
    const displayText = isExpanded ? fullReasoning : fullReasoning.substring(0, 220) + (isLongText ? '...' : '');

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative flex flex-col h-full bg-[#0A0A0A] rounded-[24px] border border-white/5 p-1 hover:border-white/10 transition-all duration-500"
        >
            <div className="relative h-full bg-[#080808] rounded-[20px] p-7 overflow-hidden flex flex-col z-10 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/60">

                {/* Subtle top gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                {/* Animated glow effect on hover */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)` }}
                />

                {/* Header: Choice Badge */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold font-mono shadow-lg ring-1 ${getChoiceStyle(response.choice)}`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {response.choice}
                        </motion.div>
                        <div>
                            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Choice Made</div>
                            <div className="font-bold text-white text-sm">Option {response.choice}</div>
                        </div>
                    </div>

                    <motion.div
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                    >
                        <TrendingUp size={12} className="text-gray-500" />
                        <span className={`text-xs font-mono font-bold ${response.confidence > 0.8 ? 'text-emerald-400' : response.confidence > 0.6 ? 'text-amber-400' : 'text-gray-400'}`}>
                            {(response.confidence * 100).toFixed(0)}%
                        </span>
                    </motion.div>
                </div>

                {/* Content Body */}
                <div className="flex-1 relative">
                    <Quote size={20} className="text-white/10 absolute -left-1 -top-2" />
                    <motion.p
                        className="text-[15px] text-gray-300 leading-relaxed font-light pl-6 relative z-10"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                    >
                        {displayText}
                    </motion.p>
                </div>

                {/* Footer Metadata */}
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="px-2 py-1 rounded-md bg-white/5 border border-white/5 flex items-center gap-1.5"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="text-[10px] font-mono text-gray-500">CONFIDENCE</span>
                            <span className={`text-[10px] font-mono font-bold ${response.confidence > 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {(response.confidence * 100).toFixed(0)}%
                            </span>
                        </motion.div>
                        <div className="font-mono text-[10px] text-gray-600 px-2 py-1">
                            ID: {response.agent_id.substring(0, 6)}
                        </div>
                    </div>

                    {isLongText && (
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[11px] font-mono uppercase tracking-wider text-orange-400 hover:text-white transition-colors flex items-center gap-1 group/btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isExpanded ? 'Collapse' : 'Read More'}
                            <motion.div
                                animate={{ rotate: isExpanded ? -90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </motion.div>
                        </motion.button>
                    )}
                </div>

            </div>
        </motion.div>
    );
}
