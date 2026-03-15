import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SAR from '../components/SAR'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

/* ── inject checkout styles once ── */
const injectCheckoutCSS = (() => {
  let done = false
  return () => {
    if (done) return
    done = true
    const s = document.createElement('style')
    s.textContent = `
      .co-root { --co-brand: #b8860b; --co-brand-dark: #996f09; --co-bg: #fafafa; --co-card: #fff; --co-border: #e8e8e8; --co-text: #1a1a1a; --co-muted: #6b7280; --co-success: #16a34a; --co-radius: 12px; }
      .co-root *, .co-root *::before, .co-root *::after { box-sizing: border-box; }
      .co-root { font-family: 'Tajawal', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--co-text); background: var(--co-bg); min-height: 70vh; }
      .co-container { max-width: 1040px; margin: 0 auto; padding: 32px 20px 60px; }
      .co-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
      @media (min-width: 860px) { .co-grid { grid-template-columns: 1.15fr 0.85fr; } }
      .co-card { background: var(--co-card); border: 1px solid var(--co-border); border-radius: var(--co-radius); }
      .co-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
      .co-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--co-muted); background: none; border: 1px solid var(--co-border); border-radius: 8px; padding: 8px 14px; cursor: pointer; transition: all .15s; }
      .co-back:hover { background: #f3f4f6; color: var(--co-text); }
      .co-title { font-size: 20px; font-weight: 800; color: var(--co-text); letter-spacing: -.02em; }
      .co-secure { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--co-success); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 5px 12px; }
      .co-form-title { font-size: 17px; font-weight: 800; margin: 0 0 4px; }
      .co-form-sub { font-size: 13px; color: var(--co-muted); margin: 0 0 24px; }
      .co-label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 6px; }
      .co-label .co-req { color: #dc2626; margin-right: 2px; }
      .co-input-wrap { position: relative; margin-bottom: 18px; }
      .co-input { width: 100%; height: 48px; border: 1px solid var(--co-border); border-radius: 10px; padding: 0 14px 0 40px; font-size: 14px; font-family: inherit; color: var(--co-text); background: #fafbfc; outline: none; transition: border-color .15s, box-shadow .15s; }
      .co-input:focus { border-color: var(--co-brand); box-shadow: 0 0 0 3px rgba(184,134,11,.1); background: #fff; }
      .co-input::placeholder { color: #9ca3af; }
      .co-input[dir=ltr] { padding: 0 40px 0 14px; text-align: left; }
      .co-input-icon { position: absolute; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
      .co-input-icon-l { left: 12px; }
      .co-input-icon-r { right: 12px; }
      .co-error { font-size: 12px; font-weight: 600; color: #dc2626; margin-top: 4px; }
      .co-divider { border: none; border-top: 1px solid var(--co-border); margin: 24px 0; }
      .co-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 52px; border: none; border-radius: 10px; font-size: 15px; font-weight: 800; font-family: inherit; cursor: pointer; transition: all .15s; }
      .co-btn:disabled { opacity: .5; cursor: not-allowed; }
      .co-btn-primary { background: var(--co-brand); color: #fff; }
      .co-btn-primary:hover:not(:disabled) { background: var(--co-brand-dark); }
      .co-btn-outline { background: transparent; color: var(--co-muted); border: 1px solid var(--co-border); font-size: 13px; height: 44px; }
      .co-btn-outline:hover { background: #f9fafb; }
      .co-trust-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; font-size: 11px; color: #9ca3af; font-weight: 600; }
      .co-trust-row svg { width: 13px; height: 13px; }
      .co-summary { padding: 0; overflow: hidden; }
      .co-summary-img { aspect-ratio: 4/3; background: #f3f4f6; position: relative; overflow: hidden; }
      .co-summary-img img { width: 100%; height: 100%; object-fit: cover; }
      .co-summary-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: rgba(255,255,255,.5); font-size: 13px; font-weight: 700; gap: 8px; }
      .co-price-badge { position: absolute; bottom: 12px; left: 12px; display: inline-flex; align-items: center; gap: 5px; background: var(--co-brand); color: #fff; font-size: 15px; font-weight: 900; padding: 6px 16px; border-radius: 8px; }
      .co-summary-body { padding: 20px 22px 24px; }
      .co-product-name { font-size: 16px; font-weight: 800; margin: 0 0 4px; }
      .co-product-desc { font-size: 12px; color: var(--co-muted); margin: 0 0 20px; line-height: 1.6; }
      .co-benefit { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; padding: 8px 0; }
      .co-benefit-icon { width: 22px; height: 22px; border-radius: 6px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .co-benefit-icon svg { width: 12px; height: 12px; color: var(--co-success); }
      .co-methods { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-top: 1px solid var(--co-border); }
      .co-methods span { font-size: 11px; font-weight: 700; color: var(--co-muted); background: #f3f4f6; padding: 4px 10px; border-radius: 6px; }
      .co-total-row { display: flex; align-items: center; justify-content: between; padding: 14px 22px; background: #f9fafb; border-top: 1px solid var(--co-border); }
      .co-total-label { flex: 1; font-size: 14px; font-weight: 800; }
      .co-total-value { font-size: 18px; font-weight: 900; display: flex; align-items: center; gap: 4px; }
      .co-review-field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
      .co-review-label { color: var(--co-muted); font-weight: 600; }
      .co-review-value { font-weight: 700; }
      .co-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: co-spin .5s linear infinite; display: inline-block; }
      @keyframes co-spin { to { transform: rotate(360deg); } }
      @keyframes co-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .co-animate { animation: co-fade .3s ease both; }
    `
    document.head.appendChild(s)
  }
})()

