import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDiwaniya } from '../utils/api';
import { Sparkles, User, Link2, Loader2, Moon, Shield } from 'lucide-react';

export default function DiwaniyaCreatePage() {
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
            const res = await createDiwaniya(formData);
            if (res.success) {
                setStatus('success');
                setTimeout(() => navigate(`/diwaniya/${res.data.username}`), 1500);
            }
        } catch (error) {
            console.error('Create Diwaniya Error:', error);
            setErrorMsg('حدث خطأ مؤقت، حاول مرة أخرى.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-amber-50/20 px-4 py-12" dir="rtl">
            
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-[100px]" />
            </div>

            {/* Main Card Container */}
            <div className="w-full max-w-lg relative z-10">
                
                {/* Premium Card */}
                <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.03),0_16px_60px_-10px_rgba(37,99,235,0.08)] rounded-[2.5rem] overflow-hidden">
                    
                    {/* Card Header */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        {/* Elegant Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-100 text-amber-700 text-xs font-black mb-6 shadow-sm">
                            <Moon className="w-3.5 h-3.5" />
                            ديوانية العيد
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                            أنشئ <span className="text-[#2563eb]">ديوانيتك</span> الخاصة
                        </h1>

                        {/* Subtitle */}
                        <p className="text-slate-500 text-base leading-relaxed font-medium max-w-xs mx-auto">
                            استقبل تهاني العيد من أصدقائك بشكل خاص أو عام واحتفظ بالرسائل الودية في مكان واحد.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pb-10">
                        {status === 'success' ? (
                            <div className="py-8 flex flex-col items-center animate-slide-up">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">تم الإنشاء!</h2>
                                <p className="text-slate-500 font-medium text-sm">جاري تحويلك إلى ديوانيتك...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Error Message */}
                                {errorMsg && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-black text-center shadow-sm animate-fade-in">
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Owner Name Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-black text-slate-700">الاسم الذي يظهر للزوار</label>
                                    <div className="relative group">
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-12 py-4 text-lg outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50/50 transition-all duration-300 font-bold placeholder:font-medium placeholder:text-slate-400"
                                            placeholder="مثال: عبدالله محمد"
                                            value={formData.ownerName}
                                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                </div>

                                {/* Username Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-black text-slate-700">رابط الديوانية (بالأحرف الإنجليزية)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                            <Link2 className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            dir="ltr"
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-12 py-4 text-lg outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50/50 transition-all duration-300 text-left font-mono font-bold placeholder:font-medium placeholder:text-slate-400 placeholder:text-right"
                                            placeholder="abdullah"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                    {/* URL Preview */}
                                    <div className="flex items-center justify-end gap-2 pt-1">
                                        <span className="text-xs text-slate-400 font-medium">sallim.com/diwaniya/</span>
                                        <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                            {formData.username || 'username'}
                                        </span>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="flex flex-col items-center gap-2 px-3 py-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100">
                                        <Shield className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-700 text-center">تهاني خاصة</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 px-3 py-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-100">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <span className="text-[10px] font-black text-slate-700 text-center">تهاني عامة</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 px-3 py-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100">
                                        <User className="w-4 h-4 text-blue-500" />
                                        <span className="text-[10px] font-black text-slate-700 text-center">مجهول أو مسجل</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/60 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>جاري الإنشاء...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>إنشاء ديوانيتي الآن</span>
                                            <Sparkles className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center mt-8 text-slate-400 font-black text-xs tracking-wide">
                    منصة <span className="text-blue-600">سَلِّم</span> © 2024
                </p>
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
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .font-arabic { font-family: 'Cairo', 'Tajawal', sans-serif; }
            `}} />
        </div>
    );
}