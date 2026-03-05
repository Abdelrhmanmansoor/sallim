import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import LandingPage from './pages/LandingPage'
import EditorPage from './pages/EditorPage'
import TextBankPage from './pages/TextBankPage'
import SendPage from './pages/SendPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import PricingPage from './pages/PricingPage'
import CardViewPage from './pages/CardViewPage'
import EidiyaPage from './pages/EidiyaPage'
import EidParticles from './components/effects/EidParticles'

export default function App() {
  const location = useLocation()
  const showParticles = location.pathname === '/' || location.pathname === '/dashboard'
  
  return (
    <div className="min-h-screen w-full bg-[#060709] text-white font-ibm relative overflow-x-hidden" dir="rtl">
      {showParticles && <EidParticles />}
      <Navbar />
      <main className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/texts" element={<TextBankPage />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/card" element={<CardViewPage />} />
          <Route path="/eidiya" element={<EidiyaPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
