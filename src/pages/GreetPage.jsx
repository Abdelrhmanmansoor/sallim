import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTemplates } from '../utils/api'
import toast, { Toaster } from 'react-hot-toast'

const ds = { font: "'Tajawal', sans-serif" }

export default function GreetPage() {
    const { slug, occasionId } = useParams()
    const [name, setName] = useState('')
    const [generated, setGenerated] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleGenerate = () => {
        if (!name.trim()) {
            toast.error('اكتب اسمك أولاً')
            return
        }
        setLoading(true)
        // Navigate to editor with employee greet mode
        window.location.href = `/editor?mode=ready&greet=1&name=${encodeURIComponent(name.trim())}&slug=${slug}&occasion=${occasionId || ''}`
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            fontFamily: ds.font,
            direction: 'rtl',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        }}>
            <Toaster position="top-center" />

            <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
                {/* Company Logo Placeholder */}
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}>
                    <span style={{ fontSize: 32 }}>🏢</span>
                </div>

                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                    بطاقة تهنئة خاصة بك
                </h1>
                <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 36, lineHeight: 1.8 }}>
                    اكتب اسمك وحمّل بطاقتك المخصصة
                </p>

                {!generated ? (
                    <div style={{ background: '#1e293b', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#cbd5e1', marginBottom: 10, textAlign: 'right' }}>
                            اكتب اسمك
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: محمد أحمد"
                            dir="rtl"
                            style={{
                                width: '100%', padding: '16px 20px',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 14, color: '#fff', fontSize: 17, fontWeight: 700,
                                fontFamily: ds.font, outline: 'none', textAlign: 'center',
                                marginBottom: 20,
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '16px',
                                background: loading ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', border: 'none', borderRadius: 16,
                                fontSize: 17, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: ds.font,
                                boxShadow: loading ? 'none' : '0 8px 24px rgba(16,185,129,0.3)',
                            }}
                        >
                            {loading ? 'جارٍ التحضير...' : 'ولّد بطاقتي 🎉'}
                        </button>
                    </div>
                ) : (
                    <div style={{ background: '#1e293b', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>بطاقتك جاهزة!</h3>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>يمكنك تحميلها أو مشاركتها</p>
                    </div>
                )}

                <p style={{ fontSize: 12, color: '#475569', marginTop: 24 }}>
                    مقدمة من منصة سلّم — sallim.co
                </p>
            </div>
        </div>
    )
}
