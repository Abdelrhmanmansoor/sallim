import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Upload, MessageSquare, Image as ImageIcon, Settings, LogOut, Loader2, Sparkles } from 'lucide-react'
import { useCompany } from '../context/CompanyContext'
import { updateCompanyProfile, getMyTickets, createTicket, replyToTicket } from '../utils/api'
import toast from 'react-hot-toast'

export default function CompanyDashboardPage() {
    const { company, logout, isAuthenticated } = useCompany()
    const [activeTab, setActiveTab] = useState('profile') // profile, templates, support

    if (!isAuthenticated || !company) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
                <p className="text-slate-500 mb-4">يجب تسجيل الدخول كشركة للوصول لهذه الصفحة</p>
                <Link to="/company-login" className="btn-primary">تسجيل الدخول</Link>
            </div>
        )
    }

    return (
        <div dir="rtl" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-[#2563eb]/5 flex items-center justify-center border border-slate-100 p-2 overflow-hidden">
                        {company.logoUrl
                            ? <img src={company.logoUrl} className="w-full h-full object-contain" alt="" />
                            : <Building2 className="w-8 h-8 text-[#2563eb]/40" />
                        }
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{company.name}</h1>
                        <p className="text-slate-500 text-sm font-mono dir-ltr flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                            مساحة عمل مؤسسية نشطة | {company.email}
                        </p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-semibold whitespace-nowrap">
                    تسجيل الخروج
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <SidebarNavButton
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                        icon={<Settings className="w-5 h-5" />}
                        label="إعدادات الهوية"
                    />
                    <SidebarNavButton
                        active={activeTab === 'templates'}
                        onClick={() => setActiveTab('templates')}
                        icon={<ImageIcon className="w-5 h-5" />}
                        label="القوالب والإصدار (قريباً)"
                    />
                    <SidebarNavButton
                        active={activeTab === 'support'}
                        onClick={() => setActiveTab('support')}
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="الدعم وطلبات التصميم الدقيقة"
                    />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && <ProfileSettings company={company} />}
                    {activeTab === 'templates' && <PlaceholderBox title="القوالب وإصدار البطاقات" description="هنا ستتمكن قريباً من عرض قوالبك المخصصة والسماح لموظفيك بإصدار بطاقات التهنئة برابط موثق باسم شركتك." />}
                    {activeTab === 'support' && <SupportTicketsPanel company={company} token={token} />}
                </div>
            </div>
        </div>
    )
}

function ProfileSettings({ company }) {
    const [logo, setLogo] = useState(company.logoUrl || '')
    const [isUploading, setIsUploading] = useState(false)
    const { token, updateCompanyData } = useCompany()

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('يرجى رفع صورة فقط')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت')
            return
        }

        try {
            setIsUploading(true)

            // Create FormData to send the file
            const formData = new FormData()
            formData.append('logo', file)

            // Call the API
            const response = await updateCompanyProfile(token, formData)

            if (response.success && response.data) {
                setLogo(response.data.logoUrl)
                // Update the company context so the logo updates everywhere (navbar, etc.)
                updateCompanyData(response.data)
                toast.success('تم تحديث الشعار بنجاح')
            }
        } catch (error) {
            toast.error(error.message || 'حدث خطأ أثناء رفع الشعار')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="bg-white border text-right border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm relative">
            {isUploading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-8 h-8 text-[#2563eb] animate-spin" />
                </div>
            )}

            <h3 className="text-xl font-bold text-slate-900 mb-6">إعدادات هوية المؤسسة</h3>

            <div className="space-y-6 max-w-xl">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">شعار الشركة التعريفي</label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                            {logo ? <img src={logo} className="w-full h-full object-contain" alt="Logo" /> : <Building2 className="w-8 h-8 text-slate-300" />}
                        </div>
                        <div>
                            <label className={`btn-primary cursor-pointer inline-flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <Upload className="w-4 h-4" />
                                {isUploading ? 'جاري الرفع...' : 'تغيير الشعار'}
                                <input type="file" accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp" onChange={handleLogoUpload} className="hidden" disabled={isUploading} />
                            </label>
                            <p className="text-xs text-slate-400 mt-2">خلفية شفافة PNG مقاس 500x500 كحد أقصى (5MB)</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">اسم المؤسسة التعريفي</label>
                    <input type="text" disabled value={company.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                    <p className="text-xs text-slate-400 mt-2">لا يمكن تغيير الاسم الأساسي المسجل إلا عبر الإدارة.</p>
                </div>
            </div>
        </div>
    )
}

function SidebarNavButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
        ${active
                    ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                }`}
        >
            <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
            {label}
        </button>
    )
}

function PlaceholderBox({ title, description }) {
    return (
        <div className="bg-slate-50 border border-slate-100 border-dashed rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-[#2563eb]/40" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm">{description}</p>
        </div>
    )
}

