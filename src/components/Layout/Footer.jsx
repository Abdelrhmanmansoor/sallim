import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const platformLinks = [
  { to: '/editor', label: 'المحرر' },
  { to: '/texts', label: 'بنك النصوص' },
  { to: '/send', label: 'الإرسال' },
  { to: '/pricing', label: 'الأسعار' },
]

const resourceLinks = [
  { to: '/', label: 'الصفحة الرئيسية' },
  { to: '/eidiya', label: 'العيدية' },
  { to: '/business', label: 'للشركات' },
  { to: '/dashboard', label: 'لوحة التحكم' },
]

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER — Premium Dark Navy, Organized, Matching tf1one.com Style
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #070d1a 0%, #0a1628 50%, #060c18 100%)',
      color: '#ffffff',
      fontFamily: "'Tajawal', sans-serif",
    }}>

      {/* Top divider line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(45,212,191,0.3), transparent)',
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 24px 40px',
      }}>

        {/* Top row: Brand + Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '64px',
        }}>

          {/* Brand column */}
          <div>
            <img
              src="/images/logo.png"
              alt="سَلِّم"
              style={{ height: '44px', width: 'auto', marginBottom: '20px', filter: 'brightness(10)' }}
            />
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8,
              maxWidth: '280px',
              marginBottom: '24px',
            }}>
              منصة عربية لتصميم بطاقات تهنئة العيد وإرسالها مباشرة. صمّم بطاقتك في ثوانٍ وشاركها مع من تحب.
            </p>
            <Link to="/editor" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
              color: '#020617',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              <Sparkles style={{ width: '14px', height: '14px' }} />
              ابدأ التصميم
            </Link>
          </div>

          {/* Platform links */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              خدمات المنصة
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {platformLinks.map(l => (
                <Link key={l.to} to={l.to} style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(45,212,191,0.3)',
                    flexShrink: 0,
                  }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resource links */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              روابط سريعة
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {resourceLinks.map(l => (
                <Link key={l.to} to={l.to} style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(45,212,191,0.3)',
                    flexShrink: 0,
                  }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact / Support */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              الدعم
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'المساعدة', to: '/' },
                { label: 'سياسة الخصوصية', to: '/privacy' },
                { label: 'الشروط والأحكام', to: '/terms' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(45,212,191,0.3)',
                    flexShrink: 0,
                  }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.25)',
            margin: 0,
          }}>
            © {new Date().getFullYear()} سَلِّم — جميع الحقوق محفوظة
          </p>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.2)',
            margin: 0,
          }}>
            تابع لمؤسسة سليمان
          </p>
        </div>
      </div>
    </footer>
  )
}