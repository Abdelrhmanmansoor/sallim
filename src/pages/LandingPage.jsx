import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Palette, Type, Send, Download,
  Building2, ChevronDown,
  Layers, FileText, Shield, Users, Share2,
} from 'lucide-react'

/* ═══ Helpers ═══ */
const toAr = (n) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

/* ═══ Marquee Ticker ═══ */
function MarqueeTicker() {
  const items = [
    '✦ أكثر من ٥٠،٠٠٠ بطاقة صُمِّمت هذا العيد',
    '✦ قوالب جديدة كل أسبوع',
    '✦ جودة ١٠٨٠ بيكسل مجاناً',
    '✦ إرسال مباشر عبر واتساب',
  ]
  const repeated = [...items, ...items, ...items]

  return (
    <div className="w-full overflow-hidden bg-[#d4b96b] py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="mx-8 text-[#060709] text-sm font-bold inline-block">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══ Eidiya Calculator ═══ */
const reactions = [
  { min: 5,    max: 15,   emoji: '😑', title: 'يعني... مشكور',                desc: 'الله يجزاك خير، بس كان في أمل 🙂',                              glow: 'rgba(120,120,130,0.10)', border: 'rgba(120,120,130,0.15)', bg: 'rgba(120,120,130,0.04)' },
  { min: 16,   max: 30,   emoji: '🙂', title: 'ماشي، لا بأس',                  desc: 'يكفي على اللي ما يكفي',                                            glow: 'rgba(160,160,170,0.12)', border: 'rgba(160,160,170,0.18)', bg: 'rgba(160,160,170,0.05)' },
  { min: 31,   max: 75,   emoji: '😊', title: 'تمام، الله يعطيك',              desc: 'هذا شي، الله يبارك فيك',                                            glow: 'rgba(201,168,76,0.12)',  border: 'rgba(201,168,76,0.18)',  bg: 'rgba(201,168,76,0.04)'  },
  { min: 76,   max: 150,  emoji: '😄', title: 'الحين كلام!',                    desc: 'عيد صح والله! ربي يحفظك',                                          glow: 'rgba(201,168,76,0.20)',  border: 'rgba(201,168,76,0.28)',  bg: 'rgba(201,168,76,0.06)'  },
  { min: 151,  max: 499,  emoji: '🤩', title: 'يبيييه!!',                        desc: 'والله هذا كرم أصيل، الله لا يحرمنا منك',                          glow: 'rgba(201,168,76,0.30)',  border: 'rgba(201,168,76,0.38)',  bg: 'rgba(201,168,76,0.08)'  },
  { min: 500,  max: 999,  emoji: '🥹', title: 'دموع الفرح 😭',                desc: 'ما كنت أتوقع... ربي يزيدك ويبارك لك',                              glow: 'rgba(201,168,76,0.40)',  border: 'rgba(201,168,76,0.50)',  bg: 'rgba(201,168,76,0.10)'  },
  { min: 1000, max: 2000, emoji: '🤯', title: 'هذا مو عيدية... هذا راتب!!',  desc: 'أنت مو شخص، أنت مؤسسة خيرية بكاملها 🏛️', glow: 'rgba(201,168,76,0.55)',  border: 'rgba(201,168,76,0.65)',  bg: 'rgba(201,168,76,0.14)'  },
]
const quickPicks = [10, 50, 100, 500, 1000]

function getReaction(val) {
  for (const r of reactions) if (val >= r.min && val <= r.max) return r
  return reactions[0]
}

/* Confetti particle */
function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    const ps = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 1.2 + Math.random() * 1.2,
      size: 4 + Math.random() * 6,
      color: ['#C9A84C', '#d4b96b', '#f3ead0', '#fff', '#e0c97d'][Math.floor(Math.random() * 5)],
    }))
    setParticles(ps)
  }, [active])
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

