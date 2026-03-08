import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStandaloneGame } from '../utils/api';
import { Gift, Plus, Trash2, ArrowRight, Loader2, Sparkles, Trophy, Shuffle, Wand2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { eidiyaQuestions, getRandomQuestions } from '../data/eidiyaQuestions';

export default function CreateGamePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }
    }, []);
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [gameUrl, setGameUrl] = useState('');

    // Form State
    const [ownerName, setOwnerName] = useState('');
    const [title, setTitle] = useState('تحدي العيدية');
    const [currency, setCurrency] = useState('ريال');

    // Questions State
    const [questions, setQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(10);

    // Load questions from database
    const loadRandomQuestions = () => {
        const randomQuestions = getRandomQuestions(questionCount);
        setQuestions(randomQuestions);
        toast.success(`تم اختيار ${questionCount} أسئلة عشوائية!`);
    };

    const handleAddQuestion = () => {
        if (questions.length >= 50) {
            toast.error('أقصى عدد للأسئلة هو 50');
            return;
        }
        setQuestions([
            ...questions,
            { questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0, rewardAmount: 5 }
        ]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length <= 1) {
            toast.error('يجب أن تحتوي اللعبة على سؤال واحد على الأقل');
            return;
        }
        const newQs = [...questions];
        newQs.splice(index, 1);
        setQuestions(newQs);
    };

    const updateQuestion = (index, field, value) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const updateAnswer = (qIndex, aIndex, value) => {
        const newQs = [...questions];
        newQs[qIndex].answers[aIndex] = value;
        setQuestions(newQs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!ownerName.trim()) return toast.error('يرجى إدخال اسم المُنشئ');

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) return toast.error(`يرجى كتابة نص السؤال رقم ${i + 1}`);
            if (q.answers.some(a => !a.trim())) return toast.error(`يرجى تعبئة جميع الخيارات للسؤال رقم ${i + 1}`);
            if (q.rewardAmount < 1) return toast.error(`يجب أن تكون قيمة الجائزة أكبر من 0 في السؤال رقم ${i + 1}`);
        }

        setStatus('loading');
        try {
            const payload = {
                ownerName,
                title,
                questions,
                settings: { currency, dialect: 'sa' }
            };

            const res = await createStandaloneGame(payload);

            if (res.success) {
                setGameUrl(`${window.location.origin}${res.data.url}`);
                setStatus('success');
            }
        } catch (error) {
            console.error('Create game error:', error);
            toast.error(error.message || 'حدث خطأ أثناء إنشاء اللعبة');
            setStatus('idle');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(gameUrl);
        toast.success('تم نسخ رابط اللعبة بنجاح! شاركه الآن 🎁');
    };

    if (status === 'success') {
        return (
            <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '24px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '80px', height: '80px', background: '#FF8C00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(255, 140, 0, 0.2)' }}>
                        <Gift size={40} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#171717', marginBottom: '8px' }}>تم إنشاء اللعبة بنجاح!</h1>
                    <p style={{ color: '#737373', marginBottom: '32px' }}>ارسل هذا الرابط لأهلك وأصدقائك لتبدأ المنافسة</p>

                    <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', border: '1px solid #e5e5e5' }}>
                        <input
                            type="text"
                            readOnly
                            value={gameUrl}
                            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#171717', direction: 'ltr', textAlign: 'left', fontWeight: 'bold' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        <button
                            onClick={handleCopyLink}
                            style={{ padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 14px rgba(255,140,0,0.3)' }}
                        >
                            نسخ الرابط
                        </button>
                        <button
                            onClick={() => window.open(gameUrl, '_blank')}
                            style={{ padding: '16px', borderRadius: '12px', background: '#fff', color: '#171717', fontWeight: 700, border: '1px solid #e5e5e5', cursor: 'pointer', fontSize: '16px' }}
                        >
                            معاينة اللعبة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif", background: '#fafafa', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ background: '#171717', padding: '60px 24px', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}
                >
                    <ArrowRight size={16} /> ردا
                </button>
                <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', marginBottom: '24px' }}>
                    <Trophy size={32} color="#FFD700" />
                </div>
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
                    أطلق تحدي العيدية
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
                    أنشئ أسئلتك الخاصة، حدد لكل سؤال جوائزه، ودع عائلتك تتنافس على صدارة الترتيب!
                </p>
            </header>

            {/* Form */}
            <main style={{ maxWidth: '700px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                {/* Warning for non-logged users */}
                {!isLoggedIn && (
                    <div style={{
                        background: '#fee2e2',
                        border: '2px solid #fecaca',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#fef2f2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <AlertCircle size={24} color="#dc2626" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color: '#991b1b',
                                marginBottom: '8px'
                            }}>
                                ⚠️ تنبيه هام
                            </h3>
                            <p style={{
                                fontSize: '15px',
                                color: '#7f1d1d',
                                lineHeight: 1.6,
                                marginBottom: '16px'
                            }}>
                                لتفعيل اللعبة ومتابعة النتائج ولوحة الصدارة، يجب عليك إنشاء حساب وتسجيل الدخول أولاً.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#dc2626',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#b91c1c'
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#dc2626'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    تسجيل الدخول
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#fff',
                                        color: '#dc2626',
                                        border: '2px solid #dc2626',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    إنشاء حساب جديد
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Basic Info */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e5e5e5' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '24px', background: '#FF8C00', borderRadius: '4px' }}></span>
                            المعلومات الأساسية
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>اسمك (مُنشئ التحدي)</label>
                                <input
                                    type="text"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    placeholder="أبو محمد"
                                    required
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fafafa' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>عنوان اللعبة</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fafafa' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>العملة (للعيدية)</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fafafa' }}
                                >
                                    <option value="ريال">ريال</option>
                                    <option value="دينار">دينار</option>
                                    <option value="درهم">درهم</option>
                                    <option value="دولار">دولار</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e5e5e5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '24px', background: '#FFD700', borderRadius: '4px' }}></span>
                                بناء الأسئلة
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '13px', color: '#737373', background: '#f5f5f5', padding: '4px 12px', borderRadius: '100px' }}>
                                    {questions.length} أسئلة
                                </span>
                            </div>
                        </div>

                        {/* Quick Add from Database */}
                        <div style={{ marginBottom: '24px', padding: '20px', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1))', borderRadius: '16px', border: '2px dashed rgba(255, 140, 0, 0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Wand2 size={24} color="#FF8C00" />
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>اختيار أسئلة جاهزة</div>
                                        <div style={{ fontSize: '13px', color: '#737373' }}>لدينا 50 سؤال جاهز، اختر العدد الذي تريده</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>عدد الأسئلة:</label>
                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '14px', background: '#fff' }}
                                    >
                                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={loadRandomQuestions}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms ease' }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <Shuffle size={16} />
                                    اختر {questionCount} أسئلة عشوائية
                                </button>
                                {questions.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setQuestions([])}
                                        style={{ padding: '10px 20px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        مسح الكل
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} style={{ padding: '24px', background: '#fafafa', borderRadius: '16px', border: '1px solid #e5e5e5', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#171717', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                                        السؤال {qIndex + 1}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                        style={{ position: 'absolute', top: '16px', left: '16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>نص السؤال</label>
                                        <input
                                            type="text"
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                            placeholder="اكتب السؤال هنا..."
                                            required
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '15px' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>الإجابة الصحيحة</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                            {[0, 1, 2, 3].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => updateQuestion(qIndex, 'correctAnswerIndex', opt)}
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        border: q.correctAnswerIndex === opt ? '2px solid #10b981' : '1px solid #e5e5e5',
                                                        background: q.correctAnswerIndex === opt ? '#ecfdf5' : '#fff',
                                                        color: q.correctAnswerIndex === opt ? '#047857' : '#737373',
                                                        fontWeight: q.correctAnswerIndex === opt ? 700 : 500,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    الخيار {opt + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                        {q.answers.map((answer, aIndex) => (
                                            <div key={aIndex} style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    value={answer}
                                                    onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                                                    placeholder={`الخيار ${aIndex + 1}`}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 12px 12px 36px',
                                                        borderRadius: '8px',
                                                        border: q.correctAnswerIndex === aIndex ? '2px solid #10b981' : '1px solid #e5e5e5',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                                {q.correctAnswerIndex === aIndex && (
                                                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#525252', marginBottom: '8px' }}>قيمة العيدية لهذا السؤال ({currency})</label>
                                        <input
                                            type="number"
                                            value={q.rewardAmount}
                                            onChange={(e) => updateQuestion(qIndex, 'rewardAmount', Number(e.target.value))}
                                            min="1"
                                            required
                                            style={{ width: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '16px', fontWeight: 700, color: '#FF8C00' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(255, 140, 0, 0.1)', color: '#FF8C00', border: '2px dashed rgba(255, 140, 0, 0.3)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 200ms ease' }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 140, 0, 0.15)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 140, 0, 0.1)'}
                        >
                            <Plus size={20} /> إضافة سؤال جديد
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        style={{ width: '100%', padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#fff', fontSize: '18px', fontWeight: 800, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 8px 24px rgba(255, 140, 0, 0.3)', transition: 'all 200ms ease' }}
                    >
                        {status === 'loading' ? (
                            <><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> جاري الإنشاء...</>
                        ) : (
                            <><Sparkles size={24} /> أنشئ لعبة العيدية الآن</>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
