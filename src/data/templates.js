// ═══ القوالب — صور مرفوعة في public/templates/ ═══
// كل قالب هو صورة خلفية حقيقية ترفعها أنت
// ضع الصور في public/templates/ وعدّل المسارات هنا
// أو ارفعها من لوحة التحكم (Dashboard > إدارة القوالب)

// ═══════════════════════════════════════════════════════════════
// القوالب الأساسية - تظهر في "جاهز" و "جماعي"
// المسار: public/templates/جاهزة/
// ═══════════════════════════════════════════════════════════════
export const templates = [
  { id: 10, name: 'تصميم ١٠', image: '/templates/جاهزة/10.png', textColor: '#ffffff' },
  { id: 11, name: 'تصميم ١١', image: '/templates/جاهزة/11.png', textColor: '#ffffff' },
  { id: 12, name: 'تصميم ١٢', image: '/templates/جاهزة/13.png', textColor: '#ffffff' },
  { id: 13, name: 'تصميم ١٣', image: '/templates/جاهزة/14.png', textColor: '#ffffff' },
  { id: 14, name: 'تصميم ١٤', image: '/templates/جاهزة/15.png', textColor: '#ffffff' },
  { id: 15, name: 'تصميم ١٥', image: '/templates/جاهزة/16.png', textColor: '#ffffff' },
  { id: 16, name: 'تصميم ١٦', image: '/templates/جاهزة/17.png', textColor: '#ffffff' },
  { id: 1, name: 'تصميم ١', image: '/templates/جاهزة/3.png', textColor: '#ffffff' },
  { id: 2, name: 'تصميم ٢', image: '/templates/جاهزة/5.png', textColor: '#ffffff' },
  { id: 3, name: 'تصميم ٣', image: '/templates/جاهزة/6.png', textColor: '#ffffff' },
  { id: 4, name: 'تصميم ٤', image: '/templates/جاهزة/7.png', textColor: '#ffffff' },
  { id: 5, name: 'تصميم ٥', image: '/templates/جاهزة/8.png', textColor: '#ffffff' },
  { id: 6, name: 'تصميم ٦', image: '/templates/جاهزة/9.png', textColor: '#ffffff' },
  { id: 7, name: 'تصميم ٧', image: '/templates/جاهزة/Artboard 1.png', textColor: '#ffffff' },
  { id: 8, name: 'تصميم ٨', image: '/templates/جاهزة/Artboard 2.png', textColor: '#ffffff' },
  { id: 9, name: 'تصميم ٩', image: '/templates/جاهزة/Artboard 4.png', textColor: '#ffffff' },
]

// ═══════════════════════════════════════════════════════════════
// قوالب حصرية للشركات - تظهر فقط للشركة المحددة
// ═══════════════════════════════════════════════════════════════
export const exclusiveCompanyTemplates = [
  { 
    id: 'oud-scent-1', 
    name: 'ريحة عود - عيد الفطر', 
    image: '/templates/exclusive/oud-scent-eid.png', 
    textColor: '#d4a843',
    companyNames: ['ريحة عود', 'Oud Scent', 'Oud scent', 'oud scent', 'OUD SCENT'],
    theme: 'ramadan-green',
    exclusive: true
  },
]

// ═══════════════════════════════════════════════════════════════
// قوالب حصرية - تظهر فقط في "صمّم"
// المسار: public/templates/مصمم/
// ═══════════════════════════════════════════════════════════════
export const designerOnlyTemplates = [
  { id: 101, name: 'تصميم حصري ١', image: '/templates/مصمم/14.png', textColor: '#ffffff', exclusive: true },
  { id: 102, name: 'تصميم حصري ٢', image: '/templates/مصمم/15.png', textColor: '#ffffff', exclusive: true },
  { id: 103, name: 'تصميم حصري ٣', image: '/templates/مصمم/16.png', textColor: '#ffffff', exclusive: true },
  { id: 104, name: 'تصميم حصري ٤', image: '/templates/مصمم/17.png', textColor: '#ffffff', exclusive: true },
  { id: 105, name: 'تصميم حصري ٥', image: '/templates/مصمم/18.png', textColor: '#ffffff', exclusive: true },
  { id: 106, name: 'تصميم حصري ٦', image: '/templates/مصمم/19.png', textColor: '#ffffff', exclusive: true },
  { id: 107, name: 'تصميم حصري ٧', image: '/templates/مصمم/Artboard 1.png', textColor: '#ffffff', exclusive: true },
  { id: 108, name: 'تصميم حصري ٨', image: '/templates/مصمم/Artboard 2.png', textColor: '#ffffff', exclusive: true },
  { id: 109, name: 'تصميم حصري ٩', image: '/templates/مصمم/Artboard 3.png', textColor: '#ffffff', exclusive: true },
  { id: 110, name: 'تصميم حصري ١٠', image: '/templates/مصمم/Artboard 4.png', textColor: '#ffffff', exclusive: true },
  { id: 111, name: 'تصميم حصري ١١', image: '/templates/مصمم/Artboard 5.png', textColor: '#ffffff', exclusive: true },
  { id: 112, name: 'تصميم حصري ١٢', image: '/templates/مصمم/Artboard 6.png', textColor: '#ffffff', exclusive: true },
  { id: 113, name: 'تصميم حصري ١٣', image: '/templates/مصمم/Artboard 7.png', textColor: '#ffffff', exclusive: true },
  { id: 114, name: 'تصميم حصري ١٤', image: '/templates/مصمم/Artboard 12.png', textColor: '#ffffff', exclusive: true },
  { id: 115, name: 'تصميم لرفع صورة', image: '/templates/مصمم/تصميم لرفع صورة.png', textColor: '#ffffff', exclusive: true },
]

