import { useSearchParams, Link } from 'react-router-dom'
import { templates } from '../data/templates'
import { useState, useEffect, useRef } from 'react'
import { BsDownload, BsWhatsapp, BsArrowRight, BsMoonStars } from 'react-icons/bs'
import html2canvas from 'html2canvas'

export default function CardViewPage() {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || 'صديقي'
  const templateId = parseInt(searchParams.get('t')) || 1
  const greeting = searchParams.get('g') || 'كل عام وأنتم بخير'

  const template = templates.find((t) => t.id === templateId) || templates[0]

  const [loaded, setLoaded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setShowConfetti(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')

      // Draw background
      ctx.drawImage(img, 0, 0)

      // Add name text overlay
      const fontSize = Math.round(canvas.width * 0.065)
      ctx.font = `bold ${fontSize}px 'Cairo', 'Amiri', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = template.textColor || '#ffffff'
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur = 8

      // Draw greeting
      const greetFontSize = Math.round(canvas.width * 0.05)
      ctx.font = `bold ${greetFontSize}px 'Cairo', 'Amiri', sans-serif`
      ctx.fillText(greeting, canvas.width / 2, canvas.height * 0.42)

      // Draw name bigger
      ctx.font = `bold ${fontSize}px 'Cairo', 'Amiri', sans-serif`
      ctx.fillText(name, canvas.width / 2, canvas.height * 0.55)

      // Download
      const link = document.createElement('a')
      link.download = `بطاقة-${name}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = template.image
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Confetti / Sparkles decoration */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none animate-fadeInUp">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-gold-400/40 animate-float"
              style={{
                left: `${8 + Math.random() * 84}%`,
                top: `${5 + Math.random() * 80}%`,
                animationDelay: `${i * 0.4}s`,
                fontSize: `${12 + Math.random() * 18}px`,
              }}
            >
              {['●', '○', '●', '○', '●'][i % 5]}
            </div>
          ))}
        </div>
      )}

      {/* Card Content */}
      <div className={`relative z-10 max-w-md w-full transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        
        {/* Header greeting */}
        <div className="text-center mb-8">
          <p className="text-gold-400/70 text-sm mb-2">بطاقة تهنئة خاصة بـ</p>
          <h1 className="text-4xl md:text-5xl font-black gradient-gold-text mb-1">{name}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-8 h-px bg-gold-500/30"></div>
            <span className="text-gold-400/50 text-sm">•</span>
            <div className="w-8 h-px bg-gold-500/30"></div>
          </div>
        </div>

        {/* Card Image */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-gold-500/20 via-transparent to-gold-500/10 rounded-3xl blur-sm"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gold-500/20">
            <img
              src={template.image}
              alt="بطاقة تهنئة"
              className="w-full"
              onLoad={() => setLoaded(true)}
            />
            {/* Name + Greeting overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <p className="text-white/90 text-lg md:text-xl font-bold drop-shadow-lg mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                {greeting}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                {name}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl gradient-gold text-gray-900 font-black text-lg transition-all hover:shadow-xl hover:shadow-gold-500/20 hover:scale-[1.02]"
          >
            <BsDownload className="text-xl" />
            تحميل البطاقة
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const text = encodeURIComponent(`${greeting} يا ${name}\n\n${window.location.href}`)
                window.open(`https://wa.me/?text=${text}`, '_blank')
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-400 font-bold text-sm transition-all"
            >
              <BsWhatsapp />
              مشاركة
            </button>
            <Link
              to="/editor"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 text-gold-400 font-bold text-sm transition-all"
            >
              <BsMoonStars />
              صمّم بطاقتك
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-gold-500/20"></div>
            <span className="text-gold-400/30 text-xs">•</span>
            <div className="w-8 h-px bg-gold-500/20"></div>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-400 text-xs transition-colors">
            <img src="/images/logo-suliman.png" alt="سَلِّم" className="w-5 h-5 object-contain opacity-50" onError={(e) => { e.target.style.display = 'none' }} />
            صنع عبر <span className="text-gold-400/70 font-bold">سَلِّم</span> — تابع لمؤسسة سليمان
          </Link>
        </div>
      </div>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
