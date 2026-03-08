import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { trackStat } from './utils/api'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LandingPage from './pages/LandingPage'
import EditorPage from './pages/EditorPage'
import TextBankPage from './pages/TextBankPage'
import SendPage from './pages/SendPage'
import DashboardPage from './pages/DashboardPage'
import CardViewPage from './pages/CardViewPage'

import StandaloneEidiyaGamePage from './pages/StandaloneEidiyaGamePage'
import GameLeaderboardPage from './pages/GameLeaderboardPage'
import CreateGamePage from './pages/CreateGamePage'

import DonatePage from './pages/DonatePage'
import TermsPage from './pages/TermsPage'
import EidParticles from './components/effects/EidParticles'
import CompanyActivationPage from './pages/CompanyActivationPage'
import CompanyLoginPage from './pages/CompanyLoginPage'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import PrivacyPage from './pages/PrivacyPage'
import PublicDiwaniyaPage from './pages/PublicDiwaniyaPage'
import CreateDiwaniyaPage from './pages/CreateDiwaniyaPage'
import DiwaniyaDashboardPage from './pages/DiwaniyaDashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CompaniesPage from './pages/CompaniesPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import DeliveryPage from './pages/DeliveryPage'
import RefundPage from './pages/RefundPage'
import ContactPage from './pages/ContactPage'
import CheckoutPage from './pages/CheckoutPage'

export default function App() {
  const location = useLocation()
  const { pathname } = location
  const showParticles = location.pathname === '/' || location.pathname === '/dashboard'

  useEffect(() => {
    const tracked = sessionStorage.getItem('sallim_tracked')
    if (!tracked) {
      trackStat('uniqueVisitors')
      sessionStorage.setItem('sallim_tracked', 'true')
    }
  }, [])

  const hideWhatsAppFloat = [
    '/editor',
    '/send',
    '/donate',
    '/card',
    '/dashboard',
    '/company-activation',
    '/company-login',
    '/company/dashboard',
    '/diwaniya',
    '/admin/dashboard',
    '/admin/companies',
    '/admin/invite-codes',
    '/companies',
    '/create-game',
  ].includes(pathname) || pathname.startsWith('/game/') || pathname.startsWith('/eid/') || pathname.startsWith('/diwan/')

  // Define isBusiness - assuming it's false for free version
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

          {/* Eidiya Game (Standalone) Routes */}
          <Route path="/game/:gameId" element={<StandaloneEidiyaGamePage />} />
          <Route path="/game/:gameId/leaderboard" element={<GameLeaderboardPage />} />
          <Route path="/create-game" element={<CreateGamePage />} />

          <Route path="/donate" element={<DonatePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/company-activation" element={<CompanyActivationPage />} />
          <Route path="/company-login" element={<CompanyLoginPage />} />
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/eid/:username" element={<PublicDiwaniyaPage />} />
          <Route path="/create-diwaniya" element={<CreateDiwaniyaPage />} />
          <Route path="/dashboard/diwaniya" element={<DiwaniyaDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isBusiness && <Footer />}

      {!hideWhatsAppFloat && <WhatsAppFloat />}
    </div>
  )
}