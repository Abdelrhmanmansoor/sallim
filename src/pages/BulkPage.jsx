import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getTemplates } from '../utils/api'
import { useCurrency } from '../utils/useCurrency'
import toast, { Toaster } from 'react-hot-toast'
import html2canvas from 'html2canvas'

const WA = '201007835547'
const FONT = "'Tajawal', sans-serif"
const PURPLE = '#7c3aed'
const ORANGE = '#ea580c'
const GREEN = '#059669'

/* ─── Packages ─────────────────────────────────── */
const PACKAGES = [
  { id: 'free',  count: 1,   price: 0,   label: 'تجريبية',   desc: 'بطاقة واحدة مجاناً', free: true },
  { id: 'p5',    count: 5,   price: 29,  perCard: 5.8,  label: '5 بطاقات' },
  { id: 'p10',   count: 10,  price: 49,  perCard: 4.9,  label: '10 بطاقات', popular: true },
  { id: 'p20',   count: 20,  price: 79,  perCard: 3.95, label: '20 بطاقة' },
  { id: 'p50',   count: 50,  price: 149, perCard: 2.98, label: '50 بطاقة' },
]
function calcCustom(n) {
  if (n <= 20)  return n * 4
  if (n <= 50)  return n * 3.5
  if (n <= 100) return n * 3
  if (n <= 200) return n * 2.5
  return n * 2
}

/* ─── Features copy ─────────────────────────────── */
const FEATURES = [
  {
    title: 'بطاقة لكل موظف في دقيقتين',
    body: 'ارفع ملف الأسماء، اختر القالب، واضغط توليد. بطاقات شخصية لكل فرد في فريقك — دون أي تصميم يدوي.',
    accent: PURPLE,
  },
  {
    title: 'هويتك البصرية على كل بطاقة',
    body: 'شعارك وألوانك تنعكس تلقائياً على كل بطاقة. ارسل بطاقة تحمل اسمك المؤسسي لا اسم أداة عشوائية.',
    accent: PURPLE,
  },
  {
    title: 'رابط ذكي — كل موظف يجيب بطاقته بنفسه',
    body: 'أنشئ رابط مناسبة وأرسله على واتساب. كل موظف يكتب اسمه ويحمّل بطاقته — بدون أي جهد منك.',
    accent: GREEN,
  },
  {
    title: 'من 5 إلى 500 بطاقة في ضغطة',
    body: 'باقات مرنة للفرق الصغيرة والشركات الكبيرة. ادفع مرة وحمّل الكل بصيغة ZIP جاهزة للطباعة والواتساب.',
    accent: GREEN,
  },
  {
    title: 'قوالب احترافية لكل مناسبة',
    body: 'عيد الفطر، عيد الأضحى، اليوم الوطني، رأس السنة، عيد ميلاد، تخرج، ترقية. أكثر من 50 قالب محدّث موسمياً.',
    accent: PURPLE,
  },
  {
    title: 'جاهز للطباعة والمشاركة',
    body: 'كل بطاقة تصدر بدقة عالية 1080×1920. صالحة للطباعة الاحترافية وللمشاركة الفورية على الجوال.',
    accent: ORANGE,
  },
  {
    title: 'داشبورد كامل للشركات',
    body: 'تابع رصيدك، راجع تاريخ البطاقات، خصّص الهوية البصرية، وأنشئ روابط المناسبات — كل شيء في مكان واحد.',
    accent: ORANGE,
  },
  {
    title: 'بدون تسجيل — ادفع وابدأ فوراً',
    body: 'الأفراد لا يحتاجون حساب. ادفع، استلم الكود، أدخله، وابدأ. العملية كلها أقل من دقيقة.',
    accent: GREEN,
  },
]

/* ─── Marquee strip (css injected once) ─────────── */
const MARQUEE_CSS = `
@keyframes marquee-rtl {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.sallim-marquee-inner {
  display: flex;
  gap: 14px;
  animation: marquee-rtl 28s linear infinite;
  will-change: transform;
}
.sallim-marquee-inner:hover { animation-play-state: paused; }
`

