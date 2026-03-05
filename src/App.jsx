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
import BusinessPage from './pages/BusinessPage'
import CardViewPage from './pages/CardViewPage'
import EidiyaPage from './pages/EidiyaPage'
import EidiyaLuckPage from './pages/EidiyaLuckPage'
import EidParticles from './components/effects/EidParticles'

export default function App() {
  const location = useLocation()
  const showParticles = location.pathname === '/' || location.pathname === '/dashboard'
  const isBusiness = location.pathname === '/business'
  
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-[#060709] text-white font-ibm overflow-x-hidden" dir="rtl">
      {/* Golden particles background */}
      {showParticles && <EidParticles />}
      
      {/* Fixed navbar */}
      {!isBusiness && <Navbar />}
      
      {/* Main content - grows to fill space */}
      <main className="flex-1 w-full relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/texts" element={<TextBankPage />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/card" element={<CardViewPage />} />
          <Route path="/eidiya" element={<EidiyaPage />} />
          <Route path="/eidiya-luck" element={<EidiyaLuckPage />} />
        </Routes>
      </main>
      
      {/* Footer */}
      {!isBusiness && <Footer />}
    </div>
  )
}
