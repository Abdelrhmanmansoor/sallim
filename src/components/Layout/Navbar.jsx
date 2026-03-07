import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowLeft, User, LogOut } from 'lucide-react'

const links = [
  { path: '/', label: 'الرئيسية' },
  { path: '/editor', label: 'المحرر' },
  { path: '/texts', label: 'النصوص' },
  { path: '/eidiya', label: 'العيدية' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isHome = pathname === '/'
  const showDark = isHome && !scrolled

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'Tajawal', sans-serif",
          background: scrolled ? 'rgba(255,255,255,0.98)' : (showDark ? 'transparent' : '#fff'),
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #f0f0f0' : 'none',
          transition: 'all 200ms ease',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/logo.png"
              alt="سَلِّم"
              style={{
                height: '36px',
                width: 'auto',
                filter: showDark ? 'brightness(10)' : 'none',
                transition: 'filter 200ms ease',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden lg:flex"
            style={{ alignItems: 'center', gap: '8px' }}
          >
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: pathname === l.path ? 600 : 500,
                  textDecoration: 'none',
                  color: pathname === l.path
                    ? (showDark ? '#fff' : '#171717')
                    : (showDark ? 'rgba(255,255,255,0.7)' : '#737373'),
                  borderRadius: '8px',
                  background: pathname === l.path
                    ? (showDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5')
                    : 'transparent',
                  transition: 'all 150ms ease',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '12px' }}>
            {user ? (
              <>
                <Link
                  to="/dashboard/diwaniya"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0c0c0c',
                    background: 'linear-gradient(135deg, #C5A75F, #a8893d)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(197,167,95,0.3)',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(197,167,95,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(197,167,95,0.3)'
                  }}
                >
                  ديوانية العيد
                  <span style={{ fontSize: '16px' }}>✨</span>
                </Link>

                {/* User Avatar & Profile Link */}
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: showDark ? '#171717' : '#fff',
                    background: showDark ? '#fff' : '#171717',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 200ms ease',
                  }}
                >
                  <img
                    src={user.avatar || '/images/logo.png'}
                    alt={user.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      background: '#f5f5f5',
                    }}
                  />
                  <span>{user.name}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ef4444',
                    background: 'transparent',
                    border: '2px solid #ef4444',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fef2f2'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                  }}
                >
                  خروج
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: showDark ? '#fff' : '#171717',
                    background: 'transparent',
                    border: '2px solid ' + (showDark ? '#fff' : '#171717'),
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 200ms ease',
                  }}
                >
                  دخول
                </Link>
                <Link
                  to="/create-diwaniya"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0c0c0c',
                    background: 'linear-gradient(135deg, #C5A75F, #a8893d)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(197,167,95,0.3)',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(197,167,95,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(197,167,95,0.3)'
                  }}
                >
                  ديوانية العيد
                  <span style={{ fontSize: '16px' }}>✨</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'إغلاق' : 'القائمة'}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: showDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
              border: 'none',
              borderRadius: '10px',
              color: showDark ? '#fff' : '#171717',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          className="lg:hidden"
        >
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Menu Panel */}
          <div
            style={{
              position: 'absolute',
              top: '64px',
              left: 0,
              right: 0,
              background: '#fff',
              padding: '16px',
              borderTop: '1px solid #f0f0f0',
              fontFamily: "'Tajawal', sans-serif",
              animation: 'slideDown 200ms ease',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {links.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontWeight: pathname === l.path ? 600 : 500,
                    color: pathname === l.path ? '#171717' : '#525252',
                    background: pathname === l.path ? '#f5f5f5' : 'transparent',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to={user ? "/dashboard/diwaniya" : "/create-diwaniya"}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0c0c0c',
                  background: 'linear-gradient(135deg, #C5A75F, #a8893d)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                ديوانية العيد
                <span style={{ fontSize: '16px' }}>✨</span>
              </Link>
              <Link
                to="/editor"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#171717',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                ابدأ التصميم
                <ArrowLeft size={16} />
              </Link>

              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#171717',
                    background: 'transparent',
                    border: '1px solid #171717',
                    borderRadius: '12px',
                    textDecoration: 'none',
                  }}
                >
                  دخول
                </Link>
              ) : (
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#ef4444',
                    background: '#fef2f2',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  خروج
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
