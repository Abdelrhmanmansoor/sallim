import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDiwaniya, getDiwaniyaManage, updateDiwaniyaGreetingVisibility, deleteDiwaniyaGreeting, updateDiwaniyaSettings } from '../utils/api';
import { ArrowLeft, Copy, Eye, EyeOff, Trash2, MessageCircle, Loader2, Plus, Users, BookOpen, HandCoins, Settings, ChevronLeft, Calendar, Gamepad2, Gift } from 'lucide-react';
import { getFamilyData, createFamilyStory, joinFamily, apiRequest } from '../utils/api';

export default function DiwaniyaDashboardPage() {
    const navigate = useNavigate();
    const [diwaniyas, setDiwaniyas] = useState([]);
    const [diwaniya, setDiwaniya] = useState(null);
    const [greetings, setGreetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('greetings'); // greetings | family | stories | requests | settings
    const [familyData, setFamilyData] = useState(null);
    const [availableGames, setAvailableGames] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleToggleFamilyMode = async () => {
        if (!diwaniya || isUpdating) return;

        setIsUpdating(true);
        try {
            const newMode = !diwaniya.isFamilyMode;
            const res = await updateDiwaniyaSettings(diwaniya.username, { isFamilyMode: newMode });
            if (res.success) {
                setDiwaniya(res.data);
                if (newMode) setActiveTab('family');
            }
        } catch (err) {
            alert('حدث خطأ أثناء تحديث وضع العائلة');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleToggleGame = async () => {
        if (!diwaniya || isUpdating) return;

        setIsUpdating(true);
        try {
            const newEnabled = !diwaniya.eidiyaGame?.enabled;
            const res = await updateDiwaniyaSettings(diwaniya.username, { eidiyaGameEnabled: newEnabled });
            if (res.success) {
                setDiwaniya(res.data);
            }
        } catch (err) {
            alert('حدث خطأ أثناء تحديث حالة اللعبة');
        } finally {
            setIsUpdating(false);
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
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to="/create-diwaniya"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 32px',
                                background: '#171717',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: 700,
                                borderRadius: '14px',
                                textDecoration: 'none',
                                transition: 'all 200ms ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={20} />
                            إنشاء ديوانية
                        </Link>
                        <Link
                            to="/create-game"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                                color: '#171717',
                                fontSize: '16px',
                                fontWeight: 700,
                                borderRadius: '14px',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(255, 140, 0, 0.2)',
                                transition: 'all 200ms ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            🎲 لعبة العيدية
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const publicGreetings = greetings.filter(g => g.visibility === 'public');
    const privateGreetings = greetings.filter(g => g.visibility === 'private');

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

            {/* HERO / HEADER */}
            <header style={{ background: '#171717', color: '#fff', padding: '100px 24px 60px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(255,140,0,0.1)', borderRadius: '100px', color: '#fb923c', fontSize: '13px', fontWeight: 700, marginBottom: '16px', border: '1px solid rgba(251,146,60,0.2)' }}>
                            لوحة التحكم
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>ديوانيتك</h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>أهلاً بك يا {diwaniya.ownerName} في ديوانية العيد</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link
                            to={`/eid/${diwaniya.username}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <Eye size={18} /> عرض الديوانية
                        </Link>
                    </div>
                </div>
            </header>

            {/* TABS NAVIGATION */}
            <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: '64px', zIndex: 100 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', overflowX: 'auto', padding: '0 24px', scrollbarWidth: 'none' }}>
                    {[
                        { id: 'greetings', label: 'التهاني', icon: MessageCircle },
                        { id: 'family', label: 'أفراد العائلة', icon: Users, familyOnly: true },
                        { id: 'stories', label: 'الأخبار', icon: BookOpen, familyOnly: true },
                        { id: 'requests', label: 'طلبات العيدية', icon: HandCoins, familyOnly: true },
                        { id: 'settings', label: 'الإعدادات', icon: Settings },
                    ].map(tab => {
                        if (tab.familyOnly && !diwaniya?.isFamilyMode) return null;
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '20px 16px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `2px solid ${isActive ? '#171717' : 'transparent'}`,
                                    color: isActive ? '#171717' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 200ms ease',
                                }}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <main style={{ maxWidth: '1000px', margin: '40px auto 100px', padding: '0 24px' }}>

                {/* GREETINGS TAB */}
                {activeTab === 'greetings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Stats & Link */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#171717' }}>رابط المشاركة</h3>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ flex: 1, padding: '12px', background: '#f8fafc', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {window.location.origin}/eid/{diwaniya.username}
                                    </div>
                                    <button onClick={handleCopyLink} style={{ padding: '12px', background: '#171717', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Copy size={18} /></button>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`أرسلت لك تهنئة العيد في ديوانيتي: ${window.location.origin}/eid/${diwaniya.username}`)}`)} style={{ flex: 1, padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <MessageCircle size={18} /> واتساب
                                    </button>
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#171717' }}>{greetings.length}</div>
                                    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>إجمالي التهاني</div>
                                </div>
                                <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#fb923c' }}>{diwaniya.views || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>زيارة</div>
                                </div>
                            </div>
                        </div>

                        {/* Public Greetings */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><Eye size={18} /></div>
                                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>التهاني العامة ({publicGreetings.length})</h3>
                            </div>
                            {publicGreetings.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {publicGreetings.map(g => (
                                        <div key={g._id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 700 }}>{g.isAnonymous ? 'مجهول' : g.senderName}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(g.createdAt)}</div>
                                            </div>
                                            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', marginBottom: '20px' }}>{g.message}</p>
                                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={() => handleToggleVisibility(g._id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} title="إخفاء من العامة"><EyeOff size={16} /></button>
                                                <button onClick={() => handleDelete(g._id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '40px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>لا توجد تهاني عامة</div>
                            )}
                        </div>

                        {/* Private Greetings */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}><EyeOff size={18} /></div>
                                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>التهاني الخاصة ({privateGreetings.length})</h3>
                            </div>
                            {privateGreetings.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {privateGreetings.map(g => (
                                        <div key={g._id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 700 }}>{g.isAnonymous ? 'مجهول' : g.senderName}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(g.createdAt)}</div>
                                            </div>
                                            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', marginBottom: '20px' }}>{g.message}</p>
                                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={() => handleToggleVisibility(g._id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer' }} title="إظهار للعامة"><Eye size={16} /></button>
                                                <button onClick={() => handleDelete(g._id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '40px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>لا توجد تهاني خاصة</div>
                            )}
                        </div>
                    </div>
                )}

                {/* FAMILY TAB Content would go here */}
                {activeTab === 'family' && (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <Users size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                        <h3>أفراد العائلة قادم قريباً</h3>
                        <p>هنا يمكنك إدارة أفراد عائلتك في الديوانية</p>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>إعدادات الديوانية</h3>
                        </div>
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                            {/* Family Mode Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>وضع العائلة (Family Mode)</h4>
                                    <p style={{ fontSize: '14px', color: '#64748b' }}>تفعيل ميزات الأخبار العائلية وطلبات العيدية</p>
                                </div>
                                <button
                                    onClick={handleToggleFamilyMode}
                                    disabled={isUpdating}
                                    style={{
                                        width: '56px',
                                        height: '28px',
                                        background: diwaniya?.isFamilyMode ? '#171717' : '#e2e8f0',
                                        borderRadius: '100px',
                                        border: 'none',
                                        position: 'relative',
                                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                                        opacity: isUpdating ? 0.7 : 1,
                                        transition: 'all 300ms ease',
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: '4px', left: diwaniya?.isFamilyMode ? '4px' : '32px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'all 300ms ease' }} />
                                </button>
                            </div>

                            <div style={{ height: '1px', background: '#f1f5f9' }}></div>

                            {/* Game Link */}
                            <div>
                                <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>لعبة العيدية</h4>
                                {diwaniya?.eidiyaGame?.enabled ? (
                                    <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bcf0da', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#16a34a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Gamepad2 size={24} /></div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: 700 }}>اللعبة مفعلة</div>
                                                <div style={{ fontSize: '12px', color: '#166534' }}>الآن يمكن للزوار لعب تحدي العيدية</div>
                                            </div>
                                        </div>
                                        <button onClick={handleToggleGame} disabled={isUpdating} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: isUpdating ? 0.7 : 1 }}>تعطيل</button>
                                    </div>
                                ) : (
                                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0', textAlign: 'center' }}>
                                        <p style={{ color: '#64748b', marginBottom: '16px' }}>اللعبة معطلة حالياً</p>
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                            <button onClick={handleToggleGame} disabled={isUpdating} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#171717', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', opacity: isUpdating ? 0.7 : 1 }}>تفعيل اللعبة</button>
                                            <Link to="/create-game" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#171717', border: 'none', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
                                                تعديل الأسئلة
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}