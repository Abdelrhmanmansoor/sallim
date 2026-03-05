import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsStars, BsPalette, BsSend, BsBuilding, BsDownload, BsWhatsapp, BsChevronDown, BsChevronUp, BsClock, BsCheckCircle, BsStar, BsStarFill, BsArrowLeft, BsEnvelope, BsPersonPlus } from 'react-icons/bs'
import { HiTemplate, HiDocumentText, HiShare } from 'react-icons/hi'
import { FaQuoteRight, FaPenFancy, FaFileDownload, FaMagic, FaFont } from 'react-icons/fa'
import { templates } from '../data/templates'

const features = [
  { icon: <HiTemplate className="text-3xl" />, title: 'قوالب احترافية فاخرة', desc: 'تصاميم حصرية مصممة يدوياً بعناية — كل قالب تحفة فنية تليق بالمناسبة', color: 'from-gold-500/20 to-gold-600/10' },
  { icon: <FaFont className="text-3xl" />, title: '8 مخطوطات عربية أصيلة', desc: 'أميري، شهرزاد، القاهرة، تجوّل — أجمل الخطوط العربية الأصيلة', color: 'from-emerald-500/20 to-emerald-600/10' },
  { icon: <HiDocumentText className="text-3xl" />, title: '100+ عبارة تهنئة', desc: 'عبارات رسمية وعائلية وتجارية وشعرية وخليجية — لكل مقام مقال', color: 'from-blue-500/20 to-blue-600/10' },
  { icon: <BsWhatsapp className="text-3xl" />, title: 'إرسال مباشر واتساب', desc: 'أرسل بطاقتك فردياً أو جماعياً لقائمة كاملة من جهات الاتصال', color: 'from-green-500/20 to-green-600/10' },
  { icon: <BsBuilding className="text-3xl" />, title: 'وايت لابل للشركات', desc: 'خصّص المنصة بالكامل بهوية شركتك — الشعار والألوان والنطاق', color: 'from-purple-500/20 to-purple-600/10' },
  { icon: <FaFileDownload className="text-3xl" />, title: 'تصدير بأعلى جودة', desc: 'PNG بدقة 1080×1080 بكسل + PDF جاهز للطباعة بجودة لا مثيل لها', color: 'from-rose-500/20 to-rose-600/10' },
]

const testimonials = [
  { name: 'أ. محمد العتيبي', role: 'مدير تسويق — الرياض', text: 'استخدمنا المنصة لإرسال تهاني العيد لـ 500 عميل. وفّرنا وقت وجهد كبير والنتيجة كانت ممتازة. التصاميم فاخرة جداً.', rating: 5, initial: 'م' },
  { name: 'سارة الأحمد', role: 'مصممة حرة — جدة', text: 'أرفع تصاميمي الخاصة وأرسلها لعملائي بسهولة. خطوة واحدة بدل ما أرسل كل واحد لحاله. المنصة عملية وسهلة.', rating: 5, initial: 'س' },
  { name: 'عبدالرحمن السبيعي', role: 'صاحب متجر — الدمام', text: 'الخطوط العربية تعطي البطاقة لمسة راقية. عملائي أعجبهم التصميم جداً. المخطوطات فخمة بشكل ملفت.', rating: 4, initial: 'ع' },
  { name: 'نورة القحطاني', role: 'مديرة علاقات عامة — الرياض', text: 'ميزة الوايت لابل ممتازة — قدرنا نرسل البطاقات بهوية شركتنا الكاملة. عملاءنا انبهروا بالجودة.', rating: 5, initial: 'ن' },
]

const faqs = [
  { q: 'هل المنصة مجانية؟', a: 'نعم، يمكنك تصميم وتحميل البطاقات مجاناً بدون تسجيل. الباقات المدفوعة تضيف ميزات متقدمة مثل الإرسال الجماعي وإزالة العلامة المائية والوايت لابل.' },
  { q: 'كيف أرفع تصاميمي الخاصة؟', a: 'من محرر البطاقات، اضغط على تبويب "القوالب" ثم ارفع صور PNG أو JPG خاصتك. القوالب المرفوعة تُحفظ محلياً في متصفحك.' },
  { q: 'هل يمكنني إرسال البطاقات لعدة أشخاص؟', a: 'نعم! من صفحة الإرسال، ارفع ملف CSV يحتوي أسماء وأرقام المستلمين ونرسل لهم تلقائياً عبر واتساب مع تخصيص اسم كل مستلم.' },
  { q: 'ما جودة البطاقات المُصدَّرة؟', a: 'البطاقات تُصدَّر بدقة 1080×1080 بكسل بصيغة PNG عالية الجودة، أو PDF جاهز للطباعة — مثالية للاستخدام الرقمي والطباعة.' },
  { q: 'هل يدعم الموقع الجوال؟', a: 'نعم، الموقع متجاوب بالكامل ومُحسّن لجميع الأجهزة — جوال، تابلت، وكمبيوتر. تقدر تصمم بطاقتك من أي مكان.' },
  { q: 'ما هو نظام الوايت لابل؟', a: 'يمكنك تخصيص المنصة بالكامل بشعار شركتك وألوانها ونطاقك الخاص، وتقديمها لعملائك كأنها منصتك الخاصة — مثالي لشركات العلاقات العامة والتسويق.' },
]

