import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
      </SurveyProvider>
    </BrowserRouter>
  )
}
