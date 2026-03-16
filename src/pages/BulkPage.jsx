import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getTemplates } from '../utils/api'
import { useEditorStore } from '../store'
import { useCurrency } from '../utils/useCurrency'
import toast, { Toaster } from 'react-hot-toast'

const WHATSAPP = '201007835547'
const f = { font: "'Tajawal', sans-serif" }

const PACKAGES = [
  { id: 'free', count: 1, price: 0, label: 'تجريبية', desc: 'بطاقة واحدة كاملة مجاناً', free: true },
  { id: 'pkg5', count: 5, price: 29, perCard: 5.8, label: '5 بطاقات' },
  { id: 'pkg10', count: 10, price: 49, perCard: 4.9, label: '10 بطاقات', popular: true },
  { id: 'pkg20', count: 20, price: 79, perCard: 3.95, label: '20 بطاقة' },
  { id: 'pkg50', count: 50, price: 149, perCard: 2.98, label: '50 بطاقة' },
]

function calcCustom(n) {
  if (n <= 20) return n * 4
  if (n <= 50) return n * 3.5
  if (n <= 100) return n * 3
  if (n <= 200) return n * 2.5
  return n * 2
}

const WHY = [
  { t: 'وفّر ساعات من التصميم', d: 'بدلاً من تصميم كل بطاقة يدوياً — ارفع الأسماء وخلّص' },
  { t: 'هوية شركتك على كل بطاقة', d: 'شعارك وألوانك تلقائياً على كل بطاقة تولّدها' },
  { t: 'رابط ذكي لموظفيك', d: 'كل موظف يجيب بطاقته بنفسه من رابط واحد' },
  { t: 'من 5 لـ 500 بطاقة', d: 'باقات مرنة تناسب الفرق الصغيرة والشركات الكبيرة' },
]

