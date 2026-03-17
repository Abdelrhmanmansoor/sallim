import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompany } from '../context/CompanyContext'
import { updateCompanyProfile, getTemplates, consumeBatchCards } from '../utils/api'
import { templates as staticTemplates, designerOnlyTemplates, fonts } from '../data/templates'
// JSZip loaded dynamically in handleGenerate
import toast, { Toaster } from 'react-hot-toast'

const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_BASE = RAW_API_BASE.replace(/\/+$/, '')

const f = { font: "'Tajawal', sans-serif" }
const C = {
    bg: '#f5f7fa',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    yellow: '#d97706',
}

export default function CompanyDashboardPage() {
    const { company, token, logout, isAuthenticated, loading, updateCompanyData } = useCompany()
    const navigate = useNavigate()
    const [activeView, setActiveView] = useState('home')
    const [showWelcome, setShowWelcome] = useState(false)

    useEffect(() => {
        if (isAuthenticated && company) {
            const key = `sallim_welcomed_${company._id || company.id}`
            if (!sessionStorage.getItem(key)) setShowWelcome(true)
        }
    }, [isAuthenticated, company])

    const dismissWelcome = () => {
        setShowWelcome(false)
        sessionStorage.setItem(`sallim_welcomed_${company?._id || company?.id}`, '1')
    }

    // Wait for context to finish loading from localStorage
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f.font }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${C.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!isAuthenticated || !company) {
        return (
            <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f.font, direction: 'rtl' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: C.muted, marginBottom: 20, fontSize: 16 }}>يجب تسجيل الدخول كشركة للوصول لهذه الصفحة</p>
                    <Link to="/company-login" style={{ display: 'inline-block', padding: '14px 32px', background: C.accent, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        )
    }

    // ── Credit calculation: use server fields cardsLimit / cardsUsed ──
    const totalCredits = company.cardsLimit || company.totalCredits || 0
    const usedCredits = company.cardsUsed || company.usedCredits || 0
    const remaining = Math.max(0, totalCredits - usedCredits)
    const usagePercent = totalCredits > 0 ? Math.round((usedCredits / totalCredits) * 100) : 0
    const isDepleted = remaining <= 0 && totalCredits > 0
    const isLow = usagePercent >= 80 && !isDepleted

    const TABS = [
        { id: 'home', label: 'الرئيسية' },
        { id: 'cards', label: 'أنشئ بطاقات' },
        { id: 'link', label: 'رابط الموظفين' },
        { id: 'settings', label: 'الهوية' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: C.bg, fontFamily: f.font, direction: 'rtl' }}>
            <Toaster position="top-center" />

            {/* ── Welcome Modal ── */}
            {showWelcome && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: 24 }}>
                    <div style={{ background: C.card, borderRadius: 24, padding: 'clamp(32px,5vw,48px)', maxWidth: 440, width: '100%', textAlign: 'center', border: `1px solid ${C.border}`, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid #bbf7d0' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>أهلاً بك في بورتال الشركات</h2>
                        <p style={{ fontSize: 15, color: C.muted, marginBottom: 8 }}>باقتك المفعّلة</p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 28px', marginBottom: 28 }}>
                            <span style={{ fontSize: 36, fontWeight: 900, color: C.green }}>{totalCredits}</span>
                            <span style={{ fontSize: 14, color: '#166534', fontWeight: 700 }}>بطاقة متاحة</span>
                        </div>
                        <br />
                        <button onClick={dismissWelcome} style={{ padding: '14px 44px', background: C.accent, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: f.font }}>
                            ابدأ الآن
                        </button>
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <header style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {company.logoUrl
                                ? <img src={company.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                : <span style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{(company.name || 'ش')[0]}</span>
                            }
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>بورتال الشركات</div>
                            <h1 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0 }}>{company.name || 'شركتك'}</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Credit Badge */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 26, fontWeight: 900, color: isDepleted ? C.red : isLow ? C.yellow : C.green, lineHeight: 1 }}>
                                {remaining}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>بطاقة متبقية</div>
                        </div>
                        <button onClick={logout} style={{ padding: '8px 16px', background: '#fef2f2', color: C.red, border: `1px solid #fecaca`, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: f.font }}>
                            خروج
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ maxWidth: 900, margin: '12px auto 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>{usedCredits} مستخدمة من {totalCredits}</span>
                        <span style={{ fontSize: 11, color: isDepleted ? C.red : isLow ? C.yellow : C.muted, fontWeight: 700 }}>{usagePercent}%</span>
                    </div>
                    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 100, width: `${Math.min(usagePercent, 100)}%`, transition: 'width 0.6s', background: isDepleted ? C.red : isLow ? C.yellow : C.green }} />
                    </div>
                </div>
            </header>

            {/* ── Alerts ── */}
            {isLow && !isDepleted && (
                <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 24px' }}>
                    <div style={{ background: '#fffbeb', border: `1px solid #fde68a`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.yellow }}>رصيدك على وشك النفاد — تبقى {remaining} بطاقة</div>
                        </div>
                        <a href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً، أرغب بتجديد باقة شركتي في سلّم')}`} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '8px 16px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            تجديد
                        </a>
                    </div>
                </div>
            )}
            {isDepleted && (
                <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 24px' }}>
                    <div style={{ background: '#fef2f2', border: `1px solid #fecaca`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>نفد رصيد البطاقات — تواصل معنا لتجديد الباقة</div>
                        </div>
                        <a href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً، نفد رصيد شركتي في سلّم')}`} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '8px 16px', background: '#25D366', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                            تواصل معنا
                        </a>
                    </div>
                </div>
            )}

            {/* ── Tabs ── */}
            <div style={{ maxWidth: 900, margin: '20px auto 0', padding: '0 24px' }}>
                <div style={{ display: 'flex', gap: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 4 }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveView(tab.id)} style={{
                            flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontFamily: f.font, fontSize: 13, fontWeight: 700,
                            background: activeView === tab.id ? C.accent : 'transparent',
                            color: activeView === tab.id ? '#fff' : C.muted,
                            transition: 'all 0.2s',
                        }}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px 60px' }}>
                {activeView === 'home' && <HomeView isDepleted={isDepleted} setActiveView={setActiveView} company={company} remaining={remaining} totalCredits={totalCredits} />}
                {activeView === 'cards' && <BatchCardsView company={company} token={token} isDepleted={isDepleted} remaining={remaining} />}
                {activeView === 'link' && <EmployeeLinkView company={company} token={token} isDepleted={isDepleted} />}
                {activeView === 'settings' && <BrandingSettings company={company} token={token} updateCompanyData={updateCompanyData} />}
            </div>
        </div>
    )
}

