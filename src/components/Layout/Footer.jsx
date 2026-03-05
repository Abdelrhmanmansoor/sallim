import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] mt-20">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold gradient-gold-text">سَلِّم</span>
            <p className="text-gray-700 text-sm mt-3 max-w-[240px] leading-relaxed">
              منصة احترافية لتصميم وإرسال بطاقات تهنئة العيد
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-[11px] font-semibold tracking-wide mb-1">المنصة</span>
              <Link to="/editor" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">المحرر</Link>
              <Link to="/texts" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">النصوص</Link>
              <Link to="/send" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">الإرسال</Link>
              <Link to="/pricing" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">الأسعار</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 text-[11px] font-semibold tracking-wide mb-1">إدارة</span>
              <Link to="/admin" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">لوحة التحكم</Link>
              <Link to="/dashboard" className="text-gray-700 text-sm hover:text-gray-400 transition-colors">الشركات</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-800 text-xs">© {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة</p>
          <p className="text-gray-800 text-xs">تابع لمؤسسة سليمان</p>
        </div>
      </div>
    </footer>
  )
}
