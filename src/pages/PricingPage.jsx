import { useState } from 'react'
import { pricingPlans } from '../data/templates'
import { Link } from 'react-router-dom'
import { BsCheck2, BsX, BsMoonStars, BsInfoCircle } from 'react-icons/bs'
import toast, { Toaster } from 'react-hot-toast'

export default function PricingPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleSubscribe = (plan) => {
    if (plan.id === 'free') {
      toast.success('أنت تستخدم الخطة المجانية بالفعل!')
      return
    }
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  return (
    <div className="page-shell pb-10 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#17012C', color: '#f0f0f0', border: '1px solid rgba(106,71,237,0.3)' } }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6A47ED]/10 border border-[#6A47ED]/20 rounded-full px-5 py-2 mb-6">
            <BsMoonStars className="text-[#8B6CF6]" />
            <span className="text-[#A78BFA] text-sm">أسعار مناسبة للجميع</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gradient-gold-text">خطط الاشتراك</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            اختر الخطة المناسبة لاحتياجاتك. ابدأ مجاناً وترقّ حسب حاجتك.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative glass rounded-2xl p-8 transition-all hover:scale-105 duration-300 animate-fade-in-up ${
                plan.popular ? 'ring-2 ring-[#8B6CF6] shadow-2xl shadow-[#6A47ED]/20' : ''
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#6A47ED] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    الأكثر طلباً
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <BsMoonStars className="text-2xl" style={{ color: plan.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-black text-white">مجاني</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-gray-400 text-sm">ريال / {plan.period}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-start gap-2">
                    <BsCheck2 className="text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((lim, li) => (
                  <div key={li} className="flex items-start gap-2">
                    <BsX className="text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-500 text-sm">{lim}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.popular
                    ? 'bg-[#6A47ED] text-white hover:shadow-lg hover:shadow-[#6A47ED]/30'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPayment && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass rounded-2xl p-8 max-w-md w-full animate-fade-in-up">
              <div className="text-center mb-6">
                <BsMoonStars className="text-4xl text-[#8B6CF6] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">اشتراك {selectedPlan.name}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedPlan.price} ريال / {selectedPlan.period}
                </p>
              </div>

              <div className="bg-[#6A47ED]/10 border border-[#6A47ED]/20 rounded-xl p-4 mb-6">
                <h4 className="text-[#8B6CF6] font-bold text-sm mb-2">الدفع عبر ويسترن يونيون</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>1. قم بتحويل المبلغ عبر ويسترن يونيون</p>
                  <p>2. أرسل إيصال التحويل عبر واتساب</p>
                  <p>3. سيتم تفعيل حسابك خلال 24 ساعة</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h4 className="text-white font-bold text-sm mb-2">بيانات التحويل:</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>الاسم: <span className="text-white">مؤسسة سليمان — سَلِّم</span></p>
                  <p>المبلغ: <span className="text-[#8B6CF6] font-bold">{selectedPlan.price} ريال سعودي</span></p>
                  <p>رقم واتساب للإيصال: <span className="text-white" dir="ltr">+966XXXXXXXXX</span></p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.open('https://wa.me/966XXXXXXXXX?text=' + encodeURIComponent(`أريد الاشتراك في خطة ${selectedPlan.name} - ${selectedPlan.price} ريال`), '_blank')
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#6A47ED] text-white font-bold text-sm"
                >
                  تواصل واتساب
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="gradient-gold-text">أسئلة شائعة</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: 'هل يمكنني استخدام المنصة مجاناً؟', a: 'نعم! يمكنك إنشاء 3 بطاقات يومياً مجاناً بدون تسجيل. البطاقات المجانية تحمل علامة سَلِّم المائية.' },
              { q: 'كيف يتم الدفع؟', a: 'الدفع يتم عبر ويسترن يونيون. بعد التحويل، أرسل الإيصال عبر واتساب وسيتم التفعيل خلال 24 ساعة.' },
              { q: 'ما المقصود بالوايت لابل؟', a: 'يمكنك تخصيص المنصة بالكامل بهوية شركتك (شعار، ألوان، نطاق) وإخفاء علامة سَلِّم التجارية.' },
              { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك إلغاء الاشتراك في أي وقت. الاشتراك سنوي وغير قابل للاسترداد.' },
              { q: 'هل تدعمون العملات الأخرى؟', a: 'نعم، يمكنك التحويل بأي عملة وسنحتسب المبلغ بسعر الصرف الحالي.' },
            ].map((faq, i) => (
              <details key={i} className="glass rounded-xl group">
                <summary className="flex items-center justify-between p-5 cursor-pointer">
                  <span className="text-white font-medium text-sm">{faq.q}</span>
                  <BsInfoCircle className="text-[#8B6CF6] flex-shrink-0 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
