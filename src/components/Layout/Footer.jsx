import { Link } from 'react-router-dom'

const platformLinks = [
  { to: '/editor',  label: 'المحرر' },
  { to: '/texts',   label: 'النصوص' },
  { to: '/send',    label: 'الإرسال' },
  { to: '/pricing', label: 'الأسعار' },
]

const adminLinks = [
  { to: '/admin',     label: 'لوحة التحكم' },
  { to: '/business',  label: 'بوابة الشركات' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.03] mt-16">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="سَلِّم" className="h-10 w-auto" />
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

        {/* Bottom — Gold Bar */}
        <div className="mt-16 pt-6 border-t border-[#d4b96b]/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#d4b96b] rounded-xl px-6 py-4">
            <p className="text-[#060709] text-xs font-bold">© {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة</p>
            <p className="text-[#060709]/70 text-xs">تابع لمؤسسة سليمان</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
