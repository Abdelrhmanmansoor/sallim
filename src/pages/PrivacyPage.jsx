import { Sparkles, Shield } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <Shield style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>خصوصيتك أولاً</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>سياسة الخصوصية</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>آخر تحديث: مارس 2026</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '750px', margin: '0 auto', fontSize: '15px', color: '#475569', lineHeight: 2.2 }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>1. المعلومات التي نجمعها</h2>
                    <p>نحن في منصة سَلِّم نحرص على خصوصية مستخدمينا. عند استخدام المنصة، قد نجمع المعلومات التالية:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>المعلومات الأساسية: الاسم والبريد الإلكتروني عند التسجيل أو الاشتراك</li>
                        <li>بيانات الاستخدام: نوع الجهاز، المتصفح، الصفحات المزارة</li>
                        <li>ملفات تعريف الارتباط (Cookies) لتحسين تجربة الاستخدام</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>2. كيف نستخدم معلوماتك</h2>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>تقديم خدمات تصميم البطاقات وتحسينها</li>
                        <li>إرسال إشعارات متعلقة بالخدمة والتحديثات</li>
                        <li>تحليل الاستخدام لتطوير المنصة</li>
                        <li>معالجة طلبات الاشتراك والدفع</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>3. حماية البيانات</h2>
                    <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الإفصاح عنها. بياناتك مشفرة ومحمية بأحدث تقنيات الأمان.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>4. مشاركة البيانات</h2>
                    <p>لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>بموافقتك الصريحة</li>
                        <li>للامتثال لمتطلبات قانونية</li>
                        <li>مع مزودي خدمات موثوقين يساعدوننا في تشغيل المنصة</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>5. حقوقك</h2>
                    <p>يحق لك طلب الوصول إلى بياناتك الشخصية أو تعديلها أو حذفها في أي وقت عبر التواصل معنا. كما يمكنك إلغاء الاشتراك من رسائلنا البريدية.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>6. التواصل معنا</h2>
                    <p>لأي استفسارات حول سياسة الخصوصية، يُرجى التواصل معنا عبر البريد الإلكتروني: <span style={{ color: '#0d9488', fontWeight: 600 }}>support@sallim.com</span></p>
                </div>
            </section>
        </div>
    )
}
