import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserProfile, updateUserProfile, uploadAvatar } from '../utils/api'
import { Sparkles, User, Calendar, ArrowLeft, LogOut, Edit, Loader2, Plus, MessageCircle, Eye, Download } from 'lucide-react'

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await getUserProfile()
      setUser(response.data)
      setFormData({
        name: response.data.name,
        bio: response.data.bio || '',
        avatar: response.data.avatar || ''
      })
    } catch (error) {
      setMessage({ text: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'حجم الصورة يجب أن يكون أقل من 2MB', type: 'error' })
        return
      }
      if (!file.type.startsWith('image/')) {
        setMessage({ text: 'يجب رفع صورة فقط', type: 'error' })
        return
      }
      setAvatarFile(file)
    }
  }

  // Preview uploaded image immediately
  const handlePreview = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileChange(e)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    setAvatarFile(null)

    try {
      let avatarData = formData.avatar
      
      if (avatarFile) {
        const uploadRes = await uploadAvatar(avatarFile)
        avatarData = uploadRes.data.url
      }

      const response = await updateUserProfile({
        name: formData.name,
        bio: formData.bio,
        avatar: avatarData
      })

      setUser(response.data)
      setEditing(false)
      setMessage({ text: 'تم تحديث البروفايل بنجاح!', type: 'success' })
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      setMessage({ text: error.message || 'حدث خطأ أثناء التحديث', type: 'error' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const totalGreetings = user?.diwaniyas?.reduce((sum, d) => sum + (d.greetings?.length || 0), 0) || 0
  const totalViews = user?.diwaniyas?.reduce((sum, d) => sum + (d.views || 0), 0) || 0

  if (loading) {
    return (
      <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#171717' }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#171717', marginBottom: '16px' }}>يجب تسجيل الدخول</h1>
          <p style={{ fontSize: '16px', color: '#737373', marginBottom: '24px' }}>يرجى تسجيل الدخول لعرض البروفايل</p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: '#171717',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            تسجيل الدخول
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* HERO */}
      <section style={{ background: '#171717', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '100px',
              marginBottom: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>بروفايلي</span>
          </div>

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '100px',
                  border: '4px solid rgba(255,255,255,0.2)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '100px',
                  border: '4px solid rgba(255,255,255,0.2)',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#171717',
                }}
              >
                {user.name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => setEditing(true)}
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '36px',
                height: '36px',
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Edit size={16} style={{ color: '#171717' }} />
            </button>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}
          >
            {user.name}
          </h1>

          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 32px' }}>
            {user.bio || 'لا توجد نبذة شخصية'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{user.diwaniyas?.length || 0}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>ديوانية</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{totalGreetings}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>تهنئة</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{totalViews}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>زيارة</div>
            </div>
          </div>
        </div>
      </section>

      {/* EDIT FORM */}
      {editing && (
        <section style={{ background: '#fafafa', padding: '60px 24px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {message.text && (
              <div
                style={{
                  marginBottom: '24px',
                  padding: '16px 20px',
                  background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${message.type === 'success' ? '#86efac' : '#fecaca'}`,
                  borderRadius: '12px',
                  color: message.type === 'success' ? '#166534' : '#dc2626',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>الاسم</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={50}
                  style={{
                    padding: '16px 20px',
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 200ms ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>نبذة عنك</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  maxLength={200}
                  style={{
                    padding: '16px 20px',
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'none',
                    transition: 'all 200ms ease',
                    lineHeight: 1.6,
                  }}
                />
                <p style={{ fontSize: '13px', color: '#a3a3a3' }}>{formData.bio.length}/200</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>صورة البروفايل</label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    background: '#fff',
                    border: '2px dashed #e5e5e5',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#171717'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <Upload size={20} style={{ color: '#a3a3a3' }} />
                  <span style={{ fontSize: '14px', color: '#737373' }}>
                    {avatarFile ? avatarFile.name : 'اختر صورة (حتى 2MB)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePreview} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 32px',
                    background: '#171717',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <Sparkles size={20} />
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setAvatarFile(null)
                    setMessage({ text: '', type: '' })
                  }}
                  style={{
                    padding: '16px 32px',
                    background: '#fff',
                    color: '#737373',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* DIWANIYAS LIST */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em' }}>ديوانياتي</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#171717', marginTop: '12px' }}>
              الديوانيات الخاصة بي
            </h2>
          </div>

          {user.diwaniyas && user.diwaniyas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {user.diwaniyas.map((diwaniya) => (
                <div
                  key={diwaniya._id}
                  style={{
                    padding: '24px',
                    background: '#fafafa',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fafafa'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#a3a3a3', marginBottom: '8px' }}>
                        @{diwaniya.username}
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>
                        {diwaniya.ownerName}
                      </h3>
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MessageCircle size={16} style={{ color: '#a3a3a3' }} />
                          <span style={{ fontSize: '14px', color: '#737373' }}>{diwaniya.greetings?.length || 0} تهنئة</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={16} style={{ color: '#a3a3a3' }} />
                          <span style={{ fontSize: '14px', color: '#737373' }}>{diwaniya.views || 0} زيارة</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link
                        to={`/eid/${diwaniya.username}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 20px',
                          background: '#171717',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 200ms ease',
                        }}
                      >
                        عرض
                        <ArrowLeft size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/eid/${diwaniya.username}`)
                          alert('تم نسخ الرابط!')
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 16px',
                          background: '#fff',
                          color: '#737373',
                          fontSize: '14px',
                          fontWeight: 600,
                          borderRadius: '10px',
                          border: '1px solid #e5e5e5',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                        }}
                      >
                        نسخ الرابط
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fafafa', borderRadius: '16px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#171717',
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <Sparkles size={40} style={{ color: '#fff' }} />
                </div>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>
                لا توجد ديوانيات بعد
              </h3>
              <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px' }}>
                ابدأ بإنشاء ديوانيتك الأولى واستقبل التهاني من أصدقائك
              </p>
              <Link
                to="/create-diwaniya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  background: '#171717',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <Plus size={20} />
                إنشاء ديوانية جديدة
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CREATE NEW BUTTON */}
      {user.diwaniyas && user.diwaniyas.length > 0 && (
        <section style={{ background: '#fafafa', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>
              أريد إنشاء ديوانية جديدة
            </h2>
            <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px' }}>
              أنشئ ديوانية أخرى لأصدقائك وعائلتك
            </p>
            <Link
              to="/create-diwaniya"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: '#171717',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              <Plus size={20} />
              إنشاء ديوانية جديدة
            </Link>
          </div>
        </section>
      )}

      {/* LOGOUT BUTTON */}
      <section style={{ background: '#fff', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '16px',
              background: '#fff',
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '12px',
              border: '2px solid #ef4444',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
            }}
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const Upload = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

export default ProfilePage