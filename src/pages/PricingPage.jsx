import { useState } from 'react'
import { pricingPlans } from '../data/templates'
import { Check, X, Sparkles } from 'lucide-react'
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
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#0f172a', color: '#f0f0f0', border: '1px solid rgba(45,212,191,0.3)' } }} />

      {/* Hero header */}
      <section style={{
        background: 'linear-gradient(180deg, #070d1a 0%, #0c1929 50%, #111f36 100%)',
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            border: '1px solid rgba(45,212,191,0.2)',
            background: 'rgba(45,212,191,0.06)',
            marginBottom: '24px',
          }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>أسعار مناسبة للجميع</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            خطط الاشتراك
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            اختر الخطة المناسبة لاحتياجاتك. ابدأ مجاناً وترقّ حسب حاجتك.
          </p>
        </div>
      </section>

      {/* Plans grid */}
      <section style={{ background: '#ffffff', paddingTop: '80px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '80px',
          }}>
            {pricingPlans.map((plan) => (
              <div key={plan.id} style={{
                padding: '36px 28px',
                borderRadius: '20px',
                border: plan.popular ? '2px solid #2dd4bf' : '1px solid #e2e8f0',
                background: plan.popular ? '#f0fdfa' : '#fafbfc',
                position: 'relative',
                transition: 'all 0.3s',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
                    color: '#020617',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 16px',
                    borderRadius: '9999px',
                  }}>
                    الأكثر طلباً
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{plan.name}</h3>
                  <div>
                    {plan.price === 0 ? (
                      <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>مجاني</span>
                    ) : (
                      <>
                        <span style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{plan.price}</span>
                        <span style={{ fontSize: '14px', color: '#64748b', marginRight: '4px' }}>ريال / {plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{f}</span>
                    </div>
                  ))}
                  {plan.limitations.map((l, li) => (
                    <div key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <X style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{l}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    borderRadius: '12px',
                    border: plan.popular ? 'none' : '1px solid #e2e8f0',
                    background: plan.popular ? 'linear-gradient(135deg, #2dd4bf, #06b6d4)' : '#ffffff',
                    color: plan.popular ? '#020617' : '#0f172a',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: 'inherit',
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '40px' }}>
              أسئلة شائعة
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { q: 'هل يمكنني استخدام المنصة مجاناً؟', a: 'نعم! يمكنك إنشاء 3 بطاقات يومياً مجاناً بدون تسجيل.' },
                { q: 'كيف يتم الدفع؟', a: 'الدفع يتم عبر ويسترن يونيون. بعد التحويل، أرسل الإيصال عبر واتساب وسيتم التفعيل خلال 24 ساعة.' },
                { q: 'ما المقصود بالوايت لابل؟', a: 'يمكنك تخصيص المنصة بالكامل بهوية شركتك.' },
                { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك إلغاء الاشتراك في أي وقت.' },
              ].map((faq, i) => (
                <details key={i} style={{
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  overflow: 'hidden',
                }}>
                  <summary style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0f172a',
                    listStyle: 'none',
                  }}>
                    {faq.q}
                  </summary>
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          padding: '24px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '36px',
            maxWidth: '420px',
            width: '100%',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>
              اشتراك {selectedPlan.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
              {selectedPlan.price} ريال / {selectedPlan.period}
            </p>

            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0d9488', marginBottom: '12px' }}>الدفع عبر ويسترن يونيون</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                1. قم بتحويل المبلغ عبر ويسترن يونيون<br />
                2. أرسل إيصال التحويل عبر واتساب<br />
                3. سيتم تفعيل حسابك خلال 24 ساعة
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  window.open('https://wa.me/966XXXXXXXXX?text=' + encodeURIComponent(`أريد الاشتراك في خطة ${selectedPlan.name} - ${selectedPlan.price} ريال`), '_blank')
                }}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
                  color: '#020617',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                تواصل واتساب
              </button>
              <button
                onClick={() => setShowPayment(false)}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
