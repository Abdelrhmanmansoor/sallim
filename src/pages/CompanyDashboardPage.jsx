import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompany } from '../context/CompanyContext'
import { updateCompanyProfile, getTemplates } from '../utils/api'
import { useEditorStore } from '../store'
import toast, { Toaster } from 'react-hot-toast'
import JSZip from 'jszip'

const WHATSAPP_NUMBER = '201007835547'
const ds = { font: "'Tajawal', sans-serif" }

export default function CompanyDashboardPage() {
    const { company, token, logout, isAuthenticated, updateCompanyData } = useCompany()
    const navigate = useNavigate()
    const [activeView, setActiveView] = useState('home')
    const [showWelcome, setShowWelcome] = useState(false)

    // Check for first visit after activation
    useEffect(() => {
        if (isAuthenticated && company) {
            const welcomed = sessionStorage.getItem(`sallim_company_welcomed_${company._id || company.id}`)
            if (!welcomed) {
                setShowWelcome(true)
            }
        }
    }, [isAuthenticated, company])

    const dismissWelcome = () => {
        setShowWelcome(false)
        sessionStorage.setItem(`sallim_company_welcomed_${company?._id || company?.id}`, '1')
    }

    if (!isAuthenticated || !company) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ds.font, direction: 'rtl' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 16 }}>يجب تسجيل الدخول كشركة للوصول لهذه الصفحة</p>
                    <Link to="/company-login" style={{ display: 'inline-block', padding: '14px 32px', background: '#fff', color: '#0f172a', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        )
    }

    const totalCredits = company.subscription?.totalCredits || company.totalCredits || 100
    const usedCredits = company.subscription?.usedCredits || company.usedCredits || 0
    const remaining = Math.max(0, totalCredits - usedCredits)
    const usagePercent = totalCredits > 0 ? Math.round((usedCredits / totalCredits) * 100) : 0
    const isDepleted = remaining <= 0
    const isLow = usagePercent >= 80 && !isDepleted

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: ds.font, direction: 'rtl' }}>
            <Toaster position="top-center" />

            {/* Welcome Modal */}
            {showWelcome && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: 24 }}>
                    <div style={{ background: '#1e293b', borderRadius: 28, padding: 'clamp(32px, 5vw, 48px)', maxWidth: 480, width: '100%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <span style={{ fontSize: 40 }}>🎉</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                            أهلاً بك في منصة سلّم للمؤسسات
                        </h2>
                        <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.8, marginBottom: 8 }}>
                            باقتك المفعّلة:
                        </p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '12px 28px', marginBottom: 32 }}>
                            <span style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>{totalCredits}</span>
                            <span style={{ fontSize: 15, color: '#6ee7b7', fontWeight: 700 }}>بطاقة متاحة</span>
                        </div>
                        <br />
                        <button onClick={dismissWelcome} style={{
                            padding: '16px 48px', background: '#fff', color: '#0f172a', border: 'none', borderRadius: 16,
                            fontSize: 17, fontWeight: 900, cursor: 'pointer', fontFamily: ds.font, transition: 'all 0.2s',
                        }}>
                            ابدأ الآن
                        </button>
                    </div>
                </div>
            )}

            {/* Header with Credit Counter */}
            <header style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {company.logoUrl
                                ? <img src={company.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                : <span style={{ fontSize: 20 }}>🏢</span>
                            }
                        </div>
                        <div>
                            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{company.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: isDepleted ? '#ef4444' : '#10b981' }} />
                                <span style={{ fontSize: 12, color: '#64748b' }}>{isDepleted ? 'الرصيد نفد' : 'حساب نشط'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Credit Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: isDepleted ? '#ef4444' : isLow ? '#f59e0b' : '#10b981' }}>
                                {remaining}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>بطاقة متبقية</div>
                        </div>
                        <button onClick={logout} style={{
                            padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font,
                        }}>
                            خروج
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ maxWidth: 900, margin: '14px auto 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{usedCredits} بطاقة مستخدمة من أصل {totalCredits}</span>
                        <span style={{ fontSize: 11, color: isDepleted ? '#ef4444' : isLow ? '#f59e0b' : '#64748b', fontWeight: 700 }}>{usagePercent}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 100, transition: 'width 0.6s ease',
                            width: `${Math.min(usagePercent, 100)}%`,
                            background: isDepleted ? '#ef4444' : isLow ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #059669)',
                        }} />
                    </div>
                </div>
            </header>

            {/* Low Credit Warning */}
            {isLow && !isDepleted && (
                <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 24px' }}>
                    <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>رصيدك على وشك النفاد</div>
                            <div style={{ fontSize: 12, color: '#fcd34d' }}>تبقى {remaining} بطاقة فقط. تواصل معنا لتجديد الباقة.</div>
                        </div>
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، أرغب بتجديد باقة شركتي في منصة سلّم')}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ padding: '8px 18px', background: '#25D366', color: '#fff', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            تجديد عبر واتساب
                        </a>
                    </div>
                </div>
            )}

            {/* Depleted Warning */}
            {isDepleted && (
                <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 24px' }}>
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 20 }}>🚫</span>
                        <div style={{ flex: '1 1 200px' }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#fca5a5' }}>نفد رصيد البطاقات</div>
                            <div style={{ fontSize: 12, color: '#fda4af' }}>تواصل معنا لتجديد الباقة والاستمرار في إرسال البطاقات</div>
                        </div>
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً، نفد رصيد شركتي وأرغب بتجديد الباقة')}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ padding: '12px 24px', background: '#25D366', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            تواصل معنا عبر واتساب
                        </a>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ maxWidth: 900, margin: '24px auto 0', padding: '0 24px' }}>
                <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4 }}>
                    {[
                        { id: 'home', label: 'الرئيسية', icon: '🏠' },
                        { id: 'cards', label: 'أنشئ بطاقات', icon: '🎴' },
                        { id: 'link', label: 'رابط الموظفين', icon: '🔗' },
                        { id: 'settings', label: 'الهوية', icon: '⚙️' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveView(tab.id)} style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            padding: '12px 8px', borderRadius: 11, border: 'none', cursor: 'pointer',
                            fontFamily: ds.font, fontSize: 13, fontWeight: 700,
                            background: activeView === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeView === tab.id ? '#fff' : '#64748b',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: 16 }}>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px 60px' }}>
                {activeView === 'home' && <HomeView isDepleted={isDepleted} setActiveView={setActiveView} company={company} />}
                {activeView === 'cards' && <BatchCardsView company={company} token={token} isDepleted={isDepleted} remaining={remaining} />}
                {activeView === 'link' && <EmployeeLinkView company={company} token={token} isDepleted={isDepleted} />}
                {activeView === 'settings' && <BrandingSettings company={company} token={token} updateCompanyData={updateCompanyData} />}
            </div>
        </div>
    )
}

