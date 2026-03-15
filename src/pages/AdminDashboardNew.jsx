import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Activity,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  Download,
  ShoppingBag,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function AdminDashboardNew() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Real-time stats
  const [stats, setStats] = useState({
    activeUsers: 0,
    activeEditors: 0,
    totalVisitsToday: 0,
    purchasesToday: 0,
    conversionRate: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0
  })

  // Live activity feed
  const [activities, setActivities] = useState([])

  // Cards management
  const [cards, setCards] = useState([])
  const [editingCard, setEditingCard] = useState(null)

  // Sales data
  const [sales, setSales] = useState([])
  const [salesPagination, setSalesPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  })

  // Revenue chart data
  const [revenueData, setRevenueData] = useState([])

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData || JSON.parse(userData).role !== 'admin') {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))

    // Initialize Socket.io
    const token = localStorage.getItem('token')
    const socketInstance = io(API, {
      auth: { token }
    })

    setSocket(socketInstance)

    // Listen for real-time updates
    socketInstance.on('admin_stats', (newStats) => {
      setStats(newStats)
    })

    socketInstance.on('live_activity', (activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 20))
    })

    socketInstance.on('active_users_count', (count) => {
      setStats(prev => ({ ...prev, activeUsers: count }))
    })

    // Load initial data
    loadInitialData()

    return () => {
      socketInstance.disconnect()
    }
  }, [navigate])

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      // Load all data in parallel
      const [statsRes, activitiesRes, cardsRes, salesRes, revenueRes] = await Promise.all([
        fetch(`${API}/api/v1/analytics/realtime`, { headers }),
        fetch(`${API}/api/v1/analytics/activity?limit=20`, { headers }),
        fetch(`${API}/api/v1/analytics/cards`, { headers }),
        fetch(`${API}/api/v1/analytics/sales?page=1&limit=10`, { headers }),
        fetch(`${API}/api/v1/analytics/revenue?period=month`, { headers })
      ])

      const [statsData, activitiesData, cardsData, salesData, revenueData] = await Promise.all([
        statsRes.json(),
        activitiesRes.json(),
        cardsRes.json(),
        salesRes.json(),
        revenueRes.json()
      ])

      if (statsData.success) setStats(statsData.data)
      if (activitiesData.success) setActivities(activitiesData.data)
      if (cardsData.success) setCards(cardsData.data)
      if (salesData.success) {
        setSales(salesData.data)
        setSalesPagination(salesData.pagination)
      }
      if (revenueData.success) setRevenueData(revenueData.data)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadInitialData()
    setRefreshing(false)
    toast.success('تم تحديث البيانات')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleToggleCard = async (cardId, enabled) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API}/api/v1/analytics/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: !enabled })
      })

      const data = await response.json()
      if (data.success) {
        setCards(cards.map(card => 
          card._id === cardId ? { ...card, enabled: !enabled } : card
        ))
        toast.success(enabled ? 'تم تعطيل البطاقة' : 'تم تفعيل البطاقة')
      }
    } catch (error) {
      console.error('Error toggling card:', error)
      toast.error('فشل تحديث البطاقة')
    }
  }

  const handleUpdateCard = async (cardId, updates) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API}/api/v1/analytics/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      if (data.success) {
        setCards(cards.map(card => 
          card._id === cardId ? { ...card, ...updates } : card
        ))
        setEditingCard(null)
        toast.success('تم تحديث البطاقة')
      }
    } catch (error) {
      console.error('Error updating card:', error)
      toast.error('فشل تحديث البطاقة')
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-green-500" />
      case 'download':
        return <Download className="w-4 h-4 text-blue-500" />
      case 'editor_entry':
        return <Edit className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'الآن'
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
    return date.toLocaleDateString('ar-SA')
  }

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
              <p className="text-xs text-gray-400">لوحة الإدارة</p>
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
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-amber-500/20 text-amber-400"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">الرئيسية</span>
          </button>
          <button
            onClick={() => navigate('/admin/companies')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">الشركات</span>
          </button>
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
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 hidden sm:block">
              لوحة التحكم
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-sm text-gray-600">
                مرحباً، {user?.name}
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
                icon: <Users className="w-6 h-6" />,
                label: 'المستخدمين النشطين',
                value: stats.activeUsers,
                color: 'from-blue-500 to-blue-600',
                change: '+12%'
              },
              {
                icon: <Eye className="w-6 h-6" />,
                label: 'الزيارات اليوم',
                value: stats.totalVisitsToday,
                color: 'from-green-500 to-green-600',
                change: '+8%'
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                label: 'المشتريات اليوم',
                value: stats.purchasesToday,
                color: 'from-purple-500 to-purple-600',
                change: '+5%'
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                label: 'الإيرادات اليوم',
                value: `${stats.revenueToday.toFixed(0)} ر.س`,
                color: 'from-amber-500 to-amber-600',
                change: '+15%'
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
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {stat.label}
                  <span className="text-green-500 text-xs">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion Rate & Revenue */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Conversion Rate */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">نسبة التحويل</h3>
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-amber-600 mb-2">
                  {stats.conversionRate}%
                </div>
                <p className="text-sm text-gray-600">
                  من الزوار إلى مشترين
                </p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">الإيرادات</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">هذا الأسبوع: {stats.revenueWeek.toFixed(0)} ر.س</span>
                  <span className="text-gray-600">هذا الشهر: {stats.revenueMonth.toFixed(0)} ر.س</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="_id.day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#f59e0b" 
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Feed & Cards Management */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Live Activity Feed */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  النشاط المباشر
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">مباشر</span>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا يوجد نشاط حالياً</p>
                ) : (
                  activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.cardName || 'نشاط عام'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.type === 'purchase' && `شراء - ${activity.amount} ر.س`}
                          {activity.type === 'download' && 'تحميل البطاقة'}
                          {activity.type === 'editor_entry' && 'دخول للمحرر'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTime(activity.time)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cards Management */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                إدارة البطاقات
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cards.map((card) => (
                  <div
                    key={card._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={card.image || '/images/logo.png'}
                      alt={card.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      {editingCard === card._id ? (
                        <input
                          type="text"
                          defaultValue={card.name}
                          onBlur={(e) => handleUpdateCard(card._id, { name: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCard(card._id, { name: e.target.value })
                            }
                          }}
                          autoFocus
                          className="w-full px-2 py-1 border border-amber-500 rounded focus:outline-none text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {card.price || 0} ر.س • {card.purchases || 0} بيع • {card.downloads || 0} تحميل
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCard(editingCard === card._id ? null : card._id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleToggleCard(card._id, card.enabled)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {card.enabled !== false ? (
                          <ToggleRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                جدول المبيعات
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">العميل</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">البطاقة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">المبلغ</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {sale.userId?.name || 'زائر'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {sale.cardId?.name || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                        {sale.metadata?.amount || 0} ر.س
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTime(sale.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          مكتمل
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}