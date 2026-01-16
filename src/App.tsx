import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SurveyProvider } from './context/SurveyContext'
import HomePage from './pages/HomePage'
import AgentPage from './pages/AgentPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <SurveyProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
        <Analytics />
      </SurveyProvider>
    </BrowserRouter>
  )
}
