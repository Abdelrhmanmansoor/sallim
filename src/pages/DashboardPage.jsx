import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Palette, Settings, BarChart3, Upload, Image as ImageIcon,
  Check, Globe, Building2, FileText, Link2, MessageSquare,
  ArrowLeft, Sparkles, ChevronRight
} from 'lucide-react'
import { useWhiteLabelStore } from '../store'
import { getPublicStats, getAdminTickets, adminReplyToTicket, updateAdminTicketStatus } from '../utils/api'
const BRAND_KEY = 'sallim_company_brand'

function load(key, fb = {}) {
  try { return JSON.parse(localStorage.getItem(key)) || fb }
  catch { return fb }
}
function save(key, v) { localStorage.setItem(key, JSON.stringify(v)) }

const tabs = [
  { id: 'brand', label: 'هوية الشركة', icon: Palette },
  { id: 'config', label: 'إعدادات API', icon: Settings },
  { id: 'stats', label: 'التقارير', icon: BarChart3 },
  { id: 'admin', label: 'البطاقات المُصممة', icon: Image },
  { id: 'companies', label: 'إدارة الشركات', icon: Building2 },
  { id: 'templates', label: 'إدارة القوالب (CMS)', icon: ImageIcon },
  { id: 'blog', label: 'المدونة', icon: FileText },
  { id: 'tickets', label: 'تذاكر الدعم', icon: MessageSquare },
]

/* ═══════════════════════════════════════════════════════════════════════════
   USER FLOW STEPS - Shows clear path for users
   ═══════════════════════════════════════════════════════════════════════════ */
const userFlowSteps = [
  { num: 1, title: 'اختر البطاقة', desc: 'من القوالب الجاهزة', icon: Image, done: true },
  { num: 2, title: 'اكتب الاسم', desc: 'اسم المرسل والمستلم', icon: FileText, done: false },
  { num: 3, title: 'أنشئ الرابط', desc: 'رابط مشاركة فريد', icon: Link2, done: false },
  { num: 4, title: 'شارك البطاقة', desc: 'واتساب أو تحميل', icon: Sparkles, done: false },
]

function UserFlowGuide() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-[#3b82f6]/60 tracking-wider uppercase">مسار التصميم</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {userFlowSteps.map((step, i) => (
          <div key={step.num} className="relative">
            <div className={`p-4 rounded-xl border transition-all ${step.done
              ? 'bg-[#2563eb]/10 border-[#2563eb]/30'
              : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.done ? 'bg-[#2563eb]/20' : 'bg-white/[0.04]'
                  }`}>
                  <step.icon className={`w-4 h-4 ${step.done ? 'text-[#3b82f6]' : 'text-white/30'}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] font-bold ${step.done ? 'text-[#3b82f6]' : 'text-white/20'}`}>
                  0{step.num}
                </span>
              </div>
              <h4 className={`font-bold text-sm mb-0.5 ${step.done ? 'text-white/90' : 'text-white/50'}`}>
                {step.title}
              </h4>
              <p className="text-white/30 text-[11px]">{step.desc}</p>
            </div>
            {i < userFlowSteps.length - 1 && (
              <ChevronRight className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 text-white/10" />
            )}
          </div>
        ))}
      </div>
      <Link to="/editor" className="mt-4 flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563eb] text-white font-bold hover:bg-[#1d4ed8] transition-all shadow-lg shadow-[#2563eb]/20">
        <Sparkles className="w-4 h-4" />
        ابدأ تصميم بطاقتك
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [tab, setTab] = useState('brand')

  return (
    <div className="dashboard-shell px-4">
      <div className="dashboard-container">
        <div className="dashboard-card">
          {/* Header */}
          <div className="dashboard-header">
            <span className="dashboard-header-label">لوحة الشركات</span>
            <h1 className="dashboard-header-title">إدارة هويتك التجارية</h1>
            <p className="dashboard-header-subtitle">أنشئ بطاقات مخصصة بشعار وألوان شركتك</p>
          </div>

          {/* User Flow Guide */}
          <UserFlowGuide />

          {/* Tab bar */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`tab-dark ${tab === t.id ? 'active' : ''}`}>
                <t.icon className="w-4 h-4" strokeWidth={1.5} />
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'brand' && <BrandPanel />}
          {tab === 'config' && <ConfigPanel />}
          {tab === 'stats' && <StatsPanel />}
          {tab === 'admin' && <AdminPanel />}
          {tab === 'companies' && <AdminCompaniesPanel />}
          {tab === 'templates' && <AdminTemplatesPanel />}
          {tab === 'blog' && <AdminBlogPanel />}
          {tab === 'tickets' && <AdminTicketsPanel />}
        </div>
      </div>
    </div>
  )
}

