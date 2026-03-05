import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { BsMoonStars } from 'react-icons/bs'

const navLinks = [
  { path: '/', label: 'الرئيسية' },
  { path: '/editor', label: 'محرر البطاقات' },
  { path: '/texts', label: 'بنك النصوص' },
  { path: '/send', label: 'الإرسال' },
  { path: '/pricing', label: 'الأسعار' },
  { path: '/dashboard', label: 'لوحة التحكم' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/images/logo-suliman.png" alt="سَلِّم" className="h-8 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
            <span className="text-xl font-bold gradient-gold-text font-cairo hidden">
              سَلِّم
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/editor"
              className="px-5 py-2 rounded-full gradient-gold text-gray-900 font-bold text-sm hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300 animate-pulse-gold"
            >
              أنشئ بطاقتك
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/editor"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-5 py-3 rounded-full gradient-gold text-gray-900 font-bold text-sm text-center"
              >
                أنشئ بطاقتك مجاناً
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
