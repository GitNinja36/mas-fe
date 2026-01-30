import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { getSurveyHistory } from '../api'
import {
  Plus,
  Users,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  Database,
  FileText,
  ShoppingBag
} from 'lucide-react'

interface SurveyHistoryItem {
  id: string
  surveyId: string
  question: string
  participantCount: number
  creditsUsed: number
  status: string
  createdAt: string
  completedAt: string | null
  isPolymarket?: boolean
}

const TemplateCard = ({
  title,
  description,
  price,
  delay,
  onClick
}: {
  title: string
  description: string
  price: string
  delay: number
  onClick: () => void
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className="group flex flex-col items-start p-6 rounded-3xl border border-white/5 bg-[#0A0A0A] hover:bg-[#0f0f0f] hover:border-[#FF3B00]/30 transition-all duration-500 w-full text-left relative overflow-hidden h-full shadow-lg shadow-black/50"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Decorative blur */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B00]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    <div className="flex justify-between w-full mb-5">
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-[#FF3B00]/30 group-hover:bg-[#FF3B00]/10 group-hover:text-[#FF3B00] transition-all duration-300 relative z-10 shadow-inner">
        <FileText size={20} />
      </div>
      <span className="text-xs font-bold text-[#FF3B00] bg-[#FF3B00]/10 px-3 py-1.5 rounded-full border border-[#FF3B00]/20 shadow-[0_0_10px_rgba(255,59,0,0.1)]">{price}</span>
    </div>

    <h3 className="text-white font-bold font-display text-lg mb-2 relative z-10 leading-snug group-hover:text-[#FF3B00] transition-colors">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed relative z-10 group-hover:text-gray-400 mb-6 flex-grow">{description}</p>

    <div className="mt-auto w-full pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-white/10">
      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest group-hover:text-gray-500 transition-colors">Instant Access</span>
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-white group-hover:text-[#FF3B00] transition-all transform group-hover:translate-x-1">
        PURCHASE <ArrowRight size={12} />
      </div>
    </div>
  </motion.button>
)

const HistoryRow = ({
  survey,
  onClick,
  index
}: {
  survey: SurveyHistoryItem
  onClick: () => void
  index: number
}) => {
  const statusColors = {
    'completed': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'processing': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'pending': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'failed': 'text-red-400 bg-red-400/10 border-red-400/20',
    'draft': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  }

  const statusKey = survey.status.toLowerCase() as keyof typeof statusColors
  const statusColor = statusColors[statusKey] || statusColors['draft']

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="p-2.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors border border-white/5 group-hover:border-white/20">
            <Database size={18} />
          </div>
          {survey.status === 'completed' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#050505]" />
          )}
        </div>
        <div>
          <h4 className="text-white font-medium font-display group-hover:text-[#FF3B00] transition-colors line-clamp-1 max-w-[200px] md:max-w-md">
            {survey.question}
          </h4>
          <div className="flex items-center gap-3 mt-1.5">
            {survey.isPolymarket && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20 uppercase tracking-wider">
                <Activity size={10} /> Polymarket
              </span>
            )}
            <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
              <Clock size={10} /> {formatDate(survey.createdAt)}
            </span>
            {survey.participantCount > 0 && (
              <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                <Users size={10} /> {survey.participantCount.toLocaleString()} agents
              </span>
            )}
            {/* Mock Winner Preview for Completed Surveys */}
            {survey.status === 'completed' && (
              <span className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-500/80 font-mono bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                <CheckCircle2 size={10} /> Analysis Ready
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono border ${statusColor} hidden sm:block`}>
          {survey.status === 'processing' ? 'PENDING' : survey.status.toUpperCase()}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF3B00] transition-colors">
          <ArrowRight
            size={14}
            className="text-gray-400 group-hover:text-black transition-colors"
          />
        </div>
      </div>
    </motion.div>
  )
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [recentSurveys, setRecentSurveys] = useState<SurveyHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const history = await getSurveyHistory(10)
      const surveys = history.surveys || []

      setRecentSurveys(surveys.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSurveyClick = (surveyId: string) => {
    navigate(`/results?surveyId=${surveyId}`)
  }

  const handlePurchaseReport = () => {
    alert("Report purchase flow coming soon!")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF3B00]/30 selection:text-white pb-20 relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF3B00]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03] noise-overlay" />
      </div>

      <Navigation />

      {/* Main Content - Adjusted for Sidebar support */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 py-8 ${isAuthenticated ? 'md:ml-64 pt-8' : 'pt-28'}`}>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white">Mission Control</h1>
            <p className="text-gray-400 mt-2 font-sans max-w-lg text-sm md:text-base">
              Welcome back{user?.username ? `, ${user.username}` : ''}. Overview of your distributed intelligence network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agent')}
              className="group px-5 py-2.5 rounded-xl bg-[#FF3B00] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_#FF3B00]"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              New Operation
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Recent Intelligence (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-gray-400" />
                <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider">Recent Questions</h3>
              </div>
              <button
                onClick={() => navigate('/results')}
                className="text-xs text-[#FF3B00] font-mono hover:text-white transition-colors flex items-center gap-1"
              >
                VIEW ALL <ArrowRight size={12} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF3B00]"></div>
                <p className="mt-4 text-gray-500 font-mono text-xs uppercase tracking-wider">Synchronizing...</p>
              </div>
            ) : recentSurveys.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/5 dashed-border"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Activity className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-300 font-medium mb-1">No intelligence gathered yet</p>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Your mission logs are empty. Initialize your first operation to start gathering data.
                </p>
                <button
                  onClick={() => navigate('/agent')}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  Start Operation
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {recentSurveys.map((survey, idx) => (
                  <HistoryRow
                    key={survey.id}
                    survey={survey}
                    index={idx}
                    onClick={() => handleSurveyClick(survey.surveyId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Ready-Made Reports (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-gray-400" />
              <h3 className="text-sm font-bold font-mono text-gray-400 uppercase tracking-wider">Premium Reports</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <TemplateCard
                title="Global Tech Trends 2025"
                description="Comprehensive analysis of emerging technologies and consumer adoption patterns."
                price="$499"
                delay={0.2}
                onClick={handlePurchaseReport}
              />
              <TemplateCard
                title="Gen Z Consumer Sentiment"
                description="Deep dive into purchasing behaviors and brand preferences of the next generation."
                price="$299"
                delay={0.3}
                onClick={handlePurchaseReport}
              />
              <TemplateCard
                title="SaaS Market Dynamics"
                description="Competitive landscape analysis for B2B software in Q3 2025."
                price="$349"
                delay={0.4}
                onClick={handlePurchaseReport}
              />
            </div>
          </div>

        </div>
      </div>

      <div className={isAuthenticated ? 'md:ml-64' : ''} style={{ marginTop: '2rem' }}>
        <Footer />
      </div>
    </div>
  )
}
