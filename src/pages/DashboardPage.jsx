import { useState, useEffect } from 'react'
import {
  Palette, Settings, BarChart3, Upload, Image,
  Check, Globe, Building2, FileText, Link2,
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

/* ═══════════════════════════════ */
/* DASHBOARD PAGE                 */
/* ═══════════════════════════════ */
export default function DashboardPage() {
  const [tab, setTab] = useState('brand')

  return (
    <div className="page-shell pb-24 px-4">
      <div className="max-w-6xl mx-auto rounded-[2rem] bg-[#0F172A] border border-[#1E293B] p-5 sm:p-8 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
        {/* Header */}
        <div className="mb-8">
          <span className="text-purple-500/40 text-[11px] font-bold tracking-[0.2em] uppercase">COMPANIES</span>
          <h1 className="text-3xl font-bold text-white/90 mt-1">لوحة الشركات</h1>
          <p className="text-white/55 text-sm mt-2">إدارة هوية شركتك وربطها بمنصة سَلِّم</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[#6A47ED]/15 text-[#C6F806] border border-[#6A47ED]/30 shadow-sm shadow-[#6A47ED]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
              }`}>
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
  )
}

/* ─────────── Brand ─── */
function BrandPanel() {
  const ws = useWhiteLabelStore()
  const [b, setB] = useState(() => load(BRAND_KEY, {
    companyName: ws.companyName || '',
    primaryColor: ws.primaryColor || '#6A47ED',
    secondaryColor: ws.secondaryColor || '#17012C',
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
      <div className="space-y-10">
        {/* Logo */}
        <div>
          <label className="text-white/30 text-xs block mb-3">شعار الشركة</label>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl border border-white/[0.05] bg-white/[0.015] flex items-center justify-center overflow-hidden shrink-0">
              {b.logo
                ? <img src={b.logo} alt="" className="w-full h-full object-contain p-2" />
                : <Image className="w-6 h-6 text-white/10" />
              }
            </div>
            <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/30 text-sm cursor-pointer hover:bg-white/[0.04] hover:text-white/50 transition-all">
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
              رفع شعار
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <InputField icon={Building2} label="اسم الشركة" value={b.companyName} onChange={v => u('companyName', v)} placeholder="اسم شركتك أو مؤسستك" />
          <InputField icon={FileText} label="وصف مختصر" value={b.description} onChange={v => u('description', v)} placeholder="وصف قصير يظهر في البطاقات" />
          <InputField icon={Globe} label="الموقع الإلكتروني" value={b.website} onChange={v => u('website', v)} placeholder="https://example.com" dir="ltr" />
        </div>

        {/* Colors */}
        <div>
          <label className="text-white/30 text-xs block mb-3">ألوان العلامة التجارية</label>
          <div className="flex gap-8">
            <ColorInput label="أساسي" value={b.primaryColor} onChange={v => u('primaryColor', v)} />
            <ColorInput label="ثانوي" value={b.secondaryColor} onChange={v => u('secondaryColor', v)} />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="text-white/30 text-xs block mb-3">معاينة</label>
          <div className="rounded-2xl border border-white/[0.05] p-10 text-center" style={{ background: b.secondaryColor }}>
            {b.logo && <img src={b.logo} alt="" className="w-14 h-14 object-contain mx-auto mb-4" />}
            <p className="text-lg font-bold mb-1" style={{ color: b.primaryColor }}>{b.companyName || 'اسم الشركة'}</p>
            <p className="text-white/30 text-sm">{b.description || 'وصف مختصر'}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/[0.04]">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            saved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gradient-to-l from-purple-600 to-purple-500 text-[#17012C] hover:from-purple-500 hover:to-purple-400 shadow-sm shadow-purple-500/10'
          }`}>
          {saved ? <><Check className="w-4 h-4" /> تم الحفظ</> : 'حفظ الهوية'}
        </button>
      </div>
    </div>
  )
}

