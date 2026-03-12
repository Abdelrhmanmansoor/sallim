import { useState, useEffect } from 'react'
import { Check, CreditCard, Lock, ShieldCheck, Zap, ArrowRight, ChevronLeft, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [formData, setFormData] = useState({
        plan: 'personal',
        billingCycle: 'yearly',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: '',
    })

    const plans = {
        personal: {
            name: 'الباقة الشخصية',
            price: 29,
            originalPrice: 49,
            description: 'مثالية للأفراد والهواة',
            features: [
                'بطاقات غير محدودة',
                'جميع القوالب الحصرية (+٥٠)',
                'تصدير بجودة Ultra HD',
                'إزالة العلامة المائية',
                '٨ خطوط عربية فاخرة'
            ]
        },
        business: {
            name: 'باقة الأعمال',
            price: 199,
            originalPrice: 299,
            description: 'للشركات والمؤسسات الكبيرة',
            features: [
                'كل مميزات الشخصي',
                'هوية مخصصة (White Label)',
                'إرسال جماعي (Bulk)',
                'لوحة تحكم للموظفين',
                'دعم فني VIP ٢٤/٧'
            ]
        }
    }

    const currentPlan = plans[formData.plan] || plans.personal
    const isYearly = formData.billingCycle === 'yearly'
    const finalPrice = isYearly ? (currentPlan.price * 10) : (currentPlan.price)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePayment = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            alert('تمت عملية الدفع بنجاح! شكراً لثقتك بسلّم.')
            navigate('/dashboard')
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-['Tajawal'] rtl" dir="rtl">
            {/* Header / Navbar Lite */}
            <div className="bg-white border-b border-gray-100 py-6 px-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all font-bold">
                        <ChevronLeft size={20} />
                        العودة
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
                            <Zap size={20} className="text-white fill-current" />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tight">سَلِّم</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-12">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* LEFT COL: Payment & Details */}
                    <div className="space-y-10 order-2 lg:order-1">
                        
                        {/* Summary Header */}
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-4">إتمام عملية الدفع</h1>
                            <p className="text-gray-500 leading-relaxed">أنت على بعد دقائق من الاستمتاع بكافة مميزات سَلِّم الاحترافية.</p>
                        </div>

                        {/* Payment Form Wrapper */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/50 space-y-8">
                            
                            {/* Email */}
                            <div className="space-y-3">
                                <label className="text-[15px] font-bold text-gray-700 block mr-1">البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="your@email.com"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/5 transition-all outline-none text-left"
                                    dir="ltr"
                                />
                            </div>

                            {/* Card Details */}
                            <div className="space-y-6">
                                <label className="text-[15px] font-bold text-gray-700 block mr-1 flex justify-between items-center">
                                    <span>بيانات البطاقة</span>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">VISA</div>
                                        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">MADA</div>
                                    </div>
                                </label>
                                
                                <div className="space-y-4">
                                    {/* Card Number */}
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full px-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-teal-600 focus:bg-white transition-all outline-none text-left"
                                            dir="ltr"
                                        />
                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>

                                    {/* Expiry & CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY"
                                            className="px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-teal-600 focus:bg-white transition-all outline-none text-left"
                                            dir="ltr"
                                        />
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="CVV"
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-teal-600 focus:bg-white transition-all outline-none text-left"
                                                dir="ltr"
                                            />
                                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge Bar */}
                            <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-4 border border-green-100/50">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-green-900">دفع آمن ١٠٠٪</h4>
                                    <p className="text-[11px] text-green-700/70">تشفير SSL عالي المستوى لحماية بياناتك</p>
                                </div>
                            </div>

                            {/* Action */}
                            <button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full py-5 rounded-[22px] font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                                    isProcessing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(13,148,136,0.3)]'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>جاري المعالجة...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>أكد الاشتراك الآن</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COL: Summary & Social Proof */}
                    <div className="space-y-8 order-1 lg:order-2">
                        
                        {/* Order Summary */}
                        <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-teal-400 text-sm font-bold uppercase tracking-widest block mb-2">الخطة المختارة</span>
                                        <h2 className="text-3xl font-black">{currentPlan.name}</h2>
                                    </div>
                                    <div className="bg-teal-500/20 text-teal-400 px-4 py-1.5 rounded-full text-xs font-bold border border-teal-500/20">
                                        تجديد سنوي
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {currentPlan.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-4 text-gray-400">
                                            <div className="w-5 h-5 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500 border border-teal-500/10">
                                                <Check size={12} />
                                            </div>
                                            <span className="text-[15px] group-hover:text-gray-200 transition-colors">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between text-gray-400">
                                        <span>السعر الأساسي</span>
                                        <span className="line-through">{currentPlan.originalPrice} ر.س</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-gray-400 block">الإجمالي</span>
                                            <span className="text-teal-400 text-xs font-bold bg-teal-400/10 px-2 py-0.5 rounded">وفر ٢٠٪ مع الباقة السنوية</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-4xl font-black">{finalPrice}</span>
                                            <span className="text-gray-400 mr-2 text-lg">ر.س</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof / Testimonial */}
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100/80 flex gap-6 items-center">
                            <div className="relative flex-none">
                                <div className="w-16 h-16 rounded-2xl bg-teal-50 overflow-hidden">
                                     <img src="https://api.uifaces.co/our-content/donated/vY_HqdrU.jpg" className="w-full h-full object-cover grayscale opacity-80" alt="User" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white scale-75 shadow-lg border-2 border-white">
                                    <Star size={14} className="fill-current" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm italic text-gray-600 leading-relaxed mb-2">"أفضل منصة لتصميم بطاقات العيد والمناسبات، سهولة تامة وجودة احترافية في ثوانٍ!"</p>
                                <h5 className="font-bold text-gray-900 text-sm">— عبدالرحمن، مصمم جرافيك</h5>
                            </div>
                        </div>

                        {/* Money Back Guarantee */}
                        <div className="text-center px-10">
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                                ضمان استرجاع الأموال خلال ١٤ يومًا إذا لم تكن راضيًا عن الخدمة. نحن نثق في جودة منتجنا.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}