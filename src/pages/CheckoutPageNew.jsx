import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Star,
  Lock,
  CreditCard,
  Smartphone,
  User,
  Mail,
  Phone,
  Gift,
  Sparkles,
  Clock,
  BadgeCheck,
  ChevronLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SAR from '../components/SAR'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

/* ─── step config ─── */
const STEPS = [
  { key: 'info', label: 'بياناتك', icon: User },
  { key: 'review', label: 'المراجعة', icon: ShieldCheck },
  { key: 'pay', label: 'الدفع', icon: CreditCard },
]

const BENEFITS = [
  { icon: Clock, text: 'تفعيل فوري بعد الدفع' },
  { icon: Sparkles, text: 'بدون علامة مائية' },
  { icon: BadgeCheck, text: 'دعم فني مستمر' },
  { icon: Lock, text: 'دفع مشفر وآمن 100%' },
]

const PAYMENT_METHODS = [
  { name: 'مدى', color: '#004d99' },
  { name: 'Visa', color: '#1a1f71' },
  { name: 'Mastercard', color: '#eb001b' },
  { name: 'Apple Pay', color: '#000000' },
]

/* ─── animations keyframes (injected once) ─── */
const injectStyles = (() => {
  let injected = false
  return () => {
    if (injected) return
    injected = true
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ckFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes ckPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      @keyframes ckShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      @keyframes ckSpin { to { transform: rotate(360deg); } }
      .ck-fade-up { animation: ckFadeUp .45s cubic-bezier(.22,1,.36,1) both; }
      .ck-fade-up-1 { animation-delay: .05s; }
      .ck-fade-up-2 { animation-delay: .1s; }
      .ck-fade-up-3 { animation-delay: .15s; }
      .ck-btn-pulse:hover { animation: ckPulse .6s ease-in-out; }
      .ck-shimmer { background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,.08) 50%, transparent 75%); background-size: 200% 100%; animation: ckShimmer 2s infinite; }
      .ck-spinner { width:20px; height:20px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:ckSpin .6s linear infinite; display:inline-block; }
      .ck-input { width:100%; border:1.5px solid #e2e8f0; background:#fafbfc; border-radius:14px; padding:14px 16px 14px 44px; font-size:14px; font-family:inherit; color:#1e293b; outline:none; transition: all .2s; }
      .ck-input:focus { border-color:#d97706; background:#fff; box-shadow: 0 0 0 3px rgba(217,119,6,.1); }
      .ck-input::placeholder { color:#94a3b8; }
      .ck-input[dir=ltr] { padding:14px 44px 14px 16px; }
    `
    document.head.appendChild(style)
  }
})()

export default function CheckoutPageNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formRef = useRef(null)

  const cardId = searchParams.get('cardId')
  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId')
  const purchaseId = searchParams.get('purchase')
  const productType = searchParams.get('product')
  const productPrice = searchParams.get('price')

  const isEidSong = productType === 'eid-song'
  const isCustomDesign = productType === 'custom-design'
  const isTemplate = productType === 'template'
  const productName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')) : null
  const templateId = searchParams.get('templateId')

  const [loadingCard, setLoadingCard] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    recipientName: '',
  })

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    if (status === 'success' && orderId) {
      setStep(2)
      verifySuccessfulPayment(orderId)
      return
    }

    if (status === 'failed') {
      toast.error('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
    }

    if (isEidSong || isCustomDesign || isTemplate) {
      setCardData({
        name: productName || (isEidSong ? 'اصنع أغنية العيد لمن تحب' : isCustomDesign ? 'طلب تصميم خاص' : 'قالب مميز'),
        price: parseInt(productPrice) || 50,
        image: isTemplate && templateId ? `/templates/جاهزة/${templateId}.png` : null,
        description: isEidSong ? 'أغنية عيد مخصصة باسم من تحب' : isCustomDesign ? 'تصميم بطاقة تهنئة خاص ومميز' : 'قالب احترافي للعيد',
      })
      setLoadingCard(false)
      return
    }

    if (!cardId) {
      setLoadingCard(false)
      return
    }

    loadCardData(cardId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, orderId, status])

  /* ─── API calls (unchanged logic) ─── */
  const verifySuccessfulPayment = async (currentOrderId) => {
    try {
      setSubmitting(true)
      const response = await fetch(`${apiBase}/api/v1/checkout/success?orderId=${currentOrderId}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'لم يكتمل التحقق من الدفع بعد')
        return
      }

      toast.success('تم الدفع بنجاح!')

      if (isEidSong || isCustomDesign) {
        const recipientName = formData.recipientName || ''
        const msgText = isEidSong
          ? `مرحباً، تم دفع طلب أغنية العيد باسم: ${recipientName}\nرقم الطلب: ${currentOrderId}`
          : `مرحباً، تم دفع طلب تصميم خاص\nالاسم: ${formData.customerName}\nرقم الطلب: ${currentOrderId}`
        window.location.href = `https://wa.me/966559955339?text=${encodeURIComponent(msgText)}`
        return
      }

      toast('سيتم تحويلك للمحرر...')
      navigate(data.data.redirectUrl, { replace: true })
    } catch (error) {
      console.error('Verify success error:', error)
      toast.error('تعذر التحقق من حالة الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  const loadCardData = async (id) => {
    try {
      setLoadingCard(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiBase}/api/v1/cards/id/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر تحميل البطاقة')
      setCardData(data.data)
    } catch (error) {
      console.error('Load card error:', error)
      toast.error(error.message || 'فشل تحميل بيانات البطاقة')
    } finally {
      setLoadingCard(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((c) => ({ ...c, [name]: value }))
    if (errors[name]) setErrors((c) => ({ ...c, [name]: '' }))
  }

  const validateStep0 = () => {
    const e = {}
    if (!formData.customerName.trim()) e.customerName = 'الاسم مطلوب'
    if (!formData.customerPhone.trim()) e.customerPhone = 'رقم الهاتف مطلوب'
    else if (!/^(05|5|\+9665)\d{8}$/.test(formData.customerPhone.trim().replace(/\s/g, ''))) e.customerPhone = 'رقم الهاتف غير صالح'
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) e.customerEmail = 'البريد غير صالح'
    if (isEidSong && !formData.recipientName.trim()) e.recipientName = 'اسم المُهدى إليه مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (step === 0 && !validateStep0()) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setStep((s) => Math.min(s + 1, 2))
  }

  const handleSubmit = async () => {
    if (!cardData) { toast.error('لم يتم تحميل بيانات المنتج'); return }

    const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID()
    localStorage.setItem('sessionId', sessionId)

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiBase}/api/v1/checkout/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cardId, sessionId, ...formData }),
      })
      const data = await response.json()
      if (!response.ok || !data.success || !data.iframeUrl) throw new Error(data.message || 'تعذر بدء عملية الدفع')
      window.location.href = data.iframeUrl
    } catch (error) {
      console.error('Checkout initiate error:', error)
      toast.error(error.message || 'حدث خطأ أثناء تجهيز الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  const price = cardData?.price || 0

  /* ─── Verifying spinner screen ─── */
  if (submitting && status === 'success') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <div className="ck-fade-up mx-4 max-w-md rounded-[28px] border border-slate-100 bg-white p-10 text-center" style={{ boxShadow: '0 20px 60px rgba(15,23,42,.06)' }}>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
            <ShieldCheck className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-slate-900">جاري التحقق من الدفع</h1>
          <p className="text-sm leading-relaxed text-slate-500">نراجع العملية... سيتم تحويلك تلقائياً</p>
          <div className="mt-6 flex justify-center"><span className="ck-spinner" style={{ borderTopColor: '#059669', borderColor: 'rgba(5,150,105,.15)' }} /></div>
        </div>
      </div>
    )
  }

  /* ─── Main Render ─── */
  return (
    <div className="min-h-[70vh]" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="mx-auto max-w-[1080px] px-4 pb-20 pt-8 sm:px-6">

        {/* ── Header ── */}
        <div className="ck-fade-up mb-8 flex items-center gap-4">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            style={{ boxShadow: '0 1px 3px rgba(15,23,42,.08)' }}
            aria-label="عودة"
          >
            <ArrowRight className="h-[18px] w-[18px]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-slate-900 sm:text-xl">إتمام الشراء</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-700">آمن</span>
          </div>
        </div>

        {/* ── Progress Steps ── */}
        <div className="ck-fade-up ck-fade-up-1 mb-10">
          <div className="mx-auto flex max-w-md items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = i < step
              const active = i === step
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      background: done ? '#059669' : active ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#f1f5f9',
                      color: done || active ? '#fff' : '#94a3b8',
                      boxShadow: active ? '0 4px 14px rgba(245,158,11,.3)' : 'none',
                    }}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden text-xs font-bold sm:inline" style={{ color: done ? '#059669' : active ? '#92400e' : '#94a3b8' }}>
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="mx-2 h-[2px] w-8 rounded-full sm:w-14" style={{ background: done ? '#059669' : '#e2e8f0' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Two column grid ── */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ─ RIGHT: Form / Review ─ */}
          <div className="ck-fade-up ck-fade-up-2">

            {/* Step 0: Info Form */}
            {step === 0 && (
              <section ref={formRef} className="rounded-[24px] bg-white p-6 sm:p-8" style={{ boxShadow: '0 4px 24px rgba(15,23,42,.04), 0 1px 2px rgba(15,23,42,.06)' }}>
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900">بياناتك</h2>
                  <p className="mt-1 text-sm text-slate-500">أدخل بياناتك للمتابعة لبوابة الدفع الآمنة</p>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      الاسم الكامل <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="اكتب اسمك الكامل" className="ck-input" style={errors.customerName ? { borderColor: '#ef4444' } : {}} />
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    </div>
                    {errors.customerName && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.customerName}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      رقم الهاتف <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="05xxxxxxxx" dir="ltr" className="ck-input" style={{ paddingLeft: '16px', paddingRight: '44px', textAlign: 'left', ...(errors.customerPhone ? { borderColor: '#ef4444' } : {}) }} />
                      <Phone className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    </div>
                    {errors.customerPhone && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.customerPhone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      البريد الإلكتروني <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                    </label>
                    <div className="relative">
                      <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="name@example.com" dir="ltr" className="ck-input" style={{ paddingLeft: '16px', paddingRight: '44px', textAlign: 'left', ...(errors.customerEmail ? { borderColor: '#ef4444' } : {}) }} />
                      <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    </div>
                    {errors.customerEmail && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.customerEmail}</p>}
                  </div>

                  {/* Recipient (Eid Song) */}
                  {isEidSong && (
                    <div>
                      <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Gift className="h-3.5 w-3.5 text-amber-500" />
                        اسم الشخص المُهدى إليه <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="اسم الشخص اللي تبي الأغنية باسمه" className="ck-input" style={{ background: '#fffbeb', ...(errors.recipientName ? { borderColor: '#ef4444' } : {}) }} />
                        <Gift className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                      </div>
                      {errors.recipientName && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.recipientName}</p>}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={goNext}
                  className="ck-btn-pulse mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(217,119,6,.25)' }}
                >
                  متابعة للمراجعة
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </section>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <section className="rounded-[24px] bg-white p-6 sm:p-8" style={{ boxShadow: '0 4px 24px rgba(15,23,42,.04), 0 1px 2px rgba(15,23,42,.06)' }}>
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900">مراجعة الطلب</h2>
                  <p className="mt-1 text-sm text-slate-500">تأكد من بياناتك قبل المتابعة للدفع</p>
                </div>

                {/* Review data */}
                <div className="mb-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  {[
                    { label: 'الاسم', value: formData.customerName },
                    { label: 'الهاتف', value: formData.customerPhone },
                    ...(formData.customerEmail ? [{ label: 'البريد', value: formData.customerEmail }] : []),
                    ...(isEidSong ? [{ label: 'المُهدى إليه', value: formData.recipientName }] : []),
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">{item.label}</span>
                      <span className="text-sm font-extrabold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Product summary */}
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-200">
                    {cardData?.image ? (
                      <img src={cardData.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca)' }}>
                        {isEidSong ? <Star className="h-6 w-6 text-amber-400" /> : <Sparkles className="h-6 w-6 text-white/60" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold text-slate-900">{cardData?.name}</h4>
                    <p className="mt-0.5 text-xs text-slate-500">{cardData?.description}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-base font-black text-amber-700">
                    {price} <SAR size={13} color="#b45309" />
                  </div>
                </div>

                {/* Totals */}
                <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">المنتج</span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">{price} <SAR size={11} /></span>
                  </div>
                  <div className="my-3 border-t border-dashed border-slate-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900">الإجمالي</span>
                    <span className="flex items-center gap-1.5 text-xl font-black text-slate-900">{price} <SAR size={16} /></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    تعديل البيانات
                  </button>
                  <button
                    onClick={() => { setStep(2); handleSubmit() }}
                    disabled={submitting || loadingCard}
                    className="ck-btn-pulse flex flex-[2] items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(217,119,6,.25)' }}
                  >
                    {submitting ? <span className="ck-spinner" /> : (
                      <>
                        <Lock className="h-4 w-4" />
                        ادفع الآن — <span className="flex items-center gap-1">{price} <SAR size={13} color="#fff" /></span>
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-center text-[11px] text-slate-400">
                  ستنتقل لبوابة الدفع المشفرة PayMob لإتمام العملية
                </p>
              </section>
            )}

            {/* Step 2: Processing / Redirecting */}
            {step === 2 && !status && (
              <section className="rounded-[24px] bg-white p-10 text-center" style={{ boxShadow: '0 4px 24px rgba(15,23,42,.04)' }}>
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                  <CreditCard className="h-9 w-9 text-amber-600" />
                </div>
                <h2 className="mb-2 text-xl font-extrabold text-slate-900">جاري تحويلك لبوابة الدفع</h2>
                <p className="text-sm text-slate-500">لا تغلق هذه الصفحة...</p>
                <div className="mt-6 flex justify-center"><span className="ck-spinner" style={{ borderTopColor: '#d97706', borderColor: 'rgba(217,119,6,.15)' }} /></div>
              </section>
            )}
          </div>

          {/* ─ LEFT: Order Summary Sidebar ─ */}
          <aside className="ck-fade-up ck-fade-up-3 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[24px]" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 20px 50px rgba(15,23,42,.15)' }}>

              {/* Product Image */}
              <div className="relative aspect-[5/4] overflow-hidden">
                {loadingCard ? (
                  <div className="flex h-full items-center justify-center bg-slate-800">
                    <span className="ck-spinner" />
                  </div>
                ) : cardData?.image ? (
                  <img src={cardData.image} alt={cardData?.name || ''} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                    {isEidSong ? <Star className="h-14 w-14 text-amber-400" /> : <Sparkles className="h-14 w-14 text-white/40" />}
                    <span className="text-sm font-bold text-white/50">{isEidSong ? 'أغنية العيد' : 'تصميم خاص'}</span>
                  </div>
                )}
                {/* Price badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-2xl px-4 py-2 backdrop-blur-md" style={{ background: 'rgba(245,158,11,.92)', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>
                  <span className="text-lg font-black text-white">{price}</span>
                  <SAR size={14} color="#fff" />
                </div>
                {/* Shimmer overlay */}
                <div className="ck-shimmer absolute inset-0 pointer-events-none" />
              </div>

              {/* Product info */}
              <div className="p-6">
                <h3 className="mb-1 text-lg font-extrabold text-white">{cardData?.name || 'منتج رقمي'}</h3>
                <p className="mb-5 text-xs leading-relaxed text-slate-400">{cardData?.description || 'تُفتح فور نجاح الدفع'}</p>

                {/* Benefits */}
                <div className="mb-5 space-y-3 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)' }}>
                  {BENEFITS.map((b) => {
                    const Icon = b.icon
                    return (
                      <div key={b.text} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(52,211,153,.1)' }}>
                          <Icon className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[13px] text-slate-300">{b.text}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Payment Methods */}
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <p className="mb-3 text-center text-[11px] font-bold text-slate-500">وسائل الدفع المتاحة</p>
                  <div className="flex items-center justify-center gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <span
                        key={m.name}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-bold"
                        style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)' }}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust footer */}
            <div className="mt-4 flex items-center justify-center gap-4 px-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>SSL مشفر</span>
              </div>
              <span>·</span>
              <span>منتج سعودي</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                <span>تفعيل فوري</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
