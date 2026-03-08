import { useState } from 'react'
import { Check, CreditCard, Lock } from 'lucide-react'

export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        plan: 'professional',
        billingCycle: 'monthly',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    })

    const plans = {
        free: {
            name: 'المجانية',
            price: '0',
            features: ['10 قوالب أساسية', 'تصميم 5 بطاقات شهريًا', 'جودة متوسطة', 'دعم عبر البريد']
        },
        professional: {
            name: 'الاحترافية',
            price: '49',
            features: ['+50 قالب احترافي', 'تصميم غير محدود', 'جودة HD', 'دعم أولوي', 'بدون علامة مائية', 'تصدير بجميع الصيغ']
        },
        enterprise: {
            name: 'الشركات',
            price: 'مخصص',
            features: ['كل ميزات الاحترافية', 'قوالب حصرية', 'تكامل API', 'مدير حساب مخصص', 'دعم 24/7']
        }
    }

    const currentPlan = plans[formData.plan]
    const isYearly = formData.billingCycle === 'yearly'
    const displayPrice = formData.plan === 'enterprise' ? 'تواصل معنا' : 
        (isYearly ? (parseInt(currentPlan.price) * 10) : currentPlan.price) + ' ر.س/شهر'

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = () => {
        if (formData.plan === 'enterprise') {
            window.location.href = '/contact'
        } else {
            alert('سيتم معالجة الدفع. (هذا نموذج تجريبي)')
        }
    }

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>إتمام الاشتراك</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>أنت على بعد خطوة واحدة من البدء</p>
                </div>
            </section>

            {/* Checkout Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
                    
                    {/* Order Summary */}
                    <div style={{ order: 2 }}>
                        <div style={{ background: '#fafafa', padding: '32px', borderRadius: '20px', position: 'sticky', top: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>ملخص الطلب</h2>
                            
                            {/* Plan Selection */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>اختر الخطة</label>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'plan', value: 'professional' }})}
                                        style={{
                                            padding: '16px',
                                            border: formData.plan === 'professional' ? '2px solid #C5A75F' : '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            background: formData.plan === 'professional' ? '#fef9e7' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            textAlign: 'right',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>الاحترافية</span>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#C5A75F' }}>49 ر.س/شهر</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Check style={{ width: '14px', height: '14px', color: '#10b981' }} />
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>الأكثر شعبية</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'plan', value: 'enterprise' }})}
                                        style={{
                                            padding: '16px',
                                            border: formData.plan === 'enterprise' ? '2px solid #C5A75F' : '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            background: formData.plan === 'enterprise' ? '#fef9e7' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            textAlign: 'right',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>الشركات</span>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#C5A75F' }}>مخصص</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Billing Cycle */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>فترة الفوترة</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'billingCycle', value: 'monthly' }})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: formData.billingCycle === 'monthly' ? '2px solid #C5A75F' : '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            background: formData.billingCycle === 'monthly' ? '#fef9e7' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#0f172a',
                                        }}
                                    >
                                        شهري
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'billingCycle', value: 'yearly' }})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: formData.billingCycle === 'yearly' ? '2px solid #C5A75F' : '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            background: formData.billingCycle === 'yearly' ? '#fef9e7' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#0f172a',
                                        }}
                                    >
                                        سنوي <span style={{ color: '#10b981', fontSize: '12px' }}>وفر ٢٠٪</span>
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>ما ستحصل عليه:</label>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {currentPlan.features.map((feature, index) => (
                                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>
                                            <Check style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Total */}
                            <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>المجموع</span>
                                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{displayPrice}</span>
                                </div>
                                {isYearly && (
                                    <p style={{ fontSize: '12px', color: '#10b981', margin: '0', marginTop: '8px' }}>توفر {parseInt(currentPlan.price) * 12 * 0.2} ر.س سنويًا</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div style={{ order: 1 }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '32px' }}>معلومات الدفع</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Card Number */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>رقم البطاقة</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="0000 0000 0000 0000"
                                        maxLength="19"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 56px',
                                            fontSize: '15px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            direction: 'ltr',
                                            textAlign: 'left',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#C5A75F'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 167, 95, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                    <CreditCard style={{ 
                                        position: 'absolute', 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        width: '24px',
                                        height: '24px',
                                        color: '#64748b'
                                    }} />
                                </div>
                            </div>

                            {/* Card Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>الاسم على البطاقة</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    placeholder="الاسم كما هو مكتوب على البطاقة"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        fontSize: '15px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'all 200ms ease',
                                        fontFamily: "'Tajawal', sans-serif",
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#C5A75F'
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 167, 95, 0.1)'
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                />
                            </div>

                            {/* Expiry & CVV */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>تاريخ الانتهاء</label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            fontSize: '15px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            direction: 'ltr',
                                            textAlign: 'left',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#C5A75F'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 167, 95, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>CVV</label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        maxLength="4"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            fontSize: '15px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                            fontFamily: "'Tajawal', sans-serif",
                                            direction: 'ltr',
                                            textAlign: 'left',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#C5A75F'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 167, 95, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Security Note */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                padding: '16px',
                                background: '#f0fdfa',
                                border: '1px solid #ccfbf1',
                                borderRadius: '12px'
                            }}>
                                <Lock style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                                <p style={{ fontSize: '13px', color: '#065f46', margin: 0, lineHeight: 1.6 }}>
                                    معلومات بطاقتك محمية بتشفير SSL عالي المستوى
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    width: '100%',
                                    padding: '18px 32px',
                                    fontSize: '17px',
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: 'linear-gradient(135deg, #C5A75F, #a8893d)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                    boxShadow: '0 4px 12px rgba(197,167,95,0.3)',
                                    fontFamily: "'Tajawal', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(197,167,95,0.4)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(197,167,95,0.3)'
                                }}
                            >
                                {formData.plan === 'enterprise' ? 'تواصل معنا' : 'إتمام الدفع'}
                            </button>

                            {/* Cancel */}
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                style={{
                                    width: '100%',
                                    padding: '16px 32px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                    fontFamily: "'Tajawal', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#0f172a'
                                    e.currentTarget.style.background = '#f3f4f6'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#64748b'
                                    e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                إلغاء والعودة
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}