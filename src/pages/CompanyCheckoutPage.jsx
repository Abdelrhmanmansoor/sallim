import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePaymentMethods, mapPaymentMethodsForDisplay } from '../hooks/usePaymentMethods'
import { useCompany } from '../context/CompanyContext'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const FONT = "'Tajawal', sans-serif"

const PACKAGES = [
  {
    key: 'starter',
    name: 'الأساسية',
    price: 99,
    cardLimit: 500,
    period: 'سنة',
    badge: null,
    features: ['500 بطاقة سنوياً', 'هوية بصرية مخصصة', 'رفع جماعي CSV/Excel', 'لوحة تحكم كاملة'],
  },
  {
    key: 'pro',
    name: 'الاحترافية',
    price: 199,
    cardLimit: 1500,
    period: 'سنة',
    badge: 'الأكثر طلباً',
    features: ['1,500 بطاقة سنوياً', 'كل مزايا الأساسية', 'إحصائيات متقدمة', 'دعم ذو أولوية'],
  },
  {
    key: 'enterprise',
    name: 'المؤسسية',
    price: 399,
    cardLimit: 5000,
    period: 'سنة',
    badge: null,
    features: ['5,000 بطاقة سنوياً', 'كل مزايا الاحترافية', 'White Label كامل', 'مدير حساب مخصص'],
  },
]

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="10" fill="#7c3aed" fillOpacity="0.12" />
    <path d="M6 10l3 3 5-5" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Spinner = ({ color = '#fff' }) => (
  <span style={{
    width: 18, height: 18, border: `2px solid ${color}33`, borderTopColor: color,
    borderRadius: '50%', display: 'inline-block', animation: 'co_spin .6s linear infinite',
  }} />
)

