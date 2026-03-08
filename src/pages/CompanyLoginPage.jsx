import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ArrowLeft, Mail, Lock } from 'lucide-react'

export default function CompanyLoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store mock user data
      localStorage.setItem('user', JSON.stringify({
        name: 'شركة تجريبية',
        email: formData.email,
        role: 'company',
      }))
      localStorage.setItem('token', 'mock-company-token')
      
      navigate('/company/dashboard')
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بياناتك.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* HERO - Same style as LandingPage */}
      <section
        style={{
          background: '#171717',
          padding: 0,
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
          }}
        >
          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '480px',
              margin: '0 auto',
              padding: '120px 24px',
              textAlign: 'center',
            }}
          >
            {/* Back Button */}
            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                <ArrowLeft size={16} />
                العودة للرئيسية
              </button>
            </div>

            {/* Icon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                marginBottom: '32px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Building2 size={36} color="#fff" />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '12px',
                letterSpacing: '-0.02em',
              }}
            >
              دخول المؤسسات
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '48px',
                lineHeight: 1.6,
              }}
            >
              سجل دخول لاستخدام نظام سَلِّم للمؤسسات
            </p>

            {/* Form Card */}
            <div
              style={{
                padding: '32px',
                background: '#262626',
                borderRadius: '20px',
                border: '1px solid ' + (error ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'),
                textAlign: 'right',
              }}
            >
              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: '16px 20px',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#fca5a5', margin: 0, lineHeight: 1.6 }}>
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#a3a3a3',
                      marginBottom: '8px',
                    }}
                  >
                    البريد الإلكتروني
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={18}
                      color="#737373"
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@company.com"
                      dir="ltr"
                      style={{
                        width: '100%',
                        padding: '14px 48px 14px 16px',
                        background: '#171717',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 200ms ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    htmlFor="password"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#a3a3a3',
                      marginBottom: '8px',
                    }}
                  >
                    كلمة المرور
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      color="#737373"
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="•••••••••"
                      style={{
                        width: '100%',
                        padding: '14px 48px 14px 16px',
                        background: '#171717',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 200ms ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: '13px',
                      color: '#a3a3a3',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 200ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(23,23,23,0.1)',
                        borderTopColor: '#171717',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      <style>{`
                        @keyframes spin {
                          to { transform: rotate(360deg); }
                        }
                      `}</style>
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      تسجيل الدخول
                      <ArrowLeft size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '32px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ليس لديك حساب مؤسسي؟
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    to="/company-activation"
                    style={{
                      width: '100%',
                      padding: '14px 28px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      transition: 'all 200ms ease',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}
                  >
                    تفعيل كود الاشتراك
                  </Link>

                  <a
                    href="mailto:support@sallim.co"
                    style={{
                      width: '100%',
                      padding: '14px 28px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      transition: 'all 200ms ease',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}
                  >
                    طلب كود الاشتراك
                  </a>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div style={{ marginTop: '32px' }}>
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '8px',
                }}
              >
                تحتاج مساعدة؟ تواصل مع فريق الدعم
              </p>
              <a
                href="mailto:support@sallim.co"
                style={{
                  fontSize: '14px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                support@sallim.co
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}