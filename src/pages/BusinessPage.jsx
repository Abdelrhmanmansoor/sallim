import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Building2, Users, Send, Palette,
  Check, Crown, Zap, LogOut,
  MessageCircle, Globe, Upload, Lock, Mail,
  UserPlus, Image, Droplet, FileText,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   BUSINESS PAGE — Login → Onboarding → Dashboard
   All logic is local (localStorage / sessionStorage)
   ═══════════════════════════════════════════════════════ */

/* ── Codes DB (localStorage mirror of /data/codes.json) ── */
function getCodesDB() {
  const stored = localStorage.getItem('sallam_codes')
  if (stored) return JSON.parse(stored)
  return null
}
function setCodesDB(db) {
  localStorage.setItem('sallam_codes', JSON.stringify(db))
}
async function ensureCodesDB() {
  let db = getCodesDB()
  if (!db) {
    try {
      const res = await fetch('/data/codes.json')
      db = await res.json()
      setCodesDB(db)
    } catch {
      db = {}
      setCodesDB(db)
    }
  }
  return db
}

/* ── Company profile helpers ── */
function getCompanyProfile(code) {
  const all = JSON.parse(localStorage.getItem('sallam_companies') || '{}')
  return all[code] || null
}
function setCompanyProfile(code, data) {
  const all = JSON.parse(localStorage.getItem('sallam_companies') || '{}')
  all[code] = data
  localStorage.setItem('sallam_companies', JSON.stringify(all))
}

/* ── Session helpers ── */
function getSession() {
  const s = sessionStorage.getItem('sallam_biz_session')
  return s ? JSON.parse(s) : null
}
function setSession(data) {
  sessionStorage.setItem('sallam_biz_session', JSON.stringify(data))
  window.dispatchEvent(new Event('sallam_session_change'))
}
function clearSession() {
  sessionStorage.removeItem('sallam_biz_session')
  window.dispatchEvent(new Event('sallam_session_change'))
}

