import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, AlertCircle } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'

export default function CompanyLoginPage() {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useCompany()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [status, setStatus] = useState('idle') // idle, loading
    const [errorMsg, setErrorMsg] = useState('')

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/company/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')

        const result = await login(formData.email, formData.password)

        if (result.success) {
            navigate('/company/dashboard')
        } else {
            setStatus('error')
            setErrorMsg(result.error)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">

            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2563eb]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-[#2563eb]/10 mb-6">
                        <Building2 className="w-8 h-8 text-[#2563eb]" />
                    </Link>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">تسجيل دخول الشركات</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        مرحباً بك مجدداً في مساحة عمل مؤسستك على منصة سَلِّم.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-100">

                    <form className="space-y-6" onSubmit={handleLogin}>
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                كلمة المرور
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

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-[#2563eb]/20 text-sm font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-all disabled:opacity-70"
                        >
                            {status === 'loading' ? 'جاري الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