export const themes = [
  {
    id: 'golden',
    name: 'ذهبي فاخر',
    primary: '#d4a843',
    secondary: '#C6F806',
    bg: '#17012C',
    text: '#ffffff',
    accent: '#8a6d1f',
  },
  {
    id: 'royal-green',
    name: 'أخضر ملكي',
    primary: '#0d7a3e',
    secondary: '#4ade80',
    bg: '#021a0a',
    text: '#ffffff',
    accent: '#084c26',
  },
  {
    id: 'burgundy',
    name: 'بورقندي',
    primary: '#9c1449',
    secondary: '#f9a8d4',
    bg: '#1a0510',
    text: '#ffffff',
    accent: '#7b1039',
  },
  {
    id: 'white-gold',
    name: 'أبيض ذهبي',
    primary: '#d4a843',
    secondary: '#5c4915',
    bg: '#fefefe',
    text: '#1a1a2e',
    accent: '#C6F806',
  },
  {
    id: 'navy',
    name: 'كحلي',
    primary: '#1e40af',
    secondary: '#93c5fd',
    bg: '#0a0a2e',
    text: '#ffffff',
    accent: '#1e3a8a',
  },
  {
    id: 'purple',
    name: 'بنفسجي',
    primary: '#7c3aed',
    secondary: '#c4b5fd',
    bg: '#0a0520',
    text: '#ffffff',
    accent: '#5b21b6',
  },
]

export const fonts = [
  { id: 'handicrafts', name: 'TheYearofHandicrafts', family: "'TheYearofHandicrafts', serif", label: 'عام الحرف' },
  { id: 'amiri', name: 'Amiri', family: "'Amiri', serif", label: 'أميري' },
  { id: 'cairo', name: 'Cairo', family: "'Cairo', sans-serif", label: 'القاهرة' },
  { id: 'tajawal', name: 'Tajawal', family: "'Tajawal', sans-serif", label: 'تجوّل' },
  { id: 'scheherazade', name: 'Scheherazade New', family: "'Scheherazade New', serif", label: 'شهرزاد' },
  { id: 'noto', name: 'Noto Naskh Arabic', family: "'Noto Naskh Arabic', serif", label: 'نوتو نسخ' },
  { id: 'lateef', name: 'Lateef', family: "'Lateef', serif", label: 'لطيف' },
  { id: 'almarai', name: 'Almarai', family: "'Almarai', sans-serif", label: 'المرعي' },
  { id: 'ibm', name: 'IBM Plex Sans Arabic', family: "'IBM Plex Sans Arabic', sans-serif", label: 'IBM بلكس' },
]

export const pricingPlans = [
  {
    id: 'free',
    name: 'مجاني',
    price: 0,
    period: '',
    features: [
      '3 بطاقات يومياً',
      '5 قوالب أساسية',
      'تصدير PNG',
      'علامة سَلِّم المائية',
      'بنك نصوص محدود (20 نص)',
    ],
    limitations: ['علامة مائية', 'قوالب محدودة'],
    cta: 'ابدأ مجاناً',
    popular: false,
    color: '#6b7280',
  },
  {
    id: 'starter',
    name: 'باقة البداية',
    price: 149,
    period: '',
    oneTime: true,
    features: [
      'حتى 50 بطاقة',
      'جميع القوالب الأساسية (30+)',
      'تصدير PNG + PDF',
      'بدون علامة مائية',
      'تخصيص الألوان والخطوط',
      'مشاركة عبر رابط أو واتساب',
    ],
    limitations: [],
    cta: 'اشترِ الآن',
    popular: false,
    color: '#0ea5e9',
  },
  {
    id: 'business',
    name: 'باقة الأعمال',
    price: 599,
    period: 'سنة',
    features: [
      'حتى 500 بطاقة سنوياً',
      'جميع القوالب (50+)',
      'شعار الشركة على البطاقات',
      'قوالب حصرية للشركات',
      'إرسال جماعي (CSV/Excel)',
      'جدولة الإرسال',
      'تقارير وإحصائيات',
      'دعم فني أولوية',
    ],
    limitations: [],
    cta: 'اشترك الآن',
    popular: true,
    color: '#a855f7',
  },
  {
    id: 'enterprise',
    name: 'الباقة المؤسسية',
    price: 1999,
    period: 'سنة',
    features: [
      'حتى 5,000 بطاقة سنوياً',
      'كل مواسم السنة + أعياد الميلاد',
      'مناسبات خاصة (ترقية، زواج، تخرج)',
      'هوية بصرية كاملة',
      'قوالب مخصصة حسب الطلب',
      'ربط مع نظام HR',
      'جدولة ذكية + إرسال تلقائي',
      'لوحة تحكم متقدمة',
      'مدير حساب مخصص',
      'دعم VIP على مدار الساعة',
    ],
    limitations: [],
    cta: 'تواصل معنا',
    popular: false,
    color: '#d4a843',
  },
  {
    id: 'custom',
    name: 'باقة خاصة',
    price: 4999,
    period: '',
    custom: true,
    features: [
      'رسائل غير محدودة',
      'رابط خاص باسم شركتك',
      'تصميم قوالب حصرية من الصفر',
      'نظام إرسال مخصص بالكامل',
      'API للربط مع أنظمتك',
      'تخصيص كامل للمنصة',
      'تدريب فريقك',
      'دعم تقني دائم + تحديثات',
    ],
    limitations: [],
    cta: 'طلب عرض سعر',
    popular: false,
    color: '#6366f1',
  },
]

export default { templates, exclusiveCompanyTemplates, themes, fonts, pricingPlans }