/* ═══════════════════════════════ */
/* LOGIN SCREEN                   */
/* ═══════════════════════════════ */
function LoginScreen({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !code.trim()) {
      setError('يرجى تعبئة جميع الحقول')
      return
    }
    setLoading(true)

    const db = await ensureCodesDB()
    const entry = db[code.trim().toUpperCase()]

    if (!entry) {
      setError('الكود غير صالح. تأكد من الصيغة: SALLAM-XXXX-XXXX')
      setLoading(false)
      return
    }

    if (entry.used && entry.usedBy !== email.trim().toLowerCase()) {
      setError('هذا الكود مفعّل مسبقاً ببريد إلكتروني آخر')
      setLoading(false)
      return
    }

    // Activate or re-login
    if (!entry.used) {
      entry.used = true
      entry.usedBy = email.trim().toLowerCase()
      db[code.trim().toUpperCase()] = entry
      setCodesDB(db)
    }

    const session = {
      email: email.trim().toLowerCase(),
      code: code.trim().toUpperCase(),
      plan: entry.plan,
    }
    setSession(session)
    setLoading(false)
    onSuccess(session)
  }

  return (
    <div className="min-h-screen w-full bg-[#17012C] flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,90vw)] h-[300px] bg-[#6A47ED]/[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#6A47ED]/[0.08] border border-[#6A47ED]/15 rounded-full px-5 py-2 mb-6">
            <Building2 className="w-4 h-4 text-[#6A47ED]" />
            <span className="text-[#6A47ED] text-sm font-medium">بوابة الشركات</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white/90 mb-4 leading-[1.4]">
            تسجيل دخول
            <br />
            <span className="text-[#6A47ED]">الشركات</span>
          </h1>
          <p className="text-white/35 text-sm leading-[1.9]">
            أدخل بريدك الإلكتروني وكود التفعيل للوصول لمنصة الشركات
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 sm:p-10" style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1.5px solid rgba(255,255,255,0.06)',
          boxShadow: '0 0 60px rgba(106,71,237,0.03)',
        }}>
          {/* Email */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-white/40 text-sm font-bold mb-3">
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@example.com"
              dir="ltr"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-[15px] placeholder:text-white/15 outline-none transition-all duration-300 focus:border-[#6A47ED]/30 focus:bg-[#6A47ED]/[0.03] focus:shadow-[0_0_20px_rgba(106,71,237,0.06)] text-left"
            />
          </div>

          {/* Code */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-white/40 text-sm font-bold mb-3">
              <Lock className="w-4 h-4" />
              كود التفعيل
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SALLAM-XXXX-XXXX"
              dir="ltr"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-[15px] font-mono tracking-wider placeholder:text-white/15 placeholder:font-mono outline-none transition-all duration-300 focus:border-[#6A47ED]/30 focus:bg-[#6A47ED]/[0.03] focus:shadow-[0_0_20px_rgba(106,71,237,0.06)] text-left"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl p-4 bg-red-500/[0.08] border border-red-500/20 animate-fade-up">
              <p className="text-red-400 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`btn-gold w-full justify-center !py-4 !text-base ${loading ? '!opacity-60 !cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                دخول
              </>
            )}
          </button>

          {/* Hint */}
          <p className="text-white/20 text-xs text-center mt-6 leading-[1.8]">
            ليس لديك كود تفعيل؟ تواصل معنا عبر
            <a href="https://wa.me/201007835547" target="_blank" rel="noopener noreferrer" className="text-[#6A47ED]/60 hover:text-[#6A47ED] mx-1 transition-colors">واتساب</a>
            للحصول على باقة الشركات
          </p>
        </form>

        {/* Back */}
        <div className="text-center mt-8">
          <Link to="/" className="group btn-ghost-gold justify-center mx-auto">
            العودة للرئيسية
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════ */
/* ONBOARDING SCREEN              */
/* ═══════════════════════════════ */
function OnboardingScreen({ session, onComplete }) {
  const [companyName, setCompanyName] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoData, setLogoData] = useState(null)
  const [primaryColor, setPrimaryColor] = useState('#6A47ED')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result)
      setLogoData(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!companyName.trim()) return
    setSaving(true)
    const profile = {
      companyName: companyName.trim(),
      logo: logoData,
      primaryColor,
      createdAt: new Date().toISOString(),
    }
    setCompanyProfile(session.code, profile)
    setTimeout(() => {
      setSaving(false)
      onComplete(profile)
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-[#17012C] flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,90vw)] h-[300px] bg-[#6A47ED]/[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#6A47ED]/[0.08] border border-[#6A47ED]/15 rounded-full px-5 py-2 mb-6">
            <UserPlus className="w-4 h-4 text-[#6A47ED]" />
            <span className="text-[#6A47ED] text-sm font-medium">إعداد الحساب</span>
          </div>
          <h1 className="text-3xl font-black text-white/90 mb-3 leading-[1.4]">
            أكمل بيانات <span className="text-[#6A47ED]">شركتك</span>
          </h1>
          <p className="text-white/35 text-sm leading-[1.9]">
            هذه البيانات ستظهر على بطاقاتك وللموظفين
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 sm:p-10 space-y-8" style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1.5px solid rgba(255,255,255,0.06)',
        }}>
          {/* Company name */}
          <div>
            <label className="flex items-center gap-2 text-white/40 text-sm font-bold mb-3">
              <Building2 className="w-4 h-4" />
              اسم الشركة
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="مثال: مجموعة الفيصل"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-[15px] placeholder:text-white/15 outline-none transition-all duration-300 focus:border-[#6A47ED]/30 focus:bg-[#6A47ED]/[0.03]"
            />
          </div>

          {/* Logo upload */}
          <div>
            <label className="flex items-center gap-2 text-white/40 text-sm font-bold mb-3">
              <Image className="w-4 h-4" />
              شعار الشركة
              <span className="text-white/20 text-xs font-normal">(PNG أو JPG)</span>
            </label>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleLogo} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border-2 border-dashed border-white/[0.08] rounded-xl p-6 hover:border-[#6A47ED]/25 hover:bg-[#6A47ED]/[0.02] transition-all duration-300 group"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain rounded-lg" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-white/20 group-hover:text-[#6A47ED]/60 transition-colors" />
                  <span className="text-white/25 text-sm group-hover:text-white/40 transition-colors">اضغط لرفع الشعار</span>
                </>
              )}
            </button>
          </div>

          {/* Color picker */}
          <div>
            <label className="flex items-center gap-2 text-white/40 text-sm font-bold mb-3">
              <Droplet className="w-4 h-4" />
              اللون الرئيسي
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/[0.08] bg-transparent"
                  style={{ padding: 2 }}
                />
              </div>
              <div className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4">
                <span className="text-white/50 text-sm font-mono" dir="ltr">{primaryColor}</span>
              </div>
              <div className="flex gap-2">
                {['#6A47ED', '#2563EB', '#059669', '#DC2626', '#7C3AED'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className={`w-8 h-8 rounded-lg transition-all ${primaryColor === c ? 'ring-2 ring-white/40 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!companyName.trim() || saving}
            className={`btn-gold w-full justify-center !py-4 !text-base ${!companyName.trim() ? '!opacity-30 !cursor-not-allowed' : ''} ${saving ? '!opacity-60 !cursor-wait' : ''}`}
          >
            {saving ? (
              <span className="inline-block w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
            ) : (
              <>ابدأ</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ═══════════════════════════════ */
/* COMPANY DASHBOARD              */
/* ═══════════════════════════════ */
function DashboardScreen({ session, profile, onLogout }) {
  const color = profile.primaryColor || '#6A47ED'

  const features = [
    { icon: Users, title: 'إرسال جماعي', desc: 'أرسل مئات البطاقات دفعة واحدة — كل بطاقة تحمل اسم المستلم تلقائياً', tag: 'متاح' },
    { icon: FileText, title: 'رفع قائمة موظفين', desc: 'ارفع ملف CSV بأسماء وأرقام الموظفين والعملاء', tag: 'متاح' },
    { icon: MessageCircle, title: 'تخصيص رسالة الشركة', desc: 'اكتب رسالة تهنئة مخصصة باسم شركتك وهويتها', tag: 'متاح' },
    { icon: Globe, title: 'تصدير PDF بلوجو الشركة', desc: 'صدّر البطاقات بشعار شركتك بدون علامة مائية', tag: 'متاح' },
    { icon: Crown, title: 'قوالب حصرية', desc: 'قوالب مميزة فاخرة حصرية لعملاء الشركات', tag: session.plan === 'pro' ? 'متاح' : 'Pro فقط' },
    { icon: Zap, title: 'أولوية الدعم', desc: 'دعم مباشر عبر واتساب مع أولوية الرد', tag: 'متاح' },
  ]

  const stats = [
    { label: 'بطاقات مُرسلة', value: '٠' },
    { label: 'موظفين / عملاء', value: '٠' },
    { label: 'الباقة', value: session.plan === 'pro' ? 'Pro' : 'Basic' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#17012C] overflow-x-hidden">
      {/* ── Dashboard Header ── */}
      <section className="relative pt-28 pb-16 px-4 w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,90vw)] h-[200px] rounded-full blur-[120px]"
            style={{ backgroundColor: `${color}10` }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Company header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.companyName} className="h-20 w-20 rounded-2xl object-contain bg-white/[0.03] border border-white/[0.06] p-2" />
            ) : (
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-black" style={{ backgroundColor: `${color}15`, color, border: `2px solid ${color}30` }}>
                {profile.companyName?.[0] || '؟'}
              </div>
            )}
            <div className="text-center sm:text-right flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white/90 mb-2">
                مرحباً، <span style={{ color }}>{profile.companyName}</span>
              </h1>
              <p className="text-white/35 text-sm leading-[1.8]">
                لوحة تحكم الشركة — {session.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="btn-outline-gold !border-red-500/20 !text-red-400 hover:!bg-red-500/[0.06] hover:!border-red-500/30 !px-5 !py-2.5 !text-sm shrink-0"
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-5 text-center" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div className="text-2xl font-black mb-1" style={{ color }}>{s.value}</div>
                <div className="text-white/30 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick actions ── */}
      <section className="px-4 pb-12 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/editor" className="btn-gold justify-center !py-4 !rounded-2xl !text-base" style={{
              background: `linear-gradient(135deg, ${color}cc, ${color})`,
            }}>
              <Palette className="w-5 h-5" />
              صمّم بطاقة جديدة
            </Link>
            <button className="btn-outline-gold justify-center !py-4 !rounded-2xl !text-base" style={{ borderColor: `${color}40`, color }}>
              <Upload className="w-5 h-5" />
              رفع قائمة موظفين (CSV)
            </button>
            <button className="btn-outline-gold justify-center !py-4 !rounded-2xl !text-base" style={{ borderColor: `${color}40`, color }}>
              <Send className="w-5 h-5" />
              إرسال جماعي
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-16 px-4 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white/90 mb-3">مزايا حسابك</h2>
            <p className="text-white/30 text-sm">جميع المزايا المتاحة لباقة {session.plan === 'pro' ? 'Pro' : 'Basic'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              const isAvailable = f.tag === 'متاح'
              return (
                <div key={i} className={`relative rounded-2xl p-6 transition-all duration-500 ${!isAvailable ? 'opacity-60' : ''}`} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isAvailable ? `${color}20` : 'rgba(255,255,255,0.05)'}`,
                }}>
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isAvailable
                        ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                        : 'text-white/30 bg-white/[0.03] border border-white/[0.06]'
                    }`}>
                      {f.tag}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}10` }}>
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white/90 font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-white/30 text-sm leading-[1.8]">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Company message ── */}
      <section className="py-16 px-4 w-full">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-10" style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <h3 className="text-white/90 font-bold text-xl mb-6 flex items-center gap-3">
              <MessageCircle className="w-5 h-5" style={{ color }} />
              رسالة الشركة
            </h3>
            <textarea
              rows={4}
              placeholder="اكتب رسالة التهنئة الرسمية لشركتك هنا..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white text-[15px] placeholder:text-white/15 outline-none transition-all duration-300 resize-none leading-[2]"
              onFocus={(e) => { e.target.style.borderColor = `${color}40` }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
            />
            <div className="flex justify-end mt-4">
              <button className="btn-gold !py-2.5 !px-6 !text-sm" style={{
                background: `linear-gradient(135deg, ${color}cc, ${color})`,
              }}>
                <Check className="w-4 h-4" />
                حفظ الرسالة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="py-12 px-4 w-full text-center">
        <Link to="/" className="group btn-ghost-gold justify-center mx-auto" style={{ color }}>
          العودة للرئيسية
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  )
}

