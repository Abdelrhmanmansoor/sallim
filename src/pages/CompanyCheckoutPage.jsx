import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePaymentMethods, mapPaymentMethodsForDisplay } from '../hooks/usePaymentMethods'
import { useCompany } from '../context/CompanyContext'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const FONT = "'Tajawal', sans-serif"

// ── Design tokens ──
const T = {
  brand: '#7c3aed',
  brandDark: '#6d28d9',
  brandLight: '#f5f3ff',
  brandMid: '#ede9fe',
  gold: '#b8860b',
  goldLight: '#fffbeb',
  goldBorder: 'rgba(184,134,11,.25)',
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  borderHover: '#d1d5db',
  text: '#111827',
  textSub: '#374151',
  muted: '#6b7280',
  error: '#dc2626',
  errorBg: '#fef2f2',
  success: '#059669',
  successBg: '#ecfdf5',
}

const PACKAGES = [
  {
    key: 'starter',
    name: 'الأساسية',
    price: 99,
    cardLimit: 500,
    features: ['500 بطاقة سنوياً', 'هوية بصرية مخصصة', 'رفع جماعي CSV/Excel', 'لوحة تحكم كاملة'],
    badge: null,
    highlight: false,
  },
  {
    key: 'pro',
    name: 'الاحترافية',
    price: 199,
    cardLimit: 1500,
    features: ['1,500 بطاقة سنوياً', 'كل مزايا الأساسية', 'إحصائيات متقدمة', 'دعم ذو أولوية'],
    badge: 'الأكثر طلباً',
    highlight: true,
  },
  {
    key: 'enterprise',
    name: 'المؤسسية',
    price: 399,
    cardLimit: 5000,
    features: ['5,000 بطاقة سنوياً', 'كل مزايا الاحترافية', 'White Label كامل', 'مدير حساب مخصص'],
    badge: null,
    highlight: false,
  },
]

// ── Inline SVG payment logos (always visible, no external dependency) ──
const LogoVisa = () => (
  <svg width="40" height="13" viewBox="0 0 780 250" xmlns="http://www.w3.org/2000/svg">
    <path d="M293.2 348.73l33.36-195.76h53.36l-33.4 195.76h-53.32zM543.5 157.83c-10.56-3.95-27.13-8.2-47.78-8.2-52.7 0-89.8 26.6-90.1 64.7-.3 28.2 26.6 43.9 46.9 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.2-10.4l-6.9-3.1-7.5 43.9c12.4 5.4 35.4 10.2 59.3 10.4 56 0 92.4-26.3 92.8-67-.2-22.3-14-39.3-44.7-53.3-18.6-9.1-30-15.2-29.9-24.4 0-8.2 9.7-16.9 30.5-16.9 17.4-.3 30 3.5 39.8 7.5l4.8 2.2 7.2-42.3zM661.8 152.97H618c-13.3 0-23.3 3.6-29.1 16.8l-82.5 186.9h58.3s9.5-25.2 11.7-30.7h71.3c1.7 7.1 6.8 30.7 6.8 30.7H706l-44.2-203.7zm-68.5 129.8c4.6-11.8 22.2-57.2 22.2-57.2-.3.5 4.6-11.9 7.4-19.6l3.8 17.7s10.6 48.6 12.9 59.1h-46.3zM230.9 152.97l-52.2 133.7-5.6-27.2c-9.7-31.4-40-65.5-73.9-82.5l47.8 171.6 56.5-.1 84.1-195.5h-56.7z" fill="#1434CB"/>
    <path d="M131.5 152.97H45.2l-.7 4c66.5 16.2 110.6 55.3 128.9 102.3L153.5 170c-3.3-12.8-13.1-16.7-25-17z" fill="#F9A533"/>
  </svg>
)

const LogoMC = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="11" fill="#EB001B"/>
    <circle cx="25" cy="11" r="11" fill="#F79E1B"/>
    <path d="M18 3.8a11 11 0 010 14.4A11 11 0 0118 3.8z" fill="#FF5F00"/>
  </svg>
)

