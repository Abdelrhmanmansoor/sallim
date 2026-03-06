import { Link } from 'react-router-dom'

const footerLinks = {
  platform: [
    { to: '/editor', label: 'المحرر' },
    { to: '/texts', label: 'بنك النصوص' },
    { to: '/eidiya', label: 'العيدية' },
  ],
  resources: [
    { to: '/', label: 'الرئيسية' },
    { to: '/dashboard', label: 'لوحة التحكم' },
  ],
  legal: [
    { to: '/privacy', label: 'الخصوصية' },
    { to: '/terms', label: 'الشروط' },
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
