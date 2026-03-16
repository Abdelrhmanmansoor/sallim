import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { getTemplates } from '../utils/api'
import { useEditorStore } from '../store'
import { useCurrency } from '../utils/useCurrency'
import toast, { Toaster } from 'react-hot-toast'

const WHATSAPP_NUMBER = '201007835547'
const ds = { font: "'Tajawal', sans-serif" }

// Saudi-market competitive pricing (SAR)
const PACKAGES = [
  { id: 'pkg5',  count: 5,   price: 29,  perCard: 5.8, label: '5 بطاقات',  badge: null },
  { id: 'pkg10', count: 10,  price: 49,  perCard: 4.9, label: '10 بطاقات', badge: 'الأكثر شيوعاً' },
  { id: 'pkg20', count: 20,  price: 79,  perCard: 3.95, label: '20 بطاقة', badge: 'قيمة ممتازة' },
  { id: 'pkg50', count: 50,  price: 149, perCard: 2.98, label: '50 بطاقة', badge: 'للفرق الصغيرة' },
]

// Custom pricing tiers
function calcCustomPrice(count) {
  if (count <= 0) return 0
  if (count <= 20) return count * 4
  if (count <= 50) return count * 3.5
  if (count <= 100) return count * 3
  if (count <= 200) return count * 2.5
  return count * 2
}

const COOKIE_KEY = 'sallim_bulk_free_used'

function hasUsedFree() {
  try {
    return document.cookie.split(';').some(c => c.trim().startsWith(COOKIE_KEY + '='))
  } catch { return false }
}

function markFreeUsed() {
  try {
    const d = new Date()
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000)
    document.cookie = `${COOKIE_KEY}=1;expires=${d.toUTCString()};path=/;SameSite=Lax`
  } catch {}
}

