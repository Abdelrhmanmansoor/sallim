import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompany } from '../context/CompanyContext'

const FONT = "'Tajawal', sans-serif"

export default function CompanyLoginPage() {
  const navigate = useNavigate()
  const { login } = useCompany()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email.trim(), password)
      if (result.success) {
        navigate('/company/dashboard')
      } else {
        setError(result.error || 'البريد أو كلمة المرور غير صحيحة')
      }
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', padding: '13px 16px', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: 12, color: '#111827',
    fontSize: 14, fontFamily: FONT, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(124,58,237,0.25)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><polyline points="16 3 12 7 8 3"/></svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>بورتال الشركات</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px,5vw,36px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 20, fontSize: 14, color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>البريد الإلكتروني</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="example@company.com" dir="ltr"
                style={inp}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>كلمة المرور</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={inp}
                onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '14px', background: loading ? '#e9d5ff' : '#7c3aed', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading && <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />}
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f4f8' }}>
            <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '0 0 12px' }}>ليس لديك حساب بعد؟</p>
            <Link to="/company-activation" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', borderRadius: 12, textAlign: 'center', textDecoration: 'none', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
              🎉 أنشئ حساباً مجاناً — 500 رسالة ببلاش
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9ca3af' }}>
          مشكلة في الدخول؟{' '}
          <a href="https://wa.me/201007835547" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>تواصل معنا</a>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
