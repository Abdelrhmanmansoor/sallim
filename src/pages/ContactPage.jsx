import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // In production, this would send to your backend
        console.log('Form submitted:', formData)
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(180deg, #070d1a, #0c1929, #111f36)', paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px' }}>
                        <MessageCircle style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>تواصل معنا</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>اتصل بنا</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>نحن هنا للإجابة على جميع استفساراتك</p>
                </div>
            </section>

            {/* Content */}
            <section style={{ background: '#fff', padding: '80px 24px 120px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
                    
                    {/* Contact Info */}
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '32px' }}>معلومات التواصل</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Phone style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '4px', margin: '0 0 4px 0' }}>الهاتف</p>
                                    <a href="tel:+201007835547" style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'block' }}>
                                        +20 100 783 5547
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Mail style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '4px', margin: '0 0 4px 0' }}>البريد الإلكتروني</p>
                                    <a href="mailto:support@sallim.com" style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'block' }}>
                                        support@sallim.com
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #C5A75F, #a8893d)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <MapPin style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '4px', margin: '0 0 4px 0' }}>العناوين</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.6 }}>
                                            <span style={{ color: '#C5A75F' }}>جورجيا</span><br />
                                            تبليسي، جورجيا
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.6 }}>
                                            <span style={{ color: '#C5A75F' }}>المملكة العربية السعودية</span><br />
                                            الرياض، الملز
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.6 }}>
                                            <span style={{ color: '#C5A75F' }}>مصر</span><br />
                                            القاهرة، مصر
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>تابعنا على</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        background: '#1877f2',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        transition: 'all 200ms ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(24, 119, 242, 0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <Facebook style={{ width: '24px', height: '24px' }} />
                                </a>

                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        transition: 'all 200ms ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(131, 58, 180, 0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <Instagram style={{ width: '24px', height: '24px' }} />
                                </a>

                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        background: '#000000',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        transition: 'all 200ms ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <Twitter style={{ width: '24px', height: '24px' }} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ background: '#fafafa', padding: '40px', borderRadius: '20px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '32px' }}>أرسل رسالة</h2>
                        
                        {submitted ? (
                            <div style={{ 
                                background: 'linear-gradient(135deg, #10b981, #059669)', 
                                padding: '32px', 
                                borderRadius: '12px', 
                                textAlign: 'center',
                                color: '#fff'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', margin: '0 0 12px 0' }}>تم الإرسال بنجاح!</h3>
                                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>الاسم الكامل</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="أدخل اسمك الكامل"
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="example@email.com"
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+20 1XXXXXXXXX"
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>الموضوع</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="موضوع رسالتك"
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>الرسالة</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="اكتب رسالتك هنا..."
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            fontSize: '15px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 200ms ease',
                                            resize: 'vertical',
                                            fontFamily: "'Tajawal', sans-serif",
                                            lineHeight: 1.6,
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

                                <button
                                    type="submit"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        width: '100%',
                                        padding: '16px 32px',
                                        fontSize: '16px',
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
                                    <Send style={{ width: '20px', height: '20px' }} />
                                    إرسال الرسالة
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}