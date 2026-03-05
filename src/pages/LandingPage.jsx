import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Palette, Type, Send, Download,
  ChevronDown, Layers, FileText, Shield, Share2, Gift,
  Shuffle, Smartphone, MessageCircle, Link2, Sparkles, Zap,
} from 'lucide-react'
import { templates } from '../data/templates'

/* ═══ Helpers ═══ */
const toAr = (n) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

/* ═══════════════════════════════════════════════════════════════════════════
   MARQUEE TICKER - Infinite Loop
   ═══════════════════════════════════════════════════════════════════════════ */
function MarqueeTicker() {
  const items = [
    '🌙 منصة رسمية لتصميم بطاقات العيد',
    '✨ أكثر من ٥٠،٠٠٠ بطاقة صُمِّمت هذا العيد',
    '🎨 قوالب فاخرة جديدة كل أسبوع',
    '📱 تصدير 1080px مجانًا',
    '💬 مشاركة مباشرة عبر واتساب',
    '🖋️ محرر عربي احترافي وسريع',
  ]
  // Duplicate items multiple times for seamless infinite loop
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div className="w-full bg-gradient-to-r from-[#fef9e7] via-[#fdf3c7] to-[#fef9e7] border-y-2 border-[#d4af37]/30">
      <div className="container-main">
        <div className="relative overflow-hidden py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {repeated.map((item, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-2.5 text-[#92400e] text-sm font-semibold">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   EIDIYA CALCULATOR
   ═══════════════════════════════════════════════════════════════════════════ */

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

const quizResults = [
  { min: 0,   max: 35,  amount: 1,     emoji: '💀', title: 'ريال واحد بس', desc: 'يا صاحبي.. لازم تشتغل على نفسك جد!', analysis: 'صلة الرحم: معدومة | الكرم: غائب', glow: 'rgba(100,100,110,0.08)', border: 'rgba(100,100,110,0.12)', bg: 'rgba(100,100,110,0.03)' },
  { min: 36,  max: 50,  amount: 5,     emoji: '😑', title: '٥ ريال — الرحمة زيادة', desc: 'الحمدلله إنك لقيت أحد يعيّدك أصلاً!', analysis: 'صلة الرحم: ضعيفة جداً | الكرم: بالكاد', glow: 'rgba(120,120,130,0.10)', border: 'rgba(120,120,130,0.15)', bg: 'rgba(120,120,130,0.04)' },
  { min: 51,  max: 65,  amount: 10,    emoji: '😶', title: '١٠ ريال — الله يعطيك', desc: 'مو أسوأ شي بس مو أحسن شي', analysis: 'صلة الرحم: تحت المتوسط | الكرم: خجول', glow: 'rgba(140,140,150,0.12)', border: 'rgba(140,140,150,0.18)', bg: 'rgba(140,140,150,0.04)' },
  { min: 66,  max: 80,  amount: 25,    emoji: '🙂', title: '٢٥ ريال — ماشي الحال', desc: 'فيك خير بس مختبي!', analysis: 'صلة الرحم: متوسطة | الكرم: موجود', glow: 'rgba(160,160,170,0.14)', border: 'rgba(160,160,170,0.20)', bg: 'rgba(160,160,170,0.05)' },
  { min: 81,  max: 95,  amount: 50,    emoji: '😊', title: '٥٠ ريال — تمام التمام', desc: 'أنت شخص طيّب ومحترم — الناس تحبك وتقدّرك.', analysis: 'صلة الرحم: جيدة | الكرم: واضح | الأدب: عالي', glow: 'rgba(37,99,235,0.12)', border: 'rgba(37,99,235,0.18)', bg: 'rgba(37,99,235,0.04)' },
  { min: 96,  max: 110, amount: 100,   emoji: '😄', title: '١٠٠ ريال — الحين صار كلام', desc: 'ماشاء الله عليك — واصل!', analysis: 'صلة الرحم: قوية | الكرم: جميل | الأدب: ممتاز', glow: 'rgba(37,99,235,0.20)', border: 'rgba(37,99,235,0.28)', bg: 'rgba(37,99,235,0.06)' },
  { min: 111, max: 125, amount: 200,   emoji: '🤩', title: '٢٠٠ ريال — مستوى عالي', desc: 'أنت من الناس اللي تشرّف أهلها', analysis: 'صلة الرحم: ممتازة | الكرم: أصيل', glow: 'rgba(37,99,235,0.30)', border: 'rgba(37,99,235,0.38)', bg: 'rgba(37,99,235,0.08)' },
  { min: 126, max: 140, amount: 350,   emoji: '🥰', title: '٣٥٠ ريال — قلب طيّب', desc: 'الكل يتمنى يكون جنبه في العيد', analysis: 'صلة الرحم: قدوة | الكرم: فوق المتوسط', glow: 'rgba(37,99,235,0.38)', border: 'rgba(37,99,235,0.48)', bg: 'rgba(37,99,235,0.10)' },
  { min: 141, max: 152, amount: 500,   emoji: '🥹', title: '٥٠٠ ريال — مستوى البركة', desc: 'أنت من الناس اللي ترفع رأس عايلتها!', analysis: 'الكرم: حاتمي | الأدب: استثنائي', glow: 'rgba(37,99,235,0.45)', border: 'rgba(37,99,235,0.55)', bg: 'rgba(37,99,235,0.12)' },
  { min: 153, max: 165, amount: 750,   emoji: '👏', title: '٧٥٠ ريال — ما تستاهل أقل', desc: 'صلة رحمك وكرمك وأدبك ما لهم مثيل!', analysis: 'كل المحاور: فوق الممتاز', glow: 'rgba(37,99,235,0.50)', border: 'rgba(37,99,235,0.60)', bg: 'rgba(37,99,235,0.13)' },
  { min: 166, max: 180, amount: 1000,  emoji: '🏆', title: '١٬٠٠٠ ريال — أسطورة العيد', desc: 'أنت مؤسسة خيرية ماشية على رجلين', analysis: 'كل المحاور: الحد الأقصى', glow: 'rgba(37,99,235,0.55)', border: 'rgba(37,99,235,0.65)', bg: 'rgba(37,99,235,0.14)' },
  { min: 181, max: 999, amount: 2000,  emoji: '👑', title: '٢٬٠٠٠ ريال — ملك العيد', desc: 'كرم حاتمي، أدب ملكي، صلة رحم أسطورية', analysis: 'تقييم استثنائي في كل محور', glow: 'rgba(37,99,235,0.65)', border: 'rgba(37,99,235,0.75)', bg: 'rgba(37,99,235,0.18)' },
]

const axisLabels = [
  { key: 'silah', label: 'صلة الرحم', max: 46 },
  { key: 'karam', label: 'الكرم', max: 45 },
  { key: 'adab',  label: 'الأدب', max: 50 },
  { key: 'juhd',  label: 'الجهد', max: 33 },
  { key: 'ruh',   label: 'الروح', max: 45 },
]

function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 0.6, dur: 1.2 + Math.random() * 1.2,
      size: 4 + Math.random() * 6,
      color: ['#1d4ed8', '#3b82f6', '#93c5fd', '#dbeafe', '#f59e0b'][Math.floor(Math.random() * 5)],
    })))
  }, [active])
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map(p => (
        <span key={p.id} className="absolute rounded-full animate-confetti"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  )
}

