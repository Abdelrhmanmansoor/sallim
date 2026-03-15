import { Link } from 'react-router-dom'

const footerLinks = {
  platform: [
    { to: '/editor', label: 'المحرر' },
    { to: '/texts', label: 'بنك النصوص' },
  ],
  resources: [
    { to: '/', label: 'الرئيسية' },
    { to: '/about', label: 'عن المنصة' },
    { to: '/pricing', label: 'الأسعار' },
  ],
  legal: [
    { to: '/privacy', label: 'الخصوصية' },
    { to: '/terms', label: 'الشروط' },
    { to: '/delivery', label: 'التوصيل' },
    { to: '/refund', label: 'الاسترداد' },
    { to: '/contact', label: 'اتصل بنا' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#fafafa',
        fontFamily: "'Tajawal', sans-serif",
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '64px 24px 32px',
        }}
      >
        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <img
              src="/images/logo.png"
              alt="سَلِّم"
              style={{ height: '32px', width: 'auto', marginBottom: '16px' }}
            />
            <p
              style={{
                fontSize: '14px',
                color: '#737373',
                lineHeight: 1.7,
                maxWidth: '240px',
              }}
            >
              منصة تصميم بطاقات تهنئة العيد بسهولة واحترافية
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '16px',
              }}
            >
              المنصة
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerLinks.platform.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    fontSize: '14px',
                    color: '#525252',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '16px',
              }}
            >
              روابط
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerLinks.resources.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    fontSize: '14px',
                    color: '#525252',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '16px',
              }}
            >
              قانوني
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerLinks.legal.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    fontSize: '14px',
                    color: '#525252',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#e5e5e5', marginBottom: '24px' }} />

        {/* User Rights Banner */}
        <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, border: '1px solid #e0e7ff' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#3730a3', marginBottom: 4 }}>حقوقك محفوظة كمستخدم</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>في حال واجهت أي مشكلة تواصل معنا مباشرة ونحل معك فوراً</div>
          </div>
          <a href="https://wa.me/966559955339?text=مرحباً، لدي استفسار حول منصة سلّم" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#25D366', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.66-.5-5.193-1.375l-.373-.22-3.862 1.007 1.03-3.763-.245-.392A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            تواصل واتساب
          </a>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#a3a3a3', margin: 0 }}>
            © {new Date().getFullYear()} سَلِّم
          </p>
          <p style={{ fontSize: '12px', color: '#d4d4d4', margin: 0 }}>
            صُنع بـ ❤️ في السعودية
          </p>
        </div>
      </div>
    </footer>
  )
}