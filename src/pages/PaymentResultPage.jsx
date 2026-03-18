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
  const finalizedRef = useRef(false)

  const urlSuccess = searchParams.get('success') === 'true'
  const urlTransactionId = searchParams.get('id') || null
  const getSessionId = () => localStorage.getItem('paymob_session_id') || searchParams.get('session_id')
  const resolveTargetUrl = (candidate, sessionId) => {
    const fallback = `/editor?autodownload=1&paymobSession=${encodeURIComponent(sessionId || '')}`
    const target = String(candidate || '').trim()
    if (!target) return fallback
    try {
      const parsed = new URL(target, window.location.origin)
      const path = String(parsed.pathname || '/').toLowerCase()
      if ((path === '/' && !parsed.search) || path.startsWith('/payment-result')) {
        return fallback
      }
      return target
    } catch {
      if (target === '/' || target.toLowerCase().startsWith('/payment-result')) return fallback
      return target
    }
  }

  const openDesignNow = async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      setState('failure')
      setMessage('تعذر العثور على جلسة الدفع.')
      return
    }

    try {
      setOpeningNow(true)
      setState('checking')
      setMessage('جارٍ تجهيز التحويل للتصميم...')

      const confirmRes = await fetch(`${apiBase}/api/v1/paymob-flash/confirm-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, transactionId: urlTransactionId }),
      })
      const confirmData = await confirmRes.json()

      if (confirmRes.ok && confirmData.success) {
        const target = resolveTargetUrl(confirmData.redirectUrl || redirectUrl, sessionId)
        if (target) {
          localStorage.removeItem('paymob_session_id')
          navigate(target, { replace: true })
          return
        }
      }

      const statusRes = await fetch(`${apiBase}/api/v1/paymob-flash/status/${sessionId}`)
      const statusData = await statusRes.json()
      const target = resolveTargetUrl(statusData?.redirectUrl || redirectUrl, sessionId)
      if (target) {
        navigate(target, { replace: true })
        return
      }

      setState('pending')
      setMessage('العملية قيد المعالجة، سيتم تحويلك تلقائياً بعد التأكيد.')
    } catch {
      if (redirectUrl || sessionId) {
        navigate(resolveTargetUrl(redirectUrl, sessionId), { replace: true })
        return
      }
      setState('pending')
      setMessage('العملية قيد المعالجة، حاول مرة أخرى بعد ثوانٍ.')
    } finally {
      setOpeningNow(false)
    }
  }

  useEffect(() => {
    const sessionId = getSessionId()
    if (!sessionId) {
      if (urlSuccess) {
        setState('pending')
        setMessage('تم الدفع، جاري تأكيد الطلب. يرجى الانتظار أو التواصل معنا عبر واتساب.')
      } else {
        setState('failure')
        setMessage('تعذر العثور على بيانات جلسة الدفع.')
      }
      return
    }

    let attempts = 0
    let disposed = false

    const finalizePayment = async () => {
      if (finalizedRef.current || disposed) return
      finalizedRef.current = true
      try {
        const res = await fetch(`${apiBase}/api/v1/paymob-flash/confirm-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, transactionId: urlTransactionId }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          finalizedRef.current = false
          setState('pending')
          setMessage('بانتظار تأكيد الدفع النهائي من بوابة الدفع...')
          return
        }

        setState('success')
        setMessage('تم تأكيد الدفع بنجاح. نهنئكم بحلول عيد الفطر المبارك 🌙 وجارٍ تحويلك للتحميل...')
        localStorage.removeItem('paymob_session_id')
        if (data.redirectUrl && data.redirectUrl !== '/') setRedirectUrl(data.redirectUrl)

        const target = resolveTargetUrl(data.redirectUrl || redirectUrl, sessionId)
        setTimeout(() => navigate(target, { replace: true }), 1200)
      } catch {
        finalizedRef.current = false
        setState('pending')
        setMessage('تمت العملية، وجاري التحقق النهائي...')
      }
    }

    const checkStatus = async () => {
      attempts += 1
      try {
        const res = await fetch(`${apiBase}/api/v1/paymob-flash/status/${sessionId}`)
        const data = await res.json()
        if (!res.ok || !data.success) {
          setState('checking')
          setMessage('جاري التحقق من حالة الدفع...')
          return
        }
        if (data.redirectUrl && data.redirectUrl !== '/') setRedirectUrl(data.redirectUrl)

        if (data.status === 'completed') {
          await finalizePayment()
          return
        }

        if (data.status === 'failed') {
          if (urlSuccess) {
            setState('pending')
            setMessage('تم الدفع، جاري تأكيد الطلب من بوابة الدفع...')
          } else {
            setState('failure')
            setMessage('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
          }
          return
        }

        setState('pending')
        setMessage('العملية قيد المعالجة، سيتم تحويلك تلقائياً بعد التأكيد.')
      } catch {
        setState('checking')
        setMessage('جاري التحقق من حالة الدفع...')
      }
    }

    checkStatus()
    const interval = setInterval(() => {
      if (attempts >= 40 || finalizedRef.current) {
        clearInterval(interval)
        return
      }
      checkStatus()
    }, 3000)

    return () => {
      disposed = true
      clearInterval(interval)
    }
  }, [navigate, searchParams])

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'Tajawal', sans-serif" }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '32px 28px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
        
        {/* Icon */}
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
          {state === 'pending' && (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            </div>
          )}
          {state === 'checking' && (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(59,130,246,0.3)', animation: 'pulse 2s infinite' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12, color: state === 'success' ? '#059669' : state === 'failure' ? '#dc2626' : '#111827' }}>
          {state === 'success' ? '🎉 تم الدفع بنجاح!' : state === 'failure' ? 'فشلت عملية الدفع' : state === 'pending' ? 'قيد المعالجة' : 'جاري التحقق...'}
        </h1>

        {/* Message */}
        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24, lineHeight: 1.8 }}>
          {message || (state === 'success' ? 'شكراً لك! نهنئكم بحلول عيد الفطر المبارك 🌙 ويمكنك الآن تحميل التصميم مباشرة.' : state === 'failure' ? 'حدثت مشكلة أثناء الدفع.' : 'يرجى الانتظار...')}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {state === 'failure' && (
            <button onClick={() => navigate('/checkout')} style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: '#111827', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              حاول مرة أخرى
            </button>
          )}
          {(state === 'success' || state === 'pending') && (
            <button
              onClick={openDesignNow}
              disabled={openingNow}
              style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: 15, cursor: openingNow ? 'not-allowed' : 'pointer', opacity: openingNow ? 0.8 : 1 }}
            >
              {openingNow ? 'جارٍ الفتح...' : 'تحميل الآن'}
            </button>
          )}
          <button onClick={() => navigate('/')} style={{ padding: '14px 28px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            الرئيسية
          </button>
        </div>

        {/* WhatsApp Support */}
        <div style={{ marginTop: 24, padding: '14px 18px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>
            تحتاج مساعدة؟{' '}
            <a href="https://wa.me/966559955339" target="_blank" rel="noreferrer" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline' }}>
              تواصل معنا عبر واتساب
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  )
}
