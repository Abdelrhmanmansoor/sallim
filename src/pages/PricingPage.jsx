import { Check, Star, Sparkles } from 'lucide-react'

export default function PricingPage() {
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
                        
                        {/* Free Plan */}
                        <div style={{ 
                            background: '#fff', 
                            padding: '48px', 
                            borderRadius: '20px', 
                            border: '2px solid #f0f0f0',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#e5e5e5'
                            e.currentTarget.style.transform = 'translateY(-4px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#f0f0f0'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                        >
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>المجانية</h3>
                                <p style={{ fontSize: '14px', color: '#737373', margin: 0 }}>ابدأ مجانًا</p>
                            </div>
                            
                            <div style={{ marginBottom: '32px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#171717' }}>0</span>
                                <span style={{ fontSize: '16px', color: '#737373' }}> ر.س/شهر</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    10 قوالب أساسية
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    تصميم 5 بطاقات شهريًا
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    جودة صورة متوسطة
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    دعم عبر البريد الإلكتروني
                                </li>
                            </ul>

                            <a
                                href="/editor"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#171717',
                                    background: '#f5f5f5',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e5e5e5'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f5f5f5'
                                }}
                            >
                                ابدأ مجانًا
                            </a>
                        </div>

                        {/* Pro Plan */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #C5A75F, #a8893d)', 
                            padding: '48px', 
                            borderRadius: '20px', 
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(197,167,95,0.3)',
                            transform: 'scale(1.05)',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        >
                            <div style={{ 
                                position: 'absolute',
                                top: '-12px',
                                right: '24px',
                                background: '#fff',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}>
                                <Star style={{ width: '14px', height: '14px', color: '#C5A75F', fill: '#C5A75F' }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#171717' }}>الأكثر شعبية</span>
                            </div>

                            <div style={{ marginBottom: '32px', marginTop: '12px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0c0c0c', marginBottom: '8px' }}>الاحترافية</h3>
                                <p style={{ fontSize: '14px', color: '#0c0c0c', opacity: 0.8, margin: 0 }}>للمبدعين الجادين</p>
                            </div>
                            
                            <div style={{ marginBottom: '32px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#0c0c0c' }}>49</span>
                                <span style={{ fontSize: '16px', color: '#0c0c0c', opacity: 0.8 }}> ر.س/شهر</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    +50 قالب احترافي
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    تصميم غير محدود
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    جودة عالية HD
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    دعم فني أولوي
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    إزالة العلامة المائية
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#0c0c0c' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#C5A75F' }} />
                                    </div>
                                    تصدير بجميع الصيغ
                                </li>
                            </ul>

                            <a
                                href="/checkout"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: '#C5A75F',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                اشترك الآن
                            </a>
                        </div>

                        {/* Enterprise Basic - NEW */}
                        <div style={{ 
                            background: '#fff', 
                            padding: '48px', 
                            borderRadius: '20px', 
                            border: '2px solid #f0f0f0',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#e5e5e5'
                            e.currentTarget.style.transform = 'translateY(-4px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#f0f0f0'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                        >
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>الشركات - التأسيسي</h3>
                                <p style={{ fontSize: '14px', color: '#737373', margin: 0 }}>للشركات الناشئة</p>
                            </div>
                            
                            <div style={{ marginBottom: '32px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#171717' }}>675</span>
                                <span style={{ fontSize: '16px', color: '#737373' }}> ريال/سنة</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    كل ميزات الخطة الاحترافية
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    100 قالب حصري للشركات
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    10 مستخدمين
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    دعم فني عبر البريد
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    تقارير شهرية
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                                    </div>
                                    تخصيص الألوان والشعارات
                                </li>
                            </ul>

                            <a
                                href="/checkout"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#171717',
                                    background: '#f5f5f5',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e5e5e5'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f5f5f5'
                                }}
                            >
                                اشترك الآن
                            </a>
                        </div>

                        {/* Corporate Executive - NEW */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)', 
                            padding: '48px', 
                            borderRadius: '20px', 
                            position: 'relative',
                            boxShadow: '0 20px 40px rgba(220, 38, 38, 0.3)',
                            transform: 'scale(1.05)',
                            transition: 'all 300ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        >
                            <div style={{ 
                                position: 'absolute',
                                top: '-12px',
                                right: '24px',
                                background: '#fff',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}>
                                <Star style={{ width: '14px', height: '14px', color: '#dc2626', fill: '#dc2626' }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#171717' }}>الأعلى سعراً</span>
                            </div>

                            <div style={{ marginBottom: '32px', marginTop: '12px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>الشركات - التنفيذي</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>للمؤسسات الكبرى</p>
                            </div>
                            
                            <div style={{ marginBottom: '32px' }}>
                                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>1688</span>
                                <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}> ريال/سنة</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    كل ميزات باقة التأسيسي
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    300 قالب حصري + خاصية التخصيص
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    50 مستخدمين غير محدود
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    تكامل API كامل
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    دعم فني أولوي 24/7
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    مدير حساب مخصص
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    تقارير تحليلية متقدمة
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#fff' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check style={{ width: '12px', height: '12px', color: '#dc2626' }} />
                                    </div>
                                    تدريب فريق العمل
                                </li>
                            </ul>

                            <a
                                href="/checkout"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: '#dc2626',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                اشترك الآن
                            </a>
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
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>نقبل الدفع عبر البطاقات الائتمانية، تحويل بنكي، وعبر Apple Pay.</p>
                            </div>

                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>هل تقدمون خصومات للشركات؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>نعم، نقدم خصومات خاصة للشركات بناءً على عدد المستخدمين والاشتراك المطلوب.</p>
                            </div>

                            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>كيف أختار باقة الشركات المناسبة؟</h3>
                                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>الباقة التأسيسية (675 ريال) تناسب الشركات الناشئة، بينما الباقة التنفيذية (1688 ريال) تناسب المؤسسات الكبرى مع احتياجات متقدمة.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}