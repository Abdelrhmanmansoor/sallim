import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginUser(formData);
            if (res.success) {
                // Save token and user data
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                window.dispatchEvent(new Event('user-update'));

                // Redirect based on role
                if (formData.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (formData.role === 'company') {
                    navigate('/company/dashboard');
                } else {
                    navigate('/dashboard/diwaniya');
                }
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '32px',
                        fontSize: '15px',
                        color: '#737373',
                        textDecoration: 'none',
                        transition: 'all 200ms ease',
                    }}
                >
                    <ArrowLeft size={18} />
                    العودة للرئيسية
                </Link>

                <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#171717', marginBottom: '8px', textAlign: 'center' }}>
                        تسجيل الدخول
                    </h1>
                <p style={{ fontSize: '15px', color: '#737373', textAlign: 'center', marginBottom: '16px' }}>
                        أهلاً بك مجدداً في ديوانيات العيد
                    </p>

                    {/* Account Type Selection */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717', marginBottom: '8px', display: 'block', textAlign: 'center' }}>
                            نوع الحساب
                        </label>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    background: formData.role === 'user' ? '#171717' : '#fff',
                                    color: formData.role === 'user' ? '#fff' : '#737373',
                                    border: formData.role === 'user' ? '2px solid #171717' : '2px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                مستخدم
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'company' })}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    background: formData.role === 'company' ? '#171717' : '#fff',
                                    color: formData.role === 'company' ? '#fff' : '#737373',
                                    border: formData.role === 'company' ? '2px solid #171717' : '2px solid #e5e5e5',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                شركة
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            fontSize: '14px',
                            color: '#dc2626'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>البريد الإلكتروني</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@email.com"
                                    disabled={loading}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 44px 14px 16px',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 200ms ease',
                                        direction: 'rtl',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>كلمة المرور</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="•••••••••"
                                    disabled={loading}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 44px 14px 16px',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 200ms ease',
                                        direction: 'rtl',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 24px',
                                background: '#171717',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 700,
                                borderRadius: '10px',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 200ms ease',
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                    جاري الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e5e5' }}>
                        <p style={{ fontSize: '14px', color: '#737373' }}>
                            ليس لديك حساب؟{' '}
                            <Link to="/register" style={{ color: '#171717', fontWeight: 600, textDecoration: 'none' }}>
                                إنشاء حساب جديد
                            </Link>
                        </p>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#a3a3a3' }}>
                    أو{' '}
                    <Link to="/create-diwaniya" style={{ color: '#171717', fontWeight: 600, textDecoration: 'none' }}>
                        إنشاء ديوانية بدون حساب
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}