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
   EIDIYA GAME — Epic Quiz Experience
   ═══════════════════════════════════════════════════════════════════════════ */

const quizQuestions = [
  {
    question: 'كم عمرك؟',
    emoji: '🎂',
    bg: 'from-pink-500/20 to-purple-600/20',
    hint: 'العمر عامل أساسي في تحديد العيدية',
    options: [
      { label: 'أقل من ١٠ — طفل ومدلّع الكل', emoji: '👶', silah: 5, karam: 0, adab: 5, juhd: 0, ruh: 8 },
      { label: '١٠ – ١٥ — "يا عمو عيديتي وين؟"', emoji: '🧒', silah: 4, karam: 0, adab: 4, juhd: 2, ruh: 7 },
      { label: '١٦ – ٢٢ — مراهق محتاج فلوس دائم', emoji: '😎', silah: 3, karam: 1, adab: 3, juhd: 3, ruh: 5 },
      { label: '٢٣ – ٣٥ — بديت أعيّد أنا', emoji: '💼', silah: 2, karam: 5, adab: 3, juhd: 4, ruh: 3 },
      { label: 'فوق ٣٥ — "العيدية للصغار بس"', emoji: '👴', silah: 1, karam: 7, adab: 2, juhd: 5, ruh: 2 },
    ],
  },
  {
    question: 'قبل العيد بأسبوع، وش سويت؟',
    emoji: '📅',
    bg: 'from-blue-500/20 to-cyan-600/20',
    hint: 'التحضير المبكر يعكس اهتمامك بالعيد وبأهلك',
    options: [
      { label: 'نظّفت البيت كامل ورتّبت المجلس وعلّقت الزينة', emoji: '🏠', silah: 3, karam: 2, adab: 4, juhd: 8, ruh: 5 },
      { label: 'رحت السوق وجبت حلويات ومكسرات للضيوف', emoji: '🛒', silah: 4, karam: 5, adab: 3, juhd: 5, ruh: 4 },
      { label: 'سويت قروب العيد بالواتساب وأرسلت ستيكرات', emoji: '📱', silah: 3, karam: 1, adab: 2, juhd: 2, ruh: 6 },
      { label: 'ما سويت شي — العيد يجي لحاله', emoji: '😴', silah: 0, karam: 0, adab: 1, juhd: 0, ruh: 1 },
    ],
  },
  {
    question: 'كيف صلة الرحم عندك هالسنة؟',
    emoji: '👨‍👩‍👧‍👦',
    bg: 'from-green-500/20 to-emerald-600/20',
    hint: 'صلة الرحم من أعظم الأعمال',
    options: [
      { label: 'أزور جدي وجدتي كل جمعة وأتصل على خالاتي وعماتي', emoji: '💕', silah: 10, karam: 3, adab: 5, juhd: 4, ruh: 4 },
      { label: 'أحرص أروح التجمعات العائلية — ما أفوّت مناسبة', emoji: '🎉', silah: 7, karam: 2, adab: 4, juhd: 3, ruh: 3 },
      { label: 'أتصل عليهم بالعيد والمناسبات بس', emoji: '📞', silah: 4, karam: 1, adab: 3, juhd: 1, ruh: 2 },
      { label: 'أرسل "كل عام وأنتم بخير" بالقروب وخلاص', emoji: '💬', silah: 2, karam: 0, adab: 2, juhd: 0, ruh: 1 },
      { label: 'صراحة.. ما أدري وين أقاربي', emoji: '🤷', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'جالك ضيف العيد فجأة — وش تسوي؟',
    emoji: '☕',
    bg: 'from-amber-500/20 to-orange-600/20',
    hint: 'الكرم السعودي عنوان',
    options: [
      { label: 'أسوي قهوة سعودي وأجيب التمر وأرحّب فيه أحسن ترحيب', emoji: '☕', silah: 4, karam: 8, adab: 6, juhd: 5, ruh: 3 },
      { label: 'أطلب من التطبيق أحلى وجبة — الضيف ما ينقصه شي', emoji: '🍽️', silah: 3, karam: 6, adab: 4, juhd: 2, ruh: 4 },
      { label: 'أجيب له ماي وعصير — على السريع', emoji: '🧃', silah: 2, karam: 3, adab: 3, juhd: 1, ruh: 2 },
      { label: 'أقول "أهلاً" وأكمّل على جوالي', emoji: '📵', silah: 0, karam: 0, adab: 1, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'خالتك عطتك ١٠ ريال عيدية. وش ردة فعلك؟',
    emoji: '💸',
    bg: 'from-violet-500/20 to-purple-600/20',
    hint: 'الأدب مع الكبار يحدد شخصيتك',
    options: [
      { label: '"تسلمين يا خالتي، الله يبارك لك" وأدعي لها من قلبي', emoji: '🙏', silah: 5, karam: 2, adab: 10, juhd: 0, ruh: 3 },
      { label: 'أبتسم وأشكرها — بدون ما أبيّن أي شي', emoji: '😊', silah: 3, karam: 1, adab: 7, juhd: 0, ruh: 2 },
      { label: 'أرجعها: "لا يا خالتي خليها لك، أنا كبرت"', emoji: '🤲', silah: 4, karam: 6, adab: 8, juhd: 0, ruh: 4 },
      { label: 'أقلبها وأقول "بس عشرة يا خالتي؟!"', emoji: '😤', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 1 },
      { label: 'آخذها وأقول "مشكورة" بدون ما أطالع المبلغ', emoji: '👀', silah: 2, karam: 0, adab: 4, juhd: 0, ruh: 1 },
    ],
  },
  {
    question: 'يوم العيد الصبح — وش أول شي تسويه؟',
    emoji: '🌅',
    bg: 'from-rose-500/20 to-pink-600/20',
    hint: 'بداية يوم العيد تكشف أولوياتك',
    options: [
      { label: 'أروح صلاة العيد بدري وأسلّم على الناس بالمصلّى', emoji: '🕌', silah: 6, karam: 2, adab: 6, juhd: 5, ruh: 5 },
      { label: 'ألبس أحلى ثوب وأتعطّر وأتجهّز أزور الأهل', emoji: '👔', silah: 3, karam: 1, adab: 4, juhd: 3, ruh: 6 },
      { label: 'أرسل رسائل تهنئة لكل الناس بالواتساب', emoji: '📱', silah: 2, karam: 0, adab: 3, juhd: 1, ruh: 3 },
      { label: 'أنام لين الظهر — العيد ما يروح', emoji: '😴', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'شفت طفل صغير يبي عيدية ووالده محرج — وش تسوي؟',
    emoji: '🧒',
    bg: 'from-teal-500/20 to-cyan-600/20',
    hint: 'هذا الموقف يقيس كرمك الحقيقي',
    options: [
      { label: 'أعطيه عيدية حلوة وأقول لأبوه "هذا ولدنا كلنا"', emoji: '💝', silah: 5, karam: 10, adab: 6, juhd: 2, ruh: 7 },
      { label: 'أعطيه ٥٠ ريال بالسر عشان ما أحرج أحد', emoji: '🤫', silah: 3, karam: 7, adab: 8, juhd: 1, ruh: 5 },
      { label: 'أعطيه حلاوة أو شوكولاتة — على الأقل شي', emoji: '🍫', silah: 2, karam: 3, adab: 4, juhd: 0, ruh: 3 },
      { label: 'أطنّش وأمشي — مو شغلي', emoji: '🚶', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 0 },
    ],
  },
  {
    question: 'وش أحلى شي تحبه في العيد؟',
    emoji: '✨',
    bg: 'from-yellow-500/20 to-amber-600/20',
    hint: 'اللي تحبه في العيد يعكس روحك',
    options: [
      { label: 'التجمع العائلي — أحب أشوف الكل مبسوط', emoji: '👨‍👩‍👧‍👦', silah: 7, karam: 2, adab: 3, juhd: 1, ruh: 6 },
      { label: 'العيديات — نجمع ونحسب ونخطط للصرف', emoji: '💰', silah: 1, karam: 0, adab: 1, juhd: 0, ruh: 5 },
      { label: 'الذبيحة والأكل — المطبخ أهم قسم في العيد', emoji: '🍖', silah: 3, karam: 4, adab: 2, juhd: 4, ruh: 4 },
      { label: 'الأجواء الروحانية — صلاة العيد والتكبيرات', emoji: '🌙', silah: 4, karam: 3, adab: 6, juhd: 2, ruh: 3 },
      { label: 'الإجازة — أقعد على البلايستيشن طول اليوم', emoji: '🎮', silah: 0, karam: 0, adab: 0, juhd: 0, ruh: 2 },
    ],
  },
]

const quizResults = [
  { min: 0,   max: 35,  amount: 1,     emoji: '💀', title: 'ريال واحد بس', rank: 'مبتدئ', desc: 'يا صاحبي.. لازم تشتغل على نفسك جد!', color: '#6b7280', badge: '🥉' },
  { min: 36,  max: 50,  amount: 5,     emoji: '😑', title: '٥ ريال', rank: 'متدرب', desc: 'الحمدلله إنك لقيت أحد يعيّدك أصلاً!', color: '#78716c', badge: '🥉' },
  { min: 51,  max: 65,  amount: 10,    emoji: '😶', title: '١٠ ريال', rank: 'عادي', desc: 'مو أسوأ شي بس مو أحسن شي', color: '#71717a', badge: '🥉' },
  { min: 66,  max: 80,  amount: 25,    emoji: '🙂', title: '٢٥ ريال', rank: 'طيّب', desc: 'فيك خير بس مختبي!', color: '#0ea5e9', badge: '🥈' },
  { min: 81,  max: 95,  amount: 50,    emoji: '😊', title: '٥٠ ريال', rank: 'محترم', desc: 'أنت شخص طيّب — الناس تحبك وتقدّرك.', color: '#3b82f6', badge: '🥈' },
  { min: 96,  max: 110, amount: 100,   emoji: '😄', title: '١٠٠ ريال', rank: 'ممتاز', desc: 'ماشاء الله عليك — واصل!', color: '#2563eb', badge: '🥈' },
  { min: 111, max: 125, amount: 200,   emoji: '🤩', title: '٢٠٠ ريال', rank: 'متميّز', desc: 'أنت من الناس اللي تشرّف أهلها', color: '#8b5cf6', badge: '🥇' },
  { min: 126, max: 140, amount: 350,   emoji: '🥰', title: '٣٥٠ ريال', rank: 'قلب طيّب', desc: 'الكل يتمنى يكون جنبه في العيد', color: '#a855f7', badge: '🥇' },
  { min: 141, max: 152, amount: 500,   emoji: '🥹', title: '٥٠٠ ريال', rank: 'مبارك', desc: 'أنت من الناس اللي ترفع رأس عايلتها!', color: '#d946ef', badge: '🥇' },
  { min: 153, max: 165, amount: 750,   emoji: '👏', title: '٧٥٠ ريال', rank: 'استثنائي', desc: 'صلة رحمك وكرمك وأدبك ما لهم مثيل!', color: '#f59e0b', badge: '🏆' },
  { min: 166, max: 180, amount: 1000,  emoji: '🏆', title: '١٬٠٠٠ ريال', rank: 'أسطورة', desc: 'أنت مؤسسة خيرية ماشية على رجلين', color: '#f59e0b', badge: '🏆' },
  { min: 181, max: 999, amount: 2000,  emoji: '👑', title: '٢٬٠٠٠ ريال', rank: 'ملك العيد', desc: 'كرم حاتمي، أدب ملكي، صلة رحم أسطورية', color: '#eab308', badge: '👑' },
]

const axisLabels = [
  { key: 'silah', label: 'صلة الرحم', icon: '👨‍👩‍👧‍👦', max: 46, color: '#10b981' },
  { key: 'karam', label: 'الكرم', icon: '💎', max: 45, color: '#8b5cf6' },
  { key: 'adab',  label: 'الأدب', icon: '🎩', max: 50, color: '#3b82f6' },
  { key: 'juhd',  label: 'الجهد', icon: '💪', max: 33, color: '#f59e0b' },
  { key: 'ruh',   label: 'الروح', icon: '✨', max: 45, color: '#ec4899' },
]

const funFacts = [
  '🎊 أكثر من ٥٠٬٠٠٠ شخص جرّبوا اللعبة!',
  '💰 متوسط النتائج ١٠٠ ريال',
  '👑 فقط ٢٪ وصلوا لرتبة "ملك العيد"',
  '🏆 أعلى نتيجة مسجّلة ٢٬٠٠٠ ريال!',
]

// Massive confetti for celebration
function GameConfetti({ active, intensity = 1 }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    const count = Math.floor(60 * intensity)
    setParticles(Array.from({ length: count }, (_, i) => ({
      id: i, 
      x: Math.random() * 100, 
      delay: Math.random() * 0.8, 
      dur: 2 + Math.random() * 2,
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      color: ['#fbbf24', '#f59e0b', '#d4af37', '#f4e4a6', '#fcd34d', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 8)],
      type: Math.random() > 0.5 ? 'circle' : 'star'
    })))
  }, [active, intensity])
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <span key={p.id} 
          className={`absolute animate-confetti-game ${p.type === 'star' ? 'text-2xl' : 'rounded-full'}`}
          style={{ 
            left: `${p.x}%`, 
            width: p.type === 'circle' ? p.size : 'auto', 
            height: p.type === 'circle' ? p.size : 'auto', 
            backgroundColor: p.type === 'circle' ? p.color : 'transparent',
            color: p.color,
            animationDelay: `${p.delay}s`, 
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rotation}deg)`
          }}>
          {p.type === 'star' ? '✦' : ''}
        </span>
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
  const [slotSpinning, setSlotSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [streak, setStreak] = useState(0)
  const totalQ = quizQuestions.length

  // Sound effects
  const playSound = useCallback((type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      if (type === 'select') {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain); gain.connect(audioContext.destination)
        osc.frequency.value = 600; osc.type = 'sine'
        gain.gain.setValueAtTime(0.1, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        osc.start(); osc.stop(audioContext.currentTime + 0.15)
      } else if (type === 'result') {
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]
        freqs.forEach((freq, i) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain); gain.connect(audioContext.destination)
          osc.frequency.value = freq; osc.type = 'sine'
          gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.12)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.12 + 1.5)
          osc.start(audioContext.currentTime + i * 0.12)
          osc.stop(audioContext.currentTime + i * 0.12 + 1.5)
        })
      } else if (type === 'spin') {
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()
            osc.connect(gain); gain.connect(audioContext.destination)
            osc.frequency.value = 300 + i * 80; osc.type = 'square'
            gain.gain.setValueAtTime(0.05, audioContext.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
            osc.start(); osc.stop(audioContext.currentTime + 0.08)
          }, i * 100)
        }
      }
    } catch (e) {}
  }, [])

  const getResult = useCallback(() => {
    for (const r of quizResults) if (totalScore >= r.min && totalScore <= r.max) return r
    return quizResults[quizResults.length - 1]
  }, [totalScore])

  useEffect(() => {
    if (step !== totalQ + 1) return
    const result = getResult()
    setSlotSpinning(true)
    playSound('spin')
    
    // Slot machine effect
    setTimeout(() => {
      setSlotSpinning(false)
      setShowResult(true)
      playSound('result')
      setShowCelebration(true)
      
      // Animate the amount
      const target = result.amount
      let current = 0
      const interval = setInterval(() => {
        current += target / 30
        if (current >= target) { setAnimatedAmount(target); clearInterval(interval) }
        else setAnimatedAmount(Math.round(current))
      }, 50)
    }, 1500)
  }, [step, totalScore, getResult, playSound])

  const fadeTransition = (callback) => {
    setFadeIn(false)
    setTimeout(() => { callback(); setTimeout(() => setFadeIn(true), 50) }, 200)
  }

  const handleStart = () => {
    playSound('select')
    fadeTransition(() => setStep(1))
  }

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    playSound('select')
    setStreak(s => s + 1)
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

  const reset = () => { 
    setShowCelebration(false)
    setShowResult(false)
    setSlotSpinning(false)
    setStreak(0)
    fadeTransition(() => { 
      setStep(0); setAnswerData([]); setSelected(null); setTotalScore(0); setScoreTotals(null); setAnimatedAmount(0) 
    }) 
  }

  const shareWa = () => {
    const result = getResult()
    const text = `🎮 لعبت "كم تستاهل عيدية؟" وطلعت:\n\n${result.badge} ${result.title}\n🏅 الرتبة: ${result.rank}\n\n${result.desc}\n\nجرّب أنت كم تستاهل! 🌙\n${window.location.origin}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const result = step > totalQ ? getResult() : null
  const pct = step > 0 && step <= totalQ ? (step / totalQ) * 100 : step > totalQ ? 100 : 0
  const currentQ = step >= 1 && step <= totalQ ? quizQuestions[step - 1] : null

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Epic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1f] via-[#1a0f2e] to-[#0d0619]" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)'
      }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${4 + Math.random() * 4}s` }} />
        ))}
      </div>

      <GameConfetti active={showCelebration} intensity={result?.amount >= 500 ? 2 : 1} />

      <div className="container-main relative z-10">
        {/* Header - Always visible */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
            <span className="text-2xl">🎮</span>
            <span className="text-white/90 font-bold text-sm">لعبة تسلية العيد</span>
            <span className="text-2xl">🌙</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            كم تستاهل <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">عيدية</span>؟
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">
            ٨ أسئلة ممتعة تكشف شخصيتك وتحدد عيديتك المستحقة!
          </p>
        </div>

        {/* Game Stats Bar */}
        {step > 0 && step <= totalQ && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  {currentQ?.emoji}
                </div>
                <div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">السؤال</div>
                  <div className="text-white font-black">{toAr(step)} / {toAr(totalQ)}</div>
                </div>
              </div>
              
              <div className="flex-1 max-w-[200px]">
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${pct}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <span className="text-amber-400 text-lg">🔥</span>
                <span className="text-amber-400 font-black">{toAr(streak)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="max-w-2xl mx-auto">
          <div className={`transition-all duration-300 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            {/* Start Screen */}
            {step === 0 && (
              <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8 sm:p-10 backdrop-blur-xl text-center">
                {/* Animated Gift Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 animate-pulse-slow" />
                  <div className="absolute inset-1 rounded-xl bg-[#1a0f2e] flex items-center justify-center">
                    <span className="text-5xl animate-bounce-slow">🎁</span>
                  </div>
                </div>

                <h3 className="text-white text-2xl font-black mb-3">اكتشف عيديتك المستحقة!</h3>
                <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                  جاوب على ٨ أسئلة سريعة وممتعة عن شخصيتك وعلاقاتك العائلية
                </p>

                {/* Axis Preview */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {axisLabels.map(a => (
                    <div key={a.key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <span>{a.icon}</span>
                      <span className="text-white/60 text-xs font-medium">{a.label}</span>
                    </div>
                  ))}
                </div>

                {/* Fun Fact */}
                <div className="mb-8 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-400/80 text-sm">
                    {funFacts[Math.floor(Math.random() * funFacts.length)]}
                  </p>
                </div>

                <button onClick={handleStart} 
                  className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-[#1a0f2e] font-black text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    يلا نبدأ! 
                    <span className="text-xl">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            )}

            {/* Question Screen */}
            {step >= 1 && step <= totalQ && currentQ && (
              <div className={`rounded-3xl bg-gradient-to-b ${currentQ.bg} border border-white/10 p-6 sm:p-8 backdrop-blur-xl`}>
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4 animate-bounce-slow">{currentQ.emoji}</div>
                  <h3 className="text-white text-xl sm:text-2xl font-black mb-2">{currentQ.question}</h3>
                  {currentQ.hint && (
                    <p className="text-white/40 text-sm">{currentQ.hint}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => (
                    <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                      className={`group w-full text-right p-4 rounded-2xl transition-all duration-300 ${
                        selected === i 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 scale-[1.02] shadow-lg shadow-green-500/30' 
                          : selected !== null 
                            ? 'bg-white/5 opacity-40 cursor-not-allowed' 
                            : 'bg-white/5 hover:bg-white/10 hover:scale-[1.01] border border-transparent hover:border-white/20'
                      }`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl transition-transform ${selected === i ? 'scale-125' : 'group-hover:scale-110'}`}>
                          {opt.emoji}
                        </span>
                        <span className={`text-sm font-medium flex-1 ${selected === i ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                          {opt.label}
                        </span>
                        {selected === i && (
                          <span className="text-white text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Screen */}
            {step > totalQ && slotSpinning && (
              <div className="rounded-3xl bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border border-amber-500/30 p-10 backdrop-blur-xl text-center">
                <div className="text-6xl mb-6 animate-bounce-slow">✨</div>
                <h3 className="text-white text-2xl font-black mb-3">جاري تحليل شخصيتك...</h3>
                <div className="flex justify-center gap-3 mb-6">
                  {axisLabels.map((a) => (
                    <div key={a.key} className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="text-xl">{a.icon}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-sm">انتظر لحظات...</p>
              </div>
            )}

            {/* Result Screen */}
            {step > totalQ && showResult && result && (
              <div className="space-y-6">
                {/* Main Result Card */}
                <div className="rounded-3xl bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent border-2 border-amber-500/50 p-8 backdrop-blur-xl text-center relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Badge */}
                    <div className="text-6xl mb-2 animate-bounce-slow">{result.badge}</div>
                    
                    {/* Rank */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" 
                      style={{ backgroundColor: `${result.color}30`, borderColor: `${result.color}50`, borderWidth: 1 }}>
                      <span className="text-sm font-black" style={{ color: result.color }}>{result.rank}</span>
                    </div>

                    {/* Amount */}
                    <div className="mb-2">
                      <span className="text-7xl sm:text-8xl font-black bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
                        {toAr(animatedAmount)}
                      </span>
                    </div>
                    <div className="text-amber-400 text-lg font-bold mb-4">ريال سعودي 💰</div>

                    {/* Title & Description */}
                    <div className="max-w-sm mx-auto">
                      <h3 className="text-white text-xl font-black mb-2">{result.title}</h3>
                      <p className="text-white/60 text-sm">{result.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Personality Analysis */}
                {scoreTotals && (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                    <h4 className="text-white/80 text-sm font-bold mb-4 text-center flex items-center justify-center gap-2">
                      <span>📊</span> تحليل شخصيتك
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {axisLabels.map(axis => {
                        const val = scoreTotals[axis.key] || 0
                        const pctAxis = Math.min((val / axis.max) * 100, 100)
                        return (
                          <div key={axis.key} className="p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{axis.icon}</span>
                              <span className="text-white/70 text-sm font-medium flex-1">{axis.label}</span>
                              <span className="text-sm font-black" style={{ color: axis.color }}>{toAr(Math.round(pctAxis))}٪</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${pctAxis}%`, backgroundColor: axis.color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={shareWa} 
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:scale-[1.02] transition-transform">
                    <Share2 className="w-5 h-5" />
                    شارك نتيجتك
                  </button>
                  <button onClick={reset}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white/80 font-bold hover:bg-white/15 transition-all">
                    🔄 جرّب مرة ثانية
                  </button>
                </div>

                {/* CTA to Card Designer */}
                <Link to="/editor" 
                  className="block w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-center hover:border-amber-500/50 transition-all group">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <span className="text-white font-bold">صمّم بطاقة عيد الآن</span>
                    <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
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
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const shareWa = () => {
    if (!link) return
    const text = `� أرسلت لك عيديتي المفاجأة! اختر فانوسك واكشف مبلغك من ${name.trim()} 🌙\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const luckFeatures = [
    { icon: Shuffle, title: 'مفاجأة ممتعة', desc: 'مبلغ مخفيّ في ٣ فوانيس للاختيار' },
    { icon: MessageCircle, title: 'ردود فعل مضحكة', desc: '٧ ردود فعل بالسعودية' },
    { icon: Smartphone, title: 'يعمل على كل جهاز', desc: 'بدون تحميل أي شي' },
    { icon: Link2, title: 'شارك بسهولة', desc: 'انسخ الرابط أو أرسله واتساب' },
  ]

  const steps = [
    { num: '١', title: 'اكتب اسمك', desc: 'عشان المستلم يعرف مين يعيّده' },
    { num: '٢', title: 'شارك الرابط', desc: 'واتساب أو نسخ' },
    { num: '٣', title: 'يختار فانوسه', desc: 'يكشف مبلغه المفاجئ 🌙' },
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="container-main">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <span className="section-label"><Sparkles className="w-3.5 h-3.5" /> ميزة جديدة</span>
            <h2 className="section-title mt-3 mb-4">عيدية مفاجأة 🎁</h2>
            <p className="text-[#64748b] text-[15px] leading-relaxed max-w-lg mx-auto">
              أنشئ رابط عيدية مفاجأة وأرسله لأصدقائك — المستلم يختار فانوسه ويكشف مبلغه مع دعاء جميل
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

// All 20 templates with design settings
const allDesigns = [
  { id: 1, label: 'كلاسيكي', image: '/templates/1.png', greeting: 'عيد مبارك', sub: 'كل عام وأنتم بخير', nameY: 0.82, greetingY: 0.30, subY: 0.48, greetingSize: 90, subSize: 42, nameSize: 64, textColor: '#ffffff' },
  { id: 2, label: 'أنيق', image: '/templates/2.png', greeting: 'عساكم من عوّاده', sub: 'تقبّل الله طاعتكم', nameY: 0.80, greetingY: 0.28, subY: 0.46, greetingSize: 82, subSize: 40, nameSize: 60, textColor: '#ffffff' },
  { id: 3, label: 'حديث', image: '/templates/3.png', greeting: 'كل عام وأنتم بخير', sub: 'أعاده الله عليكم بالخير واليُمن', nameY: 0.83, greetingY: 0.25, subY: 0.44, greetingSize: 78, subSize: 36, nameSize: 62, textColor: '#ffffff' },
  { id: 4, label: 'فاخر', image: '/templates/4.png', greeting: 'عيدكم مبارك', sub: 'وعساكم من العايدين الفايزين', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 5, label: 'ذهبي', image: '/templates/5.png', greeting: 'عيد سعيد', sub: 'أدام الله أفراحكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 6, label: 'ملكي', image: '/templates/6.png', greeting: 'تقبّل الله طاعتكم', sub: 'وكل عام وأنتم بخير', nameY: 0.80, greetingY: 0.26, subY: 0.44, greetingSize: 80, subSize: 36, nameSize: 60, textColor: '#ffffff' },
  { id: 7, label: 'بسيط', image: '/templates/7.png', greeting: 'عيد مبارك', sub: 'أعاده الله علينا وعليكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 8, label: 'راقي', image: '/templates/8.png', greeting: 'كل عام وأنتم بخير', sub: 'عساكم من عوّاده', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 82, subSize: 38, nameSize: 60, textColor: '#ffffff' },
  { id: 9, label: 'عصري', image: '/templates/9.png', greeting: 'عيدكم سعيد', sub: 'تقبّل الله طاعتكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 10, label: 'تراثي', image: '/templates/10.png', greeting: 'عيد مبارك', sub: 'وعساكم من الفايزين', nameY: 0.80, greetingY: 0.26, subY: 0.44, greetingSize: 85, subSize: 38, nameSize: 60, textColor: '#ffffff' },
  { id: 11, label: 'فخم', image: '/templates/11.png', greeting: 'كل عام وأنتم بخير', sub: 'أعاده الله عليكم باليمن', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 82, subSize: 36, nameSize: 62, textColor: '#ffffff' },
  { id: 12, label: 'مميز', image: '/templates/12.png', greeting: 'عساكم من عوّاده', sub: 'كل عام وأنتم بخير', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 85, subSize: 38, nameSize: 60, textColor: '#ffffff' },
  { id: 13, label: 'أصيل', image: '/templates/13.png', greeting: 'تقبّل الله طاعتكم', sub: 'عيد مبارك', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 80, subSize: 40, nameSize: 62, textColor: '#ffffff' },
  { id: 14, label: 'جميل', image: '/templates/14.png', greeting: 'عيد سعيد', sub: 'كل عام وأنتم بألف خير', nameY: 0.80, greetingY: 0.26, subY: 0.44, greetingSize: 85, subSize: 36, nameSize: 60, textColor: '#ffffff' },
  { id: 15, label: 'رائع', image: '/templates/15.png', greeting: 'عيدكم مبارك', sub: 'أعاده الله عليكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 16, label: 'مبدع', image: '/templates/16.png', greeting: 'كل عام وأنتم بخير', sub: 'عساكم من العايدين', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 82, subSize: 38, nameSize: 60, textColor: '#ffffff' },
  { id: 17, label: 'خليجي', image: '/templates/17.png', greeting: 'عيد مبارك', sub: 'تقبّل الله طاعتكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 85, subSize: 38, nameSize: 62, textColor: '#ffffff' },
  { id: 18, label: 'سعودي', image: '/templates/18.png', greeting: 'عساكم من عوّاده', sub: 'كل عام وأنتم بخير', nameY: 0.80, greetingY: 0.26, subY: 0.44, greetingSize: 85, subSize: 38, nameSize: 60, textColor: '#ffffff' },
  { id: 19, label: 'إماراتي', image: '/templates/19.png', greeting: 'عيدكم سعيد', sub: 'أدام الله أفراحكم', nameY: 0.82, greetingY: 0.28, subY: 0.46, greetingSize: 82, subSize: 36, nameSize: 62, textColor: '#ffffff' },
  { id: 20, label: 'كويتي', image: '/templates/20.png', greeting: 'كل عام وأنتم بخير', sub: 'عساكم من الفايزين', nameY: 0.81, greetingY: 0.27, subY: 0.45, greetingSize: 85, subSize: 38, nameSize: 60, textColor: '#ffffff' },
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
  const [selectedId, setSelectedId] = useState(allDesigns[0].id)
  const [name, setName] = useState('')
  const [multiNames, setMultiNames] = useState('')
  const [isMultiMode, setIsMultiMode] = useState(false)
  const [nameColor, setNameColor] = useState('#ffffff')
  const [showAll, setShowAll] = useState(false)
  const [exporting, setExporting] = useState(false)
  const canvasRef = useRef(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [loadedImg, setLoadedImg] = useState(null)
  const selectedDesign = allDesigns.find(d => d.id === selectedId) || allDesigns[0]

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
          <p className="section-subtitle mx-auto text-center">٢٠ تصميم احترافي — فقط اكتب الاسم وحمّل البطاقة</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Controls */}
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <label className="text-xs font-bold text-[#64748b] block mb-3">اختر التصميم</label>
              {/* Infinite auto-scrolling carousel - all 20 templates */}
              <div className="relative overflow-hidden rounded-2xl">
                {/* Gradient fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                
                <div 
                  className="carousel-track-infinite flex gap-3"
                  onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
                  onTouchStart={e => e.currentTarget.style.animationPlayState = 'paused'}
                  onTouchEnd={e => e.currentTarget.style.animationPlayState = 'running'}
                >
                  {/* Duplicate the array 4 times for seamless infinite loop */}
                  {[...allDesigns, ...allDesigns, ...allDesigns, ...allDesigns].map((d, i) => (
                    <button key={`${d.id}-${i}`} onClick={() => setSelectedId(d.id)}
                      className={`group relative flex-none w-[110px] sm:w-[130px] aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-200 ${
                        selectedId === d.id
                          ? 'ring-2 ring-[#d4af37] shadow-lg scale-[1.05] z-20'
                          : 'ring-1 ring-[#e2e8f0] hover:ring-[#d4af37]/50 opacity-75 hover:opacity-100 hover:scale-[1.02]'
                      }`}>
                      <img src={d.image} alt={d.label} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 inset-x-0 p-2 text-right">
                        <span className="text-white text-[11px] font-black drop-shadow-sm block">{d.label}</span>
                        <span className="text-white/50 text-[8px]">{d.greeting}</span>
                      </div>
                      {selectedId === d.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e4a6] flex items-center justify-center shadow-lg">
                          <svg className="w-3 h-3 text-[#1e1b4b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-center text-[#94a3b8] text-xs mt-3">٢٠ تصميم متاح — مرّر للاستعراض</p>
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
