import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';
import { GAMING_SURVEY_DATA } from '../../mocks/gamingSurveyData';
import { motion, AnimatePresence } from 'motion/react';
import { PolymarketReportView } from './PolymarketReportView';

interface ReportViewV2Props {
  data?: any;
}

export const ReportViewV2 = ({ data }: ReportViewV2Props) => {
  // Check for Polymarket flag
  if (data?.isPolymarket_enable || data?.isPolymarket) {
    return <PolymarketReportView data={data} />;
  }

  // defaulting to index 0 (Question 1)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showThemes, setShowThemes] = useState(true);

  // Adapt the data structure to match the view requirements
  const surveyData = useMemo(() => {
    // If no data provided, use the Mock (demo mode)
    // OR if the provided data is explicitly the gaming survey (checked via ID or structure if needed)
    // For now, if data is null/undefined, fallback to GAMING_SURVEY_DATA
    if (!data) return GAMING_SURVEY_DATA;

    // Check if it's already in the "questions" array format (multi-question structure)
    if (data.questions && Array.isArray(data.questions)) {
      return data;
    }

    // Otherwise, assume it's a single survey result (from real API) and adapt it
    // We map the real API response fields to the specific UI fields required by this view
    const adaptedQuestion = {
      id: 1,
      question: data.question || "Survey Question",
      cohort_description: data.methodology?.cohort_description || "Standard Sampling",
      agent_mode: data.agent_mode || "Standard",
      credits_used: data.creditsUsed || 0,
      total_responses: data.total_responses || 0,
      distribution: mapDistribution(data),
      why_they_chose_this: data.executive_summary || "No summary available.",
      reasoning_themes: mapReasoningThemes(data),
      minority_perspectives: mapMinorityPerspectives(data)
    };

    return {
      questions: [adaptedQuestion]
    };
  }, [data]);

  const question = surveyData.questions[activeQuestionIndex];

  if (!question) return null;

  return (
    <div className="text-white pb-20">
      {/* Question Header & Navigation */}
      <div className="mb-8 p-3">
        {/* Navigation Bar - Only show if multiple questions */}
        {surveyData.questions.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {surveyData.questions.map((q: any, idx: number) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all duration-300 border ${idx === activeQuestionIndex
                  ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
              >
                Q{q.id}
              </button>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
        >
          {/* Animated gradient orb */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FF3B0020, transparent)' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-base bg-gradient-to-br from-[#FF3B00] to-[#FF6B00] text-white border border-[#FF3B00]/30 mt-1 shadow-lg shadow-[#FF3B00]/30"
                >
                  {question.id}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-br from-white via-white to-gray-200 bg-clip-text text-transparent leading-tight tracking-tight"
                >
                  {question.question}
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pl-12"
              >
                <div className="group/badge px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block mb-1">Target Cohort</span>
                  <div className="text-sm font-bold text-white max-w-md line-clamp-1 group-hover/badge:text-[#FF3B00] transition-colors" title={question.cohort_description}>
                    {question.cohort_description}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-300"
            >
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono block mb-4 border-b border-white/5 pb-2">Simulation Parameters</span>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs text-gray-400">Mode</span>
                  <span className="text-xs font-mono font-bold text-[#FF3B00]">{question.agent_mode || 'Standard'}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs text-gray-400">Agents</span>
                  <span className="text-xs font-mono font-bold text-white">{question.total_responses} Active Twins</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs text-gray-400">Credits Used</span>
                  <span className="text-xs font-mono font-bold text-white">{question.credits_used?.toLocaleString() || 0} CR</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Response Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">

          {/* Charts Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-5"
            >
              <div className="w-0.5 h-5 bg-gradient-to-b from-[#FF3B00] to-[#FF6B00] rounded-full" />
              <span className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Response Distribution</span>
            </motion.div>

            {/* Response Distribution */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/5 rounded-3xl p-8 space-y-6 hover:border-white/10 transition-all duration-500"
            >
              {question.distribution.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + (idx * 0.1),
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group/item space-y-2"
                >
                  <div className="flex justify-between items-end text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-200 font-semibold text-lg group-hover/item:text-white transition-colors">{item.fullText}</span>
                      <span className="text-gray-500 font-mono text-[11px] uppercase tracking-wider mt-1">Option {item.label}</span>
                    </div>
                    <div className="text-right">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (idx * 0.1), type: "spring" }}
                        className="text-white font-bold block text-xl"
                      >
                        {((item.count / question.total_responses) * 100).toFixed(1)}%
                      </motion.span>
                      <span className="text-gray-500 font-mono text-xs">{item.count} responses</span>
                    </div>
                  </div>
                  <div className="w-full h-14 bg-white/[0.02] rounded-xl overflow-hidden relative group border border-white/5 group-hover/item:border-white/10 transition-all">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / question.total_responses) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.4 + (idx * 0.1), ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full border-r-2 border-white/20 relative overflow-hidden shadow-lg"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2, delay: 0.8 + (idx * 0.1), repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Why They Chose This */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-4"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.6,
                  delay: 1,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              >
                <Lightbulb size={14} className="text-[#FF3B00]" />
              </motion.div>
              <span className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Why They Chose This</span>
            </motion.div>
            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-[#0F0F0F]/80 via-[#0A0A0A]/60 to-transparent border border-white/10 hover:border-[#FF3B00]/30 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.005 }}
            >
              <p className="text-gray-200 leading-relaxed text-md font-light">
                {question.why_they_chose_this}
              </p>
            </motion.div>
          </motion.div>

          {/* Toggle Button */}
          <button
            onClick={() => setShowThemes(!showThemes)}
            className="flex items-center gap-2 text-[#FF3B00] hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-wider py-4"
          >
            {showThemes ? 'Hide' : 'Show'} Reasoning Themes & Minority Views
            {showThemes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Reasoning Themes & Minority Views */}
          <AnimatePresence>
            {showThemes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-8"
              >
                {/* Reasoning Themes */}
                <div>
                  {/* Enhanced Section Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="mb-8 relative"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-0.5 h-6 bg-gradient-to-b from-[#FF3B00] to-[#FF6B00] rounded-full"
                      />
                      <div className="flex-1">
                        <motion.h2
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="text-lg font-bold bg-gradient-to-r from-[#FF3B00] via-[#FF6B00] to-[#FF8B00] bg-clip-text text-transparent tracking-tight"
                        >
                          Reasoning Themes
                        </motion.h2>
                      </div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-xs text-gray-500 font-light pl-3"
                    >
                      Recurring patterns in agent decision-making
                    </motion.p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3">
                    {question.reasoning_themes && question.reasoning_themes.length > 0 ? question.reasoning_themes.map((theme: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + (idx * 0.15),
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
                        className="relative group"
                      >
                        {/* Glassmorphic Card */}
                        <div className="relative bg-gradient-to-br from-[#0F0F0F] via-[#0A0A0A] to-[#050505] backdrop-blur-xl border border-white/10 hover:border-[#FF3B00]/50 transition-all duration-500 rounded-3xl p-9 overflow-hidden shadow-2xl hover:shadow-[#FF3B00]/30">

                          {/* Animated gradient background orb */}
                          <motion.div
                            className="absolute -top-20 -right-20 w-50 h-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ background: 'radial-gradient(circle, #FF3B0030, #FF6B0020, transparent)' }}
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 90, 0]
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          {/* Circular Progress Indicator */}
                          <div className="absolute top-6 right-6 flex items-center justify-center">
                            <svg className="w-20 h-20 transform -rotate-90">
                              {/* Background circle */}
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                className="text-white/5"
                              />
                              {/* Progress circle */}
                              <motion.circle
                                cx="40"
                                cy="40"
                                r="34"
                                stroke="url(#gradient)"
                                strokeWidth="6"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "0 280" }}
                                animate={{ strokeDasharray: `${(theme.percentage / 100) * 213} 213` }}
                                transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                style={{ filter: 'drop-shadow(0 0 8px #FF3B0060)' }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FF3B00" />
                                  <stop offset="100%" stopColor="#FF6B00" />
                                </linearGradient>
                              </defs>
                            </svg>
                            {/* Percentage text */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + (idx * 0.1), type: "spring", stiffness: 200 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="text-xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                                {theme.percentage}%
                              </span>
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="relative z-10 pr-24">
                            {/* Theme indicator badge */}
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + (idx * 0.1) }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF3B00]/20 to-[#FF6B00]/20 border border-[#FF3B00]/30 mb-4"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
                              <span className="text-[10px] font-mono font-bold text-[#FF3B00] uppercase tracking-wider">
                                Theme {idx + 1}
                              </span>
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                              className="text-md font-display font-bold mb-4 bg-gradient-to-br from-white via-white to-gray-200 bg-clip-text text-transparent group-hover:from-[#FF3B00] group-hover:via-[#FF8B00] group-hover:to-white transition-all duration-500 leading-tight tracking-tight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + (idx * 0.1) }}
                            >
                              {theme.name}
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + (idx * 0.1) }}
                              className="text-gray-300 text-base leading-relaxed font-light group-hover:text-gray-100 transition-colors duration-300"
                            >
                              {theme.description}
                            </motion.p>
                          </div>

                          {/* Enhanced bottom progress bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-white/5 to-white/10 overflow-hidden rounded-b-3xl">
                            <motion.div
                              className="h-full relative overflow-hidden"
                              style={{
                                background: 'linear-gradient(90deg, #FF3B00, #FF6B00, #FF3B00)',
                                backgroundSize: '200% 100%'
                              }}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${theme.percentage}%`,
                                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                              }}
                              transition={{
                                width: { duration: 1.2, delay: 0.3 + (0.1 * idx), ease: "easeOut" },
                                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                              }}
                            >
                              {/* Shimmer effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, delay: 1 + (idx * 0.1), repeat: Infinity, repeatDelay: 2 }}
                              />
                            </motion.div>
                          </div>

                          {/* Corner accent */}
                          <div className="absolute top-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3B00]/20 to-transparent rounded-tl-3xl" />
                          </div>

                          {/* Subtle grid pattern overlay */}
                          <div
                            className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{
                              backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 20px),
                                               repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 20px)`
                            }}
                          />
                        </div>

                        {/* Outer glow on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B00]/0 via-[#FF3B00]/20 to-[#FF6B00]/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                      </motion.div>
                    )) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 text-center py-16 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl border border-white/5 border-dashed"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/40" />
                        </motion.div>
                        <p className="text-gray-500 italic mb-1 text-lg">No specific recurring themes identified</p>
                        <p className="text-xs text-gray-600">Continue analyzing more responses to discover patterns</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Minority Perspectives */}
                <div className="mt-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center gap-2.5 mb-5"
                  >
                    <div className="w-0.5 h-5 bg-gradient-to-b from-[#FF3B00] to-[#FF6B00] rounded-full" />
                    <span className="text-xs font-mono uppercase text-gray-400 tracking-widest font-medium">Minority Perspectives</span>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-4">
                    {question.minority_perspectives && question.minority_perspectives.length > 0 ? question.minority_perspectives.map((pers: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.6 + (0.1 * idx),
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                        className="bg-gradient-to-br from-[#0F0F0F] via-[#0A0A0A] to-[#050505] border border-white/10 p-7 rounded-3xl relative group hover:border-[#FF3B00]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF3B00]/20"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold font-mono text-white border border-white/10 shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {pers.option}
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold text-base group-hover:text-[#FF3B00] transition-colors">Minority Perspective</h3>
                              <span className="px-2.5 py-1 bg-[#FF3B00]/15 rounded-full text-[11px] font-mono font-semibold text-[#FF3B00] border border-[#FF3B00]/40">{pers.percentage}%</span>
                            </div>
                            <p className="text-gray-500 text-xs mt-0.5">Alternative Viewpoint</p>
                          </div>
                        </div>
                        <div className="relative">
                          <motion.div
                            className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF3B00] to-transparent rounded-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.4 + (0.1 * idx), duration: 0.5 }}
                          />
                          <p className="text-gray-200 text-base leading-relaxed pl-5 italic group-hover:text-gray-100 transition-colors font-light">"{pers.reasoning}"</p>
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                          style={{ background: 'radial-gradient(circle at bottom left, #FF3B0008, transparent)' }} />
                      </motion.div>
                    )) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-2 text-center py-12 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed"
                      >
                        <p className="text-gray-500 italic mb-1">Total Consensus Achieved</p>
                        <p className="text-xs text-gray-600">No significant minority perspectives found in the dataset.</p>
                      </motion.div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// Helper Functions for Adapting Real Data


function mapDistribution(data: any) {
  const choices = data.choice_distribution?.choices || {};
  const optionsList = data.options || [];
  const colors = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#6366f1", "#14b8a6", "#f43f5e"];
  let colorIdx = 0;

  // Create a map of all possible options (from options array if exists)
  // Assuming 'A', 'B', 'C' map to indices 0, 1, 2
  const allOptions = optionsList.map((optText: string, idx: number) => {
    const letter = String.fromCharCode(65 + idx); // 0->A, 1->B...
    const choiceData = choices[letter];
    return {
      label: letter,
      fullText: optText,
      count: choiceData ? choiceData.count : 0,
      color: colors[idx % colors.length]
    };
  });

  // If we have options list, use that as the source of truth to ensure ALL options are shown
  if (allOptions.length > 0) {
    return allOptions.sort((a: any, b: any) => b.count - a.count);
  }

  // Fallback if no options list provided (just map the choices we have)
  return Object.values(choices).map((choice: any) => ({
    label: choice.option,
    fullText: choice.option, // Fallback
    count: choice.count,
    color: colors[colorIdx++ % colors.length]
  })).sort((a: any, b: any) => b.count - a.count);
}

function mapReasoningThemes(data: any) {
  if (!data.reasoning_patterns) return [];
  return data.reasoning_patterns.map((pattern: any) => ({
    name: pattern.pattern,
    percentage: Math.round((pattern.frequency / data.total_responses) * 100),
    description: "Recurring reasoning pattern observed in agent responses."
  }));
}

function mapMinorityPerspectives(data: any) {
  if (!data.agent_responses_list && !data.agent_responses_grouped) return [];

  const winner = data.choice_distribution?.winning_choice;
  const responses = data.agent_responses_list ||
    Object.values(data.agent_responses_grouped || {}).flatMap((g: any) => g.responses);

  if (!responses) return [];

  // Filter for non-winning responses
  const minorityResponses = responses.filter((r: any) => r.choice !== winner && r.choice !== undefined);

  // Group by choice
  const grouped = minorityResponses.reduce((acc: any, curr: any) => {
    if (!acc[curr.choice]) {
      acc[curr.choice] = {
        option: curr.choice,
        count: 0,
        reasoning: curr.reasoning
      };
    }
    acc[curr.choice].count++;
    // Keep readability high - prefer longer reasoning if current is too short, or just keep first
    if (curr.reasoning.length > acc[curr.choice].reasoning.length) {
      acc[curr.choice].reasoning = curr.reasoning;
    }
    return acc;
  }, {});

  return Object.values(grouped).map((g: any) => ({
    option: g.option,
    percentage: ((g.count / data.total_responses) * 100).toFixed(1),
    reasoning: g.reasoning
  }));
}
