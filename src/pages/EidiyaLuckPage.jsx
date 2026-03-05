import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Share2, ArrowLeft, RotateCcw, Gift } from 'lucide-react'

/* ═══ Helpers ═══ */
const toAr = (n) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])

const reactions = [
  { min: 5,    max: 15,  emoji: '🙂', title: 'الله يجزاك خير',                    dua: 'جزاكم الله خيراً وبارك فيكم',                              desc: 'المحبة تكفي عن أي مبلغ!' },
  { min: 16,   max: 30,  emoji: '😊', title: 'مشكور يا الغالي',                    dua: 'بارك الله فيك وفي أهلك',                                   desc: 'الله يبارك لك ويزيدك من فضله' },
  { min: 31,   max: 75,  emoji: '😄', title: 'الله يعطيك العافية',                  dua: 'ربي يحفظك ويرزقك',                                         desc: 'كرمك ماشاء الله، ربي يزيدك من فضله' },
  { min: 76,   max: 150, emoji: '🤩', title: 'ما شاء الله عليك!',                   dua: 'ربنا يبارك فيك ويكثر من أمثالك',                           desc: 'هذا كرم أصيل — عيد مبارك الله يرحمك' },
  { min: 151,  max: 300, emoji: '🥹', title: 'جعلها في ميزان حسناتك',               dua: 'اللهم بارك له وزده من فضلك',                               desc: 'قلب طيّب وكرم حاتمي، ربي يزيدك' },
  { min: 301,  max: 700, emoji: '😭', title: 'دموع الفرح!',                         dua: 'جعله الله في ميزان حسناتك وبارك في مالك',                 desc: 'ما كنت أتوقع هذا الكرم، ربّك يكرمك في الدارين' },
  { min: 701,  max: 2000, emoji: '🤲', title: 'اللهم بارك!',                        dua: 'اللهم اجعله في موازين حسناته وزده من رزقك الواسع',       desc: 'كرمك يشبه الأجداد، الله يجعله في موازين حسناتك' },
]

function getReaction(val) {
  for (const r of reactions) if (val >= r.min && val <= r.max) return r
  return reactions[reactions.length - 1]
}

const amountPool = [
  5, 5, 10, 10, 10, 15, 15, 20, 20, 25, 30, 30,
  50, 50, 50, 75, 75, 100, 100, 100,
  150, 200, 200, 250, 300, 500, 500, 750, 1000, 2000,
]

function getRandom() {
  return amountPool[Math.floor(Math.random() * amountPool.length)]
}

