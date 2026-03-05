import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Sparkles, Palette, Type, Send, Download,
  Smartphone, Building2, ChevronDown, ChevronUp,
  Clock, Layers, FileText, Zap, Globe, Shield,
} from 'lucide-react'

/* ═══ Countdown ═══ */
function EidCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const eid = new Date('2026-03-30T00:00:00+03:00')
    const calc = () => {
      const diff = eid - new Date()
      if (diff <= 0) return { passed: true }
      return {
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
      }
    }
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.passed) return (
    <div className="inline-flex items-center gap-2 bg-gold-500/8 border border-gold-500/15 rounded-full px-5 py-2">
      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
      <span className="text-gold-300 text-sm font-medium">عيد مبارك</span>
    </div>
  )

  const units = [
    { v: t.d, l: 'يوم' },
    { v: t.h, l: 'ساعة' },
    { v: t.m, l: 'دقيقة' },
    { v: t.s, l: 'ثانية' },
  ]

  return (
    <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6 py-3">
      <Clock className="w-3.5 h-3.5 text-gold-500/50 ml-2" />
      <div className="flex items-center gap-3" dir="ltr">
        {units.map((u, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="tabular-nums text-white/80 text-[13px] font-semibold w-6 text-center">
              {String(u.v ?? 0).padStart(2, '0')}
            </span>
            <span className="text-white/20 text-[10px]">{u.l}</span>
            {i < 3 && <span className="text-white/10 mr-2">|</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══ FAQ ═══ */
function FAQ({ q, a, isOpen, toggle }) {
  return (
    <div className="border border-white/[0.04] rounded-2xl overflow-hidden transition-colors hover:border-white/[0.07]">
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right group">
        <span className="text-white/85 text-[15px] font-medium group-hover:text-white transition-colors">{q}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-all ${isOpen ? 'bg-gold-500/15 rotate-180' : 'bg-white/[0.03]'}`}>
          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-gold-400' : 'text-white/30'}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-white/40 text-sm leading-[1.9]">{a}</p>
        </div>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'هل المنصة مجانية؟', a: 'نعم، يمكنك تصميم وتحميل البطاقات مجاناً بدون تسجيل. الباقات المدفوعة تضيف ميزات متقدمة مثل الإرسال الجماعي وإزالة العلامة المائية.' },
  { q: 'كيف أرفع تصاميمي الخاصة؟', a: 'من لوحة التحكم اختر تبويب "القوالب" ثم ارفع صور PNG أو JPG. القوالب تُحفظ وتظهر مباشرة في المحرر.' },
  { q: 'هل أقدر أرسل لأكثر من شخص؟', a: 'نعم، من صفحة الإرسال ارفع ملف CSV بأسماء وأرقام المستلمين وأرسل لهم تلقائياً عبر واتساب.' },
  { q: 'ما جودة البطاقات؟', a: 'البطاقات تُصدَّر بدقة 1080×1080 بكسل بصيغة PNG أو PDF جاهز للطباعة.' },
  { q: 'هل يدعم الموقع الجوال؟', a: 'نعم، الموقع متجاوب بالكامل ومُحسّن لجميع الأجهزة والشاشات.' },
]

/* ═══ Step Card ═══ */
function StepCard({ num, icon: Icon, title, desc, delay }) {
  return (
    <div className="group" style={{ animationDelay: `${delay * 0.1}s` }}>
      <div className="relative bg-white/[0.015] border border-white/[0.05] rounded-3xl p-8 hover:border-gold-500/15 transition-all duration-500 h-full">
        {/* Step number */}
        <div className="absolute -top-3 right-6 bg-[#060709] px-3">
          <span className="text-gold-500/40 text-[11px] font-bold tracking-wider">0{num}</span>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gold-500/[0.07] flex items-center justify-center mb-6 group-hover:bg-gold-500/[0.12] transition-colors">
          <Icon className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-white/90 font-bold text-lg mb-2">{title}</h3>
        <p className="text-white/35 text-[14px] leading-[1.8]">{desc}</p>
      </div>
    </div>
  )
}

/* ═══ Feature Row ═══ */
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-5 group">
      <div className="w-10 h-10 rounded-xl bg-white/[0.025] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:border-gold-500/15 group-hover:bg-gold-500/[0.05] transition-all duration-300">
        <Icon className="w-4 h-4 text-gold-500/60 group-hover:text-gold-400 transition-colors" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-white/85 font-semibold text-[15px] mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-white/30 text-sm leading-[1.7]">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════ */
/* LANDING PAGE                   */
/* ═══════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen w-full bg-[#060709]">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 w-full">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central glow */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/[0.03] rounded-full blur-[150px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }} />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up mb-8">
            <EidCountdown />
          </div>

          {/* Title */}
          <h1 className="animate-fade-up delay-1 text-6xl sm:text-8xl md:text-9xl font-extrabold leading-[0.85] mb-6 tracking-tight">
            <span className="gradient-gold-text text-shadow-gold">سَلِّم</span>
          </h1>

          <p className="animate-fade-up delay-2 text-base sm:text-lg text-white/35 leading-[1.9] mb-10 max-w-lg mx-auto">
            منصة احترافية لتصميم بطاقات تهنئة العيد
            <br />
            <span className="text-white/50">في ثوانٍ — مجاناً بدون تسجيل</span>
          </p>

          {/* CTA Group */}
          <div className="animate-fade-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-l from-gold-600 to-gold-500 text-[#060709] font-bold text-[15px] hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20"
            >
              ابدأ التصميم
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/texts"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 text-[15px] font-medium hover:bg-white/[0.05] hover:text-white/80 hover:border-white/[0.1] transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              تصفّح النصوص
            </Link>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up delay-4 mt-16 flex items-center justify-center gap-8 text-center">
            {[
              { n: '+100', l: 'عبارة تهنئة' },
              { n: '20', l: 'قالب جاهز' },
              { n: '8', l: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-gold-400/80 text-xl font-bold">{s.n}</span>
                <span className="text-white/20 text-[11px] mt-0.5">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <div className="text-center mb-16">
            <span className="inline-block text-gold-500/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الخطوات</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90">
              كيف تصمّم بطاقتك
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard num={1} icon={Layers}   title="اختر القالب"   desc="تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم" delay={1} />
            <StepCard num={2} icon={Palette}   title="خصّص البطاقة"  desc="اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم" delay={2} />
            <StepCard num={3} icon={Send}      title="أرسل أو حمّل"  desc="صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب" delay={3} />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: text */}
            <div>
              <span className="inline-block text-gold-500/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">المميزات</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4">
                كل ما تحتاجه
                <br />
                <span className="text-white/40">في منصة واحدة</span>
              </h2>
              <p className="text-white/30 text-[15px] leading-[1.8] mb-10">
                صمّم بطاقات احترافية بخطوط عربية أصيلة وعبارات مختارة بعناية — ثم أرسلها لمن تحب مباشرة.
              </p>

              <Link
                to="/editor"
                className="inline-flex items-center gap-2 text-gold-400/80 text-sm font-medium hover:text-gold-300 transition-colors group"
              >
                جرّب المحرر الآن
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: feature list */}
            <div className="space-y-7">
              <Feature icon={Type}       title="خطوط عربية أصيلة"       desc="8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها" />
              <Feature icon={FileText}   title="أكثر من 100 عبارة"      desc="عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة" />
              <Feature icon={Send}       title="إرسال عبر واتساب"       desc="أرسل فردياً أو جماعياً مباشرة من المنصة" />
              <Feature icon={Download}   title="تصدير بأعلى جودة"       desc="PNG بدقة 1080px أو PDF جاهز للطباعة" />
              <Feature icon={Building2}  title="تخصيص كامل للشركات"     desc="وايت لابل — شعار وألوان ونطاق مخصص بهوية شركتك" />
              <Feature icon={Shield}     title="مجاني وآمن"             desc="ابدأ فوراً بدون حساب أو بيانات شخصية" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="max-w-2xl mx-auto relative z-10 w-full">
          <div className="text-center mb-14">
            <span className="inline-block text-gold-500/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الأسئلة</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90">أسئلة شائعة</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQ key={i} q={f.q} a={f.a} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="max-w-xl mx-auto text-center relative z-10 w-full">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/[0.07] flex items-center justify-center mb-8 mx-auto">
            <Sparkles className="w-6 h-6 text-gold-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">جاهز تصمّم بطاقتك؟</h2>
          <p className="text-white/30 text-sm mb-10">
            صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
          </p>
          <Link
            to="/editor"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-l from-gold-600 to-gold-500 text-[#060709] font-bold text-[15px] hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25"
          >
            ابدأ الآن
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