/* ─────────── Brand Panel ─── */
function BrandPanel() {
  const ws = useWhiteLabelStore()
  const [b, setB] = useState(() => load(BRAND_KEY, {
    companyName: ws.companyName || '',
    primaryColor: ws.primaryColor || '#2563eb',
    secondaryColor: ws.secondaryColor || '#0f172a',
    logo: ws.logo || '',
    website: '',
    description: '',
  }))
  const [saved, setSaved] = useState(false)
  const u = (k, v) => setB(p => ({ ...p, [k]: v }))

  const handleLogo = e => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => u('logo', r.result)
    r.readAsDataURL(f)
  }

  const handleSave = () => {
    save(BRAND_KEY, b)
    ws.setCompanyName?.(b.companyName)
    ws.setPrimaryColor?.(b.primaryColor)
    ws.setLogo?.(b.logo)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-8">
        {/* Logo */}
        <div>
          <label className="text-white/40 text-xs font-semibold block mb-3">شعار الشركة</label>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center overflow-hidden shrink-0">
              {b.logo
                ? <img src={b.logo} alt="" className="w-full h-full object-contain p-2" />
                : <Image className="w-6 h-6 text-white/15" />
              }
            </div>
            <label className="btn-secondary-dark cursor-pointer">
              <Upload className="w-4 h-4" strokeWidth={1.5} />
              رفع شعار
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <InputField icon={Building2} label="اسم الشركة" value={b.companyName} onChange={v => u('companyName', v)} placeholder="اسم شركتك أو مؤسستك" />
          <InputField icon={FileText} label="وصف مختصر" value={b.description} onChange={v => u('description', v)} placeholder="وصف قصير يظهر في البطاقات" />
          <InputField icon={Globe} label="الموقع الإلكتروني" value={b.website} onChange={v => u('website', v)} placeholder="https://example.com" dir="ltr" />
        </div>

        {/* Colors */}
        <div>
          <label className="text-white/40 text-xs font-semibold block mb-3">ألوان العلامة التجارية</label>
          <div className="flex gap-8">
            <ColorInput label="اللون الأساسي" value={b.primaryColor} onChange={v => u('primaryColor', v)} />
            <ColorInput label="اللون الثانوي" value={b.secondaryColor} onChange={v => u('secondaryColor', v)} />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="text-white/40 text-xs font-semibold block mb-3">معاينة البطاقة</label>
          <div className="rounded-2xl border border-white/[0.08] p-10 text-center" style={{ background: b.secondaryColor }}>
            {b.logo && <img src={b.logo} alt="" className="w-14 h-14 object-contain mx-auto mb-4" />}
            <p className="text-lg font-bold mb-1" style={{ color: b.primaryColor }}>{b.companyName || 'اسم الشركة'}</p>
            <p className="text-white/40 text-sm">{b.description || 'وصف مختصر عن الشركة'}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/[0.06]">
        <button onClick={handleSave}
          className={`btn-primary ${saved ? '!bg-emerald-600' : ''}`}>
          {saved ? <><Check className="w-4 h-4" /> تم الحفظ</> : 'حفظ الهوية'}
        </button>
      </div>
    </div>
  )
}

