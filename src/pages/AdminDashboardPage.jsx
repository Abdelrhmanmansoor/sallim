import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Building2, Key, CreditCard, Activity, LogOut,
  Menu, X, TrendingUp, DollarSign, Eye, Plus, ChevronLeft,
  Users, ShoppingBag, RefreshCw, BarChart2, Shield
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalCodes: 0,
    activatedCodes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData || JSON.parse(userData).role !== 'admin') {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [codesRes, companiesRes] = await Promise.all([
        fetch(`${API}/api/v1/admin/invite-codes/stats/summary`, { headers }),
        fetch(`${API}/api/v1/admin/companies?limit=100`, { headers })
      ])
      const codesData = await codesRes.json()
      const companiesData = await companiesRes.json()
      
      setStats({
        totalCodes: codesData.success ? codesData.data.total : 0,
        activatedCodes: codesData.success ? codesData.data.activated : 0,
        totalCompanies: companiesData.success ? companiesData.data.total : 0,
        activeCompanies: companiesData.success
          ? (companiesData.data.companies?.filter(c => c.status === 'active').length || 0)
          : 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
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
    { id: 'wallets', icon: CreditCard, label: 'المحفظات', path: '/admin/wallets' },
    { id: 'support', icon: ShoppingBag, label: 'الدعم الفني', path: '/admin/support' },
    { id: 'logs', icon: Activity, label: 'سجل المراقبة', path: '/admin/audit-logs' },
  ]

  const statCards = [
    { icon: Building2, label: 'إجمالي الشركات', value: stats.totalCompanies, color: '#3b82f6', bg: '#eff6ff', trend: '+0%' },
    { icon: Users, label: 'الشركات النشطة', value: stats.activeCompanies, color: '#10b981', bg: '#ecfdf5', trend: '+0%' },
    { icon: Key, label: 'أكواد الاشتراك', value: stats.totalCodes, color: '#8b5cf6', bg: '#f5f3ff', trend: '+0%' },
    { icon: BarChart2, label: 'الكودات المفعّلة', value: stats.activatedCodes, color: '#f59e0b', bg: '#fffbeb', trend: '+0%' },
  ]

  const quickActions = [
    { icon: Key, label: 'توليد كود اشتراك', desc: 'إنشاء كود جديد لشركة', action: () => navigate('/admin/invite-codes'), color: '#f59e0b', bg: '#fffbeb' },
    { icon: Building2, label: 'إضافة شركة', desc: 'إدارة الشركات المسجلة', action: () => navigate('/admin/companies'), color: '#3b82f6', bg: '#eff6ff' },
    { icon: Eye, label: 'سجل المراقبة', desc: 'تتبع النشاطات', action: () => navigate('/admin/audit-logs'), color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Tajawal', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: 14 }}>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#f1f5f9', direction: 'rtl', display: 'flex' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .menu-btn:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .action-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
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
        transition: 'transform 0.3s ease',
        '@media (min-width: 1024px)': { transform: 'translateX(0)' }
      }}>
        {/* Logo */}
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

        {/* User */}
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

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <button key={item.id} className="menu-btn" onClick={() => { navigate(item.path); setActiveMenu(item.id); setSidebarOpen(false) }}
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

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 600, transition: 'all 0.15s' }}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginRight: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutDashboard size={18} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: 18 }}>لوحة الإدارة المركزية</span>
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={loadStats}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Tajawal', sans-serif", color: '#64748b' }}>
              <RefreshCw size={14} /> تحديث
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 24 }}>
          {/* Welcome */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 18, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#f59e0b', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>مرحباً بعودتك 👋</div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{user?.name || 'مدير النظام'}</h1>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>هنا لوحة الإدارة الشاملة لمنصة سَلِّم</p>
            </div>
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={30} color="#fff" />
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {statCards.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="stat-card" style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #f1f5f9', transition: 'all 0.2s', cursor: 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={s.color} />
                    </div>
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <TrendingUp size={12} /> {s.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>إجراءات سريعة</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {quickActions.map((a, i) => {
                const Icon = a.icon
                return (
                  <button key={i} className="action-card" onClick={a.action}
                    style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'right', fontFamily: "'Tajawal', sans-serif", transition: 'all 0.2s' }}>
                    <div style={{ width: 48, height: 48, background: a.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon size={22} color={a.color} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.desc}</div>
                  </button>
                )
              })}
              {/* Add New */}
              <button onClick={() => navigate('/admin/invite-codes')}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 16, padding: '20px', border: 'none', cursor: 'pointer', textAlign: 'right', fontFamily: "'Tajawal', sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={22} color="#fff" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>إنشاء كود جديد</div>
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>النظام متصل</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>قاعدة البيانات تعمل</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>جميع الأنظمة تعمل</span>
            </div>
            <div style={{ marginRight: 'auto', fontSize: 12, color: '#94a3b8' }}>
              آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

