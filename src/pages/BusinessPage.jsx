import { Link } from 'react-router-dom'
import {
  ArrowLeft, Building2, Users, Send, Palette,
  Shield, Layers, FileText, Check, Crown, Zap,
  MessageCircle, Globe, Star,
} from 'lucide-react'

/* ═══ Section Heading ═══ */
function SectionHead({ tag, title, sub }) {
  return (
    <div className="text-center mb-16">
      <span className="inline-block text-[#d4b96b]/50 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">{tag}</span>
      <h2 className="text-3xl sm:text-4xl font-bold text-white/90 mb-3">{title}</h2>
      {sub && <p className="text-white/35 text-[15px] max-w-xl mx-auto leading-[1.8]">{sub}</p>}
    </div>
  )
}

/* ═══ Advantage Card ═══ */
function Advantage({ icon: Icon, title, desc }) {
  return (
    <div className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:border-[#d4b96b]/15 transition-all duration-500 h-full">
      <div className="w-12 h-12 rounded-2xl bg-[#d4b96b]/[0.07] flex items-center justify-center mb-5 group-hover:bg-[#d4b96b]/[0.12] transition-colors">
        <Icon className="w-5 h-5 text-[#d4b96b]" strokeWidth={1.5} />
      </div>
      <h3 className="text-white/90 font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/35 text-[14px] leading-[1.8]">{desc}</p>
    </div>
  )
}

/* ═══ Pricing Card ═══ */
function PricingCard({ title, subtitle, price, period, features, cta, ctaLink, highlight, icon: Icon }) {
  const isWhatsApp = ctaLink.startsWith('https://wa.me')
  return (
    <div className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-500 h-full flex flex-col ${highlight ? 'bg-[#d4b96b]/[0.06] border-2 border-[#d4b96b]/25' : 'bg-white/[0.02] border border-white/[0.06]'}`}>
      {highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#d4b96b] text-[#060709] text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap">الأنسب للشركات</span>
        </div>
      )}
      <div className="text-center mb-8">
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${highlight ? 'bg-[#d4b96b]/15' : 'bg-white/[0.04]'}`}>
          <Icon className={`w-6 h-6 ${highlight ? 'text-[#d4b96b]' : 'text-white/40'}`} strokeWidth={1.5} />
        </div>
        <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
        <p className="text-white/30 text-sm">{subtitle}</p>
      </div>
      <div className="text-center mb-8">
        {price === 'مجاني' ? (
          <span className="text-3xl font-black text-[#d4b96b]">مجاني</span>
        ) : (
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white">{price}</span>
            <span className="text-white/30 text-sm">/ {period}</span>
          </div>
        )}
      </div>
      <div className="space-y-3 mb-10 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlight ? 'bg-[#d4b96b]/15' : 'bg-white/[0.04]'}`}>
              <Check className={`w-3 h-3 ${highlight ? 'text-[#d4b96b]' : 'text-white/40'}`} strokeWidth={2.5} />
            </div>
            <span className="text-white/60 text-sm leading-[1.7]">{f}</span>
          </div>
        ))}
      </div>
      {isWhatsApp ? (
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-4 rounded-xl font-bold text-[15px] text-center transition-all duration-300 inline-flex items-center justify-center gap-2 ${
            highlight
              ? 'bg-[#d4b96b] text-[#060709] hover:bg-[#e0c97d] shadow-lg shadow-[#d4b96b]/15'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          {cta}
        </a>
      ) : (
        <Link
          to={ctaLink}
          className={`w-full py-4 rounded-xl font-bold text-[15px] text-center transition-all duration-300 inline-flex items-center justify-center gap-2 ${
            highlight
              ? 'bg-[#d4b96b] text-[#060709] hover:bg-[#e0c97d] shadow-lg shadow-[#d4b96b]/15'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          {cta}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

/* ═══════════════════════════════ */
/* BUSINESS PAGE                  */
/* ═══════════════════════════════ */
export default function BusinessPage() {
  const waLink = 'https://wa.me/201007835547?text=' + encodeURIComponent('السلام عليكم، أريد الاشتراك في باقة الشركات لمنصة سَلِّم 🌙')

  return (
    <div className="min-h-screen w-full bg-[#060709] overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-28 px-4 w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,100vw)] h-[300px] bg-[#d4b96b]/[0.04] rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#d4b96b]/[0.08] border border-[#d4b96b]/15 rounded-full px-5 py-2 mb-8">
            <Building2 className="w-4 h-4 text-[#d4b96b]" />
            <span className="text-[#d4b96b] text-sm font-medium">حلول الشركات والمؤسسات</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white/90 mb-6 leading-[1.3]">
            هنّئ عملاءك
            <br />
            <span className="text-[#d4b96b]">بهوية مؤسستك</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/40 leading-[1.9] mb-12 max-w-xl mx-auto">
            منصة سَلِّم تمكّنك من تصميم وإرسال بطاقات تهنئة احترافية
            <br />
            بشعار شركتك وألوانها — بسهولة وسرعة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15 hover:shadow-[#d4b96b]/25"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل معنا عبر واتساب
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
            <Link
              to="/editor"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-[#d4b96b]/30 text-[#d4b96b] font-bold text-[15px] hover:bg-[#d4b96b]/10 hover:border-[#d4b96b]/50 transition-all duration-300"
            >
              جرّب المحرر مجاناً
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SALLIM ─── */}
      <section className="py-28 px-4 relative w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHead tag="عن المنصة" title="ما هي سَلِّم؟" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
              <Star className="w-8 h-8 text-[#d4b96b] mb-4" strokeWidth={1.5} />
              <h3 className="text-white/90 font-bold text-lg mb-3">منصة بطاقات تهنئة عربية</h3>
              <p className="text-white/35 text-[14px] leading-[1.9]">
                سَلِّم هي منصة عربية متكاملة لتصميم بطاقات تهنئة العيد بخطوط عربية أصيلة وعبارات مختارة بعناية.
                تتيح لك المنصة تصميم بطاقة احترافية في ثوانٍ — بدون خبرة تصميم أو برامج معقدة.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
              <Zap className="w-8 h-8 text-[#d4b96b] mb-4" strokeWidth={1.5} />
              <h3 className="text-white/90 font-bold text-lg mb-3">سهلة وسريعة</h3>
              <p className="text-white/35 text-[14px] leading-[1.9]">
                اختر قالباً جاهزاً → خصّص النص والألوان → حمّل أو أرسل عبر واتساب.
                كل ذلك في أقل من دقيقة واحدة — مجاناً بالكامل للأفراد بدون تسجيل حساب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREE FEATURES ─── */}
      <section className="py-28 px-4 relative w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHead
            tag="مجاني للجميع"
            title="ابدأ مجاناً — بدون قيود"
            sub="كل هذه المزايا متاحة مجاناً للأفراد والمؤسسات على حد سواء"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Advantage icon={Palette}   title="محرر بطاقات كامل"      desc="محرر سحب وإفلات احترافي — اختر القالب واكتب النص وخصّص الألوان والخطوط بحرية تامة" />
            <Advantage icon={FileText}  title="+100 عبارة تهنئة"      desc="عبارات رسمية وعائلية وشعرية وتجارية مُنتقاة بعناية — انسخها أو أضفها مباشرة للبطاقة" />
            <Advantage icon={Layers}    title="20+ قالب جاهز"         desc="تصاميم احترافية متنوعة جاهزة للتخصيص — تُحدّث مع كل موسم" />
            <Advantage icon={Send}      title="إرسال عبر واتساب"      desc="أرسل البطاقة مباشرة لأي شخص عبر واتساب بضغطة واحدة" />
            <Advantage icon={Shield}    title="بدون تسجيل"            desc="ابدأ فوراً بدون إنشاء حساب أو إدخال بيانات شخصية" />
            <Advantage icon={Globe}     title="تصدير عالي الجودة"     desc="حمّل البطاقة بصيغة PNG بدقة 1080px أو PDF جاهز للطباعة" />
          </div>
        </div>
      </section>

      {/* ─── BULK ADVANTAGES ─── */}
      <section className="py-28 px-4 relative w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHead
            tag="مزايا الشركات"
            title="لماذا تختار باقة الشركات؟"
            sub="مزايا حصرية تمنح مؤسستك تجربة تهنئة احترافية ومتميزة"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Advantage
              icon={Building2}
              title="وايت لابل — هوية مخصصة"
              desc="اعرض المنصة بشعار شركتك وألوانها ونطاقك الخاص. وداعاً للعلامة المائية — بطاقاتك بهوية مؤسستك فقط"
            />
            <Advantage
              icon={Users}
              title="إرسال جماعي (Bulk)"
              desc="أرسل مئات البطاقات المخصصة دفعة واحدة عبر ملف CSV. كل بطاقة تحمل اسم المستلم تلقائياً"
            />
            <Advantage
              icon={Crown}
              title="قوالب حصرية"
              desc="قوالب مميزة غير متاحة في النسخة المجانية — تصاميم فاخرة تليق بمستوى مؤسستك"
            />
            <Advantage
              icon={Zap}
              title="أولوية الدعم الفني"
              desc="دعم مباشر عبر واتساب مع أولوية الرد والمساعدة في إعداد حسابكم وتدريب فريقكم"
            />
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-28 px-4 relative w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHead
            tag="الباقات"
            title="اختر الباقة المناسبة"
            sub="الأفراد دائماً مجاناً — باقات الشركات لمن يريد المزيد"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PricingCard
              icon={Users}
              title="الأفراد"
              subtitle="مجاني بالكامل — للجميع"
              price="مجاني"
              period=""
              features={[
                'تصميم بطاقات بلا حدود',
                '+100 عبارة تهنئة جاهزة',
                '20+ قالب احترافي',
                '8 خطوط عربية أصيلة',
                'تصدير PNG و PDF',
                'إرسال فردي عبر واتساب',
                'بدون تسجيل أو بيانات',
              ]}
              cta="ابدأ التصميم مجاناً"
              ctaLink="/editor"
              highlight={false}
            />
            <PricingCard
              icon={Building2}
              title="الشركات والمؤسسات"
              subtitle="كل مزايا الأفراد + المزيد"
              price="تواصل معنا"
              period=""
              features={[
                'كل مزايا الباقة المجانية',
                'وايت لابل بهوية شركتك',
                'إزالة العلامة المائية',
                'إرسال جماعي عبر CSV',
                'قوالب حصرية للشركات',
                'دعم فني مباشر بأولوية',
                'نطاق مخصص (اختياري)',
              ]}
              cta="تواصل عبر واتساب"
              ctaLink={waLink}
              highlight={true}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-4 relative w-full">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-xl mx-auto text-center relative z-10">
          <img src="/images/logo.png" alt="سَلِّم" className="h-20 w-auto mx-auto opacity-80 mb-8" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white/90 mb-4">جاهز تبدأ؟</h2>
          <p className="text-white/30 text-sm mb-10 leading-[1.8]">
            تواصل معنا الآن وسنساعدك في إعداد حساب مؤسستك
            <br />
            خلال ساعات — الخدمة متاحة طوال أيام العيد
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#d4b96b] text-[#060709] font-bold text-[15px] hover:bg-[#e0c97d] transition-all duration-300 shadow-lg shadow-[#d4b96b]/15"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل واتساب
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
            <Link
              to="/"
              className="text-[#d4b96b] text-sm font-medium hover:text-[#e0c97d] transition-colors inline-flex items-center gap-2"
            >
              العودة للرئيسية
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
