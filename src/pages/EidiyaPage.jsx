import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { BsDownload, BsWhatsapp, BsCamera, BsMoonStars } from 'react-icons/bs'
import html2canvas from 'html2canvas'

// ═══ Gulf Dialect Map ═══
const dialects = {
  sa: {
    title: 'عيديتك وصلت!',
    subtitle: 'من عند',
    spin: 'لف وشف حظك!',
    spinning: 'يلا بسم الله...',
    result: 'مبرووك! عيديتك:',
    currency: 'ريال',
    screenshot: 'صوّر الشاشة وأرسلها!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص خلّصت محاولاتك!',
    tries: 'عندك {n} محاولة',
    triesPlural: 'عندك {n} محاولات',
    congrats: 'الله يبارك لك!',
    footer: 'عيدك مبارك وعساك من عوّاده',
  },
  ae: {
    title: 'عيديتك وصلت!',
    subtitle: 'من عند',
    spin: 'دور وشوف حظك!',
    spinning: 'يالله بسم الله...',
    result: 'مبرووك! عيديتك:',
    currency: 'درهم',
    screenshot: 'صوّر السكرين وأرسلها!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص خلّصت الدورات!',
    tries: 'عندك {n} دوره',
    triesPlural: 'عندك {n} دورات',
    congrats: 'الله يبارك فيك!',
    footer: 'عيدكم مبارك وكل سنة وانتوا طيبين',
  },
  kw: {
    title: 'عيديتك وصلت!',
    subtitle: 'من',
    spin: 'دور وشوف حظك!',
    spinning: 'يالله...',
    result: 'مبرووك! عيديتك:',
    currency: 'دينار',
    screenshot: 'صوّر السكرين وأرسله!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص انتهت محاولاتك!',
    tries: 'عندك {n} محاولة',
    triesPlural: 'عندك {n} محاولات',
    congrats: 'مبارك عليك!',
    footer: 'عيدكم مبارك وعساكم من عوّاده',
  },
  bh: {
    title: 'عيديتك وصلت!',
    subtitle: 'من',
    spin: 'دور وشوف نصيبك!',
    spinning: 'يالله بسم الله...',
    result: 'مبرووك! عيديتك:',
    currency: 'دينار',
    screenshot: 'صوّر الشاشة وأرسلها!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص خلّصت محاولاتك!',
    tries: 'عندك {n} محاولة',
    triesPlural: 'عندك {n} محاولات',
    congrats: 'مبروك عليك!',
    footer: 'عيدكم مبارك وينعاد عليكم بالخير',
  },
  qa: {
    title: 'عيديتك وصلت!',
    subtitle: 'من',
    spin: 'لف وشف حظك!',
    spinning: 'يالله بسم الله...',
    result: 'مبرووك! عيديتك:',
    currency: 'ريال',
    screenshot: 'صوّر السكرين وأرسله!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص خلّصت محاولاتك!',
    tries: 'عندك {n} محاولة',
    triesPlural: 'عندك {n} محاولات',
    congrats: 'مبارك عليك!',
    footer: 'عيدكم مبارك وكل عام وأنتم بخير',
  },
  om: {
    title: 'عيديتك وصلت!',
    subtitle: 'من',
    spin: 'دور وشوف حظك!',
    spinning: 'يالله بسم الله...',
    result: 'مبرووك! عيديتك:',
    currency: 'ريال',
    screenshot: 'صوّر الشاشة وأرسلها!',
    screenshotBtn: 'لقطة شاشة',
    noTries: 'خلاص انتهت المحاولات!',
    tries: 'عندك {n} محاولة',
    triesPlural: 'عندك {n} محاولات',
    congrats: 'مبروك عليك!',
    footer: 'عيدكم مبارك وأيامكم سعيدة',
  },
}

