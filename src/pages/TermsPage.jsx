import { FileText } from 'lucide-react'

export default function TermsPage() {
    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <FileText style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>شروط الاستخدام</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>الشروط والأحكام</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>آخر تحديث: مارس 2026</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '750px', margin: '0 auto', fontSize: '15px', color: '#475569', lineHeight: 2.2 }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>1. القبول بالشروط</h2>
                    <p>باستخدامك لمنصة سَلِّم، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام المنصة.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>2. وصف الخدمة</h2>
                    <p>سَلِّم هي منصة عربية لتصميم بطاقات تهنئة العيد. تتيح لك تصميم البطاقات وتخصيصها ومشاركتها عبر وسائل التواصل المختلفة.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>3. الاستخدام المسموح</h2>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>استخدام المنصة لأغراض شرعية ومشروعة فقط</li>
                        <li>عدم استخدام المنصة لإنشاء محتوى مسيء أو غير لائق</li>
                        <li>عدم محاولة اختراق أو تعطيل أنظمة المنصة</li>
                        <li>عدم نسخ أو إعادة توزيع قوالب المنصة</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>4. الاشتراكات والدفع</h2>
                    <p>تتوفر خطط مجانية ومدفوعة. الاشتراكات المدفوعة سنوية وغير قابلة للاسترداد بعد ٧ أيام من التفعيل. يمكنك إلغاء الاشتراك في أي وقت مع استمرار الخدمة حتى نهاية الفترة المدفوعة.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>5. الملكية الفكرية</h2>
                    <p>جميع القوالب والتصاميم والعلامات التجارية الخاصة بمنصة سَلِّم محمية بحقوق الملكية الفكرية. البطاقات التي تصممها تبقى ملكاً لك مع مراعاة حقوق القوالب المستخدمة.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>6. حدود المسؤولية</h2>
                    <p>المنصة تُقدَّم "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام المنصة أو عدم القدرة على استخدامها.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>7. التعديلات</h2>
                    <p>نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية. استمرارك في استخدام المنصة يعني موافقتك على الشروط المحدثة.</p>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>8. التواصل</h2>
                    <p>لأي استفسارات: <span style={{ color: '#0d9488', fontWeight: 600 }}>support@sallim.com</span></p>
                </div>
            </section>
        </div>
    )
}
