import { useState, useEffect } from 'react'
import {
  BsBuilding, BsPalette, BsBarChart, BsGear,
  BsCheck2, BsUpload, BsImage,
} from 'react-icons/bs'
import { useWhiteLabelStore } from '../store'
import { getPublicStats } from '../utils/api'

/* ═══ localStorage key ═══ */
const BRAND_KEY = 'sallim_company_brand'

function load(key, fallback = {}) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback }
  catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

/* ═══ Tabs ═══ */
const tabs = [
  { id: 'brand',   label: 'هوية الشركة', icon: <BsPalette /> },
  { id: 'config',  label: 'إعدادات API',  icon: <BsGear /> },
  { id: 'stats',   label: 'التقارير',     icon: <BsBarChart /> },
]

/* ═══════════════════════════════════════════ */
/* DashboardPage — لوحة تحكم الشركات          */
/* ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const [tab, setTab] = useState('brand')

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gold-500/60 text-xs tracking-[0.15em] mb-2">COMPANIES</p>
          <h1 className="text-2xl font-bold text-white/90">لوحة الشركات</h1>
          <p className="text-gray-600 text-sm mt-2">إدارة هوية شركتك وربطها بمنصة سَلِّم</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-10 border-b border-white/[0.04] overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-gray-600 hover:text-gray-400'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === 'brand'  && <BrandPanel />}
        {tab === 'config' && <ConfigPanel />}
        {tab === 'stats'  && <CompanyStatsPanel />}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Brand Panel — هوية الشركة                   */