/* ════════════ HOME VIEW ════════════ */
function HomeView({ isDepleted, setActiveView, company, remaining, totalCredits }) {
    return (
        <div style={{ display: 'grid', gap: 20 }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                    { label: 'إجمالي الرصيد', value: totalCredits },
                    { label: 'متبقي', value: remaining, highlight: true },
                    { label: 'المستخدم', value: Math.max(0, totalCredits - remaining) },
                ].map(s => (
                    <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: s.highlight ? C.accent : C.text }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Action cards */}
            <button onClick={() => !isDepleted && setActiveView('cards')} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
                padding: 'clamp(22px,4vw,32px)', textAlign: 'right',
                cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: f.font,
                opacity: isDepleted ? 0.5 : 1, transition: 'box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 6px' }}>أنشئ بطاقات الآن</h3>
                        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>ارفع أسماء الموظفين، اختر القالب، وحمّل الكل دفعة واحدة</p>
                    </div>
                    <div style={{ padding: '10px 20px', background: isDepleted ? '#f1f5f9' : C.green, color: isDepleted ? C.muted : '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', marginRight: 16 }}>
                        {isDepleted ? 'نفد الرصيد' : 'ابدأ'}
                    </div>
                </div>
            </button>

            <button onClick={() => !isDepleted && setActiveView('link')} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
                padding: 'clamp(22px,4vw,32px)', textAlign: 'right',
                cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: f.font,
                opacity: isDepleted ? 0.5 : 1, transition: 'box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 6px' }}>رابط موظفيك</h3>
                        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>أنشئ رابط مناسبة — كل موظف يكتب اسمه ويحمّل بطاقته بنفسه</p>
                    </div>
                    <div style={{ padding: '10px 20px', background: isDepleted ? '#f1f5f9' : C.accent, color: isDepleted ? C.muted : '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', marginRight: 16 }}>
                        {isDepleted ? 'نفد الرصيد' : 'أنشئ رابط'}
                    </div>
                </div>
            </button>
        </div>
    )
}

