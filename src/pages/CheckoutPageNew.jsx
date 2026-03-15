import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Star,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SAR from '../components/SAR'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

const checkoutBenefits = [
  'الوصول الفوري بعد إتمام الدفع',
  'استخدام البطاقة داخل المحرر مباشرة',
  'بدون علامة مائية',
  'دعم مستمر إذا واجهتك مشكلة',
]

export default function CheckoutPageNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cardId = searchParams.get('cardId')
  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId')
  const purchaseId = searchParams.get('purchase')
  const productType = searchParams.get('product')
  const productPrice = searchParams.get('price')

  const isEidSong = productType === 'eid-song'
  const isCustomDesign = productType === 'custom-design'
  const productName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')) : null

  const [loadingCard, setLoadingCard] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    recipientName: '',
  })

  useEffect(() => {
    if (status === 'success' && orderId) {
      verifySuccessfulPayment(orderId)
      return
    }

    if (status === 'failed') {
      toast.error('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
    }

    if (isEidSong || isCustomDesign || productType === 'template') {
      setCardData({
        name: productName || (isEidSong ? 'اصنع أغنية العيد لمن تحب' : isCustomDesign ? 'طلب تصميم خاص' : 'قالب مميز'),
        price: parseInt(productPrice) || 50,
        image: null,
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
        const msg = encodeURIComponent(msgText)
        window.location.href = `https://wa.me/966559955339?text=${msg}`
        return
      }

      toast('سيتم تحويلك للمحرر')
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

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر تحميل البطاقة')
      }

      setCardData(data.data)
    } catch (error) {
      console.error('Load card error:', error)
      toast.error(error.message || 'فشل تحميل بيانات البطاقة')
    } finally {
      setLoadingCard(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!cardId) {
      toast.error('لم يتم تحديد البطاقة')
      return
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast.error('الاسم ورقم الهاتف مطلوبان')
      return
    }

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
        body: JSON.stringify({
          cardId,
          sessionId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.iframeUrl) {
        throw new Error(data.message || 'تعذر بدء عملية الدفع')
      }

      window.location.href = data.iframeUrl
    } catch (error) {
      console.error('Checkout initiate error:', error)
      toast.error(error.message || 'حدث خطأ أثناء تجهيز الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitting && status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]" dir="rtl">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-slate-900">جاري التحقق من الدفع</h1>
          <p className="text-sm text-slate-500">نراجع عملية الشراء ثم نحولك مباشرة للمحرر</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">

        {/* Compact Header Row */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            عودة
          </button>
          <h1 className="text-xl font-extrabold text-slate-900">إتمام الشراء</h1>
          {purchaseId ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              #{purchaseId}
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
              آمن
            </span>
          )}
        </div>

        {/* Two Column Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.9fr]">

          {/* RIGHT: Form Section */}
          <section className="rounded-3xl bg-white p-7 shadow-lg sm:p-9">
            <h2 className="text-2xl font-extrabold text-slate-900">بيانات الشراء</h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">أكمل بياناتك وسيتم تحويلك لبوابة الدفع الآمنة</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">الاسم الكامل</span>
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="اكتب الاسم الكامل"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">رقم الهاتف</span>
                <input
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="05xxxxxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  dir="ltr"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">البريد الإلكتروني</span>
                <input
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  dir="ltr"
                />
              </label>

              {isEidSong && (
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">اسم الشخص المُهدى إليه</span>
                  <input
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="اكتب اسم الشخص اللي تبي الأغنية باسمه"
                    className="w-full rounded-xl border border-slate-200 bg-amber-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  />
                </label>
              )}

              {/* Separator */}
              <div className="border-t border-slate-100" />

              {/* Trust Strip */}
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                <span>دفع مشفر</span>
                <span>·</span>
                <span>منتج سعودي</span>
                <span>·</span>
                <span>تفعيل فوري</span>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={submitting || loadingCard || !cardData}
                className="w-full rounded-2xl px-6 py-4 text-base font-extrabold text-white shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                {submitting ? 'جاري تجهيز الدفع...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>إتمام الدفع — {cardData?.price || 0} <SAR size={14} color="#fff" /></span>}
              </button>

              {/* Micro text */}
              <p className="text-center text-[11px] text-slate-400">
                بالضغط على إتمام الدفع ستنتقل لبوابة PayMob الآمنة
              </p>
            </form>
          </section>

          {/* LEFT: Order Summary */}
          <aside className="rounded-3xl bg-[#0f172a] p-6 text-white shadow-lg sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">ملخص الطلب</h2>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-300">
                Checkout
              </span>
            </div>

            {/* Card Image */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="aspect-[6/5] bg-slate-800">
                {loadingCard ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    جاري تحميل البطاقة...
                  </div>
                ) : isEidSong ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #1e1b4b, #4338ca)' }}>
                    <Star className="h-12 w-12 text-amber-400" />
                    <span className="text-sm font-bold text-white/70">أغنية العيد</span>
                  </div>
                ) : (
                  <img
                    src={cardData?.image || '/images/logo.png'}
                    alt={cardData?.name || 'بطاقة'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Card Name + Price */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {cardData?.name || 'بطاقة رقمية'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      تُفتح فور نجاح الدفع
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 text-sm font-black text-slate-950 flex items-center gap-1">
                    {cardData?.price || 0} <SAR size={11} />
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
              {checkoutBenefits.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {['مدى', 'Visa', 'Mastercard', 'Apple Pay'].map((method) => (
                <span key={method} className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-300">
                  {method}
                </span>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
