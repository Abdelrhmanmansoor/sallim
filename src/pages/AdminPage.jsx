import { useState, useRef, useEffect, useCallback } from 'react'
import {
  BsGrid, BsFileText, BsGear, BsBarChart,
  BsUpload, BsTrash, BsPlus, BsX, BsImage,
  BsCheck2, BsClipboard, BsPencil, BsEye,
} from 'react-icons/bs'
import { templates } from '../data/templates'
import { textCategories, greetingTexts } from '../data/texts'
import { getPublicStats } from '../utils/api'

/* ═══ localStorage keys ═══ */
const TEMPLATES_KEY = 'sallim_uploaded_templates'
const TEXTS_KEY    = 'sallim_custom_texts'
const SETTINGS_KEY = 'sallim_settings'

function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback }
  catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

/* ═══ Tabs ═══ */
const tabs = [
  { id: 'templates', label: 'القوالب',      icon: <BsGrid /> },
  { id: 'texts',     label: 'النصوص',       icon: <BsFileText /> },
  { id: 'settings',  label: 'الإعدادات',    icon: <BsGear /> },
  { id: 'stats',     label: 'الإحصائيات',   icon: <BsBarChart /> },
]

/* ═══════════════════════════════════════════ */
/* AdminPage — لوحة التحكم الكاملة           */
/* ═══════════════════════════════════════════ */
export default function AdminPage() {
  const [tab, setTab] = useState('templates')

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gold-500/60 text-xs tracking-[0.15em] mb-2">ADMIN</p>
          <h1 className="text-2xl font-bold text-white/90">لوحة التحكم</h1>
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
        {tab === 'templates' && <TemplatesPanel />}
        {tab === 'texts'     && <TextsPanel />}
        {tab === 'settings'  && <SettingsPanel />}
        {tab === 'stats'     && <StatsPanel />}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Templates Panel                             */
/* ─────────────────────────────────────────── */
function TemplatesPanel() {
  const [uploaded, setUploaded] = useState(() => load(TEMPLATES_KEY, []))
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)

    const readers = files.map(file => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve({
        id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        image: reader.result,
        textColor: '#ffffff',
        uploadedAt: new Date().toISOString(),
      })
      reader.readAsDataURL(file)
    }))

    Promise.all(readers).then(newTemplates => {
      const updated = [...uploaded, ...newTemplates]
      setUploaded(updated)
      save(TEMPLATES_KEY, updated)
      setUploading(false)
    })

    e.target.value = ''
  }, [uploaded])

  const handleDelete = useCallback((id) => {
    const updated = uploaded.filter(t => t.id !== id)
    setUploaded(updated)
    save(TEMPLATES_KEY, updated)
  }, [uploaded])

  const allTemplates = [...templates, ...uploaded]

  return (
    <div>
      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-white/[0.06] rounded-xl p-10 text-center cursor-pointer hover:border-gold-500/20 transition-colors mb-10 group"
      >
        <BsUpload className="text-2xl text-gray-700 group-hover:text-gold-500/50 mx-auto mb-3 transition-colors" />
        <p className="text-gray-500 text-sm mb-1">
          {uploading ? 'جارٍ الرفع...' : 'اضغط لرفع قوالب جديدة'}
        </p>
        <p className="text-gray-700 text-xs">PNG, JPG — حد أقصى 5MB للصورة</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">
          {allTemplates.length} قالب — {uploaded.length} مرفوع يدوياً
        </p>
      </div>

      {/* Grid */}
      {allTemplates.length === 0 ? (
        <div className="text-center py-20">
          <BsImage className="text-4xl text-gray-800 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">لا توجد قوالب بعد. ارفع أول قالب من الأعلى</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allTemplates.map(t => (
            <div key={t.id} className="relative group rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.04]">
              <div className="aspect-square">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full items-center justify-center bg-white/[0.02] hidden">
                  <BsImage className="text-2xl text-gray-800" />
                </div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-gray-500 text-xs truncate">{t.name}</span>
                {String(t.id).startsWith('upload_') && (
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-gray-700 hover:text-red-400 transition-colors p-1"
                    title="حذف"
                  >
                    <BsTrash className="text-xs" />
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

/* ─────────────────────────────────────────── */
/* Texts Panel                                 */
/* ─────────────────────────────────────────── */
function TextsPanel() {
  const [customTexts, setCustomTexts] = useState(() => load(TEXTS_KEY, []))
  const [expandedCat, setExpandedCat] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState('formal')

  const allTexts = [...greetingTexts, ...customTexts]

  const handleAdd = () => {
    if (!newText.trim()) return
    const entry = {
      id: `custom_${Date.now()}`,
      category: newCategory,
      text: newText.trim(),
      tags: ['مخصص'],
      custom: true,
    }
    const updated = [...customTexts, entry]
    setCustomTexts(updated)
    save(TEXTS_KEY, updated)
    setNewText('')
    setShowAddForm(false)
  }

  const handleDeleteCustom = (id) => {
    const updated = customTexts.filter(t => t.id !== id)
    setCustomTexts(updated)
    save(TEXTS_KEY, updated)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-gray-500 text-sm">
          {allTexts.length} نص — {customTexts.length} مخصص
        </p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 text-gold-400 text-sm font-medium hover:bg-gold-500/15 transition-colors"
        >
          {showAddForm ? <BsX /> : <BsPlus />}
          {showAddForm ? 'إلغاء' : 'إضافة نص'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mb-8 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="mb-4">
            <label className="text-gray-500 text-xs block mb-2">التصنيف</label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 outline-none focus:border-gold-500/30"
            >
              {textCategories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-xs block mb-2">النص</label>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="اكتب نص التهنئة هنا..."
              rows={4}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white/80 outline-none focus:border-gold-500/30 resize-none placeholder-gray-700"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="px-6 py-2.5 rounded-lg bg-gold-500 text-[#08090d] text-sm font-bold hover:bg-gold-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            حفظ النص
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-2">
        {textCategories.map(cat => {
          const catTexts = allTexts.filter(t => t.category === cat.id)
          const isOpen = expandedCat === cat.id

          return (
            <div key={cat.id} className="border border-white/[0.04] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-right hover:bg-white/[0.01] transition-colors"
              >
                <span className="text-white/80 text-sm font-medium">{cat.label}</span>
                <span className="text-gray-700 text-xs">{catTexts.length} نص</span>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.04]">
                  {catTexts.length === 0 ? (
                    <p className="px-5 py-6 text-gray-700 text-sm text-center">لا توجد نصوص في هذا التصنيف</p>
                  ) : (
                    catTexts.map(t => (
                      <div key={t.id} className="flex items-start gap-3 px-5 py-4 border-b border-white/[0.02] last:border-0">
                        <p className="flex-1 text-gray-400 text-sm leading-[1.8]">{t.text}</p>
                        {t.custom && (
                          <button
                            onClick={() => handleDeleteCustom(t.id)}
                            className="text-gray-700 hover:text-red-400 transition-colors p-1 shrink-0 mt-0.5"
                            title="حذف"
                          >
                            <BsTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Settings Panel                              */
/* ─────────────────────────────────────────── */
function SettingsPanel() {
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, {
    siteName: 'سَلِّم',
    siteTagline: 'صمّم بطاقة تهنئة العيد وأرسلها لأحبابك',
    primaryColor: '#b8963a',
    contactWhatsApp: '',
    contactEmail: '',
    footerText: 'تابع لمؤسسة سليمان',
  }))
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    save(SETTINGS_KEY, settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl">
      <div className="space-y-8">
        {/* Site Identity */}
        <fieldset>
          <legend className="text-white/80 text-sm font-semibold mb-5">هوية الموقع</legend>
          <div className="space-y-5">
            <Field label="اسم الموقع" value={settings.siteName} onChange={v => update('siteName', v)} />
            <Field label="الوصف المختصر" value={settings.siteTagline} onChange={v => update('siteTagline', v)} />
            <div>
              <label className="text-gray-500 text-xs block mb-2">اللون الأساسي</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={e => update('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/[0.06] cursor-pointer bg-transparent"
                />
                <span className="text-gray-500 text-sm font-mono">{settings.primaryColor}</span>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset>
          <legend className="text-white/80 text-sm font-semibold mb-5">معلومات التواصل</legend>
          <div className="space-y-5">
            <Field label="رقم واتساب" value={settings.contactWhatsApp} onChange={v => update('contactWhatsApp', v)} placeholder="966XXXXXXXXX" dir="ltr" />
            <Field label="البريد الإلكتروني" value={settings.contactEmail} onChange={v => update('contactEmail', v)} placeholder="info@example.com" dir="ltr" />
          </div>
        </fieldset>

        {/* Footer */}
        <fieldset>
          <legend className="text-white/80 text-sm font-semibold mb-5">التذييل</legend>
          <Field label="نص التذييل" value={settings.footerText} onChange={v => update('footerText', v)} />
        </fieldset>
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
          {saved ? <><BsCheck2 /> تم الحفظ</> : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, dir }) {
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

/* ─────────────────────────────────────────── */
/* Stats Panel                                 */
/* ─────────────────────────────────────────── */
function StatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const uploadedCount = load(TEMPLATES_KEY, []).length
  const customTextsCount = load(TEXTS_KEY, []).length

  return (
    <div>
      {/* Local stats always shown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="قوالب مرفوعة" value={uploadedCount} />
        <StatCard label="نصوص مخصصة" value={customTextsCount} />
        <StatCard label="قوالب افتراضية" value={templates.length} />
        <StatCard label="نصوص جاهزة" value={greetingTexts.length} />
      </div>

      {/* API stats */}
      <div className="border-t border-white/[0.04] pt-8">
        <h3 className="text-white/80 text-sm font-semibold mb-6">إحصائيات الاستخدام</h3>

        {loading ? (
          <div className="flex items-center gap-3 text-gray-600 text-sm py-8">
            <div className="w-4 h-4 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
            جارٍ تحميل الإحصائيات...
          </div>
        ) : error ? (
          <div className="py-8">
            <p className="text-gray-600 text-sm mb-2">تعذّر تحميل الإحصائيات من السيرفر</p>
            <p className="text-gray-700 text-xs">{error}</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="بطاقات منشأة" value={stats.totalCards ?? 0} />
            <StatCard label="مشاهدات" value={stats.totalViews ?? 0} />
            <StatCard label="بطاقات اليوم" value={stats.todayCards ?? 0} />
          </div>
        ) : (
          <p className="text-gray-700 text-sm py-8">لا توجد بيانات بعد</p>
        )}
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
