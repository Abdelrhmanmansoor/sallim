import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Palette, 
  Download, 
  Smartphone, 
  Type, 
  Layers, 
  Shield, 
  ChevronDown, 
  Heart, 
  DollarSign, 
  X, 
  Sparkles, 
  Star,
  GraduationCap,
  Baby,
  PartyPopper,
  Briefcase,
  Mail,
  Trophy,
  Cloud,
  Award
} from 'lucide-react'
import { getTemplates } from '../utils/api'
import ProductCard from '../components/ProductCard'
import OccasionSlider from '../components/OccasionSlider'

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [previewTemplates, setPreviewTemplates] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [popupCountdown, setPopupCountdown] = useState(8)

  useEffect(() => {
    async function load() {
      try {
        const res = await getTemplates()
        if (res.success && res.data) {
          // Get only public/premium templates for the landing page
          const publicTemplates = res.data.filter(t => t.type === 'public' || t.type === 'premium')
          // Take the first 6
          setPreviewTemplates(publicTemplates.slice(0, 6))
        }
      } catch (e) {
        console.error('Error fetching preview templates:', e)
      }
    }
    load()
  }, [])

  const features = [
    { icon: Palette, title: 'قوالب احترافية', desc: 'أكثر من ٢٠ قالب مصمم بعناية' },
    { icon: Download, title: 'تصدير عالي الجودة', desc: 'PNG و PDF بدقة عالية' },
    { icon: Smartphone, title: 'مشاركة فورية', desc: 'شارك مباشرة عبر واتساب' },
    { icon: Type, title: 'خطوط عربية', desc: '٨ خطوط عربية أصيلة' },
    { icon: Layers, title: 'تخصيص كامل', desc: 'تحكم بالألوان والنصوص' },
    { icon: Shield, title: 'آمن وموثوق', desc: 'لا نحفظ بياناتك' },
  ]

  const steps = [
    { num: '01', title: 'اختر القالب', desc: 'تصفح مكتبة القوالب' },
    { num: '02', title: 'خصص التصميم', desc: 'أضف اسمك ونصوصك' },
    { num: '03', title: 'صدّر وشارك', desc: 'حمّل أو شارك مباشرة' },
  ]

  const faqs = [
    { q: 'هل المنصة مجانية؟', a: 'نعم، المنصة مجانية بالكامل.' },
    { q: 'ما جودة الصور؟', a: 'تُصدَّر بدقة 1080×1080 بكسل.' },
    { q: 'هل تعمل على الهاتف؟', a: 'نعم، متوافقة مع جميع الأجهزة.' },
  ]

  const tiers = [
    {
      name: 'مجاني',
      price: '0',
      desc: 'للاستخدام الشخصي',
      features: ['تصميم غير محدود', 'تصدير عالي الجودة', 'مشاركة فورية'],
      cta: 'ابدأ مجاناً',
      href: '/editor',
      highlight: false,
    },
    {
      name: 'للشركات',
      price: 'اتصل بنا',
      desc: 'حلول مخصصة',
      features: ['تخصيص كامل', 'إزالة العلامة المائية', 'دعم فني مميز'],
      cta: 'تواصل معنا',
      href: 'mailto:sales@solimanw.com',
      highlight: false,
      external: true,
    },
  ]


  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 3000)

    // Countdown timer for popup
    const countdownInterval = setInterval(() => {
      setPopupCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setShowPopup(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(countdownInterval)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  const handleWhatsAppLink = (message) => {
    const phoneNumber = '201007835547'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>

      {/* LUXURY POPUP */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '28px',
              padding: '0',
              maxWidth: '460px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.35)',
              animation: 'slideUp 0.4s ease',
              overflow: 'hidden',
            }}
          >
            {/* Top Gradient Strip */}
            <div style={{ height: '6px', background: 'linear-gradient(90deg, #f59e0b, #a855f7, #ec4899)' }} />

            <div style={{ padding: '36px 32px 32px' }}>
              {/* Close Button */}
              <button
                onClick={handleClosePopup}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#f1f5f9',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9' }}
              >
                <X size={16} color="#64748b" />
              </button>

              {/* Countdown Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: '#0f172a',
                color: '#fff',
                padding: '5px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 700,
              }}>
                {popupCountdown}s
              </div>

              {/* Icon + Title */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={28} color="#fff" /></div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                  عيدك أجمل مع سَلِّم
                </h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                  اختر نوع التهنئة وابدأ فوراً
                </p>
              </div>

              {/* 3 Mode Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <button
                  onClick={() => navigate('/editor?mode=ready')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    textAlign: 'right',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.background = '#fff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Palette size={22} color="#0f172a" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>قوالب جاهزة</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>اختر واكتب الاسم وحمّل فوراً</div>
                  </div>
                  <span style={{ background: '#16a34a', color: '#fff', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>مجاني</span>
                </button>

                <button
                  onClick={() => navigate('/editor?mode=designer')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    background: '#fffbeb',
                    border: '2px solid #fde68a',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    textAlign: 'right',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fefce8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#fde68a'; e.currentTarget.style.background = '#fffbeb' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Type size={22} color="#d97706" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>مصمم احترافي</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>تحكم كامل بالتصميم والخطوط والألوان</div>
                  </div>
                  <span style={{ background: '#f59e0b', color: '#fff', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>مدفوع</span>
                </button>

                <button
                  onClick={() => navigate('/editor?mode=batch')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    background: '#faf5ff',
                    border: '2px solid #e9d5ff',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    textAlign: 'right',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = '#f5f3ff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = '#faf5ff' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Layers size={22} color="#a855f7" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>جماعي</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>أرسل تهنئة مخصصة لعدة أشخاص دفعة واحدة</div>
                  </div>
                  <span style={{ background: '#a855f7', color: '#fff', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>للشركات</span>
                </button>
              </div>

              {/* Song CTA */}
              <button
                onClick={() => navigate('/editor?mode=ready')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                اصنع أغنية العيد لمن تحب — 50 ر.س
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          background: '#171717',
          padding: 0,
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
          }}
        >
          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              margin: '0 auto',
              padding: '120px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '100px',
                marginBottom: '32px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C6F806', boxShadow: '0 0 10px rgba(198,248,6,0.5)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                نسخة تجريبية — جارٍ إضافة قوالب جديدة باستمرار
              </span>
            </div>

            <style>{`
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.8; }
              }
            `}</style>

            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              صمّم بطاقتك
              <br />
              <span style={{ color: '#a3a3a3' }}>بأناقة واحترافية</span>
            </h1>

            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.5)',
                maxWidth: '480px',
                margin: '0 auto 40px',
                lineHeight: 1.7,
              }}
            >
              اختر من قوالب فاخرة، خصّصها، وشاركها في ثوانٍ
            </p>

            {/* 3 Mode Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link
                to="/editor?mode=ready"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: '#fff',
                  color: '#171717',
                  fontSize: '16px',
                  fontWeight: 800,
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 14px rgba(255,255,255,0.15)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.15)' }}
              >
                جاهز
                <span style={{ fontSize: '11px', background: '#16a34a', color: '#fff', padding: '3px 8px', borderRadius: '100px', fontWeight: 700 }}>مجاني</span>
              </Link>

              <Link
                to="/editor?mode=designer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 800,
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.4)' }}
              >
                مصمم
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.25)', padding: '3px 8px', borderRadius: '100px', fontWeight: 700 }}>مدفوع</span>
              </Link>

              <Link
                to="/editor?mode=batch"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 800,
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 14px rgba(168,85,247,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(168,85,247,0.5)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(168,85,247,0.4)' }}
              >
                جماعي
              </Link>
            </div>

            {/* Secondary Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/create-diwaniya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              >
                أطلق ديوانيتك
              </Link>
              <Link
                to="/dashboard/diwaniya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              >
                لعبة العيدية
              </Link>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '48px',
                marginTop: '80px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: '+٥٠,٠٠٠', label: 'بطاقة' },
                { value: '+٢٠', label: 'قالب' },
                { value: '٨', label: 'خطوط' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEWS TICKER */}
        <div
          style={{
            background: '#0a0a0a',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '14px 0',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            direction: 'rtl'
          }}
        >
          <style>{`
            @keyframes scroll-ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
            .ticker-container {
              display: flex;
              width: max-content;
              animation: scroll-ticker 40s linear infinite;
            }
            .ticker-container:hover {
              animation-play-state: paused;
            }
            .ticker-item {
              display: flex;
              align-items: center;
              padding-left: 32px;
              color: rgba(255,255,255,0.85);
              font-size: 16px;
              font-weight: 500;
              white-space: nowrap;
            }
            .ticker-item-separator {
              margin-right: 32px;
              color: rgba(255,215,0,0.6);
              font-size: 18px;
              user-select: none;
            }
            @media (max-width: 768px) {
              .ticker-item {
                 padding-left: 20px;
                 font-size: 14px;
              }
              .ticker-item-separator {
                 margin-right: 20px;
                 font-size: 14px;
              }
              .ticker-container {
                 animation-duration: 25s;
              }
            }
          `}</style>
          <div className="ticker-container">
            {[...Array(2)].fill().map((_, setIndex) => (
              <div key={setIndex} style={{ display: 'flex' }}>
                {[
                  { text: 'تم إضافة لعبة العيدية التفاعلية - انشئ تحدياتك الخاصة' },
                  { text: 'جاري إضافة ثيمات وقوالب جديدة بشكل مستمر' },
                  { text: 'تم إضافة فكرة الديوانية - اطلق ديوانيتك الآن' },
                  { text: 'للشركات والمؤسسات التي تريد تخصيص النظام تواصل معنا' },
                  { text: 'اكتشف الميزات الجديدة في نسخة العيد 2026' },
                ].map((item, index) => (
                  <div key={`${setIndex}-${index}`} className="ticker-item">
                    <span style={{ color: item.link ? '#FFD700' : 'rgba(255,255,255,0.85)' }}>
                      {item.text}
                    </span>
                    <span className="ticker-item-separator">✧</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OCCASION CATEGORIES SLIDER */}
      <OccasionSlider />

      {/* PRODUCT SHOWCASE - EXPERT SLIDER DESIGN */}
      <section style={{ padding: '100px 0', background: '#f8fafc', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            
            <h2 style={{ 
              fontSize: 'clamp(32px, 5vw, 44px)', 
              fontWeight: 900, 
              color: '#0f172a', 
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              صمم تهنئتك
            </h2>
            <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              جميع هذه القوالب متاحة للاستخدام مجانًا، ابدأ في تخصيص تصميمك المفضل الآن
            </p>
          </div>
          
          {/* PRODUCT SLIDER */}
          <div 
            className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
            style={{ 
              paddingRight: 'min(5vw, 60px)', 
              paddingLeft: 'min(5vw, 60px)',
              marginRight: 'calc(-1 * min(5vw, 60px))',
              marginLeft: 'calc(-1 * min(5vw, 60px))'
            }}
          >
            {[
              { id: "10", name: "تصميم الخط الديواني الملكي", img: "/templates/جاهزة/10.png", badge: "الأكثر طلباً", original: 49 },
              { id: "11", name: "بطاقة العيد العصرية", img: "/templates/جاهزة/11.png", badge: "جديد", original: 59 },
              { id: "14", name: "نموذج التجريد الإسلامي", img: "/templates/جاهزة/15.png", original: 45 },
              { id: "114", name: "باترن السدو الفاخر", img: "/templates/مصمم/Artboard 12.png", badge: "حصري" },
              { id: "13", name: "تهنئة الزخرفة الكلاسيكية", img: "/templates/جاهزة/14.png", original: 29 },
              { id: "16", name: "بطاقة الخط العربي الفاخر", img: "/templates/جاهزة/17.png", badge: "Premium", original: 75 },
              { id: "105", name: "ثيم الواحة الهادئة", img: "/templates/مصمم/18.png", original: 29 },
              { id: "3", name: "تصميم اللؤلؤة العربية", img: "/templates/جاهزة/6.png", badge: "مجاني لفترة محدودة" },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="flex-none w-[280px] sm:w-[320px] snap-center first:mr-0"
              >
                <ProductCard 
                  id={p.id} 
                  name={p.name} 
                  image={p.img} 
                  price={0} 
                  originalPrice={p.original || 0} 
                  rating={4.9 + (Math.random() * 0.1)}
                  badges={p.badge ? [p.badge] : []}
                />
              </div>
            ))}
          </div>
          
          {/* Scroll Indicators / Help */}
          <div className="flex justify-center gap-2 mt-4 text-gray-400 sm:hidden">
            <span className="text-xs font-bold">اسحب لليمين لرؤية المزيد</span>
          </div>
        </div>
        
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* EID SONG — Premium Product Card */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              transition: 'all 300ms ease',
            }}
          >
            {/* Image area */}
            <div style={{
              height: '220px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(129,140,248,0.15)', filter: 'blur(40px)' }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(251,191,36,0.1)', filter: 'blur(30px)' }} />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', backdropFilter: 'blur(8px)' }}>
                  <Star size={36} color="#fbbf24" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600 }}>خدمة حصرية</p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>جديد</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>50 ر.س</span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                اصنع أغنية العيد لمن تحب
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
                أرسل تهنئة صوتية مميزة باسم من تحب — أغنية عيد مخصصة تبقى في الذاكرة
              </p>

              <button
                onClick={() => navigate('/checkout?product=eid-song&price=50')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#0f172a' }}
              >
                اطلب الآن
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '14px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>دفع آمن</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>·</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>تسليم فوري</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>·</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>تواصل مباشر</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>المميزات</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              لماذا سَلِّم؟
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  background: '#fafafa',
                  borderRadius: '16px',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#171717',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <f.icon size={22} color="#fff" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EIDIYA GAME FEATURE - Simple Text */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '12px'
          }}>
            لعبة العيدية التفاعلية
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px',
            lineHeight: 1.6
          }}>
            حول تهنئة العيد إلى مغامرة ممتعة - أنشئ أسئلتك، حدد جوائزك، وتنافس مع عائلتك!
          </p>
          <Link
            to="/create-game"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              background: '#fff',
              color: '#171717',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ابدأ الآن ←
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>كيف تعمل</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              ثلاث خطوات بسيطة
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '64px',
                    fontWeight: 700,
                    color: '#e5e5e5',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                >
                  {s.num}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#737373' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>القوالب</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              قوالب جاهزة للتخصيص
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {previewTemplates.length > 0 ? (
              previewTemplates.map((template) => (
                <Link
                  to={`/editor?template=${template._id}`}
                  key={template._id}
                  style={{
                    display: 'block',
                    aspectRatio: '1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    transition: 'all 200ms ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {template.name}
                  </div>
                </Link>
              ))
            ) : (
              // Fallback templates while loading or if none exist
              [
                { id: 1, image: '/templates/جاهزة/3.png', name: 'تصميم ١' },
                { id: 2, image: '/templates/جاهزة/5.png', name: 'تصميم ٢' },
                { id: 3, image: '/templates/جاهزة/6.png', name: 'تصميم ٣' },
                { id: 4, image: '/templates/جاهزة/7.png', name: 'تصميم ٤' },
                { id: 5, image: '/templates/جاهزة/8.png', name: 'تصميم ٥' },
                { id: 6, image: '/templates/جاهزة/9.png', name: 'تصميم ٦' },
                { id: 7, image: '/templates/جاهزة/10.png', name: 'تصميم ٧' },
                { id: 8, image: '/templates/جاهزة/11.png', name: 'تصميم ٨' },
                { id: 9, image: '/templates/جاهزة/13.png', name: 'تصميم ٩' },
                { id: 10, image: '/templates/جاهزة/14.png', name: 'تصميم ١٠' },
                { id: 11, image: '/templates/جاهزة/15.png', name: 'تصميم ١١' },
                { id: 12, image: '/templates/جاهزة/16.png', name: 'تصميم ١٢' },
                { id: 13, image: '/templates/جاهزة/17.png', name: 'تصميم ١٣' },
                { id: 14, image: '/templates/جاهزة/Artboard 1.png', name: 'تصميم ١٤' },
                { id: 15, image: '/templates/جاهزة/Artboard 2.png', name: 'تصميم ١٥' },
                { id: 16, image: '/templates/جاهزة/Artboard 4.png', name: 'تصميم ١٦' },
              ].map((template) => (
                <Link
                  to={`/editor?template=${template.id}`}
                  key={template.id}
                  style={{
                    display: 'block',
                    aspectRatio: '1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    transition: 'all 200ms ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img
                    src={template.image}
                    alt={template.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {template.name}
                  </div>
                </Link>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              to="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#171717',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              عرض جميع القوالب
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>الباقات</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              اختر ما يناسبك
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {tiers.map((tier, i) => {
              const Component = tier.external ? 'a' : Link
              const linkProps = tier.external
                ? { href: tier.href, target: '_blank', rel: 'noopener noreferrer' }
                : { to: tier.href }

              return (
                <div
                  key={i}
                  style={{
                    padding: '32px',
                    background: tier.highlight ? '#171717' : '#fff',
                    borderRadius: '20px',
                    border: tier.highlight ? 'none' : '1px solid #e5e5e5',
                    textAlign: 'center',
                    transition: 'all 200ms ease',
                    transform: tier.highlight ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!tier.highlight) {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!tier.highlight) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#404040',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#fff',
                        marginBottom: '16px',
                      }}
                    >
                      مميز
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: tier.highlight ? '#fff' : '#171717',
                      marginBottom: '8px',
                    }}
                  >
                    {tier.name}
                  </h3>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: tier.highlight ? '#fff' : '#171717',
                      marginBottom: '8px',
                    }}
                  >
                    {tier.price}
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: tier.highlight ? 'rgba(255,255,255,0.5)' : '#737373',
                      marginBottom: '24px',
                    }}
                  >
                    {tier.desc}
                  </p>
                  <ul style={{ listStyle: 'none', marginBottom: '24px', textAlign: 'right' }}>
                    {tier.features.map((f, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: '14px',
                          color: tier.highlight ? 'rgba(255,255,255,0.7)' : '#525252',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: tier.highlight ? '#a3a3a3' : '#171717' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Component
                    {...linkProps}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px',
                      background: tier.highlight ? '#fff' : '#171717',
                      color: tier.highlight ? '#171717' : '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {tier.cta}
                  </Component>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>الأسئلة</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              أسئلة شائعة
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: '20px 24px',
                  background: openFaq === i ? '#f5f5f5' : '#fafafa',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', margin: 0 }}>{faq.q}</h3>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#a3a3a3',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </div>
                {openFaq === i && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#737373',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e5e5e5',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & SOCIAL PROOF - Salla-inspired */}
      <section style={{ padding: '80px 0', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          {/* Trust Headline */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              82% من العملاء تزداد ثقتهم بعد أول استخدام
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>أرقام حقيقية من منصتنا</p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {[
              { num: '+5,000', label: 'بطاقة تم إنشاؤها', icon: '🎨' },
              { num: '+120', label: 'عميل سعودي يثق بنا', icon: '🇸🇦' },
              { num: '99%', label: 'رضا العملاء', icon: '⭐' },
              { num: '24/7', label: 'دعم فني متواصل', icon: '💬' },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '28px 16px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{stat.num}</div>
                <div style={{ fontSize: '14px', color: '#737373' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}>
            {[
              { icon: '🔒', text: 'دفع آمن ومشفّر' },
              { icon: '🇸🇦', text: 'منتج سعودي' },
              { icon: '✅', text: 'تفعيل فوري' },
              { icon: '🛡️', text: 'خصوصية محمية' },
            ].map((badge, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#fff',
                borderRadius: '100px',
                border: '1px solid #e5e5e5',
                fontSize: '13px',
                fontWeight: 600,
                color: '#525252',
              }}>
                <span style={{ fontSize: '16px' }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>

          {/* Payment Methods Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>وسائل الدفع المعتمدة:</span>
            {['مدى', 'Visa', 'Mastercard', 'Apple Pay'].map((method, i) => (
              <span key={i} style={{
                padding: '6px 16px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
              }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', background: '#171717' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            جاهز للبدء؟
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            صمّم بطاقتك الآن مجاناً
          </p>
          <Link
            to="/editor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: '#fff',
              color: '#171717',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            ابدأ التصميم
            <ArrowLeft size={18} />
          </Link>
        </div>
      </section>

      {/* SERVICES - Clean & Professional */}
      <section style={{
        padding: '120px 0',
        background: '#fafafa',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#fff',
              borderRadius: '100px',
              marginBottom: '24px',
              border: '1px solid #e5e5e5',
            }}>
              <span style={{ fontSize: '12px', color: '#171717', fontWeight: 600, letterSpacing: '0.02em' }}>
                حلول الأعمال
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '16px',
              lineHeight: 1.3
            }}>
              انضم إلى شركائنا الناجحين
            </h2>

            <p style={{
              fontSize: '17px',
              color: '#737373',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              نقدم حلولاً متكاملة للشركات، من المتاجر الإلكترونية إلى الحملات التسويقية
            </p>
          </div>

          {/* Services */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '60px'
          }}>
            {[
              { icon: '🛒', title: 'متاجر سلة', desc: 'تصميم احترافي مخصص' },
              { icon: '🏪', title: 'متاجر زد', desc: 'حلول متكاملة' },
              { icon: '💻', title: 'منصات مخصصة', desc: 'بناء من الصفر' },
              { icon: '📢', title: 'تسويق رقمي', desc: 'حملات إعلانية ناجحة' },
            ].map((service, i) => (
              <div key={i} style={{
                padding: '32px 24px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                transition: 'all 300ms ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = '#171717'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{service.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717', marginBottom: '6px' }}>{service.title}</div>
                <div style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{service.desc}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '48px',
            border: '1px solid #e5e5e5',
            marginBottom: '48px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              مزايا الشراكة معنا
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                { title: 'دعم فني متخصص', desc: 'فريق متاح على مدار الساعة لحل جميع الاستفسارات' },
                { title: 'تدريب شامل', desc: 'ندرب فريقك على إدارة المنصة بشكل احترافي' },
                { title: 'تحديثات دورية', desc: 'نحافظ على منصتك محدثة بأحدث التقنيات' },
                { title: 'تحليلات أداء', desc: 'تقارير شهرية مفصلة عن أداء منصتك' },
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#171717',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>{benefit.title}</div>
                    <div style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center'
            }}>
              <a
                href="https://wa.me/201007835547?text=مرحباً، أريد الاستفسار عن الشراكة"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 40px',
                  background: '#171717',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل معنا الآن
              </a>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="https://www.solimanx.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    border: '1px solid #e5e5e5',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#171717'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                >
                  موقعنا
                  <ArrowLeft size={16} />
                </a>

                <a
                  href="https://x.com/solimanx_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    border: '1px solid #e5e5e5',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#171717'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                >
                  تابعنا على X
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              marginTop: '24px'
            }}>
              🇸🇦 فريق سعودي متخصص - نجح معنا أكثر من 50 شركة
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