/* ════════════ HOME VIEW ════════════ */
function HomeView({ isDepleted, setActiveView, company }) {
    return (
        <div style={{ display: 'grid', gap: 20 }}>
            {/* Card 1: Create Cards */}
            <button onClick={() => !isDepleted && setActiveView('cards')} style={{
                background: isDepleted ? '#1e293b' : 'linear-gradient(135deg, #1e293b, #334155)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 'clamp(28px, 5vw, 40px)',
                textAlign: 'right', cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: ds.font,
                opacity: isDepleted ? 0.5 : 1, transition: 'all 0.3s',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 28 }}>🎴</span>
                    </div>
                    <div>
                        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>أنشئ بطاقات الآن</h3>
                        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>ارفع أسماء الموظفين → اختر القالب → حمّل ZIP</p>
                    </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: isDepleted ? '#334155' : '#10b981', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 800 }}>
                    {isDepleted ? 'الرصيد نفد' : 'ابدأ التصميم الجماعي'}
                </div>
            </button>

            {/* Card 2: Employee Link */}
            <button onClick={() => !isDepleted && setActiveView('link')} style={{
                background: isDepleted ? '#1e293b' : 'linear-gradient(135deg, #1e293b, #334155)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 'clamp(28px, 5vw, 40px)',
                textAlign: 'right', cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: ds.font,
                opacity: isDepleted ? 0.5 : 1, transition: 'all 0.3s',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 28 }}>🔗</span>
                    </div>
                    <div>
                        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>رابط موظفيك</h3>
                        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>أنشئ رابط مناسبة وشاركه — كل موظف يكتب اسمه ويحمّل بطاقته</p>
                    </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: isDepleted ? '#334155' : '#6366f1', color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 800 }}>
                    {isDepleted ? 'الرصيد نفد' : 'أنشئ رابط مناسبة'}
                </div>
            </button>
        </div>
    )
}