const LogoMada = () => (
  <svg width="44" height="18" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="6" fill="#fff"/>
    <text x="8" y="28" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" fill="#00A651">mada</text>
  </svg>
)

const LogoApplePay = () => (
  <svg width="46" height="18" viewBox="0 0 165 70" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.8 8.7c-2 2.4-5.2 4.3-8.4 4-.4-3.2 1.1-6.6 3-8.7C25.4 1.5 28.9-.2 31.7 0c.3 3.3-.9 6.5-2.9 8.7zm2.9 4.5c-4.7-.3-8.6 2.6-10.8 2.6-2.2 0-5.6-2.5-9.2-2.4C6.8 13.5 2.3 16.4.9 21c-2.9 9.3.8 23.1 5.9 30.7 2.3 3.7 5.4 8 9.2 7.8 3.7-.1 5.1-2.4 9.5-2.4 4.5 0 5.7 2.4 9.5 2.3 4-.1 6.6-3.8 8.9-7.5 2.8-4.3 3.9-8.4 4-8.6-.1-.1-7.7-3-7.7-11.7 0-7.3 5.9-10.8 6.2-11-3.4-5-8.7-5.6-10.6-5.7v.3zM66.3 4.7C75.7 4.7 82.3 11.2 82.3 20.5c0 9.4-6.7 16-16.3 16H56.6V53.2h-7V4.7h16.7zm-9.7 25.5h7.8c6.6 0 10.4-3.6 10.4-9.6S71 11.1 64.4 11.1h-7.8V30.2zM84.2 42.1c0-6.5 5-10.6 14-11.1l10.3-.6v-2.9c0-4.2-2.8-6.6-7.5-6.6-4.4 0-7.2 2-7.8 5.1h-6.6c.4-6.2 5.9-10.5 14.6-10.5 7.8 0 13.4 4.3 13.4 10.8V53.2h-6.5V47.4h-.2c-1.9 3.8-6.2 6.3-10.6 6.3-6.6 0-11.9-4.6-11.9-11.6zm24.3-3.2V36l-9.3.6c-4.7.3-7.3 2.3-7.3 5.5 0 3.2 2.7 5.3 6.9 5.3 5.5 0 9.7-3.7 9.7-8.5zM119 68.1V61.8c.5.1 1.8.1 2.4.1 3.5 0 5.3-1.5 6.5-5.2 0-.1.7-2.3.7-2.3L116.9 17h7.4L133 46.8h.2L141.9 17h7.2L136.7 55.6c-3.2 9-6.9 11.9-14.7 11.9-1.8 0-3.5-.1-4-.3z" fill="#000"/>
  </svg>
)