export default function CompanyCheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login: companyLogin } = useCompany()
  const status = searchParams.get('status')
  const merchantOrderId = searchParams.get('merchant_order_id')

  const [step, setStep] = useState(status === 'success' || status === 'failed' ? 3 : 0)
  // step 0 = packages, 1 = form, 2 = paying (navigated away), 3 = result
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ companyName: '', companyEmail: '', companyPhone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [pollError, setPollError] = useState('')
  const { methods } = usePaymentMethods()
  const paymentMethods = mapPaymentMethodsForDisplay(methods)
  const hasApplePay = paymentMethods.some((m) => m.nameKey?.includes('apple'))

  // After returning from Paymob, complete the order and redirect to dashboard
  useEffect(() => {
    if (status === 'success' && merchantOrderId) {
      completeOrder(merchantOrderId)
    }
    if (status === 'failed') {
      setStep(3)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, merchantOrderId])

  const completeOrder = async (orderId, attempt = 0) => {
    setPolling(true)
    setPollError('')
    try {
      const res = await fetch(`${API}/api/v1/company-checkout/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantOrderId: orderId }),
      })
      const data = await res.json()
      if (data.success && data.token && data.company) {
        companyLogin(data.token, data.company)
        localStorage.removeItem('sallim_co_pending')
        navigate('/company/dashboard', { replace: true })
      } else if (res.status === 402 && attempt < 6) {
        // Payment webhook may not have fired yet — retry
        setTimeout(() => completeOrder(orderId, attempt + 1), 2500)
      } else {
        setPollError(data.error || 'فشل إنشاء الحساب. تواصل مع الدعم.')
        setStep(3)
        setPolling(false)
      }
    } catch {
      if (attempt < 4) setTimeout(() => completeOrder(orderId, attempt + 1), 3000)
      else { setPollError('خطأ في الاتصال بالسيرفر.'); setPolling(false); setStep(3) }
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
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/company-checkout/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey: selected.key, ...form }),
      })
      const data = await res.json()
      if (!res.ok || !data.success || !data.paymentUrl) {
        throw new Error(data.error || 'فشل بدء عملية الدفع')
      }
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

  // ─── Styles ───
  const S = {
    page: {
      minHeight: '100vh', background: '#f8fafc', fontFamily: FONT,
      padding: '32px 16px 80px', direction: 'rtl',
    },
    container: { maxWidth: 900, margin: '0 auto' },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 40,
    },
    brand: { fontSize: 22, fontWeight: 800, color: '#111827', textDecoration: 'none' },
    back: {
      background: 'none', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280',
      cursor: 'pointer', fontFamily: FONT,
    },
    heading: { fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800, color: '#111827', marginBottom: 8, textAlign: 'center' },
    sub: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 40 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 40 },
    card: (active) => ({
      background: '#fff', border: `2px solid ${active ? '#7c3aed' : '#e2e8f0'}`,
      borderRadius: 16, padding: 24, cursor: 'pointer', position: 'relative',
      boxShadow: active ? '0 0 0 4px rgba(124,58,237,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'all .2s',
    }),
    badge: {
      display: 'inline-block', background: '#7c3aed', color: '#fff',
      fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 10px',
      marginBottom: 12,
    },
    pkgName: { fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 },
    price: { fontSize: 32, fontWeight: 900, color: '#7c3aed', margin: '12px 0 4px' },
    priceSub: { fontSize: 13, color: '#9ca3af', marginBottom: 16 },
    feat: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', marginBottom: 8 },
    selectBtn: (active) => ({
      width: '100%', padding: '10px', borderRadius: 10, border: 'none', fontFamily: FONT,
      fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 16,
      background: active ? '#7c3aed' : '#f5f3ff', color: active ? '#fff' : '#7c3aed',
    }),
    inp: (err) => ({
      width: '100%', padding: '13px 16px', border: `1.5px solid ${err ? '#fca5a5' : '#e2e8f0'}`,
      borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none',
      color: '#111827', background: '#f8fafc', boxSizing: 'border-box',
    }),
    label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 },
    errTxt: { fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 600 },
    formCard: {
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20,
      padding: 'clamp(24px,5vw,40px)', maxWidth: 480, margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    },
    primaryBtn: (disabled) => ({
      width: '100%', padding: 16, borderRadius: 12, border: 'none', fontFamily: FONT,
      fontWeight: 800, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#c4b5fd' : '#7c3aed', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }),
  }

  // ─── STEP 0: Package Selection ───
  if (step === 0 || (step !== 1 && step !== 3)) {
    return (
      <div style={S.page}>
        <style>{`@keyframes co_spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.container}>
          <nav style={S.nav}>
            <a href="/companies" style={S.brand}>سَلِّم للشركات</a>
            <button style={S.back} onClick={() => navigate('/companies')}>← العودة</button>
          </nav>

          <h1 style={S.heading}>اختر الباقة المناسبة</h1>
          <p style={S.sub}>اشترِ الآن وستصلك كود التفعيل فوراً لتبدأ خلال دقائق</p>

          <div style={S.grid}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.key} style={S.card(selected?.key === pkg.key)} onClick={() => setSelected(pkg)}>
                {pkg.badge && <div style={S.badge}>{pkg.badge}</div>}
                <p style={S.pkgName}>{pkg.name}</p>
                <p style={S.price}>{pkg.price} <span style={{ fontSize: 16 }}>ر.س</span></p>
                <p style={S.priceSub}>/ {pkg.period} — {pkg.cardLimit.toLocaleString()} بطاقة</p>
                {pkg.features.map((f, i) => (
                  <div key={i} style={S.feat}><Check />{f}</div>
                ))}
                <button style={S.selectBtn(selected?.key === pkg.key)}>
                  {selected?.key === pkg.key ? '✓ محددة' : 'اختر هذه الباقة'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => selected ? setStep(1) : null}
              style={{
                ...S.primaryBtn(!selected),
                maxWidth: 320, margin: '0 auto',
              }}
            >
              {selected ? `متابعة — ${selected.name} (${selected.price} ر.س)` : 'اختر باقة أولاً'}
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
              🔒 دفع آمن عبر Paymob — Apple Pay / Visa / Mastercard / مدى
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {(paymentMethods.length ? paymentMethods : [
                { id: 'apple-pay', name: 'Apple Pay' },
                { id: 'visa', name: 'Visa' },
                { id: 'mastercard', name: 'Mastercard' },
                { id: 'mada', name: 'Mada' },
              ]).map((m) => (
                <div key={m.id} style={{ minHeight: 30, minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 8px' }}>
                  {m.logo ? (
                    <img src={m.logo} alt={m.name} style={{ maxHeight: 24, width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{m.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── STEP 1: Company Details Form ───
  if (step === 1) {
    return (
      <div style={S.page}>
        <style>{`@keyframes co_spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.container}>
          <nav style={S.nav}>
            <a href="/companies" style={S.brand}>سَلِّم للشركات</a>
            <button style={S.back} onClick={() => setStep(0)}>← تغيير الباقة</button>
          </nav>

          <div style={S.formCard}>
            {/* Package summary */}
            <div style={{
              background: '#f5f3ff', borderRadius: 12, padding: '16px 20px',
              marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{selected.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{selected.cardLimit.toLocaleString()} بطاقة / سنة</p>
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#7c3aed' }}>{selected.price} <span style={{ fontSize: 13 }}>ر.س</span></p>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 24px' }}>بيانات الشركة</h2>

            {errors.submit && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#b91c1c', fontWeight: 600 }}>
                {errors.submit}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={S.label}>اسم الشركة أو الجهة</label>
              <input
                type="text" value={form.companyName} placeholder="مثال: شركة الفجر"
                onChange={e => { setForm(p => ({ ...p, companyName: e.target.value })); setErrors(p => ({ ...p, companyName: '' })) }}
                style={S.inp(errors.companyName)}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = errors.companyName ? '#fca5a5' : '#e2e8f0'}
              />
              {errors.companyName && <p style={S.errTxt}>{errors.companyName}</p>}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={S.label}>البريد الإلكتروني للتواصل</label>
              <input
                type="email" value={form.companyEmail} placeholder="hr@company.com" dir="ltr"
                onChange={e => { setForm(p => ({ ...p, companyEmail: e.target.value })); setErrors(p => ({ ...p, companyEmail: '' })) }}
                style={S.inp(errors.companyEmail)}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = errors.companyEmail ? '#fca5a5' : '#e2e8f0'}
              />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>سيُرسَل كود التفعيل لهذا البريد</p>
              {errors.companyEmail && <p style={S.errTxt}>{errors.companyEmail}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={S.label}>رقم الهاتف</label>
              <input
                type="tel" value={form.companyPhone} placeholder="05xxxxxxxx" dir="ltr"
                onChange={e => { setForm(p => ({ ...p, companyPhone: e.target.value })); setErrors(p => ({ ...p, companyPhone: '' })) }}
                style={S.inp(errors.companyPhone)}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = errors.companyPhone ? '#fca5a5' : '#e2e8f0'}
              />
              {errors.companyPhone && <p style={S.errTxt}>{errors.companyPhone}</p>}
            </div>

            {hasApplePay && (
              <button
                onClick={handlePay}
                disabled={loading}
                style={{ ...S.primaryBtn(loading), background: loading ? '#9ca3af' : '#111827', marginBottom: 10 }}
              >
                {loading ? <Spinner /> : 'Apple'}
                {loading ? 'جاري الاتصال...' : `ادفع عبر Apple Pay — ${selected.price} ر.س`}
              </button>
            )}

            <button onClick={handlePay} disabled={loading} style={S.primaryBtn(loading)}>
              {loading ? <Spinner /> : '🔒'}
              {loading ? 'جاري الاتصال...' : `ادفع بالفيزا / ماستركارد — ${selected.price} ر.س`}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
              دفع آمن عبر Paymob — Apple Pay / Visa / Mastercard / مدى
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {(paymentMethods.length ? paymentMethods : [
                { id: 'apple-pay', name: 'Apple Pay' },
                { id: 'visa', name: 'Visa' },
                { id: 'mastercard', name: 'Mastercard' },
                { id: 'mada', name: 'Mada' },
              ]).map((m) => (
                <div key={m.id} style={{ minHeight: 32, minWidth: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 8px' }}>
                  {m.logo ? (
                    <img src={m.logo} alt={m.name} style={{ maxHeight: 26, width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{m.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── STEP 3: Result (processing / failed) ───
  return (
    <div style={S.page}>
      <style>{`@keyframes co_spin { to { transform: rotate(360deg); } } @keyframes co_fade { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={S.container}>
        <nav style={S.nav}>
          <a href="/companies" style={S.brand}>سَلِّم للشركات</a>
        </nav>

        <div style={{ ...S.formCard, maxWidth: 520, textAlign: 'center', animation: 'co_fade .4s ease' }}>

          {/* Processing / polling state */}
          {polling && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Spinner color="#7c3aed" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>جاري فتح لوحة التحكم...</h2>
              <p style={{ fontSize: 14, color: '#6b7280' }}>تم الدفع بنجاح، يتم الآن إنشاء حسابك</p>
            </>
          )}

          {/* Failed */}
          {!polling && (pollError || status === 'failed') && (
            <>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✗</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#b91c1c', margin: '0 0 8px' }}>فشلت عملية الدفع</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>{pollError || 'تعذر إتمام عملية الدفع. يمكنك المحاولة مجدداً.'}</p>
              <button onClick={() => { setStep(0); navigate('/company-checkout', { replace: true }) }} style={S.primaryBtn(false)}>
                المحاولة مجدداً
              </button>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 16 }}>
                أو{' '}
                <a href="https://wa.me/201007835547" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 700 }}>تواصل معنا على واتساب</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
