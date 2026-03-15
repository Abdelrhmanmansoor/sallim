import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

  const [loadingCard, setLoadingCard] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  })

  useEffect(() => {
    if (status === 'success' && orderId) {
      verifySuccessfulPayment(orderId)
      return
    }

    if (status === 'failed') {
      toast.error('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
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

      toast.success('تم الدفع بنجاح، سيتم تحويلك للمحرر')
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)]" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* Step Progress Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          {[
            { step: 1, label: 'بيانات العميل' },
            { step: 2, label: 'الدفع الآمن' },
            { step: 3, label: 'التأكيد' },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center gap-3" style={{ flex: i < arr.length - 1 ? 1 : 'none' }}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                    s.step === 1
                      ? 'bg-slate-900 text-white'
                      : 'border-2 border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {s.step}
                </div>
                <span className={`text-[11px] font-bold ${s.step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="mt-[-18px] h-[2px] flex-1 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            عودة
          </button>

          {purchaseId && (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              Purchase #{purchaseId}
            </span>
          )}
        </div>

        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700">
            <Lock className="h-4 w-4 text-slate-500" />
            إتمام الشراء الآمن 🔒
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            إتمام الشراء
          </h1>
          <p className="mt-3 text-base leading-8 text-slate-600">
            راجع تفاصيل البطاقة، أكمل بياناتك، ثم سيتم تحويلك إلى بوابة الدفع الآمنة. بعد نجاح العملية نتحقق من الطلب وننقلك مباشرة إلى المحرر.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">بيانات العميل</h2>
                <p className="text-sm text-slate-500">لن نطلب منك بيانات البطاقة هنا، سيتم نقلك إلى PayMob</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">الاسم الكامل</span>
                <div className="relative">
                  <input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="اكتب الاسم الكامل"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  />
                  <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">رقم الهاتف</span>
                <div className="relative">
                  <input
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="05xxxxxxxx"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-left text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    dir="ltr"
                  />
                  <Phone className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">البريد الإلكتروني</span>
                <div className="relative">
                  <input
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-left text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    dir="ltr"
                  />
                  <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </label>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-emerald-800">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-extrabold">✅ نحن نحمي بياناتك</span>
                </div>
                <p className="text-sm leading-7 text-emerald-700">
                  عند الضغط على زر الإكمال سيتم تحويلك إلى صفحة الدفع الآمنة، وبعد النجاح يتم تسجيل العملية في التحليلات لتظهر في لوحة الإدارة.
                </p>
                <p className="mt-2 text-[11px] text-emerald-600">لن يتم مشاركة بياناتك مع أي طرف ثالث</p>
              </div>

              {/* Payment Method Logos */}
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-[11px] font-semibold text-slate-400">ندعم:</span>
                {['مدى', 'Visa', 'Mastercard', 'Apple Pay'].map((method) => (
                  <span key={method} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600">
                    {method}
                  </span>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting || loadingCard || !cardData}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag className="h-5 w-5" />
                {submitting ? 'جاري تجهيز الدفع...' : `ادفع الآن ${cardData?.price || 0} ر.س`}
              </button>
            </form>

            {/* Security Footer */}
            <div className="mt-4 text-center">
              <p className="text-[11px] font-medium text-slate-400">🔒 جميع المعاملات مشفرة ومحمية بتقنية SSL 256-bit</p>
            </div>

            {/* Trust Badges - Salla-inspired */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Lock className="h-5 w-5 text-amber-500" />
                <span>تشفير SSL</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span>تفعيل فوري</span>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-[#0f172a] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold">ملخص الطلب</h2>
                <p className="mt-1 text-sm text-slate-300">المحتوى الذي سيُفتح لك بعد نجاح الدفع</p>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">
                Checkout
              </span>
            </div>

            <div className="mb-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
              <div className="aspect-[6/5] bg-slate-800">
                {loadingCard ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    جاري تحميل البطاقة...
                  </div>
                ) : (
                  <img
                    src={cardData?.image || '/images/logo.png'}
                    alt={cardData?.name || 'بطاقة'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      {cardData?.name || 'بطاقة رقمية'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      سيتم فتحها لك فور نجاح الدفع والتحقق من العملية.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-black text-slate-950">
                    {cardData?.price || 0} ر.س
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
              {checkoutBenefits.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-white px-5 py-4 text-slate-900">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>الإجمالي</span>
                <span>شامل التحقق بعد الدفع</span>
              </div>
              <div className="text-3xl font-black">{cardData?.price || 0} ر.س</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