// ── Small helpers ──
const IconCheckCircle = ({ color = T.brand, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M5 10l4 4 6-7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconLock = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
  </svg>
)

const Spinner = ({ color = '#fff', size = 18 }) => (
  <span style={{
    width: size, height: size,
    border: `2.5px solid ${color}33`,
    borderTopColor: color,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'coCo_spin .6s linear infinite',
    flexShrink: 0,
  }} />
)

// ── Step indicator ──
function StepBar({ current }) {
  const steps = ['اختر الباقة', 'بيانات الشركة', 'إتمام الدفع']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 36, gap: 0 }}>
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
            {i > 0 && (
              <div style={{
                width: 48, height: 2, marginTop: 15,
                background: done ? T.brand : '#e2e8f0',
                transition: 'background .4s',
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? T.brand : active ? T.brand : '#f1f5f9',
                border: `2.5px solid ${done || active ? T.brand : '#d1d5db'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done || active ? '#fff' : T.muted,
                fontSize: 13, fontWeight: 800,
                transition: 'all .3s',
                boxShadow: active ? `0 0 0 4px rgba(124,58,237,.15)` : 'none',
              }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10l5 5 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1
                }
              </div>
              <span style={{
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? T.brand : done ? T.textSub : T.muted,
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Payment logos row ──
function PayLogos({ hasApplePay }) {
  const logos = [
    { el: <LogoVisa />, key: 'visa' },
    { el: <LogoMC />, key: 'mc' },
    { el: <LogoMada />, key: 'mada' },
    ...(hasApplePay ? [{ el: <LogoApplePay />, key: 'apple' }] : []),
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, flexWrap: 'wrap', marginTop: 14 }}>
      {logos.map(({ el, key }) => (
        <div key={key} style={{
          height: 34, minWidth: 54, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '0 8px',
          boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        }}>
          {el}
        </div>
      ))}
    </div>
  )
}

// ── Input component ──
function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.textSub, marginBottom: 6 }}>
        {label} {required && <span style={{ color: T.error }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: T.error, marginTop: 4, fontWeight: 600 }}>{error}</p>}
    </div>
  )
}

// صفحة الدفع مخفية — النظام مجاني بالكامل
export default function CompanyCheckoutPage() {
  const navigate = useNavigate()
  // توجيه تلقائي للتسجيل المجاني
  useEffect(() => {
    navigate('/company-activation', { replace: true })
  }, [navigate])
  return null
}

function _DisabledCompanyCheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login: companyLogin } = useCompany()

  const status = searchParams.get('status')
  const merchantOrderId = searchParams.get('merchant_order_id')
  const urlTransactionId = searchParams.get('id') || null
  const redirectParams = Object.fromEntries(searchParams.entries())
  if (!redirectParams.success && status === 'success') redirectParams.success = 'true'

  const [step, setStep] = useState(status === 'success' || status === 'failed' ? 3 : 0)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ companyName: '', companyEmail: '', companyPhone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [pollError, setPollError] = useState('')
  const [paySuccess, setPaySuccess] = useState(false)

  const { methods } = usePaymentMethods()
  const paymentMethods = mapPaymentMethodsForDisplay(methods)
  const hasApplePay = paymentMethods.some(m =>
    m.nameKey?.includes('apple') || m.name?.toLowerCase().includes('apple')
  )

  useEffect(() => {
    if (status === 'success' && merchantOrderId) completeOrder(merchantOrderId)
    if (status === 'failed') setStep(3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, merchantOrderId])

  const completeOrder = async (orderId, attempt = 0) => {
    setPolling(true)
    setPollError('')
    setStep(3)
    try {
      const res = await fetch(`${API}/api/v1/company-checkout/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantOrderId: orderId, transactionId: urlTransactionId, redirectParams }),
      })
      const data = await res.json()
      if (data.success && data.token && data.company) {
        setPaySuccess(true)
        setPolling(false)
        companyLogin(data.token, data.company)
        localStorage.removeItem('sallim_co_pending')
        setTimeout(() => navigate('/company/dashboard', { replace: true }), 1800)
      } else if (res.status === 402 && attempt < 6) {
        setTimeout(() => completeOrder(orderId, attempt + 1), 2500)
      } else {
        setPollError(data.error || 'فشل إنشاء الحساب. تواصل مع الدعم.')
        setPolling(false)
      }
    } catch {
      if (attempt < 4) setTimeout(() => completeOrder(orderId, attempt + 1), 3000)
      else { setPollError('خطأ في الاتصال بالسيرفر.'); setPolling(false) }
    }
  }

  const validate = () => {
    const e = {}
    if (!form.companyName.trim()) e.companyName = 'اسم الشركة مطلوب'
    if (!form.companyEmail.trim()) e.companyEmail = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail.trim())) e.companyEmail = 'بريد غير صالح'
    if (!form.companyPhone.trim()) e.companyPhone = 'رقم الهاتف مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate() || !selected) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/company-checkout/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey: selected.key, ...form }),
      })
      const data = await res.json()
      if (!res.ok || !data.success || !data.paymentUrl) throw new Error(data.error || 'فشل بدء عملية الدفع')
      localStorage.setItem('sallim_co_pending', JSON.stringify({
        merchantOrderId: data.merchantOrderId,
        email: form.companyEmail.trim().toLowerCase(),
      }))
      window.location.href = data.paymentUrl
    } catch (err) {
      setErrors({ submit: err.message })
      setLoading(false)
    }
  }

  const setField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

  const inputStyle = (hasErr) => ({
    width: '100%', height: 46,
    border: `1.5px solid ${hasErr ? '#fca5a5' : T.border}`,
    borderRadius: 10, padding: '0 14px',
    fontSize: 14, fontFamily: FONT,
    outline: 'none', color: T.text,
    background: '#f8fafc', boxSizing: 'border-box',
    transition: 'border-color .15s, box-shadow .15s',
  })

  // ── Global CSS ──
  const css = `
    @keyframes coCo_spin { to { transform: rotate(360deg); } }
    @keyframes coCo_fade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes coCo_scale { from { transform:scale(.85); opacity:0; } to { transform:scale(1); opacity:1; } }
    @keyframes coCo_dot { 0%,80%,100%{opacity:.25} 40%{opacity:1} }
    .coCo_pkg { transition: transform .2s ease, box-shadow .2s ease; }
    .coCo_pkg:hover { transform: translateY(-4px); }
    .coCo_inp:focus { border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(124,58,237,.1) !important; background: #fff !important; }
    .coCo_paybtn:hover:not(:disabled) { background: ${T.brandDark} !important; box-shadow: 0 6px 20px rgba(124,58,237,.45) !important; transform: translateY(-1px); }
    .coCo_paybtn:active:not(:disabled) { transform: translateY(0); }
    .coCo_dot1 { animation: coCo_dot 1.2s infinite .0s; }
    .coCo_dot2 { animation: coCo_dot 1.2s infinite .2s; }
    .coCo_dot3 { animation: coCo_dot 1.2s infinite .4s; }
  `

  // ────────────────────────────────
  // STEP 3 — Result screen
  // ────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, direction: 'rtl' }}>
        <style>{css}</style>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
          <a href="/companies" style={{ fontSize: 20, fontWeight: 800, color: T.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
            سَلِّم للشركات
          </a>
        </div>

        <div style={{ maxWidth: 480, margin: '60px auto 0', padding: '0 16px' }}>
          <div style={{
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 24,
            padding: 'clamp(32px,6vw,52px)', textAlign: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,.08)', animation: 'coCo_fade .4s ease',
          }}>

            {/* Polling / loading */}
            {polling && (
              <>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Spinner color={T.brand} size={32} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: '0 0 10px' }}>جاري إنشاء حسابكم...</h2>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, margin: '0 0 24px' }}>
                  تم الدفع بنجاح — نقوم الآن بتجهيز لوحة التحكم الخاصة بكم
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <div className="coCo_dot1" style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
                  <div className="coCo_dot2" style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
                  <div className="coCo_dot3" style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
                </div>
              </>
            )}

            {/* Success */}
            {!polling && paySuccess && (
              <div style={{ animation: 'coCo_scale .4s ease' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#d1fae5"/>
                    <path d="M11 20l7 7 11-12" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: T.success, margin: '0 0 10px' }}>تم الدفع بنجاح!</h2>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, margin: '0 0 8px' }}>
                  جاري تحويلكم إلى لوحة التحكم...
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <Spinner color={T.success} size={18} />
                </div>
              </div>
            )}

            {/* Failed */}
            {!polling && !paySuccess && (pollError || status === 'failed') && (
              <>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#fee2e2"/>
                    <path d="M13 13l14 14M27 13L13 27" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#b91c1c', margin: '0 0 10px' }}>فشلت عملية الدفع</h2>
                <p style={{ fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.8 }}>
                  {pollError || 'تعذر إتمام عملية الدفع. يمكنك المحاولة مجدداً أو التواصل مع الدعم.'}
                </p>
                <button
                  onClick={() => { setStep(0); navigate('/company-checkout', { replace: true }) }}
                  style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', fontFamily: FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer', background: T.brand, color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  المحاولة مجدداً
                </button>
                <a
                  href="https://wa.me/201007835547"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  تواصل معنا على واتساب
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ────────────────────────────────
  // STEPS 0–1 — Main checkout
  // ────────────────────────────────
  const stepNum = selected ? 1 : 0

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, paddingBottom: 80, direction: 'rtl' }}>
      <style>{css}</style>

      {/* ── Top bar ── */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${T.border}`,
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 1px 6px rgba(0,0,0,.04)',
      }}>
        <a href="/companies" style={{ fontSize: 20, fontWeight: 800, color: T.text, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.brand }} />
          سَلِّم للشركات
        </a>
        <button
          style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: T.muted, cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => navigate('/companies')}
        >
          <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          رجوع
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 16px 0' }}>

        {/* Step indicator */}
        <StepBar current={stepNum} />

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: T.text, textAlign: 'center', margin: '0 0 8px' }}>
          باقات الشركات والمؤسسات
        </h1>
        <p style={{ fontSize: 14, color: T.muted, textAlign: 'center', margin: '0 0 36px' }}>
          اختر الباقة المناسبة، أدخل بياناتك، وادفع — تدخل لوحة التحكم فوراً
        </p>

        {/* ── Package cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          {PACKAGES.map(pkg => {
            const active = selected?.key === pkg.key
            return (
              <div
                key={pkg.key}
                className="coCo_pkg"
                onClick={() => setSelected(pkg)}
                style={{
                  background: pkg.highlight && !active
                    ? 'linear-gradient(160deg,#fffdf7 0%,#fff 100%)'
                    : '#fff',
                  border: `2px solid ${active ? T.brand : pkg.highlight ? T.goldBorder : T.border}`,
                  borderRadius: 20, padding: '22px 20px', cursor: 'pointer', position: 'relative',
                  boxShadow: active
                    ? `0 0 0 4px rgba(124,58,237,.1), 0 6px 28px rgba(0,0,0,.09)`
                    : pkg.highlight
                      ? '0 4px 16px rgba(184,134,11,.09)'
                      : '0 1px 6px rgba(0,0,0,.04)',
                }}
              >
                {/* Top badges row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  {pkg.badge
                    ? <div style={{ background: T.gold, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 20, padding: '3px 10px', letterSpacing: .5 }}>{pkg.badge}</div>
                    : <div />
                  }
                  {active && (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10l5 5 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: '0 0 8px' }}>{pkg.name}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '0 0 2px' }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: T.brand, lineHeight: 1 }}>{pkg.price}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.muted }}>ر.س</span>
                </div>
                <p style={{ fontSize: 12, color: T.muted, margin: '0 0 18px' }}>سنوياً · {pkg.cardLimit.toLocaleString()} بطاقة</p>

                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                  {pkg.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.textSub, marginBottom: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: T.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconCheckCircle size={12} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
                  fontFamily: FONT, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 16,
                  background: active ? T.brand : T.brandLight, color: active ? '#fff' : T.brand,
                  transition: 'all .2s',
                }}>
                  {active ? '✓ محددة' : 'اختر هذه الباقة'}
                </button>
              </div>
            )
          })}
        </div>

        {/* ── Form card ── */}
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 22, padding: 'clamp(24px,5vw,38px)',
          maxWidth: 520, margin: '0 auto',
          boxShadow: '0 4px 28px rgba(0,0,0,.07)',
        }}>

          {/* Selected package summary */}
          {selected ? (
            <div style={{
              background: T.brandLight, border: `1px solid rgba(124,58,237,.18)`,
              borderRadius: 12, padding: '14px 18px', marginBottom: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>باقة {selected.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: T.muted }}>{selected.cardLimit.toLocaleString()} بطاقة / سنة</p>
              </div>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: T.brand }}>
                {selected.price} <span style={{ fontSize: 13, fontWeight: 600 }}>ر.س</span>
              </p>
            </div>
          ) : (
            <div style={{ background: T.goldLight, border: `1px solid #fde68a`, borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#92400e', fontWeight: 600 }}>
              ← اختر باقة أولاً من الأعلى
            </div>
          )}

          {/* Form heading */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill={T.brand}><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.447.894L10 14.118l-4.553 2.776A1 1 0 014 16V4z" clipRule="evenodd"/></svg>
            بيانات الشركة
          </h2>

          {errors.submit && (
            <div style={{ background: T.errorBg, border: '1px solid #fecaca', borderRadius: 10, padding: '11px 14px', marginBottom: 18, fontSize: 13, color: '#b91c1c', fontWeight: 600 }}>
              {errors.submit}
            </div>
          )}

          {/* Name + Phone row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
            <Field label="اسم الشركة أو الجهة" required error={errors.companyName}>
              <input
                type="text" value={form.companyName} placeholder="مثال: شركة الفجر للتقنية"
                className="coCo_inp"
                onChange={e => setField('companyName', e.target.value)}
                style={inputStyle(errors.companyName)}
              />
            </Field>
            <Field label="رقم الهاتف" required error={errors.companyPhone}>
              <input
                type="tel" value={form.companyPhone} placeholder="05xxxxxxxx" dir="ltr"
                className="coCo_inp"
                onChange={e => setField('companyPhone', e.target.value)}
                style={inputStyle(errors.companyPhone)}
              />
            </Field>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 26 }}>
            <Field label="البريد الإلكتروني" required error={errors.companyEmail}>
              <input
                type="email" value={form.companyEmail} placeholder="hr@company.com" dir="ltr"
                className="coCo_inp"
                onChange={e => setField('companyEmail', e.target.value)}
                style={inputStyle(errors.companyEmail)}
              />
            </Field>
            <p style={{ fontSize: 11, color: T.muted, marginTop: 5 }}>
              ستصلك بيانات الدخول على هذا البريد فور اكتمال الدفع
            </p>
          </div>

          {/* Apple Pay button (if available) */}
          {hasApplePay && (
            <button
              onClick={handlePay}
              disabled={loading || !selected}
              style={{
                width: '100%', height: 48, borderRadius: 12, border: 'none',
                fontFamily: FONT, fontWeight: 800, fontSize: 15,
                cursor: loading || !selected ? 'not-allowed' : 'pointer',
                background: loading || !selected ? '#9ca3af' : '#000',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 10, opacity: !selected ? .6 : 1,
              }}
            >
              {loading ? <Spinner /> : <LogoApplePay />}
              {loading ? 'جاري الاتصال...' : (selected ? `— ${selected.price} ر.س` : '')}
            </button>
          )}

          {/* Main pay button */}
          <button
            className="coCo_paybtn"
            onClick={handlePay}
            disabled={loading || !selected}
            style={{
              width: '100%', height: 52, borderRadius: 12, border: 'none',
              fontFamily: FONT, fontWeight: 800, fontSize: 16,
              cursor: loading || !selected ? 'not-allowed' : 'pointer',
              background: loading || !selected ? '#c4b5fd' : T.brand,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all .2s',
              boxShadow: !loading && selected ? '0 4px 16px rgba(124,58,237,.35)' : 'none',
            }}
          >
            {loading
              ? <><Spinner /> جاري تجهيز الدفع...</>
              : <><IconLock />{selected ? `ادفع الآن — ${selected.price} ر.س` : 'اختر باقة أولاً'}</>
            }
          </button>

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginTop: 12, fontSize: 11, color: T.muted, fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="#10b981"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              دفع آمن ومشفر
            </span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span>فتح لوحة التحكم فوراً</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span>ضمان استرداد 7 أيام</span>
          </div>

          {/* Payment logos */}
          <PayLogos hasApplePay={hasApplePay} />
        </div>

      </div>
    </div>
  )
}
