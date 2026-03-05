import { Link } from 'react-router-dom'
import { FaTwitter, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa'
import { BsMoonStars } from 'react-icons/bs'

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Gold top accent line */}
      <div className="h-px bg-gradient-to-l from-transparent via-gold-500/50 to-transparent"></div>
      
      <div className="bg-[#08090d]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/images/logo-suliman.png" 
                  alt="سَلِّم" 
                  className="h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="items-center gap-2 hidden">
                  <BsMoonStars className="text-2xl text-gold-500" />
                  <span className="text-2xl font-black gradient-gold-text font-cairo">سَلِّم</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                منصة سعودية احترافية لإنشاء وإرسال بطاقات تهنئة العيد بتصاميم فاخرة وخطوط عربية أصيلة.
              </p>
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-gold-300 text-xs font-medium">متاح الآن — مجاني بدون تسجيل</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-gold-400 font-bold mb-5 text-sm flex items-center gap-2">
                <div className="w-1 h-4 rounded-full gradient-gold"></div>
                المنصة
              </h4>
              <div className="flex flex-col gap-3">
                <Link to="/editor" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">محرر البطاقات</Link>
                <Link to="/texts" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">بنك النصوص</Link>
                <Link to="/send" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">إرسال البطاقات</Link>
                <Link to="/pricing" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">الباقات والأسعار</Link>
              </div>
            </div>

            <div>
              <h4 className="text-gold-400 font-bold mb-5 text-sm flex items-center gap-2">
                <div className="w-1 h-4 rounded-full gradient-gold"></div>
                للشركات
              </h4>
              <div className="flex flex-col gap-3">
                <Link to="/dashboard" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">لوحة التحكم</Link>
                <Link to="/pricing" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">وايت لابل</Link>
                <Link to="/pricing" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">API للموزعين</Link>
                <a href="#" className="text-gray-400 hover:text-gold-300 text-sm transition-colors hover:translate-x-1 inline-flex">الدعم الفني</a>
              </div>
            </div>

            <div>
              <h4 className="text-gold-400 font-bold mb-5 text-sm flex items-center gap-2">
                <div className="w-1 h-4 rounded-full gradient-gold"></div>
                تابعنا
              </h4>
              <div className="flex gap-2 mb-5">
                {[
                  { icon: <FaTwitter />, label: 'تويتر', color: 'hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30' },
                  { icon: <FaInstagram />, label: 'انستقرام', color: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30' },
                  { icon: <FaWhatsapp />, label: 'واتساب', color: 'hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30' },
                  { icon: <FaTiktok />, label: 'تيكتوك', color: 'hover:bg-white/10 hover:text-white hover:border-white/30' },
                ].map((s, i) => (
                  <a key={i} href="#" aria-label={s.label} className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${s.color}`}>
                    {s.icon}
                  </a>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">الدعم الفني</p>
                <p className="text-gray-500 text-xs">التفعيل يدوي خلال 24 ساعة</p>
                <p className="text-gray-500 text-xs">الدفع عبر ويسترن يونيون / تحويل بنكي</p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gradient-to-l from-transparent via-white/10 to-transparent mt-12 mb-8"></div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} سَلِّم. جميع الحقوق محفوظة.
              </p>
              <span className="hidden sm:block text-gray-700">|</span>
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-suliman.png" 
                  alt="مؤسسة سليمان" 
                  className="h-5 object-contain opacity-70"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <p className="text-gold-500/70 text-xs font-medium">
                  تابع لمؤسسة سليمان
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-xs">
              صُنع بعناية في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
