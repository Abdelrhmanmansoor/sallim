import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Zap, Download, ArrowLeft, CheckCircle, Building2, MessageCircle } from 'lucide-react'
import { getTemplates } from '../utils/api'
import { useEditorStore } from '../store'
import toast, { Toaster } from 'react-hot-toast'

const PACKAGES = [
  { id: 'free', count: 1, price: 0, label: 'تجربة مجانية', badge: 'مجاني', color: '#10b981', bg: '#ecfdf5' },
  { id: 'small', count: 5, price: 29, label: '5 بطاقات', badge: 'الأكثر شيوعاً', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'medium', count: 10, price: 49, label: '10 بطاقات', badge: 'قيمة ممتازة', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'large', count: 20, price: 79, label: '20 بطاقة', badge: 'أفضل سعر', color: '#f59e0b', bg: '#fffbeb' },
]

const WHATSAPP_NUMBER = '201007835547'
const ds = { font: "'Tajawal', sans-serif" }

export default function BulkPage() {
  const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [hoveredPackage, setHoveredPackage] = useState(null)
  // Free trial inline stepper
  const [freeMode, setFreeMode] = useState(false)
  const [freeStep, setFreeStep] = useState(1)
  const [nameInput, setNameInput] = useState('')
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  // Paid package flow
  const [paidMode, setPaidMode] = useState(null) // the package object
  const freeRef = useRef(null)

  useEffect(() => {
    if (freeMode || paidMode) {
      setLoadingTemplates(true)
      getTemplates().then(res => {
        if (res.success && res.data) setTemplates(res.data)
      }).catch(() => {}).finally(() => setLoadingTemplates(false))
    }
  }, [freeMode, paidMode])

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg.id)
    if (pkg.id === 'free') {
      setFreeMode(true)
      setPaidMode(null)
      setFreeStep(1)
      setNameInput('')
      setSelectedTemplate(null)
      setTimeout(() => freeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } else {
      setFreeMode(false)
      setPaidMode(pkg)
      setTimeout(() => freeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }

  const handleFreeGenerate = () => {
    const name = nameInput.trim()
    if (!name) { toast.error('اكتب اسم واحد على الأقل'); return }
    if (!selectedTemplate) { toast.error('اختر قالب أولاً'); return }
    const store = useEditorStore.getState()
    store.setBatchNames([name])
    if (selectedTemplate) store.setTemplate(selectedTemplate.id)
    navigate('/editor?mode=batch&free=1')
  }

  const handlePaidContinue = () => {
    if (!paidMode) return
    // Navigate to editor with batch mode for now (payment integration later)
    navigate(`/editor?mode=batch&pkg=${paidMode.id}&count=${paidMode.count}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: ds.font, direction: 'rtl' }}>
      <Toaster position="top-center" />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 10vw, 100px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 24 }}>
            <Users size={16} color="#a855f7" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd' }}>الإرسال الجماعي</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>
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
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 18px' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          {PACKAGES.map((pkg) => {
            const isHovered = hoveredPackage === pkg.id
            const isActive = selectedPackage === pkg.id
            return (
              <button
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
                style={{
                  position: 'relative', background: '#fff',
                  border: `2px solid ${isActive ? pkg.color : isHovered ? pkg.color : '#e2e8f0'}`,
                  borderRadius: 24, padding: '32px 24px', cursor: 'pointer',
                  fontFamily: ds.font, textAlign: 'center', transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isActive ? `0 0 0 3px ${pkg.color}30, 0 20px 40px ${pkg.color}15` : isHovered ? `0 20px 40px ${pkg.color}20` : '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: pkg.color, color: '#fff', padding: '4px 16px', borderRadius: 100, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {pkg.badge}
                </div>

                <div style={{ width: 72, height: 72, borderRadius: 20, background: pkg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px auto 20px' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: pkg.color }}>{pkg.count}</span>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{pkg.label}</h3>

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

                <div style={{
                  padding: '14px 24px', borderRadius: 14,
                  background: isActive ? pkg.color : isHovered ? pkg.color : pkg.bg,
                  color: isActive || isHovered ? '#fff' : pkg.color,
                  fontSize: 15, fontWeight: 800, transition: 'all 0.3s ease',
                }}>
                  {isActive ? '✓ تم الاختيار' : pkg.price === 0 ? 'جرّب الآن' : 'اختر الحزمة'}
                </div>
              </button>
            )
          })}
        </div>

        {/* ════════ INLINE EXPANDED AREA ════════ */}
        <div ref={freeRef}>

          {/* ═══ FREE TRIAL: Inline Stepper ═══ */}
          {freeMode && (
            <div style={{
              animation: 'bulkSlideDown 0.5s ease',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: 28, padding: 'clamp(28px, 4vw, 48px)', marginBottom: 32,
              border: '2px solid rgba(16,185,129,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              <style>{`@keyframes bulkSlideDown { from { opacity: 0; transform: translateY(-20px); max-height: 0; } to { opacity: 1; transform: translateY(0); max-height: 2000px; } }`}</style>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>🎉 تجربة مجانية — بطاقة واحدة</h3>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>اكتب اسم واحد، اختر القالب، وحمّل بطاقتك</p>
                </div>
                <button onClick={() => { setFreeMode(false); setSelectedPackage(null) }} style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: ds.font,
                }}>✕ إغلاق</button>
              </div>

              {/* Stepper Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                {[{ n: 1, l: 'الاسم' }, { n: 2, l: 'القالب' }, { n: 3, l: 'التوليد' }].map((s, i) => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div onClick={() => s.n <= freeStep && setFreeStep(s.n)} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
                      cursor: s.n <= freeStep ? 'pointer' : 'default',
                      background: freeStep === s.n ? 'rgba(16,185,129,0.15)' : 'transparent',
                      border: `1px solid ${freeStep >= s.n ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 900,
                        background: freeStep >= s.n ? '#10b981' : 'rgba(255,255,255,0.06)',
                        color: freeStep >= s.n ? '#fff' : '#64748b',
                      }}>{freeStep > s.n ? '✓' : s.n}</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: freeStep >= s.n ? '#fff' : '#64748b' }}>{s.l}</span>
                    </div>
                    {i < 2 && <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.08)' }} />}
                  </div>
                ))}
              </div>

              {/* Step 1: Name */}
              {freeStep === 1 && (
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#cbd5e1', marginBottom: 10 }}>اكتب اسم المستلم</label>
                  <input
                    type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                    placeholder="مثال: محمد أحمد" dir="rtl"
                    style={{
                      width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff',
                      fontSize: 17, fontWeight: 700, fontFamily: ds.font, outline: 'none', textAlign: 'center',
                      marginBottom: 20,
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && nameInput.trim() && setFreeStep(2)}
                  />
                  <button
                    onClick={() => nameInput.trim() && setFreeStep(2)}
                    disabled={!nameInput.trim()}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 14, border: 'none', fontSize: 16, fontWeight: 800,
                      fontFamily: ds.font, cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                      background: nameInput.trim() ? '#10b981' : '#334155', color: '#fff',
                    }}
                  >التالي — اختر القالب ←</button>
                </div>
              )}

              {/* Step 2: Template */}
              {freeStep === 2 && (
                <div>
                  {loadingTemplates ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>جارٍ تحميل القوالب...</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
                      {templates.map(t => (
                        <button key={t.id} onClick={() => setSelectedTemplate(t)} style={{
                          position: 'relative', aspectRatio: '9/16', borderRadius: 14, overflow: 'hidden',
                          border: selectedTemplate?.id === t.id ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer', padding: 0, background: '#0f172a', transition: 'all 0.2s',
                          transform: selectedTemplate?.id === t.id ? 'scale(1.03)' : 'scale(1)',
                        }}>
                          <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                          {selectedTemplate?.id === t.id && (
                            <div style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedTemplate && (
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>القالب المختار: </span>
                      <span style={{ fontSize: 14, color: '#10b981', fontWeight: 800 }}>{selectedTemplate.name}</span>
                      <span style={{ fontSize: 13, color: '#64748b' }}> — للاسم: </span>
                      <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>{nameInput.trim()}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, maxWidth: 500, margin: '0 auto' }}>
                    <button onClick={() => setFreeStep(1)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font }}>
                      → السابق
                    </button>
                    <button onClick={() => selectedTemplate && setFreeStep(3)} disabled={!selectedTemplate} style={{
                      padding: '12px 28px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 800,
                      fontFamily: ds.font, cursor: selectedTemplate ? 'pointer' : 'not-allowed',
                      background: selectedTemplate ? '#10b981' : '#334155', color: '#fff',
                    }}>التالي — توليد ←</button>
                  </div>
                </div>
              )}

              {/* Step 3: Generate */}
              {freeStep === 3 && (
                <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎴</div>
                  <h4 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>جاهز للتوليد!</h4>
                  <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>
                    الاسم: <strong style={{ color: '#fff' }}>{nameInput.trim()}</strong>
                  </p>
                  <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>
                    القالب: <strong style={{ color: '#10b981' }}>{selectedTemplate?.name}</strong>
                  </p>

                  <button onClick={handleFreeGenerate} style={{
                    width: '100%', padding: '18px', borderRadius: 16, border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                    fontSize: 18, fontWeight: 900, cursor: 'pointer', fontFamily: ds.font,
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                  }}>
                    ولّد البطاقة وحمّلها 🎉
                  </button>

                  <button onClick={() => setFreeStep(2)} style={{ display: 'block', margin: '16px auto 0', padding: '10px 20px', background: 'transparent', color: '#64748b', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font }}>
                    → تغيير القالب
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ PAID PACKAGE: Info + CTA ═══ */}
          {paidMode && (
            <div style={{
              animation: 'bulkSlideDown 0.5s ease',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: 28, padding: 'clamp(28px, 4vw, 48px)', marginBottom: 32,
              border: `2px solid ${paidMode.color}30`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              <style>{`@keyframes bulkSlideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: paidMode.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: paidMode.color }}>{paidMode.count}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>
                      باقة {paidMode.label} — {paidMode.price} ر.س
                    </h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>ادفع مرة واحدة واستخدم فوراً — بدون اشتراك</p>
                  </div>
                </div>
                <button onClick={() => { setPaidMode(null); setSelectedPackage(null) }} style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: ds.font,
                }}>✕ إغلاق</button>
              </div>

              {/* What you get */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
                {[
                  { icon: '🎴', text: `${paidMode.count} بطاقة تهنئة` },
                  { icon: '📄', text: 'رفع CSV أو كتابة يدوية' },
                  { icon: '📦', text: 'تحميل ZIP دفعة واحدة' },
                  { icon: '🎨', text: 'اختيار القالب الذي تريده' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                    background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Payment CTA */}
              <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
                <button onClick={handlePaidContinue} style={{
                  width: '100%', padding: '18px', borderRadius: 16, border: 'none',
                  background: `linear-gradient(135deg, ${paidMode.color}, ${paidMode.color}cc)`,
                  color: '#fff', fontSize: 18, fontWeight: 900, cursor: 'pointer', fontFamily: ds.font,
                  boxShadow: `0 8px 24px ${paidMode.color}40`, marginBottom: 16,
                }}>
                  اشترِ الآن — {paidMode.price} ر.س
                </button>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
                  💳 الدفع الإلكتروني قريباً — حالياً تواصل معنا عبر واتساب لإتمام الشراء
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أرغب بشراء باقة ${paidMode.label} (${paidMode.count} بطاقة) بسعر ${paidMode.price} ر.س`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '14px 28px', background: '#25D366', color: '#fff',
                    borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 800,
                  }}
                >
                  <MessageCircle size={18} />
                  أكمل الشراء عبر واتساب
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Companies CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px solid #fbbf24',
          borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)',
          display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Building2 size={24} color="#b45309" />
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#92400e', margin: 0 }}>تحتاج أكثر من 20 بطاقة؟</h3>
            </div>
            <p style={{ fontSize: 15, color: '#b45309', lineHeight: 1.8, margin: 0 }}>
              باقات الشركات تبدأ من 50 بطاقة وحتى 500+ مع رابط موظفين ذكي وهوية مخصصة.
              <br />تواصل معنا واحصل على عرض سعر مخصص لشركتك.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بالاستفسار عن باقات الشركات للإرسال الجماعي 🏢')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#25D366', color: '#fff', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
              <MessageCircle size={18} /> تواصل عبر واتساب
            </a>
            <Link to="/companies" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#b45309', color: '#fff', borderRadius: 14, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>
              <Building2 size={18} /> باقات الشركات
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: '#0f172a', marginBottom: 48 }}>كيف يعمل؟</h2>
          <div style={{ display: 'grid', gap: 24 }}>
            {[
              { step: '1', title: 'اختر الكمية', desc: 'جرّب مجاناً ببطاقة واحدة، أو اختر حزمة مدفوعة تناسب عدد المستلمين.' },
              { step: '2', title: 'اختر القالب واكتب الأسماء', desc: 'اختر تصميم البطاقة واكتب أسماء المستلمين يدوياً أو ارفع ملف CSV.' },
              { step: '3', title: 'حمّل ملف ZIP', desc: 'اضغط "ولّد الكل" وحمّل كل البطاقات في ملف ZIP جاهز للمشاركة.' },
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, flex: '0 0 48px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900 }}>
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
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={16} /> العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}
