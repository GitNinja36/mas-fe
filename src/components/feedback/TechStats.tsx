import React from 'react'

export function TechStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/25 shadow-lg">
        <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">+100k</div>
        <div className="text-base text-gray-300 font-medium">AI Agents</div>
        <div className="text-xs text-orange-400/80 mt-1.5">Intelligent & Adaptive</div>
      </div>
      <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/25 shadow-lg">
        <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">16</div>
        <div className="text-base text-gray-300 font-medium">Platforms</div>
        <div className="text-xs text-orange-400/80 mt-1.5">Cross-Platform Analysis</div>
      </div>
      <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/25 shadow-lg">
        <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">98%</div>
        <div className="text-base text-gray-300 font-medium">Accuracy</div>
        <div className="text-xs text-orange-400/80 mt-1.5">Precision & Reliability</div>
      </div>
    </div>
  )
}
