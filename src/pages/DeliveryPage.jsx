import { Truck, Clock, Shield } from 'lucide-react'

export default function DeliveryPage() {
    return (
        <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <Truck style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>سياسة التوصيل</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>الشحن والتوصيل</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>كل ما تحتاج معرفته عن عملية التوصيل</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '15px', color: '#475569', lineHeight: 2.2 }}>
                    <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)', padding: '32px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #ccfbf1' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', margin: 0 }}>خدمة رقمية فورية</p>
                        <p style={{ margin: '0', fontSize: '14px', lineHeight: 1.7 }}>جميع خدماتنا رقمية، التوصيل يتم فوريًا عبر البريد الإلكتروني أو تحميل مباشر من الحساب.</p>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>طريقة التوصيل</h2>
                    <p>بما أن منصة سَلِّم تقدم خدمات رقمية بالكامل، فإن عملية "التوصيل" تتم على النحو التالي:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>بعد إتمام عملية الدفع، ستصلك رسالة تأكيد على البريد الإلكتروني</li>
                        <li>الخدمة ستكون متاحة فورًا في حسابك على المنصة</li>
                        <li>يمكنك تحميل جميع التصاميم والبطاقات فورًا</li>
                        <li>لا توجد رسوم شحن أو تأخير في التوصيل</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>الخطط المدفوعة</h2>
                    <p>للاشتراكات والخطط المدفوعة:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>تفعيل الاشتراك يتم فورًا بعد نجاح عملية الدفع</li>
                        <li>ستتلقى بريد إلكتروني بتأكيد الاشتراك وتاريخ التجديد</li>
                        <li>يمكنك الاستفادة من جميع الميزات المدفوعة على الفور</li>
                        <li>في حالة تأخير التفعيل لأكثر من ٥ دقائق، يُرجى التواصل معنا</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>المدة الزمنية</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
                        <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <Clock style={{ width: '24px', height: '24px', color: '#fff' }} />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', margin: '0 0 4px 0' }}>الخدمة الأساسية</p>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>فورية</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <Shield style={{ width: '24px', height: '24px', color: '#fff' }} />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', margin: '0 0 4px 0' }}>الاشتراكات</p>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>تلقائي</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #C5A75F, #a8893d)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <Truck style={{ width: '24px', height: '24px', color: '#fff' }} />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', margin: '0 0 4px 0' }}>التصاميم</p>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>فوري</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>التعامل مع المشاكل</h2>
                    <p>في حال واجهتك أي مشكلة في الحصول على الخدمة:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>تحقق من البريد الإلكتروني المسجل في حسابك (بما في ذلك مجلد الرسائل غير المرغوب فيها)</li>
                        <li>سجل الدخول إلى حسابك وتحقق من قسم الاشتراكات</li>
                        <li>اتصل بفريق الدعم الفني عبر البريد الإلكتروني: <span style={{ color: '#0d9488', fontWeight: 600 }}>support@sallim.com</span></li>
                        <li>فريق الدعم متاح للمساعدة خلال ٢٤ ساعة في أيام العمل</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>ملاحظات هامة</h2>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>جميع الخدمات رقمية ولا تتطلب شحنًا ماديًا</li>
                        <li>تأكد من صحة عنوان البريد الإلكتروني عند التسجيل</li>
                        <li>احتفظ برسائل التأكيد كدليل على الشراء</li>
                        <li>لأي استفسارات، نحن هنا لمساعدتك</li>
                    </ul>

                    <div style={{ background: 'linear-gradient(135deg, #C5A75F, #a8893d)', padding: '32px', borderRadius: '16px', marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0c0c0c', marginBottom: '12px', margin: '0 0 12px 0' }}>هل تحتاج مساعدة؟</p>
                        <p style={{ fontSize: '15px', color: '#0c0c0c', marginBottom: '24px', lineHeight: 1.8, margin: '0 0 24px 0' }}>فريق الدعم متاح للإجابة على جميع استفساراتك</p>
                        <a
                            href="/contact"
                            style={{
                                display: 'inline-block',
                                padding: '14px 32px',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#fff',
                                background: '#171717',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'all 200ms ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            تواصل معنا
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}