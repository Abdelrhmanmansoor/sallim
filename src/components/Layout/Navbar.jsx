import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'

const links = [
  { path: '/',        label: 'الرئيسية' },
  { path: '/editor',  label: 'المحرر' },
  { path: '/texts',   label: 'النصوص' },
  { path: '/send',    label: 'الإرسال' },
  { path: '/pricing', label: 'الأسعار' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] shadow-sm'
          : 'bg-white/90 backdrop-blur-lg border-b border-transparent'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between relative">

          {/* Left side - empty on mobile for centering balance */}
          <div className="w-10 md:hidden" />

          {/* Logo - centered on mobile, left on desktop */}
          <Link to="/" className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:order-first">
            <img src="/images/logo.png" alt="سَلِّم" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 md:order-2">
            {links.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide border transition-all duration-300 ${
                  pathname === l.path
                    ? 'text-[#0F172A] bg-[#eff6ff] border-[#dbeafe]'
                    : 'text-[#475569] border-transparent hover:text-[#0F172A] hover:bg-[#f8fafc]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2.5 md:order-3">
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-[11px] font-bold text-[#1D4ED8]">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              تجربة فاخرة
            </span>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full text-[13px] border border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#BFDBFE] hover:bg-[#F8FAFC] transition-all"
            >
              التحكم
            </Link>
            <Link
              to="/editor"
              className="btn-gold !py-2.5 !px-6 !text-[13px] !rounded-full !gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ابدأ التصميم
            </Link>
          </div>

          {/* Mobile toggle - right side */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            aria-controls="mobile-main-menu"
            className="md:hidden w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] hover:text-[#0F172A] transition-colors order-last"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu as a dedicated layer to avoid overlap with page content */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-[#0F172A]/18 backdrop-blur-[2px]"
        />
        <div
          id="mobile-main-menu"
          className={`absolute top-[72px] inset-x-0 bottom-0 bg-white/98 backdrop-blur-xl border-t border-[#e2e8f0] px-5 py-5 overflow-y-auto shadow-lg transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-6'}`}
        >
          <div className="mb-4 rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-center text-xs font-semibold text-[#1d4ed8]">
            تنقل سريع وتجربة تصميم سلسة
          </div>

          <div className="space-y-2">
            {links.map(l => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3.5 rounded-2xl text-sm font-semibold transition-colors ${
                  pathname === l.path
                    ? 'text-[#0f172a] bg-[#eff6ff] border border-[#dbeafe]'
                    : 'text-[#475569] border border-transparent hover:text-[#0f172a] hover:bg-[#f8fafc]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-[#DBEAFE] space-y-2">
            <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-[#64748B] rounded-2xl border border-transparent hover:border-[#BFDBFE] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
              لوحة التحكم
            </Link>
            <Link
              to="/editor"
              onClick={() => setOpen(false)}
              className="btn-gold w-full !text-sm !py-3.5 !rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ابدأ التصميم
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