function injectCss(css) {
  if (document.getElementById('sallim-bulk-css')) return
  const s = document.createElement('style')
  s.id = 'sallim-bulk-css'
  s.textContent = css
  document.head.appendChild(s)
}

/* ─── Cookie helpers ─────────────────────────────── */
function getCookie(name) {
  return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.split('=')[1] || ''
}
function setCookie(name, value, hours = 24) {
  const exp = new Date(Date.now() + hours * 3600000).toUTCString()
  document.cookie = `${name}=${value};expires=${exp};path=/`
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function BulkPage() {
  const { isForeign, convertFromSAR, currency, flag } = useCurrency()
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [name, setName] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTmpl, setSelectedTmpl] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [customCount, setCustomCount] = useState(30)
  const [expandedPkg, setExpandedPkg] = useState(null)
  const nameRef = useRef(null)
  const trialRef = useRef(null)
  const templateRef = useRef(null)

  useEffect(() => {
    injectCss(MARQUEE_CSS)
    getTemplates()
      .then(r => { if (r.success && r.data) setTemplates(r.data) })
      .catch(() => {})
      .finally(() => setLoadingTemplates(false))
  }, [])

  const handleShowTemplates = () => {
    if (!name.trim()) { toast.error('اكتب اسمك أولاً'); nameRef.current?.focus(); return }
    setShowTemplates(true)
    setShowEditor(false)
    setTimeout(() => templateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const handleSelectTemplate = (tmpl) => {
    if (getCookie('sallim_trial_used')) {
      toast.error('استخدمت التجربة المجانية — اشترِ باقة للمتابعة')
      return
    }
    setSelectedTmpl(tmpl)
    setShowEditor(true)
    setTimeout(() => trialRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const fmtForeign = (sar) => isForeign ? ` (${convertFromSAR(sar)} ${currency})` : ''
  const customPrice = Math.round(calcCustom(customCount))

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#fafafa', fontFamily: FONT, color: '#111827', overflowX: 'hidden' }}>
      <Toaster position="top-center" />

      {/* ═══════ HERO ═══════ */}
      <section style={{ background: '#fff', padding: 'clamp(64px,10vw,100px) 24px clamp(48px,7vw,72px)', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f3f0ff', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: PURPLE, fontWeight: 700 }}>بطاقات تهنئة احترافية — تسليم فوري</span>
          </div>
          <h1 style={{ fontSize: 'clamp(30px,6vw,54px)', fontWeight: 900, color: '#111827', lineHeight: 1.2, marginBottom: 18, letterSpacing: '-0.02em' }}>
            بطاقة تهنئة لكل موظف
            <span style={{ display: 'block', background: `linear-gradient(135deg, ${PURPLE}, #a855f7)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>في دقيقتين</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#6b7280', lineHeight: 1.9, maxWidth: 520, margin: '0 auto 32px' }}>
            ارفع أسماء فريقك، اختار التصميم، وحمّل كل البطاقات دفعة واحدة — بهوية شركتك وشعارك، بدون تصميم مسبق
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً، أبغى أطلب باقة بطاقات تهنئة من سلّم 🎉')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: ORANGE, color: '#fff', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 20px rgba(234,88,12,0.3)', fontFamily: FONT }}
            >
              اطلب الآن
            </a>
            <button
              onClick={() => { nameRef.current?.focus(); nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
              style={{ padding: '16px 32px', background: 'transparent', color: PURPLE, border: `2px solid ${PURPLE}`, borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}
            >جرّب مجاناً</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginTop: 28, fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>
            {['بدون تسجيل', 'جاهز للطباعة والواتساب', 'يعمل على الموبايل', '+50 قالب احترافي'].map((t, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: GREEN, fontSize: 12 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ANIMATED THEME STRIP ═══════ */}
      <TemplateStrip templates={templates} />

      {/* ═══════ FREE TRIAL ═══════ */}
      <section style={{ padding: 'clamp(56px,8vw,80px) 24px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#111827', marginBottom: 10 }}>جرّب الآن — بدون تسجيل</h2>
          <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 420, margin: '0 auto' }}>اكتب اسمك، اختار قالبك، وحمّل بطاقتك. مجاناً لمرة واحدة.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, maxWidth: 520, margin: '0 auto 12px' }}>
          <input
            ref={nameRef}
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="اكتب اسمك هنا..." dir="rtl"
            style={{ flex: 1, padding: '15px 18px', background: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontFamily: FONT, color: '#111827', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = PURPLE}
            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            onKeyDown={e => e.key === 'Enter' && handleShowTemplates()}
          />
          <button onClick={handleShowTemplates} style={{ padding: '15px 22px', background: PURPLE, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap' }}>
            اعرض القوالب
          </button>
        </div>

        {/* Template grid */}
        {showTemplates && (
          <div ref={templateRef} style={{ marginTop: 36 }}>
            {loadingTemplates ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${PURPLE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                جارٍ تحميل القوالب...
              </div>
            ) : templates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', background: '#f9fafb', borderRadius: 14, border: '1px dashed #e5e7eb' }}>
                لا توجد قوالب متاحة حالياً
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
                {templates.map(t => (
                  <TemplateTile
                    key={t._id}
                    t={t}
                    name={name}
                    selected={selectedTmpl?._id === t._id}
                    onSelect={handleSelectTemplate}
                    disabled={!!getCookie('sallim_trial_used') && selectedTmpl?._id !== t._id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inline Mini Editor */}
        {showEditor && selectedTmpl && (
          <div ref={trialRef} style={{ marginTop: 40 }}>
            <InlineMiniEditor
              template={selectedTmpl}
              initialName={name}
              onClose={() => { setShowEditor(false); setSelectedTmpl(null) }}
            />
          </div>
        )}
      </section>

      {/* ═══════ STATS ═══════ */}
      <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: 'clamp(36px,6vw,56px) 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
          {[
            { n: '+2000', l: 'بطاقة تهنئة' },
            { n: '+150',  l: 'شركة وجهة عمل' },
            { n: '3 دقائق', l: 'متوسط وقت التوليد' },
            { n: '+50',  l: 'قالب احترافي' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px 12px' }}>
              <div style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: PURPLE, marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section style={{ padding: 'clamp(56px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              لماذا تختار سلّم؟
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 460, margin: '0 auto' }}>
              منصة التهنئة الاحترافية الأولى للشركات والمؤسسات السعودية
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 22px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
              >
                <div style={{ width: 28, height: 3, background: f.accent, borderRadius: 2, marginBottom: 16 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.85, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>

          {/* CTA below features */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً، أبغى أطلب باقة بطاقات تهنئة من سلّم 🎉')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', background: ORANGE, color: '#fff', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 20px rgba(234,88,12,0.3)', fontFamily: FONT }}
            >
              اطلب الآن عبر واتساب
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ PACKAGES ═══════ */}
      <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: 'clamp(56px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: '#111827', marginBottom: 10 }}>اختار الباقة المناسبة</h2>
            <p style={{ fontSize: 15, color: '#6b7280' }}>أسعار بالريال السعودي — ادفع مرة وابدأ مباشرة</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
            {PACKAGES.map(pkg => {
              const isExp = expandedPkg?.id === pkg.id
              return (
                <div key={pkg.id} style={{
                  position: 'relative', background: pkg.popular ? PURPLE : '#fff',
                  borderRadius: 18, padding: '26px 16px', textAlign: 'center',
                  border: isExp ? `2px solid ${PURPLE}` : pkg.popular ? 'none' : '1px solid #e5e7eb',
                  boxShadow: pkg.popular ? '0 10px 32px rgba(124,58,237,0.22)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {pkg.popular && (
                    <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', padding: '3px 14px', borderRadius: 20, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>الأكثر شيوعاً</div>
                  )}
                  <div style={{ fontSize: pkg.free ? 14 : 36, fontWeight: 900, color: pkg.popular ? '#fff' : '#111827', marginBottom: 4 }}>
                    {pkg.free ? pkg.label : pkg.count}
                  </div>
                  {!pkg.free && <div style={{ fontSize: 12, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 10 }}>بطاقة</div>}
                  {pkg.free && <div style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 10px' }}>{pkg.desc}</div>}
                  <div style={{ fontSize: pkg.free ? 22 : 24, fontWeight: 900, color: pkg.free ? GREEN : pkg.popular ? '#fff' : '#111827', marginBottom: 4 }}>
                    {pkg.free ? 'مجاناً' : `${pkg.price}`}
                  </div>
                  {!pkg.free && <div style={{ fontSize: 11, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 3 }}>ر.س{fmtForeign(pkg.price)}</div>}
                  {!pkg.free && <div style={{ fontSize: 10, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 14 }}>{pkg.perCard} ر.س / بطاقة</div>}
                  <button
                    onClick={() => pkg.free
                      ? nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) && nameRef.current?.focus()
                      : setExpandedPkg(isExp ? null : pkg)
                    }
                    style={{
                      width: '100%', padding: '11px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700,
                      background: pkg.free ? GREEN : pkg.popular ? '#fff' : isExp ? PURPLE : '#f3f4f6',
                      color: pkg.free ? '#fff' : pkg.popular ? PURPLE : isExp ? '#fff' : '#374151',
                      cursor: 'pointer', fontFamily: FONT, transition: 'all 0.2s',
                    }}
                  >
                    {pkg.free ? 'ابدأ مجاناً' : isExp ? 'إخفاء' : 'اشترِ'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Expanded buy panel */}
          {expandedPkg && !expandedPkg.free && (
            <div style={{ background: '#f9fafb', borderRadius: 14, padding: 'clamp(20px,4vw,32px)', border: '1px solid #e5e7eb', marginBottom: 20, textAlign: 'center' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                باقة {expandedPkg.count} بطاقة — {expandedPkg.price} ر.س{fmtForeign(expandedPkg.price)}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>تواصل معنا، ادفع، واستلم كود التفعيل — ابدأ في دقائق</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`مرحباً، أبغى باقة ${expandedPkg.count} بطاقة (${expandedPkg.price} ر.س) من سلّم`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: ORANGE, color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}
                >
                  اطلب الآن — واتساب
                </a>
                <Link to="/company-activation" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 24px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  لدي كود تفعيل
                </Link>
              </div>
            </div>
          )}

          {/* Custom slider */}
          <div style={{ background: '#faf5ff', borderRadius: 16, padding: 'clamp(24px,4vw,36px)', border: `1px solid #e9d5ff`, textAlign: 'center' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 4 }}>باقة مخصصة</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>حدد العدد وشوف السعر</p>
            <div style={{ maxWidth: 400, margin: '0 auto 16px' }}>
              <input type="range" min={5} max={500} step={5} value={customCount}
                onChange={e => setCustomCount(+e.target.value)}
                style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer', height: 6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                <span>5</span><span>100</span><span>200</span><span>500</span>
              </div>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: '#111827' }}>{customCount}</span>
              <span style={{ fontSize: 14, color: '#6b7280', marginRight: 6 }}>بطاقة</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: PURPLE }}>{customPrice}</span>
              <span style={{ fontSize: 13, color: '#6b7280', marginRight: 4 }}>ر.س</span>
            </div>
            {isForeign && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{flag} {convertFromSAR(customPrice)} {currency}</div>}
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 22 }}>{(customPrice / customCount).toFixed(1)} ر.س / بطاقة</div>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`مرحباً، أبغى باقة مخصصة ${customCount} بطاقة (${customPrice} ر.س) من سلّم`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: ORANGE, color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 800, fontFamily: FONT, boxShadow: '0 4px 14px rgba(234,88,12,0.25)' }}
            >
              اطلب هذه الباقة
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ COMPANY CTA ═══════ */}
      <section style={{ padding: 'clamp(56px,8vw,80px) 24px', background: '#111827' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            تحتاج أكثر من 50 بطاقة؟
          </h2>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.9, maxWidth: 480, margin: '0 auto 36px' }}>
            نظام الشركات يوفر داشبورد كامل، هوية بصرية، رابط ذكي لكل موظف، وتحكم كامل في كل بطاقة
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/companies" style={{ padding: '14px 32px', background: PURPLE, color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
              باقات الشركات
            </Link>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً، أبغى أعرف عن باقات الشركات في سلّم')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: '14px 32px', background: ORANGE, color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '24px 24px', background: '#111827', borderTop: '1px solid #1f2937' }}>
        <Link to="/" style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>الصفحة الرئيسية</Link>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ════════════════════════════════════
   ANIMATED TEMPLATE STRIP
