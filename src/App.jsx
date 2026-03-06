import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LandingPage from './pages/LandingPage'
import EditorPage from './pages/EditorPage'
import TextBankPage from './pages/TextBankPage'
import SendPage from './pages/SendPage'
import DashboardPage from './pages/DashboardPage'
import CardViewPage from './pages/CardViewPage'
import EidiyaPage from './pages/EidiyaPage'
import EidiyaLuckPage from './pages/EidiyaLuckPage'
import EidiyaGamePage from './pages/EidiyaGamePage'
import DonatePage from './pages/DonatePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import EidParticles from './components/effects/EidParticles'

export default function App() {
  const location = useLocation()
  const { pathname } = location
  const showParticles = location.pathname === '/' || location.pathname === '/dashboard'
  const hideWhatsAppFloat = [
    '/editor',
    '/send',
    '/eidiya',
    '/eidiya-luck',
    '/eidiya-game',
    '/donate',
    '/card',
    '/dashboard',
  ].includes(pathname)

  // Define isBusiness - assuming it's false for the free version
  const isBusiness = false

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white text-[#0F172A] overflow-x-hidden" dir="rtl">
      {showParticles && <EidParticles />}

      <Navbar />

      <main className="flex-1 w-full relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/texts" element={<TextBankPage />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/card" element={<CardViewPage />} />
          <Route path="/eidiya" element={<EidiyaPage />} />
          <Route path="/eidiya-luck" element={<EidiyaLuckPage />} />
          <Route path="/eidiya-game" element={<EidiyaGamePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isBusiness && <Footer />}

      {!hideWhatsAppFloat && <WhatsAppFloat />}
    </div>
  )
}
