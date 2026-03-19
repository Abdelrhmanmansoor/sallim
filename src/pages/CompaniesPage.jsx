import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WHATSAPP_NUMBER = '201007835547'
const WA_MSG = encodeURIComponent('مرحباً، أريد الاشتراك في نظام بطاقات التهنئة للشركات 🏢')

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [activationCode, setActivationCode] = useState('')
  const [hovered, setHovered] = useState(null)

  const handleActivate = () => {
    if (activationCode.trim()) {
      navigate(`/company-activation?code=${encodeURIComponent(activationCode.trim())}`)
    } else {
      navigate('/company-activation')
    }
  }

  const plans = [
    {
      name: 'الأساسية',
      price: 99,
      period: 'سنوياً',
      cards: '500 بطاقة',
      desc: 'مثالية للشركات الصغيرة والمتاجر',
      features: ['500 بطاقة تهنئة سنوياً', 'لوجو وألوان شركتك', 'رفع CSV/Excel جماعي', 'لوحة تحكم كاملة', 'رابط مخصص للموظفين'],
      badge: null,
      color: '#6366f1',
    },
    {
      name: 'الاحترافية',
      price: 299,
      period: 'سنوياً',
      cards: '2,000 بطاقة',
      desc: 'الأنسب للشركات المتوسطة والمؤسسات',
      features: ['2,000 بطاقة سنوياً', 'كل مزايا الأساسية', 'تهاني أعياد الميلاد', 'إحصائيات وتقارير', 'دعم ذو أولوية'],
      badge: '⭐ الأكثر طلباً',
      color: '#7c3aed',
    },
    {
      name: 'المؤسسية',
      price: 599,
      period: 'سنوياً',
      cards: 'غير محدودة',
      desc: 'للمؤسسات الكبرى والحكومية',
      features: ['بطاقات غير محدودة', 'White Label كامل', 'ربط مع نظام HR', 'مدير حساب مخصص', 'دعم VIP على مدار الساعة'],
      badge: null,
      color: '#b8860b',
    },
  ]

  const testimonials = [
    { name: 'أحمد الغامدي', role: 'مدير موارد بشرية', co: 'شركة الرياض للتقنية', text: 'وفّرنا أكثر من 8 ساعات عمل في أول استخدام. كل موظف تلقّى بطاقته الشخصية خلال دقائق.' },
    { name: 'سارة العتيبي', role: 'مديرة تسويق', co: 'مجموعة الخليج التجارية', text: 'القوالب راقية وتعكس هوية شركتنا بالكامل. عملاؤنا كانوا مبهورين بمستوى الاحترافية.' },
    { name: 'محمد الشمري', role: 'مدير عام', co: 'مؤسسة النخبة', text: 'من أفضل القرارات التي اتخذناها. الكود وصل فوراً وفريقنا بدأ فعلاً في نفس اليوم.' },
  ]

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: '#060612', minHeight: '100vh', color: '#e2e8f0', overflowX: 'hidden' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes borderSpin {
          0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
        }
        .wa-btn { transition: all 0.25s ease !important; }
        .wa-btn:hover { transform: translateY(-3px) scale(1.02) !important; box-shadow: 0 16px 48px rgba(37,211,102,0.5) !important; }
        .plan-card { transition: all 0.3s ease; }
        .plan-card:hover { transform: translateY(-8px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        .animated-border {
          background: linear-gradient(270deg, #25D366, #128C7E, #25D366);
          background-size: 400% 400%;
          animation: borderSpin 2.5s ease infinite;
          border-radius: 18px; padding: 3px; display: block;
        }
        .animated-border button {
          width: 100%; padding: 16px; background: #0a2016; color: #fff;
          font-size: 17px; font-weight: 800; border-radius: 16px; border: none;
          cursor: pointer; font-family: 'Tajawal',sans-serif; transition: background 200ms;
        }
        .animated-border button:hover { background: #0d2e1e; }
      `}</style>

      {/* NAV */}
      <nav style={{
        padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'sticky', top: 0,
        background: 'rgba(6,6,18,0.92)', backdropFilter: 'blur(20px)', zIndex: 50,
      }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 900, color: '#fff', textDecoration: 'none', letterSpacing: 1 }}>
          سَلِّم
          <span style={{ fontSize: 11, background: 'linear-gradient(90deg,#6366f1,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, marginRight: 6 }}>للشركات</span>
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/company-login')} style={{
            padding: '9px 20px', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
          }}>دخول</button>
          <button onClick={() => navigate('/company-activation')} style={{
            padding: '9px 22px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', border: 'none',
            borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
          }}>🎉 سجّل مجاناً</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: 'clamp(80px,12vw,140px) 24px clamp(60px,8vw,100px)', maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 100, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', marginBottom: 28 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'glow 2s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc' }}>نظام الشركات — متاح الآن</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, color: '#fff',
          lineHeight: 1.2, marginBottom: 24, letterSpacing: '-0.02em',
        }}>
          هنّئ موظفيك وعملاءك
          <br />
          <span style={{ background: 'linear-gradient(90deg,#818cf8,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            بهوية شركتك المميزة
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#64748b', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 40px' }}>
          أرسل بطاقة تهنئة مخصصة بشعارك وألوانك لكل موظف وعميل — دفعة واحدة، في دقائق.
          <br />
          <strong style={{ color: '#94a3b8' }}>مجاني بالكامل — سجّل الآن وابدأ فوراً.</strong>
        </p>

        {/* Main CTA */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <button onClick={() => navigate('/company-activation')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
            color: '#fff', fontSize: 17, fontWeight: 800,
            borderRadius: 14, border: 'none', cursor: 'pointer',
            fontFamily: "'Tajawal',sans-serif",
            boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          }}>
            🎉 سجّل شركتك مجاناً
          </button>
          <button onClick={() => navigate('/company-login')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 32px', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0',
            fontSize: 16, fontWeight: 700, borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
            fontFamily: "'Tajawal',sans-serif", transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            لديّ حساب — دخول
          </button>
        </div>

        {/* Social Proof Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[
            { num: '+120', label: 'شركة سعودية' },
            { num: '+50,000', label: 'بطاقة أُرسلت' },
            { num: '99%', label: 'رضا العملاء' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#818cf8', textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(129,140,248,0.2)', borderRadius: 4, padding: '6px 16px' }}>كيف يعمل</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', margin: 0 }}>3 خطوات وتهانيك تصل لكل موظف</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { icon: '📝', num: '01', title: 'سجّل مجاناً', desc: 'أدخل اسم الشركة والبريد الإلكتروني وكلمة المرور — ينشأ حسابك فوراً بلا رسوم' },
              { icon: '🎨', num: '02', title: 'خصّص هويتك', desc: 'أضف شعار شركتك وألوانك واختر القوالب التي تناسبك' },
              { icon: '🚀', num: '03', title: 'ابدأ الإرسال', desc: 'ارفع أسماء الموظفين واضغط "ولّد الكل" — البطاقات جاهزة خلال ثوانٍ' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 3, marginBottom: 12 }}>{s.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#818cf8', textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(129,140,248,0.2)', borderRadius: 4, padding: '6px 16px' }}>المزايا</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>كل ما يحتاجه فريقك في مكان واحد</h2>
            <p style={{ fontSize: 16, color: '#475569', margin: 0 }}>منصة متكاملة صُممت خصيصاً للشركات السعودية</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {[
              { icon: '🎨', title: 'هوية بصرية كاملة', desc: 'شعارك وألوانك وخطك على كل بطاقة — معاينة فورية قبل الإرسال' },
              { icon: '📋', title: 'رفع جماعي بضغطة', desc: 'ارفع ملف Excel/CSV بأي عدد من الأسماء وولّد الكل دفعة واحدة' },
              { icon: '🔗', title: 'رابط ذكي مخصص', desc: 'كل موظف يجيب بطاقته من رابط المناسبة بدون تحميل أي شيء' },
              { icon: '📊', title: 'لوحة تحكم احترافية', desc: 'تتبّع الاستهلاك، الإحصائيات، وسجل كامل بكل العمليات' },
              { icon: '🎂', title: 'أعياد ميلاد الموظفين', desc: 'أرسل تهنئة تلقائية لكل موظف في يوم ميلاده' },
              { icon: '⚡', title: 'تفعيل فوري بكود', desc: 'تواصل معنا على واتساب واحصل على كودك وابدأ في نفس اليوم' },
            ].map((f, i) => (
              <div key={i}
                className="plan-card"
                onMouseEnter={() => setHovered(`f${i}`)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === `f${i}` ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${hovered === `f${i}` ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 18, padding: '28px 24px',
                }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#818cf8', textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(129,140,248,0.2)', borderRadius: 4, padding: '6px 16px' }}>آراء العملاء</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#fff', margin: 0 }}>ماذا يقول عملاؤنا؟</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px 24px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#fbbf24', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, margin: '0 0 24px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{t.role} · {t.co}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVATION CTA */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(124,58,237,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 28, padding: 'clamp(40px,6vw,60px) 32px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
              سجّل شركتك الآن — مجاناً
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, margin: '0 0 40px' }}>
              اسم الشركة + البريد الإلكتروني + كلمة المرور — وتبدأ فوراً بلا رسوم أو قيود.
            </p>

            <button
              onClick={() => navigate('/company-activation')}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                color: '#fff', fontSize: 17, fontWeight: 800,
                cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                marginBottom: 12,
              }}
            >
              🎉 سجّل الآن مجاناً
            </button>
            <button
              onClick={() => navigate('/company-login')}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
              }}
            >
              لديّ حساب — دخول
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
          <a href="/" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>الرئيسية</a>
          <a href="/company-login" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>دخول الشركات</a>
          <a href="/company-activation" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>تفعيل الحساب</a>
        </div>
        <p style={{ fontSize: 12, color: '#1e293b', margin: 0 }}>🇸🇦 منصة سَلِّم — sallim.co</p>
      </footer>
    </div>
  )
}
