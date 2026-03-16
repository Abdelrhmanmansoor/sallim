import { Check, Star, Sparkles } from 'lucide-react'

export default function PricingPage() {
    const checkIcon = (color) => (
        <div style={{ width: '20px', height: '20px', background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
        </div>
    )

    const checkIconDark = (color) => (
        <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check style={{ width: '12px', height: '12px', color }} />
        </div>
    )

    return (
        <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '76px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <Sparkles style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>خطط تناسب الجميع</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>الأسعار</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>اختر الخطة المثالية لاحتياجاتك</p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'start' }}>
                        
                        {/* Free Plan */}
                        <div style={{ 
                            background: '#fff', 
                            padding: '40px 32px', 
                            borderRadius: '20px', 
                            border: '2px solid #f0f0f0',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>المجانية</h3>
                                <p style={{ fontSize: '14px', color: '#737373', margin: 0 }}>للاستخدام الشخصي</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#171717' }}>0</span>
                                <span style={{ fontSize: '16px', color: '#737373' }}> ر.س</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['تصميم غير محدود', 'تصدير عالي الجودة', 'مشاركة فورية', 'قوالب أساسية مجانية'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                        {checkIcon('#10b981')}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="/editor" style={{ display: 'block', width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, color: '#171717', background: '#f5f5f5', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', transition: 'all 200ms ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e5e5' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5' }}
                            >ابدأ مجاناً</a>
                        </div>

                        {/* Starter — 149 SAR one-time */}
                        <div style={{ 
                            background: '#fff', 
                            padding: '40px 32px', 
                            borderRadius: '20px', 
                            border: '2px solid #f0f0f0',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>باقة البداية</h3>
                                <p style={{ fontSize: '14px', color: '#737373', margin: 0 }}>للاستخدام لمرة واحدة — حتى 50 بطاقة</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#171717' }}>149</span>
                                <span style={{ fontSize: '16px', color: '#737373' }}> ر.س</span>
                                <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>دفعة واحدة فقط</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['حتى 50 بطاقة', 'جميع القوالب الأساسية (30+)', 'تخصيص الألوان والخطوط', 'بدون علامة مائية', 'مشاركة عبر رابط أو واتساب', 'تنزيل البطاقات بجودة عالية'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                        {checkIcon('#0ea5e9')}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="/checkout?plan=starter" style={{ display: 'block', width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, color: '#fff', background: '#0ea5e9', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', transition: 'all 200ms ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#0284c7' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#0ea5e9' }}
                            >اشترِ الآن</a>
                        </div>

                        {/* Business — 599 SAR/year (Popular) */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #a855f7, #7e22ce)', 
                            padding: '40px 32px', 
                            borderRadius: '20px', 
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(168,85,247,0.3)',
                            transform: 'scale(1.03)',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
                        >
                            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#fff', padding: '6px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <Star style={{ width: '14px', height: '14px', color: '#a855f7', fill: '#a855f7' }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#171717' }}>الأكثر طلباً</span>
                            </div>
                            <div style={{ marginBottom: '24px', marginTop: '12px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>باقة الأعمال</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>للشركات الصغيرة والمتوسطة — حتى 500 بطاقة</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>599</span>
                                <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}> ر.س / سنة</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['حتى 500 بطاقة سنوياً', 'جميع المواسم والمناسبات', 'شعار الشركة على البطاقات', 'قوالب حصرية (50+)', 'إرسال جماعي CSV/Excel', 'جدولة الإرسال', 'تقارير وإحصائيات', 'دعم فني أولوية'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                        {checkIconDark('#a855f7')}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="/checkout?plan=business" style={{ display: 'block', width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700, color: '#a855f7', background: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', transition: 'all 200ms ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                            >اشترك الآن</a>
                        </div>

                        {/* Enterprise — 1,999 SAR/year */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #d4af37, #b8860b)', 
                            padding: '40px 32px', 
                            borderRadius: '20px', 
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(212,175,55,0.3)',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#fff', padding: '6px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <Star style={{ width: '14px', height: '14px', color: '#d4af37', fill: '#d4af37' }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#171717' }}>المؤسسي</span>
                            </div>
                            <div style={{ marginBottom: '24px', marginTop: '12px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>الباقة المؤسسية</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>للشركات الكبرى — حتى 5,000 بطاقة + أعياد ميلاد</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>1,999</span>
                                <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}> ر.س / سنة</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['حتى 5,000 بطاقة سنوياً', 'كل المواسم + أعياد ميلاد الموظفين', 'مناسبات شخصية (ترقية، زواج...)', 'هوية الشركة كاملة', 'قوالب مخصصة حسب الطلب', 'ربط مع نظام HR', 'جدولة ذكية + إرسال تلقائي', 'تقارير مفصّلة + لوحة تحكم', 'مدير حساب مخصص + دعم VIP'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                        {checkIconDark('#d4af37')}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://wa.me/966597009498?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D9%85%D8%A4%D8%B3%D8%B3%D9%8A%D8%A9" target="_blank" rel="noopener noreferrer" 
                                onClick={() => { if (typeof snaptr !== 'undefined') { snaptr('track', 'CUSTOM_EVENT_1') } }}
                                style={{ display: 'block', width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700, color: '#d4af37', background: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', transition: 'all 200ms ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                            >تواصل معنا عبر واتساب</a>
                        </div>

                        {/* Custom — 4,999 SAR */}
                        <div style={{ 
                            background: '#fff', 
                            padding: '40px 32px', 
                            borderRadius: '20px', 
                            border: '2px solid #e0e7ff',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>الباقة الخاصة</h3>
                                <p style={{ fontSize: '14px', color: '#737373', margin: 0 }}>تصميم وتطوير حسب الطلب بالكامل</p>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#6366f1' }}>4,999</span>
                                <span style={{ fontSize: '16px', color: '#737373' }}> ر.س</span>
                                <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>رابط خاص + نظام مخصص + رسائل غير محدودة</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['رسائل غير محدودة', 'رابط خاص باسم شركتك', 'تصميم قوالب حصرية من الصفر', 'نظام إرسال مخصص بالكامل', 'API للربط مع أنظمتك', 'هوية بصرية متكاملة', 'تدريب فريقك', 'دعم تقني دائم + تحديثات'].map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                        {checkIcon('#6366f1')}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://wa.me/966597009498?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9" target="_blank" rel="noopener noreferrer" 
                                onClick={() => { if (typeof snaptr !== 'undefined') { snaptr('track', 'CUSTOM_EVENT_1') } }}
                                style={{ display: 'block', width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #6366f1, #4338ca)', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', transition: 'all 200ms ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                            >طلب عرض سعر</a>
                        </div>

                    </div>

                    {/* FAQ Section */}
                    <div style={{ marginTop: '80px', maxWidth: '800px', margin: '80px auto 0' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '32px', textAlign: 'center' }}>أسئلة شائعة</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>هل يمكنني إلغاء الاشتراك في أي وقت؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>نعم، يمكنك إلغاء الاشتراك في أي وقت وستستفيد من الخدمة حتى نهاية الفترة المدفوعة.</p>
                            </div>
                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>ما هي طرق الدفع المتاحة؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>نقبل الدفع عبر البطاقات الائتمانية، PayPal، وتحويل بنكي.</p>
                            </div>
                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>ما الفرق بين باقة البداية وباقة الأعمال؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>باقة البداية (79 ر.س) للاستخدام لمرة واحدة حتى 20 اسم. باقة الأعمال (199 ر.س/سنة) للاستخدام المتكرر حتى 500 رسالة مع كل المواسم.</p>
                            </div>
                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>كيف أختار الباقة المناسبة لشركتي؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>الباقة المؤسسية (1,499 ر.س/سنة) تناسب الشركات الكبرى مع 10,000 رسالة وأعياد ميلاد الموظفين. الباقة الخاصة (2,500 ر.س) لمن يريد نظام مخصص بالكامل برابط خاص.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}