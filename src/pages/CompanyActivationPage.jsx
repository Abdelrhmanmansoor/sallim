import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Building2, ArrowLeft, CheckCircle2, AlertCircle, Key } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'

export default function CompanyActivationPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { activate, isAuthenticated } = useCompany()

    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        code: '',
        password: '',
        confirmPassword: ''
    })

    const [status, setStatus] = useState('idle')
    const [errorMsg, setErrorMsg] = useState('')

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/company/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleActivate = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('كلمات المرور غير متطابقة')
            return
        }

        if (formData.password.length < 6) {
            setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            return
        }

        setStatus('loading')
        setErrorMsg('')

        const result = await activate(formData.email, formData.code, formData.password)

        if (result.success) {
            setStatus('success')
            setTimeout(() => navigate('/company/dashboard'), 3000)
        } else {
            setStatus('error')
            setErrorMsg(result.error)
        }
    }

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* HERO - Same style as LandingPage */}
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
                        background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
                    }}
                >
                    {/* Content */}
                    <div
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            maxWidth: '480px',
                            margin: '0 auto',
                            padding: '120px 24px',
                            textAlign: 'center',
                        }}
                    >
                        {/* Back Button */}
                        <div style={{ textAlign: 'right', marginBottom: '32px' }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                }}
                            >
                                <ArrowLeft size={16} />
                                العودة للرئيسية
                            </button>
                        </div>

                        {/* Icon */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px',
                                marginBottom: '32px',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <Key size={36} color="#fff" />
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: 'clamp(32px, 5vw, 48px)',
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.2,
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            تفعيل حساب الشركة
                        </h1>

                        {/* Subtitle */}
                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '48px',
                                lineHeight: 1.6,
                            }}
                        >
                            أدخل كود التفعيل المرسل إلى بريدك الإلكتروني لإعداد حسابك
                        </p>

                        {/* Form Card */}
                        <div
                            style={{
                                padding: '32px',
                                background: '#262626',
                                borderRadius: '20px',
                                border: '1px solid ' + (status === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'),
                                textAlign: 'right',
                            }}
                        >
                            {status === 'success' ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'rgba(34,197,94,0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                        }}
                                    >
                                        <CheckCircle2 size={32} color="#22c55e" />
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: '24px',
                                            fontWeight: 700,
                                            color: '#fff',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        تم التفعيل بنجاح!
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}
                                    >
                                        جاري تحويلك إلى لوحة التحكم...
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleActivate}>
                                    {/* Error Message */}
                                    {errorMsg && (
                                        <div
                                            style={{
                                                padding: '16px 20px',
                                                background: 'rgba(239,68,68,0.1)',
                                                borderRadius: '12px',
                                                marginBottom: '24px',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                            }}
                                        >
                                            <AlertCircle size={18} color="#fca5a5" />
                                            <p
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#fca5a5',
                                                    margin: 0,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {errorMsg}
                                            </p>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#a3a3a3',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            البريد الإلكتروني للشركة
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            readOnly={!!searchParams.get('email')}
                                            value={formData.email}
                                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                            dir="ltr"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: '#171717',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 200ms ease',
                                                opacity: searchParams.get('email') ? 0.5 : 1,
                                            }}
                                            onFocus={(e) => {
                                                if (!searchParams.get('email')) {
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!searchParams.get('email')) {
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Code */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#a3a3a3',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            كود التفعيل
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            dir="ltr"
                                            placeholder="مثال: A7B9F1"
                                            value={formData.code}
                                            onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: '#171717',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '18px',
                                                outline: 'none',
                                                transition: 'all 200ms ease',
                                                textAlign: 'center',
                                                letterSpacing: '0.2em',
                                                fontFamily: 'monospace',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                            }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#a3a3a3',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            كلمة المرور الجديدة
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="•••••••"
                                            value={formData.password}
                                            onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                                            dir="ltr"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: '#171717',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 200ms ease',
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                            }}
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#a3a3a3',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            تأكيد كلمة المرور
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="•••••••"
                                            value={formData.confirmPassword}
                                            onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                                            dir="ltr"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: '#171717',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 200ms ease',
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                            }}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        style={{
                                            width: '100%',
                                            padding: '14px 28px',
                                            background: '#fff',
                                            color: '#171717',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            borderRadius: '12px',
                                            border: 'none',
                                            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                            transition: 'all 200ms ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (status !== 'loading') {
                                                e.currentTarget.style.transform = 'translateY(-2px)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (status !== 'loading') {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            }
                                        }}
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid rgba(23,23,23,0.1)',
                                                    borderTopColor: '#171717',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite',
                                                    margin: '0 auto',
                                                }} />
                                                <style>{`
                                                    @keyframes spin {
                                                        to { transform: rotate(360deg); }
                                                    }
                                                `}</style>
                                            </>
                                        ) : (
                                            'تفعيل الدخول'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Help Text */}
                        <div style={{ marginTop: '32px' }}>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: 'rgba(255,255,255,0.4)',
                                    marginBottom: '8px',
                                }}
                            >
                                تحتاج مساعدة؟ تواصل مع فريق الدعم
                            </p>
                            <a
                                href="mailto:support@sallim.co"
                                style={{
                                    fontSize: '14px',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                support@sallim.co
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}