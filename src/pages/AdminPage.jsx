import { useState, useRef, useEffect, useCallback } from 'react'
import {
  LayoutGrid, FileText, Settings, BarChart3,
  Upload, Trash2, Plus, X, Image, Check,
  Palette, Mail, Phone, Globe,
} from 'lucide-react'
import { templates } from '../data/templates'
import { textCategories, greetingTexts } from '../data/texts'
import { getPublicStats } from '../utils/api'

/* ═══ Storage ═══ */
const TEMPLATES_KEY = 'sallim_uploaded_templates'
const TEXTS_KEY    = 'sallim_custom_texts'
const SETTINGS_KEY = 'sallim_settings'

function load(key, fb) {
  try { return JSON.parse(localStorage.getItem(key)) || fb }
  catch { return fb }
}
function save(key, v) { localStorage.setItem(key, JSON.stringify(v)) }

/* ═══ Tab definitions ═══ */
const tabs = [
  { id: 'templates', label: 'القوالب',    icon: LayoutGrid },
  { id: 'texts',     label: 'النصوص',     icon: FileText },
  { id: 'settings',  label: 'الإعدادات',  icon: Settings },
  { id: 'stats',     label: 'الإحصائيات', icon: BarChart3 },
]

/* ═══ Tab Button ═══ */
function Tab({ active, icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap ${
      active
        ? 'bg-[#6A47ED]/15 text-[#C6F806] border border-[#6A47ED]/30 shadow-sm shadow-[#6A47ED]/20'
        : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
    }`}>
      <Icon className="w-4 h-4" strokeWidth={1.5} />
      {label}
    </button>
  )
}

/* ═══════════════════════════════ */
/* ADMIN PAGE                     */
/* ═══════════════════════════════ */
export default function AdminPage() {
  const [tab, setTab] = useState('templates')

  return (
    <div className="page-shell pb-24 px-4">
      <div className="max-w-6xl mx-auto rounded-[2rem] bg-[#0F172A] border border-[#1E293B] p-5 sm:p-8 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
        {/* Header */}
        <div className="mb-8">
          <span className="text-purple-500/40 text-[11px] font-bold tracking-[0.2em] uppercase">ADMIN</span>
          <h1 className="text-3xl font-bold text-white/90 mt-1">لوحة التحكم</h1>
          <p className="text-white/55 text-sm mt-2">إدارة القوالب والنصوص وإعدادات الموقع</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.map(t => (
            <Tab key={t.id} active={tab === t.id} icon={t.icon} label={t.label} onClick={() => setTab(t.id)} />
          ))}
        </div>

        {/* Panels */}
        {tab === 'templates' && <TemplatesPanel />}
        {tab === 'texts' && <TextsPanel />}
        {tab === 'settings' && <SettingsPanel />}
        {tab === 'stats' && <StatsPanel />}
      </div>
    </div>
  )
}

/* ─────────────────────────── Templates ─── */
function TemplatesPanel() {
  const [uploaded, setUploaded] = useState(() => load(TEMPLATES_KEY, []))
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader()
      r.onload = () => res({
        id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: f.name.replace(/\.[^.]+$/, ''),
        image: r.result,
        textColor: '#ffffff',
        uploadedAt: new Date().toISOString(),
      })
      r.readAsDataURL(f)
    }))
    Promise.all(readers).then(t => {
      const u = [...uploaded, ...t]
      setUploaded(u)
      save(TEMPLATES_KEY, u)
      setUploading(false)
    })
    e.target.value = ''
  }, [uploaded])

  const del = useCallback(id => {
    const u = uploaded.filter(t => t.id !== id)
    setUploaded(u)
    save(TEMPLATES_KEY, u)
  }, [uploaded])

  const all = [...templates, ...uploaded]

  return (
    <div>
      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="group border-2 border-dashed border-white/[0.05] hover:border-purple-500/20 rounded-2xl p-12 text-center cursor-pointer transition-all mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] group-hover:bg-purple-500/[0.06] flex items-center justify-center mx-auto mb-4 transition-colors">
          <Upload className="w-5 h-5 text-white/20 group-hover:text-purple-400 transition-colors" strokeWidth={1.5} />
        </div>
        <p className="text-white/40 text-sm mb-1">{uploading ? 'جارٍ الرفع...' : 'اسحب الصور هنا أو اضغط للرفع'}</p>
        <p className="text-white/15 text-xs">PNG, JPG, WebP — حتى 5MB</p>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleUpload} className="hidden" />
      </div>

      <p className="text-white/20 text-sm mb-6">{all.length} قالب — {uploaded.length} مرفوع يدوياً</p>

      {all.length === 0 ? (
        <Empty icon={Image} text="لا توجد قوالب بعد" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {all.map(t => (
            <div key={t.id} className="group relative rounded-2xl overflow-hidden bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-all">
              <div className="aspect-square relative">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
                <div className="w-full h-full items-center justify-center bg-white/[0.02] hidden absolute inset-0">
                  <Image className="w-6 h-6 text-white/10" />
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-white/30 text-xs truncate">{t.name}</span>
                {String(t.id).startsWith('upload_') && (
                  <button onClick={() => del(t.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1" title="حذف">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────── Texts ─── */
function TextsPanel() {
  const [custom, setCustom] = useState(() => load(TEXTS_KEY, []))
  const [expandedCat, setExpandedCat] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('formal')

  const allTexts = [...greetingTexts, ...custom]

  const add = () => {
    if (!newText.trim()) return
    const u = [...custom, { id: `custom_${Date.now()}`, category: newCat, text: newText.trim(), tags: ['مخصص'], custom: true }]
    setCustom(u)
    save(TEXTS_KEY, u)
    setNewText('')
    setShowAdd(false)
  }

  const del = id => {
    const u = custom.filter(t => t.id !== id)
    setCustom(u)
    save(TEXTS_KEY, u)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-white/20 text-sm">{allTexts.length} نص — {custom.length} مخصص</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showAdd ? 'bg-white/[0.03] text-white/40' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/15'
          }`}>
          {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAdd ? 'إلغاء' : 'إضافة نص'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.015] border border-white/[0.05]">
          <div className="mb-4">
            <label className="text-white/30 text-xs block mb-2">التصنيف</label>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-white/70 outline-none focus:border-purple-500/25 transition-colors">
              {textCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-white/30 text-xs block mb-2">النص</label>
            <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="اكتب نص التهنئة..." rows={4}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white/70 outline-none focus:border-purple-500/25 resize-none placeholder-white/15 transition-colors" />
          </div>
          <button onClick={add} disabled={!newText.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-purple-600 to-purple-500 text-[#17012C] text-sm font-bold hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
            حفظ النص
          </button>
        </div>
      )}

      <div className="space-y-2">
        {textCategories.map(cat => {
          const catTexts = allTexts.filter(t => t.category === cat.id)
          const open = expandedCat === cat.id
          return (
            <div key={cat.id} className="border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/[0.06] transition-colors">
              <button onClick={() => setExpandedCat(open ? null : cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-right">
                <span className="text-white/70 text-sm font-medium">{cat.label}</span>
                <span className="text-white/15 text-xs tabular-nums">{catTexts.length}</span>
              </button>
              {open && (
                <div className="border-t border-white/[0.03]">
                  {catTexts.length === 0
                    ? <p className="px-5 py-8 text-white/15 text-sm text-center">لا توجد نصوص</p>
                    : catTexts.map(t => (
                        <div key={t.id} className="flex items-start gap-3 px-5 py-4 border-b border-white/[0.02] last:border-0">
                          <p className="flex-1 text-white/35 text-sm leading-[1.9]">{t.text}</p>
                          {t.custom && (
                            <button onClick={() => del(t.id)} className="text-white/15 hover:text-red-400 transition-colors p-1 shrink-0 mt-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Settings ─── */
function SettingsPanel() {
  const [s, setS] = useState(() => load(SETTINGS_KEY, {
    siteName: 'سَلِّم',
    siteTagline: 'صمّم بطاقة تهنئة العيد وأرسلها لأحبابك',
    primaryColor: '#6A47ED',
    contactWhatsApp: '',
    contactEmail: '',
    footerText: 'تابع لمؤسسة سليمان',
  }))
  const [saved, setSaved] = useState(false)
  const u = (k, v) => setS(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    save(SETTINGS_KEY, s)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-10">
        {/* Identity */}
        <Section title="هوية الموقع">
          <Field icon={Globe} label="اسم الموقع" value={s.siteName} onChange={v => u('siteName', v)} />
          <Field icon={FileText} label="الوصف المختصر" value={s.siteTagline} onChange={v => u('siteTagline', v)} />
          <div>
            <label className="text-white/30 text-xs block mb-2">اللون الأساسي</label>
            <div className="flex items-center gap-3">
              <input type="color" value={s.primaryColor} onChange={e => u('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-xl border border-white/[0.05] cursor-pointer bg-transparent" />
              <span className="text-white/30 text-sm font-mono">{s.primaryColor}</span>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="معلومات التواصل">
          <Field icon={Phone} label="رقم واتساب" value={s.contactWhatsApp} onChange={v => u('contactWhatsApp', v)} placeholder="966XXXXXXXXX" dir="ltr" />
          <Field icon={Mail} label="البريد الإلكتروني" value={s.contactEmail} onChange={v => u('contactEmail', v)} placeholder="info@example.com" dir="ltr" />
        </Section>

        {/* Footer */}
        <Section title="التذييل">
          <Field icon={FileText} label="نص التذييل" value={s.footerText} onChange={v => u('footerText', v)} />
        </Section>
      </div>

      <div className="mt-10 pt-6 border-t border-white/[0.04]">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            saved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gradient-to-l from-purple-600 to-purple-500 text-[#17012C] hover:from-purple-500 hover:to-purple-400 shadow-sm shadow-purple-500/10'
          }`}>
          {saved ? <><Check className="w-4 h-4" /> تم الحفظ</> : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────── Stats ─── */
function StatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicStats()
      .then(d => { setStats(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const uploadedCount = load(TEMPLATES_KEY, []).length
  const customTextsCount = load(TEXTS_KEY, []).length

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <Stat label="قوالب مرفوعة"   value={uploadedCount} />
        <Stat label="نصوص مخصصة"     value={customTextsCount} />
        <Stat label="قوالب افتراضية"  value={templates.length} />
        <Stat label="نصوص جاهزة"     value={greetingTexts.length} />
      </div>

      <div className="border-t border-white/[0.04] pt-8">
        <h3 className="text-white/60 text-sm font-semibold mb-6">إحصائيات الاستخدام</h3>
        {loading ? (
          <div className="flex items-center gap-3 text-white/20 text-sm py-10">
            <div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
            جارٍ التحميل...
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-white/25 text-sm mb-1">تعذّر تحميل الإحصائيات</p>
            <p className="text-white/10 text-xs">{error}</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat label="بطاقات منشأة" value={stats.totalCards ?? 0} />
            <Stat label="مشاهدات"       value={stats.totalViews ?? 0} />
            <Stat label="بطاقات اليوم"  value={stats.todayCards ?? 0} />
          </div>
        ) : (
          <p className="text-white/15 text-sm py-10 text-center">لا توجد بيانات</p>
        )}
      </div>
    </div>
  )
}

/* ═══ Shared Components ═══ */
function Section({ title, children }) {
  return (
    <fieldset>
      <legend className="text-white/60 text-sm font-semibold mb-5">{title}</legend>
      <div className="space-y-5">{children}</div>
    </fieldset>
  )
}

function Field({ icon: Icon, label, value, onChange, placeholder, dir }) {
  return (
    <div>
      <label className="text-white/30 text-xs block mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10" strokeWidth={1.5} />}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={`w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2.5 text-sm text-white/70 outline-none focus:border-purple-500/20 transition-colors placeholder-white/10 ${Icon ? 'px-11' : 'px-4'}`}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/[0.015] border border-white/[0.04] rounded-2xl p-5">
      <p className="text-white/20 text-xs mb-2">{label}</p>
      <p className="text-white/80 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="text-center py-20">
      <Icon className="w-8 h-8 text-white/5 mx-auto mb-4" />
      <p className="text-white/20 text-sm">{text}</p>
    </div>
  )
}
