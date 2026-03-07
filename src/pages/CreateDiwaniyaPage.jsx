import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createDiwaniya, claimDiwaniya } from '../utils/api';
import { ArrowLeft, Sparkles, User, Link2, Loader2 } from 'lucide-react';

export default function CreateDiwaniyaPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', ownerName: '' });
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Check if user is logged in and pre-fill name
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUser(user);
            setFormData(prev => ({ ...prev, ownerName: user.name }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.ownerName) {
            setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة');
            setStatus('error');
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_\-]+$/;
        if (!usernameRegex.test(formData.username)) {
            setErrorMsg('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await createDiwaniya(formData);
            if (res.success) {
                // If user is logged in, claim this diwaniya
                if (user && user.token) {
                    try {
                        await claimDiwaniya(res.data._id);
                    } catch (claimError) {
                        console.warn('Failed to claim diwaniya:', claimError);
                        // Continue even if claim fails
                    }
                }
                setStatus('success');
                setTimeout(() => navigate(`/eid/${res.data.username}`), 1500);
            }
        } catch (error) {
            console.error('Create Diwaniya Error:', error);
            setErrorMsg(error.message || 'حدث خطأ مؤقت، حاول مرة أخرى.');
            setStatus('error');
        }
    };

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>

            {/* HERO */}
            <section style={{ background: '#171717', padding: '100px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div
                        style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            marginBottom: '32px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>ديوانية العيد</span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(36px, 6vw, 56px)',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.2,
                            marginBottom: '24px',
                        }}
                    >
                        أنشئ ديوانيتك<br />
                        <span style={{ color: '#a3a3a3' }}>بلمسة واحدة</span>
                    </h1>

                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                        استقبل تهاني العيد من أصدقائك في ديوانيتك الخاصة
                    </p>
                </div>
            </section>

            {/* CREATE FORM */}
            <section style={{ background: '#fafafa', padding: '80px 24px' }}>
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#10b981',
                                borderRadius: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}>
                                <Sparkles size={40} style={{ color: '#fff' }} />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>تم الإنشاء!</h2>
                            <p style={{ fontSize: '16px', color: '#737373' }}>جاري تحويلك إلى ديوانيتك...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {errorMsg && (
                                <div style={{ padding: '16px 20px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
                                    {errorMsg}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>الاسم الذي يظهر للزوار</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="مثال: عبدالله محمد"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        disabled={status === 'loading'}
                                        maxLength={50}
                                        style={{
                                            width: '100%',
                                            padding: '16px 48px 16px 16px',
                                            background: '#fff',
                                            border: '1px solid #e5e5e5',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>رابط الديوانية (بالأحرف الإنجليزية)</label>
                                <div style={{ position: 'relative' }}>
                                    <Link2 size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                                    <input
                                        type="text"
                                        required
                                        dir="ltr"
                                        placeholder="abdullah"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                                        disabled={status === 'loading'}
                                        maxLength={30}
                                        style={{
                                            width: '100%',
                                            padding: '16px 48px 16px 16px',
                                            background: '#fff',
                                            border: '1px solid #e5e5e5',
                                            borderRadius: '12px',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                            textAlign: 'left',
                                            fontFamily: 'monospace',
                                            fontWeight: 600,
                                        }}
                                    />
                                </div>
                                <div style={{ textAlign: 'left', marginTop: '8px', fontSize: '14px', color: '#737373' }}>
                                    <span style={{ color: '#a3a3a3' }}>sallim.com/eid/</span>
                                    <span style={{ color: '#171717', fontWeight: 700, background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>
                                        {formData.username || 'username'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '16px 32px',
                                    background: '#171717',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span>جاري الإنشاء...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إنشاء ديوانيتي</span>
                                        <Sparkles size={20} />
                                    </>
                                )}
                            </button>

                            {!user && (
                                <div style={{
                                    marginTop: '8px',
                                    padding: '20px',
                                    background: '#fff',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '16px',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>
                                        💡 نصيحة: دوّن حسابك!
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6, marginBottom: '16px' }}>
                                        بإمكانك إنشاء الديوانية كزائر، لكننا ننصحك بشدة بإنشاء حساب مجاني أو تسجيل الدخول لضمان حفظ ديوانيتك وإدارتها لاحقاً وتفعيل ميزات إضافية.
                                    </p>
                                    <Link
                                        to="/login"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            padding: '12px 24px',
                                            background: '#f8fafc',
                                            color: '#3b82f6',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            border: '1px solid #bfdbfe',
                                            transition: 'all 200ms ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#eff6ff'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#f8fafc'
                                        }}
                                    >
                                        تسجيل الدخول / إنشاء حساب
                                    </Link>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </section>

            {/* FEATURES */}
            <section style={{ background: '#fff', padding: '80px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        {[
                            { title: 'تهاني خاصة', desc: 'استقبل رسائل خاصة لا يراها غيرك', icon: '🔒' },
                            { title: 'تهاني عامة', desc: 'اعرض التهاني الجميلة في جدارك', icon: '🌟' },
                            { title: 'مجهول أو مسجل', desc: 'إرسال مع الاسم أو بدون', icon: '👤' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '24px',
                                    background: '#fafafa',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e5e5',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>{f.title}</h3>
                                <p style={{ fontSize: '14px', color: '#737373', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: '#fafafa', padding: '80px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>
                        جاهز للبدء؟
                    </h2>
                    <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px', lineHeight: 1.7 }}>
                        أنشئ ديوانيتك الآن وابدأ في استقبال التهاني من أصدقائك
                    </p>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 28px',
                            background: '#fff',
                            color: '#171717',
                            fontSize: '15px',
                            fontWeight: 600,
                            borderRadius: '12px',
                            textDecoration: 'none',
                            border: '1px solid #e5e5e5',
                            transition: 'all 200ms ease',
                        }}
                    >
                        <ArrowLeft size={18} />
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </section>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}