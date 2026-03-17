import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { templates as staticTemplates, designerOnlyTemplates } from '../data/templates'
import toast, { Toaster } from 'react-hot-toast'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const FONT = "'Amiri', 'Cairo', serif"
const UI_FONT = "'Tajawal', sans-serif"

export default function GreetPage() {
    const { slug, occasionId } = useParams()
    const [searchParams] = useSearchParams()
    const prefilledName = searchParams.get('for') || ''
    const tmplId = searchParams.get('tmpl') || ''
    const greetingMsg = searchParams.get('msg') || ''

    const [name, setName] = useState(prefilledName)
    const [company, setCompany] = useState(null)
    const [template, setTemplate] = useState(null)
    const [loadingCompany, setLoadingCompany] = useState(true)
    const [cardGenerated, setCardGenerated] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [cardDataUrl, setCardDataUrl] = useState(null)
    const canvasRef = useRef(null)

    // Fetch company info
    useEffect(() => {
        fetch(`${API_BASE}/api/v1/company/public/${slug}`)
            .then(r => r.json())
            .then(res => { if (res.success) setCompany(res.data) })
            .catch(() => {})
            .finally(() => setLoadingCompany(false))
    }, [slug])

    // Find template from static data
    useEffect(() => {
        if (!tmplId) return
        const all = [...staticTemplates, ...designerOnlyTemplates]
        const found = all.find(t => String(t.id) === String(tmplId))
        if (found) setTemplate(found)
    }, [tmplId])

    // Generate card on canvas
    const generateCard = useCallback(async (recipientName) => {
        if (!template) return null
        setGenerating(true)

        try {
            const templateImg = await new Promise((resolve, reject) => {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => resolve(img)
                img.onerror = () => reject(new Error('فشل تحميل القالب'))
                img.src = template.image
            })

            const W = templateImg.naturalWidth || 1080
            const H = templateImg.naturalHeight || 1920
            const canvas = canvasRef.current || document.createElement('canvas')
            canvas.width = W
            canvas.height = H
            const ctx = canvas.getContext('2d')

            // Draw template background
            ctx.clearRect(0, 0, W, H)
            ctx.drawImage(templateImg, 0, 0, W, H)

            // Recipient name — matching EditorPage: Y=0.65, fontSize=60 at 1080px
            const textColor = template.textColor || template.nameColor || '#ffffff'
            const fontSize = Math.round(60 * (W / 1080))
            ctx.font = `normal ${fontSize}px ${FONT}`
            ctx.fillStyle = textColor
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.direction = 'rtl'
            ctx.fillText(recipientName, W / 2, H * 0.65)

            const dataUrl = canvas.toDataURL('image/png')
            setCardDataUrl(dataUrl)

            // Record card on backend (deducts from balance)
            try {
                await fetch(`${API_BASE}/api/v1/company/public/${slug}/cards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: recipientName,
                        templateId: String(template.id),
                        mainText: greetingMsg || `كل عام وأنت بخير ${recipientName}`,
                    })
                })
            } catch { /* silent — don't block user */ }

            return dataUrl
        } catch (err) {
            toast.error(err.message || 'حدث خطأ')
            return null
        } finally {
            setGenerating(false)
        }
    }, [template, slug, greetingMsg])

    const handleGenerate = async () => {
        if (!name.trim()) { toast.error('اكتب اسمك أولاً'); return }
        const result = await generateCard(name.trim())
        if (result) {
            setCardGenerated(true)
            toast.success('بطاقتك جاهزة! 🎉')
        }
    }

    const handleDownload = () => {
        if (!cardDataUrl) return
        const link = document.createElement('a')
        link.href = cardDataUrl
        link.download = `تهنئة-${name.trim()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        if (!cardDataUrl) return
        try {
            const blob = await (await fetch(cardDataUrl)).blob()
            const file = new File([blob], `تهنئة-${name.trim()}.png`, { type: 'image/png' })
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], title: 'بطاقة تهنئة' })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('تم نسخ الرابط')
            }
        } catch { toast.error('تعذرت المشاركة') }
    }

    const companyName = company?.name || ''
    const companyLogo = company?.logoUrl || ''
    const displayName = companyName && !companyName.startsWith('شركة ') ? companyName : companyName

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            fontFamily: UI_FONT, direction: 'rtl',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <Toaster position="top-center" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>

                {/* Company Logo / Name */}
                {loadingCompany ? (
                    <div style={{ color: '#64748b', padding: 40 }}>جارٍ التحميل...</div>
                ) : (
                    <>
                        {companyLogo ? (
                            <img src={companyLogo} alt={displayName} style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', margin: '0 auto 20px', display: 'block', border: '2px solid rgba(255,255,255,0.1)' }} />
                        ) : displayName ? (
                            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32, fontWeight: 900, color: '#fff' }}>
                                {displayName[0]}
                            </div>
                        ) : null}

                        {displayName && (
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{displayName}</h2>
                        )}

                        <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 900, color: '#fff', marginBottom: 6, marginTop: displayName ? 12 : 0 }}>
                            {greetingMsg || 'بطاقة تهنئة خاصة بك 🎉'}
                        </h1>
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28, lineHeight: 1.8 }}>
                            اكتب اسمك وشاهد بطاقتك المخصصة
                        </p>
                    </>
                )}

                {/* Template preview before generation */}
                {template && !cardGenerated && (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', maxWidth: 300, width: '100%' }}>
                        <img src={template.image} alt="القالب" style={{ width: '100%', display: 'block' }} crossOrigin="anonymous" />
                        {name.trim() && (
                            <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%,-50%)', color: template.textColor || '#fff', fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 400, fontFamily: FONT, textAlign: 'center', width: '80%', direction: 'rtl' }}>
                                {name.trim()}
                            </div>
                        )}
                    </div>
                )}

                {/* Generated card */}
                {cardGenerated && cardDataUrl && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', maxWidth: 300, margin: '0 auto', display: 'inline-block' }}>
                            <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>
                )}

                {/* Input & Buttons */}
                {!cardGenerated ? (
                    <div style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: 'clamp(24px,5vw,36px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#cbd5e1', marginBottom: 10, textAlign: 'right' }}>
                            اكتب اسمك
                        </label>
                        <input
                            type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: محمد أحمد"
                            dir="rtl"
                            style={{
                                width: '100%', padding: '16px 20px', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)',
                                borderRadius: 14, color: '#fff', fontSize: 18, fontWeight: 700,
                                fontFamily: `${FONT}, ${UI_FONT}`, outline: 'none', textAlign: 'center',
                                marginBottom: 20, transition: 'border 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !name.trim()}
                            style={{
                                width: '100%', padding: '16px',
                                background: generating ? '#334155' : !name.trim() ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#fff', border: 'none', borderRadius: 16,
                                fontSize: 17, fontWeight: 900,
                                cursor: generating || !name.trim() ? 'not-allowed' : 'pointer',
                                fontFamily: UI_FONT,
                                boxShadow: generating || !name.trim() ? 'none' : '0 8px 24px rgba(16,185,129,0.3)',
                            }}
                        >
                            {generating ? 'جارٍ التحضير...' : 'ولّد بطاقتي 🎉'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={handleDownload} style={{
                            padding: '14px 32px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                            color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                            cursor: 'pointer', fontFamily: UI_FONT, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
                        }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            تحميل البطاقة
                        </button>
                        <button onClick={handleShare} style={{
                            padding: '14px 32px', background: 'rgba(255,255,255,0.08)',
                            color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                            fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            مشاركة
                        </button>
                        <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                            padding: '14px 32px', background: 'rgba(255,255,255,0.05)',
                            color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: UI_FONT,
                        }}>
                            بطاقة جديدة
                        </button>
                    </div>
                )}

                <p style={{ fontSize: 12, color: '#475569', marginTop: 28 }}>
                    مقدمة من منصة <a href="https://sallim.co" style={{ color: '#6366f1', textDecoration: 'none' }}>سلّم</a>
                </p>
            </div>
        </div>
    )
}
