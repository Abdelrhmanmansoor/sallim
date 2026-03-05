import { useState, useEffect, useCallback, useRef } from 'react'
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
/* ── Quiz Data ── */
const quizQuestions = [
  {
    question: 'كم عمرك؟',
    emoji: '🎂',
    options: [
      { label: '👶 أقل من ١٢ — طفل ومدلّع', points: 40 },
      { label: '🧒 ١٢ – ١٨ — مراهق طموح', points: 30 },
      { label: '🧑 ١٩ – ٣٠ — شاب وبادي عليك', points: 20 },
      { label: '👨 فوق ٣٠ — "أنا اللي أعيّد"', points: 12 },
    ],
  },
  {
    question: 'وجهك وقت تاخذ العيدية؟',
    emoji: '🤑',
    options: [
      { label: '😍 فرحة طفل صغير — ما أقدر أخفيها', points: 25 },
      { label: '😎 كول ومتحكّم — ما أبيّن شي', points: 15 },
      { label: '🥺 تمثيل درامي عشان يزيد المبلغ', points: 35 },
      { label: '😐 بوكر فيس احترافي كامل', points: 5 },
    ],
  },
  {
    question: 'علاقتك بأقاربك هالسنة؟',
    emoji: '👨‍👩‍👧‍👦',
    options: [
      { label: '💕 أزورهم كل فترة — العلاقة حديد', points: 30 },
      { label: '🤲 أحضر المناسبات بس', points: 20 },
      { label: '📱 أكتفي بستيكرات واتساب', points: 10 },
      { label: '👻 اختفيت من الخريطة تماماً', points: 5 },
    ],
  },
  {
    question: 'ساعدت في تجهيزات العيد؟',
    emoji: '🧹',
    options: [
      { label: '🦸 أنا قائد عمليات التجهيز!', points: 35 },
      { label: '🙋 ساعدت على قد ما أقدر', points: 20 },
      { label: '📺 كنت أشجّع الفريق من الكنبة', points: 10 },
      { label: '🏃 طلعت "مشوار ضروري" وقت الشغل', points: 5 },
    ],
  },
  {
    question: 'لو أحد عطاك ١٠ ريال عيدية؟',
    emoji: '💸',
    options: [
      { label: '🤲 الحمدلله — كل ريال نعمة', points: 30 },
      { label: '😊 أبتسم وآخذها بكل حب', points: 22 },
      { label: '😤 أقول "بس عشرة؟!" بصوت عالي', points: 8 },
      { label: '🫡 أرجعها: "خلها لك يا عم"', points: 35 },
    ],
  },
]

const quizResults = [
  { min: 0,   max: 55,  amount: 5,    emoji: '💀', title: '٥ ريال — والرحمة زيادة!',         desc: 'اشتغل على علاقاتك وارجع السنة الجاية 😂',                         glow: 'rgba(120,120,130,0.10)', border: 'rgba(120,120,130,0.15)', bg: 'rgba(120,120,130,0.04)' },
  { min: 56,  max: 85,  amount: 50,   emoji: '😅', title: '٥٠ ريال — مو وحشة!',              desc: 'فيك خير بس تحتاج تشتغل على نفسك شوي',                              glow: 'rgba(160,160,170,0.12)', border: 'rgba(160,160,170,0.18)', bg: 'rgba(160,160,170,0.05)' },
  { min: 86,  max: 115, amount: 200,  emoji: '😄', title: '٢٠٠ ريال — مستاهل والله!',        desc: 'واضح إنك إنسان محترم ومحبوب عند الناس',                             glow: 'rgba(201,168,76,0.20)',  border: 'rgba(201,168,76,0.28)',  bg: 'rgba(201,168,76,0.06)'  },
  { min: 116, max: 145, amount: 500,  emoji: '🤩', title: '٥٠٠ ريال — ماشاءالله عليك!',      desc: 'كرمك وطيبتك واصلة — ربي يحفظك ويزيدك',                              glow: 'rgba(201,168,76,0.35)',  border: 'rgba(201,168,76,0.45)',  bg: 'rgba(201,168,76,0.08)'  },
  { min: 146, max: 200, amount: 1000, emoji: '🥹', title: '١٬٠٠٠ ريال — أنت كنز بشري!',     desc: 'العالم يحتاج ناس زيك — الله يسعدك ويوفقك دايماً',                   glow: 'rgba(201,168,76,0.55)',  border: 'rgba(201,168,76,0.65)',  bg: 'rgba(201,168,76,0.14)'  },
]

