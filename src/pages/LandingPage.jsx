import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Palette, Type, Send, Download,
  Building2, ChevronDown,
  Layers, FileText, Shield, Users,
} from 'lucide-react'

/* ═══ Marquee Ticker ═══ */
function MarqueeTicker() {
  const items = [
    '🌙 كل عام وأنتم بخير',
    '✨ عيدكم مبارك',
    '🎉 سَلِّم — منصة بطاقات تهنئة العيد',
    '💛 تقبّل الله طاعتكم',
    '🌙 عساكم من عوّاده',
    '✨ صمّم بطاقتك مجاناً',
  ]
  const repeated = [...items, ...items, ...items]

  return (
    <div className="w-full overflow-hidden bg-[#d4b96b] py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="mx-8 text-[#060709] text-sm font-bold inline-block">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══ FAQ ═══ */
function FAQ({ q, a, isOpen, toggle }) {
  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden transition-colors hover:border-[#d4b96b]/20">
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right group">
        <span className="text-white/85 text-[15px] font-medium group-hover:text-white transition-colors">{q}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-4 transition-all ${isOpen ? 'bg-[#d4b96b]/15 rotate-180' : 'bg-white/[0.03]'}`}>
          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-[#d4b96b]' : 'text-white/30'}`} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-white/40 text-sm leading-[1.9]">{a}</p>
        </div>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'هل المنصة مجانية؟', a: 'نعم، يمكنك تصميم وتحميل البطاقات مجاناً بدون تسجيل. الباقات المدفوعة تضيف ميزات متقدمة مثل الإرسال الجماعي وإزالة العلامة المائية.' },
  { q: 'كيف أرفع تصاميمي الخاصة؟', a: 'من لوحة التحكم اختر تبويب "القوالب" ثم ارفع صور PNG أو JPG. القوالب تُحفظ وتظهر مباشرة في المحرر.' },
  { q: 'هل أقدر أرسل لأكثر من شخص؟', a: 'نعم، من صفحة الإرسال ارفع ملف CSV بأسماء وأرقام المستلمين وأرسل لهم تلقائياً عبر واتساب.' },
  { q: 'ما جودة البطاقات؟', a: 'البطاقات تُصدَّر بدقة 1080×1080 بكسل بصيغة PNG أو PDF جاهز للطباعة.' },
  { q: 'هل يدعم الموقع الجوال؟', a: 'نعم، الموقع متجاوب بالكامل ومُحسّن لجميع الأجهزة والشاشات.' },
]

/* ═══ Step Card ═══ */
function StepCard({ num, icon: Icon, title, desc }) {
  return (
    <div className="group">
      <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:border-[#d4b96b]/15 transition-all duration-500 h-full">
        <div className="absolute -top-3 right-6 bg-[#060709] px-3">
          <span className="text-[#d4b96b]/40 text-[11px] font-bold tracking-wider">0{num}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#d4b96b]/[0.07] flex items-center justify-center mb-6 group-hover:bg-[#d4b96b]/[0.12] transition-colors">
          <Icon className="w-5 h-5 text-[#d4b96b]" strokeWidth={1.5} />
        </div>
        <h3 className="text-white/90 font-bold text-lg mb-2">{title}</h3>
        <p className="text-white/35 text-[14px] leading-[1.8]">{desc}</p>
      </div>
    </div>
  )
}

/* ═══ Feature Row ═══ */
function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-5 group">
      <div className="w-10 h-10 rounded-xl bg-white/[0.025] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:border-[#d4b96b]/15 group-hover:bg-[#d4b96b]/[0.05] transition-all duration-300">
        <Icon className="w-4 h-4 text-[#d4b96b]/60 group-hover:text-[#d4b96b] transition-colors" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-white/85 font-semibold text-[15px] mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-white/30 text-sm leading-[1.7]">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════ */
/* LANDING PAGE                   */
/* ═══════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen w-full bg-[#060709] overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 w-full overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100vw)] h-[300px] bg-[#d4b96b]/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Logo — bigger & centered */}
          <div className="animate-fade-up mb-8">
            <img src="/images/logo.png" alt="سَلِّم" className="h-44 sm:h-56 md:h-72 w-auto mx-auto drop-shadow-[0_0_60px_rgba(212,185,107,0.2)]" />
          </div>

          <p className="animate-fade-up delay-1 text-lg sm:text-xl text-white/40 leading-[1.9] mb-12 max-w-lg mx-auto">
            منصة احترافية لتصميم بطاقات تهنئة العيد
            <br />
            <span className="text-white/55">في ثوانٍ — مجاناً بدون تسجيل</span>
          </p>

          {/* CTA Group — Companies + Individuals */}
          <div className="animate-fade-up delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15 hover:shadow-[#d4b96b]/25"
            >
              <Users className="w-5 h-5" />
              ابدأ مجاناً — للأفراد
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/business"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-[#d4b96b]/30 text-[#d4b96b] font-bold text-[15px] hover:bg-[#d4b96b]/10 hover:border-[#d4b96b]/50 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              للشركات والمؤسسات
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick stats */}
          <div className="animate-fade-up delay-3 mt-16 flex items-center justify-center gap-10 text-center">
            {[
              { n: '+100', l: 'عبارة تهنئة' },
              { n: '20', l: 'قالب جاهز' },
              { n: '8', l: 'خطوط عربية' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[#d4b96b] text-xl font-bold">{s.n}</span>
                <span className="text-white/20 text-[11px] mt-0.5">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE TICKER ─── */}
      <MarqueeTicker />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الخطوات</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90">
              كيف تصمّم بطاقتك
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard num={1} icon={Layers}  title="اختر القالب"  desc="تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم" />
            <StepCard num={2} icon={Palette}  title="خصّص البطاقة" desc="اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم" />
            <StepCard num={3} icon={Send}     title="أرسل أو حمّل" desc="صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">المميزات</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-4">
                كل ما تحتاجه
                <br />
                <span className="text-white/40">في منصة واحدة</span>
              </h2>
              <p className="text-white/30 text-[15px] leading-[1.8] mb-10">
                صمّم بطاقات احترافية بخطوط عربية أصيلة وعبارات مختارة بعناية — ثم أرسلها لمن تحب مباشرة.
              </p>
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 text-[#d4b96b] text-sm font-medium hover:text-[#e0c97d] transition-colors group"
              >
                جرّب المحرر الآن
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-7">
              <Feature icon={Type}       title="خطوط عربية أصيلة"   desc="8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها" />
              <Feature icon={FileText}   title="أكثر من 100 عبارة"  desc="عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة" />
              <Feature icon={Send}       title="إرسال عبر واتساب"   desc="أرسل فردياً أو جماعياً مباشرة من المنصة" />
              <Feature icon={Download}   title="تصدير بأعلى جودة"   desc="PNG بدقة 1080px أو PDF جاهز للطباعة" />
              <Feature icon={Building2}  title="تخصيص كامل للشركات" desc="وايت لابل — شعار وألوان ونطاق مخصص بهوية شركتك" />
              <Feature icon={Shield}     title="مجاني وآمن"         desc="ابدأ فوراً بدون حساب أو بيانات شخصية" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">الأسئلة</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white/90">أسئلة شائعة</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQ key={i} q={f.q} a={f.a} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-4 relative bg-[#060709] w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="mb-8 mx-auto">
            <img src="/images/logo.png" alt="سَلِّم" className="h-20 w-auto mx-auto opacity-80" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">جاهز تصمّم بطاقتك؟</h2>
          <p className="text-white/30 text-sm mb-10">
            صمّم بطاقة فريدة وأرسلها لمن تحب في أقل من دقيقة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/business"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-[#d4b96b]/30 text-[#d4b96b] font-bold text-[15px] hover:bg-[#d4b96b]/10 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              حلول الشركات
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