function EidiyaCalculator() {
  const [value, setValue] = useState(50)
  const [emojiKey, setEmojiKey] = useState(0)
  const prevReactionRef = useRef(null)
  const reaction = getReaction(value)
  const pct = ((value - 5) / (2000 - 5)) * 100

  const onChange = useCallback((e) => {
    const v = Number(e.target.value)
    setValue(v)
    const r = getReaction(v)
    if (!prevReactionRef.current || prevReactionRef.current.title !== r.title) {
      setEmojiKey(k => k + 1)
      prevReactionRef.current = r
    }
  }, [])

  const shareWa = () => {
    const text = `عيديتي هالسنة ${toAr(value)} ريال 🤩 — ${reaction.title}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section className="py-28 px-4 relative w-full" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />

      <div className="max-w-xl mx-auto relative z-10">
        {/* Section heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#C9A84C]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">تسلية</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90">حاسبة العيدية</h2>
          <p className="text-white/30 text-sm mt-3">حرّك السلايدر وشوف ردة الفعل 😄</p>
        </div>

        {/* Card */}
        <div
          className="relative rounded-3xl p-8 sm:p-10 transition-all duration-500 overflow-hidden"
          style={{
            background: reaction.bg,
            border: `1.5px solid ${reaction.border}`,
            boxShadow: `0 0 80px ${reaction.glow}, 0 0 160px ${reaction.glow}`,
          }}
        >
          <Confetti active={value >= 1000} />

          {/* Amount display */}
          <div className="text-center mb-8 relative z-10">
            <div className="text-6xl sm:text-7xl font-black text-white tabular-nums leading-none mb-2 eidiya-num-transition">
              {toAr(value)}
            </div>
            <span className="text-[#C9A84C] text-lg font-bold">ريال</span>
          </div>

          {/* Slider */}
          <div className="relative z-10 mb-6">
            <input
              type="range"
              min={5}
              max={2000}
              step={1}
              value={value}
              onChange={onChange}
              className="eidiya-slider w-full"
              style={{ '--pct': `${pct}%` }}
            />
            <div className="flex justify-between mt-2 text-white/20 text-[11px] font-bold">
              <span>{toAr(2000)}</span>
              <span>{toAr(5)}</span>
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
            {quickPicks.map(q => (
              <button
                key={q}
                onClick={() => { setValue(q); const r = getReaction(q); if (!prevReactionRef.current || prevReactionRef.current.title !== r.title) { setEmojiKey(k => k + 1); prevReactionRef.current = r } }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  value === q
                    ? 'bg-[#C9A84C] text-[#0A0A0A] shadow-lg shadow-[#C9A84C]/20'
                    : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/80'
                }`}
              >
                {toAr(q)}
              </button>
            ))}
          </div>

          {/* Generosity meter */}
          <div className="relative z-10 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/25 text-[11px] font-bold">مقياس الكرم</span>
              <span className="text-[#C9A84C]/70 text-[11px] font-bold">{toAr(Math.round(pct))}٪</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, #5a5a60 0%, #C9A84C ${Math.min(pct * 2, 100)}%, #f3ead0 100%)`,
                  boxShadow: pct > 40 ? `0 0 12px rgba(201,168,76,${pct / 250})` : 'none',
                }}
              />
            </div>
          </div>

          {/* Reaction Card */}
          <div
            className="relative z-10 rounded-2xl p-6 text-center transition-all duration-500"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${reaction.border}`,
            }}
          >
            <div key={emojiKey} className="text-6xl mb-4 animate-emoji-pop">
              {reaction.emoji}
            </div>
            <h3 className="text-white font-bold text-xl mb-2">{reaction.title}</h3>
            <p className="text-white/40 text-sm leading-[1.8]">{reaction.desc}</p>
          </div>

          {/* WhatsApp share */}
          <button
            onClick={shareWa}
            className="relative z-10 mt-8 w-full py-4 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-[15px] hover:bg-[#d4b96b] transition-all duration-300 shadow-lg shadow-[#C9A84C]/15 inline-flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            شارك عيديتك عبر واتساب
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══ FAQ ═══ */
function FAQ({ q, a, isOpen, toggle }) {
  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden transition-colors hover:border-[#d4b96b]/20">
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right group">
        <span className="text-white/85 text-[15px] font-medium group-hover:text-white transition-colors">{q}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-all ${isOpen ? 'bg-[#d4b96b]/15 rotate-180' : 'bg-white/[0.03]'}`}>
          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-[#d4b96b]' : 'text-white/30'}`} />
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
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="group">
      <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:border-[#d4b96b]/15 transition-all duration-500 h-full">
        <div className="absolute -top-3 right-6 bg-[#060709] px-3">
          <span className="text-[#d4b96b]/40 text-[11px] font-bold tracking-wider">0{num}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#d4b96b]/[0.07] flex items-center justify-center mb-6 group-hover:bg-[#d4b96b]/[0.12] transition-colors">
          <Icon className="w-5 h-5 text-[#d4b96b]" strokeWidth={1.5} />
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
      <div className="w-10 h-10 rounded-xl bg-white/[0.025] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:border-[#d4b96b]/15 group-hover:bg-[#d4b96b]/[0.05] transition-all duration-300">
        <Icon className="w-4 h-4 text-[#d4b96b]/60 group-hover:text-[#d4b96b] transition-colors" strokeWidth={1.5} />
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
    <div className="min-h-screen w-full bg-[#060709] overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 w-full overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100vw)] h-[300px] bg-[#d4b96b]/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Logo — bigger & centered */}
          <div className="animate-fade-up mb-8">
            <img src="/images/logo.png" alt="سَلِّم" className="h-44 sm:h-56 md:h-72 w-auto mx-auto drop-shadow-[0_0_60px_rgba(212,185,107,0.2)]" />
          </div>

          <p className="animate-fade-up delay-1 text-lg sm:text-xl text-white/40 leading-[1.9] mb-12 max-w-lg mx-auto">
            منصة احترافية لتصميم بطاقات تهنئة العيد
            <br />
            <span className="text-white/55">في ثوانٍ — مجاناً بدون تسجيل</span>
          </p>

          {/* CTA Group — Companies + Individuals */}
          <div className="animate-fade-up delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15 hover:shadow-[#d4b96b]/25"
            >
              <Users className="w-5 h-5" />
              ابدأ مجاناً — للأفراد
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/business"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-[#d4b96b]/30 text-[#d4b96b] font-bold text-[15px] hover:bg-[#d4b96b]/10 hover:border-[#d4b96b]/50 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              للشركات والمؤسسات
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up delay-3 mt-16 flex items-center justify-center gap-10 text-center">
            {[
              { n: '+100', l: 'عبارة تهنئة' },
              { n: '20', l: 'قالب جاهز' },
              { n: '8', l: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[#d4b96b] text-xl font-bold">{s.n}</span>
                <span className="text-white/20 text-[11px] mt-0.5">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE TICKER ─── */}
      <MarqueeTicker />

      {/* ─── EIDIYA CALCULATOR ─── */}
      <EidiyaCalculator />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الخطوات</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90">
              كيف تصمّم بطاقتك
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard num={1} icon={Layers}  title="اختر القالب"  desc="تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم" />
            <StepCard num={2} icon={Palette}  title="خصّص البطاقة" desc="اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم" />
            <StepCard num={3} icon={Send}     title="أرسل أو حمّل" desc="صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">المميزات</span>
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
                className="inline-flex items-center gap-2 text-[#d4b96b] text-sm font-medium hover:text-[#e0c97d] transition-colors group"
              >
                جرّب المحرر الآن
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-7">
              <Feature icon={Type}       title="خطوط عربية أصيلة"   desc="8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها" />
              <Feature icon={FileText}   title="أكثر من 100 عبارة"  desc="عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة" />
              <Feature icon={Send}       title="إرسال عبر واتساب"   desc="أرسل فردياً أو جماعياً مباشرة من المنصة" />
              <Feature icon={Download}   title="تصدير بأعلى جودة"   desc="PNG بدقة 1080px أو PDF جاهز للطباعة" />
              <Feature icon={Building2}  title="تخصيص كامل للشركات" desc="وايت لابل — شعار وألوان ونطاق مخصص بهوية شركتك" />
              <Feature icon={Shield}     title="مجاني وآمن"         desc="ابدأ فوراً بدون حساب أو بيانات شخصية" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الأسئلة</span>
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
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="mb-8 mx-auto">
            <img src="/images/logo.png" alt="سَلِّم" className="h-20 w-auto mx-auto opacity-80" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">جاهز تصمّم بطاقتك؟</h2>
          <p className="text-white/30 text-sm mb-10">
            صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/business"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-[#d4b96b]/30 text-[#d4b96b] font-bold text-[15px] hover:bg-[#d4b96b]/10 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              حلول الشركات
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
