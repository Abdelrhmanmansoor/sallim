import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, DollarSign, CreditCard, Smartphone, Award } from 'lucide-react'

export default function DonatePage() {
  const supportTiers = [
    {
      name: 'داعم فضي',
      amount: '25',
      icon: '🥈',
      color: '#c0c0c0',
      benefits: ['شكر خاص في الموقع', 'أولوية في الميزات الجديدة']
    },
    {
      name: 'داعم ذهبي',
      amount: '50',
      icon: '🥇',
      color: '#ffd700',
      benefits: ['كل مزايا الداعم الفضي', 'اسمك في صفحة خاصة', 'دعم فني مميز']
    },
    {
      name: 'داعم بلاتيني',
      amount: '100+',
      icon: '💎',
      color: '#e5e4e2',
      benefits: ['كل المزايا السابقة', 'تصميم مخصص', 'تواصل مباشر']
    }
  ]

  return (
    <div dir="rtl" style={{
      fontFamily: "'Tajawal', sans-serif",
      background: 'linear-gradient(180deg, #fafafa 0%, #fff 100%)',
      minHeight: '100vh',
      color: '#171717'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#666',
          fontSize: '14px',
          textDecoration: 'none',
          fontWeight: 600
        }}>
          <ArrowLeft size={18} />
          الرئيسية
        </Link>
        <div style={{ fontWeight: 700, fontSize: '18px' }}>ادعم المشروع</div>
        <div></div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 40px' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💝</div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #171717, #404040)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ساهم في استمرار المنصة
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            مشروعنا مفتوح المصدر ومجاني للجميع. دعمكم يساعدنا في تحسين الخدمة وتطوير ميزات جديدة
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>الهدف الشهري</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>٢,٥٠٠ / ٥,٠٠٠ ريال</span>
          </div>
          <div style={{
            height: '12px',
            background: '#f5f5f5',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: '50%',
              background: 'linear-gradient(90deg, #171717, #404040)',
              borderRadius: '10px'
            }} />
          </div>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', textAlign: 'center' }}>
            ٥٠٪ من الهدف - شكراً لدعمكم! 🎉
          </p>
        </div>

        {/* Support Tiers */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '20px',
            textAlign: 'center'
          }}>باقات الدعم</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {supportTiers.map((tier) => (
              <div key={tier.name} style={{
                padding: '24px',
                background: '#fff',
                borderRadius: '16px',
                border: `2px solid ${tier.color}`,
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{tier.icon}</div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#171717',
                  marginBottom: '8px'
                }}>{tier.name}</h3>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: tier.color,
                  marginBottom: '16px'
                }}>{tier.amount} ريال</div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '20px',
                  textAlign: 'right'
                }}>
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://paypal.me/SOLIMANW/${parseInt(tier.amount) || 100}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '12px',
                    background: tier.color,
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    textDecoration: 'none'
                  }}
                >
                  ادعم الآن
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #eee'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '24px',
            textAlign: 'center'
          }}>طرق الدفع المتاحة</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <a
              href="https://paypal.me/SOLIMANW"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '12px',
                border: '1px solid #eee',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🅿️</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>PayPal</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>دولي وآمن</div>
            </a>
            
            <div style={{
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏦</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>تحويل بنكي</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>للأرقام المحلية</div>
            </div>
            
            <div style={{
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>Apple Pay</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>قريباً</div>
            </div>
            
            <div style={{
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '12px',
              border: '1px solid #eee',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>بطاقة ائتمان</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>قريباً</div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div style={{
          background: 'linear-gradient(135deg, #171717, #262626)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <Heart style={{ width: '48px', height: '48px', color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '12px'
          }}>أين يذهب دعمك؟</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
            marginTop: '24px'
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>٤٠٪</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>تطوير وتحسينات</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>٣٠٪</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>استضافة وخدمات</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>٢٠٪</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>دعم فني</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6' }}>١٠٪</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>تسويق</div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #eee',
          textAlign: 'center'
        }}>
          <Award style={{ width: '32px', height: '32px', color: '#f59e0b', marginBottom: '12px' }} />
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#171717',
            marginBottom: '8px'
          }}>شكر خاص لكل الداعمين</h3>
          <p style={{
            fontSize: '14px',
            color: '#666'
          }}>دعمكم هو ما يجعل هذا المشروع مستمرًا ❤️</p>
        </div>

      </div>
    </div>
  )
}