/* ─────────── Support Tickets Panel ─── */
function SupportTicketsPanel({ company, token }) {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('list') // list, new, ticket
    const [selectedTicket, setSelectedTicket] = useState(null)

    // Form states
    const [newTicket, setNewTicket] = useState({ subject: '', message: '', type: 'support' })
    const [replyMsg, setReplyMsg] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => { fetchTickets() }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await getMyTickets(token)
            setTickets(res.data || [])
        } catch (error) {
            toast.error('حدث خطأ في جلب التذاكر')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTicket = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await createTicket(token, newTicket)
            toast.success('تم فتح التذكرة بنجاح')
            setNewTicket({ subject: '', message: '', type: 'support' })
            fetchTickets()
            setView('list')
        } catch (error) {
            toast.error(error.message || 'حدث خطأ')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyMsg.trim()) return
        setIsSubmitting(true)
        try {
            const res = await replyToTicket(token, selectedTicket._id, replyMsg)
            toast.success('تم إرسال الرد')
            setReplyMsg('')
            setSelectedTicket(res.data) // Update the ticket replies
            fetchTickets() // Refresh the list
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال الرد')
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
    }

    return (
        <div className="bg-white border text-right border-slate-100 rounded-3xl overflow-hidden shadow-sm relative min-h-[500px] flex flex-col">
            {/* Header Toolbar */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">
                    {view === 'list' ? 'تذاكر الدعم والطلبات' : view === 'new' ? 'تذكرة جديدة' : `تذكرة: ${selectedTicket?.subject}`}
                </h3>
                {view !== 'list' && (
                    <button onClick={() => setView('list')} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        العودة للقائمة
                    </button>
                )}
                {view === 'list' && (
                    <button onClick={() => setView('new')} className="btn-primary text-sm px-4 py-2">
                        + تذكرة جديدة
                    </button>
                )}
            </div>

            {/* List View */}
            {view === 'list' && (
                <div className="p-6 flex-1">
                    {tickets.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 text-sm">لا توجد تذاكر حالياً. اضغط على "تذكرة جديدة" للبدء.</div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map(t => (
                                <div key={t._id} onClick={() => { setSelectedTicket(t); setView('ticket'); }} className="group p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            {t.subject}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.type === 'custom_design' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {t.type === 'custom_design' ? 'مخصص' : 'دعم عام'}
                                            </span>
                                        </h4>
                                        <span className="text-xs text-slate-400">{formatDate(t.createdAt)}</span>
                                    </div>
                                    <div className={`text-[10px] px-3 py-1 rounded-lg font-bold ${t.status === 'open' ? 'bg-amber-100 text-amber-600' :
                                        t.status === 'answered' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                        {t.status === 'open' ? 'بانتظار الرد (نشطة)' : t.status === 'answered' ? 'تم الرد' : 'مغلقة'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* New Ticket View */}
            {view === 'new' && (
                <div className="p-6 flex-1 max-w-2xl">
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">نوع الطلب</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-[#2563eb]" value={newTicket.type} onChange={e => setNewTicket({ ...newTicket, type: e.target.value })}>
                                <option value="support">دعم فني عام</option>
                                <option value="custom_design">طلب تصميم بطاقة مخصص لهويتك</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">عنوان التذكرة</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-[#2563eb]" value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="مثال: إضافة خط جديد، تحسين البطاقة..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">التفاصيل / الرسالة</label>
                            <textarea required className="w-full h-32 resize-none px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-[#2563eb]" value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })} placeholder="اكتب تفاصيل طلبك بدقة للرد عليك في أسرع وقت..."></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center mt-2">{isSubmitting ? 'جاري الإرسال...' : 'إرسال التذكرة'}</button>
                    </form>
                </div>
            )}

            {/* Ticket Chat View */}
            {view === 'ticket' && selectedTicket && (
                <div className="flex flex-col flex-1 h-[500px]">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {selectedTicket.replies.map((reply, i) => {
                            const isMe = reply.sender === 'company';
                            return (
                                <div key={i} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${isMe ? 'bg-[#2563eb] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{reply.message}</div>
                                        <div className={`text-[10px] mt-2 opacity-60 text-left`} dir="ltr">{formatDate(reply.createdAt)}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {selectedTicket.status !== 'closed' ? (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                            <form onSubmit={handleReply} className="flex gap-3">
                                <input required type="text" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-[#2563eb]" placeholder="اكتب ردك هنا..." value={replyMsg} onChange={e => setReplyMsg(e.target.value)} />
                                <button type="submit" disabled={isSubmitting} className="btn-primary px-6">إرسال</button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto text-center text-sm text-slate-400">
                            هذه التذكرة مغلقة ولا يمكن الرد عليها.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