/* ════════════ BATCH CARDS VIEW ════════════ */
function BatchCardsView({ company, token, isDepleted, remaining }) {
    const [step, setStep] = useState(1)
    const [names, setNames] = useState([])
    const [nameInput, setNameInput] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [publicTemplates, setPublicTemplates] = useState([])
    const [companyTemplates, setCompanyTemplates] = useState([])
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [downloadReady, setDownloadReady] = useState(null)
    // Text controls — matching EditorPage
    const [selectedFont, setSelectedFont] = useState('amiri')
    const [fontSize, setFontSize] = useState(60)
    const [nameColor, setNameColor] = useState('')
    const [nameY, setNameY] = useState(0.65)

    useEffect(() => {
        // Merge static templates + designer templates as fallback
        const allStatic = [...staticTemplates, ...designerOnlyTemplates].map(t => ({
            ...t, _id: t.id, id: t.id,
            name: t.name,
            image: t.image,
        }))

        getTemplates()
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    // API has templates — use them + static as fallback
                    const apiTemplates = res.data
                    const apiIds = new Set(apiTemplates.map(t => String(t._id || t.id)))
                    const extras = allStatic.filter(t => !apiIds.has(String(t.id)))
                    setPublicTemplates([...apiTemplates, ...extras])
                } else {
                    // API empty — use all static templates
                    setPublicTemplates(allStatic)
                }
                if (company.customTemplates?.length) setCompanyTemplates(company.customTemplates)
            })
            .catch(() => {
                // API failed — use static templates
                setPublicTemplates(allStatic)
            })
            .finally(() => setIsLoadingTemplates(false))
    }, [company])

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const parsed = ev.target.result.split(/[\n,;]+/).map(n => n.trim()).filter(Boolean)
            setNames(parsed); setNameInput(parsed.join('\n'))
            toast.success(`تم رصد ${parsed.length} اسم`)
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const overLimit = names.length > remaining

    const handleGenerate = async () => {
        if (!selectedTemplate || names.length === 0) return
        setGenerating(true)
        setProgress(0)
        setDownloadReady(null)

        try {
            const { default: JSZip } = await import('jszip')
            const zip = new JSZip()
            const templateImg = await new Promise((resolve, reject) => {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => resolve(img)
                img.onerror = () => reject(new Error('فشل تحميل القالب'))
                img.src = selectedTemplate.image || selectedTemplate.template
            })

            const W = templateImg.naturalWidth || 1080
            const H = templateImg.naturalHeight || 1920
            const canvas = document.createElement('canvas')
            canvas.width = W
            canvas.height = H
            const ctx = canvas.getContext('2d')

            const currentFont = fonts.find(fo => fo.id === selectedFont) || fonts[1]
            const textColor = nameColor || selectedTemplate.textColor || selectedTemplate.nameColor || '#ffffff'
            const scaledSize = Math.round(fontSize * (W / 1080))

            for (let i = 0; i < names.length; i++) {
                ctx.clearRect(0, 0, W, H)
                ctx.drawImage(templateImg, 0, 0, W, H)

                ctx.font = `normal ${scaledSize}px ${currentFont.family}`
                ctx.fillStyle = textColor
                ctx.textAlign = 'center'
                ctx.textBaseline = 'top'
                ctx.direction = 'rtl'
                ctx.fillText(names[i], W / 2, H * nameY)

                const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
                zip.file(`${names[i].replace(/[\/\\:*?"<>|]/g, '_')}.png`, blob)
                setProgress(Math.round(((i + 1) / names.length) * 100))
            }

            // Deduct from balance
            if (token) {
                try {
                    await consumeBatchCards(token, names.length)
                } catch { /* silent */ }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' })
            setDownloadReady(zipBlob)
            toast.success(`تم توليد ${names.length} بطاقة بنجاح!`)
        } catch (err) {
            console.error('Generation error:', err)
            toast.error(err.message || 'حدث خطأ أثناء التوليد')
        } finally {
            setGenerating(false)
        }
    }

    const handleDownload = () => {
        if (!downloadReady) return
        const link = document.createElement('a')
        link.href = URL.createObjectURL(downloadReady)
        link.download = `${company.name || 'cards'}-${names.length}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
    }

    const STEPS = [{ n: 1, l: 'الأسماء' }, { n: 2, l: 'القالب' }, { n: 3, l: 'التوليد' }]

    const cardStyle = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 'clamp(22px,4vw,32px)' }
    const inputStyle = { width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f.font, background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, outline: 'none', boxSizing: 'border-box' }
    const btnStyle = (active) => ({ padding: '12px 28px', background: active ? C.accent : '#f1f5f9', color: active ? '#fff' : C.muted, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: active ? 'pointer' : 'not-allowed', fontFamily: f.font })

    return (
        <div>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
                {STEPS.map((s, i) => (
                    <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div onClick={() => s.n <= step && setStep(s.n)} style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10,
                            cursor: s.n <= step ? 'pointer' : 'default',
                            background: step === s.n ? C.accent : step > s.n ? '#f0fdf4' : '#f8fafc',
                            border: `1px solid ${step === s.n ? C.accent : step > s.n ? '#bbf7d0' : C.border}`,
                        }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: step >= s.n ? (step === s.n ? 'rgba(255,255,255,0.2)' : C.green) : '#e2e8f0', color: step >= s.n ? '#fff' : C.muted }}>
                                {step > s.n ? '✓' : s.n}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: step === s.n ? '#fff' : step > s.n ? C.green : C.muted }}>{s.l}</span>
                        </div>
                        {i < STEPS.length - 1 && <div style={{ width: 20, height: 2, background: C.border, borderRadius: 1 }} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Names */}
            {step === 1 && (
                <div style={cardStyle}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 18 }}>أدخل أسماء المستلمين</h3>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: 16, background: '#f8fafc', border: `2px dashed ${C.border}`, borderRadius: 14, cursor: 'pointer', marginBottom: 16, color: C.muted, fontSize: 13, fontWeight: 700, boxSizing: 'border-box' }}>
                        <input type="file" accept=".txt,.csv" style={{ display: 'none' }} onChange={handleFileUpload} />
                        ارفع ملف CSV أو TXT
                    </label>
                    <div style={{ marginBottom: 8, fontSize: 12, color: C.muted, fontWeight: 600 }}>أو اكتب الأسماء يدوياً (كل اسم في سطر)</div>
                    <textarea dir="rtl" rows={7} placeholder={'محمد\nأحمد\nفاطمة'} value={nameInput} onChange={e => { setNameInput(e.target.value); setNames(e.target.value.split('\n').map(n => n.trim()).filter(Boolean)) }}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 160, lineHeight: 2 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                        <span style={{ fontSize: 13, color: overLimit ? C.red : C.green, fontWeight: 700 }}>
                            {names.length > 0 ? `${names.length} اسم` : 'لم يُدخل أسماء بعد'}
                            {overLimit && ` — يتجاوز الرصيد (${remaining})`}
                        </span>
                        <button onClick={() => names.length > 0 && !overLimit && setStep(2)} style={btnStyle(names.length > 0 && !overLimit)}>التالي</button>
                    </div>
                </div>
            )}

            {/* Step 2: Template */}
            {step === 2 && (
                <div style={cardStyle}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 18 }}>اختر القالب</h3>
                    {isLoadingTemplates ? (
                        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>جارٍ تحميل القوالب...</div>
                    ) : (
                        <>
                            {/* Company templates */}
                            {companyTemplates.length > 0 && (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
                                        قوالب خاصة بشركتك
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
                                        {companyTemplates.map(t => (
                                            <TemplateTile key={t.id || t._id} t={t} selected={selectedTemplate?.id === (t.id || t._id)} onSelect={setSelectedTemplate} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Public templates */}
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.muted, display: 'inline-block' }} />
                                    قوالب عامة
                                </div>
                                {publicTemplates.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 32, color: C.muted, background: '#f8fafc', borderRadius: 14, border: `1px dashed ${C.border}` }}>
                                        لا توجد قوالب متاحة حالياً
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
                                        {publicTemplates.map(t => (
                                            <TemplateTile key={t.id || t._id} t={t} selected={selectedTemplate?.id === (t.id || t._id) || selectedTemplate?._id === (t.id || t._id)} onSelect={setSelectedTemplate} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {selectedTemplate && (
                        <>
                            <div style={{ marginTop: 16, padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, fontSize: 13, color: '#166534', fontWeight: 700 }}>
                                تم اختيار: {selectedTemplate.name} — معاينة بـ "{names[0]}"
                            </div>

                            {/* ── Text Controls ── */}
                            <div style={{ marginTop: 20, padding: 20, background: '#f8fafc', borderRadius: 14, border: `1px solid ${C.border}` }}>
                                <h4 style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 14, margin: '0 0 14px 0' }}>إعدادات النص</h4>

                                {/* Preview card */}
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', maxWidth: 180, width: '100%' }}>
                                    <img src={selectedTemplate.image || selectedTemplate.template} alt="Preview" style={{ width: '100%', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: `${nameY * 100}%`, left: '50%', transform: 'translate(-50%,-50%)', color: nameColor || selectedTemplate.textColor || '#fff', fontSize: Math.max(10, fontSize * 0.22), fontWeight: 400, fontFamily: (fonts.find(fo => fo.id === selectedFont) || fonts[1]).family, textAlign: 'center', width: '80%', direction: 'rtl' }}>
                                        {names[0] || 'اسم'}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: 12 }}>
                                    {/* Font selector */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>الخط</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {fonts.map(fo => (
                                                <button key={fo.id} onClick={() => setSelectedFont(fo.id)} style={{
                                                    padding: '6px 12px', borderRadius: 8, border: selectedFont === fo.id ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                                                    background: selectedFont === fo.id ? '#f5f3ff' : '#fff', cursor: 'pointer',
                                                    fontSize: 12, fontFamily: fo.family, fontWeight: 700, color: C.text,
                                                }}>{fo.label}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font size */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>حجم الخط: {fontSize}px</label>
                                        <input type="range" min={20} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                                    </div>

                                    {/* Text color */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>لون النص</label>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                            {['#ffffff', '#f1c40f', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#1a1a2e', '#b8860b'].map(c => (
                                                <div key={c} onClick={() => setNameColor(c)} style={{
                                                    width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                                                    border: (nameColor || selectedTemplate.textColor || '#ffffff') === c ? '3px solid #7c3aed' : '2px solid #e2e8f0',
                                                    transition: 'transform 0.15s', transform: (nameColor || selectedTemplate.textColor || '#ffffff') === c ? 'scale(1.15)' : 'scale(1)',
                                                }} />
                                            ))}
                                            <input type="color" value={nameColor || selectedTemplate.textColor || '#ffffff'} onChange={e => setNameColor(e.target.value)}
                                                style={{ width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', border: 'none', padding: 0 }} />
                                        </div>
                                    </div>

                                    {/* Y position */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>موضع الاسم: {Math.round(nameY * 100)}%</label>
                                        <input type="range" min={20} max={90} value={Math.round(nameY * 100)} onChange={e => setNameY(Number(e.target.value) / 100)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
                        <button onClick={() => setStep(1)} style={btnStyle(true)}>السابق</button>
                        <button onClick={() => selectedTemplate && setStep(3)} style={btnStyle(!!selectedTemplate)}>التالي</button>
                    </div>
                </div>
            )}

            {/* Step 3: Generate */}
            {step === 3 && (
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                        {generating ? 'جارٍ التوليد...' : downloadReady ? 'تم التوليد بنجاح ✅' : 'جاهز للتوليد'}
                    </h3>
                    <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
                        {names.length} بطاقة — قالب: {selectedTemplate?.name || 'مختار'}
                    </p>

                    {/* Preview: show template with first name */}
                    {selectedTemplate && (
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: 220 }}>
                            <img src={selectedTemplate.image || selectedTemplate.template} alt="Preview" style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                            <div style={{ position: 'absolute', top: `${nameY * 100}%`, left: '50%', transform: 'translate(-50%,-50%)', color: nameColor || selectedTemplate.textColor || '#fff', fontSize: Math.max(12, fontSize * 0.26), fontWeight: 400, fontFamily: (fonts.find(fo => fo.id === selectedFont) || fonts[1]).family, textAlign: 'center', width: '80%', direction: 'rtl' }}>
                                {names[0]}
                            </div>
                        </div>
                    )}

                    {/* Progress bar */}
                    {generating && (
                        <div style={{ margin: '0 auto 20px', maxWidth: 320 }}>
                            <div style={{ background: '#e2e8f0', borderRadius: 10, height: 12, overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: 10, transition: 'width 0.3s ease' }} />
                            </div>
                            <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>{progress}% — جارٍ توليد البطاقات...</p>
                        </div>
                    )}

                    {/* Generate button */}
                    {!downloadReady && (
                        <button onClick={handleGenerate} disabled={generating} style={{ padding: '16px 44px', background: generating ? '#94a3b8' : C.green, color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 900, cursor: generating ? 'wait' : 'pointer', fontFamily: f.font, boxShadow: generating ? 'none' : '0 6px 20px rgba(5,150,105,0.25)' }}>
                            {generating ? `جارٍ التوليد ${progress}%` : `ولّد ${names.length} بطاقة`}
                        </button>
                    )}

                    {/* Download button */}
                    {downloadReady && (
                        <div>
                            <button onClick={handleDownload} style={{ padding: '16px 44px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 900, cursor: 'pointer', fontFamily: f.font, boxShadow: '0 6px 20px rgba(37,99,235,0.25)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                تحميل {names.length} بطاقة (ZIP)
                            </button>
                            <div style={{ marginTop: 16 }}>
                                <button onClick={() => { setDownloadReady(null); setProgress(0); setStep(2) }} style={{ padding: '10px 20px', background: '#f1f5f9', color: C.muted, border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: f.font }}>
                                    توليد بقالب آخر
                                </button>
                            </div>
                        </div>
                    )}

                    {!downloadReady && (
                        <div style={{ marginTop: 20 }}>
                            <button onClick={() => setStep(2)} disabled={generating} style={{ padding: '10px 20px', background: '#f1f5f9', color: C.muted, border: 'none', borderRadius: 10, fontSize: 13, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: f.font }}>
                                العودة لاختيار القالب
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function TemplateTile({ t, selected, onSelect }) {
    return (
        <button onClick={() => onSelect(t)} style={{
            position: 'relative', aspectRatio: '9/16', borderRadius: 12, overflow: 'hidden',
            border: selected ? `3px solid ${C.accent}` : `2px solid ${C.border}`,
            cursor: 'pointer', padding: 0, background: '#f8fafc', transition: 'all 0.2s',
            transform: selected ? 'scale(1.03)' : 'scale(1)',
        }}>
            {t.image
                ? <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.muted, padding: 8, textAlign: 'center' }}>{t.name}</div>
            }
            {selected && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>
            )}
        </button>
    )
}

/* ════════════ EMPLOYEE LINK VIEW ════════════ */
function EmployeeLinkView({ company, token, isDepleted }) {
    const [occasionName, setOccasionName] = useState('')
    const [greetingText, setGreetingText] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [templates, setTemplates] = useState([])
    const [step, setStep] = useState(1) // 1=form, 2=generated
    const [generatedLink, setGeneratedLink] = useState('')
    const [copied, setCopied] = useState(false)
    // Text settings for employee links
    const [selectedFont, setSelectedFont] = useState('amiri')
    const [linkFontSize, setLinkFontSize] = useState(60)
    const [linkNameColor, setLinkNameColor] = useState('')
    const [linkNameY, setLinkNameY] = useState(0.65)
    // Individual links
    const [showIndividual, setShowIndividual] = useState(false)
    const [employeeNames, setEmployeeNames] = useState('')
    const [individualLinks, setIndividualLinks] = useState([])
    const [allCopied, setAllCopied] = useState(false)

    useEffect(() => {
        const allStatic = [...staticTemplates, ...designerOnlyTemplates].map(t => ({
            ...t, _id: t.id, id: t.id, name: t.name, image: t.image,
        }))
        getTemplates().then(res => {
            if (res.success && res.data && res.data.length > 0) {
                const apiIds = new Set(res.data.map(t => String(t._id || t.id)))
                const extras = allStatic.filter(t => !apiIds.has(String(t.id)))
                setTemplates([...res.data, ...extras])
            } else {
                setTemplates(allStatic)
            }
        }).catch(() => setTemplates(allStatic))
    }, [])

    const companySlug = company.slug || 'company'

    const handleCreateLink = async () => {
        if (!occasionName.trim()) { toast.error('اكتب اسم المناسبة'); return }
        if (!selectedTemplate) { toast.error('اختر قالباً للموظفين'); return }
        const templateImg = selectedTemplate.image || selectedTemplate.template || ''
        if (!templateImg) { toast.error('القالب المختار لا يحتوي على صورة'); return }

        try {
            const res = await fetch(`${API_BASE}/api/v1/company/greet-links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    occasionName: occasionName.trim(),
                    greetingText: greetingText.trim(),
                    templateId: String(selectedTemplate.id || selectedTemplate._id || ''),
                    templateImage: templateImg,
                    templateTextColor: selectedTemplate.textColor || '#ffffff',
                    font: selectedFont,
                    fontSize: linkFontSize,
                    nameY: linkNameY,
                    nameColor: linkNameColor || '',
                    expiresAt: expiryDate || null,
                })
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'حدث خطأ')
            const link = `${window.location.origin}/g/${data.data.shortId}`
            setGeneratedLink(link)
            setStep(2)
            toast.success('تم إنشاء الرابط القصير')
        } catch (err) {
            toast.error(err.message || 'حدث خطأ في إنشاء الرابط')
        }
    }

    const handleGenerateIndividual = async () => {
        const names = employeeNames.split('\n').map(n => n.trim()).filter(Boolean)
        if (!names.length) { toast.error('أدخل أسماء الموظفين'); return }
        if (!selectedTemplate) { toast.error('اختر قالباً أولاً'); return }
        const templateImg = selectedTemplate.image || selectedTemplate.template || ''
        if (!templateImg) { toast.error('القالب المختار لا يحتوي على صورة'); return }

        try {
            const res = await fetch(`${API_BASE}/api/v1/company/greet-links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    occasionName: occasionName.trim(),
                    greetingText: greetingText.trim(),
                    templateId: String(selectedTemplate.id || selectedTemplate._id || ''),
                    templateImage: templateImg,
                    templateTextColor: selectedTemplate.textColor || '#ffffff',
                    font: selectedFont,
                    fontSize: linkFontSize,
                    nameY: linkNameY,
                    nameColor: linkNameColor || '',
                    expiresAt: expiryDate || null,
                })
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'حدث خطأ')
            const baseUrl = `${window.location.origin}/g/${data.data.shortId}`
            const links = names.map(name => ({
                name,
                url: `${baseUrl}?for=${encodeURIComponent(name)}`,
            }))
            setIndividualLinks(links)
            toast.success('تم إنشاء الروابط')
        } catch (err) {
            toast.error(err.message || 'حدث خطأ في إنشاء الروابط')
        }
    }

    const handleCopyAll = () => {
        const text = individualLinks.map(l => `${l.name}: ${l.url}`).join('\n')
        navigator.clipboard.writeText(text)
        setAllCopied(true)
        setTimeout(() => setAllCopied(false), 2000)
        toast.success('تم نسخ كل الروابط')
    }

    const inputStyle = { width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f.font, background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, outline: 'none', boxSizing: 'border-box' }
    const cardStyle = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 'clamp(22px,4vw,32px)' }

    return (
        <div style={{ display: 'grid', gap: 20 }}>
            {step === 1 ? (
                <div style={cardStyle}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 6 }}>إنشاء رابط مناسبة للموظفين</h3>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.8 }}>
                        رابط خاص يشاركه كل موظف — كتابة الاسم وتحميل البطاقة. كل بطاقة تُحسب من رصيدك.
                    </p>

                    <div style={{ display: 'grid', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>اسم المناسبة *</label>
                            <input value={occasionName} onChange={e => setOccasionName(e.target.value)} placeholder="مثال: عيد الفطر 2026" dir="rtl" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>نص التهنئة من الشركة (اختياري)</label>
                            <textarea value={greetingText} onChange={e => setGreetingText(e.target.value)} placeholder="تهنئكم شركة ... بمناسبة ..." dir="rtl" rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>تاريخ انتهاء الرابط (اختياري)</label>
                            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={inputStyle} />
                        </div>

                        {/* Template selector - single choice */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10 }}>اختر قالب للموظفين *</label>
                            {templates.length === 0
                                ? <div style={{ padding: 16, textAlign: 'center', color: C.muted, fontSize: 13 }}>جارٍ التحميل...</div>
                                : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
                                    {templates.map(t => <TemplateTile key={t.id || t._id} t={t} selected={selectedTemplate?.id === (t.id || t._id) || selectedTemplate?._id === (t.id || t._id)} onSelect={setSelectedTemplate} />)}
                                </div>
                            }
                            {selectedTemplate && <div style={{ marginTop: 8, fontSize: 12, color: C.green, fontWeight: 700 }}>تم اختيار: {selectedTemplate.name}</div>}
                        </div>

                        {/* ── Text Controls for Employee Links ── */}
                        {selectedTemplate && (
                            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: `1px solid ${C.border}` }}>
                                <h4 style={{ fontSize: 13, fontWeight: 800, color: C.text, margin: '0 0 12px 0' }}>إعدادات نص البطاقة</h4>

                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14, borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', maxWidth: 140 }}>
                                    <img src={selectedTemplate.image || selectedTemplate.template} alt="" style={{ width: '100%', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: `${linkNameY * 100}%`, left: '50%', transform: 'translate(-50%,-50%)', color: linkNameColor || selectedTemplate.textColor || '#fff', fontSize: Math.max(8, linkFontSize * 0.18), fontFamily: (fonts.find(fo => fo.id === selectedFont) || fonts[1]).family, textAlign: 'center', width: '80%', direction: 'rtl' }}>
                                        اسم الموظف
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: 10 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>الخط</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                            {fonts.map(fo => (
                                                <button key={fo.id} onClick={() => setSelectedFont(fo.id)} style={{
                                                    padding: '4px 10px', borderRadius: 6, border: selectedFont === fo.id ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                                                    background: selectedFont === fo.id ? '#f5f3ff' : '#fff', cursor: 'pointer',
                                                    fontSize: 11, fontFamily: fo.family, fontWeight: 700, color: C.text,
                                                }}>{fo.label}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>حجم: {linkFontSize}</label>
                                            <input type="range" min={20} max={120} value={linkFontSize} onChange={e => setLinkFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>موضع: {Math.round(linkNameY * 100)}%</label>
                                            <input type="range" min={20} max={90} value={Math.round(linkNameY * 100)} onChange={e => setLinkNameY(Number(e.target.value) / 100)} style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>لون النص</label>
                                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                            {['#ffffff', '#f1c40f', '#e74c3c', '#2ecc71', '#1a1a2e', '#b8860b'].map(c => (
                                                <div key={c} onClick={() => setLinkNameColor(c)} style={{
                                                    width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer',
                                                    border: (linkNameColor || selectedTemplate.textColor || '#ffffff') === c ? '3px solid #7c3aed' : '2px solid #e2e8f0',
                                                }} />
                                            ))}
                                            <input type="color" value={linkNameColor || '#ffffff'} onChange={e => setLinkNameColor(e.target.value)} style={{ width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', border: 'none', padding: 0 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={handleCreateLink} disabled={isDepleted} style={{
                            padding: '14px 28px', background: isDepleted ? '#f1f5f9' : C.accent, color: isDepleted ? C.muted : '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: f.font,
                        }}>
                            أنشئ الرابط العام
                        </button>
                    </div>
                </div>
            ) : (
                <div style={cardStyle}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#166534', fontWeight: 700, marginBottom: 8 }}>رابط مناسبة {occasionName}</div>
                        <div style={{ fontSize: 14, color: C.text, fontWeight: 700, wordBreak: 'break-all', direction: 'ltr', background: '#fff', padding: '10px 14px', borderRadius: 10, marginBottom: 14, border: `1px solid ${C.border}` }}>
                            {generatedLink}
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => { navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                                style={{ padding: '10px 20px', background: copied ? C.green : C.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: f.font }}>
                                {copied ? 'تم النسخ' : 'نسخ الرابط'}
                            </button>
                            <a href={`https://wa.me/?text=${encodeURIComponent(`${greetingText || `بطاقة تهنئة من ${company.name}`}\n\nافتح الرابط واكتب اسمك:\n${generatedLink}`)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#25D366', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                                شارك على واتساب
                            </a>
                        </div>
                    </div>
                    <button onClick={() => { setStep(1); setGeneratedLink(''); setIndividualLinks([]) }}
                        style={{ padding: '10px 20px', background: '#f1f5f9', color: C.muted, border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: f.font }}>
                        إنشاء رابط جديد
                    </button>
                </div>
            )}

            {/* ── Individual Employee Links ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 'clamp(22px,4vw,32px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0 }}>روابط فردية لكل موظف</h3>
                    <button onClick={() => setShowIndividual(v => !v)} style={{ padding: '6px 14px', background: '#f1f5f9', color: C.muted, border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: f.font }}>
                        {showIndividual ? 'إخفاء' : 'إظهار'}
                    </button>
                </div>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: showIndividual ? 18 : 0, lineHeight: 1.8 }}>
                    كل موظف يحصل على رابطه الخاص مع اسمه مُعبّأ مسبقاً
                </p>
                {showIndividual && (
                    <>
                        {!selectedTemplate && <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13, color: C.yellow, fontWeight: 700, marginBottom: 14 }}>اختر قالباً في قسم إنشاء الرابط أعلى أولاً</div>}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>أسماء الموظفين (كل اسم في سطر)</label>
                            <textarea value={employeeNames} onChange={e => setEmployeeNames(e.target.value)} placeholder={'محمد العمري\nفاطمة السعيد\nأحمد الزهراني'} rows={6} dir="rtl"
                                style={{ width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f.font, background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                        </div>
                        <button onClick={handleGenerateIndividual} style={{ padding: '12px 24px', background: C.accent, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: f.font, marginBottom: 16 }}>
                            توليد روابط فردية
                        </button>
                        {individualLinks.length > 0 && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{individualLinks.length} رابط جاهز</span>
                                    <button onClick={handleCopyAll} style={{ padding: '8px 16px', background: allCopied ? C.green : '#f1f5f9', color: allCopied ? '#fff' : C.muted, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: f.font }}>
                                        {allCopied ? 'تم النسخ' : 'نسخ الكل'}
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                                    {individualLinks.map((l, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: `1px solid ${C.border}` }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: '0 0 120px' }}>{l.name}</span>
                                            <span style={{ fontSize: 11, color: C.muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'ltr' }}>{l.url}</span>
                                            <button onClick={() => navigator.clipboard.writeText(l.url).then(() => toast.success('تم النسخ'))}
                                                style={{ padding: '4px 10px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: f.font, flexShrink: 0 }}>
                                                نسخ
                                            </button>
                                            <a href={`https://wa.me/?text=${encodeURIComponent(`${l.url}`)}`} target="_blank" rel="noopener noreferrer"
                                                style={{ padding: '4px 10px', background: '#25D366', color: '#fff', borderRadius: 6, fontSize: 11, textDecoration: 'none', fontWeight: 700, flexShrink: 0 }}>
                                                واتساب
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

/* ════════════ BRANDING SETTINGS ════════════ */
function BrandingSettings({ company, token, updateCompanyData }) {
    const [logo, setLogo] = useState(company.logoUrl || '')
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState(company.logoUrl || '')
    const [primaryColor, setPrimaryColor] = useState(company.primaryColor || '#7c3aed')
    const [companyName, setCompanyName] = useState(company.name || '')
    const [isSaving, setIsSaving] = useState(false)

    const handleLogoSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { toast.error('يرجى رفع صورة فقط'); return }
        if (file.size > 5 * 1024 * 1024) { toast.error('الحد الأقصى 5MB'); return }
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const formData = new FormData()
            if (logoFile) formData.append('logo', logoFile)
            formData.append('primaryColor', primaryColor)
            if (companyName.trim()) formData.append('companyName', companyName.trim())

            const response = await updateCompanyProfile(token, formData)
            if (response.success && response.data) {
                setLogo(response.data.logoUrl || logo)
                setLogoFile(null)
                updateCompanyData({ ...response.data, primaryColor, name: companyName })
                toast.success('تم حفظ التغييرات بنجاح')
            }
        } catch (error) {
            toast.error(error.message || 'حدث خطأ أثناء الحفظ')
        } finally {
            setIsSaving(false)
        }
    }

    const inputStyle = { width: '100%', padding: '12px 16px', fontSize: 14, fontFamily: f.font, background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, outline: 'none', boxSizing: 'border-box' }

    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 'clamp(22px,4vw,32px)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 4 }}>إعدادات هوية الشركة</h3>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>التغييرات تنعكس على كل البطاقات الجديدة</p>

            <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
                {/* Name */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>اسم الشركة</label>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)} dir="rtl" style={inputStyle} />
                </div>

                {/* Logo */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10 }}>شعار الشركة</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#f8fafc', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {logoPreview
                                ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                : <span style={{ fontSize: 12, color: C.muted, textAlign: 'center', padding: 4 }}>لا يوجد شعار</span>
                            }
                        </div>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#f1f5f9', color: C.text, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            <input type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />
                            اختر صورة
                        </label>
                        {logoPreview && (
                            <button onClick={() => { setLogoPreview(''); setLogoFile(null) }} style={{ padding: '10px 16px', background: '#fef2f2', color: C.red, border: 'none', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontFamily: f.font }}>
                                حذف
                            </button>
                        )}
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10 }}>اللون الرئيسي</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                            style={{ width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`, cursor: 'pointer', padding: 2 }} />
                        <span style={{ fontSize: 14, color: C.muted, fontFamily: 'monospace', direction: 'ltr' }}>{primaryColor}</span>
                        {/* Color presets */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['#7c3aed', '#059669', '#2563eb', '#dc2626', '#d97706', '#0f172a'].map(c => (
                                <button key={c} onClick={() => setPrimaryColor(c)} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: primaryColor === c ? `3px solid ${C.text}` : '2px solid transparent', cursor: 'pointer', padding: 0 }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10 }}>معاينة</label>
                    <div style={{ background: '#f8fafc', borderRadius: 14, padding: 20, border: `2px solid ${primaryColor}30`, textAlign: 'center' }}>
                        {logoPreview && <img src={logoPreview} style={{ width: 44, height: 44, objectFit: 'contain', margin: '0 auto 10px', display: 'block' }} alt="" />}
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4 }}>{companyName}</div>
                        <div style={{ fontSize: 12, color: primaryColor, fontWeight: 700 }}>بطاقة تهنئة نموذجية</div>
                    </div>
                </div>

                {/* Save */}
                <button onClick={handleSave} disabled={isSaving} style={{
                    padding: '14px 32px', background: isSaving ? '#f1f5f9' : primaryColor, color: isSaving ? C.muted : '#fff', border: 'none',
                    borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: f.font,
                }}>
                    {isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </div>
    )
}



