import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Building2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'

export default function CompanyActivationPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { activate, isAuthenticated } = useCompany()

    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        code: '',
        password: '',
        confirmPassword: ''
    })

    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('')

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/company/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleActivate = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('كلمات المرور غير متطابقة')
            return
        }

        if (formData.password.length < 6) {
            setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            return
        }

        setStatus('loading')
        setErrorMsg('')

        const result = await activate(formData.email, formData.code, formData.password)

        if (result.success) {
            setStatus('success')
            // Auto redirect after 3 seconds
            setTimeout(() => navigate('/company/dashboard'), 3000)
        } else {
            setStatus('error')
            setErrorMsg(result.error)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">

            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563eb]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4a843]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-[#2563eb]/10 mb-6">
                        <Building2 className="w-8 h-8 text-[#2563eb]" />
                    </Link>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">تفعيل حساب الشركة</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        أهلاً بك في سَلِّم للمؤسسات. أدخل كود التفعيل المرسل إلى بريدك الإلكتروني لإعداد حسابك.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-100">

                    {status === 'success' ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">تم التفعيل بنجاح!</h3>
                            <p className="text-slate-500 mb-6">جاري تحويلك إلى لوحة التحكم...</p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleActivate}>
                            {errorMsg && (
                                <div className="bg-red-50 text-red-600 p-4 justify-center rounded-xl text-sm flex items-center gap-2 font-medium">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    البريد الإلكتروني للشركة
                                </label>
                                <input
                                    type="email"
                                    required
                                    readOnly={!!searchParams.get('email')}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    كود التفعيل (أرسلناه للبريد)
                                </label>
                                <input
                                    type="text"
                                    required
                                    dir="ltr"
                                    placeholder="مثال: A7B9F1"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-center tracking-widest font-mono text-lg font-bold uppercase"
                                    value={formData.code}
                                    onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    كلمة المرور الجديدة
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-left dir-ltr"
                                    value={formData.password}
                                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    تأكيد كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-left dir-ltr"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-[#2563eb]/20 text-sm font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-all disabled:opacity-70"
                            >
                                {status === 'loading' ? 'جاري التفعيل...' : 'تفعيل الدخول'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