/* ─────────── Config Panel ─── */
function ConfigPanel() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  return (
    <div className="max-w-2xl space-y-8">
      {/* API Info */}
      <div>
        <h3 className="text-white/60 text-sm font-semibold mb-4">نقاط الاتصال</h3>
        <div className="space-y-3">
          <InfoBox icon={Link2} label="عنوان API" value={`${apiUrl}/api/v1`} />
          <InfoBox icon={Upload} label="حفظ البطاقات" value={`POST ${apiUrl}/api/v1/cards`} />
          <InfoBox icon={BarChart3} label="الإحصائيات" value={`GET ${apiUrl}/api/v1/cards/public/stats`} />
        </div>
      </div>

      {/* Guide */}
      <div>
        <h3 className="text-white/60 text-sm font-semibold mb-4">دليل الربط</h3>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <p className="text-white/40 text-sm leading-[1.9] mb-5">
            اربط منصة سَلِّم بموقع شركتك عبر API. أرسل بيانات البطاقة كـ JSON إلى نقطة الحفظ وستحصل على رابط مشاركة فريد.
          </p>
          <div className="bg-[#0a1628] rounded-xl p-5 text-[12px] font-mono text-white/40 leading-[2] overflow-x-auto" dir="ltr">
            <span className="text-[#3b82f6]">POST</span> <span className="text-white/25">/api/v1/cards</span><br />
            {'{'}<br />
            {'  '}<span className="text-emerald-400/70">"senderName"</span>: <span className="text-amber-400/70">"اسم المرسل"</span>,<br />
            {'  '}<span className="text-emerald-400/70">"recipientName"</span>: <span className="text-amber-400/70">"اسم المستلم"</span>,<br />
            {'  '}<span className="text-emerald-400/70">"greetingText"</span>: <span className="text-amber-400/70">"نص التهنئة"</span>,<br />
            {'  '}<span className="text-emerald-400/70">"templateId"</span>: <span className="text-[#3b82f6]">1</span><br />
            {'}'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Stats Panel ─── */
function StatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicStats()
      .then(d => { setStats(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center gap-3 text-white/30 text-sm py-16 justify-center">
      <div className="w-5 h-5 border-2 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin" />
      جارٍ تحميل التقارير...
    </div>
  )

  if (error) return (
    <div className="py-16 text-center">
      <p className="text-white/30 text-sm mb-1">تعذّر تحميل التقارير</p>
      <p className="text-white/15 text-xs">{error}</p>
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="إجمالي البطاقات" value={stats?.totalCards ?? 0} />
        <StatCard label="إجمالي المشاهدات" value={stats?.totalViews ?? 0} />
        <StatCard label="بطاقات اليوم" value={stats?.todayCards ?? 0} />
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 text-center">
        <BarChart3 className="w-8 h-8 text-white/10 mx-auto mb-4" />
        <p className="text-white/30 text-sm mb-1">التقارير التفصيلية</p>
        <p className="text-white/15 text-xs">سيتم إضافة رسوم بيانية تفصيلية قريباً</p>
      </div>
    </div>
  )
}

/* ─────────── Admin Panel ─── */
import { getAdminCards } from '../utils/api'
function AdminPanel() {
  const [key, setKey] = useState('')
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load saved key from localStorage if exists
  useEffect(() => {
    const savedKey = localStorage.getItem('sallim_admin_key')
    if (savedKey) {
      setKey(savedKey)
      // fetchCards(savedKey) // optionally auto-fetch
    }
  }, [])

  const fetchCards = async (adminKey) => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminCards(adminKey)
      setCards(res.data || [])
      setIsAuthenticated(true)
      localStorage.setItem('sallim_admin_key', adminKey) // Save on success
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAdminKey = (e) => {
    if (e) e.preventDefault()
    fetchCards(key)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">تسجيل دخول الإدارة</h3>
        <p className="text-white/40 text-sm mb-6">الرجاء إدخال كلمة مرور الأدمن لرؤية البطاقات المصممة</p>

        <form onSubmit={handleSubmitAdminKey} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="كلمة المرور"
            className="input-dark text-center"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'جار التحقق...' : 'دخول'}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="font-bold text-lg">أحدث البطاقات ({cards.length})</h3>
          <p className="text-white/40 text-sm">البطاقات التي أنشأها المستخدمون</p>
        </div>
        <button onClick={() => fetchCards(key)} className="btn-secondary-dark text-sm py-2">
          {loading ? 'تحديث...' : 'تحديث القائمة'}
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="py-16 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <p className="text-white/40 text-sm">لا توجد بطاقات حتى الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => (
            <div key={card._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col hover:border-white/[0.12] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] bg-white/[0.04] text-white/50 px-2 py-1 rounded-md">
                  قالب {card.templateId}
                </span>
                <span className="text-[10px] text-white/30" dir="ltr">
                  {formatDate(card.createdAt)}
                </span>
              </div>

              <div className="flex-1 space-y-3 mb-4">
                {card.senderName && (
                  <div>
                    <span className="text-[10px] text-white/40 block mb-0.5">المرسل</span>
                    <span className="text-sm font-bold text-[#e2e8f0]">{card.senderName}</span>
                  </div>
                )}
                {card.recipientName && (
                  <div>
                    <span className="text-[10px] text-white/40 block mb-0.5">المستلم</span>
                    <span className="text-sm font-bold text-[#e2e8f0]">{card.recipientName}</span>
                  </div>
                )}
                <div className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                  <p className="text-[11px] text-white/60 line-clamp-3 leading-relaxed">
                    {card.mainText}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-white/30 text-[11px]">
                  <BarChart3 className="w-3 h-3" />
                  {card.viewCount} مشاهدة
                </div>
                <a
                  href={`/card/${card.shareId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#3b82f6] hover:text-[#2563eb] flex items-center gap-1"
                >
                  معاينة البطاقة <Link2 className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────── Admin Companies Panel ─── */
import { getAdminCompanies, inviteCompany, updateCompanyAsAdmin } from '../utils/api'
import toast from 'react-hot-toast'

function AdminCompaniesPanel() {
  const [key, setKey] = useState('')
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [inviteData, setInviteData] = useState({ name: '', email: '' })
  const [inviteStatus, setInviteStatus] = useState('idle')
  const [inviteMessage, setInviteMessage] = useState('')

  // State for editing a company
  const [editingCompanyId, setEditingCompanyId] = useState(null)
  const [editForm, setEditForm] = useState({ status: '', features: '' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('sallim_admin_key')
    if (savedKey) {
      setKey(savedKey)
    }
  }, [])

  const fetchCompanies = async (adminKey) => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminCompanies(adminKey)
      setCompanies(res.data || [])
      setIsAuthenticated(true)
      localStorage.setItem('sallim_admin_key', adminKey)
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    fetchCompanies(key)
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviteStatus('loading')
    setInviteMessage('')
    try {
      const res = await inviteCompany(key, inviteData)
      if (res.success) {
        setInviteStatus('success')
        setInviteMessage(res.message)
        // Refresh list
        fetchCompanies(key)
        setInviteData({ name: '', email: '' })
        setTimeout(() => setInviteMessage(''), 5000)
      }
    } catch (err) {
      setInviteStatus('error')
      setInviteMessage(err.message)
    }
  }

  const handleEditClick = (c) => {
    setEditingCompanyId(c._id)
    setEditForm({
      status: c.status,
      // Convert features array to comma-separated string for easy editing
      features: c.features ? c.features.join(', ') : ''
    })
  }

  const handleSaveEdit = async (companyId) => {
    setIsSaving(true)
    try {
      const featuresArray = editForm.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const res = await updateCompanyAsAdmin(key, companyId, {
        status: editForm.status,
        features: featuresArray
      })

      if (res.success) {
        toast.success('تم تحديث بيانات الشركة بنجاح')
        setEditingCompanyId(null)
        fetchCompanies(key)
      }
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء الحفظ')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">تسجيل دخول الإدارة</h3>
        <p className="text-white/40 text-sm mb-6">أدخل المشفر للإدارة لرؤية قسم الشركات</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="كلمة المرور" className="input-dark text-center" />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">دخول</button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Invite Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-1">دعوة شركة جديدة</h3>
        <p className="text-white/40 text-sm mb-6">سيتم إرسال بريد إلكتروني للشركة بكود التفعيل والرابط السري</p>

        {inviteMessage && (
          <div className={`p-4 rounded-xl text-sm mb-6 ${inviteStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {inviteMessage}
          </div>
        )}

        <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="text-white/40 text-xs font-semibold block mb-2">اسم الشركة</label>
            <input required type="text" className="input-dark" placeholder="شركة مثال للتجارة" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} />
          </div>
          <div className="md:col-span-5">
            <label className="text-white/40 text-xs font-semibold block mb-2">البريد الإلكتروني للإدارة</label>
            <input required type="email" className="input-dark text-left dir-ltr" placeholder="admin@example.com" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" disabled={inviteStatus === 'loading'} className="btn-primary w-full justify-center h-[52px]">
              {inviteStatus === 'loading' ? 'جاري الإرسال...' : 'إرسال دعوة'}
            </button>
          </div>
        </form>
      </div>

      {/* Companies List */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-lg">الشركات المسجلة ({companies.length})</h3>
            <p className="text-white/40 text-sm">قائمة بكل الشركات في المنصة وحالتها</p>
          </div>
          <button onClick={() => fetchCompanies(key)} className="btn-secondary-dark text-sm py-2">تحديث</button>
        </div>

        {companies.length === 0 ? (
          <div className="py-16 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <p className="text-white/40 text-sm">لا توجد شركات حتى الآن.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map(c => (
              <div key={c._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center overflow-hidden">
                      {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full object-contain p-1" alt="" /> : <Building2 className="w-5 h-5 text-white/30" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#e2e8f0]">{c.name}</h4>
                      <div className="text-[11px] text-[#3b82f6] dir-ltr mt-0.5" dir="ltr">{c.email}</div>
                    </div>
                  </div>
                  <button onClick={() => editingCompanyId === c._id ? setEditingCompanyId(null) : handleEditClick(c)} className="text-white/40 hover:text-white p-1">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {editingCompanyId === c._id ? (
                  <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-4">
                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">حالة الحساب</label>
                      <select
                        value={editForm.status}
                        onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-white/[0.02] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white/80 outline-none focus:border-[#3b82f6]"
                      >
                        <option value="pending" className="bg-[#0f172a]">معلق / بانتظار التفعيل</option>
                        <option value="active" className="bg-[#0f172a]">نشط</option>
                        <option value="banned" className="bg-[#0f172a]">محظور</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-white/40 block mb-1">المميزات (مفصول بفاصلة)</label>
                      <input
                        type="text"
                        value={editForm.features}
                        onChange={e => setEditForm(prev => ({ ...prev, features: e.target.value }))}
                        placeholder="basic_templates, premium_v1, exclusive"
                        className="w-full bg-white/[0.02] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white/80 outline-none focus:border-[#3b82f6] dir-ltr text-left"
                      />
                      <p className="text-[9px] text-white/30 mt-1">أضف كلمات مفتاحية مثل VIP لتخصيص القوالب لهم لاحقاً.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => handleSaveEdit(c._id)} disabled={isSaving} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs px-4 py-2 rounded-lg transition-colors">
                        {isSaving ? 'يتم الحفظ...' : 'حفظ التعديلات'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/[0.04]">
                    <span className={`text-[10px] px-2 py-1 rounded-md ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      c.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                      {c.status === 'active' ? 'نشط' : c.status === 'pending' ? 'بانتظار التفعيل' : 'محظور'}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-white/30 truncate max-w-[120px]" title={c.features?.join(', ')}>
                        المزايا: {c.features?.join(', ') || 'لا يوجد'}
                      </span>
                      <span className="text-[9px] text-white/20 mt-1">
                        تاريخ: {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────── Admin Templates Panel ─── */
import { getAdminTemplates, addAdminTemplate, updateAdminTemplate, deleteAdminTemplate } from '../utils/api'
import { Loader2, Trash2 } from 'lucide-react'

function AdminTemplatesPanel() {
  const [key, setKey] = useState('')
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', type: 'public', season: 'eid_al_fitr', requiredFeature: '', isActive: true
  })
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const savedKey = localStorage.getItem('sallim_admin_key')
    if (savedKey) {
      setKey(savedKey)
    }
  }, [])

  const fetchTemplates = async (adminKey) => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminTemplates(adminKey)
      setTemplates(res.data || [])
      setIsAuthenticated(true)
      localStorage.setItem('sallim_admin_key', adminKey)
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    fetchTemplates(key)
  }

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files?.[0] || null)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('يرجى اختيار صورة القالب أولاً')
      return
    }

    setIsUploading(true)
    try {
      const form = new FormData()
      form.append('image', selectedFile)
      form.append('name', formData.name)
      form.append('type', formData.type)
      form.append('season', formData.season)
      form.append('requiredFeature', formData.requiredFeature)
      form.append('isActive', formData.isActive)

      const res = await addAdminTemplate(key, form)
      if (res.success) {
        toast.success(res.message)
        // Reset form completely
        setFormData({ name: '', type: 'public', season: 'eid_al_fitr', requiredFeature: '', isActive: true })
        setSelectedFile(null)
        // Reset the file input UI
        e.target.reset()
        fetchTemplates(key)
      }
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء رفع القالب')
    } finally {
      setIsUploading(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleToggleStatus = async (template) => {
    try {
      const res = await updateAdminTemplate(key, template._id, { isActive: !template.isActive })
      if (res.success) {
        toast.success(`تم ${!template.isActive ? 'تفعيل' : 'تعطيل'} القالب بنجاح`)
        fetchTemplates(key)
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء تغيير حالة القالب')
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القالب؟ لا يمكن التراجع عن هذا الإجراء.')) return

    try {
      const res = await deleteAdminTemplate(key, templateId)
      if (res.success) {
        toast.success('تم حذف القالب بنجاح')
        fetchTemplates(key)
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء حذف القالب')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">تسجيل دخول الإدارة</h3>
        <p className="text-white/40 text-sm mb-6">أدخل المشفر للإدارة لرؤية قسم القوالب</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="كلمة المرور" className="input-dark text-center" />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">دخول</button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative">
        {isUploading && (
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-white/10">
            <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin mb-4" />
            <p className="text-white font-bold text-sm">جاري رفع القالب ومعالجته...</p>
          </div>
        )}

        <h3 className="font-bold text-lg mb-1">إضافة قالب جديد</h3>
        <p className="text-white/40 text-sm mb-6">ارفع صورة قالب جديدة وحدد صلاحياتها</p>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">اسم القالب</label>
              <input required type="text" className="input-dark w-full" placeholder="مثال: تهنئة عيد الفطر 1"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">الموسم</label>
              <select className="input-dark w-full" value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })}>
                <option value="eid_al_fitr">عيد الفطر</option>
                <option value="eid_al_adha">عيد الأضحى</option>
                <option value="ramadan">رمضان</option>
                <option value="general">عام / أخرى</option>
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">صورة القالب</label>
              <label className="btn-secondary-dark w-full justify-center cursor-pointer border-dashed border-2 py-4 border-white/10 hover:border-white/20">
                <Upload className="w-4 h-4 text-white/50" />
                <span className="text-white/70">{selectedFile ? selectedFile.name : 'اختر صورة من جهازك'}</span>
                <input required type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">نوع وتوفر القالب</label>
              <select className="input-dark w-full" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="public">عام (متاح للجميع)</option>
                <option value="premium">بريميوم (لجميع الشركات المفعلة)</option>
                <option value="exclusive">حصري (لشركات محددة برمز ميزة)</option>
              </select>
            </div>

            {formData.type === 'exclusive' && (
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-2">الميزة المطلوبة (للقوالب الحصرية)</label>
                <input required type="text" className="input-dark w-full dir-ltr text-left" placeholder="e.g VIP_ALRAJHI"
                  value={formData.requiredFeature} onChange={e => setFormData({ ...formData, requiredFeature: e.target.value })} />
                <p className="text-[10px] text-white/30 mt-1">يجب أن تحتوي الشركة على هذا الرمز في المزايا لرؤية القالب.</p>
              </div>
            )}

            <button type="submit" disabled={isUploading || !selectedFile} className="btn-primary w-full justify-center h-[52px] mt-6">
              إضافة القالب
            </button>
          </div>
        </form>
      </div>

      {/* Templates List */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-lg">مكتبة القوالب ({templates.length})</h3>
            <p className="text-white/40 text-sm">جميع القوالب المرفوعة على النظام</p>
          </div>
          <button onClick={() => fetchTemplates(key)} className="btn-secondary-dark text-sm py-2">تحديث</button>
        </div>

        {templates.length === 0 ? (
          <div className="py-16 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <p className="text-white/40 text-sm">لا توجد قوالب مرفوعة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map(t => (
              <div key={t._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col group">
                <div className="aspect-[3/4] w-full bg-[#0a1120] relative border-b border-white/[0.06] p-4 flex items-center justify-center">
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
                  {!t.isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-opacity">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">معطل</span>
                    </div>
                  )}
                  {/* Hover Actions */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleToggleStatus(t)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${t.isActive ? 'bg-amber-500/90 text-white hover:bg-amber-600' : 'bg-emerald-500/90 text-white hover:bg-emerald-600'}`}
                    >
                      {t.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(t._id)}
                      className="p-1.5 rounded bg-red-500/90 text-white hover:bg-red-600"
                      title="حذف القالب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-[#e2e8f0] mb-1 line-clamp-1" title={t.name}>{t.name}</h4>
                  <div className="flex items-center gap-2 mb-3 mt-1 flex-wrap">
                    <span className={`text-[9px] px-2 py-0.5 rounded-md border ${t.type === 'public' ? 'border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/10' :
                      t.type === 'premium' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                        'border-purple-500/30 text-purple-400 bg-purple-500/10'
                      }`}>
                      {t.type === 'public' ? 'عام' : t.type === 'premium' ? 'بريميوم' : 'حصري'}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-md border border-white/10 text-white/40 bg-white/5">
                      {t.season === 'eid_al_fitr' ? 'الفطر' : t.season === 'eid_al_adha' ? 'الأضحى' : t.season === 'ramadan' ? 'رمضان' : 'عام'}
                    </span>
                  </div>

                  {t.requiredFeature && (
                    <div className="text-[9px] text-purple-400/70 bg-purple-500/5 px-2 py-1 rounded border border-purple-500/10 mt-auto mb-2 truncate dir-ltr text-right" title={t.requiredFeature}>
                      🔑 {t.requiredFeature}
                    </div>
                  )}

                  <div className="text-[9px] text-white/30 text-left dir-ltr mt-auto pt-2 border-t border-white/[0.04]">
                    {formatDate(t.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────── Admin Blog Panel ─── */
import { getAdminBlogPosts, addAdminBlogPost, updateAdminBlogPost, deleteAdminBlogPost } from '../utils/api'

function AdminBlogPanel() {
  const [key, setKey] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', slug: '', content: '', author: 'الإدارة', status: 'published', category: 'عام'
  })
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const savedKey = localStorage.getItem('sallim_admin_key')
    if (savedKey) setKey(savedKey)
  }, [])

  const fetchPosts = async (adminKey) => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminBlogPosts(adminKey)
      setPosts(res.data || [])
      setIsAuthenticated(true)
      localStorage.setItem('sallim_admin_key', adminKey)
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    fetchPosts(key)
  }

  const handleFileSelect = (e) => setSelectedFile(e.target.files?.[0] || null)

  const handleUpload = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const form = new FormData()
      if (selectedFile) form.append('image', selectedFile)
      Object.keys(formData).forEach(k => form.append(k, formData[k]))

      const res = await addAdminBlogPost(key, form)
      if (res.success) {
        toast.success(res.message)
        setFormData({ title: '', slug: '', content: '', author: 'الإدارة', status: 'published', category: 'عام' })
        setSelectedFile(null)
        e.target.reset()
        fetchPosts(key)
      }
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء النشر')
    } finally {
      setIsUploading(false)
    }
  }

  const handleToggleStatus = async (post) => {
    try {
      const res = await updateAdminBlogPost(key, post._id, { status: post.status === 'published' ? 'draft' : 'published' })
      if (res.success) {
        toast.success(`تم ${post.status === 'draft' ? 'نشر' : 'إخفاء'} المقال`)
        fetchPosts(key)
      }
    } catch (err) {
      toast.error('حدث خطأ')
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('موافق على حذف المقال؟')) return
    try {
      const res = await deleteAdminBlogPost(key, postId)
      if (res.success) {
        toast.success('تم الحذف')
        fetchPosts(key)
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء الحذف')
    }
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">إدارة المدونة</h3>
        <p className="text-white/40 text-sm mb-6">أدخل الرمز السري للإدارة</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="كلمة المرور" className="input-dark text-center" />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">دخول</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative">
        {isUploading && (
          <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl border border-white/10">
            <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin mb-4" />
          </div>
        )}

        <h3 className="font-bold text-lg mb-4">كتابة مقال جديد</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">عنوان المقال</label>
              <input required type="text" className="input-dark w-full" value={formData.title} onChange={e => {
                const title = e.target.value
                const slug = title.trim().toLowerCase().replace(/\s+/g, '-')
                setFormData({ ...formData, title, slug: formData.slug || slug })
              }} />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">رابط المقال (Slug)</label>
              <input required type="text" className="input-dark w-full dir-ltr text-left" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">القسم</label>
              <input required type="text" className="input-dark w-full" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs font-semibold block mb-2">محتوى المقال</label>
              <textarea required className="input-dark w-full min-h-[140px] resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-white/40 text-xs font-semibold block mb-2">صورة الغلاف (اختياري)</label>
                <label className="btn-secondary-dark w-full justify-center cursor-pointer border-dashed border-2 py-3 border-white/10">
                  <Upload className="w-4 h-4 text-white/50" />
                  <span className="text-white/70 text-xs">{selectedFile ? selectedFile.name : 'الصورة'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
              <div className="flex-1">
                <label className="text-white/40 text-xs font-semibold block mb-2">الحالة</label>
                <select className="input-dark w-full" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={isUploading} className="btn-primary w-full justify-center mt-2">نشر المقال</button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
          <h3 className="font-bold text-lg">المقالات ({posts.length})</h3>
          <button onClick={() => fetchPosts(key)} className="btn-secondary-dark text-sm py-2">تحديث</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex gap-4 items-center group">
              {post.imageUrl && (
                <img src={post.imageUrl} alt="" className="w-20 h-20 object-cover rounded-xl" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#e2e8f0] truncate">{post.title}</h4>
                <div className="text-[10px] text-white/40 mt-1 flex gap-3">
                  <span>{post.category}</span>
                  <span>👀 {post.views}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleToggleStatus(post)} className={`text-[10px] px-2 py-1 rounded ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {post.status === 'published' ? 'منشور' : 'مسودة'}
                  </button>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-[10px] px-2 py-1 rounded bg-[#3b82f6]/20 text-[#3b82f6] flex items-center gap-1">
                    معاينة <Link2 className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <button onClick={() => handleDelete(post._id)} className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────── Admin Tickets Panel ─── */

function AdminTicketsPanel() {
  const [key, setKey] = useState('')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [view, setView] = useState('list')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMsg, setReplyMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('sallim_admin_key')
    if (savedKey) setKey(savedKey)
  }, [])

  const fetchTickets = async (adminKey) => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminTickets(adminKey)
      setTickets(res.data || [])
      setIsAuthenticated(true)
      localStorage.setItem('sallim_admin_key', adminKey)
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    fetchTickets(key)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyMsg.trim()) return
    setIsSubmitting(true)
    try {
      const res = await adminReplyToTicket(key, selectedTicket._id, replyMsg)
      toast.success('تم إرسال الرد')
      setReplyMsg('')
      setSelectedTicket(res.data)
      fetchTickets(key)
    } catch (err) {
      toast.error('حدث خطأ أثناء إرسال الرد')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async (status) => {
    try {
      const res = await updateAdminTicketStatus(key, selectedTicket._id, status)
      toast.success('تم تحديث حالة التذكرة')
      setSelectedTicket(res.data)
      fetchTickets(key)
    } catch (err) {
      toast.error('حدث خطأ أثناء التحديث')
    }
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">تذاكر الدعم والطلبات</h3>
        <p className="text-white/40 text-sm mb-6">أدخل الرمز السري للإدارة</p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="كلمة المرور" className="input-dark text-center" />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">دخول</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <h3 className="font-bold text-lg">
          {view === 'list' ? `جميع التذاكر والطلبات (${tickets.length})` : `تذكرة: ${selectedTicket?.subject}`}
        </h3>
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <button onClick={() => setView('list')} className="btn-secondary-dark text-sm py-2">العودة للقائمة</button>
          )}
          {view === 'list' && (
            <button onClick={() => fetchTickets(key)} className="btn-secondary-dark text-sm py-2">تحديث</button>
          )}
        </div>
      </div>

      {view === 'list' && (
        <div className="space-y-3 flex-1">
          {tickets.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <p className="text-white/40 text-sm">لا توجد تذاكر حالياً.</p>
            </div>
          ) : (
            tickets.map(t => (
              <div key={t._id} onClick={() => { setSelectedTicket(t); setView('ticket'); }} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer transition-all flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {t.subject}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.type === 'custom_design' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                      {t.type === 'custom_design' ? 'طلب تصميم' : 'دعم عام'}
                    </span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="flex items-center gap-1 font-bold text-white/70">
                      {t.company?.name || 'شركة غير معروفة'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(t.createdAt)}</span>
                  </div>
                </div>
                <div className={`text-[10px] px-3 py-1 rounded-lg font-bold ${t.status === 'open' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  t.status === 'answered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                  {t.status === 'open' ? 'بانتظار ردك (مفتوحة)' : t.status === 'answered' ? 'تم الرد' : 'مغلقة'}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'ticket' && selectedTicket && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col flex-1 relative overflow-hidden">
          {/* Ticket Info Bar */}
          <div className="bg-white/[0.04] p-4 border-b border-white/[0.06] flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/50">الشركة:</span>
              <strong className="text-white">{selectedTicket.company?.name}</strong>
              <span className="text-white/30 text-xs">({selectedTicket.company?.email})</span>
            </div>
            {selectedTicket.status !== 'closed' ? (
              <button onClick={() => handleUpdateStatus('closed')} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-[11px] font-bold transition-colors">
                إغلاق التذكرة
              </button>
            ) : (
              <button onClick={() => handleUpdateStatus('open')} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-bold transition-colors">
                إعادة فتح التذكرة
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px]">
            {selectedTicket.replies.map((reply, i) => {
              const isAdminUser = reply.sender === 'admin';
              return (
                <div key={i} className={`flex ${isAdminUser ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${isAdminUser ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                    <div className="text-xs font-bold mb-2 opacity-50">{isAdminUser ? 'الإدارة' : selectedTicket.company?.name}</div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{reply.message}</div>
                    <div className={`text-[10px] mt-2 opacity-40 text-left`} dir="ltr">{formatDate(reply.createdAt)}</div>
                  </div>
                </div>
              )
            })}
          </div>
          {selectedTicket.status !== 'closed' ? (
            <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] mt-auto">
              <form onSubmit={handleReply} className="flex gap-3">
                <input required type="text" className="flex-1 input-dark" placeholder="اكتب ردك هنا للشركة..." value={replyMsg} onChange={e => setReplyMsg(e.target.value)} />
                <button type="submit" disabled={isSubmitting} className="btn-primary px-6">إرسال الرد</button>
              </form>
            </div>
          ) : (
            <div className="p-6 bg-white/[0.02] border-t border-white/[0.06] mt-auto text-center text-sm text-red-400/80">
              هذه التذكرة مغلقة. للإرسال، قم بإعادة فتحها أولاً.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══ Shared Components ═══ */
function InputField({ icon: Icon, label, value, onChange, placeholder, dir }) {
  return (
    <div>
      <label className="text-white/40 text-xs font-semibold block mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" strokeWidth={1.5} />}
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
          className={`input-dark ${Icon ? 'pr-11' : ''}`} />
      </div>
    </div>
  )
}

function ColorInput({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-xl border border-white/[0.08] cursor-pointer bg-transparent" />
      <div>
        <span className="text-white/50 text-xs block">{label}</span>
        <span className="text-white/25 text-[11px] font-mono">{value}</span>
      </div>
    </div>
  )
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4">
      <Icon className="w-4 h-4 text-[#3b82f6]/50 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="text-white/30 text-[10px] mb-0.5">{label}</p>
        <p className="text-white/50 text-xs font-mono truncate" dir="ltr">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-white/30 text-xs mb-2">{label}</p>
      <p className="text-white/90 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
