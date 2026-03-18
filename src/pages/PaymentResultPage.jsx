import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [state, setState] = useState('checking')
  const [message, setMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const [openingNow, setOpeningNow] = useState(false)
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (verifiedRef.current) return
    verifiedRef.current = true

    const params = Object.fromEntries(searchParams.entries())
    const isSuccess = params.success === 'true'
    const transactionId = params.id

    if (!isSuccess) {
      setState('failure')
      setMessage('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
      return
    }

    // Verify HMAC + get session redirect URL from backend
    fetch(`${apiBase}/api/v1/paymob-flash/verify-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success) {
          setState('failure')
          setMessage('فشلت عملية الدفع.')
          return
        }

        const target = data.redirectUrl || `/editor?autodownload=1`
        setRedirectUrl(target)
        setState('success')
        setMessage('تم تأكيد الدفع بنجاح! جارٍ تحويلك للتصميم...')

        // Fire-and-forget: update DB record
        const sessionId = localStorage.getItem('paymob_session_id')
        fetch(`${apiBase}/api/v1/paymob-flash/confirm-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, transactionId }),
        }).catch(() => {})
        localStorage.removeItem('paymob_session_id')

        setTimeout(() => navigate(target, { replace: true }), 1500)
      })
      .catch(() => {
        // Network error — trust success=true from URL
        const sessionId = localStorage.getItem('paymob_session_id')
        const target = sessionId
          ? `/editor?autodownload=1&paymobSession=${encodeURIComponent(sessionId)}`
          : '/editor'
        setRedirectUrl(target)
        setState('success')
        setMessage('تم الدفع بنجاح! جارٍ تحويلك...')
        localStorage.removeItem('paymob_session_id')
        setTimeout(() => navigate(target, { replace: true }), 1500)
      })
  }, [navigate, searchParams])

  const openDesign = () => {
    if (!redirectUrl) return
    setOpeningNow(true)
    navigate(redirectUrl, { replace: true })
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'Tajawal', sans-serif" }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>

        <div style={{ marginBottom: 20 }}>
          {state === 'success' && (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
          )}
          {state === 'failure' && (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(239,68,68,0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          )}
          {state === 'checking' && (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12, color: state === 'success' ? '#059669' : state === 'failure' ? '#dc2626' : '#111827' }}>
          {state === 'success' ? '🎉 تم الدفع بنجاح!' : state === 'failure' ? 'فشلت عملية الدفع' : 'جاري التحقق...'}
        </h1>

        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24, lineHeight: 1.8 }}>
          {message || (state === 'checking' ? 'يرجى الانتظار...' : '')}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {state === 'failure' && (
            <button onClick={() => navigate(-1)} style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: '#111827', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              حاول مرة أخرى
            </button>
          )}
          {state === 'success' && redirectUrl && (
            <button
              onClick={openDesign}
              disabled={openingNow}
              style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: 15, cursor: openingNow ? 'not-allowed' : 'pointer', opacity: openingNow ? 0.8 : 1 }}
            >
              {openingNow ? 'جارٍ الفتح...' : 'تحميل التصميم'}
            </button>
          )}
          <button onClick={() => navigate('/')} style={{ padding: '14px 28px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            الرئيسية
          </button>
        </div>

        <div style={{ marginTop: 24, padding: '14px 18px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>
            تحتاج مساعدة؟{' '}
            <a href="https://wa.me/966559955339" target="_blank" rel="noreferrer" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline' }}>
              تواصل معنا عبر واتساب
            </a>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
