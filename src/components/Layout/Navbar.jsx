import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#060709]/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="سَلِّم" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                pathname === l.path
                  ? 'text-gold-400 bg-gold-500/[0.06]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg text-[13px] text-white/30 hover:text-white/50 hover:bg-white/[0.02] transition-all"
          >
            التحكم
          </Link>
          <Link
            to="/editor"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-gold-600 to-gold-500 text-[#060709] text-[13px] font-bold hover:from-gold-500 hover:to-gold-400 transition-all shadow-sm shadow-gold-500/10"
          >
            ابدأ التصميم
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/50 hover:text-white/70 transition-colors"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#060709]/95 backdrop-blur-2xl border-t border-white/[0.04] px-5 py-4 space-y-1">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm transition-colors ${
                pathname === l.path
                  ? 'text-gold-400 bg-gold-500/[0.06]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/[0.04] space-y-2">
            <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-white/30 rounded-xl hover:bg-white/[0.02]">
              لوحة التحكم
            </Link>
            <Link
              to="/editor"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-center rounded-xl bg-gradient-to-l from-gold-600 to-gold-500 text-[#060709] font-bold"
            >
              ابدأ التصميم
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