/* ════════════ BATCH CARDS VIEW (Stepper) ════════════ */
function BatchCardsView({ company, token, isDepleted, remaining }) {
    const [step, setStep] = useState(1)
    const [names, setNames] = useState([])
    const [nameInput, setNameInput] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [templates, setTemplates] = useState([])
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [zipReady, setZipReady] = useState(false)
    const [zipUrl, setZipUrl] = useState(null)

    useEffect(() => {
        getTemplates().then(res => {
            if (res.success && res.data) setTemplates(res.data)
        }).catch(() => {}).finally(() => setIsLoadingTemplates(false))
    }, [])

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const parsed = ev.target.result.split(/[\n,;]+/).map(n => n.trim()).filter(n => n.length > 0)
            setNames(parsed)
            setNameInput(parsed.join('\n'))
            toast.success(`تم رصد ${parsed.length} اسم`)
        }
        reader.readAsText(file)
        e.target.value = ''
    }

    const handleTextChange = (val) => {
        setNameInput(val)
        const parsed = val.split('\n').map(n => n.trim()).filter(n => n.length > 0)
        setNames(parsed)
    }

    const overLimit = names.length > remaining

    const handleGenerate = () => {
        // Navigate to editor with batch mode and pre-loaded data
        const store = useEditorStore.getState()
        store.setBatchNames(names)
        if (selectedTemplate) store.setTemplate(selectedTemplate.id)
        window.location.href = `/editor?mode=batch&company=1`
    }

    const stepperItems = [
        { num: 1, label: 'الأسماء' },
        { num: 2, label: 'القالب' },
        { num: 3, label: 'التوليد' },
    ]

    return (
        <div>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                {stepperItems.map((s, i) => (
                    <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div onClick={() => s.num <= step && setStep(s.num)} style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                            borderRadius: 12, cursor: s.num <= step ? 'pointer' : 'default',
                            background: step === s.num ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: `1px solid ${step >= s.num ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                        }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, fontWeight: 900,
                                background: step >= s.num ? '#10b981' : 'rgba(255,255,255,0.06)',
                                color: step >= s.num ? '#fff' : '#64748b',
                            }}>{step > s.num ? '✓' : s.num}</div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: step >= s.num ? '#fff' : '#64748b' }}>{s.label}</span>
                        </div>
                        {i < stepperItems.length - 1 && <div style={{ width: 24, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Names */}
            {step === 1 && (
                <div style={{ background: '#1e293b', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 20 }}>أدخل أسماء المستلمين</h3>

                    {/* File Upload */}
                    <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
                        padding: 18, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)',
                        borderRadius: 16, cursor: 'pointer', marginBottom: 20, color: '#94a3b8', fontSize: 14, fontWeight: 700,
                    }}>
                        <input type="file" accept=".txt,.csv,.xlsx" style={{ display: 'none' }} onChange={handleFileUpload} />
                        <span style={{ fontSize: 20 }}>📄</span>
                        ارفع ملف CSV أو Excel (drag & drop)
                    </label>

                    <div style={{ marginBottom: 12, fontSize: 13, color: '#64748b', fontWeight: 600 }}>أو اكتب الأسماء يدوياً (كل اسم في سطر)</div>
                    <textarea
                        dir="rtl" rows={8}
                        placeholder={'محمد\nأحمد\nفاطمة\nنوره'}
                        value={nameInput}
                        onChange={(e) => handleTextChange(e.target.value)}
                        style={{
                            width: '100%', padding: 16, fontSize: 15, fontFamily: ds.font,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 14, color: '#fff', resize: 'vertical', outline: 'none',
                            minHeight: 180, lineHeight: 2,
                        }}
                    />

                    {/* Count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <div style={{
                            padding: '8px 18px', borderRadius: 10,
                            background: overLimit ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                            color: overLimit ? '#fca5a5' : '#6ee7b7',
                            fontSize: 13, fontWeight: 800,
                        }}>
                            {names.length > 0 ? `تم رصد ${names.length} اسم` : 'لم يتم إدخال أسماء'}
                            {overLimit && ` — يتجاوز الرصيد (${remaining})`}
                        </div>
                        <button
                            onClick={() => names.length > 0 && !overLimit && setStep(2)}
                            disabled={names.length === 0 || overLimit}
                            style={{
                                padding: '12px 28px', background: names.length > 0 && !overLimit ? '#10b981' : '#334155',
                                color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
                                cursor: names.length > 0 && !overLimit ? 'pointer' : 'not-allowed', fontFamily: ds.font,
                            }}
                        >
                            التالي ←
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Template Selection */}
            {step === 2 && (
                <div style={{ background: '#1e293b', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 20 }}>اختر القالب</h3>

                    {isLoadingTemplates ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>جارٍ تحميل القوالب...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
                            {templates.map(t => (
                                <button key={t.id} onClick={() => setSelectedTemplate(t)} style={{
                                    position: 'relative', aspectRatio: '9/16', borderRadius: 16, overflow: 'hidden',
                                    border: selectedTemplate?.id === t.id ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.08)',
                                    cursor: 'pointer', padding: 0, background: '#0f172a', transition: 'all 0.2s',
                                    transform: selectedTemplate?.id === t.id ? 'scale(1.03)' : 'scale(1)',
                                }}>
                                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                    {selectedTemplate?.id === t.id && (
                                        <div style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>✓</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Preview */}
                    {selectedTemplate && (
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>معاينة بالاسم الأول: <strong style={{ color: '#fff' }}>{names[0]}</strong></div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font }}>
                            → السابق
                        </button>
                        <button
                            onClick={() => selectedTemplate && setStep(3)}
                            disabled={!selectedTemplate}
                            style={{
                                padding: '12px 28px', background: selectedTemplate ? '#10b981' : '#334155',
                                color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
                                cursor: selectedTemplate ? 'pointer' : 'not-allowed', fontFamily: ds.font,
                            }}
                        >
                            التالي ←
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Generate */}
            {step === 3 && (
                <div style={{ background: '#1e293b', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>جاهز للتوليد</h3>
                    <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
                        {names.length} بطاقة بقالب "{selectedTemplate?.name || 'مختار'}"
                    </p>

                    <button onClick={handleGenerate} disabled={generating} style={{
                        padding: '18px 48px', background: generating ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff', border: 'none', borderRadius: 16, fontSize: 18, fontWeight: 900,
                        cursor: generating ? 'not-allowed' : 'pointer', fontFamily: ds.font,
                        boxShadow: generating ? 'none' : '0 8px 24px rgba(16,185,129,0.3)',
                    }}>
                        {generating ? 'جارٍ التوليد...' : `ولّد ${names.length} بطاقة`}
                    </button>

                    {generating && (
                        <div style={{ marginTop: 28 }}>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', maxWidth: 400, margin: '0 auto' }}>
                                <div style={{ height: '100%', background: '#10b981', borderRadius: 100, transition: 'width 0.3s', width: `${progress}%` }} />
                            </div>
                            <p style={{ fontSize: 13, color: '#64748b', marginTop: 10 }}>{progress}%</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                        <button onClick={() => setStep(2)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font }}>
                            → العودة لاختيار القالب
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════════ EMPLOYEE LINK VIEW ════════════ */
function EmployeeLinkView({ company, token, isDepleted }) {
    const [occasionName, setOccasionName] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const [copied, setCopied] = useState(false)

    const companySlug = company.slug || company.name?.toLowerCase().replace(/\s+/g, '-') || 'company'

    const handleCreateLink = () => {
        if (!occasionName.trim()) {
            toast.error('اكتب اسم المناسبة')
            return
        }
        // Generate a link (in production this would call the API)
        const linkId = Math.random().toString(36).substring(2, 8)
        const link = `${window.location.origin}/greet/${companySlug}/${linkId}`
        setGeneratedLink(link)
        toast.success('تم إنشاء الرابط بنجاح')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div style={{ background: '#1e293b', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>إنشاء رابط مناسبة للموظفين</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28, lineHeight: 1.8 }}>
                أنشئ رابط خاص وشاركه مع موظفيك — كل واحد يكتب اسمه ويحمّل بطاقته. كل بطاقة تُحسب من رصيد شركتك.
            </p>

            {!generatedLink ? (
                <div style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>اسم المناسبة</label>
                        <input type="text" value={occasionName} onChange={(e) => setOccasionName(e.target.value)}
                            placeholder="مثال: عيد الفطر 2026" dir="rtl"
                            style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff', fontSize: 15, fontFamily: ds.font, outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>تاريخ انتهاء الرابط</label>
                        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                            style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff', fontSize: 15, fontFamily: ds.font, outline: 'none' }}
                        />
                    </div>
                    <button onClick={handleCreateLink} disabled={isDepleted} style={{
                        padding: '16px 32px', background: isDepleted ? '#334155' : '#6366f1', color: '#fff',
                        border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 900, cursor: isDepleted ? 'not-allowed' : 'pointer', fontFamily: ds.font,
                    }}>
                        أنشئ الرابط
                    </button>
                </div>
            ) : (
                <div>
                    {/* Generated Link */}
                    <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#6ee7b7', marginBottom: 8, fontWeight: 700 }}>رابط المناسبة الخاص بشركتك</div>
                        <div style={{ fontSize: 15, color: '#fff', fontWeight: 800, wordBreak: 'break-all', direction: 'ltr', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
                            {generatedLink}
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={handleCopy} style={{
                                padding: '12px 24px', background: copied ? '#10b981' : '#fff', color: copied ? '#fff' : '#0f172a',
                                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: ds.font,
                            }}>
                                {copied ? '✓ تم النسخ!' : '📋 نسخ الرابط'}
                            </button>
                            <a href={`https://wa.me/?text=${encodeURIComponent(`🎉 بطاقة تهنئة من ${company.name}\n\nافتح الرابط واكتب اسمك:\n${generatedLink}`)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#25D366', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                                شارك على واتساب
                            </a>
                        </div>
                    </div>

                    <button onClick={() => { setGeneratedLink(''); setOccasionName(''); setExpiryDate('') }}
                        style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font }}>
                        إنشاء رابط جديد
                    </button>
                </div>
            )}
        </div>
    )
}

