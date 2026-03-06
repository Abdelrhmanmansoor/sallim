import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Palette, Type, Send, Download,
  ChevronDown, Layers, Shield, Smartphone,
  Sparkles, Check, User, Mail, Phone, Building
} from 'lucide-react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', plan: 'شخصي' })
  const [formSent, setFormSent] = useState(false)

  const handleForm = (e) => {
    e.preventDefault()
    const msg = `طلب اشتراك جديد:\nالاسم: ${formData.name}\nالإيميل: ${formData.email}\nالهاتف: ${formData.phone}\nالشركة: ${formData.company}\nالخطة: ${formData.plan}`
    window.open('https://wa.me/966XXXXXXXXX?text=' + encodeURIComponent(msg), '_blank')
    setFormSent(true)
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>

      {/* ═══════════ HERO — with background image ═══════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background image — desktop */}
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/Ultra_luxury_traditional_saudi_eid_gathering_verti_delpmaspu.png" />
          <img src="/images/Luxury_traditional_saudi_eid_family_gathering_lapt_delpmaspu.png" alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }} />
        </picture>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,13,26,0.82) 0%, rgba(12,25,41,0.88) 50%, rgba(7,13,26,0.95) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', padding: '120px 24px 100px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '40px' }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#2dd4bf' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf', letterSpacing: '0.5px' }}>منصة سَلِّم — تهنئة العيد بأناقة</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '24px' }}>
            صمّم بطاقتك
            <br />
            <span style={{ background: 'linear-gradient(135deg, #2dd4bf, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              بفخامة واحترافية
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: '550px', margin: '0 auto 48px' }}>
            منصة عربية لتصميم بطاقات تهنئة العيد وإرسالها مباشرة.
            اختر من قوالب فاخرة، خصّصها، وشاركها في ثوانٍ.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '80px' }}>
            <Link to="/editor" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 40px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', color: '#020617', fontSize: '16px', fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 8px 32px rgba(45,212,191,0.25)',
            }}>
              ابدأ التصميم الآن
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}>
            {[
              { value: '+٥٠,٠٠٠', label: 'بطاقة صُمِّمت' },
              { value: '+٢٠', label: 'قالب احترافي' },
              { value: '٨', label: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2dd4bf' }}>{s.value}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ FEATURES ═══════════ */}
      <section style={{ background: '#ffffff', paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '3px', marginBottom: '16px' }}>المميزات</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>لماذا تختار سَلِّم؟</h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>أدوات مصممة بإتقان لتجربة تصميم سلسة وأنيقة</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: Palette, title: 'قوالب فاخرة', desc: 'أكثر من ٢٠ قالب احترافي بتصاميم فريدة تناسب كل الأذواق' },
              { icon: Download, title: 'تصدير عالي الجودة', desc: 'ملفات PNG بدقة 1080×1080 وPDF جاهز للطباعة' },
              { icon: Smartphone, title: 'مشاركة فورية', desc: 'إرسال مباشر عبر واتساب أو حفظ رابط المعاينة' },
              { icon: Type, title: 'خطوط عربية أصيلة', desc: '٨ خطوط عربية راقية من أميري إلى القاهرة وتجوّل' },
              { icon: Layers, title: 'تخصيص شامل', desc: 'تحكم كامل بالألوان والخطوط والنصوص والشعارات' },
              { icon: Shield, title: 'آمن وموثوق', desc: 'لا نحفظ بياناتك — تصميمك يبقى ملكك فقط' },
            ].map((f, i) => (
              <div key={i} style={{ padding: '32px', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fafbfc', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e0f2fe'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <f.icon style={{ width: '22px', height: '22px', color: '#0d9488' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section style={{ background: '#f8fafc', paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '3px', marginBottom: '16px' }}>كيف تعمل</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>ثلاث خطوات بسيطة</h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>من اختيار القالب إلى إرسال البطاقة في أقل من دقيقة</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
            {[
              { num: '01', title: 'اختر القالب', desc: 'تصفح مكتبة القوالب الفاخرة واختر الأنسب لمناسبتك' },
              { num: '02', title: 'خصّص التصميم', desc: 'أضف الاسم، اختر الخط والألوان، عدّل النصوص بحرية' },
              { num: '03', title: 'صدّر وشارك', desc: 'حمّل بجودة عالية أو شارك مباشرة عبر واتساب' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '120px', fontWeight: 900, color: 'rgba(45,212,191,0.06)', lineHeight: 1, position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>{s.num}</div>
                <div style={{ position: 'relative', zIndex: 1, paddingTop: '40px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ TEMPLATES ═══════════ */}
      <section style={{ background: '#ffffff', paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '3px', marginBottom: '16px' }}>معرض القوالب</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>قوالب جاهزة للتخصيص</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {[1, 2, 3].map(i => (
              <Link to="/editor" key={i} style={{ display: 'block', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9', background: '#f8fafc', textDecoration: 'none', transition: 'all 0.4s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#bae6fd'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                  <img src={`/templates/${i}.png`} alt={`قالب ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/editor" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '12px', border: '2px solid #e2e8f0', color: '#0f172a', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
              عرض جميع القوالب <ArrowLeft style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════ SUBSCRIPTION FORM ═══════════ */}
      <section style={{ background: '#f8fafc', paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '3px', marginBottom: '16px' }}>اشتراك</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>اطلب اشتراكك الآن</h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7 }}>أرسل طلبك وسنتواصل معك خلال ٢٤ ساعة</p>
          </div>

          {formSent ? (
            <div style={{ textAlign: 'center', padding: '48px', borderRadius: '20px', background: '#f0fdfa', border: '1px solid #99f6e4' }}>
              <Check style={{ width: '48px', height: '48px', color: '#2dd4bf', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>تم إرسال طلبك بنجاح!</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>سنتواصل معك خلال ٢٤ ساعة عبر واتساب</p>
            </div>
          ) : (
            <form onSubmit={handleForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'name', icon: User, label: 'الاسم الكامل', type: 'text', required: true },
                { key: 'email', icon: Mail, label: 'البريد الإلكتروني', type: 'email', required: true },
                { key: 'phone', icon: Phone, label: 'رقم الهاتف (واتساب)', type: 'tel', required: true },
                { key: 'company', icon: Building, label: 'اسم الشركة (اختياري)', type: 'text', required: false },
              ].map(f => {
                const IconComponent = f.icon;
                return (
                  <div key={f.key} style={{ position: 'relative' }}>
                    <IconComponent style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
                    <input
                      type={f.type} required={f.required} placeholder={f.label}
                      value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '16px 48px 16px 16px', borderRadius: '14px',
                        border: '1px solid #e2e8f0', background: '#fff', fontSize: '15px',
                        fontFamily: 'inherit', outline: 'none', color: '#0f172a',
                      }}
                      onFocus={e => e.target.style.borderColor = '#2dd4bf'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                );
              })}

              <select value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })}
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '15px', fontFamily: 'inherit', outline: 'none', color: '#0f172a', appearance: 'none' }}
              >
                <option value="شخصي">خطة شخصي — ٢٩ ريال/سنة</option>
                <option value="احترافي">خطة احترافي — ٧٩ ريال/سنة</option>
                <option value="شركات">خطة شركات — ١٩٩ ريال/سنة</option>
              </select>

              <button type="submit" style={{
                width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', color: '#020617',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 8px 32px rgba(45,212,191,0.2)',
              }}>
                إرسال طلب الاشتراك
              </button>
            </form>
          )}
        </div>
      </section>


      {/* ═══════════ FAQ ═══════════ */}
      <section style={{ background: '#fff', paddingTop: '120px', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '3px', marginBottom: '16px' }}>أسئلة شائعة</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#0f172a' }}>إجابات على أسئلتكم</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: 'هل استخدام المنصة مجاني؟', a: 'نعم، يمكنك تصميم وتصدير ٣ بطاقات يومياً مجاناً. للاستخدام غير المحدود، تتوفر باقات مدفوعة تبدأ من ٢٩ ريال سنوياً.' },
              { q: 'ما جودة الصور المُصدَّرة؟', a: 'جميع البطاقات تُصدَّر بدقة 1080×1080 بكسل بتنسيق PNG عالي الجودة، كما يمكنك تصدير PDF للطباعة.' },
              { q: 'هل يمكنني استخدام البطاقات تجارياً؟', a: 'البطاقات المجانية تحتوي على علامة سَلِّم المائية. مع الباقات المدفوعة تُرفع العلامة ويمكنك استخدامها تجارياً.' },
              { q: 'هل المنصة تعمل على الهاتف؟', a: 'نعم، المنصة متجاوبة بالكامل وتعمل على جميع الأجهزة.' },
              { q: 'هل يمكنني إضافة شعار شركتي؟', a: 'بالطبع! مع باقة الشركات يمكنك إضافة شعارك على جميع البطاقات وتخصيص الهوية بالكامل.' },
            ].map((faq, i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: '24px 28px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s',
                  border: openFaq === i ? '1px solid #99f6e4' : '1px solid #e2e8f0',
                  background: openFaq === i ? '#f0fdfa' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{faq.q}</h3>
                  <ChevronDown style={{ width: '20px', height: '20px', color: '#94a3b8', flexShrink: 0, marginRight: '12px', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
                {openFaq === i && (
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8, marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ CTA ═══════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '100px', paddingBottom: '100px' }}>
        {/* BG image dimmed */}
        <img src="/images/Luxury_traditional_saudi_eid_family_gathering_lapt_delpmaspu.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,13,26,0.9)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>جاهز لتصميم بطاقتك؟</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '40px', lineHeight: 1.7 }}>انضم لآلاف المستخدمين الذين يثقون بمنصة سَلِّم.</p>
          <Link to="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 40px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', color: '#020617', fontSize: '16px', fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 8px 32px rgba(45,212,191,0.2)',
          }}>
            ابدأ التصميم مجاناً <Sparkles style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </section>

    </div>
  )
}