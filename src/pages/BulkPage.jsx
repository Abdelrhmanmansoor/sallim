import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Zap, Download, ArrowLeft, CheckCircle, Star, Building2, MessageCircle } from 'lucide-react'

const PACKAGES = [
  { id: 'free', count: 1, price: 0, label: 'تجربة مجانية', badge: 'مجاني', color: '#10b981', bg: '#ecfdf5' },
  { id: 'small', count: 5, price: 29, label: '5 بطاقات', badge: 'الأكثر شيوعاً', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'medium', count: 10, price: 49, label: '10 بطاقات', badge: 'قيمة ممتازة', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'large', count: 20, price: 79, label: '20 بطاقة', badge: 'أفضل سعر', color: '#f59e0b', bg: '#fffbeb' },
]

const WHATSAPP_NUMBER = '201007835547'

export default function BulkPage() {
  const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [hoveredPackage, setHoveredPackage] = useState(null)

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg.id)
    if (pkg.id === 'free') {
      navigate('/editor?mode=batch&free=1')
    } else {
      navigate(`/editor?mode=batch&pkg=${pkg.id}&count=${pkg.count}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Tajawal', sans-serif", direction: 'rtl' }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 10vw, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: 100, padding: '8px 20px', marginBottom: 24,
          }}>
            <Users size={16} color="#a855f7" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd' }}>الإرسال الجماعي</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, color: '#fff',
            lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em',
          }}>
            أرسل بطاقات تهنئة
            <br />
            <span style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              لمجموعتك دفعة واحدة
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#94a3b8', maxWidth: 550, margin: '0 auto 40px', lineHeight: 1.8 }}>
            اختر الكمية، ادفع، اكتب الأسماء — وحمّل كل البطاقات في ملف ZIP واحد خلال ثوانٍ
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[
              { icon: Zap, text: 'جاهز في ثوانٍ' },
              { icon: Download, text: 'تحميل ZIP' },
              { icon: CheckCircle, text: 'بدون حساب' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 18px',
              }}>
                <f.icon size={16} color="#a855f7" />
                <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
            اختر الحزمة المناسبة
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
            ابدأ بتجربة مجانية أو اختر الحزمة التي تناسب عدد المستلمين
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 48,
        }}>
          {PACKAGES.map((pkg) => {
            const isHovered = hoveredPackage === pkg.id
            const isSelected = selectedPackage === pkg.id
            return (
              <button
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
                style={{
                  position: 'relative',
                  background: '#fff',
                  border: `2px solid ${isHovered || isSelected ? pkg.color : '#e2e8f0'}`,
                  borderRadius: 24,
                  padding: '32px 24px',
                  cursor: 'pointer',
                  fontFamily: "'Tajawal', sans-serif",
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 40px ${pkg.color}20` : '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                {/* Badge */}
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: pkg.color, color: '#fff', padding: '4px 16px',
                  borderRadius: 100, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
                }}>
                  {pkg.badge}
                </div>

                {/* Count */}
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: pkg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '12px auto 20px',
                }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: pkg.color }}>{pkg.count}</span>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                  {pkg.label}
                </h3>

                {/* Price */}
                <div style={{ marginBottom: 20 }}>
                  {pkg.price === 0 ? (
                    <span style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>مجاناً</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                      <span style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>{pkg.price}</span>
                      <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>ر.س</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div style={{
                  padding: '14px 24px', borderRadius: 14,
                  background: isHovered ? pkg.color : pkg.bg,
                  color: isHovered ? '#fff' : pkg.color,
                  fontSize: 15, fontWeight: 800,
                  transition: 'all 0.3s ease',
                }}>
                  {pkg.price === 0 ? 'جرّب الآن' : 'اختر الحزمة'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Companies CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '2px solid #fbbf24',
          borderRadius: 24,
          padding: 'clamp(24px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Building2 size={24} color="#b45309" />
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#92400e', margin: 0 }}>
                تحتاج أكثر من 20 بطاقة؟
              </h3>
            </div>
            <p style={{ fontSize: 15, color: '#b45309', lineHeight: 1.8, margin: 0 }}>
              باقات الشركات تبدأ من 50 بطاقة وحتى 500+ مع رابط موظفين ذكي وهوية مخصصة.
              <br />تواصل معنا واحصل على عرض سعر مخصص لشركتك.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاستفسار عن باقات الشركات للإرسال الجماعي 🏢')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', background: '#25D366', color: '#fff',
                borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 800,
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                transition: 'all 0.2s',
              }}
            >
              <MessageCircle size={18} />
              تواصل عبر واتساب
            </a>
            <Link
              to="/companies"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', background: '#b45309', color: '#fff',
                borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 800,
                transition: 'all 0.2s',
              }}
            >
              <Building2 size={18} />
              باقات الشركات
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#0f172a', marginBottom: 48 }}>
            كيف يعمل؟
          </h2>

          <div style={{ display: 'grid', gap: 24 }}>
            {[
              { step: '1', title: 'اختر الكمية وادفع', desc: 'اختر الحزمة المناسبة وادفع بالبطاقة البنكية أو PayPal — بدون تسجيل.' },
              { step: '2', title: 'اختر القالب واكتب الأسماء', desc: 'اختر تصميم البطاقة واكتب أسماء المستلمين يدوياً أو ارفع ملف CSV.' },
              { step: '3', title: 'حمّل ملف ZIP', desc: 'اضغط "ولّد الكل" وحمّل كل البطاقات في ملف ZIP جاهز للمشاركة.' },
            ].map((item) => (
              <div key={item.step} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                background: '#fff', borderRadius: 20, padding: 28,
                border: '1px solid #e2e8f0',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flex: '0 0 48px',
                  background: '#0f172a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900,
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6, marginTop: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div style={{ textAlign: 'center', padding: '40px 24px 60px' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: '#64748b', fontSize: 14, fontWeight: 600, textDecoration: 'none',
        }}>
          <ArrowLeft size={16} />
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