/* ════════════ BRANDING SETTINGS ════════════ */
function BrandingSettings({ company, token, updateCompanyData }) {
    const [logo, setLogo] = useState(company.logoUrl || '')
    const [isUploading, setIsUploading] = useState(false)
    const [primaryColor, setPrimaryColor] = useState(company.primaryColor || '#6366f1')

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { toast.error('يرجى رفع صورة فقط'); return }
        if (file.size > 5 * 1024 * 1024) { toast.error('الحد الأقصى 5MB'); return }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('logo', file)
            const response = await updateCompanyProfile(token, formData)
            if (response.success && response.data) {
                setLogo(response.data.logoUrl)
                updateCompanyData(response.data)
                toast.success('تم تحديث الشعار')
            }
        } catch (error) {
            toast.error(error.message || 'حدث خطأ')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div style={{ background: '#1e293b', borderRadius: 24, padding: 'clamp(24px, 4vw, 36px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>إعدادات هوية الشركة</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>التغييرات تنعكس على كل البطاقات الجديدة</p>

            <div style={{ display: 'grid', gap: 28, maxWidth: 480 }}>
                {/* Logo Upload */}
                <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>شعار الشركة</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 20,
                            background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        }}>
                            {logo ? <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
                                : <span style={{ fontSize: 28, opacity: 0.3 }}>🏢</span>}
                        </div>
                        <label style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0',
                            borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: isUploading ? 'not-allowed' : 'pointer',
                            opacity: isUploading ? 0.5 : 1,
                        }}>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} disabled={isUploading} />
                            {isUploading ? '⏳ جاري الرفع...' : '📷 تغيير الشعار'}
                        </label>
                    </div>
                </div>

                {/* Color Picker */}
                <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>اللون الرئيسي</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                            style={{ width: 48, height: 48, borderRadius: 12, border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }}
                        />
                        <span style={{ fontSize: 14, color: '#94a3b8', fontFamily: 'monospace', direction: 'ltr' }}>{primaryColor}</span>
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12 }}>معاينة</label>
                    <div style={{
                        background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24,
                        border: `2px solid ${primaryColor}30`, textAlign: 'center',
                    }}>
                        {logo && <img src={logo} style={{ width: 48, height: 48, objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} alt="" />}
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{company.name}</div>
                        <div style={{ fontSize: 12, color: primaryColor, fontWeight: 700 }}>بطاقة تهنئة نموذجية</div>
                    </div>
                </div>

                {/* Save */}
                <button style={{
                    padding: '14px 32px', background: primaryColor, color: '#fff', border: 'none',
                    borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: ds.font,
                }}>
                    حفظ التغييرات
                </button>
            </div>
        </div>
    )
}

