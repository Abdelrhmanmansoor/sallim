import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Palette, Download, Smartphone, Type, Layers, Shield, ChevronDown, Heart } from 'lucide-react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  const features = [
    { icon: Palette, title: 'قوالب احترافية', desc: 'أكثر من ٢٠ قالب مصمم بعناية' },
    { icon: Download, title: 'تصدير عالي الجودة', desc: 'PNG و PDF بدقة عالية' },
    { icon: Smartphone, title: 'مشاركة فورية', desc: 'شارك مباشرة عبر واتساب' },
    { icon: Type, title: 'خطوط عربية', desc: '٨ خطوط عربية أصيلة' },
    { icon: Layers, title: 'تخصيص كامل', desc: 'تحكم بالألوان والنصوص' },
    { icon: Shield, title: 'آمن وموثوق', desc: 'لا نحفظ بياناتك' },
  ]

  const steps = [
    { num: '01', title: 'اختر القالب', desc: 'تصفح مكتبة القوالب' },
    { num: '02', title: 'خصص التصميم', desc: 'أضف اسمك ونصوصك' },
    { num: '03', title: 'صدّر وشارك', desc: 'حمّل أو شارك مباشرة' },
  ]

  const faqs = [
    { q: 'هل المنصة مجانية؟', a: 'نعم، المنصة مجانية بالكامل.' },
    { q: 'ما جودة الصور؟', a: 'تُصدَّر بدقة 1080×1080 بكسل.' },
    { q: 'هل تعمل على الهاتف؟', a: 'نعم، متوافقة مع جميع الأجهزة.' },
  ]

  const tiers = [
    {
      name: 'مجاني',
      price: '0',
      desc: 'للاستخدام الشخصي',
      features: ['تصميم غير محدود', 'تصدير عالي الجودة', 'مشاركة فورية'],
      cta: 'ابدأ مجاناً',
      href: '/editor',
      highlight: false,
    },
    {
      name: 'داعم',
      price: 'تطوعي',
      desc: 'ادعم تطوير المنصة',
      features: ['كل الميزات المجانية', 'أولوية في الميزات الجديدة', 'اسمك في قائمة الداعمين'],
      cta: 'ادعم المشروع',
      href: 'https://paypal.me/SOLIMANW',
      highlight: true,
      external: true,
    },
    {
      name: 'للشركات',
      price: 'اتصل بنا',
      desc: 'حلول مخصصة',
      features: ['تخصيص كامل', 'إزالة العلامة المائية', 'دعم فني مميز'],
      cta: 'تواصل معنا',
      href: 'mailto:sales@solimanw.com',
      highlight: false,
      external: true,
    },
  ]

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* HERO */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            margin: '0 auto',
            padding: '120px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '100px',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              منصة تصميم بطاقات العيد
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            صمّم بطاقتك
            <br />
            <span style={{ color: '#a3a3a3' }}>بأناقة واحترافية</span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '480px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            اختر من قوالب فاخرة، خصّصها، وشاركها في ثوانٍ
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: '#fff',
                color: '#171717',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              ابدأ التصميم
              <ArrowLeft size={18} />
            </Link>
            <a
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              اكتشف المميزات
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              marginTop: '80px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '+٥٠,٠٠٠', label: 'بطاقة' },
              { value: '+٢٠', label: 'قالب' },
              { value: '٨', label: 'خطوط' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>المميزات</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              لماذا سَلِّم؟
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  background: '#fafafa',
                  borderRadius: '16px',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#171717',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <f.icon size={22} color="#fff" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>كيف تعمل</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              ثلاث خطوات بسيطة
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '64px',
                    fontWeight: 700,
                    color: '#e5e5e5',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                >
                  {s.num}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#171717', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#737373' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>القوالب</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              قوالب جاهزة للتخصيص
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[1, 2, 3].map((i) => (
              <Link
                to="/editor"
                key={i}
                style={{
                  display: 'block',
                  aspectRatio: '1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#f5f5f5',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img
                  src={`/templates/${i}.png`}
                  alt={`قالب ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              to="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#f5f5f5',
                color: '#171717',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              عرض جميع القوالب
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 0', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>الباقات</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              اختر ما يناسبك
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {tiers.map((tier, i) => {
              const Component = tier.external ? 'a' : Link
              const linkProps = tier.external
                ? { href: tier.href, target: '_blank', rel: 'noopener noreferrer' }
                : { to: tier.href }

              return (
                <div
                  key={i}
                  style={{
                    padding: '32px',
                    background: tier.highlight ? '#171717' : '#fff',
                    borderRadius: '20px',
                    border: tier.highlight ? 'none' : '1px solid #e5e5e5',
                    textAlign: 'center',
                    transition: 'all 200ms ease',
                    transform: tier.highlight ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!tier.highlight) {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!tier.highlight) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#404040',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#fff',
                        marginBottom: '16px',
                      }}
                    >
                      مميز
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: tier.highlight ? '#fff' : '#171717',
                      marginBottom: '8px',
                    }}
                  >
                    {tier.name}
                  </h3>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: tier.highlight ? '#fff' : '#171717',
                      marginBottom: '8px',
                    }}
                  >
                    {tier.price}
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: tier.highlight ? 'rgba(255,255,255,0.5)' : '#737373',
                      marginBottom: '24px',
                    }}
                  >
                    {tier.desc}
                  </p>
                  <ul style={{ listStyle: 'none', marginBottom: '24px', textAlign: 'right' }}>
                    {tier.features.map((f, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: '14px',
                          color: tier.highlight ? 'rgba(255,255,255,0.7)' : '#525252',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: tier.highlight ? '#a3a3a3' : '#171717' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Component
                    {...linkProps}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px',
                      background: tier.highlight ? '#fff' : '#171717',
                      color: tier.highlight ? '#171717' : '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {tier.cta}
                  </Component>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>الأسئلة</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              أسئلة شائعة
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: '20px 24px',
                  background: openFaq === i ? '#f5f5f5' : '#fafafa',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#171717', margin: 0 }}>{faq.q}</h3>
                  <ChevronDown
                    size={18}
                    style={{
                      color: '#a3a3a3',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </div>
                {openFaq === i && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#737373',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e5e5e5',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', background: '#171717' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            جاهز للبدء؟
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            صمّم بطاقتك الآن مجاناً
          </p>
          <Link
            to="/editor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: '#fff',
              color: '#171717',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            ابدأ التصميم
            <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
