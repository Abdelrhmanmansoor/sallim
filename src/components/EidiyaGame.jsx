import { useState, useEffect, useRef } from 'react'
import { BsWhatsapp, BsTwitterX, BsArrowLeft, BsLightning, BsCoin, BsTrophy } from 'react-icons/bs'
import { getStandaloneGame, submitStandaloneGameAnswer, finishStandaloneGame, getDiwaniyaGame, submitDiwaniyaGameAnswer } from '../utils/api'
import { useNavigate } from 'react-router-dom'

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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

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

        this.velocityY += 0.05

        if (this.y > canvas.height - 100) {
          this.opacity -= 0.02
        }
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

    for (let i = 0; i < 30; i++) {
      const particle = new MoneyParticle()
      particle.y = Math.random() * canvas.height
      particles.push(particle)
    }

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
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />
}

// ═══════════════════════════════════════════════════════════════════════════════
//   MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function EidiyaGame({ gameId, username }) {
  const navigate = useNavigate();

  // Game State
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Player State
  const [playerName, setPlayerName] = useState('')

  // Play Modes
  const [phase, setPhase] = useState('welcome') // welcome | pledge | playing | result
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)

  // UI State
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctIndex, setCorrectIndex] = useState(null)
  const [moneyRain, setMoneyRain] = useState(false)
  const [submittingResult, setSubmittingResult] = useState(false)

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

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true)
        const res = username
          ? await getDiwaniyaGame(username)
          : await getStandaloneGame(gameId)

        if (res.success) {
          // Normalize data if needed (standalone uses different field names than diwaniya routes sometimes)
          const data = res.data;
          if (username) {
            // Diwaniya route returns { enabled, questions, totalQuestions }
            // Standalone returns { title, ownerName, questions, settings: { currency } }
            // Let's adapt if needed.
            // Based on server/routes/diwaniya.js: questions map to { question, answers, rewardAmount }
          }
          setGameData(data)
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء جلب اللعبة.')
      } finally {
        setLoading(false)
      }
    }
    if (gameId || username) fetchGame()
  }, [gameId, username])

  const startPledge = (e) => {
    e.preventDefault()
    if (!playerName.trim()) return
    setPhase('pledge')
  }

  const handleAnswer = async (answerIndex) => {
    if (showFeedback || selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)

    try {
      const res = username
        ? await submitDiwaniyaGameAnswer(username, {
          questionIndex: currentQ,
          answerIndex,
          sessionId: 'public-user-' + Math.random().toString(36).substr(2, 9) // In real app, use persistent sessionId
        })
        : await submitStandaloneGameAnswer(gameId, {
          questionIndex: currentQ,
          answerIndex
        })

      if (res.success) {
        const { isCorrect, rewardAmount, correctAnswerIndex, correctAnswer } = res.data
        setShowFeedback(true)
        setCorrectIndex(correctIndex !== undefined ? correctAnswerIndex : (isCorrect ? answerIndex : -1)) // Fallback if index not returned

        if (isCorrect) {
          setScore(prev => prev + 1)
          setTotalEarned(prev => prev + rewardAmount)
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

  const nextQuestion = async () => {
    if (currentQ < gameData.questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setCorrectIndex(null)
    } else {
      // Finish Game
      setPhase('result')
      if (!username) {
        setSubmittingResult(true)
        try {
          await finishStandaloneGame(gameId, {
            playerName,
            score,
            totalEarned
          })

          // Save player data to localStorage for leaderboard display
          const playerKey = `game_${gameId}_player`;
          localStorage.setItem(playerKey, JSON.stringify({
            playerName,
            score,
            totalEarned,
            timestamp: Date.now()
          }));
        } catch (err) {
          console.error('Failed to submit score:', err)
        } finally {
          setSubmittingResult(false)
        }
      }
    }
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🎁 سويت تحدي العيدية من ${gameData.ownerName}!\n\n` +
      `جمعت: ${totalEarned} ${gameData.settings.currency} 💰\n` +
      `أجبت بناءً على ${score} إجابة صحيحة من أصل ${gameData.questions.length}\n\n` +
      `جرب التحدي الآن: ${window.location.href}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Tajawal', sans-serif" }}>
        <BsLightning size={48} style={{ animation: 'spin 1s linear infinite', color: '#FF8C00' }} />
      </div>
    )
  }

  if (error || !gameData) {
    return (
      <div style={{ display: 'flex', flexDir: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: "'Tajawal', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #fee2e2' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>عفواً</h2>
          <p style={{ color: '#737373', fontSize: '18px', marginBottom: '24px' }}>{error || 'اللعبة غير متوفرة'}</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#171717', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>العودة للرئيسية</button>
        </div>
      </div>
    )
  }

  const currentQuestionItem = gameData.questions[currentQ]
  const totalQuestions = gameData.questions.length
  const progress = totalQuestions ? ((answeredCount) / totalQuestions) * 100 : 0
  const currency = gameData.settings?.currency || 'ريال'

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", direction: 'rtl' }}>
      <MoneyRain active={moneyRain} />

      {/* ═══ WELCOME PHASE ═══ */}
      {phase === 'welcome' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '40px 24px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(255,140,0,0.1)', borderRadius: '20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '48px' }}>🎁</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>
            {gameData.title || 'تحدي العيدية'}
          </h1>
          <p style={{ fontSize: '18px', color: '#737373', marginBottom: '32px' }}>
            تحدي العيدية {gameData.ownerName ? <span>مُقدم من <strong style={{ color: '#171717' }}>{gameData.ownerName}</strong></span> : 'بانتظارك'}
          </p>

          <form onSubmit={startPledge} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="اكتب اسمك للمشاركة..."
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              required
              maxLength={30}
              style={{ padding: '16px', fontSize: '18px', borderRadius: '12px', border: '2px solid #e5e5e5', outline: 'none', textAlign: 'center', fontWeight: 600 }}
            />
            <button
              type="submit"
              style={{ padding: '18px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#fff', fontSize: '20px', fontWeight: 800, border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(255,140,0,0.2)' }}
            >
              دخول التحدي ⚡
            </button>
          </form>
        </div>
      )}

      {/* ═══ PLEDGE PHASE ═══ */}
      {phase === 'pledge' && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'linear-gradient(135deg, #171717 0%, #333 100%)', borderRadius: '24px', color: '#fff' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🤝</div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            تعهد العيدية
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '32px', opacity: 0.9 }}>
            يا <strong>{playerName}</strong>، أتعهد - بروح الطرافة - أن لا أستعين بصديق ولا ببحث جوجل 😂<br />
            الفوز بشرف أو الخسارة بشرف!
          </p>
          <button
            onClick={() => setPhase('playing')}
            style={{ padding: '16px 48px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms ease', boxShadow: '0 8px 16px rgba(255, 140, 0, 0.4)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            أنا جاهز ومستعد ⚔️
          </button>
        </div>
      )}

      {/* ═══ PLAYING PHASE ═══ */}
      {phase === 'playing' && currentQuestionItem && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '100px', border: '1px solid #e5e5e5', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BsCoin color="#FF8C00" size={18} /> الـعـيـديـة: {totalEarned} {currency}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#737373' }}>
              سؤال {currentQ + 1} من {totalQuestions}
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #FFD700, #FF8C00)', transition: 'width 300ms ease' }} />
          </div>

          {/* Question Card */}
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: '#fff7ed', color: '#c2410c', borderRadius: '100px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              قيمة السؤال: {currentQuestionItem.rewardAmount} {currency}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#171717', lineHeight: 1.6 }}>
              {currentQuestionItem.questionText || currentQuestionItem.question}
            </h2>
          </div>

          {/* Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestionItem.answers.map((answer, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectAnswer = showFeedback && idx === correctIndex;
              const isWrongSelected = showFeedback && isSelected && idx !== correctIndex;

              let buttonStyle = {
                padding: '20px 24px',
                background: '#fff',
                border: '2px solid #e5e5e5',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textAlign: 'right',
                color: '#171717'
              }

              if (showFeedback) {
                buttonStyle.cursor = 'default';
                if (isCorrectAnswer) {
                  buttonStyle.background = '#dcfce7';
                  buttonStyle.borderColor = '#22c55e';
                  buttonStyle.color = '#166534';
                } else if (isWrongSelected) {
                  buttonStyle.background = '#fee2e2';
                  buttonStyle.borderColor = '#ef4444';
                  buttonStyle.color = '#991b1b';
                } else if (!isSelected) {
                  buttonStyle.opacity = 0.5;
                }
              } else if (isSelected) {
                buttonStyle.background = '#fff7ed';
                buttonStyle.borderColor = '#FF8C00';
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

          {/* Feedback Action */}
          {showFeedback && (
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button
                onClick={nextQuestion}
                style={{ padding: '16px 48px', background: '#171717', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
              >
                {currentQ < totalQuestions - 1 ? 'السؤال التالي ←' : 'عرض النتيجة النهائية 🎉'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ RESULT PHASE ═══ */}
      {phase === 'result' && (
        <div style={{ textAlign: 'center', padding: '40px 24px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>{totalEarned > 0 ? '🤑' : '😅'}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: '#171717' }}>
            انتهى التحدي يا {playerName}!
          </h1>
          <p style={{ fontSize: '18px', color: '#737373', marginBottom: '32px' }}>
            جمعت عيدية محترمة، لا تنسى تطالب بها 😎
          </p>

          <div style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', borderRadius: '24px', marginBottom: '32px', color: '#fff', boxShadow: '0 10px 30px rgba(255, 140, 0, 0.3)' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>إجمالي عيديتك المستحقة</div>
            <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1 }}>{totalEarned}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>{currency}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>{score}</div>
              <div style={{ fontSize: '14px', color: '#737373', fontWeight: 600 }}>إجابات صحيحة</div>
            </div>
            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginBottom: '4px' }}>{totalQuestions - score}</div>
              <div style={{ fontSize: '14px', color: '#737373', fontWeight: 600 }}>إجابات خاطئة</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate(`/game/${gameId}/leaderboard`)}
              disabled={submittingResult}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: '#171717', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 700, cursor: submittingResult ? 'not-allowed' : 'pointer' }}
            >
              <BsTrophy size={20} />
              {submittingResult ? 'جاري حفظ ترتيبك...' : 'لوحة الصدارة (الترتيب)'}
            </button>

            <button
              onClick={shareOnWhatsApp}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
            >
              <BsWhatsapp size={20} />
              أرسل النتيجة لـ {gameData.ownerName}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}