import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Search, ArrowRight, RefreshCw } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function AdminCompaniesPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'admin') { navigate('/login'); return }
    loadCompanies()
  }, [page, search])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({ page, limit: 20, ...(search && { search }) })
      const res = await fetch(`${API}/api/v1/admin/companies?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setCompanies(data.data.companies)
        setTotal(data.data.total)
        setPages(data.data.pages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#f8fafc', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
          <ArrowRight size={16} /> الرئيسية
        </button>
        <Building2 size={20} color="#3b82f6" />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>إدارة الشركات</h1>
        <span style={{ marginRight: 'auto', background: '#eff6ff', color: '#3b82f6', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>{total} شركة</span>
      </div>

      <div style={{ padding: 24 }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', top: 12, right: 12, color: '#94a3b8' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="ابحث بالاسم أو البريد..."
              style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: "'Tajawal', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={loadCompanies} style={{ padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> تحديث
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>جارٍ التحميل...</div>
          ) : companies.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>لا توجد شركات</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['الشركة', 'البريد', 'الحالة', 'الخطة', 'تاريخ الإنشاء'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 13 }}>{c.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: c.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: c.status === 'active' ? '#16a34a' : '#dc2626' }}>
                        {c.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{c.subscription?.plan || '-'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: p === page ? '#3b82f6' : '#fff', color: p === page ? '#fff' : '#374151',
                fontFamily: "'Tajawal', sans-serif", fontWeight: 600
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
