import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

export default function RefundPage() {
    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <RefreshCw style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>سياسة الاسترداد</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>الإلغاء والاسترداد</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>حقوقك والتزاماتنا</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '15px', color: '#475569', lineHeight: 2.2 }}>
                    <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: '32px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #fde68a' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', margin: 0 }}>فترة التجربة</p>
                        <p style={{ margin: '0', fontSize: '14px', lineHeight: 1.7 }}>يمكنك طلب استرداد كامل خلال ٧ أيام من تاريخ الاشتراك، دون أي أسئلة.</p>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>سياسة الاسترداد</h2>
                    <p>في منصة سَلِّم، نؤمن برضاكم الكامل. لذا وضعنا سياسة استرداد واضحة وعادلة:</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '24px' }}>
                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle style={{ width: '20px', height: '20px', color: '#fff' }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>استرداد كامل</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>خلال ٧ أيام من الاشتراك، يمكنك الحصول على استرداد كامل.</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AlertCircle style={{ width: '20px', height: '20px', color: '#fff' }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>بعد ٧ أيام</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>لا يتم قبول طلبات الاسترداد بعد مرور فترة الـ ٧ أيام.</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <RefreshCw style={{ width: '20px', height: '20px', color: '#fff' }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>الإلغاء</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>يمكنك إلغاء الاشتراك في أي وقت، وتستمر الخدمة حتى نهاية الفترة.</p>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>الشروط والأحكام</h2>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>يُشترط عدم استخدام الخدمة بشكل مكثف قبل طلب الاسترداد</li>
                        <li>يجب ألا يكون قد تم استخدام الميزات الخاصة بالاشتراك المدفوع</li>
                        <li>الاسترداد يطبق على أول اشتراك فقط</li>
                        <li>يجب تقديم طلب الاسترداد عبر البريد الإلكتروني</li>
                        <li>يتم معالجة الاسترداد خلال ٥-١٠ أيام عمل</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>طريقة طلب الاسترداد</h2>
                    <p>لطلب استرداد الأموال:</p>
                    <ol style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>أرسل بريد إلكتروني إلى <span style={{ color: '#0d9488', fontWeight: 600 }}>support@sallim.com</span></li>
                        <li>ضع عنوان "طلب استرداد" في موضوع الرسالة</li>
                        <li>أرفق معلومات حسابك وتاريخ الاشتراك</li>
                        <li>اشرح سبب طلب الاسترداد (اختياري)</li>
                        <li>سنتواصل معك خلال ٢٤ ساعة</li>
                    </ol>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>الاستثناءات</h2>
                    <p>قد لا نتمكن من منح استرداد في الحالات التالية:</p>
                    <ul style={{ paddingRight: '24px', margin: '12px 0' }}>
                        <li>تم استخدام الخدمة بشكل مكثف قبل الطلب</li>
                        <li>طلب الاسترداد بعد انتهاء فترة الـ ٧ أيام</li>
                        <li>الاشتراكات المتكررة لنفس الحساب</li>
                        <li>انتهاك شروط الخدمة وأحكام الاستخدام</li>
                    </ul>

                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: '40px' }}>الأسئلة الشائعة</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>كم يستغرق الحصول على الاسترداد؟</h3>
                            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>يتم معالجة الاسترداد خلال ٥-١٠ أيام عمل، اعتمادًا على البنك أو بوابة الدفع المستخدمة.</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>هل سأخسر الوصول للخدمة فورًا بعد الطلب؟</h3>
                            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>لا، يمكنك الاستمرار في استخدام الخدمة حتى تاريخ التجديد القادم.</p>
                        </div>

                        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>ماذا لو واجهت مشكلة تقنية؟</h3>
                            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.7 }}>تواصل معنا فورًا وسنعمل على حل المشكلة. إذا لم نتمكن من ذلك، سنمنحك استردادًا.</p>
                        </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #C5A75F, #a8893d)', padding: '32px', borderRadius: '16px', marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0c0c0c', marginBottom: '12px', margin: '0 0 12px 0' }}>هل تحتاج مساعدة؟</p>
                        <p style={{ fontSize: '15px', color: '#0c0c0c', marginBottom: '24px', lineHeight: 1.8, margin: '0 0 24px 0' }}>فريق الدعم متاح للمساعدة في أي استفسار بخصوص الاسترداد</p>
                        <a
                            href="/contact"
                            style={{
                                display: 'inline-block',
                                padding: '14px 32px',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#0c0c0c',
                                background: '#fff',
                                borderRadius: '10px',
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
                            تواصل معنا
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}