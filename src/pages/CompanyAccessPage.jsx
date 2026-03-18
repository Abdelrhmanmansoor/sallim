import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompany } from '../context/CompanyContext'

export default function CompanyAccessPage() {
  const navigate = useNavigate()
  const { resolveAccessCode } = useCompany()
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await resolveAccessCode(accessCode)
    setLoading(false)
    if (!res.success) {
      setError(res.error || 'كود غير صالح')
      return
    }
    navigate(`/company/${res.data.slug}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20, fontFamily: "'Tajawal', sans-serif", direction: 'rtl', background: '#f8fafc' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 26 }}>
        <h1 style={{ marginTop: 0, fontSize: 24, marginBottom: 6 }}>دخول الشركة</h1>
        <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14, marginBottom: 18 }}>أدخل كود الشركة للوصول إلى القوالب الخاصة</p>

        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="كود الشركة"
          required
          style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 14px', fontSize: 15, marginBottom: 10 }}
        />
        {error && <div style={{ fontSize: 13, color: '#dc2626', marginBottom: 10 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', border: 'none', borderRadius: 12, padding: '12px 14px', background: loading ? '#9ca3af' : '#111827', color: '#fff', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'جارٍ التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
