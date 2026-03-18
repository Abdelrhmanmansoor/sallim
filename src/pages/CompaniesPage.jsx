import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WHATSAPP_NUMBER = '201007835547'
const SITE_URL = 'https://www.sallim.co'

const stats = [
  { number: '+500', label: 'بطاقة يومياً' },
  { number: '3', label: 'دقائق متوسط التوليد' },
  { number: '+50', label: 'قالب احترافي' },
]

const steps = [
  { n: '01', title: 'تواصل وفعّل حسابك', desc: 'تواصل معنا، نحدد الباقة المناسبة، ونرسل لك كود التفعيل فوراً' },
  { n: '02', title: 'ارفع أسماء موظفيك', desc: 'ارفع ملف CSV أو Excel بأسماء الموظفين أو اكتبها يدوياً' },
  { n: '03', title: 'حمّل البطاقات جاهزة', desc: 'اختر القالب واضغط "ولّد الكل" — ملف ZIP جاهز في ثوانٍ' },
]

const features = [
  { title: 'هوية بصرية كاملة', desc: 'ألوانك وشعارك على كل بطاقة — معاينة فورية قبل التوليد' },
  { title: 'رفع جماعي فوري', desc: 'CSV أو Excel بأي عدد من الأسماء — بدون حد أقصى' },
  { title: 'رابط ذكي للموظفين', desc: 'يجيب كل موظف بطاقته بنفسه من خلال رابط المناسبة' },
  { title: 'تحكم كامل', desc: 'داشبورد مخصص، عداد رصيد، وسجل استخدام شامل' },
]

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [activationCode, setActivationCode] = useState('')

  const handleActivate = () => {
    if (activationCode.trim()) {
      navigate(`/company-activation?code=${encodeURIComponent(activationCode.trim())}`)
    } else {
      navigate('/company-activation')
    }
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', background: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* NAV */}
      <nav style={{
        padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1a1a2e', position: 'sticky', top: 0, background: '#0a0a0f', zIndex: 50,
      }}>
        <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: 1 }}>سَلِّم</a>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/company-login')} style={{
            padding: '9px 20px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d2d3d',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Arial, sans-serif',
          }}>دخول</button>
          <button onClick={() => navigate('/company-activation')} style={{
            padding: '9px 20px', background: '#7c3aed', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Arial, sans-serif',
          }}>تفعيل الحساب</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 32px clamp(60px, 8vw, 100px)', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
          color: '#6366f1', textTransform: 'uppercase', marginBottom: 24,
          border: '1px solid #6366f120', borderRadius: 4, padding: '6px 16px',
        }}>حلول المؤسسات</div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: '#ffffff',
          lineHeight: 1.25, marginBottom: 20, letterSpacing: '-0.02em',
        }}>
          بطاقات تهنئة احترافية
          <br />
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>لفريقك</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px' }}>
          أرسل بطاقة مخصصة لكل موظف — دفعة واحدة، في دقائق
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاشتراك في نظام المؤسسات في منصة سلّم')}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '14px 32px', background: '#7c3aed', color: '#fff', fontSize: 15, fontWeight: 600,
              borderRadius: 8, textDecoration: 'none',
            }}
          >ابدأ الآن — تواصل معنا</a>
          <button onClick={() => navigate('/company-activation')} style={{
            padding: '14px 32px', background: 'transparent', color: '#e2e8f0', fontSize: 15, fontWeight: 600,
            borderRadius: 8, border: '1px solid #2d2d3d', cursor: 'pointer', fontFamily: 'Arial, sans-serif',
          }}>لدي كود تفعيل</button>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 32px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12,
              padding: 'clamp(24px, 4vw, 36px) 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{s.number}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 32px', borderTop: '1px solid #1a1a2e' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 }}>كيف يعمل</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: '#fff', margin: 0 }}>ثلاث خطوات وتنتهي</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderLeft: i < steps.length - 1 ? '1px solid #1e1e2e' : 'none',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 2, marginBottom: 16 }}>{s.n}</div>
                <div style={{ width: 32, height: 1, background: '#2d2d3d', marginBottom: 20 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 32px', borderTop: '1px solid #1a1a2e' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 }}>المزايا</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: '#fff', margin: 0 }}>كل ما تحتاجه في مكان واحد</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid #1e1e2e', borderRadius: 12, overflow: 'hidden' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#0d0d15', padding: 'clamp(24px, 4vw, 36px)',
                borderBottom: i < 2 ? '1px solid #1e1e2e' : 'none',
                borderLeft: i % 2 === 0 ? '1px solid #1e1e2e' : 'none',
              }}>
                <div style={{ width: 24, height: 1, background: '#7c3aed', marginBottom: 20 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 32px', borderTop: '1px solid #1a1a2e' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#6366f1', textTransform: 'uppercase', marginBottom: 12 }}>الأسعار</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>اشترِ وابدأ فوراً</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>ادفع إلكترونياً ويصلك كود التفعيل تلقائياً خلال ثوانٍ</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { key: 'starter', name: 'الأساسية', price: 99, limit: '500 بطاقة', features: ['هوية بصرية مخصصة', 'رفع جماعي CSV', 'لوحة تحكم كاملة'], badge: null },
              { key: 'pro', name: 'الاحترافية', price: 199, limit: '1,500 بطاقة', features: ['كل مزايا الأساسية', 'إحصائيات متقدمة', 'دعم ذو أولوية'], badge: 'الأكثر طلباً' },
              { key: 'enterprise', name: 'المؤسسية', price: 399, limit: '5,000 بطاقة', features: ['كل مزايا الاحترافية', 'White Label كامل', 'مدير حساب مخصص'], badge: null },
            ].map((pkg) => (
              <div key={pkg.key} style={{
                background: pkg.badge ? '#0d0d18' : '#111118',
                border: `1px solid ${pkg.badge ? '#4f46e5' : '#1e1e2e'}`,
                borderRadius: 12, padding: '28px 24px',
                boxShadow: pkg.badge ? '0 0 0 1px #4f46e520' : 'none',
                display: 'flex', flexDirection: 'column',
              }}>
                {pkg.badge && (
                  <div style={{ display: 'inline-block', background: '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', borderRadius: 20, padding: '3px 10px', marginBottom: 12, width: 'fit-content' }}>
                    {pkg.badge}
                  </div>
                )}
                <p style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>{pkg.name}</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>{pkg.price} <span style={{ fontSize: 14, color: '#64748b' }}>ر.س</span></p>
                <p style={{ fontSize: 12, color: '#475569', margin: '0 0 20px' }}>/ سنة — {pkg.limit}</p>
                {pkg.features.map((f, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#6366f1', fontWeight: 700 }}>✓</span> {f}
                  </p>
                ))}
                <button
                  onClick={() => navigate(`/company-checkout?package=${pkg.key}`)}
                  style={{
                    marginTop: 'auto', paddingTop: 20, paddingBottom: 0, display: 'block',
                    padding: '12px', background: pkg.badge ? '#4f46e5' : 'transparent',
                    color: pkg.badge ? '#fff' : '#6366f1',
                    border: `1px solid ${pkg.badge ? '#4f46e5' : '#2d2d4d'}`,
                    borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Arial, sans-serif', width: '100%',
                  }}
                >
                  اشترِ الآن →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 32px', borderTop: '1px solid #1a1a2e' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>تحتاج خطة مخصصة؟</h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 40 }}>تواصل معنا لباقة مؤسسية مخصصة أو لأي استفسار</p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاشتراك في نظام المؤسسات في منصة سلّم')}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', padding: '15px 40px', background: '#166534',
              color: '#fff', fontSize: 15, fontWeight: 600, borderRadius: 8,
              textDecoration: 'none', marginBottom: 28,
            }}
          >تواصل عبر واتساب</a>

          <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>أو أدخل كود التفعيل إذا كان لديك واحد</p>

          <div style={{ display: 'flex', gap: 10, maxWidth: 360, margin: '0 auto' }}>
            <input
              type="text"
              value={activationCode}
              onChange={e => setActivationCode(e.target.value)}
              placeholder="SALL-XXXX-XXXX"
              dir="ltr"
              style={{
                flex: 1, padding: '12px 16px', background: '#111118', border: '1px solid #2d2d3d',
                borderRadius: 8, color: '#fff', fontSize: 14, fontFamily: 'monospace',
                outline: 'none', textAlign: 'center', letterSpacing: 2,
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
              onBlur={e => e.currentTarget.style.borderColor = '#2d2d3d'}
              onKeyDown={e => e.key === 'Enter' && handleActivate()}
            />
            <button onClick={handleActivate} style={{
              padding: '12px 20px', background: '#7c3aed', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Arial, sans-serif',
              whiteSpace: 'nowrap',
            }}>فعّل</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid #1a1a2e', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>
          منصة سلّم — <a href={SITE_URL} style={{ color: '#475569', textDecoration: 'none' }}>sallim.co</a>
        </p>
      </footer>
    </div>
  )
}
