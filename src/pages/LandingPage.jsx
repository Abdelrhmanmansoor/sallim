import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowLeft, BsChevronDown, BsChevronUp } from 'react-icons/bs'

/* ═══ Eid Countdown — subtle ═══ */
function EidCountdown() {
  const [t, setT] = useState({})

  useEffect(() => {
    const eid = new Date('2026-03-30T00:00:00+03:00')
    const calc = () => {
      const diff = eid - new Date()
      if (diff <= 0) return { passed: true }
      return {
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
      }
    }
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.passed) return <p className="text-gold-400 text-sm tracking-widest">عيد مبارك</p>

  return (
    <div className="inline-flex items-center gap-4" dir="ltr">
      <span className="text-gray-600 text-xs tracking-wide">باقي على العيد</span>
      {[
        { v: t.d, l: 'يوم' },
        { v: t.h, l: 'ساعة' },
        { v: t.m, l: 'دقيقة' },
        { v: t.s, l: 'ثانية' },
      ].map((x, i) => (
        <span key={i} className="tabular-nums text-sm">
          <span className="text-white/90 font-semibold">{String(x.v ?? 0).padStart(2, '0')}</span>
          <span className="text-gray-700 text-[10px] mr-0.5">{x.l}</span>
          {i < 3 && <span className="text-gray-800 mx-1.5">:</span>}
        </span>
      ))}
    </div>
  )
}

/* ═══ FAQ Item ═══ */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.04]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-right group"
      >
        <span className="text-white/90 text-[15px] font-medium group-hover:text-gold-400 transition-colors">{q}</span>
        {open
          ? <BsChevronUp className="text-gold-400 shrink-0 mr-4 text-xs" />
          : <BsChevronDown className="text-gray-700 shrink-0 mr-4 text-xs" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-500 text-sm leading-[1.8] pr-1">{a}</p>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'هل المنصة مجانية؟', a: 'نعم، يمكنك تصميم وتحميل البطاقات مجاناً بدون تسجيل. الباقات المدفوعة تضيف ميزات متقدمة مثل الإرسال الجماعي وإزالة العلامة المائية.' },
  { q: 'كيف أرفع تصاميمي الخاصة؟', a: 'من لوحة التحكم اختر تبويب "القوالب" ثم ارفع صور PNG أو JPG. القوالب تُحفظ وتظهر مباشرة في المحرر.' },
  { q: 'هل يمكنني إرسال البطاقات لعدة أشخاص؟', a: 'نعم، من صفحة الإرسال ارفع ملف CSV بأسماء وأرقام المستلمين وأرسل لهم تلقائياً عبر واتساب.' },
  { q: 'ما جودة البطاقات؟', a: 'البطاقات تُصدَّر بدقة 1080×1080 بكسل بصيغة PNG أو PDF جاهز للطباعة.' },
  { q: 'هل يدعم الموقع الجوال؟', a: 'نعم، الموقع متجاوب بالكامل ومُحسّن لجميع الأجهزة.' },
]

/* ═══════════════════════════════════════════ */
/* Landing Page — Calm, Elegant, Non-conventional */
/* ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 relative">
        {/* Single ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gold-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mb-14 opacity-80">
            <EidCountdown />
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-extrabold leading-none mb-8">
            <span className="gradient-gold-text">سَلِّم</span>
          </h1>

          <p className="text-[17px] sm:text-lg text-gray-400 leading-[1.9] mb-12 max-w-md mx-auto">
            صمّم بطاقة تهنئة العيد وأرسلها لأحبابك
            <br />
            في أقل من دقيقة — مجاناً بدون تسجيل.
          </p>

          <Link
            to="/editor"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gold-500 text-[#08090d] font-bold text-[15px] hover:bg-gold-400 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/15"
          >
            ابدأ التصميم
            <BsArrowLeft className="text-sm" />
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold-500/60 text-xs tracking-[0.2em] text-center mb-4 uppercase">الخطوات</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white/90 mb-20">
            كيف تعمل المنصة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
            {[
              { n: '١', title: 'اختر القالب', desc: 'تصفّح القوالب الجاهزة أو ارفع تصميمك الخاص من لوحة التحكم' },
              { n: '٢', title: 'خصّص البطاقة', desc: 'اختر الخط والعبارة والألوان واكتب اسم المُرسل والمُستلم' },
              { n: '٣', title: 'حمّل أو أرسل', desc: 'صدّر بصيغة PNG أو PDF أو أرسل مباشرة عبر واتساب' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-11 h-11 rounded-full border border-gold-500/20 flex items-center justify-center text-gold-400/80 text-sm font-semibold mx-auto mb-5 group-hover:border-gold-500/40 transition-colors">
                  {s.n}
                </div>
                <h3 className="text-white/90 font-semibold text-[15px] mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-[1.7]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── thin separator ── */}
      <div className="max-w-[120px] mx-auto h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />

      {/* ── Features ── */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold-500/60 text-xs tracking-[0.2em] text-center mb-4 uppercase">المميزات</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white/90 mb-20">
            ما يميّز سَلِّم
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-12">
            {[
              { title: 'خطوط عربية أصيلة', desc: '8 مخطوطات تشمل أميري وشهرزاد والقاهرة ولطيف وغيرها' },
              { title: 'أكثر من 100 عبارة تهنئة', desc: 'عبارات رسمية وعائلية وتجارية وشعرية لكل مناسبة ولهجة' },
              { title: 'إرسال عبر واتساب', desc: 'أرسل بطاقتك فردياً أو جماعياً مباشرة من المنصة' },
              { title: 'تصدير بأعلى جودة', desc: 'PNG بدقة 1080px أو PDF جاهز للطباعة بدون فقدان جودة' },
              { title: 'تخصيص كامل للشركات', desc: 'وايت لابل بهوية شركتك — شعار وألوان ونطاق مخصص' },
              { title: 'مجاني بدون تسجيل', desc: 'ابدأ التصميم فوراً بدون حساب أو بيانات شخصية' },
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-gold-500/50 mt-[10px] shrink-0" />
                <div>
                  <h3 className="text-white/85 font-semibold text-[15px] mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-[1.7]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── thin separator ── */}
      <div className="max-w-[120px] mx-auto h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />

      {/* ── FAQ ── */}
      <section className="py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-500/60 text-xs tracking-[0.2em] text-center mb-4 uppercase">الأسئلة</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white/90 mb-16">
            أسئلة شائعة
          </h2>
          <div>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-8">جاهز تصمّم بطاقتك؟</p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-gold-500/20 text-gold-400 font-semibold text-[15px] hover:bg-gold-500/[0.06] transition-all duration-300"
          >
            ابدأ الآن
            <BsArrowLeft className="text-xs" />
          </Link>
        </div>
      </section>
    </div>
  )
}
