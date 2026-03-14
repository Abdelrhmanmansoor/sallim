import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/api'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ email, password, role: 'admin' })
      if (res.success) {
        const user = res.data.user
        if (user.role !== 'admin') {
          setError('ليس لديك صلاحية الدخول كأدمن')
          return
        }
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/admin/dashboard')
      }
    } catch (err) {
      setError(err.message || 'بيانات غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'Tajawal', sans-serif",
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      direction: 'rtl',
      padding: 24
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>لوحة التحكم</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>دخول مخصص للمشرفين</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@sallim.co"
              style={{
                width: '100%', padding: '12px 16px', background: '#0f172a',
                border: '1.5px solid #334155', borderRadius: 10, color: '#fff',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                fontFamily: "'Tajawal', sans-serif"
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 16px', background: '#0f172a',
                border: '1.5px solid #334155', borderRadius: 10, color: '#fff',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                fontFamily: "'Tajawal', sans-serif"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#450a0a', color: '#fca5a5', padding: '10px 14px',
              borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: loading ? '#334155' : '#3b82f6',
              color: '#fff', border: 'none', borderRadius: 10, fontSize: 15,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Tajawal', sans-serif", transition: 'background 200ms'
            }}
          >
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