/* ── SVG icons (inline, no emojis) ── */
const IconLock = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
const IconCheck = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:12,height:12}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconArrow = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconShield = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:13,height:13}}><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
const IconUser = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
const IconPhone = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
const IconMail = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
const IconGift = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm2 0a1 1 0 10-1-1v1h1zm-6 7l.001-.12a1 1 0 01.98-.88H9v5H5a2 2 0 01-2-2v-2zm6 2.997V12h4.02a1 1 0 01.98.88L15 13v2a2 2 0 01-2 2h-2v-.003z" clipRule="evenodd"/></svg>

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
  const [step, setStep] = useState(0) // 0 = form, 1 = review
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    recipientName: '',
  })

  useEffect(() => { injectCheckoutCSS() }, [])

  useEffect(() => {
    if (status === 'success' && orderId) {
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
        description: isEidSong ? 'أغنية عيد مخصصة باسم من تحب' : isCustomDesign ? 'تصميم بطاقة تهنئة خاص ومميز حسب طلبك' : 'قالب احترافي جاهز للتخصيص',
      })
      setLoadingCard(false)
      return
    }
    if (!cardId) { setLoadingCard(false); return }
    loadCardData(cardId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, orderId, status])

  const verifySuccessfulPayment = async (currentOrderId) => {
    try {
      setSubmitting(true)
      const response = await fetch(`${apiBase}/api/v1/checkout/success?orderId=${currentOrderId}`)
      const data = await response.json()
      if (!response.ok || !data.success) {
        toast.error(data.message || 'لم يكتمل التحقق من الدفع بعد')
        return
      }
      toast.success('تم الدفع بنجاح')
      if (isEidSong || isCustomDesign) {
        const recipientName = formData.recipientName || ''
        const msgText = isEidSong
          ? `مرحباً، تم دفع طلب أغنية العيد باسم: ${recipientName}\nرقم الطلب: ${currentOrderId}`
          : `مرحباً، تم دفع طلب تصميم خاص\nالاسم: ${formData.customerName}\nرقم الطلب: ${currentOrderId}`
        window.location.href = `https://wa.me/966559955339?text=${encodeURIComponent(msgText)}`
        return
      }
      // Redirect to editor with auto-download
      const redirectUrl = data.data?.redirectUrl
      if (redirectUrl) {
        const separator = redirectUrl.includes('?') ? '&' : '?'
        navigate(`${redirectUrl}${separator}autodownload=1`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
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

  const validate = () => {
    const e = {}
    if (!formData.customerName.trim()) e.customerName = 'الاسم مطلوب'
    if (!formData.customerPhone.trim()) e.customerPhone = 'رقم الهاتف مطلوب'
    else if (!/^(05|5|\+9665)\d{8}$/.test(formData.customerPhone.trim().replace(/\s/g, ''))) e.customerPhone = 'رقم هاتف غير صالح'
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) e.customerEmail = 'بريد إلكتروني غير صالح'
    if (isEidSong && !formData.recipientName.trim()) e.recipientName = 'اسم المُهدى إليه مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goToReview = () => {
    if (!validate()) return
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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

  /* ── Verifying payment spinner ── */
  if (submitting && status === 'success') {
    return (
      <div className="co-root" dir="rtl">
        <div className="co-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div className="co-card co-animate" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: 420 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16a34a' }}>
              <IconShield />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>جارٍ التحقق من الدفع</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.7 }}>نراجع العملية وسيتم تحويلك تلقائيًا</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><span className="co-spinner" style={{ borderTopColor: '#16a34a', borderColor: 'rgba(22,163,74,.15)' }} /></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="co-root" dir="rtl">
      <div className="co-container">

        {/* Header */}
        <div className="co-header co-animate">
          <button className="co-back" onClick={() => step > 0 ? setStep(0) : navigate(-1)}>
            <IconArrow />
            <span>{step > 0 ? 'تعديل البيانات' : 'عودة'}</span>
          </button>
          <h1 className="co-title">إتمام الشراء</h1>
          <span className="co-secure"><IconShield /> معاملة آمنة</span>
        </div>

        {/* Grid */}
        <div className="co-grid">

          {/* RIGHT COLUMN — Form / Review */}
          <div>

            {/* Step 0: Form */}
            {step === 0 && (
              <div className="co-card co-animate" style={{ padding: '28px 24px' }} ref={formRef}>
                <h2 className="co-form-title">بيانات المشتري</h2>
                <p className="co-form-sub">أدخل بياناتك للمتابعة لبوابة الدفع الآمنة</p>

                {/* Name */}
                <div className="co-input-wrap">
                  <label className="co-label"><span className="co-req">*</span> الاسم الكامل</label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="الاسم الكامل" style={errors.customerName ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-l"><IconUser /></span>
                  </div>
                  {errors.customerName && <div className="co-error">{errors.customerName}</div>}
                </div>

                {/* Phone */}
                <div className="co-input-wrap">
                  <label className="co-label"><span className="co-req">*</span> رقم الهاتف</label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" dir="ltr" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="05xxxxxxxx" style={errors.customerPhone ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-r"><IconPhone /></span>
                  </div>
                  {errors.customerPhone && <div className="co-error">{errors.customerPhone}</div>}
                </div>

                {/* Email */}
                <div className="co-input-wrap">
                  <label className="co-label">البريد الإلكتروني <span style={{ fontWeight: 400, color: '#9ca3af' }}>(اختياري)</span></label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" dir="ltr" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="name@example.com" style={errors.customerEmail ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-r"><IconMail /></span>
                  </div>
                  {errors.customerEmail && <div className="co-error">{errors.customerEmail}</div>}
                </div>

                {/* Recipient (Eid Song only) */}
                {isEidSong && (
                  <div className="co-input-wrap">
                    <label className="co-label"><span className="co-req">*</span> اسم الشخص المُهدى إليه</label>
                    <div style={{ position: 'relative' }}>
                      <input className="co-input" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="اسم الشخص الذي ستُهدى إليه الأغنية" style={{ background: '#fffbeb', ...(errors.recipientName ? { borderColor: '#dc2626' } : {}) }} />
                      <span className="co-input-icon co-input-icon-l"><IconGift /></span>
                    </div>
                    {errors.recipientName && <div className="co-error">{errors.recipientName}</div>}
                  </div>
                )}

                <hr className="co-divider" />

                <button className="co-btn co-btn-primary" onClick={goToReview}>
                  متابعة للمراجعة
                  <IconArrow />
                </button>

                <div className="co-trust-row">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconLock /> دفع مشفر</span>
                  <span>منتج سعودي</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconShield /> التسليم في نفس اليوم</span>
                </div>
              </div>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <div className="co-card co-animate" style={{ padding: '28px 24px' }}>
                <h2 className="co-form-title">مراجعة الطلب</h2>
                <p className="co-form-sub">تأكد من البيانات قبل إتمام الدفع</p>

                {/* Review fields */}
                <div style={{ marginBottom: 20 }}>
                  {[
                    { label: 'الاسم', value: formData.customerName },
                    { label: 'الهاتف', value: formData.customerPhone },
                    ...(formData.customerEmail ? [{ label: 'البريد', value: formData.customerEmail }] : []),
                    ...(isEidSong ? [{ label: 'المُهدى إليه', value: formData.recipientName }] : []),
                  ].map((f) => (
                    <div key={f.label} className="co-review-field">
                      <span className="co-review-label">{f.label}</span>
                      <span className="co-review-value">{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Product + Total */}
                <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: '#6b7280' }}>{cardData?.name || 'المنتج'}</span>
                    <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>{price} <SAR size={11} /></span>
                  </div>
                  <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>الإجمالي</span>
                    <span style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>{price} <SAR size={15} /></span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <button className="co-btn co-btn-outline" style={{ flex: 1 }} onClick={() => setStep(0)}>تعديل</button>
                  <button className="co-btn co-btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={submitting || loadingCard}>
                    {submitting ? <span className="co-spinner" /> : (
                      <>
                        <IconLock />
                        <span>ادفع الآن</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{price} <SAR size={12} color="#fff" /></span>
                      </>
                    )}
                  </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
                  ستنتقل لبوابة الدفع المشفرة لإتمام العملية بأمان
                </p>
              </div>
            )}
          </div>

          {/* LEFT COLUMN — Order Summary */}
          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div className="co-card co-summary co-animate">

              {/* Product Image */}
              <div className="co-summary-img">
                {loadingCard ? (
                  <div className="co-summary-placeholder"><span className="co-spinner" style={{ borderTopColor: '#6366f1', borderColor: 'rgba(99,102,241,.15)' }} /></div>
                ) : cardData?.image ? (
                  <img src={cardData.image} alt={cardData?.name || ''} />
                ) : (
                  <div className="co-summary-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:36,height:36,opacity:.4}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <span>{isEidSong ? 'أغنية العيد' : isCustomDesign ? 'تصميم خاص' : 'قالب مميز'}</span>
                  </div>
                )}
                <div className="co-price-badge">
                  <span>{price}</span>
                  <SAR size={13} color="#fff" />
                </div>
              </div>

              {/* Product info */}
              <div className="co-summary-body">
                <h3 className="co-product-name">{cardData?.name || 'منتج رقمي'}</h3>
                <p className="co-product-desc">{cardData?.description || 'يُفعَّل فور نجاح الدفع'}</p>

                {/* Benefits */}
                {['التسليم في نفس اليوم بعد إتمام الدفع', 'بدون علامة مائية على التصميم', 'دعم فني في حال واجهتك مشكلة', 'دفع مشفر وآمن بالكامل'].map((b) => (
                  <div key={b} className="co-benefit">
                    <div className="co-benefit-icon"><IconCheck /></div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="co-total-row">
                <span className="co-total-label">الإجمالي</span>
                <span className="co-total-value">{price} <SAR size={15} /></span>
              </div>

              {/* Payment methods */}
              <div className="co-methods">
                {['مدى', 'Visa', 'Mastercard', 'Apple Pay'].map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
