import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Layers, Download, ArrowLeft, Copy, Check } from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export default function BatchAccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const code = searchParams.get('code')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!code) { setError('لم يتم تحديد كود'); setLoading(false); return }
    fetch(`${API}/api/v1/admin/invite-codes/public/check/${code}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.data)
        else setError('الكود غير موجود أو غير صالح')
      })
      .catch(() => setError('تعذّر الاتصال بالخادم'))
      .finally(() => setLoading(false))
  }, [code])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isActive = data?.status === 'activated' && !data?.isExpired

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif", background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ color: '#64748b' }}>جاري التحقق من الكود...</p>
      </div>
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif", background: '#f8fafc', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
        <XCircle size={64} color="#ef4444" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>كود غير صالح</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>{error || 'الكود المدخل غير موجود أو منتهي الصلاحية'}</p>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>هل تواجه مشكلة؟ تواصل معنا عبر واتساب</p>
        <a href="https://wa.me/966559955339" target="_blank" rel="noreferrer"
          style={{ display: 'inline-block', marginTop: 12, padding: '12px 24px', background: '#25D366', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
          تواصل عبر واتساب
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)', fontFamily: "'Tajawal', sans-serif", direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Status Card */}
        <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{
            padding: '28px 28px 24px',
            background: isActive
              ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            textAlign: 'center'
          }}>
            {isActive ? (
              <>
                <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={40} color="#fff" />
                </div>
                <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: '0 0 6px' }}>كود التفعيل مفعّل</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0 }}>يمكنك استخدام هذا الرابط في أي وقت</p>
              </>
            ) : (
              <>
                <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <XCircle size={40} color="#fff" />
                </div>
                <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: '0 0 6px' }}>
                  {data.isExpired ? 'انتهت صلاحية الكود' : 'الكود غير مفعّل بعد'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0 }}>تواصل مع الإدارة لتفعيل الكود</p>
              </>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '24px 28px' }}>
            {/* Code Badge */}
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '16px', marginBottom: 20, textAlign: 'center', border: '2px solid ' + (isActive ? '#7c3aed20' : '#e2e8f0') }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>كود التفعيل</div>
              <code style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', direction: 'ltr', display: 'block' }}>{data.code}</code>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#f5f3ff', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <Layers size={20} color="#7c3aed" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>نوع الكود</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#7c3aed' }}>
                  {data.isBatch ? 'جماعي (Batch)' : 'شركة'}
                </div>
              </div>
              <div style={{ background: '#ecfdf5', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <Download size={20} color="#059669" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>رصيد التحميلات</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>{data.initialCredits}</div>
              </div>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {data.features?.includes('batch_templates') && (
                <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#f5f3ff', color: '#7c3aed' }}>وضع جماعي</span>
              )}
              {data.features?.includes('ready_templates') && (
                <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#ecfdf5', color: '#059669' }}>قوالب جاهزة</span>
              )}
              {data.features?.includes('designer_mode') && (
                <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#fffbeb', color: '#d97706' }}>وضع المصمم</span>
              )}
            </div>

            {/* Expiry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
              <Clock size={16} color="#94a3b8" />
              <span style={{ fontSize: 13, color: '#64748b' }}>
                صالح حتى: <strong style={{ color: '#0f172a' }}>{new Date(data.expirationDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </span>
            </div>

            {isActive && (
              <>
                {/* CTA */}
                <button
                  onClick={() => navigate(`/editor?mode=batch&batchCode=${code}`)}
                  style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', fontSize: 17, fontWeight: 900, marginBottom: 12, fontFamily: "'Tajawal', sans-serif", letterSpacing: '0.01em' }}>
                  ابدأ التصميم الجماعي الآن
                </button>

                {/* Save Link */}
                <button onClick={copyLink}
                  style={{ width: '100%', padding: '13px', background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 14, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: "'Tajawal', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                  {copied ? 'تم نسخ الرابط!' : 'احفظ الرابط للوصول لاحقاً'}
                </button>
              </>
            )}

            {!isActive && (
              <a href="https://wa.me/966559955339" target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#25D366', color: '#fff', borderRadius: 14, fontWeight: 800, textDecoration: 'none', fontSize: 15 }}>
                تواصل مع الإدارة
              </a>
            )}
          </div>

          {/* User Rights Footer */}
          <div style={{ padding: '16px 28px', background: '#fafafa', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, textAlign: 'center', lineHeight: 1.7 }}>
              حقوقك محفوظة · إذا واجهت أي مشكلة يمكنك التواصل معنا مباشرة عبر واتساب
              <a href="https://wa.me/966559955339" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 700, marginRight: 4 }}>966559955339</a>
            </p>
          </div>
        </div>

        {/* Back */}
        <button onClick={() => navigate('/')}
          style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Tajawal', sans-serif" }}>
          <ArrowLeft size={14} /> العودة للرئيسية
        </button>
      </div>
    </div>
  )
}
