import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDiwan } from '../utils/api';
import { Sparkles, ArrowRight, User, Link2, Loader2, PartyPopper } from 'lucide-react';

export default function DiwanCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', ownerName: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

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
            const res = await createDiwan(formData);
            if (res.success) {
                setStatus('success');
                setTimeout(() => navigate(`/eid/${res.data.username}`), 1000);
            }
        } catch (error) {
            console.error('Create Diwan Error:', error);
            setErrorMsg(error.message || 'حدث خطأ. تأكد من تشغيل الباك اند واضغط Ctrl+C ثم أعد التشغيل.');
            setStatus('error');
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen relative overflow-hidden bg-white text-[#0f172a] font-arabic flex flex-col items-center justify-start" dir="rtl">

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-50/50 rounded-full blur-[100px] opacity-40" />
            </div>

            <div className="w-full max-w-2xl px-6 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-black mb-8 animate-fade-in shadow-sm">
                    <PartyPopper className="w-4 h-4" />
                    جديد: ديوان تهاني العيد التفاعلي
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.15]">
                    اصنع <span className="text-[#2563eb]">رابط تهنئتك</span> المميّز
                </h1>

                <p className="text-[#64748b] text-lg md:text-xl leading-relaxed max-w-lg mb-12 font-medium">
                    شارك فرحة العيد برابط واحد يجمع لك تهاني الأصحاب والأهل بكل أناقة وتنظيم.
                </p>

                {/* Form Card */}
                <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden p-8 md:p-12 transition-all">

                    {status === 'success' ? (
                        <div className="py-12 animate-slide-up flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">تم الإطلاق!</h2>
                            <p className="text-slate-500 font-bold">جاري فتح صفحتك الشخصية خلال لحظات...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-10 text-right">

                            {errorMsg && (
                                <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm border border-red-100 font-bold text-center">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Owner Name Input */}
                            <div className="space-y-3">
                                <label className="block text-base font-black text-slate-800 pr-2">الاسم الذي يظهر للزوار</label>
                                <div className="relative">
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 pr-12 py-4 text-lg outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all font-bold placeholder:font-medium placeholder:text-slate-300"
                                        placeholder="مثال: عبدالله محمد"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                            </div>

                            {/* Username Input */}
                            <div className="space-y-3">
                                <label className="block text-base font-black text-slate-800 pr-2">رابط الصفحة (بالأحرف الإنجليزية)</label>
                                <div className="relative group">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                        <Link2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        dir="ltr"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 pl-12 py-4 text-xl outline-none focus:bg-white focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all text-left font-mono font-bold placeholder:font-medium placeholder:text-slate-300"
                                        placeholder="abdullah"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-2 pt-1">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">معاينة الرابط:</span>
                                    <span className="text-sm font-mono text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-lg">sallim.com/eid/{formData.username || 'username'}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full h-16 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                        <span>جاري الإنشاء...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إنشاء رابطي الآن</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Meta */}
                <p className="mt-12 text-slate-400 font-bold text-sm tracking-wide">
                    جميع الحقوق محفوظة لمنصة <span className="text-blue-600">سَلِّم</span> 2024
                </p>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .font-arabic { font-family: 'Cairo', 'Tajawal', sans-serif; }
            `}} />
        </div>
    );
}
