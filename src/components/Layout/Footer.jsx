import { Link } from 'react-router-dom'

const platformLinks = [
  { to: '/editor',  label: 'المحرر' },
  { to: '/texts',   label: 'النصوص' },
  { to: '/send',    label: 'الإرسال' },
  { to: '/pricing', label: 'الأسعار' },
]

const resourceLinks = [
  { to: '/',        label: 'الصفحة الرئيسية' },
  { to: '/pricing', label: 'الباقات' },
  { to: '/send',    label: 'طرق الإرسال' },
  { to: '/texts',   label: 'مكتبة العبارات' },
]

const LanternSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="0" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8 Q8 14 8 22 L8 55 Q8 62 14 65 L20 67 L26 65 Q32 62 32 55 L32 22 Q32 14 28 8 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <path d="M20 8 L14 12 L8 22" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    <path d="M20 8 L26 12 L32 22" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    <ellipse cx="20" cy="38" rx="5" ry="5" fill="currentColor" opacity="0.35"/>
    <path d="M13 22 Q20 28 27 22" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M13 48 Q20 54 27 48" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M14 65 Q20 72 26 65" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    <line x1="20" y1="67" x2="20" y2="75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

const CrescentStarSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 5 C18 5 9 14 9 26 C9 38 18 47 30 47 C22 47 16 36 18 26 C20 16 28 10 38 10 C35 7 32.5 5 30 5Z" fill="currentColor" opacity="0.9"/>
    <polygon points="46,8 47.8,14 54,14 49,18 51,24 46,20 41,24 43,18 38,14 44.2,14" fill="currentColor" opacity="0.85"/>
  </svg>
)

const StarSVG = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 14.4,9.2 22,9.2 16,13.8 18.4,21 12,16.4 5.6,21 8,13.8 2,9.2 9.6,9.2"/>
  </svg>
)

const stars = [
  { top: '12%', right: '22%', size: 'w-3 h-3',    delay: '0s'   },
  { top: '8%',  left: '35%',  size: 'w-2 h-2',    delay: '1.2s' },
  { top: '20%', left: '18%',  size: 'w-2.5 h-2.5',delay: '0.6s' },
  { top: '5%',  right: '45%', size: 'w-1.5 h-1.5',delay: '2s'   },
  { top: '15%', right: '60%', size: 'w-2 h-2',    delay: '1.8s' },
  { top: '30%', right: '10%', size: 'w-2 h-2',    delay: '0.4s' },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#0d1f5c] rounded-t-[2.5rem] mt-0 overflow-hidden">

      {/* Deep background gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 0%, rgba(100,130,255,0.14) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(80,50,200,0.10) 0%, transparent 55%)'
      }} />

      {/* Crescent glow blobs */}
      <div className="footer-crescent-glow absolute -top-16 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(198,248,6,0.20) 0%, transparent 70%)' }} />
      <div className="footer-crescent-glow absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(93,93,255,0.14) 0%, transparent 70%)', animationDelay: '3s' }} />

      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] pointer-events-none" style={{
        background: 'linear-gradient(to right, transparent, rgba(198,248,6,0.45), rgba(255,255,255,0.22), rgba(198,248,6,0.45), transparent)'
      }} />

      {/* Floating lanterns */}
      <div className="footer-lantern absolute top-8 right-8 text-[#C6F806]/25 pointer-events-none">
        <LanternSVG className="w-8 h-16" />
      </div>
      <div className="footer-lantern-delayed absolute top-6 left-10 text-[#C6F806]/18 pointer-events-none">
        <LanternSVG className="w-6 h-12" />
      </div>
      <div className="footer-lantern absolute top-4 left-1/3 text-white/8 pointer-events-none" style={{ animationDuration: '7s', animationDelay: '2s' }}>
        <LanternSVG className="w-5 h-10" />
      </div>

      {/* Twinkling stars */}
      {stars.map((s, i) => (
        <StarSVG key={i}
          className={`footer-star absolute ${s.size} text-[#C6F806] pointer-events-none`}
          style={{ top: s.top, right: s.right, left: s.left, animationDelay: s.delay }}
        />
      ))}

      {/* Crescent watermarks */}
      <div className="footer-arabesque absolute bottom-8 left-6 text-white pointer-events-none">
        <CrescentStarSVG className="w-20 h-20 opacity-[0.05]" />
      </div>
      <div className="footer-arabesque absolute -top-2 right-1/4 text-[#C6F806] pointer-events-none" style={{ animationDelay: '4s' }}>
        <CrescentStarSVG className="w-14 h-14 opacity-[0.04]" />
      </div>

      {/* Ornamental dots */}
      <div className="absolute top-0 inset-x-0 flex justify-center gap-6 pt-3 pointer-events-none opacity-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-[#C6F806]" style={{ opacity: i % 2 === 0 ? 0.8 : 0.4 }} />
        ))}
      </div>

      {/* Main content */}
      <div className="container-main relative z-10 pt-16 pb-10">

        {/* Brand centered */}
        <div className="text-center mb-12">
          <img src="/images/logo.png" alt="سَلِّم" className="h-12 w-auto mx-auto mb-5 brightness-[10]" />
          <p className="text-white/45 text-sm leading-[2] max-w-xs mx-auto">
            منصة عربية لتصميم بطاقات تهنئة العيد وإرسالها مباشرة.
            صمّد بطاقتك في ثوانٍ وشاركها مع من تحب.
          </p>
          <div className="mt-6 inline-flex items-center gap-3">
            <Link to="/editor" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C6F806] text-[#0d1f5c] text-sm font-black hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(198,248,6,0.25)]">
              ابدأ التصميم
            </Link>
            <Link to="/texts" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/12 text-white text-sm font-semibold hover:bg-white/8 transition-all">
              مكتبة العبارات
            </Link>
          </div>
        </div>

        {/* Divider with ornament */}
        <div className="relative mb-12">
          <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)' }} />
          <div className="relative flex justify-center">
            <span className="bg-[#0d1f5c] px-4 text-[#C6F806]/40 text-xl">✦</span>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-10 max-w-sm mx-auto mb-12">
          <div>
            <h4 className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-5">خدمات المنصة</h4>
            <div className="flex flex-col gap-3.5">
              {platformLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/55 text-sm hover:text-[#C6F806] transition-colors duration-200 w-fit group flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C6F806]/35 group-hover:bg-[#C6F806] transition-colors shrink-0" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-5">روابط سريعة</h4>
            <div className="flex flex-col gap-3.5">
              {resourceLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-white/55 text-sm hover:text-[#C6F806] transition-colors duration-200 w-fit group flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C6F806]/35 group-hover:bg-[#C6F806] transition-colors shrink-0" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.07]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-2 text-[#C6F806]/30 text-xs">
              <CrescentStarSVG className="w-4 h-4" />
              <span>تابع لمؤسسة سليمان</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}