/* ─────────────────────────────────────────── */
function BrandPanel() {
  const whiteLabelStore = useWhiteLabelStore()
  const [brand, setBrand] = useState(() => load(BRAND_KEY, {
    companyName: whiteLabelStore.companyName || '',
    primaryColor: whiteLabelStore.primaryColor || '#b8963a',
    secondaryColor: whiteLabelStore.secondaryColor || '#1a1b2e',
    logo: whiteLabelStore.logo || '',
    website: '',
    description: '',
  }))
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setBrand(prev => ({ ...prev, [key]: val }))

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('logo', reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    save(BRAND_KEY, brand)
    // Update Zustand store too
    whiteLabelStore.setCompanyName?.(brand.companyName)
    whiteLabelStore.setPrimaryColor?.(brand.primaryColor)
    whiteLabelStore.setLogo?.(brand.logo)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-8">
        {/* Logo */}
        <div>
          <label className="text-gray-500 text-xs block mb-3">شعار الشركة</label>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center overflow-hidden shrink-0">
              {brand.logo ? (
                <img src={brand.logo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <BsImage className="text-2xl text-gray-800" />
              )}
            </div>
            <label className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 text-sm cursor-pointer hover:bg-white/[0.05] transition-colors">
              <BsUpload className="text-xs" />
              رفع شعار
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Company info */}
        <div className="space-y-5">
          <InputField label="اسم الشركة" value={brand.companyName} onChange={v => update('companyName', v)} placeholder="اسم شركتك أو مؤسستك" />
          <InputField label="وصف مختصر" value={brand.description} onChange={v => update('description', v)} placeholder="وصف قصير يظهر في البطاقات" />
          <InputField label="الموقع الإلكتروني" value={brand.website} onChange={v => update('website', v)} placeholder="https://example.com" dir="ltr" />
        </div>

        {/* Colors */}
        <div>
          <label className="text-gray-500 text-xs block mb-3">ألوان العلامة التجارية</label>
          <div className="flex gap-6">
            <ColorPicker label="اللون الأساسي" value={brand.primaryColor} onChange={v => update('primaryColor', v)} />
            <ColorPicker label="اللون الثانوي" value={brand.secondaryColor} onChange={v => update('secondaryColor', v)} />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="text-gray-500 text-xs block mb-3">معاينة الهوية</label>
          <div
            className="rounded-xl border border-white/[0.06] p-8 text-center"
            style={{ background: brand.secondaryColor }}
          >
            {brand.logo && (
              <img src={brand.logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
            )}
            <p className="text-lg font-bold mb-1" style={{ color: brand.primaryColor }}>
              {brand.companyName || 'اسم الشركة'}
            </p>
            <p className="text-gray-500 text-sm">{brand.description || 'وصف مختصر'}</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-10 pt-6 border-t border-white/[0.04]">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-bold transition-all ${
            saved
              ? 'bg-green-500/10 text-green-400'
              : 'bg-gold-500 text-[#08090d] hover:bg-gold-400'
          }`}
        >
          {saved ? <><BsCheck2 /> تم الحفظ</> : 'حفظ الهوية'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Config Panel — إعدادات API                   */
/* ─────────────────────────────────────────── */
function ConfigPanel() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  return (
    <div className="max-w-2xl">
      <div className="space-y-8">
        {/* API Info */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold mb-4">معلومات الاتصال</h3>
          <div className="space-y-4">
            <ReadOnlyField label="عنوان API" value={`${apiUrl}/api/v1`} />
            <ReadOnlyField label="نقطة حفظ البطاقات" value={`POST ${apiUrl}/api/v1/cards`} />
            <ReadOnlyField label="نقطة الإحصائيات" value={`GET ${apiUrl}/api/v1/cards/public/stats`} />
          </div>
        </div>

        {/* Integration Guide */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold mb-4">دليل الربط</h3>
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6">
            <p className="text-gray-400 text-sm leading-[1.8] mb-4">
              يمكنك ربط منصة سَلِّم بموقع شركتك عبر API. أرسل بيانات البطاقة كـ JSON إلى نقطة الحفظ وستحصل على رابط مشاركة فريد.
            </p>
            <div className="bg-[#08090d] rounded-lg p-4 text-xs font-mono text-gray-500 leading-[1.8] overflow-x-auto" dir="ltr">
              <span className="text-gold-400">POST</span> /api/v1/cards<br/>
              {'{'}<br/>
              {'  '}<span className="text-green-400">"senderName"</span>: "اسم المرسل",<br/>
              {'  '}<span className="text-green-400">"recipientName"</span>: "اسم المستلم",<br/>
              {'  '}<span className="text-green-400">"greetingText"</span>: "نص التهنئة",<br/>
              {'  '}<span className="text-green-400">"templateId"</span>: 1<br/>
              {'}'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Company Stats Panel                         */
/* ─────────────────────────────────────────── */
function CompanyStatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-600 text-sm py-12">
        <div className="w-4 h-4 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        جارٍ تحميل التقارير...
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <p className="text-gray-600 text-sm mb-2">تعذّر تحميل التقارير</p>
        <p className="text-gray-700 text-xs">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="إجمالي البطاقات" value={stats?.totalCards ?? 0} />
        <StatCard label="إجمالي المشاهدات" value={stats?.totalViews ?? 0} />
        <StatCard label="بطاقات اليوم" value={stats?.todayCards ?? 0} />
      </div>

      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-8 text-center">
        <BsBarChart className="text-3xl text-gray-800 mx-auto mb-4" />
        <p className="text-gray-600 text-sm mb-1">التقارير التفصيلية</p>
        <p className="text-gray-700 text-xs">سيتم إضافة رسوم بيانية تفصيلية في التحديث القادم</p>
      </div>
    </div>
  )
}

/* ─── Shared Components ─── */

function InputField({ label, value, onChange, placeholder, dir }) {
  return (
    <div>
      <label className="text-gray-500 text-xs block mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 outline-none focus:border-gold-500/30 transition-colors placeholder-gray-700"
      />
    </div>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="text-gray-500 text-xs block mb-2">{label}</label>
      <div className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-2.5 text-sm text-gray-500 font-mono" dir="ltr">
        {value}
      </div>
    </div>
  )
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <span className="text-gray-600 text-xs block mb-2">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
        />
        <span className="text-gray-600 text-xs font-mono">{value}</span>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
      <p className="text-gray-600 text-xs mb-2">{label}</p>
      <p className="text-white/90 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
