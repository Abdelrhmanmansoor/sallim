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
/* ── Multi-dimensional scoring: كل إجابة تأثر على محاور مختلفة ── */
/*  silah = صلة رحم | karam = كرم وسخاء | adab = أدب واحترام |
    juhd = جهد ومساعدة | ruh = روح وحيوية                         */

const quizQuestions = [
  {
    question: 'كم عمرك؟',
    emoji: '🎂',
    hint: 'العمر عامل أساسي في تحديد العيدية',
    options: [
      { label: 'أقل من ١٠ — طفل ومدلّع الكل', silah: 5, karam: 0, adab: 5, juhd: 0, ruh: 8 },
      { label: '١٠ – ١٥ — "يا عمو عيديتي وين؟"', silah: 4, karam: 0, adab: 4, juhd: 2, ruh: 7 },
      { label: '١٦ – ٢٢ — مراهق محتاج فلوس دائم', silah: 3, karam: 1, adab: 3, juhd: 3, ruh: 5 },
      { label: '٢٣ – ٣٥ — بديت أعيّد أنا', silah: 2, karam: 5, adab: 3, juhd: 4, ruh: 3 },
      { label: 'فوق ٣٥ — "العيدية للصغار بس"', silah: 1, karam: 7, adab: 2, juhd: 5, ruh: 2 },
    ],
  },
  {
    question: 'قبل العيد بأسبوع، وش سويت؟',
    emoji: '📅',
    hint: 'التحضير المبكر يعكس اهتمامك بالعيد وبأهلك',
    options: [
      { label: 'نظّفت البيت كامل ورتّبت المجلس وعلّقت الزينة', silah: 3, karam: 2, adab: 4, juhd: 8, ruh: 5 },
      { label: 'رحت السوق وجبت حلويات ومكسرات للضيوف', silah: 4, karam: 5, adab: 3, juhd: 5, ruh: 4 },
      { label: 'سويت قروب العيد بالواتساب وأرسلت ستيكرات', silah: 3, karam: 1, adab: 2, juhd: 2, ruh: 6 },
      { label: 'ما سويت شي — العيد يجي لحاله', silah: 0, karam: 0, adab: 1, juhd: 0, ruh: 1 },
    ],
  },
  {
    question: 'كيف صلة الرحم عندك هالسنة؟',
    emoji: '👨‍👩‍👧‍👦',
    hint: 'صلة الرحم من أعظم الأعمال — وتأثيرها مباشر على استحقاقك',
    options: [
      { label: 'أزور جدي وجدتي كل جمعة وأتصل على خالاتي وعماتي', silah: 10, karam: 3, adab: 5, juhd: 4, ruh: 4 },
      { label: 'أحرص أروح التجمعات العائلية — ما أفوّت مناسبة', silah: 7, karam: 2, adab: 4, juhd: 3, ruh: 3 },
      { label: 'أتصل عليهم بالعيد والمناسبات بس', silah: 4, karam: 1, adab: 3, juhd: 1, ruh: 2 },
      { label: 'أرسل "كل عام وأنتم بخير" بالقروب وخلاص', silah: 2, karam: 0, adab: 2, juhd: 0, ruh: 1 },
      { label: 'صراحة.. ما أدري وين أقاربي', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'جالك ضيف العيد فجأة — وش تسوي؟',
    emoji: '☕',
    hint: 'الكرم السعودي عنوان — وإكرام الضيف يرفع مقامك',
    options: [
      { label: 'أسوي قهوة سعودي وأجيب التمر وأرحّب فيه أحسن ترحيب', silah: 4, karam: 8, adab: 6, juhd: 5, ruh: 3 },
      { label: 'أطلب من التطبيق أحلى وجبة — الضيف ما ينقصه شي', silah: 3, karam: 6, adab: 4, juhd: 2, ruh: 4 },
      { label: 'أجيب له ماي وعصير — على السريع', silah: 2, karam: 3, adab: 3, juhd: 1, ruh: 2 },
      { label: 'أقول "أهلاً" وأكمّل على جوالي', silah: 0, karam: 0, adab: 1, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'خالتك عطتك ١٠ ريال عيدية. وش ردة فعلك؟',
    emoji: '💸',
    hint: 'الأدب مع الكبار يحدد شخصيتك الحقيقية',
    options: [
      { label: '"تسلمين يا خالتي، الله يبارك لك" وأدعي لها من قلبي', silah: 5, karam: 2, adab: 10, juhd: 0, ruh: 3 },
      { label: 'أبتسم وأشكرها — بدون ما أبيّن أي شي', silah: 3, karam: 1, adab: 7, juhd: 0, ruh: 2 },
      { label: 'أرجعها: "لا يا خالتي خليها لك، أنا كبرت"', silah: 4, karam: 6, adab: 8, juhd: 0, ruh: 4 },
      { label: 'أقلبها وأقول "بس عشرة يا خالتي؟!"', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 1 },
      { label: 'آخذها وأقول "مشكورة" بدون ما أطالع المبلغ', silah: 2, karam: 0, adab: 4, juhd: 0, ruh: 1 },
    ],
  },
  {
    question: 'يوم العيد الصبح — وش أول شي تسويه؟',
    emoji: '🌅',
    hint: 'بداية يوم العيد تكشف أولوياتك',
    options: [
      { label: 'أروح صلاة العيد بدري وأسلّم على الناس بالمصلّى', silah: 6, karam: 2, adab: 6, juhd: 5, ruh: 5 },
      { label: 'ألبس أحلى ثوب وأتعطّر وأتجهّز أزور الأهل', silah: 3, karam: 1, adab: 4, juhd: 3, ruh: 6 },
      { label: 'أرسل رسائل تهنئة لكل الناس بالواتساب', silah: 2, karam: 0, adab: 3, juhd: 1, ruh: 3 },
      { label: 'أنام لين الظهر — العيد ما يروح', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'شفت طفل صغير يبي عيدية ووالده محرج — وش تسوي؟',
    emoji: '🧒',
    hint: 'هذا الموقف يقيس كرمك الحقيقي وإحساسك بالناس',
    options: [
      { label: 'أعطيه عيدية حلوة وأقول لأبوه "هذا ولدنا كلنا"', silah: 5, karam: 10, adab: 6, juhd: 2, ruh: 7 },
      { label: 'أعطيه ٥٠ ريال بالسر عشان ما أحرج أحد', silah: 3, karam: 7, adab: 8, juhd: 1, ruh: 5 },
      { label: 'أعطيه حلاوة أو شوكولاتة — على الأقل شي', silah: 2, karam: 3, adab: 4, juhd: 0, ruh: 3 },
      { label: 'أطنّش وأمشي — مو شغلي', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'وش أحلى شي تحبه في العيد؟',
    emoji: '✨',
    hint: 'اللي تحبه في العيد يعكس روحك وشخصيتك',
    options: [
      { label: 'التجمع العائلي — أحب أشوف الكل مبسوط', silah: 7, karam: 2, adab: 3, juhd: 1, ruh: 6 },
      { label: 'العيديات — نجمع ونحسب ونخطط للصرف', silah: 1, karam: 0, adab: 1, juhd: 0, ruh: 5 },
      { label: 'الذبيحة والأكل — المطبخ أهم قسم في العيد', silah: 3, karam: 4, adab: 2, juhd: 4, ruh: 4 },
      { label: 'الأجواء الروحانية — صلاة العيد والتكبيرات', silah: 4, karam: 3, adab: 6, juhd: 2, ruh: 3 },
      { label: 'الإجازة — أقعد على البلايستيشن طول اليوم', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 2 },
    ],
  },
]

/* ── 12 Result tiers with personality analysis ── */
const quizResults = [
  { min: 0,   max: 25,  amount: 1,     emoji: '💀', title: 'ريال واحد بس',
    desc: 'يا صاحبي.. لازم تشتغل على نفسك جد! الصلة والكرم والأدب كلهم يحتاجون مراجعة شاملة.',
    analysis: 'صلة الرحم: معدومة | الكرم: غائب | الأدب: يحتاج مراجعة',
    glow: 'rgba(100,100,110,0.08)', border: 'rgba(100,100,110,0.12)', bg: 'rgba(100,100,110,0.03)' },
  { min: 26,  max: 50,  amount: 5,     emoji: '😑', title: '٥ ريال — الرحمة زيادة',
    desc: 'الحمدلله إنك لقيت أحد يعيّدك أصلاً! ابدأ السنة الجاية من بدري — زُر أقاربك ورحّب بضيوفك.',
    analysis: 'صلة الرحم: ضعيفة جداً | الكرم: بالكاد | الأدب: فيه أمل',
    glow: 'rgba(120,120,130,0.10)', border: 'rgba(120,120,130,0.15)', bg: 'rgba(120,120,130,0.04)' },
  { min: 51,  max: 75,  amount: 10,    emoji: '😶', title: '١٠ ريال — الله يعطيك',
    desc: 'مو أسوأ شي بس مو أحسن شي — عندك بذرة خير بس تحتاج تسقيها بصلة الرحم والكرم.',
    analysis: 'صلة الرحم: تحت المتوسط | الكرم: خجول | الأدب: لا بأس',
    glow: 'rgba(140,140,150,0.12)', border: 'rgba(140,140,150,0.18)', bg: 'rgba(140,140,150,0.04)' },
  { min: 76,  max: 100, amount: 25,    emoji: '🙂', title: '٢٥ ريال — ماشي الحال',
    desc: 'فيك خير بس مختبي! تحتاج تبادر أكثر — زُر أهلك، ساعد في التجهيزات، ورحّب بالضيوف.',
    analysis: 'صلة الرحم: متوسطة | الكرم: موجود | الأدب: محترم',
    glow: 'rgba(160,160,170,0.14)', border: 'rgba(160,160,170,0.20)', bg: 'rgba(160,160,170,0.05)' },
  { min: 101, max: 130, amount: 50,    emoji: '😊', title: '٥٠ ريال — تمام التمام',
    desc: 'أنت شخص طيّب ومحترم — الناس تحبك وتقدّرك. شوي كمان وتصير من نجوم العيد!',
    analysis: 'صلة الرحم: جيدة | الكرم: واضح | الأدب: عالي | الجهد: لا بأس',
    glow: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.18)', bg: 'rgba(201,168,76,0.04)' },
  { min: 131, max: 160, amount: 100,   emoji: '😄', title: '١٠٠ ريال — الحين صار كلام',
    desc: 'ماشاء الله عليك — واصل وعندك من الطيب والأدب شي كبير. أقاربك فخورين فيك!',
    analysis: 'صلة الرحم: قوية | الكرم: جميل | الأدب: ممتاز | الروح: حلوة',
    glow: 'rgba(201,168,76,0.20)', border: 'rgba(201,168,76,0.28)', bg: 'rgba(201,168,76,0.06)' },
  { min: 161, max: 195, amount: 200,   emoji: '🤩', title: '٢٠٠ ريال — مستوى عالي',
    desc: 'أنت من الناس اللي تشرّف أهلها — كريم ومحترم وعندك روح حلوة. ربي يحفظك!',
    analysis: 'صلة الرحم: ممتازة | الكرم: أصيل | الأدب: راقي | الجهد: مميز',
    glow: 'rgba(201,168,76,0.30)', border: 'rgba(201,168,76,0.38)', bg: 'rgba(201,168,76,0.08)' },
  { min: 196, max: 230, amount: 350,   emoji: '🥰', title: '٣٥٠ ريال — قلب طيّب ماشاءالله',
    desc: 'كرم وأدب وصلة رحم — أنت الشخص اللي الكل يتمنى يكون جنبه في العيد. ربي يزيدك!',
    analysis: 'صلة الرحم: قدوة | الكرم: فوق المتوسط | الأدب: عالي جداً | الروح: مشرقة',
    glow: 'rgba(201,168,76,0.38)', border: 'rgba(201,168,76,0.48)', bg: 'rgba(201,168,76,0.10)' },
  { min: 231, max: 260, amount: 500,   emoji: '🥹', title: '٥٠٠ ريال — مستوى البركة',
    desc: 'الله يبارك فيك وفي أهلك. أنت من الناس اللي ترفع رأس عايلتها!',
    analysis: 'صلة الرحم: يُحتذى بها | الكرم: حاتمي | الأدب: استثنائي | الجهد: دائم',
    glow: 'rgba(201,168,76,0.45)', border: 'rgba(201,168,76,0.55)', bg: 'rgba(201,168,76,0.12)' },
  { min: 261, max: 290, amount: 750,   emoji: '👏', title: '٧٥٠ ريال — والله ما تستاهل أقل',
    desc: 'أنت مو إنسان عادي — أنت نعمة على أهلك وأقاربك. صلة رحمك وكرمك وأدبك ما لهم مثيل!',
    analysis: 'كل المحاور: فوق الممتاز | شخصية: نادرة ومميزة',
    glow: 'rgba(201,168,76,0.50)', border: 'rgba(201,168,76,0.60)', bg: 'rgba(201,168,76,0.13)' },
  { min: 291, max: 320, amount: 1000,  emoji: '🏆', title: '١٬٠٠٠ ريال — أسطورة العيد',
    desc: 'أنت مؤسسة خيرية ماشية على رجلين — الله يجزاك خير ويبارك فيك ويجعلك قدوة للكل!',
    analysis: 'كل المحاور: الحد الأقصى | شخصية: أسطورية',
    glow: 'rgba(201,168,76,0.55)', border: 'rgba(201,168,76,0.65)', bg: 'rgba(201,168,76,0.14)' },
  { min: 321, max: 999, amount: 2000,  emoji: '👑', title: '٢٬٠٠٠ ريال — ملك العيد بلا منازع',
    desc: 'مافي أحد يوصل لهالمستوى غيرك — كرم حاتمي، أدب ملكي، صلة رحم أسطورية. أنت قصة نجاح بذاتك!',
    analysis: 'تقييم استثنائي في كل محور — ١٪ فقط يوصلون لهالمرحلة',
    glow: 'rgba(201,168,76,0.65)', border: 'rgba(201,168,76,0.75)', bg: 'rgba(201,168,76,0.18)' },
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

/* ── Score calculation helper ── */
function calcScores(answers) {
  const totals = { silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 }
  answers.forEach(a => {
    totals.silah += a.silah || 0
    totals.karam += a.karam || 0
    totals.adab += a.adab || 0
    totals.juhd += a.juhd || 0
    totals.ruh += a.ruh || 0
  })
  const total = totals.silah + totals.karam + totals.adab + totals.juhd + totals.ruh
  return { totals, total }
}

/* ── Axis labels for the breakdown ── */
const axisLabels = [
  { key: 'silah', label: 'صلة الرحم', max: 45 },
  { key: 'karam', label: 'الكرم', max: 40 },
  { key: 'adab',  label: 'الأدب', max: 45 },
  { key: 'juhd',  label: 'الجهد', max: 30 },
  { key: 'ruh',   label: 'الروح', max: 35 },
]

/* ── Quiz Calculator ── */
function EidiyaCalculator() {
  const [step, setStep] = useState(0)
  const [answerData, setAnswerData] = useState([])
  const [selected, setSelected] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [scoreTotals, setScoreTotals] = useState(null)
  const [animatedAmount, setAnimatedAmount] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  const totalQ = quizQuestions.length

  const getResult = useCallback(() => {
    for (const r of quizResults) if (totalScore >= r.min && totalScore <= r.max) return r
    return quizResults[quizResults.length - 1]
  }, [totalScore])

  /* Count-up animation when result appears */
  useEffect(() => {
    if (step !== totalQ + 1) return
    const result = getResult()
    const target = result.amount
    const steps = 40
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
    }, 40)
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

    const option = quizQuestions[step - 1].options[idx]
    setTimeout(() => {
      const newAnswerData = [...answerData, option]

      fadeTransition(() => {
        setSelected(null)
        if (step >= totalQ) {
          const { totals, total } = calcScores(newAnswerData)
          setAnswerData(newAnswerData)
          setScoreTotals(totals)
          setTotalScore(total)
          setStep(totalQ + 1)
        } else {
          setAnswerData(newAnswerData)
          setStep(step + 1)
        }
      })
    }, 400)
  }

  const reset = () => {
    fadeTransition(() => {
      setStep(0)
      setAnswerData([])
      setSelected(null)
      setTotalScore(0)
      setScoreTotals(null)
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
    <section className="section-container bg-[#0A0A0A] py-24 sm:py-36">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />

      <div className="section-inner max-w-xl">
        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-[#C9A84C]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">تسلية</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4">كم تستاهل عيدية؟</h2>
          <p className="text-white/30 text-sm mt-4 leading-relaxed">جاوب على ٨ أسئلة وبنحسب لك عيديتك المستحقة بناءً على شخصيتك</p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 transition-all duration-500 overflow-hidden" style={cardStyle}>
          {result && <Confetti active={result.amount >= 500} />}

          {/* Progress bar — visible during quiz & result */}
          {step > 0 && (
            <div className="relative z-10 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/25 text-[11px] font-bold">
                  {step <= totalQ ? `سؤال ${toAr(step)} من ${toAr(totalQ)}` : 'النتيجة'}
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
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/15 flex items-center justify-center">
                  <Gift className="w-9 h-9 text-[#C9A84C]/80" />
                </div>
                <h3 className="text-white/90 font-bold text-xl sm:text-2xl mb-3">اكتشف عيديتك المستحقة</h3>
                <p className="text-white/35 text-sm leading-[1.9] mb-8 max-w-sm mx-auto">
                  ٨ أسئلة سريعة عن شخصيتك وعلاقاتك — وبنحلّل لك كم تستاهل عيدية هالسنة بناءً على ٥ محاور
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {axisLabels.map(a => (
                    <span key={a.key} className="text-[11px] text-white/25 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 font-medium">{a.label}</span>
                  ))}
                </div>
                <button onClick={handleStart} className="btn-gold !py-4 !px-10 !text-base mx-auto">
                  يلا نبدأ
                </button>
              </div>
            )}

            {/* ── QUESTION SCREEN ── */}
            {step >= 1 && step <= totalQ && (
              <div className="py-2">
                <div className="text-center mb-8">
                  <div className="text-4xl sm:text-5xl mb-4 opacity-80">{quizQuestions[step - 1].emoji}</div>
                  <h3 className="text-white/90 font-bold text-lg sm:text-xl mb-2">{quizQuestions[step - 1].question}</h3>
                  {quizQuestions[step - 1].hint && (
                    <p className="text-white/20 text-xs leading-relaxed max-w-xs mx-auto">{quizQuestions[step - 1].hint}</p>
                  )}
                </div>
                <div className="space-y-3">
                  {quizQuestions[step - 1].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={`w-full text-right px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        selected === i
                          ? 'bg-gradient-to-br from-[#c4a44e] to-[#d4b96b] text-[#0A0A0A] scale-[1.02] shadow-lg shadow-[#C9A84C]/10'
                          : selected !== null
                            ? 'bg-white/[0.02] text-white/15 cursor-not-allowed'
                            : 'bg-white/[0.03] text-white/55 hover:bg-white/[0.06] hover:text-white/80'
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
                {/* Amount display */}
                <div className="mb-2">
                  <span className="text-3xl opacity-70">{result.emoji}</span>
                </div>
                <div className="text-5xl sm:text-7xl font-black text-white tabular-nums leading-none mb-1">
                  {toAr(animatedAmount)}
                </div>
                <span className="text-[#C9A84C]/80 text-base font-bold tracking-wide">ريال سعودي</span>

                {/* Verdict card */}
                <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 text-center" style={{ borderColor: result.border }}>
                  <h3 className="text-white/90 font-bold text-lg mb-2">{result.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{result.desc}</p>
                </div>

                {/* 5-Axis Breakdown */}
                {scoreTotals && (
                  <div className="mt-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                    <h4 className="text-white/40 text-xs font-bold tracking-wider mb-4 text-center">تحليل الشخصية</h4>
                    <div className="space-y-3">
                      {axisLabels.map(axis => {
                        const val = scoreTotals[axis.key] || 0
                        const pctAxis = Math.min((val / axis.max) * 100, 100)
                        return (
                          <div key={axis.key}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white/40 text-xs font-medium">{axis.label}</span>
                              <span className="text-[#C9A84C]/50 text-xs font-bold">{toAr(Math.round(pctAxis))}٪</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${pctAxis}%`,
                                  background: pctAxis > 60
                                    ? 'linear-gradient(90deg, #C9A84C, #f3ead0)'
                                    : pctAxis > 30
                                      ? 'linear-gradient(90deg, #8a8a90, #C9A84C)'
                                      : 'linear-gradient(90deg, #5a5a60, #8a8a90)',
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {result.analysis && (
                      <p className="text-white/20 text-[11px] leading-relaxed mt-4 pt-3 border-t border-white/[0.04] text-center">{result.analysis}</p>
                    )}
                  </div>
                )}

                {/* Overall deserving meter */}
                <div className="mt-5 text-right">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/25 text-[11px] font-bold">مقياس الاستحقاق</span>
                    <span className="text-[#C9A84C]/60 text-[11px] font-bold">{toAr(Math.round(Math.min((totalScore / 320) * 100, 100)))}٪</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min((totalScore / 320) * 100, 100)}%`,
                        background: `linear-gradient(90deg, #5a5a60 0%, #C9A84C 50%, #f3ead0 100%)`,
                        boxShadow: totalScore > 160 ? `0 0 12px rgba(201,168,76,${Math.min(totalScore / 500, 0.5)})` : 'none',
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
                    جرّب مرة ثانية
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
                <div className="mt-5 rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                  <p className="text-white/35 text-xs leading-relaxed text-center">
                    <span className="text-[#C9A84C]/70 font-semibold">أرسل عيدية حقيقية</span> — صمّم بطاقة تهنئة مع المبلغ وشاركها عبر واتساب
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
    { title: 'عشوائي بالكامل', desc: 'العداد يختار مبلغ عشوائي من ٥ إلى ٢٬٠٠٠ ريال — مافي أحد يعرف النتيجة' },
    { title: 'ردود فعل مضحكة', desc: '٧ ردود فعل بالسعودية — من "يعني... مشكور" إلى "هذا مو عيدية... هذا راتب"' },
    { title: 'يعمل على كل جهاز', desc: 'الرابط يفتح مباشرة على أي جوال أو كمبيوتر — بدون تحميل أي شي' },
    { title: 'شارك بسهولة', desc: 'انسخ الرابط أو أرسله واتساب — المستلم يضغط ويلفّ فوراً' },
  ]

  const steps = [
    { num: '١', title: 'اكتب اسمك', desc: 'عشان المستلم يعرف مين يعيّده' },
    { num: '٢', title: 'شارك الرابط', desc: 'واتساب أو نسخ — حسب ما تبي' },
    { num: '٣', title: 'يلفّ العداد!', desc: 'المستلم يضغط ويشوف حظه 🎰' },
  ]

  return (
    <section className="section-container bg-[#070810] py-24 sm:py-36">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />

      <div className="section-inner max-w-4xl">
        {/* Section Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/06 border border-[#C9A84C]/10 rounded-full px-4 py-2 mb-6">
            <Gift className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium">ميزة جديدة — تسلية العيد</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white/90 mb-5 leading-tight">
            عيديتك بحظك!
          </h2>
          <p className="text-white/40 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            أنشئ رابط عيدية عشوائي وأرسله لأصدقائك وعائلتك —
            <br className="hidden sm:block" />
            المستلم يلفّ العداد ويطلع له مبلغ عشوائي مع ردة فعل مضحكة!
          </p>
        </div>

        {/* Features - minimal, no cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14 sm:mb-20">
          {luckFeatures.map((f, i) => (
            <div key={i} className="text-center">
              <h4 className="text-white/70 font-semibold text-sm mb-2">{f.title}</h4>
              <p className="text-white/30 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Steps - inline, no card borders */}
        <div className="flex items-center justify-center gap-4 sm:gap-10 mb-14 sm:mb-20">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4 sm:gap-10">
              <div className="flex flex-col items-center text-center">
                <span className="text-[#C9A84C]/60 text-2xl font-black mb-2">{s.num}</span>
                <h4 className="text-white/70 font-semibold text-xs sm:text-sm mb-0.5">{s.title}</h4>
                <p className="text-white/30 text-[10px] sm:text-xs">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-white/10 text-lg">←</span>
              )}
            </div>
          ))}
        </div>

        {/* Generator Card */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-lg gold-card p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-white/90 font-bold text-lg mb-2">أنشئ رابط العيدية</h3>
              <p className="text-white/35 text-sm leading-relaxed">اكتب اسمك وشارك الرابط مع أي شخص تبي تعيّده</p>
            </div>

            {/* Name input */}
            <div className="mb-5">
              <label className="block text-white/45 text-sm font-medium mb-2.5">اسمك (المُعَيِّد)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setCopied(false) }}
                placeholder="مثال: أبو فهد"
                className="unified-input"
              />
            </div>

            {/* Generated link */}
            {name.trim() && (
              <div className="mb-5 animate-fade-up">
                <label className="block text-white/30 text-xs font-medium mb-2">الرابط</label>
                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3">
                  <span className="text-white/35 text-xs truncate flex-1" dir="ltr">{link}</span>
                  <button
                    onClick={copyLink}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied
                        ? 'bg-green-500/12 text-green-400 border border-green-500/15'
                        : 'bg-[#C9A84C]/08 text-[#C9A84C] border border-[#C9A84C]/12 hover:bg-[#C9A84C]/15'
                    }`}
                  >
                    {copied ? '✔ تم' : 'انسخ'}
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
          <div className="w-full max-w-lg mt-8">
            <p className="text-white/25 text-xs text-center leading-loose">
              <span className="text-[#C9A84C]/60 font-semibold">وش يشوف المستلم؟</span>
              <br />
              يفتح الرابط ← يشوف اسمك ← يضغط "لفّ العداد" ← العداد يدور ٣ ثواني ← يطلع المبلغ العشوائي مع ردة فعل ساحرة
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
      <section className="section-container bg-[#060709] py-24 sm:py-32">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="section-inner max-w-xl text-center flex flex-col items-center">
          <div className="mb-10 w-full flex justify-center">
            <img src="/images/logo.png" alt="سَلِّم" className="h-20 sm:h-24 w-auto opacity-90" />
          </div>
          <h2 className="section-title mb-5">جاهز تصمّم بطاقتك؟</h2>
          <p className="section-subtitle mb-12 px-4 mx-auto">
            صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
          </p>
          <Link to="/editor" className="group btn-gold">
            <span>ابدأ الآن مجاناً</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
