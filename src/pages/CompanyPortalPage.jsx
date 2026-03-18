import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTemplates } from '../utils/api'
import { useCompany } from '../context/CompanyContext'

export default function CompanyPortalPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { loadCompanyBySlug } = useCompany()
  const [templates, setTemplates] = useState([])
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      const ctx = await loadCompanyBySlug(slug)
      if (!ctx.success) {
        if (!cancelled) setError(ctx.error || 'تعذر تحميل صفحة الشركة')
        setLoading(false)
        return
      }
      if (!cancelled) setCompanyData(ctx.data)

      try {
        const res = await getTemplates('', { companySlug: slug })
        if (!cancelled && res.success) {
          setTemplates(res.data || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'تعذر تحميل القوالب')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [loadCompanyBySlug, slug])

  const companyName = companyData?.name || 'بوابة الشركة'
  const logoUrl = companyData?.logoUrl || ''
  const primaryColor = companyData?.brandColors?.primary || '#2563eb'
  const secondaryColor = companyData?.brandColors?.secondary || '#1e40af'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif" }}>
        جارٍ تحميل بوابة الشركة...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: "'Tajawal', sans-serif" }}>
        <div style={{ maxWidth: 500, width: '100%', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>تعذر فتح بوابة الشركة</h2>
          <p style={{ color: '#6b7280' }}>{error}</p>
          <Link to="/company-access" style={{ display: 'inline-block', marginTop: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
            إدخال كود الشركة
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${primaryColor}12, ${secondaryColor}08)`, fontFamily: "'Tajawal', sans-serif", direction: 'rtl' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 10 }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 10, background: primaryColor, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                {(companyName || 'ش')[0]}
              </div>
            )}
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>بوابة الشركة</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{companyName}</div>
            </div>
          </div>
          <Link to="/company-access" style={{ color: primaryColor, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            تغيير الشركة
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h1 style={{ marginTop: 0, marginBottom: 18, color: '#0f172a', fontSize: 24, fontWeight: 900 }}>القوالب المتاحة لشركتك</h1>
        {templates.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, color: '#6b7280' }}>
            لا توجد قوالب متاحة حالياً.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {templates.map((template) => (
              <button
                key={template._id}
                onClick={() => navigate(`/editor?template=${encodeURIComponent(template._id)}`)}
                style={{ border: '1px solid #e5e7eb', borderRadius: 14, background: '#fff', padding: 10, textAlign: 'right', cursor: 'pointer' }}
              >
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10, overflow: 'hidden', background: '#f8fafc', marginBottom: 10 }}>
                  <img src={template.imageUrl} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{template.name}</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
