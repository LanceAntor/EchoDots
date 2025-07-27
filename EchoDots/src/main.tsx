import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import LandingPage from './LandingPage/LandingPage'
import ModeSelection from './ModeSelection/ModeSelection'
import PracticeMode from './PracticeMode/PracticeMode'
import AdvanceMode from './PracticeMode/AdvanceMode'

// Levels
import Levels from './Levels/Levels'
import DotSprout from './Levels/DotSprout/DotSprout'
import SignalStarter from './Levels/SignalStarter/SignalStarter'
import PulseOperator from './Levels/PulseOperator/PulseOperator'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ModeSelection" element={<ModeSelection />} />
        <Route path="/PracticeMode" element={<PracticeMode />} />
        <Route path="/Levels" element={<Levels />} />
        <Route path="/DotSprout" element={<DotSprout />} />
        <Route path="/AdvanceMode" element={<AdvanceMode />} />
        <Route path="/SignalStarter" element={<SignalStarter />} />
        <Route path="/PulseOperator" element={<PulseOperator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
