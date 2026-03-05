import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Palette, Type, Send, Download,
  ChevronDown, Layers, FileText, Shield, Share2, Gift,
} from 'lucide-react'

/* ═══ Helpers ═══ */
const toAr = (n) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

/* ═══════════════════════════════════════════════════════════════════════════
   MARQUEE TICKER
   ═══════════════════════════════════════════════════════════════════════════ */
function MarqueeTicker() {
  const items = [
    '✦ أكثر من ٥٠،٠٠٠ بطاقة صُمِّمت هذا العيد',
    '✦ قوالب جديدة كل أسبوع',
    '✦ جودة ١٠٨٠ بيكسل مجاناً',
    '✦ إرسال مباشر عبر واتساب',
  ]
  const repeated = [...items, ...items, ...items]

  return (
    <div className="w-full overflow-hidden bg-[#d4b96b]">
      <div className="flex animate-marquee whitespace-nowrap py-3">
        {repeated.map((item, i) => (
          <span key={i} className="mx-8 text-[#060709] text-sm font-bold">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EIDIYA CALCULATOR
   ═══════════════════════════════════════════════════════════════════════════ */
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

function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  
  useState(() => {
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
    <section className="section-container bg-[#0A0A0A] py-20 sm:py-28">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />
      
      <div className="section-inner max-w-xl">
        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-[#C9A84C]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">تسلية</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4">حاسبة العيدية</h2>
          <p className="text-white/30 text-sm mt-4 leading-relaxed">حرّك السلايدر وشوف ردة الفعل 😄</p>
        </div>

        {/* Card */}
        <div
          className="relative rounded-3xl p-6 sm:p-10 transition-all duration-500 overflow-hidden"
          style={{
            background: reaction.bg,
            border: `1.5px solid ${reaction.border}`,
            boxShadow: `0 0 80px ${reaction.glow}, 0 0 160px ${reaction.glow}`,
          }}
        >
          <Confetti active={value >= 1000} />

          {/* Amount display */}
          <div className="text-center mb-8 relative z-10">
            <div className="text-5xl sm:text-7xl font-black text-white tabular-nums leading-none mb-2 eidiya-num-transition">
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
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  value === q
                    ? 'bg-gradient-to-br from-[#c4a44e] to-[#d4b96b] text-[#0A0A0A] shadow-lg shadow-[#C9A84C]/20 scale-105'
                    : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white/70 hover:border-white/[0.10]'
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
            className="relative z-10 rounded-2xl p-5 sm:p-6 text-center transition-all duration-500"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${reaction.border}`,
            }}
          >
            <div key={emojiKey} className="text-5xl sm:text-6xl mb-4 animate-emoji-pop">
              {reaction.emoji}
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{reaction.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{reaction.desc}</p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/editor" className="btn-gold w-full justify-center">
              <Send className="w-4 h-4" />
              <span>أرسل عيدية — صمّم بطاقتك</span>
            </Link>
            <button onClick={shareWa} className="btn-outline-gold w-full justify-center">
              <Share2 className="w-4 h-4" />
              <span>شارك عبر واتساب</span>
            </button>
          </div>

          {/* Hint */}
          <div className="relative z-10 mt-6 rounded-2xl p-4 sm:p-5 text-center bg-[#C9A84C]/[0.04] border border-[#C9A84C]/10">
            <p className="text-white/50 text-sm leading-relaxed">
              💡 <span className="text-[#C9A84C] font-bold">أرسل عيدية حقيقية!</span> صمّم بطاقة تهنئة مع المبلغ واسمك واسم المستلم — وشاركها مباشرة عبر واتساب
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EIDIYA LUCK GENERATOR
   ═══════════════════════════════════════════════════════════════════════════ */
function EidiyaLuckGenerator() {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const link = name.trim() ? `${baseUrl}/eidiya-luck?name=${encodeURIComponent(name.trim())}` : ''

  const copyLink = () => {
    if (!link) return
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareWa = () => {
    if (!link) return
    const text = `🎰 عيديتك بحظك! لفّ العداد وشوف كم عيديتك من ${name.trim()} 🌙\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const luckFeatures = [
    { emoji: '🎲', title: 'عشوائي بالكامل', desc: 'العداد يختار مبلغ عشوائي من ٥ إلى ٢٬٠٠٠ ريال — مافي أحد يعرف النتيجة!' },
    { emoji: '😂', title: 'ردود فعل مضحكة', desc: '٧ ردود فعل بالسعودية — من "يعني... مشكور" إلى "هذا مو عيدية... هذا راتب!!"' },
    { emoji: '📱', title: 'يعمل على كل جهاز', desc: 'الرابط يفتح مباشرة على أي جوال أو كمبيوتر — بدون تحميل أي شي' },
    { emoji: '🔗', title: 'شارك بسهولة', desc: 'انسخ الرابط أو أرسله واتساب — المستلم يضغط ويلفّ فوراً' },
  ]

  const steps = [
    { num: '١', title: 'اكتب اسمك', desc: 'عشان المستلم يعرف مين يعيّده' },
    { num: '٢', title: 'شارك الرابط', desc: 'واتساب أو نسخ — حسب ما تبي' },
    { num: '٣', title: 'يلفّ العداد!', desc: 'المستلم يضغط ويشوف حظه 🎰' },
  ]

  return (
    <section className="section-container bg-[#070810] py-20 sm:py-32">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[min(500px,90vw)] h-[250px] bg-[#C9A84C]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-inner max-w-4xl">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/[0.08] border border-[#C9A84C]/15 rounded-full px-5 py-2 mb-6">
            <Gift className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium">ميزة جديدة — تسلية العيد</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white/90 mb-5 leading-tight">
            🎰 عيديتك بحظك!
          </h2>
          <p className="text-white/40 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            أنشئ رابط عيدية عشوائي وأرسله لأصدقائك وعائلتك —
            <br className="hidden sm:block" />
            المستلم يلفّ العداد ويطلع له مبلغ عشوائي مع ردة فعل مضحكة!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {luckFeatures.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 sm:p-6 hover:border-[#C9A84C]/15 transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl sm:text-3xl shrink-0 mt-1">{f.emoji}</span>
                <div className="min-w-0">
                  <h4 className="text-white/90 font-bold text-sm sm:text-base mb-2">{f.title}</h4>
                  <p className="text-white/35 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12 sm:mb-16">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#C9A84C]/[0.08] border border-[#C9A84C]/15 flex items-center justify-center mb-3">
                  <span className="text-[#C9A84C] text-lg sm:text-xl font-black">{s.num}</span>
                </div>
                <h4 className="text-white/85 font-bold text-sm mb-1">{s.title}</h4>
                <p className="text-white/30 text-xs leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="hidden sm:block text-[#C9A84C]/30 text-2xl mx-2">←</span>
              )}
            </div>
          ))}
        </div>

        {/* Generator Card */}
        <div className="max-w-lg mx-auto">
          <div 
            className="rounded-3xl p-6 sm:p-10 transition-all duration-500 bg-[#C9A84C]/[0.03] border-[1.5px] border-[#C9A84C]/12"
            style={{ boxShadow: '0 0 60px rgba(201,168,76,0.04)' }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-white/90 font-bold text-lg sm:text-xl mb-2">أنشئ رابط العيدية</h3>
              <p className="text-white/30 text-sm leading-relaxed">اكتب اسمك وشارك الرابط مع أي شخص تبي تعيّده</p>
            </div>

            {/* Name input */}
            <div className="mb-6">
              <label className="block text-white/40 text-sm font-bold mb-3">اسمك (المُعَيِّد)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setCopied(false) }}
                placeholder="مثال: أبو فهد"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white text-[15px] placeholder:text-white/15 outline-none transition-all duration-300 focus:border-[#C9A84C]/30 focus:bg-[#C9A84C]/[0.03] focus:shadow-[0_0_20px_rgba(201,168,76,0.06)]"
              />
            </div>

            {/* Generated link */}
            {name.trim() && (
              <div className="mb-6 animate-fade-up">
                <label className="block text-white/25 text-[11px] font-bold mb-2 uppercase tracking-wider">الرابط</label>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 sm:px-4 py-3">
                  <span className="text-white/30 text-xs truncate flex-1" dir="ltr">{link}</span>
                  <button
                    onClick={copyLink}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                      copied
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/15 hover:bg-[#C9A84C]/20'
                    }`}
                  >
                    {copied ? '✔ تم النسخ' : 'انسخ'}
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={shareWa}
                disabled={!name.trim()}
                className={`btn-gold w-full justify-center ${!name.trim() ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <Share2 className="w-4 h-4" />
                <span>أرسل عبر واتساب</span>
              </button>
              <button
                onClick={copyLink}
                disabled={!name.trim()}
                className={`btn-outline-gold w-full justify-center ${!name.trim() ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {copied ? '✔ تم النسخ!' : 'انسخ الرابط'}
              </button>
            </div>
          </div>

          {/* How it works hint */}
          <div className="mt-6 sm:mt-8 rounded-2xl p-5 sm:p-6 text-center bg-[#C9A84C]/[0.04] border border-[#C9A84C]/10">
            <p className="text-[#C9A84C] font-bold text-sm sm:text-base mb-3">💡 وش يشوف المستلم؟</p>
            <p className="text-white/30 text-xs sm:text-sm leading-loose">
              يفتح الرابط ← يشوف اسمك ← يضغط "لفّ العداد" ← العداد يدور ٣ ثواني
              <br />
              ← يطلع المبلغ العشوائي مع ردة فعل ساحرة وكونفيتي 🎊
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ({ q, a, isOpen, toggle }) {
  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden transition-colors hover:border-[#d4b96b]/20">
      <button onClick={toggle} className="w-full flex items-center justify-between p-4 sm:p-5 text-right group">
        <span className="text-white/85 text-sm sm:text-[15px] font-medium group-hover:text-white transition-colors">{q}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-all ${isOpen ? 'bg-[#d4b96b]/15 rotate-180' : 'bg-white/[0.03]'}`}>
          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-[#d4b96b]' : 'text-white/30'}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-white/40 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'هل المنصة مجانية؟', a: 'نعم، يمكنك تصميم وتحميل البطاقات مجاناً بالكامل بدون تسجيل أو بيانات شخصية.' },
  { q: 'كيف أرفع تصاميمي الخاصة؟', a: 'من لوحة التحكم اختر تبويب "القوالب" ثم ارفع صور PNG أو JPG. القوالب تُحفظ وتظهر مباشرة في المحرر.' },
  { q: 'كيف أرسل البطاقة؟', a: 'بعد تصميم البطاقة، اضغط "إرسال عبر واتساب" وسيتم مشاركتها مباشرة مع من تختار.' },
  { q: 'ما جودة البطاقات؟', a: 'البطاقات تُصدَّر بدقة 1080×1080 بكسل بصيغة PNG أو PDF جاهز للطباعة.' },
  { q: 'هل يدعم الموقع الجوال؟', a: 'نعم، الموقع متجاوب بالكامل ومُحسّن لجميع الأجهزة والشاشات.' },
]

/* ═══════════════════════════════════════════════════════════════════════════
   STEP CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="group h-full">
      <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 sm:p-8 hover:border-[#d4b96b]/15 transition-all duration-500 h-full">
        <div className="absolute -top-3 right-6 bg-[#060709] px-3">
          <span className="text-[#d4b96b]/40 text-[11px] font-bold tracking-wider">0{num}</span>
        </div>
        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-[#d4b96b]/[0.07] flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-[#d4b96b]/[0.12] transition-colors">
          <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-[#d4b96b]" strokeWidth={1.5} />
        </div>
        <h3 className="text-white/90 font-bold text-base sm:text-lg mb-2">{title}</h3>
        <p className="text-white/35 text-xs sm:text-[14px] leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE ROW
   ═══════════════════════════════════════════════════════════════════════════ */
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4 sm:gap-5 group">
      <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-white/[0.025] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:border-[#d4b96b]/15 group-hover:bg-[#d4b96b]/[0.05] transition-all duration-300">
        <Icon className="w-4 h-4 text-[#d4b96b]/60 group-hover:text-[#d4b96b] transition-colors" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <h3 className="text-white/85 font-semibold text-sm sm:text-[15px] mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-white/30 text-xs sm:text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="w-full overflow-x-hidden">

      {/* ─────────────────────────────────────────────────────────────────────
          HERO SECTION
          ───────────────────────────────────────────────────────────────────── */}
      <section className="section-container min-h-[100vh] flex flex-col items-center justify-center pt-20 pb-10 px-5">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100vw)] h-[300px] bg-[#d4b96b]/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto w-full">
          {/* Logo */}
          <div className="animate-fade-up mb-6 sm:mb-8">
            <img 
              src="/images/logo.png" 
              alt="سَلِّم" 
              className="h-36 sm:h-44 md:h-56 lg:h-72 w-auto mx-auto drop-shadow-[0_0_60px_rgba(212,185,107,0.2)]" 
            />
          </div>

          <p className="animate-fade-up delay-1 text-base sm:text-lg md:text-xl text-white/40 leading-relaxed mb-8 sm:mb-12 max-w-lg mx-auto px-4">
            منصة احترافية لتصميم بطاقات تهنئة العيد
            <br />
            <span className="text-white/55">في ثوانٍ — مجاناً بدون تسجيل</span>
          </p>

          {/* CTA */}
          <div className="animate-fade-up delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link to="/editor" className="group btn-gold">
              <span>ابدأ التصميم مجاناً</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up delay-3 mt-12 sm:mt-16 flex items-center justify-center gap-6 sm:gap-10 text-center">
            {[
              { n: '+100', l: 'عبارة تهنئة' },
              { n: '20', l: 'قالب جاهز' },
              { n: '8', l: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[#d4b96b] text-lg sm:text-xl font-bold">{s.n}</span>
                <span className="text-white/20 text-[10px] sm:text-[11px] mt-0.5">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          MARQUEE TICKER
          ───────────────────────────────────────────────────────────────────── */}
      <MarqueeTicker />

      {/* ─────────────────────────────────────────────────────────────────────
          EIDIYA CALCULATOR
          ───────────────────────────────────────────────────────────────────── */}
      <EidiyaCalculator />

      {/* ─────────────────────────────────────────────────────────────────────
          EIDIYA LUCK GENERATOR
          ───────────────────────────────────────────────────────────────────── */}
      <EidiyaLuckGenerator />

      {/* ─────────────────────────────────────────────────────────────────────
          HOW IT WORKS
          ───────────────────────────────────────────────────────────────────── */}
      <section className="section-container bg-[#060709] py-20 sm:py-32">
        <div className="section-inner max-w-5xl">
          <div className="text-center mb-12 sm:mb-20">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">الخطوات</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90">
              كيف تصمّم بطاقتك
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <StepCard num={1} icon={Layers}  title="اختر القالب"  desc="تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم" />
            <StepCard num={2} icon={Palette}  title="خصّص البطاقة" desc="اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم" />
            <StepCard num={3} icon={Send}     title="أرسل أو حمّل" desc="صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FEATURES
          ───────────────────────────────────────────────────────────────────── */}
      <section className="section-container bg-[#060709] py-20 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="section-inner max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">المميزات</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-4 sm:mb-5">
                كل ما تحتاجه
                <br />
                <span className="text-white/40">في منصة واحدة</span>
              </h2>
              <p className="text-white/30 text-sm sm:text-[15px] leading-relaxed mb-8 sm:mb-10">
                صمّم بطاقات احترافية بخطوط عربية أصيلة وعبارات مختارة بعناية — ثم أرسلها لمن تحب مباشرة.
              </p>
              <Link to="/editor" className="group btn-ghost-gold">
                <span>جرّب المحرر الآن</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <Feature icon={Type}       title="خطوط عربية أصيلة"   desc="8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها" />
              <Feature icon={FileText}   title="أكثر من 100 عبارة"  desc="عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة" />
              <Feature icon={Send}       title="إرسال عبر واتساب"   desc="أرسل البطاقة مباشرة لأحبابك عبر واتساب" />
              <Feature icon={Download}   title="تصدير بأعلى جودة"   desc="PNG بدقة 1080px أو PDF جاهز للطباعة" />
              <Feature icon={Shield}     title="مجاني وآمن"         desc="ابدأ فوراً بدون حساب أو بيانات شخصية" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FAQ
          ───────────────────────────────────────────────────────────────────── */}
      <section className="section-container bg-[#060709] py-20 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="section-inner max-w-2xl">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">الأسئلة</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90">أسئلة شائعة</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQ key={i} q={f.q} a={f.a} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          CTA
          ───────────────────────────────────────────────────────────────────── */}
      <section className="section-container bg-[#060709] py-20 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="section-inner max-w-xl text-center">
          <div className="mb-8 sm:mb-10 mx-auto">
            <img src="/images/logo.png" alt="سَلِّم" className="h-16 sm:h-20 w-auto mx-auto opacity-80" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-4 sm:mb-5">جاهز تصمّم بطاقتك؟</h2>
          <p className="text-white/30 text-sm leading-relaxed mb-10 sm:mb-12 px-4">
            صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/editor" className="group btn-gold">
              <span>ابدأ الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