/* ─────────── Config ─── */
function ConfigPanel() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  return (
    <div className="max-w-2xl space-y-10">
      {/* API Info */}
      <div>
        <h3 className="text-white/60 text-sm font-semibold mb-5">نقاط الاتصال</h3>
        <div className="space-y-3">
          <InfoBox icon={Link2} label="عنوان API" value={`${apiUrl}/api/v1`} />
          <InfoBox icon={Upload} label="حفظ البطاقات" value={`POST ${apiUrl}/api/v1/cards`} />
          <InfoBox icon={BarChart3} label="الإحصائيات" value={`GET ${apiUrl}/api/v1/cards/public/stats`} />
        </div>
      </div>

      {/* Guide */}
      <div>
        <h3 className="text-white/60 text-sm font-semibold mb-5">دليل الربط</h3>
        <div className="bg-white/[0.015] border border-white/[0.04] rounded-2xl p-6">
          <p className="text-white/30 text-sm leading-[1.9] mb-5">
            اربط منصة سَلِّم بموقع شركتك عبر API. أرسل بيانات البطاقة كـ JSON إلى نقطة الحفظ وستحصل على رابط مشاركة فريد.
          </p>
          <div className="bg-[#17012C] rounded-xl p-5 text-[12px] font-mono text-white/30 leading-[2] overflow-x-auto" dir="ltr">
            <span className="text-purple-400/70">POST</span> <span className="text-white/20">/api/v1/cards</span><br/>
            {'{'}<br/>
            {'  '}<span className="text-emerald-400/50">"senderName"</span>: <span className="text-amber-400/50">"اسم المرسل"</span>,<br/>
            {'  '}<span className="text-emerald-400/50">"recipientName"</span>: <span className="text-amber-400/50">"اسم المستلم"</span>,<br/>
            {'  '}<span className="text-emerald-400/50">"greetingText"</span>: <span className="text-amber-400/50">"نص التهنئة"</span>,<br/>
            {'  '}<span className="text-emerald-400/50">"templateId"</span>: <span className="text-blue-400/50">1</span><br/>
            {'}'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Company Stats ─── */
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
    <div className="flex items-center gap-3 text-white/20 text-sm py-16 justify-center">
      <div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
      جارٍ التحميل...
    </div>
  )

  if (error) return (
    <div className="py-16 text-center">
      <p className="text-white/25 text-sm mb-1">تعذّر تحميل التقارير</p>
      <p className="text-white/10 text-xs">{error}</p>
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <StatCard label="إجمالي البطاقات" value={stats?.totalCards ?? 0} />
        <StatCard label="إجمالي المشاهدات" value={stats?.totalViews ?? 0} />
        <StatCard label="بطاقات اليوم"     value={stats?.todayCards ?? 0} />
      </div>

      <div className="bg-white/[0.015] border border-white/[0.04] rounded-2xl p-10 text-center">
        <BarChart3 className="w-8 h-8 text-white/5 mx-auto mb-4" />
        <p className="text-white/25 text-sm mb-1">التقارير التفصيلية</p>
        <p className="text-white/10 text-xs">سيتم إضافة رسوم بيانية تفصيلية في التحديث القادم</p>
      </div>
    </div>
  )
}

/* ═══ Shared ═══ */
function InputField({ icon: Icon, label, value, onChange, placeholder, dir }) {
  return (
    <div>
      <label className="text-white/30 text-xs block mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10" strokeWidth={1.5} />}
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
          className={`w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2.5 text-sm text-white/70 outline-none focus:border-purple-500/20 transition-colors placeholder-white/10 ${Icon ? 'px-11' : 'px-4'}`} />
      </div>
    </div>
  )
}

function ColorInput({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-xl border border-white/[0.05] cursor-pointer bg-transparent" />
      <div>
        <span className="text-white/40 text-xs block">{label}</span>
        <span className="text-white/20 text-[11px] font-mono">{value}</span>
      </div>
    </div>
  )
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.015] border border-white/[0.04] rounded-xl px-5 py-3.5">
      <Icon className="w-4 h-4 text-purple-500/30 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="text-white/20 text-[10px] mb-0.5">{label}</p>
        <p className="text-white/40 text-xs font-mono truncate" dir="ltr">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/[0.015] border border-white/[0.04] rounded-2xl p-5">
      <p className="text-white/20 text-xs mb-2">{label}</p>
      <p className="text-white/80 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
