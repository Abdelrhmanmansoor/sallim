import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, Mail, Phone, CheckCircle, Users, BarChart, Shield } from 'lucide-react'

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* HERO - Same style as CompanyLoginPage */}
      <section style={{ background: '#171717', padding: 0 }}>
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
                <ArrowRight size={16} />
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
              منصة سَلِّم
              <span style={{ display: 'block', fontSize: '0.85em', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                للمؤسسات
              </span>
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
              نظام متكامل لإنشاء بطاقات التهنئة المخصصة للشركات
            </p>

            {/* Info Card */}
            <div
              style={{
                padding: '32px',
                background: '#262626',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'right',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                مميزات النظام المؤسسي
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={18} color="#a3a3a3" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      هوية بصرية مخصصة
                    </div>
                    <div style={{ fontSize: '13px', color: '#a3a3a3' }}>
                      ألوان وخطوط خاصة بشركتك
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Users size={18} color="#a3a3a3" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      إدارة الفريق
                    </div>
                    <div style={{ fontSize: '13px', color: '#a3a3a3' }}>
                      صلاحيات متعددة للموظفين
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BarChart size={18} color="#a3a3a3" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      حملات إرسال جماعية
                    </div>
                    <div style={{ fontSize: '13px', color: '#a3a3a3' }}>
                      آلاف البطاقات دفعة واحدة
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Shield size={18} color="#a3a3a3" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      أمان وتحليلات
                    </div>
                    <div style={{ fontSize: '13px', color: '#a3a3a3' }}>
                      تتبع كامل وشفاف
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {user?.role === 'admin' ? (
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 28px',
                  background: '#fff',
                  color: '#171717',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  marginBottom: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                لوحة التحكم
                <ArrowRight size={18} />
              </Link>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => navigate('/company-login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 28px',
                    background: '#fff',
                    color: '#171717',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  دخول المؤسسات
                  <ArrowRight size={18} />
                </button>

                <Link
                  to="/company-activation"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 28px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textDecoration: 'none',
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
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                marginTop: '32px',
                marginBottom: '32px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            />

            {/* Contact Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="mailto:support@sallim.co"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
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
                <Mail size={18} />
                طلب كود الاشتراك
              </a>

              <a
                href="tel:+201007835547"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  textDecoration: 'none',
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
                <Phone size={18} />
                اتصل بنا
              </a>
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