/* ── Confetti ── */
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

/* ── Quiz Calculator ── */
function EidiyaCalculator() {
  const [step, setStep] = useState(0)         // 0 = intro, 1-5 = questions, 6 = result
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [animatedAmount, setAnimatedAmount] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  const totalQ = quizQuestions.length

  const getResult = useCallback(() => {
    for (const r of quizResults) if (totalScore >= r.min && totalScore <= r.max) return r
    return quizResults[0]
  }, [totalScore])

  /* Count-up animation when result appears */
  useEffect(() => {
    if (step !== totalQ + 1) return
    const result = getResult()
    const target = result.amount
    const steps = 30
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setAnimatedAmount(target)
        clearInterval(interval)
      } else {
        setAnimatedAmount(Math.round(current))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [step, totalScore, getResult])

  const fadeTransition = (callback) => {
    setFadeIn(false)
    setTimeout(() => {
      callback()
      setTimeout(() => setFadeIn(true), 50)
    }, 200)
  }

  const handleStart = () => fadeTransition(() => setStep(1))

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)

    const points = quizQuestions[step - 1].options[idx].points
    setTimeout(() => {
      const newAnswers = [...answers, points]
      setAnswers(newAnswers)

      fadeTransition(() => {
        setSelected(null)
        if (step >= totalQ) {
          const total = newAnswers.reduce((a, b) => a + b, 0)
          setTotalScore(total)
          setStep(totalQ + 1)
        } else {
          setStep(step + 1)
        }
      })
    }, 400)
  }

  const reset = () => {
    fadeTransition(() => {
      setStep(0)
      setAnswers([])
      setSelected(null)
      setTotalScore(0)
      setAnimatedAmount(0)
    })
  }

  const shareWa = () => {
    const result = getResult()
    const text = `حاسبة العيدية قالت إني أستاهل ${result.title} 🎉\nكم تستاهل أنت؟ جرّب:\n${window.location.origin}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const result = step > totalQ ? getResult() : null
  const pct = step > 0 && step <= totalQ ? (step / totalQ) * 100 : step > totalQ ? 100 : 0
  const cardStyle = result
    ? { background: result.bg, border: `1.5px solid ${result.border}`, boxShadow: `0 0 80px ${result.glow}, 0 0 160px ${result.glow}` }
    : { background: 'rgba(201,168,76,0.04)', border: '1.5px solid rgba(201,168,76,0.12)', boxShadow: '0 0 60px rgba(201,168,76,0.04)' }

  return (
    <section className="section-container bg-[#0A0A0A] py-20 sm:py-28">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />

      <div className="section-inner max-w-xl">
        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-[#C9A84C]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">تسلية</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4">كم تستاهل عيدية؟ 🧮</h2>
          <p className="text-white/30 text-sm mt-4 leading-relaxed">جاوب على ٥ أسئلة وبنحسب لك عيديتك المستحقة!</p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 transition-all duration-500 overflow-hidden" style={cardStyle}>
          {result && <Confetti active={result.amount >= 500} />}

          {/* Progress bar — visible during quiz & result */}
          {step > 0 && (
            <div className="relative z-10 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/25 text-[11px] font-bold">
                  {step <= totalQ ? `سؤال ${toAr(step)} من ${toAr(totalQ)}` : '✨ النتيجة'}
                </span>
                <span className="text-[#C9A84C]/70 text-[11px] font-bold">{toAr(Math.round(pct))}٪</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #5a5a60 0%, #C9A84C 50%, #f3ead0 100%)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Animated content area */}
          <div className={`relative z-10 transition-all duration-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>

            {/* ── INTRO SCREEN ── */}
            {step === 0 && (
              <div className="text-center py-6">
                <div className="text-6xl sm:text-7xl mb-6 animate-emoji-pop">🧮</div>
                <h3 className="text-white/90 font-bold text-xl sm:text-2xl mb-3">اكتشف عيديتك المستحقة!</h3>
                <p className="text-white/35 text-sm leading-[1.9] mb-8 max-w-sm mx-auto">
                  ٥ أسئلة سريعة عن شخصيتك وعلاقاتك — وبنقول لك كم تستاهل عيدية هالسنة بناءً على سلوكك الاجتماعي 😄
                </p>
                <button onClick={handleStart} className="btn-gold !py-4 !px-10 !text-base mx-auto">
                  يلا نبدأ! 🚀
                </button>
              </div>
            )}

            {/* ── QUESTION SCREEN ── */}
            {step >= 1 && step <= totalQ && (
              <div className="py-2">
                <div className="text-center mb-8">
                  <div className="text-5xl sm:text-6xl mb-4">{quizQuestions[step - 1].emoji}</div>
                  <h3 className="text-white/90 font-bold text-lg sm:text-xl">{quizQuestions[step - 1].question}</h3>
                </div>
                <div className="space-y-3">
                  {quizQuestions[step - 1].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={`w-full text-right px-5 py-4 rounded-2xl text-sm sm:text-[15px] font-medium transition-all duration-300 ${
                        selected === i
                          ? 'bg-gradient-to-br from-[#c4a44e] to-[#d4b96b] text-[#0A0A0A] scale-[1.02] shadow-lg shadow-[#C9A84C]/20'
                          : selected !== null
                            ? 'bg-white/[0.02] text-white/20 border border-white/[0.04] cursor-not-allowed'
                            : 'bg-white/[0.03] text-white/60 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/80 hover:border-[#C9A84C]/20 hover:scale-[1.01]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── RESULT SCREEN ── */}
            {step > totalQ && result && (
              <div className="text-center py-4">
                <div className="text-6xl sm:text-7xl mb-4 animate-emoji-pop">{result.emoji}</div>
                <div className="text-5xl sm:text-7xl font-black text-white tabular-nums leading-none mb-2">
                  {toAr(animatedAmount)}
                </div>
                <span className="text-[#C9A84C] text-lg font-bold">ريال</span>

                {/* Verdict card */}
                <div
                  className="mt-6 rounded-2xl p-5 sm:p-6 text-center transition-all duration-500"
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${result.border}` }}
                >
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">{result.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{result.desc}</p>
                </div>

                {/* Deserving meter */}
                <div className="mt-6 text-right">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/25 text-[11px] font-bold">مقياس الاستحقاق</span>
                    <span className="text-[#C9A84C]/70 text-[11px] font-bold">{toAr(Math.round(Math.min((totalScore / 165) * 100, 100)))}٪</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min((totalScore / 165) * 100, 100)}%`,
                        background: `linear-gradient(90deg, #5a5a60 0%, #C9A84C ${Math.min((totalScore / 165) * 200, 100)}%, #f3ead0 100%)`,
                        boxShadow: totalScore > 80 ? `0 0 12px rgba(201,168,76,${totalScore / 400})` : 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={shareWa} className="btn-gold w-full justify-center">
                    <Share2 className="w-4 h-4" />
                    <span>شارك نتيجتك</span>
                  </button>
                  <button onClick={reset} className="btn-outline-gold w-full justify-center">
                    🔄 جرّب مرة ثانية
                  </button>
                </div>

                {/* Design CTA */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <Link to="/editor" className="btn-gold w-full justify-center !bg-gradient-to-br !from-[#c4a44e] !to-[#d4b96b] !text-[#0A0A0A]">
                    <Send className="w-4 h-4" />
                    <span>صمّم بطاقة عيدية وأرسلها</span>
                  </Link>
                </div>

                {/* Fun hint */}
                <div className="mt-6 rounded-2xl p-4 sm:p-5 text-center bg-[#C9A84C]/[0.04] border border-[#C9A84C]/10">
                  <p className="text-white/50 text-sm leading-relaxed">
                    💡 <span className="text-[#C9A84C] font-bold">أرسل عيدية حقيقية!</span> صمّم بطاقة تهنئة مع المبلغ — وشاركها عبر واتساب
                  </p>
                </div>
              </div>
            )}

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
        <div className="flex flex-col items-center w-full">
          <div 
            className="w-full max-w-lg rounded-3xl p-6 sm:p-10 transition-all duration-500 bg-[#C9A84C]/[0.03] border-[1.5px] border-[#C9A84C]/12"
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
          <div className="w-full max-w-lg mt-6 sm:mt-8 rounded-2xl p-5 sm:p-6 text-center bg-[#C9A84C]/[0.04] border border-[#C9A84C]/10">
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
   FAQ - Modern Design
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ({ q, a, isOpen, toggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right group">
        <span className="text-white/90 text-[15px] font-medium group-hover:text-white transition-colors">{q}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mr-4 transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-[#d4b96b]/20 to-[#d4b96b]/10 rotate-180' 
            : 'bg-white/[0.04] hover:bg-white/[0.06]'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#d4b96b]' : 'text-white/40'}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{a}</p>
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
   STEP CARD - Modern Design
   ═══════════════════════════════════════════════════════════════════════════ */
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="step-card h-full">
      <div className="step-number">0{num}</div>
      <div className="step-icon">
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-white/95 font-bold text-lg mb-3">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE ROW - Modern Design
   ═══════════════════════════════════════════════════════════════════════════ */
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <Icon className="w-5 h-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <h3 className="text-white/95 font-semibold text-[15px] mb-1.5">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
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

        <div className="relative z-10 text-center max-w-3xl mx-auto w-full flex flex-col items-center">
          {/* Logo */}
          <div className="animate-fade-up mb-6 sm:mb-8 w-full flex justify-center">
            <img 
              src="/images/logo.png" 
              alt="سَلِّم" 
              className="h-36 sm:h-44 md:h-56 lg:h-72 w-auto drop-shadow-[0_0_60px_rgba(212,185,107,0.2)]" 
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
          <div className="animate-fade-up delay-3 mt-12 sm:mt-16 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { n: '+100', l: 'عبارة تهنئة' },
              { n: '20', l: 'قالب جاهز' },
              { n: '8', l: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.n}</div>
                <div className="stat-label">{s.l}</div>
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
      <section className="section-container bg-[#060709] py-24 sm:py-32">
        <div className="section-inner max-w-5xl">
          <div className="text-center mb-16 sm:mb-20">
            <span className="section-label">الخطوات</span>
            <h2 className="section-title">كيف تصمّم بطاقتك</h2>
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
      <section className="section-container bg-[#060709] py-24 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="section-inner max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <span className="section-label">المميزات</span>
              <h2 className="section-title mb-5">
                كل ما تحتاجه
                <br />
                <span className="text-white/40">في منصة واحدة</span>
              </h2>
              <p className="section-subtitle mb-10">
                صمّم بطاقات احترافية بخطوط عربية أصيلة وعبارات مختارة بعناية — ثم أرسلها لمن تحب مباشرة.
              </p>
              <Link to="/editor" className="group btn-ghost-gold">
                <span>جرّب المحرر الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
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
      <section className="section-container bg-[#060709] py-24 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="section-inner max-w-2xl">
          <div className="text-center mb-12 sm:mb-16">
            <span className="section-label">الأسئلة</span>
            <h2 className="section-title">أسئلة شائعة</h2>
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

        <div className="section-inner max-w-xl text-center flex flex-col items-center">
          <div className="mb-8 sm:mb-10 w-full flex justify-center">
            <img src="/images/logo.png" alt="سَلِّم" className="h-16 sm:h-20 w-auto opacity-80" />
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
