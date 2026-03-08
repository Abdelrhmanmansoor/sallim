import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Key, 
  CreditCard, 
  Ticket, 
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalCodes: 0,
    activatedCodes: 0,
    totalCredits: 0,
  })
  const [loading, setLoading] = useState(true)

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
      // استدعاء APIs للحصول على الإحصائيات
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      // تحميل إحصائيات الأكواد
      const codesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/invite-codes/stats/summary`, { headers })
      const codesData = await codesRes.json()
      
      if (codesData.success) {
        setStats(prev => ({
          ...prev,
          totalCodes: codesData.data.total,
          activatedCodes: codesData.data.activated,
        }))
      }

      // تحميل الشركات
      const companiesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/companies?limit=1`, { headers })
      const companiesData = await companiesRes.json()
      
      if (companiesData.success) {
        setStats(prev => ({
          ...prev,
          totalCompanies: companiesData.data.total,
          activeCompanies: companiesData.data.companies?.filter(c => c.status === 'active').length || 0,
        }))
      }
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
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية', path: '/admin/dashboard' },
    { icon: <Building2 className="w-5 h-5" />, label: 'إدارة الشركات', path: '/admin/companies' },
    { icon: <Key className="w-5 h-5" />, label: 'أكواد الاشتراك', path: '/admin/invite-codes' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'المحفظات', path: '/admin/wallets' },
    { icon: <Ticket className="w-5 h-5" />, label: 'الدعم الفني', path: '/admin/support' },
    { icon: <Activity className="w-5 h-5" />, label: 'سجل المراقبة', path: '/admin/audit-logs' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="سَلِّم" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-white">سَلِّم</h1>
              <p className="text-xs text-gray-400">لوحة الإدارة المركزية</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">مسؤول النظام</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:mr-72 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 hidden sm:block">
                لوحة الإدارة المركزية
              </h2>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  مرحباً، {user?.name}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <Building2 className="w-6 h-6" />,
                label: 'إجمالي الشركات',
                value: stats.totalCompanies,
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: <Users className="w-6 h-6" />,
                label: 'الشركات النشطة',
                value: stats.activeCompanies,
                color: 'from-green-500 to-green-600',
              },
              {
                icon: <Key className="w-6 h-6" />,
                label: 'أكواد الاشتراك',
                value: stats.totalCodes,
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                label: 'الكودات المفعلة',
                value: stats.activatedCodes,
                color: 'from-amber-500 to-amber-600',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <Key className="w-6 h-6" />,
                  label: 'توليد كود اشتراك',
                  description: 'إنشاء كود جديد لشركة',
                  action: () => navigate('/admin/invite-codes'),
                  color: 'bg-amber-500',
                },
                {
                  icon: <Building2 className="w-6 h-6" />,
                  label: 'إضافة شركة',
                  description: 'إدارة الشركات المسجلة',
                  action: () => navigate('/admin/companies'),
                  color: 'bg-blue-500',
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  label: 'سجل المراقبة',
                  description: 'تتبع النشاطات',
                  action: () => navigate('/admin/audit-logs'),
                  color: 'bg-purple-500',
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-right"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{action.label}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">مرحباً في لوحة الإدارة المركزية</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  من هنا يمكنك إدارة كل شيء: توليد أكواد الاشتراك، إدارة الشركات، تفعيل الميزات،
                  مراقبة الأنشطة، وغيرها الكثير من الميزات المتقدمة.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                    النظام متصل
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    جميع الأنظمة تعمل
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}