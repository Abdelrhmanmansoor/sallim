import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'

const links = [
  { path: '/', label: 'الرئيسية' },
  { path: '/editor', label: 'المحرر' },
  { path: '/texts', label: 'النصوص' },
  { path: '/send', label: 'الإرسال' },
  { path: '/pricing', label: 'الأسعار' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#08090d]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold gradient-gold-text">سَلِّم</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-[13px] transition-colors duration-200 ${
                pathname === l.path ? 'text-gold-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/admin" className="text-gray-600 text-[13px] hover:text-gray-400 transition-colors">
            لوحة التحكم
          </Link>
          <Link
            to="/editor"
            className="px-5 py-2 rounded-full bg-gold-500 text-[#08090d] text-[13px] font-bold hover:bg-gold-400 transition-colors"
          >
            ابدأ التصميم
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-500 p-2">
          {open ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.04] bg-[#08090d]/95 backdrop-blur-xl px-4 pb-5">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm ${pathname === l.path ? 'text-gold-400' : 'text-gray-500'}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
            <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-600">
              لوحة التحكم
            </Link>
            <Link
              to="/editor"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-center rounded-full bg-gold-500 text-[#08090d] font-bold"
            >
              ابدأ التصميم
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
