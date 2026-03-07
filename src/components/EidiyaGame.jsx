import { useState, useEffect, useRef } from 'react'
import { BsWhatsapp, BsTwitterX, BsArrowLeft, BsStars, BsCoin, BsClock, BsLightning, BsDownload } from 'react-icons/bs'
import { 
  getEidiyaGame, 
  getEidiyaGameStatus, 
  submitEidiyaGameAnswer 
} from '../utils/api'

const moneyImages = [
  '/images/MONEY/500 SR.png',
  '/images/MONEY/500 SR2.png',
  '/images/MONEY/500 SR3.png',
  '/images/MONEY/500 SR41.png',
  '/images/MONEY/500 DOZEN.png'
]

// ═══════════════════════════════════════════════════════════════════════════════
//   MONEY PARTICLE ANIMATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function MoneyRain({ active }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const particles = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create money particle class
    class MoneyParticle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -100
        this.velocityX = (Math.random() - 0.5) * 4
        this.velocityY = 2 + Math.random() * 3
        this.rotation = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 10
        this.imageIndex = Math.floor(Math.random() * moneyImages.length)
        this.scale = 0.5 + Math.random() * 0.5
        this.opacity = 1
      }

      update() {
        this.x += this.velocityX
        this.y += this.velocityY
        this.rotation += this.rotationSpeed
        
        // Gravity effect
        this.velocityY += 0.05
        
        // Fade out at bottom
        if (this.y > canvas.height - 100) {
          this.opacity -= 0.02
        }

        // Reset if out of bounds or faded
        if (this.y > canvas.height || this.opacity <= 0) {
          this.reset()
        }
      }

      draw() {
        if (this.opacity <= 0) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.scale(this.scale, this.scale)
        ctx.globalAlpha = this.opacity

        const img = new Image()
        img.src = moneyImages[this.imageIndex]
        ctx.drawImage(img, -50, -30, 100, 60)

        ctx.restore()
      }
    }

    // Create initial particles
    for (let i = 0; i < 30; i++) {
      const particle = new MoneyParticle()
      particle.y = Math.random() * canvas.height
      particles.push(particle)
    }

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//   MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function EidiyaGame({ username, onClose }) {
  const [phase, setPhase] = useState('pledge') // pledge | playing | result
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [moneyRain, setMoneyRain] = useState(false)
  
  // Generate unique session ID for this player
  const sessionId = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )

  const currentQuestion = questions[currentQ]
  const totalQuestions = questions.length
  const progress = totalQuestions ? ((answeredCount) / totalQuestions) * 100 : 0

  // Play coin sound
  const playCoinSound = () => {
    try {
      const audio = new Audio('/SOUND/freesound_crunchpixstudio-purchase-success-384963.mp3')
      audio.volume = 0.7
      audio.play().catch(err => console.log('Audio play failed:', err))
    } catch (err) {
      console.log('Audio error:', err)
    }
  }

  // Load game data
  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true)
        
        // Check if player has already played
        const statusRes = await getEidiyaGameStatus(username, sessionId.current)
        
        if (statusRes.data && !statusRes.data.canPlay) {
          setError(statusRes.data.message || 'لقد قمت باللعب مسبقاً!')
          setLoading(false)
          return
        }

        // Load questions
        const gameRes = await getEidiyaGame(username)
        
        if (gameRes.data && gameRes.data.questions) {
          setQuestions(gameRes.data.questions)
        } else {
          setError('اللعبة غير مفعلة حالياً')
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ في تحميل اللعبة')
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [username])

  // Handle answer submission
  const handleAnswer = async (answerIndex) => {
    if (showFeedback || selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)

    try {
      const res = await submitEidiyaGameAnswer(username, {
        questionIndex: currentQ,
        answerIndex,
        sessionId: sessionId.current
      })

      if (res.success) {
        const { isCorrect, rewardAmount, currentScore: newScore } = res.data
        
        setShowFeedback(true)
        
        if (isCorrect) {
          setScore(newScore)
          playCoinSound()
          setMoneyRain(true)
          setTimeout(() => setMoneyRain(false), 2000)
        }

        setAnsweredCount(prev => prev + 1)
      }
    } catch (err) {
      alert(err.message || 'حدث خطأ في الإرسال')
      setSelectedAnswer(null)
    }
  }

  // Next question
  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setPhase('result')
    }
  }

  // Share functions
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🎁 سويت تحدي العيدية في ديوانية ${username}!\n\n` +
      `عيديتي المتوقعة: ${score} ريال 💰\n` +
      `جاوبت على ${answeredCount} من ${totalQuestions} سؤال\n\n` +
      `جرب أنت: ${window.location.href}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareOnX = () => {
    const text = encodeURIComponent(
      `🎁 سويت تحدي العيدية!\n\n` +
      `عيديتي المتوقعة: ${score} ريال 💰`
    )
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`,
      '_blank'
    )
  }

  const downloadResult = () => {
    // Create canvas for download
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 600

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Title
    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 48px Tajawal, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('تحدي العيدية', 400, 100)

    // Result
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px Tajawal, sans-serif'
    ctx.fillText('عيديتك المتوقعة', 400, 250)

    // Amount
    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 72px Tajawal, sans-serif'
    ctx.fillText(`${score} ريال`, 400, 350)

    // Stats
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '24px Tajawal, sans-serif'
    ctx.fillText(`جاوبت على ${answeredCount} من ${totalQuestions} سؤال`, 400, 450)

    // Download
    const link = document.createElement('a')
    link.download = `eidiya-result-${username}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontFamily: 'Tajawal, sans-serif'
      }}>
        <BsLightning size={48} style={{ animation: 'spin 1s linear infinite', color: '#d4af37' }} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontFamily: 'Tajawal, sans-serif'
      }}>
        <div style={{ textAlign: 'center', padding: '24px', background: '#fee', borderRadius: '12px' }}>
          <p style={{ color: '#c00', fontSize: '18px', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#171717',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            رجوع
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <MoneyRain active={moneyRain} />

      {/* ═══ PLEDGE PHASE ═══ */}
      {phase === 'pledge' && (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          color: '#fff'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🤝</div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            تعهد العيدية
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '32px', opacity: 0.9 }}>
            أنا أتعهد – بروح مرحة – أن أعطي العيدية لكل من يجاوب على الأسئلة صح 😂<br />
            لكن لا غش!
          </p>
          <button
            onClick={() => setPhase('playing')}
            style={{
              padding: '16px 48px',
              background: '#fff',
              color: '#667eea',
              border: 'none',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ابدأ التحدي ⚡
          </button>
        </div>
      )}

      {/* ═══ PLAYING PHASE ═══ */}
      {phase === 'playing' && currentQuestion && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                السؤال {currentQ + 1} / {totalQuestions}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#d4af37' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #d4af37, #f5d67b)',
                  borderRadius: '4px',
                  transition: 'width 300ms ease'
                }}
              />
            </div>
          </div>

          {/* Score Display */}
          {score > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d4af37, #f5d67b)',
              borderRadius: '12px',
              marginBottom: '24px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 700
            }}>
              <BsCoin size={20} />
              {score} ريال
            </div>
          )}

          {/* Question Card */}
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
              {currentQuestion.question}
            </h2>
            {currentQuestion.rewardAmount && (
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#fef3c7',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#d97706',
                margin: '0 auto'
              }}>
                🎁 مكافأة: {currentQuestion.rewardAmount} ريال
              </div>
            )}
          </div>

          {/* Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestion.answers.map((answer, idx) => {
              let buttonStyle = {
                padding: '20px 24px',
                background: '#fff',
                border: '2px solid #e5e5e5',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textAlign: 'right'
              }

              if (selectedAnswer !== null) {
                if (idx === selectedAnswer) {
                  buttonStyle.background = showFeedback ? '#dcfce7' : '#f3f4f6'
                  buttonStyle.borderColor = showFeedback ? '#22c55e' : '#d4af37'
                  buttonStyle.cursor = 'default'
                } else if (showFeedback) {
                  buttonStyle.opacity = 0.5
                  buttonStyle.cursor = 'default'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  style={buttonStyle}
                >
                  {answer}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && selectedAnswer !== null && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: score > 0 ? '#fef3c7' : '#fee2e2',
              borderRadius: '16px',
              textAlign: 'center',
              border: `2px solid ${score > 0 ? '#f59e0b' : '#ef4444'}`
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {score > 0 ? '🎉' : '😔'}
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                {score > 0 ? `+${currentQuestion.rewardAmount} ريال عيدية 💰` : 'إجابة خاطئة'}
              </p>
              {currentQ < questions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  style={{
                    marginTop: '16px',
                    padding: '14px 32px',
                    background: '#171717',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  السؤال التالي ←
                </button>
              )}
              {currentQ === questions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  style={{
                    marginTop: '16px',
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #d4af37, #f5d67b)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  عرض النتيجة 🎉
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ RESULT PHASE ═══ */}
      {phase === 'result' && (
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎊</div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            عيديتك المتوقعة
          </h1>
          
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #d4af37, #f5d67b)',
            borderRadius: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
          }}>
            <div style={{ fontSize: '64px', fontWeight: 900, color: '#fff' }}>
              {score}
            </div>
            <div style={{ fontSize: '24px', color: '#fff', opacity: 0.9, marginTop: '8px' }}>
              ريال سعودي
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: '#f3f4f6',
            borderRadius: '16px',
            marginBottom: '32px'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
              جاوبت على <strong>{answeredCount}</strong> من <strong>{totalQuestions}</strong> سؤال
            </p>
            <p style={{ fontSize: '16px', color: '#888' }}>
              {answeredCount === totalQuestions ? '🌟 ممتاز! أجبت على كل الأسئلة!' : 'استمر في المحاولة!'}
            </p>
          </div>

          {/* Share Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={shareOnWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <BsWhatsapp size={24} />
              مشاركة على واتساب
            </button>
            <button
              onClick={shareOnX}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <BsTwitterX size={24} />
              مشاركة على X
            </button>
            <button
              onClick={downloadResult}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: '#f3f4f6',
                color: '#171717',
                border: '2px solid #e5e5e5',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <BsDownload size={24} />
              تحميل النتيجة كصورة
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#666',
              border: '2px solid #e5e5e5',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            رجوع
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}