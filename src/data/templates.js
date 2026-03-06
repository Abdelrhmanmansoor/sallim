// ═══ القوالب — صور مرفوعة في public/templates/ ═══
// كل قالب هو صورة خلفية حقيقية ترفعها أنت
// ضع الصور في public/templates/ وعدّل المسارات هنا
// أو ارفعها من لوحة التحكم (Dashboard > إدارة القوالب)

export const templates = [
  { id: 1, name: 'قالب ١', image: '/templates/1.png', textColor: '#ffffff' },
  { id: 2, name: 'قالب ٢', image: '/templates/2.png', textColor: '#ffffff' },
  { id: 3, name: 'قالب ٣', image: '/templates/3.png', textColor: '#ffffff' },
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
    id: 'personal',
    name: 'شخصي',
    price: 29,
    period: 'سنة',
    features: [
      'بطاقات غير محدودة',
      'جميع القوالب (20+)',
      'تصدير PNG + PDF',
      'بدون علامة مائية',
      'بنك نصوص كامل (100+)',
      'إرسال فردي عبر واتساب',
      '8 خطوط عربية',
    ],
    limitations: [],
    cta: 'اشترك الآن',
    popular: true,
    color: '#d4a843',
  },
  {
    id: 'business',
    name: 'شركات',
    price: 199,
    period: 'سنة',
    features: [
      'كل مميزات الشخصي',
      'وايت لابل (هوية مخصصة)',
      'إرسال بالك (CSV)',
      'شعار الشركة على البطاقات',
      'لوحة تحكم الشركة',
      'تصدير ZIP جماعي',
      'دعم فني أولوية',
      'تقارير الإرسال',
    ],
    limitations: [],
    cta: 'اشترك للشركات',
    popular: false,
    color: '#0d7a3e',
  },
  {
    id: 'reseller',
    name: 'موزع',
    price: 999,
    period: 'سنة',
    features: [
      'كل مميزات الشركات',
      'إعادة بيع المنصة',
      'API كامل',
      'عدد غير محدود من العملاء',
      'لوحة تحكم الموزع',
      'تخصيص كامل للهوية',
      'نطاق فرعي مخصص',
      'دعم فني VIP',
      'تدريب مجاني',
    ],
    limitations: [],
    cta: 'كن موزعاً',
    popular: false,
    color: '#7c3aed',
  },
]

export default { templates, themes, fonts, pricingPlans }
