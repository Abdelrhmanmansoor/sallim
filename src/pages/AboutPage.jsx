import { Heart, Target, Users, Award, Shield } from 'lucide-react'

export default function AboutPage() {
    return (
        <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <Heart style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>قصتنا</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>عن منصة سَلِّم</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>نحتفل بالعيد بطريقة مبتكرة ومميزة</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Mission */}
                    <div style={{ marginBottom: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #C5A75F, #a8893d)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Target style={{ width: '24px', height: '24px', color: '#fff' }} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>رؤيتنا</h2>
                        </div>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 2, marginBottom: '20px' }}>
                            سَلِّم هي منصة عربية مبتكرة تهدف إلى إعادة إحياء تقاليد التهاني بالعيد بأسلوب عصري ومتقن. نؤمن بأن العيد ليس مجرد مناسبة، بل هو لحظات سعدة ووصال تُخلد في الذاكرة.
                        </p>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 2 }}>
                            نحرص على تمكين الجميع من تصميم بطاقات تهنئة احترافية تعبر عن مشاعرهم بسهولة، مع الحفاظ على الطابع السعودي والعربي الأصيل.
                        </p>
                    </div>

                    {/* Values */}
                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '32px' }}>قيمنا</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            <div style={{ padding: '32px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                                <Award style={{ width: '32px', height: '32px', color: '#C5A75F', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>الجودة</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>نقدم قوالب وتصاميم عالية الجودة تلبي تطلعات المستخدمين</p>
                            </div>
                            <div style={{ padding: '32px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                                <Heart style={{ width: '32px', height: '32px', color: '#C5A75F', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>الأصالة</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>تصاميم مستوحاة من التراث السعودي والعربي بلمسة عصرية</p>
                            </div>
                            <div style={{ padding: '32px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                                <Users style={{ width: '32px', height: '32px', color: '#C5A75F', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>الوصال</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>نسهل التواصل والتهاني بين الأحبة والأهل والأصدقاء</p>
                            </div>
                        </div>
                    </div>

                    {/* Story */}
                    <div style={{ padding: '40px', background: 'linear-gradient(135deg, #fef9e7, #fffbeb)', borderRadius: '20px', border: '2px solid #C5A75F' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>كيف بدأنا؟</h2>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 2, marginBottom: '16px' }}>
                            نشأت فكرة سَلِّم من حاجة حقيقية لإعادة إحياء تقليد التهاني بالعيد الذي بدأ يتلاشى في ظل التطور التقني. أردنا أن نقدم منصة تجمع بين الأصالة والعصرية، تمكن الجميع من التعبير عن مشاعرهم بطريقة مميزة.
                        </p>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 2 }}>
                            اليوم، نفتخر بخدمة آلاف المستخدمين ونواصل التطوير والإبداع لتقديم أفضل تجربة ممكنة.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}