import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, CheckCircle, BarChart3, Settings, Briefcase } from 'lucide-react'
import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { useSurveyContext } from '../context/SurveyContext'
import { ExecutiveAnalysisTab } from '../components/results/tabs/ExecutiveAnalysisTab'
import { MethodologyTab } from '../components/results/tabs/MethodologyTab'
import { JobsToBeDoneTab } from '../components/results/tabs/JobsToBeDoneTab'

type TabType = 'executive' | 'methodology' | 'jobs-to-be-done'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { surveyResult, resetSurvey } = useSurveyContext()
  const [activeTab, setActiveTab] = useState<TabType>('executive')

  // Redirect if no results
  useEffect(() => {
    if (!surveyResult) {
      navigate('/agent')
    }
  }, [surveyResult, navigate])

  if (!surveyResult) {
    return null
  }

  function handleNewSurvey() {
    resetSurvey()
    navigate('/agent')
  }

  const tabs: { id: TabType; label: string; icon: typeof BarChart3 }[] = [
    { id: 'executive', label: 'Executive', icon: BarChart3 },
    { id: 'methodology', label: 'Methodology', icon: Settings },
    { id: 'jobs-to-be-done', label: 'Jobs to Be Done', icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[#050505] -z-50" />
      <div className="noise-overlay" />

      <Navigation />

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/agent')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#FF3B00] transition-colors mb-8 font-mono text-xs p-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Survey
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-mono text-green-400">ANALYSIS COMPLETE</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Survey Report
            </h1>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Based on {surveyResult.total_responses || 0} AI agents{surveyResult.methodology?.cohort_description ? ` representing ${surveyResult.methodology.cohort_description}` : ''}
            </p>
          </div>

          {/* Question Display */}
          <div className="bg-[#080808] rounded-2xl border border-white/10 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Question and Details */}
              <div className="lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#FF3B00]/10 rounded-lg flex items-center justify-center border border-[#FF3B00]/30 flex-shrink-0">
                <span className="text-[#FF3B00] font-bold text-sm">Q</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-mono text-gray-500 uppercase mb-2">
                  Survey Question
                </div>
                    <h2 className="font-display font-bold text-xl text-white mb-4">
                      {surveyResult.question}
                </h2>
                    
                    {/* Cohort Description */}
                    {surveyResult.methodology?.cohort_description && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="text-xs font-mono text-gray-500 uppercase mb-2">
                          Cohort Description
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {surveyResult.methodology.cohort_description}
                        </p>
                      </div>
                    )}
                    
                    {/* Survey Details */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 pt-4 border-t border-white/5">
                      {surveyResult.agent_mode && (
                        <span className="flex items-center gap-1">
                          <span className="text-gray-500">Mode:</span>
                          <span className="text-white">{surveyResult.agent_mode}</span>
                        </span>
                      )}
                      {surveyResult.total_responses && (
                        <span className="flex items-center gap-1">
                          <span className="text-gray-500">Responses:</span>
                          <span className="text-white">{surveyResult.total_responses}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Options */}
              <div className="lg:col-span-1">
                <div className="text-xs font-mono text-gray-500 uppercase mb-3">
                  Options
                </div>
                <div className="max-h-[140px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
                  <div className="flex flex-col gap-2">
                    {surveyResult.options && surveyResult.options.map((option, idx) => {
                      const choiceKey = String.fromCharCode(65 + idx) // A, B, C, D...
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 transition-colors justify-between flex-shrink-0"
                        >
                          <span className="text-xs font-mono font-bold text-[#FF3B00] w-6">
                            {choiceKey}
                          </span>
                          <span className="text-sm text-gray-300 flex-1">{option}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#FF3B00] text-black font-bold'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-[#FF3B00]/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'executive' && (
              <ExecutiveAnalysisTab 
                result={surveyResult} 
              />
            )}
            {activeTab === 'methodology' && <MethodologyTab result={surveyResult} />}
            {activeTab === 'jobs-to-be-done' && <JobsToBeDoneTab result={surveyResult} />}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <button
              onClick={handleNewSurvey}
              className="bg-[#FF3B00] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-500 text-black hover:bg-white hover:shadow-lg hover:shadow-[#FF3B00]/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Survey
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
