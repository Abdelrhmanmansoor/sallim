import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const platformLinks = [
  { to: '/editor',  label: 'المحرر' },
  { to: '/texts',   label: 'النصوص' },
  { to: '/send',    label: 'الإرسال' },
  { to: '/pricing', label: 'الأسعار' },
]

const adminLinks = [
  { to: '/admin',     label: 'لوحة التحكم' },
  { to: '/dashboard', label: 'الشركات' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.03] mt-16">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-400" strokeWidth={1.5} />
              </div>
              <span className="text-[17px] font-bold gradient-gold-text">سَلِّم</span>
            </div>
            <p className="text-white/25 text-sm leading-[1.8] max-w-xs">
              منصة احترافية لتصميم وإرسال بطاقات تهنئة العيد.
              صمّم بطاقتك في ثوانٍ وشاركها مع من تحب.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white/50 text-[11px] font-bold tracking-wider uppercase mb-5">المنصة</h4>
            <div className="flex flex-col gap-3">
              {platformLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/25 text-sm hover:text-white/50 transition-colors w-fit">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-white/50 text-[11px] font-bold tracking-wider uppercase mb-5">إدارة</h4>
            <div className="flex flex-col gap-3">
              {adminLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/25 text-sm hover:text-white/50 transition-colors w-fit">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-xs">© {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة</p>
          <p className="text-white/15 text-xs">تابع لمؤسسة سليمان</p>
        </div>
      </div>
    </footer>
  )
}
