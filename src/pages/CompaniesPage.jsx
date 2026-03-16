import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, Mail, Phone } from 'lucide-react'

const WHATSAPP_NUMBER = '201007835547'
const ds = { font: "'Tajawal', sans-serif" }

const features = [
  { icon: '🎴', title: 'محرر جماعي ذكي', desc: 'ارفع أسماء الموظفين CSV أو Excel → اختر القالب → حمّل ZIP دفعة واحدة' },
  { icon: '🔗', title: 'رابط موظفين ذكي', desc: 'أنشئ رابط مناسبة وشاركه — كل موظف يكتب اسمه ويحمّل بطاقته بنفسه' },
  { icon: '🎨', title: 'هوية بصرية مخصصة', desc: 'لوجو شركتك + ألوان مخصصة على كل بطاقة — معاينة فورية' },
  { icon: '📊', title: 'عداد رصيد مباشر', desc: 'تتبّع استهلاكك لحظة بلحظة مع تنبيهات تلقائية قبل النفاد' },
]

const packages = [
  { name: 'صغيرة', cards: 50, color: '#10b981' },
  { name: 'متوسطة', cards: 200, color: '#6366f1', popular: true },
  { name: 'كبيرة', cards: 500, color: '#f59e0b' },
  { name: 'مخصصة', cards: null, color: '#ec4899' },
]

const steps = [
  { num: '1', icon: '💬', title: 'تواصل معنا', desc: 'أرسل لنا عبر واتساب أو البريد واختر الباقة المناسبة' },
  { num: '2', icon: '✅', title: 'فعّل حسابك', desc: 'تستلم كود تفعيل وتنشئ حسابك في ثوانٍ' },
  { num: '3', icon: '🚀', title: 'ابدأ مباشرة', desc: 'ارفع الأسماء أو أنشئ رابط موظفين وحمّل البطاقات' },
]

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const btnHover = (e, bg) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${bg}40` }
  const btnLeave = (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }

  return (
    <div dir="rtl" style={{ fontFamily: ds.font, background: '#0f172a', minHeight: '100vh' }}>

      {/* ════════ HERO ════════ */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          {/* Back */}
          <div style={{ textAlign: 'right', marginBottom: 32 }}>
            <button onClick={() => navigate('/')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: 13, fontWeight: 600,
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
            }}>
              <ArrowRight size={16} /> العودة للرئيسية
            </button>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: 24, marginBottom: 28, border: '1px solid rgba(99,102,241,0.15)' }}>
            <Building2 size={36} color="#818cf8" />
          </div>

          <h1 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 12 }}>
            منصة سَلِّم
            <span style={{ display: 'block', fontSize: '0.7em', color: '#818cf8', marginTop: 8, fontWeight: 700 }}>
              حلول بطاقات التهنئة للمؤسسات
            </span>
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.8, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            نظام متكامل لإنشاء وإرسال بطاقات التهنئة لموظفيك بهوية شركتك — محرر جماعي، رابط ذكي للموظفين، وعداد رصيد لحظي.
          </p>

          {/* Hero CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto' }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاشتراك في باقة المؤسسات في منصة سلّم')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '16px 28px', background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 800,
                borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => btnHover(e, '#25D366')} onMouseLeave={btnLeave}
            >
              اطلب باقتك الآن عبر واتساب 💬
            </a>

            {user?.role === 'admin' ? (
              <Link to="/admin/dashboard" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 28px', background: '#fff', color: '#0f172a', fontSize: 15, fontWeight: 700,
                borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
              }} onMouseEnter={(e) => btnHover(e, '#fff')} onMouseLeave={btnLeave}>
                لوحة التحكم <ArrowRight size={18} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => navigate('/company-login')} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 16px', background: '#fff', color: '#0f172a', fontSize: 14, fontWeight: 700,
                  borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }} onMouseEnter={(e) => btnHover(e, '#fff')} onMouseLeave={btnLeave}>
                  دخول المؤسسات
                </button>
                <Link to="/company-activation" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 16px', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', fontSize: 14, fontWeight: 700,
                  borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s',
                }}>
                  تفعيل كود الاشتراك
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 12 }}>
          كل ما تحتاجه شركتك
        </h2>
        <p style={{ fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 40 }}>
          ميزات مصممة خصيصاً لتسهيل تهنئة الموظفين في كل المناسبات
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#1e293b', borderRadius: 20, padding: 'clamp(24px, 3vw, 32px)',
              border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 26 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ PACKAGES ════════ */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 12 }}>
          باقات مرنة لكل حجم
        </h2>
        <p style={{ fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 40 }}>
          اختر الباقة المناسبة — أو اطلب باقة مخصصة بعدد بطاقاتك
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {packages.map((pkg, i) => (
            <div key={i} style={{
              background: pkg.popular ? 'linear-gradient(135deg, #1e293b, #334155)' : '#1e293b',
              borderRadius: 20, padding: 28, textAlign: 'center', position: 'relative',
              border: pkg.popular ? `2px solid ${pkg.color}40` : '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s',
            }}>
              {pkg.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: pkg.color, color: '#fff', fontSize: 11, fontWeight: 800,
                  padding: '4px 14px', borderRadius: 20,
                }}>الأكثر طلباً</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>{pkg.name}</div>
              <div style={{ fontSize: pkg.cards ? 36 : 24, fontWeight: 900, color: pkg.color, marginBottom: 4 }}>
                {pkg.cards ? pkg.cards : '∞'}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                {pkg.cards ? 'بطاقة' : 'حدد العدد'}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#475569', textAlign: 'center', marginTop: 20, lineHeight: 1.8 }}>
          الأسعار حسب الباقة والمتطلبات — تواصل معنا للحصول على عرض سعر مخصص
        </p>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{ padding: '60px 24px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
          كيف تبدأ؟
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, position: 'relative' }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', right: 23, top: 56, width: 2, height: 'calc(100% - 16px)', background: 'rgba(255,255,255,0.06)' }} />
              )}
              <div style={{
                width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {s.icon}
              </div>
              <div style={{ paddingBottom: i < steps.length - 1 ? 32 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', marginBottom: 4 }}>الخطوة {s.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ CTA FOOTER ════════ */}
      <section style={{ padding: '60px 24px 80px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: 28, padding: 'clamp(32px, 5vw, 48px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            جاهز تبدأ مع فريقك؟
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, marginBottom: 32 }}>
            تواصل معنا الآن واحصل على كود التفعيل خلال دقائق
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاشتراك في باقة المؤسسات في منصة سلّم')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '16px 28px', background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 800,
                borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => btnHover(e, '#25D366')} onMouseLeave={btnLeave}
            >
              تواصل عبر واتساب 💬
            </a>

            <a href="mailto:support@sallim.co" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 28px', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', fontSize: 14, fontWeight: 700,
              borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Mail size={16} /> أو راسلنا على support@sallim.co
            </a>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '28px 0 20px' }} />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => navigate('/company-login')} style={{
              padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: 13, fontWeight: 700,
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontFamily: ds.font,
            }}>
              دخول المؤسسات
            </button>
            <Link to="/company-activation" style={{
              padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: 13, fontWeight: 700,
              borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              تفعيل كود الاشتراك
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#334155', marginTop: 24 }}>
          منصة سلّم — sallim.co
        </p>
      </section>
    </div>
  )
}