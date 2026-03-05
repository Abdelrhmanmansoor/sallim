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

const resourceLinks = [
  { to: '/',        label: 'الصفحة الرئيسية' },
  { to: '/pricing', label: 'الباقات' },
  { to: '/send',    label: 'طرق الإرسال' },
  { to: '/texts',   label: 'مكتبة العبارات' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1B3F9B] rounded-t-[2rem] mt-0">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <img src="/images/logo.png" alt="سَلِّم" className="h-10 w-auto brightness-[10]" />
            </div>
            <p className="text-white/60 text-sm leading-[1.9] max-w-xs mb-6">
              منصة احترافية لتصميم وإرسال بطاقات تهنئة العيد.
              صمّم بطاقتك في ثوانٍ وشاركها مع من تحب.
            </p>
            <Link to="/editor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/15 transition-all">
              ابدأ التصميم
            </Link>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-5">خدمات المنصة</h4>
            <div className="flex flex-col gap-3">
              {platformLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/70 text-sm hover:text-white transition-colors w-fit">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-5">روابط سريعة</h4>
            <div className="flex flex-col gap-3">
              {resourceLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/70 text-sm hover:text-white transition-colors w-fit">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-white/40 text-[11px] font-bold tracking-wider uppercase mb-5">للشركات والإدارة</h4>
            <div className="flex flex-col gap-3 mb-6">
              {adminLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/70 text-sm hover:text-white transition-colors w-fit">{l.label}</Link>
              ))}
            </div>
            <Link to="/business" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white/80 text-xs font-bold hover:bg-white/10 transition-all w-full">
              اطلب باقة شركة
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة</p>
            <p className="text-white/30 text-xs">تابع لمؤسسة سليمان</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
