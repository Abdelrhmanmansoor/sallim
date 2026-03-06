import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'

const links = [
  { path: '/', label: 'الرئيسية' },
  { path: '/editor', label: 'المحرر' },
  { path: '/texts', label: 'النصوص' },
  { path: '/send', label: 'الإرسال' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isHero = pathname === '/' && !scrolled

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s',
        fontFamily: "'Tajawal', sans-serif",
        background: isHero ? 'transparent' : 'rgba(255,255,255,0.97)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #f1f5f9' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.04)' : 'none',
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="سَلِّم" style={{ height: '40px', width: 'auto' }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
            {links.map(l => (
              <Link key={l.path} to={l.path}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  color: pathname === l.path
                    ? (isHero ? '#2dd4bf' : '#0f172a')
                    : (isHero ? 'rgba(255,255,255,0.6)' : '#64748b'),
                  background: pathname === l.path
                    ? (isHero ? 'rgba(45,212,191,0.1)' : '#f0fdfa')
                    : 'transparent',
                  border: pathname === l.path
                    ? (isHero ? '1px solid rgba(45,212,191,0.2)' : '1px solid #99f6e4')
                    : '1px solid transparent',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
            <Link to="/editor" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px', borderRadius: '9999px',
              background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
              color: '#020617', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              <Sparkles style={{ width: '14px', height: '14px' }} />
              ابدأ التصميم
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            style={{
              width: '40px', height: '40px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid ' + (isHero ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
              background: isHero ? 'rgba(255,255,255,0.05)' : '#fafbfc',
              color: isHero ? '#fff' : '#0f172a',
              cursor: 'pointer',
            }}
          >
            {open ? <X style={{ width: '16px', height: '16px' }} /> : <Menu style={{ width: '16px', height: '16px' }} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} className="md:hidden">
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', top: '72px', left: 0, right: 0,
            background: '#ffffff', borderTop: '1px solid #f1f5f9',
            padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            fontFamily: "'Tajawal', sans-serif",
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setOpen(false)}
                  style={{
                    padding: '14px 16px', borderRadius: '14px', fontSize: '15px',
                    fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                    color: pathname === l.path ? '#0f172a' : '#64748b',
                    background: pathname === l.path ? '#f0fdfa' : 'transparent',
                    border: pathname === l.path ? '1px solid #99f6e4' : '1px solid transparent',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <Link to="/editor" onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px', borderRadius: '14px', width: '100%',
                  background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
                  color: '#020617', fontSize: '15px', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                ابدأ التصميم
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