const stats = [
  { number: '20+', label: 'قالب فاخر', icon: <BsPalette className="text-2xl text-gold-400" /> },
  { number: '100+', label: 'عبارة تهنئة', icon: <FaPenFancy className="text-2xl text-gold-400" /> },
  { number: '8', label: 'مخطوطات عربية', icon: <FaFont className="text-xl text-gold-400" /> },
  { number: '1080px', label: 'جودة التصدير', icon: <BsDownload className="text-2xl text-gold-400" /> },
]

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-px w-16 bg-gradient-to-l from-gold-500/50 to-transparent"></div>
      <div className="w-2 h-2 rounded-full bg-gold-500/40"></div>
      <div className="h-px w-16 bg-gradient-to-r from-gold-500/50 to-transparent"></div>
    </div>
  )
}

function EidCountdown() {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const eidDate = new Date('2026-03-30T00:00:00+03:00')
    function calc() {
      const now = new Date()
      const diff = eidDate - now
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        passed: false,
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (timeLeft.passed) return (
    <div className="glass rounded-2xl p-8 text-center animate-glow border border-gold-500/20">
      <p className="text-4xl md:text-5xl font-black gradient-gold-text font-amiri mb-2">عيد مبارك!</p>
      <p className="text-gold-400/60 text-sm">تقبّل الله منّا ومنكم صالح الأعمال</p>
    </div>
  )

  return (
    <div className="flex gap-2 md:gap-3 justify-center" dir="ltr">
      {[
        { val: timeLeft.days, label: 'يوم' },
        { val: timeLeft.hours, label: 'ساعة' },
        { val: timeLeft.minutes, label: 'دقيقة' },
        { val: timeLeft.seconds, label: 'ثانية' },
      ].map((t, i) => (
        <div key={i} className="relative group">
          <div className="absolute inset-0 rounded-2xl bg-gold-500/20 blur-xl group-hover:bg-gold-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative glass rounded-2xl p-3 md:p-5 min-w-[65px] md:min-w-[90px] text-center border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 group-hover:transform group-hover:scale-105">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-2xl md:text-4xl font-black gradient-gold-text tabular-nums tracking-tight">{String(t.val ?? 0).padStart(2, '0')}</div>
              <div className="text-gold-400/60 text-[10px] md:text-xs mt-1 font-medium uppercase tracking-wider">{t.label}</div>
            </div>
          </div>
          {i < 3 && (
            <div className="absolute top-1/2 -right-1.5 md:-right-2.5 transform -translate-y-1/2 text-gold-400/30 text-lg md:text-xl font-light">:</div>
          )}
        </div>
      ))}
    </div>
  )
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'ring-1 ring-gold-500/20' : ''}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-right hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-gray-900 font-bold text-xs flex-shrink-0">{index + 1}</span>
          <span className="text-white font-bold text-sm">{q}</span>
        </div>
        {open ? <BsChevronUp className="text-gold-400 flex-shrink-0 mr-3" /> : <BsChevronDown className="text-gray-400 flex-shrink-0 mr-3" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 mr-11">
          {a}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION — Premium Luxury */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Layered background effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/3 rounded-full blur-[200px]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gold-500/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Ornamental corner decorations */}
        <div className="absolute top-24 right-8 w-16 h-16 border border-gold-500/10 rounded-full hidden lg:block animate-pulse"></div>
        <div className="absolute bottom-24 left-8 w-16 h-16 border border-gold-500/10 rounded-full hidden lg:block"></div>
        <div className="absolute top-40 left-16 w-10 h-10 border border-gold-500/5 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-40 right-16 w-10 h-10 border border-gold-500/5 rounded-full hidden lg:block"></div>
        
        {/* Islamic geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8963a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-12">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-6 py-2.5 mb-6 animate-fade-in-up backdrop-blur-sm hover:bg-gold-500/15 transition-colors cursor-default">
            <BsClock className="text-gold-400 text-sm" />
            <span className="text-gold-300 text-sm font-medium">باقي على عيد الفطر</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></div>
          </div>

          {/* Eid Countdown */}
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <EidCountdown />
          </div>

          <OrnamentalDivider />

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-gold-text text-shadow-gold">سَلِّم</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            صمّم بطاقة المعايدة الخاصة بك
            <span className="gradient-gold-text font-black"> في أقل من دقيقة</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            اختر القالب، اختر المخطوطة، اكتب اسمك — وحمّل بطاقتك بجودة عالية أو أرسلها مباشرة عبر واتساب.
            <span className="text-gold-400 font-bold"> مجاناً بدون تسجيل!</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/editor"
              className="group w-full sm:w-auto px-10 py-4 rounded-full gradient-gold text-gray-900 font-bold text-lg hover:shadow-2xl hover:shadow-gold-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 animate-pulse-gold"
            >
              <FaPenFancy className="text-lg" /> صمّ بطاقتك الآن
              <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/texts"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass border-gold-500/20 text-gold-300 font-medium text-lg hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <HiDocumentText /> تصفح عبارات التهنئة
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5 card-hover border border-gold-500/5 hover:border-gold-500/20 transition-all">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black gradient-gold-text">{stat.number}</div>
                <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold-500/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-gold-400 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* HOW IT WORKS — 5 Steps like btaqaat */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/3 via-gold-500/5 to-gold-500/3"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-5 py-2 mb-5">
              <FaMagic className="text-gold-400 text-xs" />
              <span className="text-gold-300 text-xs font-medium">سهل وسريع</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">صمّم بطاقتك</span>
              <span className="gradient-gold-text"> في خمس خطوات</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">تجربة سلسة واحترافية من البداية للنهاية</p>
          </div>

          {/* Steps */}
          <div className="space-y-0">
            {[
              { step: '١', num: 1, title: 'اختر قالب البطاقة', desc: 'تصفّ أكثر من 20 قالب احترافي مصمم يدوياً لمناسبات العيد — أو ارفع تصميمك الخاص', icon: <BsPalette className="text-3xl" />, color: 'gold' },
              { step: '٢', num: 2, title: 'اختر المخطوطة', desc: '8 مخطوطات عربية أصيلة — أميري، شهرزاد، القاهرة، لطيف وغيرها من أجمل الخطوط العربية', icon: <FaPenFancy className="text-3xl" />, color: 'emerald' },
              { step: '٣', num: 3, title: 'اختر عبارة التهنئة', desc: 'أكثر من 100 عبارة تهنئة جاهزة — رسمية، عائلية، تجارية، شعرية، خليجية — أو اكتب عبارتك', icon: <HiDocumentText className="text-3xl" />, color: 'blue' },
              { step: '٤', num: 4, title: 'اكتب اسمك واسم المُستلِم', desc: 'أضف لمستك الشخصية — اسم المُرسِل واسم المُستلِم يظهران على البطاقة بالخط الذي اخترته', icon: <BsPersonPlus className="text-3xl" />, color: 'purple' },
              { step: '٥', num: 5, title: 'حمّل البطاقة أو أرسلها', desc: 'صدّر بصيغة PNG بدقة 1080px أو PDF للطباعة — أو أرسل مباشرة عبر واتساب أو أي منصة', icon: <BsSend className="text-3xl" />, color: 'rose' },
            ].map((item, i) => (
              <div key={i} className="relative">
                {/* Connecting line */}
                {i < 4 && (
                  <div className="hidden md:block absolute right-1/2 top-full w-px h-8 bg-gradient-to-b from-gold-500/30 to-transparent"></div>
                )}
                
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8 rounded-3xl glass border border-white/5 hover:border-gold-500/20 transition-all duration-500 group mb-4 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {/* Step Number + Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl gradient-gold flex items-center justify-center text-4xl md:text-5xl group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-gold-500/20 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#08090d] border-2 border-gold-500 flex items-center justify-center text-gold-400 font-black text-sm">
                      {item.step}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} flex-1`}>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 group-hover:text-gold-300 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed max-w-lg">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after steps */}
          <div className="text-center mt-12">
            <Link
              to="/editor"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full gradient-gold text-gray-900 font-bold text-lg hover:shadow-2xl hover:shadow-gold-500/30 transition-all hover:scale-105"
            >
              <FaPenFancy /> ابدأ التصميم الآن — مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TEMPLATES GALLERY — Premium Showcase */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-5 py-2 mb-5">
              <HiTemplate className="text-gold-400 text-xs" />
              <span className="text-gold-300 text-xs font-medium">تصاميم حصرية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="gradient-gold-text">معرض القوالب الفاخرة</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              قوالب مصممة يدوياً لمناسبات العيد — أو ارفع تصاميمك الخاصة من المحرر
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {templates.map((template, i) => (
              <Link
                to="/editor"
                key={template.id}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in-up bg-gray-900 border border-white/5 hover:border-gold-500/30"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold mb-2">{template.name}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-gold-500/30 text-gold-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FaPenFancy className="text-[8px]" /> اضغط للتعديل
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Upload Your Own Tile */}
            <Link
              to="/editor"
              className="group aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-gold-500/40 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-gold-500/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-300">
                <HiTemplate className="text-2xl text-gold-400" />
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs group-hover:text-gold-300 transition-colors block font-bold">ارفع تصميمك</span>
                <span className="text-gray-600 text-[10px]">PNG أو JPG</span>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-gold text-gray-900 font-bold hover:shadow-lg hover:shadow-gold-500/30 transition-all hover:scale-105"
            >
              <BsStars /> اختر قالبك وابدأ التصميم
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURES — Premium Cards */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/3 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <OrnamentalDivider />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="gradient-gold-text">كل ما تحتاجه</span>
              <span className="text-white"> في مكان واحد</span>
            </h2>
            <p className="text-gray-400 text-lg">أدوات فاخرة لتصميم وإرسال بطاقات العيد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-8 hover:bg-white/8 transition-all duration-500 group card-hover border border-white/5 hover:border-gold-500/20 animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Subtle gradient bg */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center text-gray-900 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold-500/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TESTIMONIALS — Premium Design */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <OrnamentalDivider />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="gradient-gold-text">عملاؤنا يتحدثون</span>
            </h2>
            <p className="text-gray-400 text-lg">آراء حقيقية من مستخدمين في المملكة العربية السعودية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="relative glass rounded-2xl p-8 hover:bg-white/8 transition-all duration-500 group card-hover border border-white/5 hover:border-gold-500/20 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Quote mark */}
                <FaQuoteRight className="absolute top-6 left-6 text-gold-500/10 text-4xl" />
                
                <div className="relative z-10">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      si < t.rating
                        ? <BsStarFill key={si} className="text-gold-400 text-sm" />
                        : <BsStar key={si} className="text-gray-600 text-sm" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-11 h-11 rounded-full gradient-gold flex items-center justify-center text-gray-900 font-black text-sm">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* COMPARISON TABLE */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/3 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <OrnamentalDivider />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">ليش تختار</span>
              <span className="gradient-gold-text"> سَلِّم؟</span>
            </h2>
            <p className="text-gray-400">قارن بنفسك — الفرق واضح</p>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-gradient-to-l from-gold-500/10 to-transparent">
                  <th className="p-5 text-right text-gray-400 font-medium">الميزة</th>
                  <th className="p-5 text-center">
                    <span className="gradient-gold-text font-black text-base">سَلِّم</span>
                  </th>
                  <th className="p-5 text-center text-gray-500 font-medium">منصات أخرى</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['مخطوطات عربية أصيلة', true, false],
                  ['قوالب مصممة للعيد', true, false],
                  ['100+ عبارة تهنئة عربية', true, false],
                  ['إرسال واتساب مباشر', true, false],
                  ['وايت لابل للشركات', true, false],
                  ['رفع تصاميم خاصة', true, true],
                  ['تصدير PNG + PDF', true, true],
                  ['مجاني بدون تسجيل', true, false],
                ].map(([feature, us, them], i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-5 text-gray-300 font-medium">{feature}</td>
                    <td className="p-5 text-center">
                      {us ? <BsCheckCircle className="text-green-400 text-lg mx-auto" /> : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="p-5 text-center">
                      {them ? <BsCheckCircle className="text-gray-500 mx-auto" /> : <span className="text-gray-600 text-lg">✗</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FAQ — Premium Accordion */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <OrnamentalDivider />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="gradient-gold-text">أسئلة شائعة</span>
            </h2>
            <p className="text-gray-400">كل ما تحتاج تعرفه عن منصة سَلِّم</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* NEWSLETTER */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/3 to-transparent"></div>
        <div className="relative max-w-2xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 text-center border border-gold-500/10">
            <BsEnvelope className="text-4xl text-gold-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">اشترك في القائمة البريدية</h3>
            <p className="text-gray-400 text-sm mb-6">كن أول من يعرف عن القوالب الجديدة والعروض الحصرية لمناسبات العيد</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-gold-500/50 focus:outline-none placeholder:text-gray-500"
                dir="ltr"
              />
              <button className="px-6 py-3 rounded-xl gradient-gold text-gray-900 font-bold text-sm hover:shadow-lg hover:shadow-gold-500/30 transition-all hover:scale-105 whitespace-nowrap">
                اشترك الآن
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-4">لن نشارك بريدك مع أي طرف ثالث</p>
          </div>
        </div>
      </section>
    </div>
  )
}
