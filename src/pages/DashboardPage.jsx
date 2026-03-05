import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Palette, Settings, BarChart3, Upload, Image,
  Check, Globe, Building2, FileText, Link2,
  ArrowLeft, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react'
import { useWhiteLabelStore } from '../store'
import { getPublicStats } from '../utils/api'

const BRAND_KEY = 'sallim_company_brand'

function load(key, fb = {}) {
  try { return JSON.parse(localStorage.getItem(key)) || fb }
  catch { return fb }
}
function save(key, v) { localStorage.setItem(key, JSON.stringify(v)) }

const tabs = [
  { id: 'brand',  label: 'هوية الشركة', icon: Palette },
  { id: 'config', label: 'إعدادات API',  icon: Settings },
  { id: 'stats',  label: 'التقارير',     icon: BarChart3 },
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
            <div className={`p-4 rounded-xl border transition-all ${
              step.done 
                ? 'bg-[#2563eb]/10 border-[#2563eb]/30' 
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  step.done ? 'bg-[#2563eb]/20' : 'bg-white/[0.04]'
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

          {tab === 'brand'  && <BrandPanel />}
          {tab === 'config' && <ConfigPanel />}
          {tab === 'stats'  && <StatsPanel />}
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
            <span className="text-[#3b82f6]">POST</span> <span className="text-white/25">/api/v1/cards</span><br/>
            {'{'}<br/>
            {'  '}<span className="text-emerald-400/70">"senderName"</span>: <span className="text-amber-400/70">"اسم المرسل"</span>,<br/>
            {'  '}<span className="text-emerald-400/70">"recipientName"</span>: <span className="text-amber-400/70">"اسم المستلم"</span>,<br/>
            {'  '}<span className="text-emerald-400/70">"greetingText"</span>: <span className="text-amber-400/70">"نص التهنئة"</span>,<br/>
            {'  '}<span className="text-emerald-400/70">"templateId"</span>: <span className="text-[#3b82f6]">1</span><br/>
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
