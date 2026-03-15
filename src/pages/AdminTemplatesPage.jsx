import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ChevronRight, Image, DollarSign, Check, X,
  ToggleLeft, ToggleRight, Save, RefreshCw, Shield, Menu, LogOut,
  Building2, Key, CreditCard, ShoppingBag, Activity, ChevronLeft
} from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export default function AdminTemplatesPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData || JSON.parse(userData).role !== 'admin') {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    loadTemplates()
  }, [])

  const getToken = () => localStorage.getItem('token')

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/v1/admin/templates`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const data = await res.json()
      if (data.success) {
        setTemplates(data.data || [])
      }
    } catch (err) {
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTemplate = async (id, updates) => {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`${API}/api/v1/admin/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updates)
      })
      const data = await res.json()
      if (data.success) {
        setTemplates(prev => prev.map(t => t._id === id ? { ...t, ...updates } : t))
      }
    } catch (err) {
      console.error('Error updating template:', err)
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }))
    }
  }

  const toggleFree = (template) => {
    const newIsFree = !template.isFree
    updateTemplate(template._id, {
      isFree: newIsFree,
      price: newIsFree ? 0 : (template.price || 10)
    })
  }

  const handlePriceChange = (id, value) => {
    setTemplates(prev => prev.map(t =>
      t._id === id ? { ...t, price: value === '' ? '' : Number(value) } : t
    ))
  }

  const savePrice = (template) => {
    updateTemplate(template._id, { price: Number(template.price) || 0 })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'الرئيسية', path: '/admin/dashboard' },
    { id: 'companies', icon: Building2, label: 'إدارة الشركات', path: '/admin/companies' },
    { id: 'codes', icon: Key, label: 'أكواد الاشتراك', path: '/admin/invite-codes' },
    { id: 'templates', icon: Image, label: 'إدارة القوالب', path: '/admin/templates' },
    { id: 'wallets', icon: CreditCard, label: 'المحفظات', path: '/admin/wallets' },
    { id: 'support', icon: ShoppingBag, label: 'الدعم الفني', path: '/admin/support' },
    { id: 'logs', icon: Activity, label: 'سجل المراقبة', path: '/admin/audit-logs' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>جاري تحميل القوالب...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#f1f5f9', direction: 'rtl', display: 'flex' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .menu-btn:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .tmpl-card:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .price-input:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 260,
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        zIndex: 50, display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>سَلِّم</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>لوحة الإدارة</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{user?.name || 'مدير النظام'}</div>
              <div style={{ color: '#f59e0b', fontSize: 11 }}>مسؤول النظام</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = item.id === 'templates'
            return (
              <button key={item.id} className="menu-btn" onClick={() => { navigate(item.path); setSidebarOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', textAlign: 'right', marginBottom: 2,
                  background: isActive ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: isActive ? '#f59e0b' : '#94a3b8',
                  fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s'
                }}>
                <Icon size={16} />
                <span>{item.label}</span>
                {isActive && <ChevronLeft size={14} style={{ marginRight: 'auto' }} />}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 600 }}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Image size={18} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: 18 }}>إدارة القوالب والأسعار</span>
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={loadTemplates}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Tajawal', sans-serif", color: '#64748b' }}>
              <RefreshCw size={14} /> تحديث
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24 }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{templates.length}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>إجمالي القوالب</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{templates.filter(t => t.isFree !== false).length}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قوالب مجانية</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>{templates.filter(t => t.isFree === false).length}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قوالب مدفوعة</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{templates.filter(t => t.isActive).length}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>قوالب نشطة</div>
            </div>
          </div>

          {/* Templates Grid */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>جميع القوالب</h2>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{templates.length} قالب</span>
            </div>

            {templates.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <Image size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#94a3b8', fontSize: 15 }}>لا توجد قوالب بعد</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: 20 }}>
                {templates.map(template => (
                  <div key={template._id} className="tmpl-card" style={{
                    background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
                    overflow: 'hidden', transition: 'all 0.2s'
                  }}>
                    {/* Template Image */}
                    <div style={{ position: 'relative', height: 160, background: '#f8fafc', overflow: 'hidden' }}>
                      <img src={template.imageUrl} alt={template.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      {/* Status badges */}
                      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: template.isActive ? '#dcfce7' : '#fee2e2',
                          color: template.isActive ? '#166534' : '#991b1b'
                        }}>
                          {template.isActive ? 'نشط' : 'معطّل'}
                        </span>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: template.isFree !== false ? '#dbeafe' : '#fef3c7',
                          color: template.isFree !== false ? '#1e40af' : '#92400e'
                        }}>
                          {template.isFree !== false ? 'مجاني' : `${template.price || 0} ر.س`}
                        </span>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div style={{ padding: 16 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {template.name}
                      </h3>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
                        النوع: {template.type === 'public' ? 'عام' : template.type === 'premium' ? 'مميز' : 'حصري'}
                        {' · '}
                        الموسم: {template.season === 'eid_al_fitr' ? 'عيد الفطر' : template.season === 'eid_al_adha' ? 'عيد الأضحى' : template.season === 'ramadan' ? 'رمضان' : 'عام'}
                      </div>

                      {/* Free/Paid Toggle */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                          {template.isFree !== false ? 'مجاني' : 'مدفوع'}
                        </span>
                        <button onClick={() => toggleFree(template)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                          {template.isFree !== false ? (
                            <ToggleRight size={32} color="#10b981" />
                          ) : (
                            <ToggleLeft size={32} color="#f59e0b" />
                          )}
                        </button>
                      </div>

                      {/* Price Input (only when paid) */}
                      {template.isFree === false && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ position: 'relative', flex: 1 }}>
                            <input
                              className="price-input"
                              type="number"
                              min="0"
                              step="1"
                              value={template.price ?? ''}
                              onChange={(e) => handlePriceChange(template._id, e.target.value)}
                              placeholder="السعر"
                              style={{
                                width: '100%', padding: '10px 12px', paddingLeft: 40,
                                border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14,
                                fontFamily: "'Tajawal', sans-serif", textAlign: 'right',
                                background: '#fff', boxSizing: 'border-box'
                              }}
                            />
                            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                              ر.س
                            </span>
                          </div>
                          <button onClick={() => savePrice(template)}
                            disabled={saving[template._id]}
                            style={{
                              padding: '10px 14px', background: '#f59e0b', color: '#fff',
                              border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex',
                              alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600,
                              fontFamily: "'Tajawal', sans-serif",
                              opacity: saving[template._id] ? 0.6 : 1
                            }}>
                            <Save size={14} />
                            حفظ
                          </button>
                        </div>
                      )}

                      {/* Active Toggle */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                          {template.isActive ? 'مفعّل' : 'معطّل'}
                        </span>
                        <button onClick={() => updateTemplate(template._id, { isActive: !template.isActive })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                          {template.isActive ? (
                            <ToggleRight size={32} color="#10b981" />
                          ) : (
                            <ToggleLeft size={32} color="#94a3b8" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
