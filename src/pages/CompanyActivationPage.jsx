import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'

export default function CompanyActivationPage() {
    const navigate = useNavigate()
    const { registerFree, isAuthenticated } = useCompany()

    const [form, setForm] = useState({ companyName: '', email: '', password: '' })
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (isAuthenticated) navigate('/company/dashboard')
    }, [isAuthenticated, navigate])

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        background: '#171717',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 200ms ease',
        fontFamily: "'Tajawal', sans-serif",
        boxSizing: 'border-box',
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.companyName.trim()) { setErrorMsg('اسم الشركة مطلوب'); return }
        if (!form.email.trim()) { setErrorMsg('البريد الإلكتروني مطلوب'); return }
        if (form.password.length < 6) { setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }

        setStatus('loading')
        setErrorMsg('')

        const result = await registerFree(form.companyName.trim(), form.email.trim(), form.password)

        if (result.success) {
            setStatus('success')
            setTimeout(() => navigate('/company/dashboard'), 2500)
        } else {
            setStatus('error')
            setErrorMsg(result.error)
            setStatus('idle')
        }
    }

    return (
        <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <section style={{ background: '#171717', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: 480 }}>

                    {/* Back */}
                    <button
                        onClick={() => navigate('/companies')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', marginBottom: 32, fontFamily: "'Tajawal',sans-serif" }}
                    >
                        <ArrowRight size={16} />
                        العودة
                    </button>

                    {/* Icon */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#6366f1,#7c3aed)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
                            <Building2 size={34} color="#fff" />
                        </div>
                    </div>

                    <h1 style={{ fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10, textAlign: 'center' }}>
                        سجّل شركتك مجاناً
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.7, textAlign: 'center' }}>
                        اسم الشركة + البريد + كلمة المرور — وابدأ فوراً بلا رسوم
                    </p>

                    {/* Card */}
                    <div style={{ background: '#1e1e2e', borderRadius: 22, border: '1px solid rgba(255,255,255,0.07)', padding: '32px 28px' }}>

                        {status === 'success' ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <CheckCircle2 size={32} color="#22c55e" />
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>🎉 مرحباً بكم في سَلِّم!</h3>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                                    تم إنشاء حساب شركتكم بنجاح.
                                    <br />سيصلكم إيميل ترحيبي بعيد الفطر المبارك 🌙
                                    <br />جاري تحويلكم إلى لوحة التحكم...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                                {errorMsg && (
                                    <div style={{ padding: '14px 18px', background: 'rgba(239,68,68,0.1)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <AlertCircle size={16} color="#fca5a5" />
                                        <p style={{ fontSize: 14, color: '#fca5a5', margin: 0 }}>{errorMsg}</p>
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a3a3a3', marginBottom: 8 }}>اسم الشركة أو الجهة</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="مثال: شركة الفجر للتقنية"
                                        value={form.companyName}
                                        onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                                        style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a3a3a3', marginBottom: 8 }}>البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="hr@company.com"
                                        dir="ltr"
                                        value={form.email}
                                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a3a3a3', marginBottom: 8 }}>كلمة المرور</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="6 أحرف على الأقل"
                                        dir="ltr"
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                        style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    style={{
                                        width: '100%', padding: '15px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff',
                                        fontSize: 16, fontWeight: 800, borderRadius: 14, border: 'none',
                                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                        fontFamily: "'Tajawal',sans-serif", boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                                        opacity: status === 'loading' ? 0.8 : 1,
                                    }}
                                >
                                    {status === 'loading' ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                            جاري إنشاء الحساب...
                                        </span>
                                    ) : '🎉 سجّل مجاناً'}
                                </button>

                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
                                    ✅ مجاني بالكامل · بدون رسوم · بدون كود تفعيل
                                </p>
                            </form>
                        )}
                    </div>

                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <a href="/company-login" style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                            لديّ حساب — تسجيل الدخول
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
