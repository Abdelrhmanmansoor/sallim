import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDiwaniya, addDiwaniyaGreeting, likeDiwaniyaGreeting } from '../utils/api';
import { Heart, Share2, Twitter, MessageCircle, Send, Loader2, Link2, Plus, Calendar, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';

export default function DiwaniyaPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [diwaniya, setDiwaniya] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newGreeting, setNewGreeting] = useState(null);

    const [formState, setFormState] = useState({ senderName: '', senderEmail: '', message: '', isAnonymous: false, visibility: 'public' });
    const [submitStatus, setSubmitStatus] = useState('idle');

    useEffect(() => {
        async function fetchDiwaniya() {
            try {
                const res = await getDiwaniya(username);
                if (res.data && res.data.greetings) {
                    res.data.greetings = res.data.greetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                setDiwaniya(res.data);
            } catch (err) {
                setError(err.message || 'لم يتم العثور على ديوانية هذا المستخدم');
            } finally {
                setLoading(false);
            }
        }
        fetchDiwaniya();
    }, [username]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `أرسلت لك تهنئة العيد في ديوانيتي الخاصة، شاركني فرحتك هنا: \n\n ${url}`;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('تم نسخ الرابط بنجاح');
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title: `ديوانية ${diwaniya?.ownerName}`, text, url });
                } else {
                    navigator.clipboard.writeText(url);
                    alert('تم نسخ الرابط بنجاح');
                }
        }
    };

    const handleGreetingSubmit = async (e) => {
        e.preventDefault();
        if (!formState.message) return;

        if (!formState.isAnonymous && !formState.senderName) {
            alert('يرجى إدخال اسمك إذا كنت تريد الإرسال باسمك');
            return;
        }

        setSubmitStatus('loading');
        try {
            const res = await addDiwaniyaGreeting(username, formState);
            if (res.success) {
                if (res.data.visibility === 'public') {
                    setNewGreeting(res.data);
                    setDiwaniya(prev => ({
                        ...prev,
                        greetings: [res.data, ...prev.greetings],
                        totalGreetings: prev.totalGreetings + 1
                    }));
                } else {
                    setDiwaniya(prev => ({
                        ...prev,
                        totalGreetings: prev.totalGreetings + 1
                    }));
                }
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4" dir="rtl">
                <Loader2 className="w-12 h-12 text-[#2563eb] animate-spin mb-4" />
                <p className="text-slate-400 font-black text-lg">جاري فتح ديوانية العيد</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4" dir="rtl">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-8">
                    <Sparkles className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-4">لم يتم العثور على الديوانية</h1>
                <p className="text-slate-500 mb-10 max-w-sm font-medium text-lg">نعتذر، الرابط غير متاح حالياً أو قد تم تغييره.</p>
                <button onClick={() => navigate('/diwaniya/create')} className="h-14 bg-[#2563eb] text-white px-10 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-[#1d4ed8] transition-all">
                    أنشئ ديوانيتك الخاصة
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 px-4 pt-24 pb-12" dir="rtl">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-slate-100/30 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-[100px]" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">

                {/* 1. Hero Section */}
                <header className="text-center mb-16 w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-500 text-xs font-black mb-8 shadow-sm">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        ديوانية العيد
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                        عيد مبارك<br />
                        <span className="text-[#2563eb]">يا {diwaniya.ownerName}</span>
                    </h1>

                    <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed font-medium">
                        اترك بصمتك الجميلة بتهنئة خاصة لـ {diwaniya.ownerName} في ديوانية العيد
                    </p>
                </header>

                {/* 2. Stats Summary */}
                <div className="flex items-center justify-center gap-6 mb-12 w-full">
                    <div className="bg-white border border-slate-100 shadow-sm px-8 py-5 rounded-2xl text-center min-w-[140px]">
                        <span className="text-4xl font-black text-[#2563eb] mb-1 block leading-none">{diwaniya.totalGreetings || diwaniya.greetings.length}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تهنئة</span>
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm px-8 py-5 rounded-2xl text-center min-w-[140px]">
                        <span className="text-4xl font-black text-slate-400 mb-1 block leading-none">{diwaniya.views || 0}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">زيارة</span>
                    </div>
                </div>

                {/* 3. Post Greeting Form */}
                <div className="w-full bg-white border border-slate-100 shadow-lg p-8 md:p-10 rounded-[2rem] mb-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-br-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50 to-transparent rounded-tr-full pointer-events-none" />

                    <h3 className="text-xl font-black mb-6 text-center flex items-center justify-center gap-2 text-slate-800">
                        <Plus className="w-5 h-5 text-[#2563eb]" />
                        أرسل تهنئة العيد
                    </h3>

                    <form onSubmit={handleGreetingSubmit} className="space-y-5">
                        {/* Anonymous Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <div className="flex items-center gap-2">
                                <User className={`w-4 h-4 ${!formState.isAnonymous ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                                <span className={`text-xs font-black ${!formState.isAnonymous ? 'text-slate-900' : 'text-slate-400'}`}>الظهور باسمي</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formState.isAnonymous}
                                    onChange={(e) => setFormState({ ...formState, isAnonymous: e.target.checked })}
                                />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black ${formState.isAnonymous ? 'text-slate-900' : 'text-slate-400'}`}>مجهول</span>
                                <EyeOff className={`w-4 h-4 ${formState.isAnonymous ? 'text-amber-500' : 'text-slate-400'}`} />
                            </div>
                        </div>

                        {!formState.isAnonymous && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-600">الاسم</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: صالح العلي"
                                        value={formState.senderName}
                                        onChange={(e) => setFormState({ ...formState, senderName: e.target.value })}
                                        maxLength={50}
                                        disabled={submitStatus === 'loading'}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-base outline-none focus:bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-50/50 transition-all font-bold placeholder:font-medium placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-slate-600">البريد الإلكتروني (اختياري)</label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={formState.senderEmail}
                                        onChange={(e) => setFormState({ ...formState, senderEmail: e.target.value })}
                                        disabled={submitStatus === 'loading'}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-base outline-none focus:bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-50/50 transition-all font-bold placeholder:font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-600">نص التهنئة</label>
                            <textarea
                                required
                                placeholder="اكتب تهنئتك الصادقة هنا..."
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                maxLength={300}
                                rows={3}
                                disabled={submitStatus === 'loading'}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-base outline-none focus:bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-50/50 transition-all resize-none font-bold placeholder:font-medium placeholder:text-slate-400 leading-relaxed"
                            ></textarea>
                            <div className="text-left mt-1 text-[10px] text-slate-400 font-mono font-bold">
                                {formState.message.length} / 300
                            </div>
                        </div>

                        {/* Visibility Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <div className="flex items-center gap-2">
                                <Eye className={`w-4 h-4 ${formState.visibility === 'public' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <span className={`text-xs font-black ${formState.visibility === 'public' ? 'text-slate-900' : 'text-slate-400'}`}>عامة (للجميع)</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formState.visibility === 'private'}
                                    onChange={(e) => setFormState({ ...formState, visibility: e.target.checked ? 'private' : 'public' })}
                                />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black ${formState.visibility === 'private' ? 'text-slate-900' : 'text-slate-400'}`}>خاصة (للباحث)</span>
                                <Shield className={`w-4 h-4 ${formState.visibility === 'private' ? 'text-amber-500' : 'text-slate-400'}`} />
                            </div>
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading' || !formState.message}
                                className={`h-14 px-10 rounded-2xl font-black text-base flex items-center gap-2 transition-all min-w-[200px] justify-center ${submitStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'}`}
                            >
                                {submitStatus === 'loading' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : submitStatus === 'success' ? (
                                    'تم الإرسال'
                                ) : (
                                    <>
                                        <span>إرسال التهنئة</span>
                                        <Send className="w-4 h-4 -rotate-45" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 4. Public Greetings Wall */}
                {diwaniya.greetings.length > 0 && (
                    <div className="w-full mb-16 flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <h3 className="font-black text-xl text-slate-900">التهاني العامة</h3>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <div className="space-y-4 w-full">
                            {diwaniya.greetings.map((g, idx) => (
                                <div
                                    key={g._id}
                                    className={`bg-white border border-slate-100 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${newGreeting?._id === g._id ? 'new-greeting-card' : ''}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 rounded-xl flex items-center justify-center font-black text-base shadow-sm">
                                            {g.isAnonymous ? '?' : g.senderName.charAt(0)}
                                        </div>
                                        <div className="text-right flex-1">
                                            <div className="font-black text-slate-900 text-base mb-0.5">
                                                {g.isAnonymous ? 'مجهول الهوية' : g.senderName}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    {formatDate(g.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-slate-600 leading-relaxed font-medium text-sm mb-4 flex-1">
                                        "{g.message}"
                                    </div>

                                    <div className="flex justify-end items-center pt-3 border-t border-slate-50">
                                        <button
                                            onClick={() => handleLike(g._id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-xs ${g.likes > 0 ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${g.likes > 0 ? 'fill-red-500' : ''}`} />
                                            {g.likes > 0 ? g.likes : 'أعجبني'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Share Section */}
                <div className="w-full bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center text-white relative overflow-hidden mb-12">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                            <Share2 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-black text-2xl md:text-3xl mb-3">شارك ديوانيتك</h3>
                        <p className="text-slate-400 text-base md:text-lg mb-8 max-w-sm font-medium">كلما زاد النشر زادت المحبة، أرسل الرابط لأصدقائك الآن</p>

                        <div className="flex flex-wrap justify-center gap-3">
                            <button onClick={() => handleShare('whatsapp')} className="h-12 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black flex items-center gap-2 transition-all hover:-translate-y-0.5">
                                <MessageCircle className="w-4 h-4" /> واتساب
                            </button>
                            <button onClick={() => handleShare('twitter')} className="h-12 px-6 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black flex items-center gap-2 transition-all hover:-translate-y-0.5">
                                <Twitter className="w-4 h-4 fill-current" /> منصة X
                            </button>
                            <button onClick={() => handleShare('copy')} className="h-12 px-6 rounded-2xl bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white font-black flex items-center gap-2 transition-all hover:-translate-y-0.5">
                                <Link2 className="w-4 h-4" /> نسخ الرابط
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <footer className="text-center w-full flex flex-col items-center">
                    <p className="text-slate-400 font-black text-xs mb-6 uppercase tracking-widest">منصة سَلِّم - 2024</p>
                    <a href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#2563eb] text-white rounded-xl flex items-center justify-center font-black text-xl group-hover:rotate-12 transition-transform shadow-md">س</div>
                        <span className="text-2xl font-black tracking-tighter text-slate-800">سَلِّم</span>
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
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                    50% { box-shadow: 0 10px 20px -3px rgba(37, 99, 235, 0.2), 0 4px 8px -2px rgba(37, 99, 235, 0.1); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .new-greeting-card { animation: glow 2s ease-in-out; }
                .font-arabic { font-family: 'Cairo', 'Tajawal', sans-serif; }
            `}} />
        </div>
    );
}