/* ── Sparkle Particles ── */
function SparkleParticles({ active }) {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    const colors = ['#d4af37', '#f4e4a6', '#C6F806', '#ffffff', '#fbbf24']
    setParticles(Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: Math.random() * 0.6,
      dur: 1.5 + Math.random() * 1.5,
      size: 5 + Math.random() * 7,
      isCircle: Math.random() > 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    })))
  }, [active])
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map(p => (
        <span key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? '50%' : '2px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Lantern SVG ── */
function LanternSVG({ lit = false }) {
  return (
    <svg viewBox="0 0 60 110" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: lit ? 'drop-shadow(0 0 14px #C6F806) drop-shadow(0 0 28px #d4af37aa)' : 'none', transition: 'filter 0.6s ease' }}>
      {/* Chain */}
      <line x1="30" y1="2" x2="30" y2="12" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Top cap */}
      <path d="M15 12 Q30 7 45 12 L44 20 Q30 15 16 20 Z" fill="#d4af37"/>
      {/* Body */}
      <rect x="12" y="20" width="36" height="58" rx="6"
        fill={lit ? '#1a1000' : '#111827'}
        style={{ transition: 'fill 0.6s ease' }}/>
      {/* Inner glow when lit */}
      {lit && (
        <rect x="16" y="24" width="28" height="50" rx="4" fill="#C6F806" opacity="0.12"/>
      )}
      {/* Horizontal decorative lines */}
      <line x1="12" y1="39" x2="48" y2="39" stroke="#d4af37" strokeWidth="0.7" opacity="0.35"/>
      <line x1="12" y1="59" x2="48" y2="59" stroke="#d4af37" strokeWidth="0.7" opacity="0.35"/>
      {/* Corner accents */}
      <rect x="10" y="37" width="4" height="4" rx="1" fill="#d4af37" opacity="0.5"/>
      <rect x="46" y="37" width="4" height="4" rx="1" fill="#d4af37" opacity="0.5"/>
      <rect x="10" y="57" width="4" height="4" rx="1" fill="#d4af37" opacity="0.5"/>
      <rect x="46" y="57" width="4" height="4" rx="1" fill="#d4af37" opacity="0.5"/>
      {/* Star symbol */}
      <text x="30" y="54" textAnchor="middle" fontSize={lit ? 20 : 13}
        fill={lit ? '#C6F806' : '#d4af37'} opacity={lit ? 1 : 0.3}
        style={{ transition: 'all 0.6s ease', fontFamily: 'serif' }}>✦</text>
      {/* Bottom cap */}
      <path d="M16 78 L44 78 L40 88 L20 88 Z" fill="#d4af37"/>
      <circle cx="30" cy="91" r="3.5" fill="#d4af37"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* EIDIYA LUCK PAGE                                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function EidiyaLuckPage() {
  const [searchParams] = useSearchParams()
  const senderName = searchParams.get('name') || 'مجهول'

  const [amounts, setAmounts] = useState(() => [getRandom(), getRandom(), getRandom()])
  const [phase, setPhase] = useState('choose') // choose | revealing | done
  const [chosenIdx, setChosenIdx] = useState(null)
  const [finalAmount, setFinalAmount] = useState(null)

  const chooseLantern = (idx) => {
    if (phase !== 'choose') return
    setChosenIdx(idx)
    setPhase('revealing')
    setTimeout(() => {
      setFinalAmount(amounts[idx])
      setPhase('done')
    }, 1600)
  }

  const reset = () => {
    setPhase('choose')
    setChosenIdx(null)
    setFinalAmount(null)
    setAmounts([getRandom(), getRandom(), getRandom()])
  }

  const reaction = finalAmount ? getReaction(finalAmount) : null

  const shareWa = () => {
    if (!finalAmount || !reaction) return
    const text = `🎁 فتحت فانوسي من ${senderName} وطلع لي ${toAr(finalAmount)} ريال!\n${reaction.emoji} ${reaction.title}\n\n${reaction.dua}\n\nجرّب أنت: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="page-shell overflow-x-hidden">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 w-full overflow-hidden py-24">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(500px,90vw)] h-[300px] rounded-full blur-[150px] transition-all duration-1000"
            style={{ backgroundColor: phase === 'done' && finalAmount >= 300 ? 'rgba(198,248,6,0.10)' : 'rgba(219,234,254,0.65)' }} />
        </div>

        <div className="relative z-10 text-center max-w-lg mx-auto w-full">
          {/* Header badge */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 bg-[#6A47ED]/[0.08] border border-[#6A47ED]/15 rounded-full px-5 py-2 text-[#6A47ED] text-sm font-medium">
              <Gift className="w-4 h-4" />
              عيدية مفاجأة
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] mb-3 leading-[1.5]">
            <span className="text-[#1D4ED8]">{senderName}</span> يعيّدك
          </h1>
          <p className="text-[#64748B] text-sm mb-10 leading-[1.9]">
            {phase === 'choose'
              ? 'اختر فانوساً لتكشف عيديتك المفاجأة 🌙'
              : phase === 'revealing'
              ? '✨ جاري كشف الفانوس...'
              : '🌙 عيد مبارك وكل عام وأنت بخير!'}
          </p>

          {/* ── Lanterns Row ── */}
          <div className="flex items-end justify-center gap-8 sm:gap-14 mb-10" style={{ height: '140px' }}>
            {[0, 1, 2].map((idx) => {
              const isChosen = chosenIdx === idx
              const isLit = isChosen && (phase === 'revealing' || phase === 'done')
              const isDimmed = chosenIdx !== null && chosenIdx !== idx

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => chooseLantern(idx)}
                    disabled={phase !== 'choose'}
                    className={`relative transition-all duration-500 focus:outline-none ${
                      phase === 'choose'
                        ? 'hover:scale-[1.15] hover:-translate-y-3 cursor-pointer active:scale-95'
                        : ''
                    } ${isChosen && phase === 'revealing' ? 'scale-[1.15] -translate-y-3 animate-bounce-slow' : ''} ${
                      isDimmed ? 'opacity-25 scale-90' : ''
                    }`}
                    style={{ width: '68px', height: '120px' }}
                    aria-label={`اختر الفانوس ${toAr(idx + 1)}`}
                  >
                    <LanternSVG lit={isLit} />
                  </button>
                  {phase === 'choose' && (
                    <span className="text-[10px] text-[#94a3b8] font-medium">
                      {['فانوس ١', 'فانوس ٢', 'فانوس ٣'][idx]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Choose hint */}
          {phase === 'choose' && (
            <p className="text-[#94a3b8] text-xs mb-8">
              🌙 كل فانوس يخفي مبلغاً مختلفاً — اختر!
            </p>
          )}

          {/* ── Result Card (slides in when done) ── */}
          <div
            className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
              phase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
            style={{
              background: 'linear-gradient(165deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.97) 100%)',
              border: finalAmount >= 300 ? '1.5px solid rgba(198,248,6,0.35)' : '1.5px solid rgba(147,197,253,0.35)',
              boxShadow: finalAmount >= 300
                ? '0 0 80px rgba(198,248,6,0.12), 0 0 160px rgba(198,248,6,0.05)'
                : '0 16px 55px rgba(15,23,42,0.25)',
            }}
          >
            <SparkleParticles active={phase === 'done'} />

            <div className="relative z-10 p-8 sm:p-10">
              {phase === 'done' && reaction && (
                <>
                  {/* Reaction emoji */}
                  <div className="text-6xl mb-4">{reaction.emoji}</div>

                  {/* Amount */}
                  <div className="mb-1">
                    <span className="text-7xl sm:text-8xl font-black bg-gradient-to-b from-[#f4e4a6] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent tabular-nums">
                      {toAr(finalAmount)}
                    </span>
                  </div>
                  <div className="text-[#d4af37] font-bold text-lg mb-5">ريال سعودي</div>

                  {/* Title + desc */}
                  <h3 className="text-white font-black text-xl mb-2">{reaction.title}</h3>
                  <p className="text-white/50 text-sm leading-[1.9] mb-3">{reaction.desc}</p>

                  {/* Du'aa phrase */}
                  <p className="text-[#C6F806]/80 text-sm font-medium mb-8 italic leading-relaxed">
                    {reaction.dua}
                  </p>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <button onClick={shareWa} className="btn-gold w-full justify-center">
                      <Share2 className="w-4 h-4" />
                      شارك عبر واتساب
                    </button>
                    <button onClick={reset} className="btn-outline-gold w-full justify-center">
                      <RotateCcw className="w-4 h-4" />
                      جرّب مرة أخرى
                    </button>
                  </div>
                </>
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