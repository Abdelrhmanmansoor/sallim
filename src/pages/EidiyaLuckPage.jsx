import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Share2, ArrowLeft, RotateCcw, Gift } from 'lucide-react'

/* ═══ Helpers ═══ */
const toAr = (n) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

const reactions = [
  { min: 5,    max: 15,   emoji: '😑', title: 'يعني... مشكور',               desc: 'الله يجزاك خير، بس كان في أمل 🙂' },
  { min: 16,   max: 30,   emoji: '🙂', title: 'ماشي، لا بأس',                 desc: 'يكفي على اللي ما يكفي' },
  { min: 31,   max: 75,   emoji: '😊', title: 'تمام، الله يعطيك',             desc: 'هذا شي، الله يبارك فيك' },
  { min: 76,   max: 150,  emoji: '😄', title: 'الحين كلام!',                   desc: 'عيد صح والله! ربي يحفظك' },
  { min: 151,  max: 300,  emoji: '🤩', title: 'يبيييه!!',                       desc: 'والله هذا كرم أصيل، الله لا يحرمنا منك' },
  { min: 301,  max: 700,  emoji: '🥹', title: 'دموع الفرح 😭',               desc: 'ما كنت أتوقع... ربي يزيدك ويبارك لك' },
  { min: 701,  max: 2000, emoji: '🤯', title: 'هذا مو عيدية... هذا راتب!!', desc: 'أنت مو شخص، أنت مؤسسة خيرية بكاملها 🏛️' },
]

function getReaction(val) {
  for (const r of reactions) if (val >= r.min && val <= r.max) return r
  return reactions[0]
}

/* Amount pool — weighted towards smaller amounts for fun */
const amountPool = [
  5, 5, 10, 10, 10, 15, 15, 20, 20, 25, 30, 30,
  50, 50, 50, 75, 75, 100, 100, 100,
  150, 200, 200, 250, 300, 500, 500, 750, 1000, 2000,
]

function getRandomAmount() {
  return amountPool[Math.floor(Math.random() * amountPool.length)]
}

/* ═══ Confetti ═══ */
function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 1.5 + Math.random() * 1.5,
      size: 4 + Math.random() * 8,
      color: ['#C9A84C', '#d4b96b', '#f3ead0', '#fff', '#e0c97d'][Math.floor(Math.random() * 5)],
    }))
    setParticles(ps)
  }, [active])
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
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

