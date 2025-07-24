import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import LandingPage from './LandingPage/LandingPage'
import ModeSelection from './ModeSelection/ModeSelection'
import PracticeMode from './PracticeMode/PracticeMode'
import Levels from './Levels/Levels'
import DotSprout from './Levels/DotSprout/DotSprout'
import AdvanceMode from './PracticeMode/AdvanceMode'

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
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
