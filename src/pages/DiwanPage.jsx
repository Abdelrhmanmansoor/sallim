import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDiwan, addDiwanGreeting, likeDiwanGreeting } from '../utils/api';
import { Sparkles, Heart, Share2, Twitter, MessageCircle, Send, Loader2, Link2, Plus, Calendar, User, PartyPopper } from 'lucide-react';
import ReactConfetti from 'react-confetti';

export default function DiwanPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [diwan, setDiwan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const [formState, setFormState] = useState({ senderName: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState('idle');

    const showConfetti = diwan?.greetings?.length > 50;

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        async function fetchDiwan() {
            try {
                const res = await getDiwan(username);
                if (res.data && res.data.greetings) {
                    res.data.greetings = res.data.greetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                setDiwan(res.data);
            } catch (err) {
                setError(err.message || 'لم يتم العثور على ديوان هذا المستخدم');
            } finally {
                setLoading(false);
            }
        }
        fetchDiwan();
    }, [username]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `أرسلت لك تهنئة العيد في ديواني المميّز، شاركني فرحتك هنا 🌙✨: \n\n ${url}`;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('تم نسخ الرابط بنجاح!');
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title: `ديوان ${diwan?.ownerName}`, text, url });
                } else {
                    navigator.clipboard.writeText(url);
                    alert('تم نسخ الرابط بنجاح!');
                }
        }
    };

    const handleGreetingSubmit = async (e) => {
        e.preventDefault();
        if (!formState.senderName || !formState.message) return;

        setSubmitStatus('loading');
        try {
            const res = await addDiwanGreeting(username, formState);
            if (res.success) {
                setDiwan(prev => ({
                    ...prev,
                    greetings: [res.data, ...prev.greetings]
                }));
                setFormState({ senderName: '', message: '' });
                setSubmitStatus('success');
                setTimeout(() => setSubmitStatus('idle'), 3000);
            }
        } catch (err) {
            alert(err.message || 'حدث خطأ أثناء الإرسال');
            setSubmitStatus('error');
        }
    };

    const handleLike = async (greetId) => {
        try {
            const res = await likeDiwanGreeting(username, greetId);
            if (res.success) {
                setDiwan(prev => ({
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
        return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center bg-white" dir="rtl">
                <Loader2 className="w-12 h-12 text-[#2563eb] animate-spin mb-4" />
                <p className="text-slate-400 font-black text-lg">جاري فتح الديوان المميّز...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center bg-white text-center px-6" dir="rtl">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
                    <Sparkles className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">{error}</h1>
                <p className="text-slate-500 mb-10 max-w-sm font-bold text-lg">نعتذر، الرابط غير متاح حالياً أو قد تم تغييره.</p>
                <button onClick={() => navigate('/diwan/create')} className="h-14 bg-[#2563eb] text-white px-10 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-[#1d4ed8] transition-all">
                    أنشئ ديوانك الخاص الآن
                </button>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen relative bg-[#fcfdfe] text-[#0f172a] overflow-x-hidden font-arabic" dir="rtl">
            {showConfetti && (
                <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} gravity={0.12} />
            )}

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[500px] bg-blue-50 rounded-full blur-[160px] opacity-70" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50 rounded-full blur-[140px] opacity-40" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* 1. Header Section */}
                <header className="text-center pt-10 mb-20 w-full flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-slate-100 text-slate-500 text-sm font-black mb-10 shadow-sm animate-fade-in">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        ركن التهاني التفاعلي
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.2] animate-slide-up">
                        🎉 عيد مبارك <br />
                        <span className="text-[#2563eb]">يا {diwan.ownerName}</span>
                    </h1>

                    <p className="text-slate-500 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-bold animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        اترك بصمتك الجميلة بتهنئة خاصة لـ {diwan.ownerName} في ديوانه المميّز بمناسبة العيد.
                    </p>
                </header>

                {/* 2. Stats Summary */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-20 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white border border-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] rounded-3xl px-10 py-6 text-center min-w-[180px]">
                        <span className="text-5xl font-black text-[#2563eb] mb-1 block leading-none">{diwan.greetings.length}</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">تهنئة استلمها</span>
                    </div>
                    <div className="bg-white border border-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] rounded-3xl px-10 py-6 text-center min-w-[180px]">
                        <span className="text-5xl font-black text-indigo-400 mb-1 block leading-none">{diwan.views || 0}</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">زيارة للديوان</span>
                    </div>
                </div>

                {/* 3. Post Greeting Form */}
                <div className="w-full bg-white border border-slate-100 shadow-[0_45px_100px_-30px_rgba(37,99,235,0.08)] p-8 md:p-14 rounded-[3rem] mb-24 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-br-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tr-full pointer-events-none" />

                    <h3 className="text-2xl font-black mb-10 flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-2xl flex items-center justify-center shadow-inner">
                            <Plus className="w-6 h-6" />
                        </div>
                        أضف تهنئتك الآن
                    </h3>

                    <form onSubmit={handleGreetingSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-700 pr-2">اسمك الكريم</label>
                            <input
                                type="text"
                                required
                                placeholder="مثال: صالح العلي"
                                value={formState.senderName}
                                onChange={(e) => setFormState({ ...formState, senderName: e.target.value })}
                                maxLength={50}
                                disabled={submitStatus === 'loading'}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all font-bold placeholder:font-medium placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-700 pr-2">نص التهنئة</label>
                            <textarea
                                required
                                placeholder="اكتب تهنئتك الصادقة هنا..."
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                maxLength={300}
                                rows={4}
                                disabled={submitStatus === 'loading'}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all resize-none font-bold placeholder:font-medium placeholder:text-slate-300 leading-relaxed"
                            ></textarea>
                            <div className="text-left mt-1 text-[10px] text-slate-400 font-mono font-bold">
                                {formState.message.length} / 300
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading' || !formState.senderName || !formState.message}
                                className={`h-16 px-12 rounded-2xl font-black text-xl flex items-center gap-3 transition-all min-w-[220px] justify-center ${submitStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xl shadow-blue-100 hover:-translate-y-1 active:scale-95'}`}
                            >
                                {submitStatus === 'loading' ? (
                                    <Loader2 className="w-7 h-7 animate-spin" />
                                ) : submitStatus === 'success' ? (
                                    <>تم الإرسال بنجاح!</>
                                ) : (
                                    <>
                                        <span>إرسال التهنئة</span>
                                        <Send className="w-5 h-5 -rotate-45 ml-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 4. The Wall */}
                {diwan.greetings.length > 0 && (
                    <div className="w-full mb-32 flex flex-col items-center">
                        <h3 className="font-black text-4xl text-slate-900 mb-16 relative">
                            حائط المحبة
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#2563eb] rounded-full" />
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            {diwan.greetings.map((g, idx) => (
                                <div
                                    key={g._id}
                                    className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col animate-slide-up group"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-blue-50 text-[#2563eb] rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner group-hover:bg-[#2563eb] group-hover:text-white transition-colors duration-500">
                                            {g.senderName.charAt(0)}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-slate-900 text-xl mb-1">{g.senderName}</div>
                                            <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{formatDate(g.createdAt)}</div>
                                        </div>
                                    </div>

                                    <div className="text-slate-600 leading-relaxed font-bold text-lg mb-8 flex-1">
                                        "{g.message}"
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => handleLike(g._id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-sm ${g.likes > 0 ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                                        >
                                            <Heart className={`w-4 h-4 ${g.likes > 0 ? 'fill-red-500' : ''}`} />
                                            {g.likes > 0 ? g.likes : 'أعجبني'}
                                        </button>
                                        <Sparkles className="w-4 h-4 text-amber-100 group-hover:text-amber-300 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Share Premium Section */}
                <div className="w-full bg-[#1e293b] rounded-[3.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden mb-24 shadow-2xl animate-fade-in shadow-indigo-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="font-black text-4xl md:text-5xl mb-6">شارك ديوان محبّتك</h3>
                        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-sm mx-auto font-bold">كلما زاد النشر زادت المحبة، أرسل الرابط لأصدقائك الآن.</p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => handleShare('whatsapp')} className="h-16 px-10 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black flex items-center gap-3 transition-all hover:-translate-y-1">
                                <MessageCircle className="w-6 h-6" /> واتساب
                            </button>
                            <button onClick={() => handleShare('twitter')} className="h-16 px-10 rounded-2xl bg-white text-[#1e293b] hover:bg-slate-100 font-black flex items-center gap-3 transition-all hover:-translate-y-1">
                                <Twitter className="w-6 h-6 fill-current" /> منصة X
                            </button>
                            <button onClick={() => handleShare('copy')} className="h-16 px-10 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-black flex items-center gap-3 transition-all hover:-translate-y-1">
                                <Link2 className="w-6 h-6" /> نسخ الرابط
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <footer className="text-center w-full flex flex-col items-center">
                    <p className="text-slate-300 font-black text-sm mb-6 uppercase tracking-widest">منصة سَلِّم - 2024</p>
                    <a href="/" className="inline-flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-[#2563eb] text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100">س</div>
                        <span className="text-3xl font-black tracking-tighter text-slate-800">سَلِّم</span>
                    </a>
                </footer>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .font-arabic { font-family: 'Cairo', 'Tajawal', sans-serif; }
            `}} />
        </div>
    );
}