════════════════════════════════════ */
function TemplateStrip({ templates }) {
  if (!templates.length) return null
  // duplicate for seamless loop
  const doubled = [...templates, ...templates]
  return (
    <div style={{ overflow: 'hidden', padding: '0', background: '#f8f7ff', borderTop: '1px solid #ede9fe', borderBottom: '1px solid #ede9fe', position: 'relative' }}>
      {/* left fade */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #f8f7ff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #f8f7ff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="sallim-marquee-inner" style={{ padding: '20px 0' }}>
        {doubled.map((t, i) => (
          <div key={`${t._id}-${i}`} style={{
            flexShrink: 0,
            width: 90,
            height: 140,
            borderRadius: 14,
            overflow: 'hidden',
            background: '#f0eaff',
            border: '1px solid #e9d5ff',
            opacity: 0.82,
            filter: 'blur(0.4px)',
            transform: i % 3 === 1 ? 'scale(0.92) translateY(4px)' : i % 3 === 2 ? 'scale(0.96) translateY(-3px)' : 'scale(1)',
            transition: 'transform 0.2s',
          }}>
            {t.imageUrl
              ? <img src={t.imageUrl} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#a78bfa', padding: 6, textAlign: 'center' }}>{t.name}</div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   TEMPLATE TILE
════════════════════════════════════ */
function TemplateTile({ t, name, selected, onSelect, disabled }) {
  return (
    <div
      onClick={() => !disabled && onSelect(t)}
      style={{
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        border: selected ? `2px solid ${PURPLE}` : '1px solid #e5e7eb',
        boxShadow: selected ? `0 0 0 3px ${PURPLE}22` : '0 1px 4px rgba(0,0,0,0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.18s',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = `0 6px 20px rgba(124,58,237,0.14)` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = selected ? `0 0 0 3px ${PURPLE}22` : '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <div style={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', background: '#f9fafb' }}>
        {t.imageUrl
          ? <img src={t.imageUrl} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#9ca3af', padding: 8, textAlign: 'center' }}>{t.name}</div>
        }
        {name.trim() && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '20px 6px 8px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: FONT }}>{name.trim()}</span>
          </div>
        )}
        {selected && (
          <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 900 }}>✓</div>
        )}
      </div>
      <div style={{ padding: '8px 10px' }}>
        <p style={{ fontSize: 10, color: '#6b7280', margin: '0 0 8px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</p>
        <button
          onClick={e => { e.stopPropagation(); !disabled && onSelect(t) }}
          style={{ width: '100%', padding: '8px', background: PURPLE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FONT }}
        >
          {disabled ? 'استخدمت التجربة' : 'فتح المحرر'}
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   INLINE MINI EDITOR
════════════════════════════════════ */
function InlineMiniEditor({ template, initialName, onClose }) {
  const [cardName, setCardName] = useState(initialName)
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(22)
  const [textPos, setTextPos] = useState({ x: 50, y: 82 }) // percent
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const previewRef = useRef(null)

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `سلّم-${cardName || 'بطاقة'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setCookie('sallim_trial_used', '1', 24)
      setDownloaded(true)
      toast.success('تم تحميل البطاقة! 🎉')
    } catch (err) {
      toast.error('حدث خطأ أثناء التحميل')
    } finally {
      setDownloading(false)
    }
  }, [cardName])

  return (
    <div style={{ background: '#fff', border: `2px solid ${PURPLE}`, borderRadius: 20, padding: 'clamp(20px,4vw,32px)', boxShadow: '0 8px 32px rgba(124,58,237,0.12)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>محرر البطاقة المجانية</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', padding: '4px 12px', borderRadius: 20, border: '1px solid #e5e7eb' }}>تجربة مجانية — بطاقة واحدة</span>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#6b7280' }}>✕</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 24, alignItems: 'start' }}>
        {/* Controls */}
        <div style={{ display: 'grid', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>الاسم على البطاقة</label>
            <input
              value={cardName} onChange={e => setCardName(e.target.value)}
              dir="rtl" placeholder="اكتب الاسم..."
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: FONT, color: '#111827', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = PURPLE}
              onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>لون النص</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'pointer', padding: 3 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ffffff', '#000000', '#7c3aed', '#ea580c', '#ffd700'].map(c => (
                  <button key={c} onClick={() => setTextColor(c)}
                    style={{ width: 26, height: 26, borderRadius: 6, background: c, border: textColor === c ? `2px solid ${PURPLE}` : '1px solid #e5e7eb', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>حجم النص: {fontSize}px</label>
            <input type="range" min={14} max={40} value={fontSize} onChange={e => setFontSize(+e.target.value)}
              style={{ width: '100%', accentColor: PURPLE }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>موضع النص (من الأعلى): {textPos.y}%</label>
            <input type="range" min={10} max={95} value={textPos.y} onChange={e => setTextPos(p => ({ ...p, y: +e.target.value }))}
              style={{ width: '100%', accentColor: PURPLE }} />
          </div>

          {/* Download button */}
          {!downloaded ? (
            <button onClick={handleDownload} disabled={downloading || !cardName.trim()} style={{
              padding: '14px 20px', background: downloading ? '#e9d5ff' : PURPLE, color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: downloading || !cardName.trim() ? 'not-allowed' : 'pointer',
              fontFamily: FONT, boxShadow: downloading ? 'none' : '0 4px 16px rgba(124,58,237,0.25)',
            }}>
              {downloading ? 'جارٍ التحميل...' : 'حمّل البطاقة مجاناً'}
            </button>
          ) : (
            <div>
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, fontSize: 14, color: '#166534', fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>
                تم التحميل بنجاح
              </div>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`مرحباً، أبغى باقة بطاقات من سلّم`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', padding: '12px 16px', background: ORANGE, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, textAlign: 'center', textDecoration: 'none', fontFamily: FONT }}>
                اشترِ باقة — اطلب الآن
              </a>
            </div>
          )}
        </div>

        {/* Preview */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>معاينة البطاقة</div>
          <div
            ref={previewRef}
            style={{
              position: 'relative',
              aspectRatio: '9/16',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#f0eaff',
              border: '1px solid #e9d5ff',
              maxWidth: 240,
              margin: '0 auto',
            }}
          >
            {template.imageUrl && (
              <img
                src={template.imageUrl}
                alt={template.name}
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
            {cardName.trim() && (
              <div style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${textPos.y}%`,
                textAlign: 'center',
                padding: '4px 12px',
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: 800,
                  color: textColor,
                  fontFamily: FONT,
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  display: 'block',
                  lineHeight: 1.3,
                }}>{cardName}</span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 10, color: '#d1d5db', textAlign: 'center', marginTop: 6 }}>منصة سلّم | sallim.co</div>
        </div>
      </div>
    </div>
  )
}
