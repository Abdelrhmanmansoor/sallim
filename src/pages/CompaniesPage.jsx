import { useState, useEffect } from 'react'
import { Building2, Users, TrendingUp, ArrowRight, Shield, Mail, Phone, Clock, Zap, ShieldCheck, CreditCard, BarChart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = [
    { icon: <Building2 className="w-6 h-6" />, label: 'الشركات المسجلة', value: '150+', color: 'from-amber-500 to-amber-600' },
    { icon: <Users className="w-6 h-6" />, label: 'المستخدمين النشطين', value: '5,000+', color: 'from-amber-600 to-amber-700' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'البطاقات المُنشأة', value: '50,000+', color: 'from-amber-700 to-amber-800' },
  ]

  const features = [
    {
      title: 'تخصيص الهوية البصرية',
      description: 'ألوان وخطوط خاصة بشركتك تطبق تلقائياً على جميع البطاقات',
      icon: <Building2 className="w-8 h-8" />,
    },
    {
      title: 'إدارة الفريق',
      description: 'دعوة موظفين بصلاحيات متعددة: مدير، محرر، مشاهد',
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: 'الحملات الجماعية',
      description: 'إرسال آلاف البطاقات عبر WhatsApp في حملة واحدة',
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      title: 'المحفظة الذكية',
      description: 'نظام رصيد مالي للشركة مع سجل معاملات كامل',
      icon: <CreditCard className="w-8 h-8" />,
    },
    {
      title: 'تحليلات الأداء',
      description: 'تتبع المشاهدات والتفاعل مع بطاقات شركتك',
      icon: <BarChart className="w-8 h-8" />,
    },
    {
      title: 'الأمان العالي',
      description: 'تشفير كامل، سجل مراقبة، وصلاحيات محددة',
      icon: <ShieldCheck className="w-8 h-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium text-sm">للشركات والمؤسسات</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              منصة سَلِّم
              <span className="block bg-gradient-to-l from-amber-400 to-amber-500 bg-clip-text text-transparent mt-3">
                للمؤسسات
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              نظام متكامل لإنشاء بطاقات التهنئة المخصصة للشركات
              <br className="hidden sm:block" />
              مع إدارة فريق متقدمة، حملات إرسال، وتحليلات أداء مفصلة
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user?.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-base hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
                >
                  لوحة التحكم
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/company-login')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-base hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
                  >
                    دخول المؤسسات
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="mailto:support@sallim.co"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium text-base hover:bg-white/20 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    تواصل معنا
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            مميزات النظام المؤسسي
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            نظام متكامل لاحتياجات الشركات الكبيرة والمتوسطة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            جاهز للبدء؟
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            تواصل معنا للحصول على كود الاشتراك وابدأ في إنشاء بطاقات احترافية لشركتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@sallim.co"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-base hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              اطلب كود الاشتراك
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="tel:+966500000000"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium text-base hover:bg-white/20 transition-all"
            >
              <Phone className="w-5 h-5" />
              اتصل بنا
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">الدعم الفني</h4>
                <p className="text-gray-600 text-sm">متاح 24/7 لمساعدتك في أي وقت</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">تنفيذ سريع</h4>
                <p className="text-gray-600 text-sm">ابدأ باستخدام النظام خلال دقائق</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">أمان مضمون</h4>
                <p className="text-gray-600 text-sm">حماية كاملة لبيانات شركتك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}