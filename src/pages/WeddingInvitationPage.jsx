import { useState } from 'react'
import { ArrowLeft, Heart, Sparkles, Calendar, MapPin, Users, Image as ImageIcon, X, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function WeddingInvitationPage() {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingTime: '',
    venue: '',
    guestsCount: '',
    theme: '',
    specialRequests: '',
    contactPhone: '',
    contactName: '',
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const message = `
👫 طلب دعوة زفاف مميزة
━━━━━━━━━━━━━━━
👰 العروس: ${formData.brideName}
🤵 العريس: ${formData.groomName}

📅 تاريخ الزفاف: ${formData.weddingDate}
⏰ الوقت: ${formData.weddingTime}

📍 مكان الحفل: ${formData.venue}
👥 عدد المدعوين: ${formData.guestsCount}

🎨 الثيم المفضل: ${formData.theme}

📝 متطلبات خاصة: ${formData.specialRequests || 'لا يوجد'}

━━━━━━━━━━━━━━━
📞 معلومات التواصل:
👤 الاسم: ${formData.contactName}
📱 رقم الجوال: ${formData.contactPhone}
    `.trim()

    const phoneNumber = '201007835547'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    // Show success message
    setShowSuccess(true)
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
    }, 1500)
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", background: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '32px',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <ArrowLeft size={18} />
            العودة للرئيسية
          </Link>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '100px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
            }}>
              <Sparkles size={16} color="#fff" />
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                خدمة مميزة
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              💍 اطلب دعوة زفاف
              <br />
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>فاخرة ومميزة</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              دعوات زفاف احترافية بتصاميم فاخرة تناسب ذوقك الرفيع
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Info Card */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '32px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Sparkles size={24} color="#fff" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#171717',
                  marginBottom: '8px',
                }}>
                  لماذا دعواتنا؟
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}>
                  <li style={{
                    fontSize: '14px',
                    color: '#737373',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <CheckCircle size={16} color="#E91E63" />
                    تصاميم فاخرة احترافية
                  </li>
                  <li style={{
                    fontSize: '14px',
                    color: '#737373',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <CheckCircle size={16} color="#E91E63" />
                    تخصيص كامل حسب رغبتك
                  </li>
                  <li style={{
                    fontSize: '14px',
                    color: '#737373',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <CheckCircle size={16} color="#E91E63" />
                    جودة عالية وطباعة ممتازة
                  </li>
                  <li style={{
                    fontSize: '14px',
                    color: '#737373',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <CheckCircle size={16} color="#E91E63" />
                    تسليم سريع ومضمون
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e5e5',
          }}>
            {/* Bride & Groom Names */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#171717',
                  marginBottom: '8px',
                }}>
                  👰 اسم العروس
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم العروس الكامل"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 200ms ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#E91E63'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#171717',
                  marginBottom: '8px',
                }}>
                  🤵 اسم العريس
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم العريس الكامل"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 200ms ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#E91E63'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#171717',
                  marginBottom: '8px',
                }}>
                  <Calendar size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                  تاريخ الزفاف
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 200ms ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#E91E63'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#171717',
                  marginBottom: '8px',
                }}>
                  ⏰ وقت الحفل
                </label>
                <input
                  type="time"
                  name="weddingTime"
                  value={formData.weddingTime}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 200ms ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#E91E63'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                  }}
                />
              </div>
            </div>

            {/* Venue */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '8px',
              }}>
                <MapPin size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                مكان الحفل
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="مثال: فندق الريتز كارلتون - الرياض"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 200ms ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E91E63'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              />
            </div>

            {/* Guests Count */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '8px',
              }}>
                <Users size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                عدد المدعوين المتوقع
              </label>
              <input
                type="number"
                name="guestsCount"
                value={formData.guestsCount}
                onChange={handleChange}
                required
                placeholder="مثال: 200"
                min="10"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 200ms ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E91E63'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              />
            </div>

            {/* Theme */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '8px',
              }}>
                🎨 الثيم المفضل للدعوة
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 200ms ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E91E63'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              >
                <option value="">اختر الثيم</option>
                <option value="كلاسيكي وأنيق">كلاسيكي وأنيق</option>
                <option value="عصري وألوان زاهية">عصري وألوان زاهية</option>
                <option value="ذهبي وفاخر">ذهبي وفاخر</option>
                <option value="أبيض وبسيط">أبيض وبسيط</option>
                <option value="وردي ورومانسي">وردي ورومانسي</option>
                <option value="تقليدي سعودي">تقليدي سعودي</option>
                <option value="تخصيص خاص">تخصيص خاص (سيتم التواصل معك)</option>
              </select>
            </div>

            {/* Special Requests */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
                marginBottom: '8px',
              }}>
                📝 متطلبات خاصة (اختياري)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="أي متطلبات خاصة تريدها في الدعوة..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 200ms ease',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: "'Tajawal', sans-serif",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#E91E63'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              />
            </div>

            {/* Contact Info */}
            <div style={{
              borderTop: '2px solid #f5f5f5',
              paddingTop: '24px',
              marginBottom: '24px',
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#171717',
                marginBottom: '20px',
              }}>
                معلومات التواصل
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#171717',
                    marginBottom: '8px',
                  }}>
                    👤 اسمك الكامل
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="اسم من سيقوم بالتواصل"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '12px',
                      fontSize: '15px',
                      transition: 'all 200ms ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#E91E63'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#171717',
                    marginBottom: '8px',
                  }}>
                    📱 رقم الجوال
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    placeholder="05XXXXXXXX"
                    pattern="[0-9]{10}"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '12px',
                      fontSize: '15px',
                      transition: 'all 200ms ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#E91E63'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={showSuccess}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '18px 28px',
                background: showSuccess
                  ? '#4CAF50'
                  : 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                color: '#fff',
                fontSize: '17px',
                fontWeight: 700,
                borderRadius: '14px',
                border: 'none',
                cursor: showSuccess ? 'default' : 'pointer',
                transition: 'all 200ms ease',
                boxShadow: showSuccess
                  ? 'none'
                  : '0 8px 24px rgba(233, 30, 99, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!showSuccess) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(233, 30, 99, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showSuccess) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 30, 99, 0.3)'
                }
              }}
            >
              {showSuccess ? (
                <>
                  <CheckCircle size={24} />
                  تم إرسال طلبك!
                </>
              ) : (
                <>
                  <span style={{ fontSize: '22px' }}>💍</span>
                  إرسال الطلب عبر واتساب
                </>
              )}
            </button>

            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              textAlign: 'center',
              marginTop: '16px',
            }}>
              سيتم تحويلك إلى واتساب لإكمال الطلب
            </p>
          </form>
        </div>
      </section>

      {/* Footer Note */}
      <div style={{
        background: '#fff',
        padding: '40px 24px',
        borderTop: '1px solid #e5e5e5',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>
            💖
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#171717',
            marginBottom: '12px',
          }}>
            فريقنا بانتظارك
          </h3>
          <p style={{
            fontSize: '15px',
            color: '#737373',
            lineHeight: 1.7,
          }}>
            نسعد بخدمتك وتحقيق حلمك في يوم زفاف لا يُنسى
          </p>
        </div>
      </div>
    </div>
  )
}