import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDiwaniya, getDiwaniyaManage, updateDiwaniyaGreetingVisibility, deleteDiwaniyaGreeting } from '../utils/api';
import { ArrowLeft, Copy, Eye, EyeOff, Trash2, MessageCircle, Loader2 } from 'lucide-react';

export default function DiwaniyaDashboardPage() {
    const navigate = useNavigate();
    const [diwaniyas, setDiwaniyas] = useState([]);
    const [diwaniya, setDiwaniya] = useState(null);
    const [greetings, setGreetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // First try to load from localStorage for quick render
        const loadInitialData = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.diwaniyas && user.diwaniyas.length > 0) {
                    setDiwaniyas(user.diwaniyas);
                    setDiwaniya(user.diwaniyas[0]);

                    const username = user.diwaniyas[0].username;
                    getDiwaniyaManage(username)
                        .then(res => {
                            if (res.success) {
                                setDiwaniya(res.data);
                                setGreetings(res.data.greetings || []);
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching diwaniya:', err);
                            setError(true);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadInitialData();

        // Then fetch latest user profile to ensure we have the newest diwaniyas
        import('../utils/api').then(({ getUserProfile }) => {
            getUserProfile()
                .then(res => {
                    if (res.success && res.data) {
                        // Update localStorage with fresh data
                        localStorage.setItem('user', JSON.stringify(res.data));

                        if (res.data.diwaniyas && res.data.diwaniyas.length > 0) {
                            // If we didn't already load a diwaniya from local storage, 
                            // or if we want to ensure we have all of them loaded into state:
                            setDiwaniyas(res.data.diwaniyas);

                            // If this is the first load and we previously had no diwaniyas, load the first one
                            setDiwaniya(prevDiwaniya => {
                                if (!prevDiwaniya) {
                                    const username = res.data.diwaniyas[0].username;
                                    getDiwaniyaManage(username)
                                        .then(dRes => {
                                            if (dRes.success) {
                                                setDiwaniya(dRes.data);
                                                setGreetings(dRes.data.greetings || []);
                                            }
                                        })
                                        .catch(err => console.error('Error fetching diwaniya:', err))
                                        .finally(() => setLoading(false));

                                    return res.data.diwaniyas[0];
                                }
                                return prevDiwaniya;
                            });
                        }
                    }
                })
                .catch(err => console.error('Error fetching fresh user profile:', err));
        });
    }, []);

    const handleCopyLink = () => {
        const url = `${window.location.origin}/eid/${diwaniya?.username}`;
        navigator.clipboard.writeText(url);
        alert('تم نسخ الرابط');
    };

    const handleToggleVisibility = async (greetId) => {
        if (!diwaniya?.username) {
            alert('لا يمكن تحديث الرؤية');
            return;
        }

        const greeting = greetings.find(g => g._id === greetId);
        const newVisibility = greeting.visibility === 'public' ? 'private' : 'public';

        try {
            const res = await updateDiwaniyaGreetingVisibility(diwaniya.username, greetId, newVisibility);
            if (res.success) {
                setGreetings(prev => prev.map(g =>
                    g._id === greetId ? { ...g, visibility: newVisibility } : g
                ));
            }
        } catch (err) {
            alert('حدث خطأ أثناء تحديث الرؤية');
        }
    };

    const handleDelete = async (greetId) => {
        if (!confirm('هل أنت متأكد من حذف هذه التهنئة؟')) return;

        if (!diwaniya?.username) {
            alert('لا يمكن حذف التهنئة');
            return;
        }

        try {
            const res = await deleteDiwaniyaGreeting(diwaniya.username, greetId);
            if (res.success) {
                setGreetings(prev => prev.filter(g => g._id !== greetId));
            }
        } catch (err) {
            alert('حدث خطأ أثناء الحذف');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#171717' }} />
            </div>
        );
    }

    if (error || !diwaniya) {
        return (
            <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '24px' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>لم يتم العثور على الديوانية</h1>
                    <p style={{ fontSize: '16px', color: '#737373', marginBottom: '24px' }}>يرجى إنشاء ديوانية جديدة</p>
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
                        إنشاء ديوانية
                        <ArrowLeft size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    const publicGreetings = greetings.filter(g => g.visibility === 'public');
    const privateGreetings = greetings.filter(g => g.visibility === 'private');

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>

            {/* HERO */}
            <section style={{ background: '#171717', padding: '80px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div
                        style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            marginBottom: '24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>لوحة التحكم</span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(32px, 5vw, 48px)',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.2,
                            marginBottom: '16px',
                        }}
                    >
                        ديوانيتك
                    </h1>

                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                        إدارة تهاني العيد الخاصة بك
                    </p>

                    {diwaniyas.length > 1 && (
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>اختر ديوانية:</span>
                            <select
                                value={diwaniya.username}
                                onChange={(e) => {
                                    const selectedUsername = e.target.value;
                                    const selectedDiwaniya = diwaniyas.find(d => d.username === selectedUsername);
                                    if (selectedDiwaniya) {
                                        setLoading(true);
                                        getDiwaniyaManage(selectedUsername)
                                            .then(res => {
                                                if (res.success) {
                                                    setDiwaniya(res.data);
                                                    setGreetings(res.data.greetings || []);
                                                }
                                            })
                                            .catch(err => console.error(err))
                                            .finally(() => setLoading(false));
                                    }
                                }}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    fontSize: '15px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontFamily: "'Tajawal', sans-serif",
                                }}
                            >
                                {diwaniyas.map(d => (
                                    <option key={d._id || d.username} value={d.username} style={{ color: '#000' }}>
                                        {d.ownerName} (@{d.username})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </section>

            {/* STATS & LINK */}
            <section style={{ background: '#fafafa', padding: '60px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>{greetings.length}</div>
                            <div style={{ fontSize: '14px', color: '#737373' }}>إجمالي التهاني</div>
                        </div>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>{publicGreetings.length}</div>
                            <div style={{ fontSize: '14px', color: '#737373' }}>عامة</div>
                        </div>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>{privateGreetings.length}</div>
                            <div style={{ fontSize: '14px', color: '#737373' }}>خاصة</div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>رابط ديوانيتك</h3>
                                <p style={{ fontSize: '14px', color: '#737373' }}>شاركه مع الأصدقاء لتلقي التهاني</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleCopyLink}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 20px',
                                        background: '#171717',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease',
                                    }}
                                >
                                    <Copy size={16} />
                                    نسخ
                                </button>
                                <button
                                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`أرسلت لك تهنئة العيد في ديوانيتي: ${window.location.origin}/eid/${diwaniya.username}`)}`)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 20px',
                                        background: '#25D366',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease',
                                    }}
                                >
                                    <MessageCircle size={16} />
                                    واتساب
                                </button>
                                <Link
                                    to="/create-game"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                                        color: '#171717',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        transition: 'all 200ms ease',
                                        boxShadow: '0 2px 8px rgba(255, 140, 0, 0.2)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 0, 0.2)';
                                    }}
                                >
                                    🎲 لعبة العيدية
                                </Link>
                            </div>
                        </div>
                        <div style={{ fontSize: '15px', color: '#171717', fontWeight: 600, wordBreak: 'break-all', padding: '12px', background: '#fafafa', borderRadius: '8px', textAlign: 'center' }}>
                            {window.location.origin}/eid/{diwaniya.username}
                        </div>
                    </div>
                </div>
            </section>

            {/* PUBLIC GREETINGS */}
            {publicGreetings.length > 0 && (
                <section style={{ background: '#fff', padding: '60px 24px' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>تهاني عامة</span>
                            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#171717', marginTop: '8px' }}>
                                التهاني العامة ({publicGreetings.length})
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {publicGreetings.map((g) => (
                                <div key={g._id} style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#171717',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                color: '#fff',
                                            }}>
                                                {g.isAnonymous ? '?' : g.senderName.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>
                                                    {g.isAnonymous ? 'مجهول' : g.senderName}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#a3a3a3' }}>{formatDate(g.createdAt)}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleVisibility(g._id)}
                                            style={{
                                                padding: '6px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#a3a3a3',
                                                transition: 'all 200ms ease',
                                            }}
                                            title="تحويل إلى خاصة"
                                        >
                                            <EyeOff size={16} />
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.6, marginBottom: '12px' }}>"{g.message}"</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
                                        <span style={{ fontSize: '12px', color: '#737373' }}>{g.likes || 0} إعجاب</span>
                                        <button
                                            onClick={() => handleDelete(g._id)}
                                            style={{
                                                padding: '6px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                transition: 'all 200ms ease',
                                            }}
                                            title="حذف"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PRIVATE GREETINGS */}
            {privateGreetings.length > 0 && (
                <section style={{ background: '#fafafa', padding: '60px 24px' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>تهاني خاصة</span>
                            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#171717', marginTop: '8px' }}>
                                التهاني الخاصة ({privateGreetings.length})
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {privateGreetings.map((g) => (
                                <div key={g._id} style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#f59e0b',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                color: '#fff',
                                            }}>
                                                {g.isAnonymous ? '?' : g.senderName.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>
                                                    {g.isAnonymous ? 'مجهول' : g.senderName}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#a3a3a3' }}>{formatDate(g.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleToggleVisibility(g._id)}
                                                style={{
                                                    padding: '6px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#10b981',
                                                    transition: 'all 200ms ease',
                                                }}
                                                title="تحويل إلى عامة"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(g._id)}
                                                style={{
                                                    padding: '6px',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                    transition: 'all 200ms ease',
                                                }}
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.6, marginBottom: '12px' }}>"{g.message}"</p>
                                    <div style={{ fontSize: '12px', color: '#737373', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
                                        {g.likes || 0} إعجاب
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}