export default function BulkPage() {
  const navigate = useNavigate()
  const { isForeign, convertFromSAR, currency, flag } = useCurrency()
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [freeUsed] = useState(hasUsedFree)

  // Free flow
  const [freeStep, setFreeStep] = useState(0) // 0=not started, 1=name, 2=go
  const [nameInput, setNameInput] = useState('')
  const freeRef = useRef(null)

  // Paid expand
  const [expandedPkg, setExpandedPkg] = useState(null)

  // Custom package slider
  const [customCount, setCustomCount] = useState(30)

  useEffect(() => {
    setLoadingTemplates(true)
    getTemplates().then(res => {
      if (res.success && res.data) setTemplates(res.data)
    }).catch(() => {}).finally(() => setLoadingTemplates(false))
  }, [])

  const formatPrice = (sar) => {
    const foreign = isForeign ? convertFromSAR(sar) : null
    if (foreign) return `${sar} ر.س (${foreign} ${currency})`
    return `${sar} ر.س`
  }

  const formatPriceShort = (sar) => {
    const foreign = isForeign ? convertFromSAR(sar) : null
    if (foreign) return <><span>{sar} ر.س</span><span style={{ fontSize: 12, color: '#94a3b8', marginRight: 6 }}>{flag} {foreign} {currency}</span></>
    return <>{sar} ر.س</>
  }

  const handleFreeSelect = (tmpl) => {
    if (freeUsed) {
      toast.error('لقد استخدمت التجربة المجانية مسبقاً. اختر باقة للمتابعة.')
      return
    }
    setSelectedTemplate(tmpl)
    setFreeStep(1)
    setTimeout(() => freeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
  }

  const handleFreeGo = () => {
    const name = nameInput.trim()
    if (!name) { toast.error('اكتب اسم المستلم'); return }
    if (!selectedTemplate) { toast.error('اختر قالب أولاً'); return }
    markFreeUsed()
    const store = useEditorStore.getState()
    store.setBatchNames([name])
    if (selectedTemplate) store.setTemplate(selectedTemplate.id)
    navigate(`/editor?mode=ready&template=${selectedTemplate.id}&free=1`)
  }

  const handleBuyPackage = (pkg) => {
    setExpandedPkg(expandedPkg?.id === pkg.id ? null : pkg)
  }

  const customPrice = Math.round(calcCustomPrice(customCount))

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: ds.font, direction: 'rtl' }}>
      <Toaster position="top-center" />

      {/* ═══ HERO — light, elegant ═══ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: 'clamp(48px, 8vw, 80px) 24px clamp(36px, 6vw, 56px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800, color: '#111827', lineHeight: 1.3, marginBottom: 12 }}>
            أرسل بطاقات تهنئة لمجموعتك
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#6b7280', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.8 }}>
            اختر قالبك المفضل، اكتب الاسم، وحمّل البطاقة جاهزة — التجربة الأولى مجانية
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أبغى أشتري باقة بطاقات جماعية من سلّم')}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', background: '#ea580c', color: '#fff',
              borderRadius: 12, textDecoration: 'none', fontSize: 15, fontWeight: 700,
              boxShadow: '0 4px 16px rgba(234,88,12,0.25)', transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <MessageCircle size={18} />
            تواصل معنا لشراء باقة
          </a>
        </div>
      </section>

      {/* ═══ TEMPLATES GALLERY ═══ */}
      <section style={{ padding: 'clamp(36px, 6vw, 56px) 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
            اختر القالب الذي يعجبك
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            {freeUsed ? 'اضغط على أي قالب واختر باقة للمتابعة' : 'اضغط على أي قالب لتجربته مجاناً — استخدام واحد فقط'}
          </p>
        </div>

        {loadingTemplates ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>جارٍ تحميل القوالب...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {templates.map(t => {
              const isSelected = selectedTemplate?.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleFreeSelect(t)}
                  style={{
                    position: 'relative', aspectRatio: '9/16', borderRadius: 14, overflow: 'hidden',
                    border: isSelected ? '3px solid #7c3aed' : '2px solid #e5e7eb',
                    cursor: 'pointer', padding: 0, background: '#fff', transition: 'all 0.25s',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isSelected ? '0 8px 24px rgba(124,58,237,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <img src={t.image} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>&#10003;</div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 8px 8px', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{t.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ═══ FREE FLOW: Name input + Go to editor ═══ */}
        {freeStep >= 1 && selectedTemplate && !freeUsed && (
          <div ref={freeRef} style={{
            marginTop: 32, background: '#fff', borderRadius: 20, padding: 'clamp(24px, 4vw, 40px)',
            border: '2px solid #7c3aed20', boxShadow: '0 8px 32px rgba(124,58,237,0.08)',
            animation: 'fadeSlide 0.4s ease',
          }}>
            <style>{`@keyframes fadeSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                  تجربة مجانية — بطاقة واحدة
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  القالب: <strong style={{ color: '#7c3aed' }}>{selectedTemplate.name}</strong>
                </p>
              </div>
              <button onClick={() => { setFreeStep(0); setSelectedTemplate(null) }} style={{
                padding: '6px 16px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 8,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font,
              }}>إلغاء</button>
            </div>

            <div style={{ maxWidth: 420, margin: '0 auto' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 8 }}>اكتب اسم المستلم</label>
              <input
                type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                placeholder="مثال: محمد أحمد" dir="rtl" autoFocus
                style={{
                  width: '100%', padding: '14px 18px', background: '#f9fafb',
                  border: '2px solid #e5e7eb', borderRadius: 12, color: '#111827',
                  fontSize: 16, fontWeight: 600, fontFamily: ds.font, outline: 'none', textAlign: 'center',
                  marginBottom: 16, boxSizing: 'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                onKeyDown={e => e.key === 'Enter' && handleFreeGo()}
              />
              <button onClick={handleFreeGo} disabled={!nameInput.trim()} style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: nameInput.trim() ? '#7c3aed' : '#d1d5db', color: '#fff',
                fontSize: 16, fontWeight: 800, cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                fontFamily: ds.font, transition: 'background 0.2s',
              }}>
                افتح المحرر وصمّم بطاقتك
              </button>
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 10 }}>
                ستنتقل للمحرر الكامل — تحكم في كل التفاصيل ثم صدّر بطاقتك
              </p>
            </div>
          </div>
        )}

        {freeUsed && freeStep >= 1 && selectedTemplate && (
          <div ref={freeRef} style={{
            marginTop: 32, background: '#fef2f2', borderRadius: 20, padding: 'clamp(24px, 4vw, 32px)',
            border: '1px solid #fecaca', textAlign: 'center', animation: 'fadeSlide 0.4s ease',
          }}>
            <style>{`@keyframes fadeSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#991b1b', marginBottom: 12 }}>لقد استخدمت التجربة المجانية</p>
            <p style={{ fontSize: 13, color: '#b91c1c', marginBottom: 16 }}>اختر باقة من الأسفل لتتمكن من إرسال بطاقات لعدد أكبر</p>
            <button onClick={() => { setFreeStep(0); setSelectedTemplate(null); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) }} style={{
              padding: '12px 28px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font,
            }}>اختر باقة</button>
          </div>
        )}
      </section>

      {/* ═══ PACKAGES ═══ */}
      <section id="packages" style={{ padding: 'clamp(36px, 6vw, 56px) 24px', background: '#fff', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              الباقات
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280' }}>اختر الباقة المناسبة لعدد المستلمين</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {PACKAGES.map(pkg => {
              const isExpanded = expandedPkg?.id === pkg.id
              return (
                <div key={pkg.id} style={{
                  position: 'relative', background: '#fff', borderRadius: 16,
                  border: isExpanded ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                  padding: '28px 20px', textAlign: 'center', transition: 'all 0.25s',
                  boxShadow: isExpanded ? '0 8px 24px rgba(124,58,237,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  {pkg.badge && (
                    <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: '#7c3aed', color: '#fff', padding: '3px 14px', borderRadius: 20, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {pkg.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#111827', marginBottom: 4 }}>{pkg.count}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 12 }}>بطاقة</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{pkg.price}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>ر.س</div>
                  {isForeign && (
                    <div style={{ fontSize: 11, color: '#7c3aed', marginBottom: 8 }}>{flag} {convertFromSAR(pkg.price)} {currency}</div>
                  )}
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>{pkg.perCard} ر.س / بطاقة</div>
                  <button onClick={() => handleBuyPackage(pkg)} style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 700,
                    background: isExpanded ? '#7c3aed' : '#f3f4f6', color: isExpanded ? '#fff' : '#374151',
                    cursor: 'pointer', fontFamily: ds.font, transition: 'all 0.2s',
                  }}>
                    {isExpanded ? 'إخفاء' : 'اشتري'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Expanded buy panel */}
          {expandedPkg && (
            <div style={{
              background: '#f9fafb', borderRadius: 16, padding: 'clamp(24px, 4vw, 36px)',
              border: '1px solid #e5e7eb', marginBottom: 24, textAlign: 'center',
              animation: 'fadeSlide 0.35s ease',
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                باقة {expandedPkg.count} بطاقة — {formatPrice(expandedPkg.price)}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24, lineHeight: 1.8 }}>
                بعد الشراء تحصل على كود تفعيل فوري — أدخله في صفحة التفعيل وابدأ مباشرة
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أبغى باقة ${expandedPkg.count} بطاقة (${expandedPkg.price} ر.س) من منصة سلّم`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px',
                    background: '#ea580c', color: '#fff', borderRadius: 12, textDecoration: 'none',
                    fontSize: 15, fontWeight: 700, boxShadow: '0 4px 12px rgba(234,88,12,0.2)',
                  }}
                >
                  <MessageCircle size={18} />
                  أكمل الشراء عبر واتساب
                </a>
                <button onClick={() => navigate('/company-activation')} style={{
                  padding: '14px 28px', background: '#fff', color: '#374151', border: '1px solid #d1d5db',
                  borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font,
                }}>
                  لدي كود تفعيل
                </button>
              </div>
            </div>
          )}

          {/* ═══ CUSTOM PACKAGE SLIDER ═══ */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 'clamp(24px, 4vw, 36px)',
            border: '1px solid #e5e7eb', textAlign: 'center',
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', marginBottom: 4 }}>باقة مخصصة</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>حدد العدد اللي تبغاه وشوف السعر</p>

            <div style={{ maxWidth: 400, margin: '0 auto', marginBottom: 16 }}>
              <input
                type="range" min={5} max={500} step={5} value={customCount}
                onChange={e => setCustomCount(+e.target.value)}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                <span>5</span><span>100</span><span>200</span><span>500</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: '#111827' }}>{customCount}</span>
              <span style={{ fontSize: 14, color: '#6b7280', marginRight: 6 }}>بطاقة</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#7c3aed' }}>{customPrice}</span>
              <span style={{ fontSize: 14, color: '#6b7280', marginRight: 4 }}>ر.س</span>
            </div>
            {isForeign && (
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{flag} {convertFromSAR(customPrice)} {currency}</div>
            )}
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>
              {(customPrice / customCount).toFixed(1)} ر.س / بطاقة
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أبغى باقة مخصصة ${customCount} بطاقة (${customPrice} ر.س) من منصة سلّم`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px',
                background: '#ea580c', color: '#fff', borderRadius: 12, textDecoration: 'none',
                fontSize: 15, fontWeight: 700, boxShadow: '0 4px 12px rgba(234,88,12,0.2)',
              }}
            >
              <MessageCircle size={18} />
              اطلب هذه الباقة
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Companies banner ═══ */}
      <section style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16,
          padding: 'clamp(20px, 4vw, 32px)', display: 'flex', alignItems: 'center',
          gap: 20, flexWrap: 'wrap', justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1 1 280px' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#166534', margin: '0 0 6px' }}>تحتاج أكثر من 50 بطاقة؟</h3>
            <p style={{ fontSize: 13, color: '#15803d', lineHeight: 1.8, margin: 0 }}>
              نظام الشركات يوفر داشبورد كامل، رابط موظفين ذكي، وهوية بصرية مخصصة.
            </p>
          </div>
          <Link to="/companies" style={{
            padding: '12px 24px', background: '#166534', color: '#fff', borderRadius: 10,
            textDecoration: 'none', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            باقات الشركات
          </Link>
        </div>
      </section>

      {/* Back */}
      <div style={{ textAlign: 'center', padding: '32px 24px 48px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> الصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