/* ═══════════════════════════════ */
/* EIDIYA LUCK PAGE               */
/* ═══════════════════════════════ */
export default function EidiyaLuckPage() {
  const [searchParams] = useSearchParams()
  const senderName = searchParams.get('name') || 'مجهول'

  const [phase, setPhase] = useState('ready') // ready | spinning | done
  const [displayNum, setDisplayNum] = useState(0)
  const [finalAmount, setFinalAmount] = useState(null)
  const [emojiKey, setEmojiKey] = useState(0)
  const intervalRef = useRef(null)

  const spin = useCallback(() => {
    if (phase === 'spinning') return
    setPhase('spinning')
    setFinalAmount(null)

    const target = getRandomAmount()
    let elapsed = 0
    const totalDuration = 3000
    const startSpeed = 30
    const endSpeed = 200

    intervalRef.current = setInterval(() => {
      elapsed += startSpeed + (endSpeed - startSpeed) * (elapsed / totalDuration)
      const randomDisplay = Math.floor(Math.random() * 1996) + 5
      setDisplayNum(randomDisplay)

      if (elapsed >= totalDuration) {
        clearInterval(intervalRef.current)
        setDisplayNum(target)
        setFinalAmount(target)
        setEmojiKey(k => k + 1)
        setPhase('done')
      }
    }, startSpeed)

    return () => clearInterval(intervalRef.current)
  }, [phase])

  const reset = () => {
    setPhase('ready')
    setDisplayNum(0)
    setFinalAmount(null)
  }

  const reaction = finalAmount ? getReaction(finalAmount) : null

  const shareWa = () => {
    if (!finalAmount) return
    const text = `🎰 لفّيت عداد العيدية من ${senderName} وطلع لي ${toAr(finalAmount)} ريال!\n${reaction.emoji} ${reaction.title}\n\nجرّب حظك: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen w-full bg-[#060709] overflow-x-hidden">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 w-full overflow-hidden py-32">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,90vw)] h-[300px] bg-[#C9A84C]/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 bg-[#C9A84C]/[0.08] border border-[#C9A84C]/15 rounded-full px-5 py-2 text-[#C9A84C] text-sm font-medium">
              <Gift className="w-4 h-4" />
              عيديتك بحظّك!
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white/90 mb-4 leading-[1.5]">
            <span className="text-[#C9A84C]">{senderName}</span> يعيّدك
          </h1>
          <p className="text-white/35 text-sm mb-12 leading-[1.9]">
            لفّ العداد وشوف كم عيديتك! 🎰
          </p>

          {/* ─── SLOT MACHINE CARD ─── */}
          <div className="relative rounded-3xl overflow-hidden transition-all duration-700"
            style={{
              background: phase === 'done' && reaction
                ? `radial-gradient(ellipse at center, ${finalAmount >= 300 ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.05)'} 0%, rgba(10,10,10,0.95) 70%)`
                : 'rgba(255,255,255,0.02)',
              border: phase === 'done' && finalAmount >= 300
                ? '1.5px solid rgba(201,168,76,0.35)'
                : '1.5px solid rgba(255,255,255,0.06)',
              boxShadow: phase === 'done' && finalAmount >= 300
                ? '0 0 80px rgba(201,168,76,0.15), 0 0 160px rgba(201,168,76,0.05)'
                : 'none',
            }}
          >
            <Confetti active={phase === 'done' && finalAmount >= 500} />

            <div className="relative z-10 p-8 sm:p-10">
              {/* Number display */}
              <div className="mb-10">
                <div className={`relative inline-block rounded-2xl px-8 sm:px-10 py-6 transition-all duration-500 max-w-full ${
                  phase === 'spinning' ? 'bg-[#C9A84C]/[0.08] animate-pulse' : phase === 'done' ? 'bg-[#C9A84C]/[0.10]' : 'bg-white/[0.03]'
                }`}
                  style={{
                    border: phase === 'done' ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className={`text-6xl sm:text-7xl md:text-8xl font-black tabular-nums leading-none transition-all duration-150 break-words ${
                    phase === 'spinning' ? 'text-[#C9A84C] luck-spin-blur' : phase === 'done' ? 'text-[#C9A84C]' : 'text-white/15'
                  }`}>
                    {phase === 'ready' ? '؟؟؟' : toAr(displayNum)}
                  </div>
                  {phase !== 'ready' && (
                    <span className={`block mt-3 font-bold text-lg transition-colors ${phase === 'done' ? 'text-[#C9A84C]/80' : 'text-[#C9A84C]/40'}`}>
                      ريال
                    </span>
                  )}
                </div>
              </div>

              {/* Reaction (after spin) */}
              {phase === 'done' && reaction && (
                <div className="animate-fade-up mb-10">
                  <div key={emojiKey} className="text-6xl mb-4 animate-emoji-pop">
                    {reaction.emoji}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{reaction.title}</h3>
                  <p className="text-white/40 text-sm leading-[1.9]">{reaction.desc}</p>
                </div>
              )}

              {/* Action buttons */}
              {phase === 'ready' && (
                <button onClick={spin} className="btn-gold w-full justify-center !py-5 !text-lg group">
                  <span className="text-2xl">🎰</span>
                  لفّ العداد!
                </button>
              )}

              {phase === 'spinning' && (
                <div className="flex items-center justify-center gap-3 text-[#C9A84C]/60 font-bold text-lg py-4">
                  <span className="inline-block animate-spin-slow">🎰</span>
                  جاري اللف...
                </div>
              )}

              {phase === 'done' && (
                <div className="space-y-4">
                  <button onClick={shareWa} className="btn-gold w-full justify-center group">
                    <Share2 className="w-4 h-4" />
                    شارك حظك عبر واتساب
                  </button>
                  <button onClick={reset} className="btn-outline-gold w-full justify-center group">
                    <RotateCcw className="w-4 h-4" />
                    لفّ مرة ثانية
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back to home */}
          <Link to="/" className="group btn-ghost-gold mt-12 justify-center mx-auto">
            العودة للرئيسية
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
