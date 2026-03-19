import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Palette,
  Download,
  Smartphone,
  Type,
  Layers,
  Shield,
  ChevronDown,
} from 'lucide-react'
import OccasionSlider from '../components/OccasionSlider'

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)
  const [marketingIdx, setMarketingIdx] = useState(0)

  const audioSamples = [
    { id: 1, label: 'نموذج صوتي 1', file: '/SOUND/ssstwitter.com_1773546744734.mp3' },
    { id: 2, label: 'نموذج صوتي 2', file: '/SOUND/ssstwitter.com_1773546772130.mp3' },
    { id: 3, label: 'نموذج صوتي 3', file: '/SOUND/ssstwitter.com_1773546797691.mp3' },
  ]

  const handlePlaySample = (id) => {
    document.querySelectorAll('audio[data-sample]').forEach(a => { a.pause(); a.currentTime = 0 })
    if (playingAudio === id) { setPlayingAudio(null); return }
    const audio = document.querySelector(`audio[data-sample="${id}"]`)
    if (audio) {
      audio.play()
      setPlayingAudio(id)
      audio.onended = () => setPlayingAudio(null)
    }
  }

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


  // Rotate marketing messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketingIdx(prev => (prev + 1) % 2)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>

      {/* HERO */}
      <section
        style={{
          background: '#171717',
          padding: 0,
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Desktop Banner */}
          <picture>
            <source media="(min-width: 769px)" srcSet="/images/hero/Eid_celebration_in_saudi_courtyard_f34876dbfb.jpeg" />
            <source media="(max-width: 768px)" srcSet="/images/hero/Saudi_family_celebrating_eid_8186e62448.jpeg" />
            <img
              src="/images/hero/Eid_celebration_in_saudi_courtyard_f34876dbfb.jpeg"
              alt="عيد مبارك"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </picture>
          {/* Dark overlay for readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.7) 50%, rgba(15,15,15,0.85) 100%)',
            zIndex: 1,
          }} />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
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
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C6F806', boxShadow: '0 0 10px rgba(198,248,6,0.5)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                نسخة تجريبية — جارٍ إضافة قوالب جديدة باستمرار
              </span>
            </div>

            <style>{`
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.8; }
              }
            `}</style>

            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '24px',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}
            >
              صمّم بطاقتك
              <br />
              <span style={{ color: '#f5d77a' }}>بأناقة واحترافية</span>
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

            {/* Secondary Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/create-diwaniya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              >
                أطلق ديوانيتك
              </Link>
              <Link
                to="/dashboard/diwaniya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              >
                لعبة العيدية
              </Link>
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
        </div>

        {/* NEWS TICKER */}
        <div
          style={{
            background: '#0a0a0a',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '14px 0',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            direction: 'rtl'
          }}
        >
          <style>{`
            @keyframes scroll-ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
            .ticker-container {
              display: flex;
              width: max-content;
              animation: scroll-ticker 40s linear infinite;
            }
            .ticker-container:hover {
              animation-play-state: paused;
            }
            .ticker-item {
              display: flex;
              align-items: center;
              padding-left: 32px;
              color: rgba(255,255,255,0.85);
              font-size: 16px;
              font-weight: 500;
              white-space: nowrap;
            }
            .ticker-item-separator {
              margin-right: 32px;
              color: rgba(255,215,0,0.6);
              font-size: 18px;
              user-select: none;
            }
            @media (max-width: 768px) {
              .ticker-item {
                 padding-left: 20px;
                 font-size: 14px;
              }
              .ticker-item-separator {
                 margin-right: 20px;
                 font-size: 14px;
              }
              .ticker-container {
                 animation-duration: 25s;
              }
            }
          `}</style>
          <div className="ticker-container">
            {[...Array(2)].fill().map((_, setIndex) => (
              <div key={setIndex} style={{ display: 'flex' }}>
                {[
                  { text: 'تم إضافة لعبة العيدية التفاعلية - انشئ تحدياتك الخاصة' },
                  { text: 'جاري إضافة ثيمات وقوالب جديدة بشكل مستمر' },
                  { text: 'تم إضافة فكرة الديوانية - اطلق ديوانيتك الآن' },
                  { text: 'للشركات والمؤسسات التي تريد تخصيص النظام تواصل معنا' },
                  { text: 'اكتشف الميزات الجديدة في نسخة العيد 2026' },
                ].map((item, index) => (
                  <div key={`${setIndex}-${index}`} className="ticker-item">
                    <span style={{ color: item.link ? '#FFD700' : 'rgba(255,255,255,0.85)' }}>
                      {item.text}
                    </span>
                    <span className="ticker-item-separator">✧</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROTATING MARKETING SECTION */}
      <section style={{ padding: '56px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {marketingIdx === 0 ? (
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 22,
              padding: '32px 24px',
              boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
            }}>
              <span style={{ fontSize: '13px', color: '#7c3aed', fontWeight: 700, marginBottom: '12px', display: 'inline-block', letterSpacing: '0.04em' }}>
                للشركات والمؤسسات
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.35, marginBottom: 12 }}>
                عزّز علاقتك بموظفيك وعملائك
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.9, maxWidth: 560, margin: '0 auto' }}>
                أرسل تهنئة مخصصة باسم كل موظف وعميل دفعة واحدة، بهوية شركتك وشعارها بشكل احترافي.
              </p>
              <Link
                to="/editor?mode=batch"
                style={{
                  marginTop: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 26px',
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: 12,
                  textDecoration: 'none',
                }}
              >
                جرّب النظام الجماعي
              </Link>
            </div>
          ) : (
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 22,
              padding: '32px 24px',
              boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
            }}>
              <span style={{ fontSize: '13px', color: '#b8860b', fontWeight: 700, marginBottom: '12px', display: 'inline-block', letterSpacing: '0.04em' }}>
                للأفراد والعائلات
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.35, marginBottom: 12 }}>
                اصنع فرحة العيد بلمستك الخاصة
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.9, maxWidth: 560, margin: '0 auto' }}>
                صمّم بطاقة فريدة لأحبابك، اختر قالباً أنيقاً، أضف الاسم، ثم شاركها فوراً.
              </p>
              <Link
                to="/editor?mode=ready"
                style={{
                  marginTop: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 26px',
                  background: '#b8860b',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: 12,
                  textDecoration: 'none',
                }}
              >
                ابدأ تصميم بطاقتك
              </Link>
            </div>
          )}

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            {[0, 1].map(i => (
              <button
                key={i}
                onClick={() => setMarketingIdx(i)}
                style={{
                  width: marketingIdx === i ? 24 : 8,
                  height: 8,
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  background: marketingIdx === i ? '#0f172a' : '#d1d5db',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* OCCASION CATEGORIES SLIDER */}
      <OccasionSlider />

      {/* صنع تهنئة العيد */}
      <section style={{ padding: '72px 0 80px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            اصنع تهنئة العيد الآن 🎉
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            اختر من بين قوالب فاخرة، خصّصها بلمستك، وشاركها مجاناً بدون أي قيود
          </p>
          <Link
            to="/editor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #d4af37, #b8860b)',
              color: '#fff',
              fontSize: '17px',
              fontWeight: 800,
              borderRadius: '14px',
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(212,175,55,0.4)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            🎉 اصنع رابط تهنئتك الآن
          </Link>
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

      {/* EIDIYA GAME FEATURE - Simple Text */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '12px'
          }}>
            لعبة العيدية التفاعلية
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px',
            lineHeight: 1.6
          }}>
            حول تهنئة العيد إلى مغامرة ممتعة - أنشئ أسئلتك، حدد جوائزك، وتنافس مع عائلتك!
          </p>
          <Link
            to="/create-game"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              background: '#fff',
              color: '#171717',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ابدأ الآن ←
          </Link>
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

      {/* TRUST & SOCIAL PROOF - Salla-inspired */}
      <section style={{ padding: '80px 0', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          {/* Trust Headline */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              82% من العملاء تزداد ثقتهم بعد أول استخدام
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>أرقام حقيقية من منصتنا</p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {[
              { num: '+5,000', label: 'بطاقة تم إنشاؤها', icon: '🎨' },
              { num: '+120', label: 'عميل سعودي يثق بنا', icon: '🇸🇦' },
              { num: '99%', label: 'رضا العملاء', icon: '⭐' },
              { num: '24/7', label: 'دعم فني متواصل', icon: '💬' },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '28px 16px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{stat.num}</div>
                <div style={{ fontSize: '14px', color: '#737373' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}>
            {[
              { icon: '🇸🇦', text: 'منتج سعودي' },
              { icon: '✅', text: 'مجاني بالكامل' },
              { icon: '🛡️', text: 'خصوصية محمية' },
              { icon: '⚡', text: 'مشاركة فورية' },
            ].map((badge, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#fff',
                borderRadius: '100px',
                border: '1px solid #e5e5e5',
                fontSize: '13px',
                fontWeight: 600,
                color: '#525252',
              }}>
                <span style={{ fontSize: '16px' }}>{badge.icon}</span>
                {badge.text}
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

      {/* SERVICES - Clean & Professional */}
      <section style={{
        padding: '120px 0',
        background: '#fafafa',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#fff',
              borderRadius: '100px',
              marginBottom: '24px',
              border: '1px solid #e5e5e5',
            }}>
              <span style={{ fontSize: '12px', color: '#171717', fontWeight: 600, letterSpacing: '0.02em' }}>
                حلول الأعمال
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '16px',
              lineHeight: 1.3
            }}>
              انضم إلى شركائنا الناجحين
            </h2>

            <p style={{
              fontSize: '17px',
              color: '#737373',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              نقدم حلولاً متكاملة للشركات، من المتاجر الإلكترونية إلى الحملات التسويقية
            </p>
          </div>

          {/* Services */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '60px'
          }}>
            {[
              { icon: '🛒', title: 'متاجر سلة', desc: 'تصميم احترافي مخصص' },
              { icon: '🏪', title: 'متاجر زد', desc: 'حلول متكاملة' },
              { icon: '💻', title: 'منصات مخصصة', desc: 'بناء من الصفر' },
              { icon: '📢', title: 'تسويق رقمي', desc: 'حملات إعلانية ناجحة' },
            ].map((service, i) => (
              <div key={i} style={{
                padding: '32px 24px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                transition: 'all 300ms ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = '#171717'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{service.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717', marginBottom: '6px' }}>{service.title}</div>
                <div style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{service.desc}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '48px',
            border: '1px solid #e5e5e5',
            marginBottom: '48px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#171717',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              مزايا الشراكة معنا
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                { title: 'دعم فني متخصص', desc: 'فريق متاح على مدار الساعة لحل جميع الاستفسارات' },
                { title: 'تدريب شامل', desc: 'ندرب فريقك على إدارة المنصة بشكل احترافي' },
                { title: 'تحديثات دورية', desc: 'نحافظ على منصتك محدثة بأحدث التقنيات' },
                { title: 'تحليلات أداء', desc: 'تقارير شهرية مفصلة عن أداء منصتك' },
              ].map((benefit, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#171717',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>{benefit.title}</div>
                    <div style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center'
            }}>
              <a
                href="https://wa.me/201007835547?text=مرحباً، أريد الاستفسار عن الشراكة"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { if (typeof snaptr !== 'undefined') { snaptr('track', 'CUSTOM_EVENT_1') } }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 40px',
                  background: '#171717',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل معنا الآن
              </a>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="https://www.solimanx.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    border: '1px solid #e5e5e5',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#171717'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                >
                  موقعنا
                  <ArrowLeft size={16} />
                </a>

                <a
                  href="https://x.com/solimanx_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    border: '1px solid #e5e5e5',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#171717'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                >
                  تابعنا على X
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              marginTop: '24px'
            }}>
              🇸🇦 فريق سعودي متخصص - نجح معنا أكثر من 50 شركة
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
