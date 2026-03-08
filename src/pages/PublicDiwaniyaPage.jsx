import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiwaniya, addDiwaniyaGreeting, likeDiwaniyaGreeting, recordDiwaniyaView } from '../utils/api';
import { ArrowLeft, Send, Heart, Calendar, Share2, MessageCircle, Loader2, Download, Gift, X, Users, BookOpen, HandCoins, User, Eye, EyeOff, Shield } from 'lucide-react';
import DiwaniyaImageGenerator from '../components/DiwaniyaImageGenerator';
import EidiyaGame from '../components/EidiyaGame';
import { getFamilyData, createEidiyaRequest } from '../utils/api';

export default function PublicDiwaniyaPage() {
    const { username } = useParams();
    const [diwaniya, setDiwaniya] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGreeting, setNewGreeting] = useState(null);

    const [formState, setFormState] = useState({ senderName: '', message: '', isAnonymous: false, senderAvatar: '' });
    const [familyData, setFamilyData] = useState(null);
    const [showGame, setShowGame] = useState(false);
    const [showEidiyaRequest, setShowEidiyaRequest] = useState(false);
    const [eidiyaRequestForm, setEidiyaRequestForm] = useState({ requesterName: '', amount: '', message: '' });
    const [requestStatus, setRequestStatus] = useState('idle');

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

                if (res.data?.isFamilyMode) {
                    const familyRes = await getFamilyData(username);
                    if (familyRes.success) {
                        setFamilyData(familyRes.data);
                    }
                }

                // Record real view on every load
                try {
                    const viewRes = await recordDiwaniyaView(username);
                    if (viewRes.success) {
                        setDiwaniya(prev => ({ ...prev, views: viewRes.data.views }));
                    }
                } catch (viewErr) {
                    console.error('Error recording view:', viewErr);
                }

            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchDiwaniya();
    }, [username]);

    const handleEidiyaRequest = async (e) => {
        e.preventDefault();
        setRequestStatus('loading');
        try {
            const res = await createEidiyaRequest(username, eidiyaRequestForm);
            if (res.success) {
                setRequestStatus('success');
                setTimeout(() => {
                    setShowEidiyaRequest(false);
                    setRequestStatus('idle');
                    setEidiyaRequestForm({ requesterName: '', amount: '', message: '' });
                }, 3000);
            }
        } catch (err) {
            alert(err.message || 'حدث خطأ في تقديم الطلب');
            setRequestStatus('idle');
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `عيدكم مبارك! استقبل تهانيكم في ديوانيتي الخاصة على منصة سَلِّم. بانتظار كلماتكم الجميلة 🌙✨: \n\n ${url}`;

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
                setFormState({ senderName: '', message: '', isAnonymous: false, senderAvatar: formState.senderAvatar });
                setSubmitStatus('success');
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setNewGreeting(null);
                }, 4000);
            }
        } catch (err) {
            alert(err.message || 'حدث خطأ أثناء الإرسال');
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

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>

            {/* HERO */}
            <section style={{ background: '#171717', padding: '120px 24px 80px', textAlign: 'center' }}>
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
                        اترك بصمتك الجميلة بتهنئة خاصة في ديوانية العيد.
                    </p>
                    <p style={{ fontSize: '14px', color: '#a3a3a3', marginTop: '12px', fontWeight: 500 }}>
                        الديوانية: ركن رقمي مخصص لاستقبال ومعاينة تهاني العيد من الأصدقاء والمقربين.
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

            {/* FAMILY MODE NAVIGATION (Only if active) */}
            {diwaniya.isFamilyMode && (
                <section style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '64px', zIndex: 100 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '24px', padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                        <button
                            onClick={() => setShowGame(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '20px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: '2px solid transparent',
                                color: '#171717',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Gift size={18} />
                            لعبة العيدية
                        </button>
                        <button
                            onClick={() => {
                                const el = document.getElementById('family-stories');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '20px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: '2px solid transparent',
                                color: '#171717',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <BookOpen size={18} />
                            أخبار العائلة
                        </button>
                        <button
                            onClick={() => setShowEidiyaRequest(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '20px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: '2px solid transparent',
                                color: '#FF8C00',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <HandCoins size={18} />
                            اطلب عيدية
                        </button>
                        <button
                            onClick={() => {
                                const el = document.getElementById('greetings-wall');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '20px 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: '2px solid transparent',
                                color: '#171717',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <MessageCircle size={18} />
                            جدار التهاني
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

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={18} style={{ color: !formState.isAnonymous ? '#171717' : '#a3a3a3' }} />
                                <span style={{ fontSize: '14px', fontWeight: 700, color: !formState.isAnonymous ? '#171717' : '#a3a3a3' }}>باسمك</span>
                            </div>
                            <label style={{ position: 'relative', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formState.isAnonymous}
                                    onChange={(e) => setFormState({ ...formState, isAnonymous: e.target.checked })}
                                    style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                                />
                                <div style={{
                                    width: '48px',
                                    height: '24px',
                                    background: formState.isAnonymous ? '#171717' : '#e5e5e5',
                                    borderRadius: '100px',
                                    transition: 'all 200ms ease',
                                    position: 'relative',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '3px',
                                        left: formState.isAnonymous ? 'auto' : '3px',
                                        right: formState.isAnonymous ? '3px' : 'auto',
                                        width: '18px',
                                        height: '18px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 200ms ease',
                                    }}></div>
                                </div>
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: formState.isAnonymous ? '#171717' : '#a3a3a3' }}>مجهول</span>
                                <EyeOff size={18} style={{ color: formState.isAnonymous ? '#f59e0b' : '#a3a3a3' }} />
                            </div>
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

            {/* FAMILY STORIES & MEMBERS (If Family Mode) */}
            {diwaniya.isFamilyMode && familyData && (
                <>
                    <section id="family-stories" style={{ background: '#fff', padding: '80px 24px' }}>
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                <div style={{ display: 'inline-flex', padding: '10px', background: '#f0f9ff', borderRadius: '12px', color: '#0ea5e9', marginBottom: '16px' }}>
                                    <BookOpen size={24} />
                                </div>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#171717' }}>أخبار ديوانية العائلة</h2>
                                <p style={{ color: '#737373', marginTop: '8px' }}>لحظاتنا الجميلة وتحديثات العيد</p>
                            </div>

                            {familyData.familyStories && familyData.familyStories.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                    {familyData.familyStories.map((story) => (
                                        <div key={story._id} style={{ background: '#fafafa', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                                            {story.image && (
                                                <img src={story.image} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                            )}
                                            <div style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase' }}>{story.type === 'update' ? 'تحديث' : 'ذكرى'}</span>
                                                    <span style={{ fontSize: '12px', color: '#a3a3a3' }}>• {formatDate(story.createdAt)}</span>
                                                </div>
                                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>{story.title}</h3>
                                                <p style={{ fontSize: '15px', color: '#525252', lineHeight: 1.6 }}>{story.story || story.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px 40px', background: '#fafafa', borderRadius: '24px', border: '2px dashed #e5e5e5' }}>
                                    <p style={{ fontSize: '18px', color: '#737373' }}>لا توجد أخبار عائلية بعد</p>
                                    <p style={{ color: '#a3a3a3', marginTop: '8px' }}>كن أول من يشارك لحظة جميلة</p>
                                </div>
                            )}

                            {/* Family Members */}
                            <div id="family-members" style={{ marginTop: '80px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: 700 }}>أفراد العائلة ({familyData?.familyMembers?.length || 0})</h3>
                                    <Users size={24} color="#a3a3a3" />
                                </div>
                                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
                                    {familyData?.familyMembers?.map(member => (
                                        <div key={member._id} style={{ flexShrink: 0, textAlign: 'center', width: '80px' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#171717', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700 }}>
                                                {member.avatar ? <img src={member.avatar} style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }} /> : member.name.charAt(0)}
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                                            <div style={{ fontSize: '11px', color: '#a3a3a3' }}>{member.relation}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* GREETINGS WALL */}
            <section id="greetings-wall" style={{ background: '#fff', padding: '80px 24px' }}>
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

            {/* EIDIYA GAME MODAL */}
            {showGame && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: '#fafafa', borderRadius: '32px' }}>
                        <button
                            onClick={() => setShowGame(false)}
                            style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, background: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <X size={24} />
                        </button>
                        <div style={{ padding: '40px 24px' }}>
                            {diwaniya.eidiyaGame?.enabled ? (
                                <EidiyaGame username={username} />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '80px 40px' }}>
                                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎲</div>
                                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>لا توجد لعبة نشطة</h2>
                                    <p style={{ color: '#737373', fontSize: '18px' }}>اطلب من صاحب الديوانية تفعيل لعبة العيدية!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* EIDIYA REQUEST MODAL */}
            {showEidiyaRequest && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{
                        background: '#171717',
                        width: '100%',
                        maxWidth: '500px',
                        borderRadius: '32px',
                        padding: '48px 40px',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <button
                            onClick={() => setShowEidiyaRequest(false)}
                            style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,140,0,0.1) 100%)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                border: '1px solid rgba(255,140,0,0.2)'
                            }}>
                                <Gift size={40} color="#FFD700" />
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>قدم طلب عيدية</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>أرسل طلباً لطيفاً وبإذن الله ما يقصرون معك</p>
                        </div>

                        <form onSubmit={handleEidiyaRequest} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>الاسم</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="اسمك الكريم"
                                    value={eidiyaRequestForm.requesterName}
                                    onChange={e => setEidiyaRequestForm({ ...eidiyaRequestForm, requesterName: e.target.value })}
                                    style={{
                                        padding: '18px 20px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        color: '#fff',
                                        outline: 'none',
                                        transition: 'all 200ms ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>المبلغ (ريال)</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        required
                                        type="number"
                                        placeholder="المبلغ المقترح"
                                        value={eidiyaRequestForm.amount}
                                        onChange={e => setEidiyaRequestForm({ ...eidiyaRequestForm, amount: e.target.value })}
                                        style={{
                                            padding: '18px 20px',
                                            paddingLeft: '60px',
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            fontSize: '16px',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                    <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#FFD700' }}>SR</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>الرسالة</label>
                                <textarea
                                    placeholder="أكتب رسالة لطيفة تهنئهم فيها بالعيد..."
                                    value={eidiyaRequestForm.message}
                                    onChange={e => setEidiyaRequestForm({ ...eidiyaRequestForm, message: e.target.value })}
                                    style={{
                                        padding: '18px 20px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        color: '#fff',
                                        outline: 'none',
                                        resize: 'none',
                                        minHeight: '100px'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    rows={3}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={requestStatus === 'loading'}
                                style={{
                                    padding: '20px',
                                    background: requestStatus === 'success' ? '#10b981' : 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                                    color: '#171717',
                                    fontSize: '18px',
                                    fontWeight: 800,
                                    border: 'none',
                                    borderRadius: '18px',
                                    cursor: 'pointer',
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: requestStatus === 'success' ? 'none' : '0 10px 20px -10px rgba(255, 140, 0, 0.5)',
                                    marginTop: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    if (requestStatus !== 'loading') {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(255, 140, 0, 0.6)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(255, 140, 0, 0.5)';
                                }}
                            >
                                {requestStatus === 'loading' ? (
                                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                                ) : requestStatus === 'success' ? (
                                    'تم إرسال طلبك بنجاح ✅'
                                ) : (
                                    'إرسال طلب العيدية ✨'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

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