export default function BulkPage() {
  const navigate = useNavigate()
  const { isForeign, convertFromSAR, currency, flag } = useCurrency()
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [name, setName] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [expandedPkg, setExpandedPkg] = useState(null)
  const [customCount, setCustomCount] = useState(30)
  const nameRef = useRef(null)
  const templateRef = useRef(null)

  useEffect(() => {
    getTemplates().then(r => {
      if (r.success && r.data) setTemplates(r.data)
    }).catch(() => {}).finally(() => setLoadingTemplates(false))
  }, [])

  const handleShowTemplates = () => {
    if (!name.trim()) { toast.error('اكتب اسمك أولاً'); nameRef.current?.focus(); return }
    setShowTemplates(true)
    setTimeout(() => templateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }

  const handleOpenEditor = (tmpl) => {
    useEditorStore.getState().setTemplate(tmpl.id)
    navigate('/editor', { state: { prefilledName: name.trim(), isTrial: true } })
  }

  const customPrice = Math.round(calcCustom(customCount))
  const fmtForeign = (sar) => isForeign ? ` (${convertFromSAR(sar)} ${currency})` : ''

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#fafafa', fontFamily: f.font, color: '#111827' }}>
      <Toaster position="top-center" />

      {/* ═══════ HERO ═══════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: 'clamp(60px, 10vw, 100px) 24px clamp(48px, 8vw, 80px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5.5vw, 52px)', fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16, letterSpacing: '-0.02em' }}>
            بطاقة تهنئة لكل موظف
            <span style={{ display: 'block', color: '#7c3aed' }}>في دقيقتين</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#6b7280', lineHeight: 1.9, maxWidth: 540, margin: '0 auto 28px' }}>
            ارفع أسماء فريقك، اختار التصميم، وحمّل كل البطاقات جاهزة دفعة واحدة — بهوية شركتك وشعارك
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 36, fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>
            <span>بدون تصميم مسبق</span>
            <span style={{ color: '#e5e7eb' }}>|</span>
            <span>يعمل على الموبايل</span>
            <span style={{ color: '#e5e7eb' }}>|</span>
            <span>جاهز للطباعة والواتساب</span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => nameRef.current?.focus()}
              style={{
                padding: '15px 36px', background: '#7c3aed', color: '#fff', border: 'none',
                borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: f.font,
                boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              }}
            >جرّب مجاناً — ابدأ الآن</button>
            <Link to="/companies" style={{
              padding: '15px 36px', background: 'transparent', color: '#374151', border: '1px solid #d1d5db',
              borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none',
            }}>باقات الشركات</Link>
          </div>
        </div>
      </section>

      {/* ═══════ FREE TRIAL — Name Input ═══════ */}
      <section style={{ padding: 'clamp(48px, 8vw, 72px) 24px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
            جرّب الآن بدون تسجيل
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>اكتب اسمك، اختار قالبك، وحمّل بطاقتك — مجاناً</p>
        </div>

        <div style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto' }}>
          <input
            ref={nameRef}
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="اكتب اسمك هنا..." dir="rtl"
            style={{
              flex: 1, padding: '15px 18px', background: '#fff', border: '2px solid #e5e7eb',
              borderRadius: 12, fontSize: 15, fontFamily: f.font, color: '#111827', outline: 'none',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            onKeyDown={e => e.key === 'Enter' && handleShowTemplates()}
          />
          <button onClick={handleShowTemplates} style={{
            padding: '15px 24px', background: '#7c3aed', color: '#fff', border: 'none',
            borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: f.font,
            whiteSpace: 'nowrap',
          }}>اعرض قوالبي</button>
        </div>

        {/* Template Grid — shows after name is entered */}
        {showTemplates && (
          <div ref={templateRef} style={{ marginTop: 40 }}>
            <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
              اختار القالب الذي يعجبك — جميع القوالب متاحة للمعاينة
            </p>
            {loadingTemplates ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>جارٍ تحميل القوالب...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
                {templates.map(t => (
                  <div key={t.id} style={{
                    background: '#fff', borderRadius: 14, overflow: 'hidden',
                    border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor = '#c4b5fd' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb' }}
                  >
                    {/* Template preview with name overlay */}
                    <div style={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', background: '#f9fafb' }}>
                      <img src={t.image} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                      {name.trim() && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                          padding: '24px 8px 10px', textAlign: 'center',
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: f.font }}>{name.trim()}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 10px', fontWeight: 600 }}>{t.name}</p>
                      <button onClick={() => handleOpenEditor(t)} style={{
                        width: '100%', padding: '10px', background: '#7c3aed', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: f.font,
                      }}>افتح المحرر</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══════ PACKAGES ═══════ */}
      <section style={{ padding: 'clamp(48px, 8vw, 72px) 24px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              اختار الباقة المناسبة لفريقك
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
            {PACKAGES.map(pkg => {
              const isExp = expandedPkg?.id === pkg.id
              return (
                <div key={pkg.id} style={{
                  position: 'relative', background: pkg.popular ? '#7c3aed' : '#fff',
                  borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                  border: isExp ? '2px solid #7c3aed' : pkg.popular ? 'none' : '1px solid #e5e7eb',
                  boxShadow: pkg.popular ? '0 8px 24px rgba(124,58,237,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                }}>
                  {pkg.popular && (
                    <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', padding: '3px 14px', borderRadius: 20, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>الأكثر شيوعاً</div>
                  )}
                  <div style={{ fontSize: pkg.free ? 14 : 32, fontWeight: 800, color: pkg.popular ? '#fff' : '#111827', marginBottom: 4 }}>
                    {pkg.free ? pkg.label : pkg.count}
                  </div>
                  {!pkg.free && <div style={{ fontSize: 12, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 12 }}>بطاقة</div>}
                  {pkg.free && <div style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 12px' }}>{pkg.desc}</div>}
                  <div style={{ fontSize: pkg.free ? 20 : 22, fontWeight: 800, color: pkg.free ? '#059669' : pkg.popular ? '#fff' : '#111827', marginBottom: 4 }}>
                    {pkg.free ? 'مجاناً' : pkg.price}
                  </div>
                  {!pkg.free && <div style={{ fontSize: 11, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 4 }}>ر.س{fmtForeign(pkg.price)}</div>}
                  {!pkg.free && <div style={{ fontSize: 10, color: pkg.popular ? '#c4b5fd' : '#9ca3af', marginBottom: 14 }}>{pkg.perCard} ر.س / بطاقة</div>}
                  <button onClick={() => pkg.free ? nameRef.current?.focus() : setExpandedPkg(isExp ? null : pkg)} style={{
                    width: '100%', padding: '10px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700,
                    background: pkg.free ? '#059669' : pkg.popular ? '#fff' : isExp ? '#7c3aed' : '#f3f4f6',
                    color: pkg.free ? '#fff' : pkg.popular ? '#7c3aed' : isExp ? '#fff' : '#374151',
                    cursor: 'pointer', fontFamily: f.font, transition: 'all 0.2s',
                  }}>
                    {pkg.free ? 'ابدأ مجاناً' : isExp ? 'إخفاء' : 'اشتري'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Expanded buy panel */}
          {expandedPkg && !expandedPkg.free && (
            <div style={{ background: '#f9fafb', borderRadius: 14, padding: 'clamp(20px, 4vw, 32px)', border: '1px solid #e5e7eb', marginBottom: 20, textAlign: 'center' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                باقة {expandedPkg.count} بطاقة — {expandedPkg.price} ر.س{fmtForeign(expandedPkg.price)}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>بعد الشراء ترسل لك كود تفعيل — أدخله وابدأ مباشرة</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`مرحباً، أبغى باقة ${expandedPkg.count} بطاقة (${expandedPkg.price} ر.س) من سلّم`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#ea580c', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                  أكمل الشراء عبر واتساب
                </a>
                <button onClick={() => navigate('/company-activation')} style={{
                  padding: '13px 24px', background: '#fff', color: '#374151', border: '1px solid #d1d5db',
                  borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: f.font,
                }}>لدي كود تفعيل</button>
              </div>
            </div>
          )}

          {/* Custom slider */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 4 }}>باقة مخصصة</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>حدد العدد اللي تبغاه وشوف السعر</p>
            <div style={{ maxWidth: 400, margin: '0 auto 16px' }}>
              <input type="range" min={5} max={500} step={5} value={customCount}
                onChange={e => setCustomCount(+e.target.value)}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                <span>5</span><span>100</span><span>200</span><span>500</span>
              </div>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: '#111827' }}>{customCount}</span>
              <span style={{ fontSize: 14, color: '#6b7280', marginRight: 4 }}>بطاقة</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed' }}>{customPrice}</span>
              <span style={{ fontSize: 13, color: '#6b7280', marginRight: 4 }}>ر.س</span>
            </div>
            {isForeign && <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{flag} {convertFromSAR(customPrice)} {currency}</div>}
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 20 }}>{(customPrice / customCount).toFixed(1)} ر.س / بطاقة</div>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`مرحباً، أبغى باقة مخصصة ${customCount} بطاقة (${customPrice} ر.س) من سلّم`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#ea580c', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
              اطلب هذه الباقة
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ WHY SALLIM ═══════ */}
      <section style={{ padding: 'clamp(48px, 8vw, 72px) 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: 36 }}>
            لماذا تختار سلّم لفريقك؟
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
            {WHY.map((w, i) => (
              <div key={i} style={{
                padding: 'clamp(20px, 4vw, 32px)',
                borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none',
                borderLeft: i % 2 === 0 ? '1px solid #e5e7eb' : 'none',
                background: '#fff',
              }}>
                <div style={{ width: 20, height: 2, background: '#7c3aed', marginBottom: 16 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{w.t}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, margin: 0 }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COMPANIES CTA ═══════ */}
      <section style={{ padding: 'clamp(48px, 8vw, 72px) 24px', background: '#111827' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            تحتاج أكثر من 50 بطاقة؟
          </h2>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.9, maxWidth: 480, margin: '0 auto 36px' }}>
            نظام الشركات يوفر داشبورد كامل، هوية بصرية، ورابط خاص لكل موظف يجيب بطاقته بنفسه
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/companies" style={{
              padding: '14px 32px', background: '#7c3aed', color: '#fff', borderRadius: 12,
              textDecoration: 'none', fontSize: 15, fontWeight: 700,
            }}>اطلع على باقات الشركات</Link>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('مرحباً، أبغى أعرف عن باقات الشركات في سلّم')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '14px 32px', background: 'transparent', color: '#e5e7eb', borderRadius: 12,
                textDecoration: 'none', fontSize: 15, fontWeight: 600, border: '1px solid #374151',
              }}>تواصل معنا</a>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '28px 24px', background: '#111827', borderTop: '1px solid #1f2937' }}>
        <Link to="/" style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>الصفحة الرئيسية</Link>
      </div>
    </div>
  )
}