/* ═══════════════════════════════ */
/* MAIN EXPORT — BUSINESS PAGE    */
/* ═══════════════════════════════ */
export default function BusinessPage() {
  const [screen, setScreen] = useState('loading')
  const [session, setSessionState] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const existing = getSession()
    if (existing) {
      const p = getCompanyProfile(existing.code)
      setSessionState(existing)
      if (p) {
        setProfile(p)
        setScreen('dashboard')
      } else {
        setScreen('onboarding')
      }
    } else {
      setScreen('login')
    }
  }, [])

  const handleLoginSuccess = (sess) => {
    setSessionState(sess)
    const p = getCompanyProfile(sess.code)
    if (p) {
      setProfile(p)
      setScreen('dashboard')
    } else {
      setScreen('onboarding')
    }
  }

  const handleOnboardingComplete = (p) => {
    setProfile(p)
    setScreen('dashboard')
  }

  const handleLogout = () => {
    clearSession()
    setSessionState(null)
    setProfile(null)
    setScreen('login')
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen w-full bg-[#17012C] flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-[#6A47ED]/30 border-t-[#6A47ED] rounded-full animate-spin" />
      </div>
    )
  }

  if (screen === 'login') return <LoginScreen onSuccess={handleLoginSuccess} />
  if (screen === 'onboarding') return <OnboardingScreen session={session} onComplete={handleOnboardingComplete} />
  return <DashboardScreen session={session} profile={profile} onLogout={handleLogout} />
}
