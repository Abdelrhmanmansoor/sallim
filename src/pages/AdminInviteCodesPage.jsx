import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Key, Plus, Search, ArrowRight, RefreshCw, Copy, Check, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const CLIENT = import.meta.env.VITE_CLIENT_URL || 'https://www.sallim.co'

export default function AdminInviteCodesPage() {
  const navigate = useNavigate()
  const [codes, setCodes] = useState([])
  const [stats, setStats] = useState({ total: 0, generated: 0, activated: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(null)

  // Generate form
  const [form, setForm] = useState({
    companyName: '',
    companyEmail: '',
    expirationDays: 7,
    downloadLimit: 100,
    readyTemplates: true,
    batchMode: true,
    designerMode: false,
    codeType: 'batch', // 'batch' = جماعي, 'company' = تسجيل شركة
  })
  const [showForm, setShowForm] = useState(false)
  const [lastCode, setLastCode] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (user.role !== 'admin') { navigate('/login'); return }
    loadCodes()
    loadStats()
  }, [page, search])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/v1/admin/invite-codes/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setStats(data.data)
    } catch (err) { console.error(err) }
  }

  const loadCodes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({ page, limit: 20, ...(search && { search }) })
      const res = await fetch(`${API}/api/v1/admin/invite-codes?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setCodes(data.data.inviteCodes)
        setPages(data.data.pages)
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!form.companyName || !form.companyEmail) {
      toast.error('اسم الشركة والبريد مطلوبان')
      return
    }
    try {
      setGenerating(true)
      const token = localStorage.getItem('token')
      const features = []
      if (form.readyTemplates) features.push('ready_templates')
      if (form.batchMode) features.push('batch_templates')
      if (form.designerMode) features.push('designer_mode')
      if (form.codeType === 'company') features.push('company_registration')

      const res = await fetch(`${API}/api/v1/admin/invite-codes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          companyName: form.companyName,
          companyEmail: form.companyEmail,
          expirationDays: form.expirationDays,
          initialCredits: form.downloadLimit,
          features,
          createdBy: user._id || user.id,
          metadata: { codeType: form.codeType }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(form.codeType === 'company' ? 'تم إنشاء كود تسجيل الشركة بنجاح' : 'تم إنشاء كود التفعيل الجماعي بنجاح')
        setShowForm(false)
        setForm({ companyName: '', companyEmail: '', expirationDays: 7, downloadLimit: 100, readyTemplates: true, batchMode: true, designerMode: false, codeType: 'batch' })
        setLastCode(data.data?.code)
        loadCodes()
        loadStats()
      } else {
        toast.error(data.error || 'حدث خطأ')
      }
    } catch (err) { toast.error('حدث خطأ') } finally { setGenerating(false) }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const statusColor = { generated: ['#fef9c3', '#854d0e'], sent: ['#dbeafe', '#1e40af'], activated: ['#dcfce7', '#16a34a'], expired: ['#fee2e2', '#dc2626'], revoked: ['#f1f5f9', '#475569'] }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#f8fafc', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
          <ArrowRight size={16} /> الرئيسية
        </button>
        <Key size={20} color="#a855f7" />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>أكواد الاشتراك</h1>
        <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
          <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>الكل: {stats.total}</span>
          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>مفعّل: {stats.activated}</span>
        </div>
        <button onClick={() => { setForm(p => ({ ...p, codeType: 'batch' })); setShowForm(!showForm) }} style={{ padding: '8px 16px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Tajawal', sans-serif" }}>
          <Plus size={14} /> إنشاء كود
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {/* Generate Form */}
        {showForm && (
          <form onSubmit={handleGenerate} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>إنشاء كود اشتراك جديد</h3>
            
            {/* Code Type Selector */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button type="button" onClick={() => setForm(p => ({ ...p, codeType: 'batch', batchMode: true, readyTemplates: true, designerMode: false }))}
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  fontFamily: "'Tajawal', sans-serif", fontWeight: 700, fontSize: 14,
                  border: form.codeType === 'batch' ? '2px solid #7c3aed' : '2px solid #e2e8f0',
                  background: form.codeType === 'batch' ? '#f5f3ff' : '#fff',
                  color: form.codeType === 'batch' ? '#7c3aed' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>جماعي</div>
                <div style={{ fontSize: 11, fontWeight: 400 }}>كود تفعيل نظام جماعي (Batch) مع تحكم في التحميلات</div>
              </button>
              <button type="button" onClick={() => setForm(p => ({ ...p, codeType: 'company', batchMode: true, readyTemplates: true, designerMode: true }))}
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  fontFamily: "'Tajawal', sans-serif", fontWeight: 700, fontSize: 14,
                  border: form.codeType === 'company' ? '2px solid #2563eb' : '2px solid #e2e8f0',
                  background: form.codeType === 'company' ? '#eff6ff' : '#fff',
                  color: form.codeType === 'company' ? '#2563eb' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>تسجيل شركة</div>
                <div style={{ fontSize: 11, fontWeight: 400 }}>كود تسجيل شركة جديدة مع داشبورد كامل</div>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>اسم الشركة *</label>
                <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} required placeholder="مثال: شركة سلّم"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: "'Tajawal', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>البريد الإلكتروني *</label>
                <input type="email" value={form.companyEmail} onChange={e => setForm(p => ({ ...p, companyEmail: e.target.value }))} required placeholder="email@company.com"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: "'Tajawal', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>صلاحية (أيام)</label>
                <input type="number" min="1" value={form.expirationDays} onChange={e => setForm(p => ({ ...p, expirationDays: +e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: "'Tajawal', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>رصيد ابتدائي</label>
                <input type="number" min="0" value={form.downloadLimit} onChange={e => setForm(p => ({ ...p, downloadLimit: +e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: "'Tajawal', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#111827' }}>
                <input type="checkbox" checked={form.readyTemplates} onChange={e => setForm(p => ({ ...p, readyTemplates: e.target.checked }))} />
                تمبلت جاهزة
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#111827' }}>
                <input type="checkbox" checked={form.batchMode} onChange={e => setForm(p => ({ ...p, batchMode: e.target.checked }))} />
                وضع جماعي (Batch)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#111827' }}>
                <input type="checkbox" checked={form.designerMode} onChange={e => setForm(p => ({ ...p, designerMode: e.target.checked }))} />
                وضع المصمم
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={generating} style={{ padding: '10px 20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                {generating ? 'جارٍ الإنشاء...' : 'إنشاء الكود'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Tajawal', sans-serif" }}>
                إلغاء
              </button>
            </div>
            {lastCode && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link2 size={16} color="#0f172a" />
                <span style={{ fontSize: 13, direction: 'ltr' }}>{`${CLIENT}/company-activation?code=${lastCode}`}</span>
                <button onClick={() => copyCode(`${CLIENT}/company-activation?code=${lastCode}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a855f7', fontWeight: 700 }}>نسخ الرابط</button>
              </div>
            )}
          </form>
        )}

        {/* Search */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', top: 12, right: 12, color: '#94a3b8' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="ابحث بالكود أو اسم الشركة..."
              style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: "'Tajawal', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={loadCodes} style={{ padding: '10px 16px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> تحديث
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>جارٍ التحميل...</div>
          ) : codes.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>لا توجد أكواد</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['الكود', 'الشركة', 'النوع', 'الحالة', 'الميزات', 'تاريخ الانتهاء', 'رابط التسجيل'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {codes.map(c => {
                  const [bg, color] = statusColor[c.status] || ['#f1f5f9', '#475569']
                  const signupLink = `${CLIENT}/company-activation?code=${c.code}`
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <code style={{ fontSize: 12, background: '#f8fafc', padding: '2px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>{c.code}</code>
                          <button onClick={() => copyCode(c.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {copied === c.code ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{c.companyName}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: c.features?.includes('company_registration') ? '#eff6ff' : '#f5f3ff',
                          color: c.features?.includes('company_registration') ? '#2563eb' : '#7c3aed'
                        }}>
                          {c.features?.includes('company_registration') ? 'تسجيل شركة' : 'جماعي'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {c.features?.includes('batch_templates') && <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: '#f5f3ff', color: '#7c3aed' }}>جماعي</span>}
                          {c.features?.includes('ready_templates') && <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: '#ecfdf5', color: '#059669' }}>جاهز</span>}
                          {c.features?.includes('designer_mode') && <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: '#fffbeb', color: '#d97706' }}>مصمم</span>}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(c.expirationDate).toLocaleDateString('ar-SA')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button onClick={() => copyCode(signupLink)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a855f7', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Link2 size={14} /> نسخ رابط التسجيل
                        </button>
                      </td>
                    </tr>
                  )
                })}
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
                background: p === page ? '#a855f7' : '#fff', color: p === page ? '#fff' : '#374151',
                fontFamily: "'Tajawal', sans-serif", fontWeight: 600
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
