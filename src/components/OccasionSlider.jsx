import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Baby, 
  PartyPopper, 
  Briefcase, 
  Star, 
  Cloud, 
  Mail, 
  Trophy,
  ArrowLeft
} from 'lucide-react'

const categories = [
  { id: 1, name: 'بطاقات العيد', icon: Sparkles, color: '#0d9488', bg: '#f0fdfa' },
  { id: 2, name: 'بطاقات الزفاف', icon: Heart, color: '#be185d', bg: '#fdf2f8' },
  { id: 3, name: 'بطاقات التخرج', icon: GraduationCap, color: '#4338ca', bg: '#eef2ff' },
  { id: 4, name: 'بطاقات المواليد', icon: Baby, color: '#15803d', bg: '#f0fdf4' },
  { id: 5, name: 'بطاقات حفلات الأطفال', icon: PartyPopper, color: '#b45309', bg: '#fffbeb' },
  { id: 6, name: 'بطاقات افتتاح المشاريع', icon: Briefcase, color: '#1d4ed8', bg: '#eff6ff' },
  { id: 7, name: 'بطاقات الشكر', icon: Star, color: '#a21caf', bg: '#fdf4ff' },
  { id: 8, name: 'بطاقات العزاء', icon: Cloud, color: '#334155', bg: '#f8fafc' },
  { id: 9, name: 'بطاقات دعوات المناسبات', icon: Mail, color: '#0369a1', bg: '#f0f9ff' },
  { id: 10, name: 'بطاقات النجاح والإنجاز', icon: Trophy, color: '#ea580c', bg: '#fff7ed' },
]

export default function OccasionSlider() {
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(Math.abs(scrollLeft) > 10)
      setShowRightArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10)
      
      const progress = (Math.abs(scrollLeft) / (scrollWidth - clientWidth)) * 100
      setScrollProgress(progress)
    }
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Drag handlers
  const onMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll)
      handleScroll()
      return () => el.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section style={{ padding: '80px 0', background: '#fff', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: 'clamp(32px, 5vw, 48px)', 
            fontWeight: 800, 
            color: '#171717', 
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            fontFamily: "'Tajawal', sans-serif"
          }}>
            بطاقات مناسبات مميزة
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#737373', 
            maxWidth: '600px', 
            margin: '0 auto', 
            lineHeight: 1.6,
            fontFamily: "'Tajawal', sans-serif"
          }}>
            اختر مكتبة تصاميمنا الفاخرة لكل مناسباتك، صممها في ثوانٍ وشاركها بكل حب
          </p>
        </div>

        {/* Slider Container */}
        <div style={{ position: 'relative' }}>
          
          {/* Arrows */}
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              className="slider-arrow"
            >
              <ChevronRight size={24} color="#171717" />
            </button>
          )}

          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              className="slider-arrow"
            >
              <ChevronLeft size={24} color="#171717" />
            </button>
          )}

          {/* Cards Wrapper */}
          <div 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              padding: '20px 4px 40px',
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            className="hide-scrollbar"
          >
            {categories.map((cat, idx) => (
              <div 
                key={cat.id}
                style={{
                  flex: 'none',
                  width: idx === 0 ? '340px' : '300px', // First card is larger
                  scrollSnapAlign: 'start',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Link 
                  to="/editor"
                  className="occasion-card-link"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                    borderRadius: '32px',
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Icon Background */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    transition: 'all 0.3s ease',
                  }} className="icon-container">
                    <cat.icon size={36} color={cat.color} strokeWidth={1.5} />
                  </div>

                  <h3 style={{ 
                    fontSize: '22px', 
                    fontWeight: 700, 
                    color: '#171717', 
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {cat.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '100px',
                    background: '#f8fafc',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }} className="browse-btn">
                    استعرض
                    <ArrowLeft size={16} />
                  </div>

                  {/* Aesthetic patterns (subtle) */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '60px',
                    height: '60px',
                    background: cat.color,
                    opacity: 0.03,
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }} />
                </Link>
              </div>
            ))}
          </div>

          {/* Dots / Progress Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px', 
            marginTop: '20px' 
          }}>
            {categories.map((_, idx) => {
              // Calculate dot opacity based on scroll progress
              const itemsCount = categories.length
              const threshold = (idx / (itemsCount - 1)) * 100
              const isActive = Math.abs(scrollProgress - threshold) < (100 / itemsCount)
              
              return (
                <div 
                  key={idx}
                  style={{
                    width: isActive ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '100px',
                    background: isActive ? '#171717' : '#e5e5e5',
                    transition: 'all 0.3s ease',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .occasion-card-link:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border-color: #e5e5e5;
        }

        .occasion-card-link:hover .icon-container {
          transform: translateY(-8px);
        }

        .occasion-card-link:hover .browse-btn {
          background: #171717;
          color: #fff;
        }

        .slider-arrow:hover {
          background: #171717 !important;
          border-color: #171717 !important;
        }
        
        .slider-arrow:hover svg {
          color: #fff !important;
        }

        @media (max-width: 768px) {
          .slider-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