export default function EidiyaPage() {
  const [searchParams] = useSearchParams()
  const senderName = searchParams.get('from') || 'صديقك'
  const min = parseInt(searchParams.get('min')) || 10
  const max = parseInt(searchParams.get('max')) || 100
  const maxTries = parseInt(searchParams.get('tries')) || 1
  const currency = searchParams.get('cur') || 'ريال'
  const dialectKey = searchParams.get('d') || 'sa'

  const t = dialects[dialectKey] || dialects.sa

  const [phase, setPhase] = useState('ready') // ready | spinning | result | done
  const [displayNum, setDisplayNum] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)
  const [triesLeft, setTriesLeft] = useState(maxTries)
  const [showConfetti, setShowConfetti] = useState(false)
  const resultRef = useRef(null)
  const animRef = useRef(null)

  const spinDuration = 3500 // ms

  const handleSpin = useCallback(() => {
    if (triesLeft <= 0 || phase === 'spinning') return

    setPhase('spinning')
    setShowConfetti(false)

    // Random final amount
    const amount = Math.floor(Math.random() * (max - min + 1)) + min
    setFinalAmount(amount)

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      // Easing: fast at start, slow at end (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3)

      if (progress < 1) {
        // Speed decreases over time
        const speed = Math.max(1, Math.floor((1 - eased) * 20))
        const randomDisplay = Math.floor(Math.random() * (max - min + 1)) + min

        // Near the end, converge toward final amount
        if (progress > 0.85) {
          const blend = (progress - 0.85) / 0.15
          setDisplayNum(Math.round(randomDisplay * (1 - blend) + amount * blend))
        } else {
          setDisplayNum(randomDisplay)
        }

        animRef.current = setTimeout(animate, 30 + speed * 8)
      } else {
        // Done!
        setDisplayNum(amount)
        setPhase('result')
        setTriesLeft((prev) => prev - 1)
        setShowConfetti(true)
      }
    }

    animate()

    return () => {
      if (animRef.current) clearTimeout(animRef.current)
    }
  }, [triesLeft, phase, min, max, spinDuration])

  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current)
    }
  }, [])

  const handleScreenshot = async () => {
    if (!resultRef.current) return
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#17012C',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `عيدية-من-${senderName}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // fallback
      alert(t.screenshot)
    }
  }

  const triesText = triesLeft === 1 ? t.tries.replace('{n}', triesLeft) : t.triesPlural.replace('{n}', triesLeft)

  return (
    <div className="page-shell flex flex-col items-center justify-center px-4 pb-8 relative overflow-hidden" dir="rtl">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6A47ED]/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 + Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${16 + Math.random() * 20}px`,
                opacity: 0.8,
              }}
            >
              {['●', '○', '●', '○', '●', '○', '●', '○'][i % 8]}
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div ref={resultRef} className="relative z-10 max-w-sm w-full">
        {/* Decorative top */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-purple-500/30"></div>
            <span className="text-purple-400/60 text-lg">•</span>
            <div className="w-10 h-px bg-purple-500/30"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black gradient-gold-text mb-2">{t.title}</h1>
          <p className="text-gray-400 text-base">
            {t.subtitle} <span className="text-purple-400 font-bold">{senderName}</span>
          </p>
        </div>

        {/* Spinner Box */}
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-[#6A47ED]/10 transition-all mb-6">
          {/* Number Display */}
          <div className={`relative rounded-2xl p-8 mb-6 text-center overflow-hidden transition-all duration-500 ${
            phase === 'spinning'
              ? 'bg-gradient-to-b from-[#C6F806]/10 to-transparent border-2 border-[#C6F806]/30 shadow-lg shadow-[#C6F806]/10'
              : phase === 'result'
              ? 'bg-gradient-to-b from-green-500/10 to-transparent border-2 border-green-500/30 shadow-lg shadow-green-500/10'
              : 'bg-white/5 border-2 border-white/10'
          }`}>
            {/* Slot machine effect strips */}
            {phase === 'spinning' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 z-10"></div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full"
                    style={{
                      animation: `slotScroll ${0.3 + i * 0.1}s linear infinite`,
                      right: `${i * 33}%`,
                      width: '34%',
                    }}
                  >
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className="text-4xl font-black text-purple-400/20 text-center py-2">
                        {Math.floor(Math.random() * 10)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {phase === 'ready' && (
              <div className="text-6xl md:text-7xl font-black text-gray-600 tabular-nums">
                ???
              </div>
            )}
            {phase === 'spinning' && (
              <div className="relative z-20">
                <div className="text-6xl md:text-7xl font-black text-[#C6F806] tabular-nums animate-pulse">
                  {displayNum}
                </div>
              </div>
            )}
            {(phase === 'result' || phase === 'done') && (
              <div className="animate-scaleIn">
                <p className="text-green-400 text-sm font-bold mb-2">{t.result}</p>
                <div className="text-6xl md:text-7xl font-black gradient-gold-text tabular-nums">
                  {finalAmount}
                </div>
                <p className="text-purple-400 text-lg font-bold mt-2">{currency}</p>
              </div>
            )}
          </div>

          {/* Spin Button or Result */}
          {phase === 'ready' && triesLeft > 0 && (
            <div className="space-y-3">
              <button
                onClick={handleSpin}
                className="w-full py-5 rounded-2xl bg-gradient-to-l from-[#6A47ED] to-[#8B6FF5] text-white font-black text-xl transition-all hover:shadow-xl hover:shadow-[#6A47ED]/30 hover:scale-[1.02] active:scale-95"
              >
                {t.spin}
              </button>
              <p className="text-center text-gray-500 text-xs">{triesText}</p>
            </div>
          )}

          {phase === 'spinning' && (
            <div className="text-center">
              <p className="text-[#C6F806] text-lg font-bold animate-pulse">{t.spinning}</p>
            </div>
          )}

          {phase === 'result' && (
            <div className="space-y-3 animate-fadeInUp">
              <p className="text-center text-green-400 font-bold text-lg">{t.congrats}</p>

              {/* Screenshot instruction */}
              <div className="bg-[#C6F806]/10 border border-[#C6F806]/20 rounded-2xl p-4 text-center">
                <p className="text-[#C6F806] text-sm font-bold mb-1">{t.screenshot}</p>
                <p className="text-gray-500 text-xs">صوّر لقطة شاشة وأرسلها لـ {senderName} عشان يعطيك عيديتك</p>
              </div>

              <button
                onClick={handleScreenshot}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl gradient-gold text-gray-900 font-black text-lg transition-all hover:scale-[1.02]"
              >
                <BsCamera className="text-xl" />
                {t.screenshotBtn}
              </button>

              {/* Share screenshot via WhatsApp */}
              <button
                onClick={() => {
                  const text = encodeURIComponent(`طلعت عيديتي ${finalAmount} ${currency} من ${senderName}! عيدكم مبارك`)
                  window.open(`https://wa.me/?text=${text}`, '_blank')
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-400 font-bold text-sm transition-all"
              >
                <BsWhatsapp /> شارك في واتساب
              </button>

              {triesLeft > 0 && (
                <button
                  onClick={() => { setPhase('ready'); setShowConfetti(false) }}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all"
                >
                  جرّب مرة ثانية ({triesLeft} {triesLeft === 1 ? 'محاولة' : 'محاولات'} باقية)
                </button>
              )}
            </div>
          )}

          {phase === 'ready' && triesLeft <= 0 && (
            <div className="text-center space-y-3 animate-fadeInUp">
              <p className="text-gray-400 text-lg">{t.noTries}</p>
              <p className="text-purple-400 font-bold">عيديتك كانت: {finalAmount} {currency}</p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 text-xs">{t.footer}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-px bg-purple-500/20"></div>
            <span className="text-purple-400/30 text-xs">•</span>
            <div className="w-6 h-px bg-purple-500/20"></div>
          </div>
          <Link to="/send" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 text-xs transition-colors">
            <BsMoonStars className="text-purple-400/50" />
            أنشئ عيديتك عبر <span className="text-purple-400/70 font-bold">سَلِّم</span>
          </Link>
        </div>
      </div>

      {/* Slot machine CSS animation */}
      <style>{`
        @keyframes slotScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  )
}