function calcScores(answers) {
  const totals = { silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 }
  answers.forEach(a => { totals.silah += a.silah || 0; totals.karam += a.karam || 0; totals.adab += a.adab || 0; totals.juhd += a.juhd || 0; totals.ruh += a.ruh || 0 })
  return { totals, total: totals.silah + totals.karam + totals.adab + totals.juhd + totals.ruh }
}

function EidiyaCalculator() {
  const [step, setStep] = useState(0)
  const [answerData, setAnswerData] = useState([])
  const [selected, setSelected] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [scoreTotals, setScoreTotals] = useState(null)
  const [animatedAmount, setAnimatedAmount] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const totalQ = quizQuestions.length

  // Sound effects for result
  const playResultSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const frequencies = [523.25, 659.25, 783.99, 1046.50]
      frequencies.forEach((freq, i) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain)
        gain.connect(audioContext.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.12, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)
        osc.start(audioContext.currentTime + i * 0.1)
        osc.stop(audioContext.currentTime + 1.2)
      })
    } catch (e) {}
  }, [])

  const getResult = useCallback(() => {
    for (const r of quizResults) if (totalScore >= r.min && totalScore <= r.max) return r
    return quizResults[quizResults.length - 1]
  }, [totalScore])

  useEffect(() => {
    if (step !== totalQ + 1) return
    const result = getResult()
    const target = result.amount
    playResultSound()
    setShowCelebration(true)
    let current = 0
    const interval = setInterval(() => {
      current += target / 40
      if (current >= target) { setAnimatedAmount(target); clearInterval(interval) }
      else setAnimatedAmount(Math.round(current))
    }, 40)
    return () => clearInterval(interval)
  }, [step, totalScore, getResult, playResultSound])

  const fadeTransition = (callback) => {
    setFadeIn(false)
    setTimeout(() => { callback(); setTimeout(() => setFadeIn(true), 50) }, 200)
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
          setAnswerData(newAnswerData); setScoreTotals(totals); setTotalScore(total); setStep(totalQ + 1)
        } else { setAnswerData(newAnswerData); setStep(step + 1) }
      })
    }, 400)
  }

  const reset = () => { setShowCelebration(false); fadeTransition(() => { setStep(0); setAnswerData([]); setSelected(null); setTotalScore(0); setScoreTotals(null); setAnimatedAmount(0) }) }

  const shareWa = () => {
    const result = getResult()
    const text = `حاسبة العيدية قالت إني أستاهل ${result.title} 🎉\nكم تستاهل أنت؟ جرّب:\n${window.location.origin}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const result = step > totalQ ? getResult() : null
  const pct = step > 0 && step <= totalQ ? (step / totalQ) * 100 : step > totalQ ? 100 : 0

  return (
    <section className="section-spacing bg-gradient-to-b from-[#f8fafc] to-[#fef9e7]/30">
      <div className="container-main">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <span className="official-badge">
              <Gift className="w-4 h-4" />
              تسلية العيد
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-4 mb-4">كم تستاهل عيدية؟</h2>
            <p className="text-[#64748b] text-[15px]">جاوب على ٨ أسئلة وبنحسب لك عيديتك المستحقة</p>
          </div>

          <div className="eidiya-card-luxury relative overflow-hidden">
            {result && <Confetti active={result.amount >= 500} />}

            {step > 0 && (
              <div className="relative z-10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/40 text-xs font-medium">{step <= totalQ ? `سؤال ${toAr(step)} من ${toAr(totalQ)}` : '🎉 النتيجة'}</span>
                  <span className="text-[#d4af37] text-xs font-bold">{toAr(Math.round(pct))}٪</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e4a6] transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}

            <div className={`relative z-10 transition-all duration-200 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {step === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center">
                    <Gift className="w-7 h-7 text-[#3b82f6]" />
                  </div>
                  <h3 className="text-white/90 font-bold text-xl mb-2">اكتشف عيديتك المستحقة</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm mx-auto">٨ أسئلة سريعة عن شخصيتك وعلاقاتك</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {axisLabels.map(a => (
                      <span key={a.key} className="text-[11px] text-white/25 bg-white/[0.03] border border-white/[0.06] rounded-full px-2.5 py-1">{a.label}</span>
                    ))}
                  </div>
                  <button onClick={handleStart} className="btn-gold mx-auto">يلا نبدأ</button>
                </div>
              )}

              {step >= 1 && step <= totalQ && (
                <div className="py-2">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{quizQuestions[step - 1].emoji}</div>
                    <h3 className="text-white/90 font-bold text-lg mb-1">{quizQuestions[step - 1].question}</h3>
                    {quizQuestions[step - 1].hint && <p className="text-white/25 text-xs">{quizQuestions[step - 1].hint}</p>}
                  </div>
                  <div className="space-y-2.5">
                    {quizQuestions[step - 1].options.map((opt, i) => (
                      <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                        className={`w-full text-right px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                          selected === i ? 'bg-[#1d4ed8] text-white' : selected !== null ? 'bg-white/[0.02] text-white/15 cursor-not-allowed' : 'bg-white/[0.03] text-white/55 hover:bg-[#1d4ed8]/15 hover:text-white/80'
                        }`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {step > totalQ && result && (
                <div className="text-center py-4">
                  <div className="mb-2"><span className="text-3xl">{result.emoji}</span></div>
                  <div className="text-5xl sm:text-6xl font-black text-white tabular-nums leading-none mb-1">{toAr(animatedAmount)}</div>
                  <span className="text-[#3b82f6] text-sm font-bold">ريال سعودي</span>

                  <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 text-center">
                    <h3 className="text-white/90 font-bold text-base mb-1">{result.title}</h3>
                    <p className="text-white/40 text-sm">{result.desc}</p>
                  </div>

                  {scoreTotals && (
                    <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                      <h4 className="text-white/40 text-xs font-bold mb-3 text-center">تحليل الشخصية</h4>
                      <div className="space-y-2.5">
                        {axisLabels.map(axis => {
                          const val = scoreTotals[axis.key] || 0
                          const pctAxis = Math.min((val / axis.max) * 100, 100)
                          return (
                            <div key={axis.key}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-white/40 text-xs">{axis.label}</span>
                                <span className="text-[#3b82f6]/60 text-xs font-bold">{toAr(Math.round(pctAxis))}٪</span>
                              </div>
                              <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                                <div className="h-full rounded-full bg-[#2563eb] transition-all duration-1000 ease-out" style={{ width: `${pctAxis}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={shareWa} className="btn-gold w-full justify-center"><Share2 className="w-4 h-4" /><span>شارك نتيجتك</span></button>
                    <button onClick={reset} className="btn-outline-gold w-full justify-center !bg-transparent !text-white/60 !border-white/10 hover:!bg-white/5">جرّب مرة ثانية</button>
                  </div>

                  <div className="mt-5 pt-5 border-t border-white/[0.06]">
                    <Link to="/editor" className="btn-gold w-full justify-center"><Send className="w-4 h-4" /><span>صمّم بطاقة عيدية</span></Link>
                  </div>
                </div>
              )}
            </div>
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
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const shareWa = () => {
    if (!link) return
    const text = `🎰 عيديتك بحظك! لفّ العداد وشوف كم عيديتك من ${name.trim()} 🌙\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const luckFeatures = [
    { icon: Shuffle, title: 'عشوائي بالكامل', desc: 'مبلغ عشوائي من ٥ إلى ٢٬٠٠٠ ريال' },
    { icon: MessageCircle, title: 'ردود فعل مضحكة', desc: '٧ ردود فعل بالسعودية' },
    { icon: Smartphone, title: 'يعمل على كل جهاز', desc: 'بدون تحميل أي شي' },
    { icon: Link2, title: 'شارك بسهولة', desc: 'انسخ الرابط أو أرسله واتساب' },
  ]

  const steps = [
    { num: '١', title: 'اكتب اسمك', desc: 'عشان المستلم يعرف مين يعيّده' },
    { num: '٢', title: 'شارك الرابط', desc: 'واتساب أو نسخ' },
    { num: '٣', title: 'يلفّ العداد!', desc: 'يشوف حظه 🎰' },
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="container-main">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <span className="section-label"><Sparkles className="w-3.5 h-3.5" /> ميزة جديدة</span>
            <h2 className="section-title mt-3 mb-4">عيديتك بحظك!</h2>
            <p className="text-[#64748b] text-[15px] leading-relaxed max-w-lg mx-auto">
              أنشئ رابط عيدية عشوائي وأرسله لأصدقائك — المستلم يلفّ العداد ويطلع له مبلغ مع ردة فعل مضحكة
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-5 mb-12">
            {luckFeatures.map((f, i) => (
              <div key={i} className="rounded-xl border border-[#e2e8f0] bg-white p-5 text-center hover:border-[#bfdbfe] hover:shadow-sm transition-all">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center">
                  <f.icon className="w-4.5 h-4.5 text-[#1d4ed8]" strokeWidth={1.5} />
                </div>
                <h4 className="text-[#0f172a] font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-[#64748b] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="flex items-start justify-center gap-12 mb-12">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full mb-2 bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center">
                  <span className="text-[#1d4ed8] text-sm font-black">{s.num}</span>
                </div>
                <h4 className="text-[#0f172a] font-bold text-sm mb-0.5">{s.title}</h4>
                <p className="text-[#64748b] text-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Generator Card */}
          <div className="max-w-md mx-auto">
            <div className="rounded-2xl bg-white border border-[#e2e8f0] p-7 sm:p-9 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#1d4ed8]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[#0f172a] font-bold text-lg mb-2">أنشئ رابط العيدية</h3>
                <p className="text-[#64748b] text-sm">اكتب اسمك وشارك الرابط</p>
              </div>

              <div className="mb-5">
                <label className="block text-[#475569] text-sm font-semibold mb-2 text-center">اسمك (المُعَيِّد)</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setCopied(false) }}
                  placeholder="مثال: أبو فهد" className="unified-input w-full text-center" />
              </div>

              {name.trim() && (
                <div className="mb-5 animate-fade-up">
                  <label className="block text-[#64748b] text-xs font-semibold mb-2 text-center">الرابط</label>
                  <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3">
                    <span className="text-[#64748b] text-xs truncate flex-1 font-mono" dir="ltr">{link}</span>
                    <button onClick={copyLink}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        copied ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe] hover:bg-[#dbeafe]'
                      }`}>{copied ? '✔ تم' : 'انسخ'}</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={shareWa} disabled={!name.trim()} className={`btn-gold w-full justify-center ${!name.trim() ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <Share2 className="w-4 h-4" /><span>أرسل واتساب</span>
                </button>
                <button onClick={copyLink} disabled={!name.trim()} className={`btn-outline-gold w-full justify-center ${!name.trim() ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  {copied ? '✔ تم النسخ!' : 'انسخ الرابط'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ({ q, a, isOpen, toggle, index }) {
  return (
    <div className={`faq-item-luxury ${isOpen ? 'open' : ''}`}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right group">
        <div className="flex items-center gap-4">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-br from-[#d4af37] to-[#f4e4a6] text-[#1e1b4b]' 
              : 'bg-[#fef9e7] text-[#92400e] border border-[#d4af37]/30'
          }`}>
            {String(index + 1).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}
          </span>
          <span className={`text-[15px] font-semibold transition-colors ${isOpen ? 'text-[#92400e]' : 'text-[#0f172a]'}`}>{q}</span>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-[#d4af37] to-[#f4e4a6] rotate-180' 
            : 'bg-[#fef9e7] border border-[#d4af37]/30'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#1e1b4b]' : 'text-[#92400e]'}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pr-[4.5rem]">
            <p className="text-[#64748b] text-sm leading-relaxed">{a}</p>
          </div>
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
   STEP & FEATURE COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="step-card h-full">
      <div className="step-number">0{num}</div>
      <div className="step-icon"><Icon className="w-5 h-5" strokeWidth={1.5} /></div>
      <h3 className="text-[#0f172a] font-bold text-base mb-2">{title}</h3>
      <p className="text-[#64748b] text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon"><Icon className="w-5 h-5" strokeWidth={1.5} /></div>
      <div className="min-w-0">
        <h3 className="text-[#0f172a] font-semibold text-[15px] mb-1">{title}</h3>
        <p className="text-[#64748b] text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK CARD CREATOR
   ═══════════════════════════════════════════════════════════════════════════ */
const quickDesigns = [
  { id: 1, label: 'كلاسيكي', image: '/templates/1.png', greeting: 'عيد مبارك', sub: 'كل عام وأنتم بخير', nameY: 0.82, greetingY: 0.30, subY: 0.48, greetingSize: 90, subSize: 42, nameSize: 64, textColor: '#ffffff' },
  { id: 2, label: 'أنيق', image: '/templates/2.png', greeting: 'عساكم من عوّاده', sub: 'تقبّل الله طاعتكم', nameY: 0.80, greetingY: 0.28, subY: 0.46, greetingSize: 82, subSize: 40, nameSize: 60, textColor: '#ffffff' },
  { id: 3, label: 'حديث', image: '/templates/3.png', greeting: 'كل عام وأنتم بخير', sub: 'أعاده الله عليكم بالخير واليُمن', nameY: 0.83, greetingY: 0.25, subY: 0.44, greetingSize: 78, subSize: 36, nameSize: 62, textColor: '#ffffff' },
  { id: 4, label: 'فاخر', image: '/templates/4.png', greeting: 'عيدكم مبارك', sub: 'وعساكم من العايدين الفايزين', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
]

const nameColors = [
  { id: 'white', color: '#ffffff', label: 'أبيض' },
  { id: 'gold', color: '#fbbf24', label: 'ذهبي' },
  { id: 'lime', color: '#C6F806', label: 'ليموني' },
  { id: 'purple', color: '#c4b5fd', label: 'بنفسجي' },
  { id: 'pink', color: '#f9a8d4', label: 'وردي' },
  { id: 'sky', color: '#93c5fd', label: 'سماوي' },
]

function QuickCardCreator() {
  const [selectedId, setSelectedId] = useState(quickDesigns[0].id)
  const [name, setName] = useState('')
  const [multiNames, setMultiNames] = useState('')
  const [isMultiMode, setIsMultiMode] = useState(false)
  const [nameColor, setNameColor] = useState('#ffffff')
  const [showAll, setShowAll] = useState(false)
  const [exporting, setExporting] = useState(false)
  const canvasRef = useRef(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [loadedImg, setLoadedImg] = useState(null)
  const selectedDesign = quickDesigns.find(d => d.id === selectedId) || quickDesigns[0]

  useEffect(() => {
    if (!selectedDesign?.image) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { setLoadedImg(img); setCanvasReady(true) }
    img.onerror = () => setCanvasReady(false)
    img.src = selectedDesign.image
  }, [selectedDesign?.image])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !loadedImg) return
    const size = 1080
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, size, size)
    ctx.drawImage(loadedImg, 0, 0, size, size)
    ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, 0, size, size)
    const fontBase = "'Cairo', sans-serif"

    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = selectedDesign.textColor
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 16
    ctx.font = `900 ${selectedDesign.greetingSize}px ${fontBase}`
    ctx.fillText(selectedDesign.greeting, size / 2, size * selectedDesign.greetingY, size * 0.9); ctx.restore()

    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = selectedDesign.textColor
    ctx.globalAlpha = 0.85; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10
    ctx.font = `600 ${selectedDesign.subSize}px ${fontBase}`
    ctx.fillText(selectedDesign.sub, size / 2, size * selectedDesign.subY, size * 0.9); ctx.restore()

    ctx.save(); ctx.strokeStyle = nameColor; ctx.globalAlpha = 0.3; ctx.lineWidth = 2
    const lineW = 200; ctx.beginPath()
    ctx.moveTo(size / 2 - lineW, size * (selectedDesign.nameY - 0.05))
    ctx.lineTo(size / 2 + lineW, size * (selectedDesign.nameY - 0.05)); ctx.stroke(); ctx.restore()

    if (name.trim()) {
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = nameColor
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14
      ctx.font = `bold ${selectedDesign.nameSize}px ${fontBase}`
      ctx.fillText(name, size / 2, size * selectedDesign.nameY, size * 0.85); ctx.restore()
    } else {
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.font = `500 ${selectedDesign.nameSize * 0.7}px ${fontBase}`
      ctx.fillText('اكتب الاسم هنا...', size / 2, size * selectedDesign.nameY); ctx.restore()
    }
  }, [loadedImg, name, nameColor, selectedDesign])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const link = document.createElement('a'); link.download = `eid-card-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png', 1.0); document.body.appendChild(link); link.click(); document.body.removeChild(link)
  }, [])

  // Generate card for a specific name
  const generateCardForName = useCallback((singleName, img, design) => {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement('canvas')
      const size = 1080
      tempCanvas.width = size; tempCanvas.height = size
      const ctx = tempCanvas.getContext('2d')
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, 0, size, size)
      const fontBase = "'Cairo', sans-serif"
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = design.textColor
      ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 16
      ctx.font = `900 ${design.greetingSize}px ${fontBase}`
      ctx.fillText(design.greeting, size / 2, size * design.greetingY, size * 0.9); ctx.restore()
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = design.textColor
      ctx.globalAlpha = 0.85; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10
      ctx.font = `600 ${design.subSize}px ${fontBase}`
      ctx.fillText(design.sub, size / 2, size * design.subY, size * 0.9); ctx.restore()
      ctx.save(); ctx.strokeStyle = nameColor; ctx.globalAlpha = 0.3; ctx.lineWidth = 2
      const lineW = 200; ctx.beginPath()
      ctx.moveTo(size / 2 - lineW, size * (design.nameY - 0.05))
      ctx.lineTo(size / 2 + lineW, size * (design.nameY - 0.05)); ctx.stroke(); ctx.restore()
      if (singleName.trim()) {
        ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = nameColor
        ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14
        ctx.font = `bold ${design.nameSize}px ${fontBase}`
        ctx.fillText(singleName, size / 2, size * design.nameY, size * 0.85); ctx.restore()
      }
      resolve({ canvas: tempCanvas, name: singleName })
    })
  }, [nameColor])

  // Export multiple cards
  const handleExportMultiple = useCallback(async () => {
    if (!loadedImg || !multiNames.trim()) return
    setExporting(true)
    const names = multiNames.split(/[,،\n]+/).map(n => n.trim()).filter(n => n)
    for (let i = 0; i < names.length; i++) {
      const { canvas, name: cardName } = await generateCardForName(names[i], loadedImg, selectedDesign)
      const link = document.createElement('a')
      link.download = `eid-card-${cardName.replace(/\s+/g, '-')}-${i + 1}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      await new Promise(r => setTimeout(r, 300))
    }
    setExporting(false)
  }, [loadedImg, multiNames, selectedDesign, generateCardForName])

  const handleWhatsApp = useCallback(async () => {
    const canvas = canvasRef.current; if (!canvas) return
    try {
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png', 1.0))
      const file = new File([blob], 'eid-card.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'بطاقة تهنئة العيد', text: 'عيد مبارك وكل عام وأنتم بخير' })
      } else { handleDownload(); window.open(`https://wa.me/?text=${encodeURIComponent('عيد مبارك وكل عام وأنتم بخير 🌙')}`, '_blank') }
    } catch { handleDownload() }
  }, [handleDownload])

  return (
    <section className="section-spacing bg-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <span className="section-label">بطاقات جاهزة</span>
          <h2 className="section-title mt-3 mb-4">اختر تصميم واكتب اسمك فقط</h2>
          <p className="section-subtitle mx-auto text-center">٤ تصاميم احترافية جاهزة — فقط اكتب الاسم وحمّل البطاقة</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Controls */}
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <label className="text-xs font-bold text-[#64748b] block mb-3">اختر التصميم</label>
              {/* Horizontal scrollable carousel */}
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {quickDesigns.map(d => (
                  <button key={d.id} onClick={() => setSelectedId(d.id)}
                    className={`group relative flex-none w-[120px] aspect-[3/4] rounded-2xl overflow-hidden snap-start transition-all duration-200 ${
                      selectedId === d.id
                        ? 'ring-2 ring-[#1d4ed8] shadow-lg scale-[1.03]'
                        : 'ring-1 ring-[#e2e8f0] hover:ring-[#93c5fd] opacity-85 hover:opacity-100'
                    }`}>
                    <img src={d.image} alt={d.label} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                    {/* Bottom label */}
                    <div className="absolute bottom-0 inset-x-0 p-2.5">
                      <span className="text-white text-[12px] font-black drop-shadow-sm block">{d.label}</span>
                      <span className="text-white/65 text-[9px]">{d.greeting}</span>
                    </div>
                    {/* Selected tick */}
                    {selectedId === d.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1d4ed8] flex items-center justify-center shadow">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input + color in a clean card */}
            <div className="luxury-card space-y-6">
              {/* Toggle between single/multi name mode */}
              <div className="flex gap-2 p-1 bg-[#f1f5f9] rounded-xl">
                <button onClick={() => setIsMultiMode(false)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${!isMultiMode ? 'bg-white shadow-sm text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
                  اسم واحد
                </button>
                <button onClick={() => setIsMultiMode(true)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${isMultiMode ? 'bg-white shadow-sm text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
                  أسماء متعددة ✨
                </button>
              </div>

              {!isMultiMode ? (
                <div>
                  <label className="text-sm font-bold text-[#0f172a] block mb-2">اكتب الاسم على البطاقة</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} dir="rtl" placeholder="مثلاً: محمد"
                    className="unified-input w-full text-center text-lg" />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-bold text-[#0f172a] block mb-2">اكتب عدة أسماء (كل اسم في سطر أو افصل بفاصلة)</label>
                  <textarea 
                    value={multiNames} 
                    onChange={e => setMultiNames(e.target.value)} 
                    dir="rtl" 
                    placeholder="محمد&#10;فاطمة&#10;أحمد&#10;سارة"
                    rows={4}
                    className="unified-input w-full text-center resize-none" 
                  />
                  <p className="text-[#64748b] text-xs mt-2 text-center">
                    {multiNames.split(/[,،\n]+/).filter(n => n.trim()).length > 0 && 
                      `سيتم تحميل ${multiNames.split(/[,،\n]+/).filter(n => n.trim()).length} بطاقة`}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#64748b] block mb-2">لون الاسم</label>
                <div className="flex gap-2 flex-wrap">
                  {nameColors.map(c => (
                    <button key={c.id} onClick={() => setNameColor(c.color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        nameColor === c.color ? 'bg-white border-[#1d4ed8] shadow-sm' : 'bg-white border-[#e2e8f0] hover:border-[#94a3b8]'
                      }`}>
                      <span className="w-3.5 h-3.5 rounded-full border border-[#e2e8f0]" style={{ backgroundColor: c.color }} />
                      <span className="text-[#475569]">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {!isMultiMode ? (
                  <>
                    <button onClick={handleDownload} disabled={!canvasReady}
                      className="flex-1 btn-gold-official justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                      <Download className="w-4 h-4" /> تحميل البطاقة
                    </button>
                    <button onClick={handleWhatsApp} disabled={!canvasReady}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold hover:bg-green-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      <MessageCircle className="w-4 h-4" /> واتساب
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleExportMultiple} 
                    disabled={!canvasReady || !multiNames.trim() || exporting}
                    className="w-full btn-gold-official justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                    {exporting ? (
                      <><span className="w-4 h-4 border-2 border-[#1e293b] border-t-transparent rounded-full animate-spin" /> جاري التحميل...</>
                    ) : (
                      <><Download className="w-4 h-4" /> تحميل {multiNames.split(/[,،\n]+/).filter(n => n.trim()).length || ''} بطاقة</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {templates.length > 4 && (
              <button onClick={() => setShowAll(v => !v)}
                className="w-full py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] text-sm font-medium hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-2">
                <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                {showAll ? 'عرض أقل' : `عرض المزيد (${templates.length - 4})`}
              </button>
            )}

            {showAll && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {templates.slice(4).map(t => (
                  <Link key={t.id} to="/editor" className="relative flex-none w-[100px] aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-[#e2e8f0] hover:ring-[#93c5fd] transition-all snap-start">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-4">
                      <span className="text-[10px] text-white font-bold">{t.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link to="/editor" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#dbeafe] text-[#1d4ed8] text-sm font-bold hover:bg-[#eff6ff] transition-all group">
              <Palette className="w-4 h-4" />
              التخصيص الاحترافي — غيّر الخطوط والنصوص والألوان
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Preview */}
            <div className="w-full lg:w-[400px] flex flex-col items-center lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-sm w-full">
              <canvas ref={canvasRef} className="w-full aspect-square rounded-xl" style={{ imageRendering: 'auto' }} />
            </div>
            <p className="text-[#94a3b8] text-xs text-center mt-3">معاينة مباشرة — الصورة تُحمّل بجودة 1080×1080</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="w-full overflow-x-hidden bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[100svh] md:min-h-0 md:pt-28 md:pb-20 bg-[#060412] md:bg-white">

        {/* Mobile-only family background banner — full portrait height */}
        <div className="absolute inset-0 md:hidden pointer-events-none select-none">
          <img
            src="/images/family-banner.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
            style={{ opacity: 0.80 }}
          />
          {/* Cinematic gradient — heavy dark at top & bottom, open in middle */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(6,4,18,0.78) 0%, rgba(6,4,18,0.12) 32%, rgba(6,4,18,0.10) 62%, rgba(6,4,18,0.90) 100%)'
          }} />
          {/* Side vignette for depth */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 42%, rgba(4,2,14,0.52) 100%)'
          }} />
        </div>

        {/* Content — pushed to bottom on mobile */}
        <div className="container-main relative z-10 flex flex-col justify-end md:block min-h-[100svh] md:min-h-0 pt-20 pb-8 md:py-0">

          {/* Text block */}
          <div className="max-w-3xl mx-auto text-center md:mb-12">

            {/* Luxury glass card wrapper — mobile only */}
            <div className="
              backdrop-blur-2xl
              bg-white/[0.05]
              border border-white/[0.12]
              rounded-2xl px-5 py-6
              shadow-[0_4px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]
              md:bg-transparent md:border-0 md:shadow-none md:backdrop-blur-none md:rounded-none md:p-0
            ">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/12 md:bg-[#eff6ff] border border-white/20 md:border-[#dbeafe] px-3 py-1.5 text-[11px] font-semibold text-white/90 md:text-[#1d4ed8] mb-3 md:mb-6">
                <Sparkles className="w-3 h-3" />
                تجربة تصميم احترافية
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.2] text-white md:text-[#0f172a] mb-3 md:mb-6">
                صمّم بطاقة عيد
                <span className="block gradient-gold-text">بشكل فاخر خلال دقائق</span>
              </h1>

              <p className="text-white/70 md:text-[#64748b] text-[13px] md:text-lg leading-relaxed max-w-xl mx-auto mb-5 md:mb-8">
                منصة عربية حديثة لتصميم بطاقات تهنئة العيد وإرسالها مباشرة عبر واتساب — بدون تسجيل أو تعقيد.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
                <Link to="/editor" className="btn-gold !px-7 !py-3 w-full sm:w-auto justify-center !text-sm">
                  ابدأ التصميم الآن
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
                <Link to="/send" className="btn-outline-gold !px-6 !py-3 w-full sm:w-auto justify-center !text-sm">
                  جرّب الإرسال الذكي
                </Link>
              </div>
            </div>
          </div>

          {/* Stats — just below the card on mobile */}
          <div className="max-w-lg mx-auto w-full grid grid-cols-3 gap-3 md:gap-5 mt-4 md:mt-0">
            {[
              { n: '+100', l: 'عبارة جاهزة' },
              { n: '20', l: 'قالب أنيق' },
              { n: '1080', l: 'دقة التصدير' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-white/[0.14] md:border-[#e2e8f0] bg-white/[0.06] md:bg-[#f8fafc] backdrop-blur-xl md:backdrop-blur-none px-2 py-3 text-center">
                <div className="text-[#C6F806] md:text-[#1d4ed8] text-lg md:text-xl font-black tabular-nums">{s.n}</div>
                <div className="text-white/55 md:text-[#64748b] text-[10px] md:text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <MarqueeTicker />

      {/* ── QUICK CARD CREATOR ── */}
      <QuickCardCreator />

      {/* ── EIDIYA CALCULATOR ── */}
      <EidiyaCalculator />

      {/* ── EIDIYA LUCK ── */}
      <EidiyaLuckGenerator />

      {/* ── HOW IT WORKS ── */}
      <section className="section-spacing bg-[#f8fafc]">
        <div className="container-main">
          <div className="text-center mb-14">
            <span className="section-label">الخطوات</span>
            <h2 className="section-title mt-3">كيف تصمّن بطاقتك</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <StepCard num={1} icon={Layers}  title="اختر القالب"  desc="تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم" />
            <StepCard num={2} icon={Palette}  title="خصّص البطاقة" desc="اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم" />
            <StepCard num={3} icon={Send}     title="أرسل أو حمّل" desc="صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-spacing bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="section-label">المميزات</span>
              <h2 className="section-title mb-4">
                كل ما تحتاجه
                <br />
                <span className="text-[#64748b] font-bold">في منصة واحدة</span>
              </h2>
              <p className="section-subtitle mb-8">
                صمّم بطاقات احترافية بخطوط عربية أصيلة وعبارات مختارة بعناية — ثم أرسلها لمن تحب مباشرة.
              </p>
              <Link to="/editor" className="group btn-ghost-gold">
                <span>جرّب المحرر الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-5">
              <Feature icon={Type}       title="خطوط عربية أصيلة"   desc="8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها" />
              <Feature icon={FileText}   title="أكثر من 100 عبارة"  desc="عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة" />
              <Feature icon={Send}       title="إرسال عبر واتساب"   desc="أرسل البطاقة مباشرة لأحبابك عبر واتساب" />
              <Feature icon={Download}   title="تصدير بأعلى جودة"   desc="PNG بدقة 1080px أو PDF جاهز للطباعة" />
              <Feature icon={Shield}     title="مجاني وآمن"         desc="ابدأ فوراً بدون حساب أو بيانات شخصية" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-spacing bg-gradient-to-b from-[#fef9e7]/50 to-[#f8fafc]">
        <div className="container-main">
          <div className="max-w-2xl mx-auto">
            {/* Luxury Header */}
            <div className="text-center mb-12">
              <span className="official-badge">
                <Sparkles className="w-4 h-4" />
                الأسئلة الشائعة
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mt-4 mb-3">كل ما تحتاج معرفته</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
                <span className="text-[#d4af37]">✦</span>
                <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
              </div>
            </div>

            {/* FAQ Items with Luxury Border Container */}
            <div className="luxury-card !p-0 overflow-hidden">
              <div className="divide-y divide-[#d4af37]/10">
                {faqs.map((f, i) => (
                  <FAQ key={i} q={f.q} a={f.a} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} index={i} />
                ))}
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="flex items-center justify-center mt-8 gap-2 text-[#d4af37]/60">
              <span className="text-lg">✦</span>
              <span className="text-xs font-medium">لديك سؤال آخر؟ تواصل معنا</span>
              <span className="text-lg">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-spacing-lg bg-white">
        <div className="container-main">
          <div className="max-w-xl mx-auto text-center">
            <img src="/images/logo.png" alt="سَلِّم" className="h-16 w-auto mx-auto mb-8 opacity-90" />
            <h2 className="section-title mb-5">جاهز تصمّن بطاقتك؟</h2>
            <p className="section-subtitle mx-auto mb-10 text-center">
              صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
            </p>
            <Link to="/editor" className="group btn-gold !px-8 !py-3.5">
              <span>ابدأ الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
