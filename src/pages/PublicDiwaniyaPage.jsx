import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiwaniya, addDiwaniyaGreeting, likeDiwaniyaGreeting, getEidiyaGame } from '../utils/api';
import { ArrowLeft, Send, Heart, Calendar, Share2, MessageCircle, Loader2, Download, Gift, X } from 'lucide-react';
import DiwaniyaImageGenerator from '../components/DiwaniyaImageGenerator';
import EidiyaGame from '../components/EidiyaGame';

export default function PublicDiwaniyaPage() {
    const { username } = useParams();
    const [diwaniya, setDiwaniya] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGreeting, setNewGreeting] = useState(null);
    const [showGame, setShowGame] = useState(false);
    const [gameEnabled, setGameEnabled] = useState(false);

    const [formState, setFormState] = useState({ senderName: '', message: '', isAnonymous: true, senderAvatar: '' });

    // Load user avatar on mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setFormState(prev => ({ ...prev, senderAvatar: user.avatar || '' }));
        }
    }, []);
    const [submitStatus, setSubmitStatus] = useState('idle');

    useEffect(() => {
        async function fetchDiwaniya() {
            try {
                const res = await getDiwaniya(username);
                if (res.data && res.data.greetings) {
                    res.data.greetings = res.data.greetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                setDiwaniya(res.data);
                
                // Check if game is enabled
                const gameRes = await getEidiyaGame(username);
                setGameEnabled(gameRes.data && gameRes.data.enabled);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchDiwaniya();
    }, [username]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `أرسلت لك تهنئة العيد في ديوانيتي، شاركني فرحتك هنا: ${url}`;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('تم نسخ الرابط');
                break;
        }
    };

    const handleGreetingSubmit = async (e) => {
        e.preventDefault();
        if (!formState.message) return;

        if (!formState.isAnonymous && !formState.senderName) {
            alert('يرجى إدخال اسمك');
            return;
        }

        setSubmitStatus('loading');
        try {
            const res = await addDiwaniyaGreeting(username, { ...formState, visibility: 'public' });
            if (res.success) {
                setNewGreeting(res.data);
                setDiwaniya(prev => ({
                    ...prev,
                    greetings: [res.data, ...prev.greetings],
                    totalGreetings: prev.totalGreetings + 1
                }));
                setFormState({ senderName: '', message: '', isAnonymous: true, senderAvatar: formState.senderAvatar });
                setSubmitStatus('success');
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setNewGreeting(null);
                }, 4000);
            }
        } catch (err) {
            alert('حدث خطأ أثناء الإرسال');
            setSubmitStatus('error');
        }
    };

    const handleLike = async (greetId) => {
        try {
            const res = await likeDiwaniyaGreeting(username, greetId);
            if (res.success) {
                setDiwaniya(prev => ({
                    ...prev,
                    greetings: prev.greetings.map(g =>
                        g._id === greetId ? { ...g, likes: res.data } : g
                    )
                }));
            }
        } catch (err) {
            console.error('Like failed', err);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#171717' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '24px' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>لم يتم العثور على الديوانية</h1>
                    <p style={{ fontSize: '16px', color: '#737373', marginBottom: '24px' }}>الرابط غير متاح حالياً أو قد تم تغييره</p>
                    <Link
                        to="/create-diwaniya"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '14px 28px',
                            background: '#171717',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 600,
                            borderRadius: '12px',
                            textDecoration: 'none',
                        }}
                    >
                        أنشئ ديوانيتك
                        <ArrowLeft size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    if (showGame) {
        return <EidiyaGame username={username} onClose={() => setShowGame(false)} />;
    }

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
                        عيد مبارك<br />
                        <span style={{ color: '#a3a3a3' }}>يا {diwaniya.ownerName}</span>
                    </h1>

                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                        اترك بصمتك الجميلة بتهنئة خاصة في ديوانية العيد
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{diwaniya.totalGreetings || diwaniya.greetings.length}</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>تهنئة</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{diwaniya.views || 0}</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>زيارة</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GAME BUTTON - Only show if game is enabled */}
            {gameEnabled && (
                <section style={{ background: 'linear-gradient(135deg, #d4af37, #f5d67b)', padding: '40px 24px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <Gift size={48} color="#fff" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                            تحدي العيدية 🎁
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
                            أجب على الأسئلة واربح عيديتك! جرب حظك الآن
                        </p>
                        <button
                            onClick={() => setShowGame(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                padding: '16px 48px',
                                background: '#fff',
                                color: '#d4af37',
                                fontSize: '18px',
                                fontWeight: 700,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <Gift size={20} />
                            ابدأ التحدي
                        </button>
                    </div>
                </section>
            )}

            {/* GREETING FORM */}
            <section style={{ background: '#fafafa', padding: '80px 24px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#171717', marginBottom: '8px', textAlign: 'center' }}>أرسل تهنئة</h2>
                    <p style={{ fontSize: '16px', color: '#737373', textAlign: 'center', marginBottom: '40px' }}>شارك فرحة العيد مع {diwaniya.ownerName}</p>

                    <form onSubmit={handleGreetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderRadius: '12px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#171717' }}>إرسال كمجهول</span>
                            <label style={{ position: 'relative', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formState.isAnonymous}
                                    onChange={(e) => setFormState({ ...formState, isAnonymous: e.target.checked })}
                                    style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                />
                                <div style={{
                                    width: '48px',
                                    height: '26px',
                                    background: formState.isAnonymous ? '#171717' : '#e5e5e5',
                                    borderRadius: '100px',
                                    transition: 'all 200ms ease',
                                    position: 'relative',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '3px',
                                        right: formState.isAnonymous ? '3px' : 'auto',
                                        left: formState.isAnonymous ? 'auto' : '3px',
                                        width: '20px',
                                        height: '20px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 200ms ease',
                                    }}></div>
                                </div>
                            </label>
                        </div>

                        {!formState.isAnonymous && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="اسمك"
                                    value={formState.senderName}
                                    onChange={(e) => setFormState({ ...formState, senderName: e.target.value })}
                                    maxLength={50}
                                    disabled={submitStatus === 'loading'}
                                    style={{
                                        padding: '16px 20px',
                                        background: '#fff',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 200ms ease',
                                    }}
                                />
                            </div>
                        )}

                        <textarea
                            required
                            placeholder="اكتب تهنئتك هنا..."
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            maxLength={300}
                            rows={4}
                            disabled={submitStatus === 'loading'}
                            style={{
                                padding: '16px 20px',
                                background: '#fff',
                                border: '1px solid #e5e5e5',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                resize: 'none',
                                transition: 'all 200ms ease',
                                lineHeight: 1.6,
                            }}
                        ></textarea>

                        <button
                            type="submit"
                            disabled={submitStatus === 'loading' || !formState.message}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '16px 32px',
                                background: submitStatus === 'success' ? '#10b981' : '#171717',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 700,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
                                transition: 'all 200ms ease',
                            }}
                        >
                            {submitStatus === 'loading' ? (
                                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : submitStatus === 'success' ? (
                                'تم الإرسال'
                            ) : (
                                <>
                                    <span>إرسال التهنئة</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {/* GREETINGS WALL */}
            <section style={{ background: '#fff', padding: '80px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>التهاني</span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
                            جدار التهاني العامة
                        </h2>
                    </div>

                    {diwaniya.greetings.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {diwaniya.greetings.map((g, idx) => (
                                <div
                                    key={g._id}
                                    style={{
                                        padding: '24px',
                                        background: newGreeting?._id === g._id ? '#f0fdf4' : '#fafafa',
                                        border: newGreeting?._id === g._id ? '1px solid #86efac' : '1px solid #e5e5e5',
                                        borderRadius: '16px',
                                        transition: 'all 300ms ease',
                                        animation: newGreeting?._id === g._id ? 'glow 2s ease-in-out' : 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        {g.senderAvatar && !g.isAnonymous ? (
                                            <img
                                                src={g.senderAvatar}
                                                alt={g.senderName}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: '#171717',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                fontWeight: 700,
                                                color: '#fff',
                                            }}>
                                                {g.isAnonymous ? '?' : g.senderName.charAt(0)}
                                            </div>
                                        )}
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#171717', marginBottom: '4px' }}>
                                                {g.isAnonymous ? 'مجهول الهوية' : g.senderName}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={14} style={{ color: '#a3a3a3' }} />
                                                <span style={{ fontSize: '12px', color: '#737373' }}>{formatDate(g.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '15px', color: '#525252', lineHeight: 1.7, marginBottom: '16px' }}>
                                        "{g.message}"
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
                                            onClick={() => handleLike(g._id)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '10px 16px',
                                                background: g.likes > 0 ? '#fef2f2' : 'transparent',
                                                border: '1px solid transparent',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: g.likes > 0 ? '#ef4444' : '#a3a3a3',
                                                cursor: 'pointer',
                                                transition: 'all 200ms ease',
                                            }}
                                        >
                                            <Heart size={16} style={{ fill: g.likes > 0 ? '#ef4444' : 'none' }} />
                                            {g.likes > 0 ? g.likes : 'أعجبني'}
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                alert('ميزة تحميل الصورة قادمة قريباً!');
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '10px 16px',
                                                background: '#f0fdf4',
                                                border: '1px solid #86efac',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: '#10b981',
                                                cursor: 'pointer',
                                                transition: 'all 200ms ease',
                                            }}
                                            title="تحميل كصورة"
                                        >
                                            <Download size={16} />
                                            تحميل
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fafafa', borderRadius: '16px' }}>
                            <p style={{ fontSize: '18px', color: '#737373' }}>لا توجد تهاني عامة بعد</p>
                            <p style={{ fontSize: '14px', color: '#a3a3a3', marginTop: '8px' }}>كن أول من يهنئ {diwaniya.ownerName}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* SHARE SECTION */}
            <section style={{ background: '#fafafa', padding: '80px 24px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>شارك ديوانيتك</h2>
                    <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px' }}>كلما زاد النشر زادت المحبة</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => handleShare('whatsapp')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 24px',
                                background: '#25D366',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: 600,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                            }}
                        >
                            <MessageCircle size={18} />
                            واتساب
                        </button>
                        <button
                            onClick={() => handleShare('copy')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 24px',
                                background: '#171717',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: 600,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                            }}
                        >
                            <Share2 size={18} />
                            نسخ الرابط
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                        <p style={{ fontSize: '13px', color: '#737373', marginBottom: '8px' }}>رابط ديوانيتك</p>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#171717', wordBreak: 'break-all' }}>
                            {window.location.href}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    50% { box-shadow: 0 8px 24px rgba(16,185,129,0.15); }
                }
            `}</style>
        </div>
    );
}