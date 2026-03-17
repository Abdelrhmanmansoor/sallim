import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { templates as staticTemplates, designerOnlyTemplates, fonts as fontList } from '../data/templates'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const UI_FONT = "'Tajawal', sans-serif"

// Safely encode a URL — handles Arabic paths like /templates/جاهزة/11.png
function safeEncodeUrl(url) {
    if (!url) return ''
    try {
        // If already a valid encoded URL, return as is
        new URL(url)
        // Re-encode just the pathname portion to handle Arabic chars
        const u = new URL(url)
        u.pathname = u.pathname.split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/')
        return u.toString()
    } catch {
        // Relative URL — encode path segments only
        return url.split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/')
    }
}

async function loadImageForCanvas(src) {
    const encoded = safeEncodeUrl(src)
    // Try fetch→blob (safest for canvas, avoids tainted canvas)
    try {
        const res = await fetch(encoded, { mode: 'cors', cache: 'force-cache' })
        if (res.ok) {
            const blob = await res.blob()
            const objUrl = URL.createObjectURL(blob)
            return await new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve({ img, objUrl })
                img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('img load failed')) }
                img.src = objUrl
            })
        }
    } catch { /* fall through */ }
    // Fallback: crossOrigin direct
    return await new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve({ img, objUrl: null })
        img.onerror = () => reject(new Error('فشل تحميل الصورة'))
        img.src = encoded
    })
}

// ── Eid animation particles ──
const EID_PARTICLES = ['✨','🌙','⭐','✦','❋','◈']
function EidBackground() {
    return (
        <>
            <style>{`
                @keyframes floatUp {
                    0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.7 }
                    50%  { opacity: 1 }
                    100% { transform: translateY(-100vh) rotate(720deg) scale(0.4); opacity: 0 }
                }
                @keyframes shimmer {
                    0%,100% { opacity: 0.15 }
                    50%     { opacity: 0.45 }
                }
                .eid-particle { position: fixed; pointer-events: none; animation: floatUp linear infinite; z-index: 0; user-select: none; }
                .eid-orb { position: fixed; border-radius: 50%; filter: blur(80px); animation: shimmer ease-in-out infinite; z-index: 0; pointer-events: none; }
            `}</style>
            {/* Blurred orbs */}
            <div className="eid-orb" style={{ width: 400, height: 400, top: '-100px', right: '-100px', background: 'radial-gradient(circle, #7c3aed44, transparent)', animationDuration: '6s' }} />
            <div className="eid-orb" style={{ width: 300, height: 300, bottom: '-50px', left: '-80px', background: 'radial-gradient(circle, #a78bfa33, transparent)', animationDuration: '8s', animationDelay: '2s' }} />
            <div className="eid-orb" style={{ width: 200, height: 200, top: '40%', left: '10%', background: 'radial-gradient(circle, #fbbf2422, transparent)', animationDuration: '7s', animationDelay: '1s' }} />
            {/* Floating particles */}
            {[...Array(14)].map((_, i) => (
                <div key={i} className="eid-particle" style={{
                    left: `${(i * 7.3 + 3) % 100}%`,
                    bottom: `-${20 + (i * 13) % 40}px`,
                    fontSize: `${10 + (i * 3) % 14}px`,
                    animationDuration: `${6 + (i * 1.4) % 8}s`,
                    animationDelay: `${(i * 0.7) % 5}s`,
                    opacity: 0,
                }}>
                    {EID_PARTICLES[i % EID_PARTICLES.length]}
                </div>
            ))}
        </>
    )
}

export default function GreetPage() {
    const { slug, shortId } = useParams()
    const [searchParams] = useSearchParams()
    const prefilledName = searchParams.get('for') || ''

    const [tmplId] = useState(searchParams.get('tmpl') || '')
    const [greetingMsg, setGreetingMsg] = useState(searchParams.get('msg') || '')
    const [paramFont, setParamFont] = useState(searchParams.get('font') || 'amiri')
    const [paramFontSize, setParamFontSize] = useState(parseInt(searchParams.get('fs')) || 60)
    const [paramNameY, setParamNameY] = useState((parseInt(searchParams.get('y')) || 65) / 100)
    const [paramColor, setParamColor] = useState(searchParams.get('clr') ? `#${searchParams.get('clr')}` : '')
    const [templateImage, setTemplateImage] = useState('')
    const [templateTextColor, setTemplateTextColor] = useState('#ffffff')

    const [name, setName] = useState(prefilledName)
    const [company, setCompany] = useState(null)
    const [customCompanyName, setCustomCompanyName] = useState('')
    const [loading, setLoading] = useState(true)
    const [cardGenerated, setCardGenerated] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [cardDataUrl, setCardDataUrl] = useState(null)
    const [imgError, setImgError] = useState(false)

    const resolveImg = (url) => {
        if (!url) return ''
        if (url.startsWith('http')) return safeEncodeUrl(url)
        // Relative — use sallim.co as base (where Vercel serves /templates/)
        const base = 'https://www.sallim.co'
        return safeEncodeUrl(`${base}${url.startsWith('/') ? '' : '/'}${url}`)
    }

    // ── Mode 1: /g/:shortId ──
    useEffect(() => {
        if (!shortId) return
        setLoading(true)
        fetch(`${API_BASE}/api/v1/company/greet-links/${shortId}`)
            .then(r => r.json())
            .then(res => {
                console.log('[GreetPage] API response:', res)
                if (!res.success) return
                const d = res.data
                if (d.company) setCompany(d.company)
                setCustomCompanyName(d.customCompanyName || '')
                setGreetingMsg(d.greetingText || d.occasionName || '')
                setParamFont(d.font || 'amiri')
                setParamFontSize(d.fontSize || 60)
                setParamNameY(d.nameY || 0.65)
                setParamColor(d.nameColor || '')
                setTemplateTextColor(d.templateTextColor || '#ffffff')
                const resolvedImg = resolveImg(d.templateImage || '')
                console.log('[GreetPage] templateImage from API:', d.templateImage)
                console.log('[GreetPage] resolved image URL:', resolvedImg)
                setTemplateImage(resolvedImg)
            })
            .catch(err => console.error('[GreetPage] fetch error:', err))
            .finally(() => setLoading(false))
    }, [shortId])

    // ── Mode 2: legacy /greet/:slug ──
    useEffect(() => {
        if (shortId) return
        if (!slug) { setLoading(false); return }
        fetch(`${API_BASE}/api/v1/company/public/${slug}`)
            .then(r => r.json())
            .then(res => { if (res.success) setCompany(res.data) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [slug, shortId])

    useEffect(() => {
        if (shortId) return
        if (!tmplId) return
        const all = [...staticTemplates, ...designerOnlyTemplates]
        const found = all.find(t => String(t.id) === String(tmplId))
        if (found) {
            setTemplateImage(resolveImg(found.image))
            setTemplateTextColor(found.textColor || '#ffffff')
        }
    }, [tmplId, shortId])

    const generateCard = useCallback(async (recipientName) => {
        if (!templateImage) return null
        setGenerating(true)
        let objUrl = null
        try {
            const { img: templateImg, objUrl: ou } = await loadImageForCanvas(templateImage)
            objUrl = ou
            const W = templateImg.naturalWidth || 1080
            const H = templateImg.naturalHeight || 1920
            const offscreen = document.createElement('canvas')
            offscreen.width = W
            offscreen.height = H
            const ctx = offscreen.getContext('2d')
            ctx.clearRect(0, 0, W, H)
            ctx.drawImage(templateImg, 0, 0, W, H)
            const currentFont = fontList.find(fo => fo.id === paramFont) || fontList[1]
            const textColor = paramColor || templateTextColor || '#ffffff'
            const scaledSize = Math.round(paramFontSize * (W / 1080))
            ctx.font = `normal ${scaledSize}px ${currentFont.family}`
            ctx.fillStyle = textColor
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.direction = 'rtl'
            ctx.fillText(recipientName, W / 2, H * paramNameY)
            const dataUrl = offscreen.toDataURL('image/png')
            setCardDataUrl(dataUrl)

            // Deduct credit
            const ep = shortId
                ? `${API_BASE}/api/v1/company/greet-links/${shortId}/record`
                : slug ? `${API_BASE}/api/v1/company/public/${slug}/cards` : null
            if (ep) fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: recipientName }) }).catch(() => {})

            return dataUrl
        } catch {
            return null
        } finally {
            if (objUrl) URL.revokeObjectURL(objUrl)
            setGenerating(false)
        }
    }, [templateImage, slug, shortId, paramFont, paramFontSize, paramNameY, paramColor, templateTextColor])

    const handleGenerate = async () => {
        if (!name.trim() || !templateImage) return
        const r = await generateCard(name.trim())
        if (r) setCardGenerated(true)
    }

    const handleDownload = () => {
        if (!cardDataUrl) return
        const a = document.createElement('a')
        a.href = cardDataUrl
        a.download = `تهنئة-${name.trim()}.png`
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
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
            }
        } catch { /* silent */ }
    }

    const displayName = customCompanyName || company?.name || ''
    const companyLogo = company?.logoUrl || ''
    const previewFont = (fontList.find(fo => fo.id === paramFont) || fontList[1]).family

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#fafafa,#f0f4ff)', fontFamily: UI_FONT }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            fontFamily: UI_FONT,
            direction: 'rtl',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px 48px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <EidBackground />

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

                {/* ── Company Brand ── */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    {companyLogo ? (
                        <img src={companyLogo} alt={displayName}
                            style={{ width: 60, height: 60, borderRadius: 16, objectFit: 'cover', margin: '0 auto 10px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)' }} />
                    ) : displayName ? (
                        <div style={{
                            width: 60, height: 60, borderRadius: 16,
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 10px', fontSize: 22, fontWeight: 900, color: '#fff',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
                        }}>
                            {displayName[0]}
                        </div>
                    ) : null}
                    {displayName && (
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>
                            {displayName}
                        </div>
                    )}
                    {greetingMsg && (
                        <h1 style={{ fontSize: 'clamp(17px,5vw,22px)', fontWeight: 900, color: '#fff', margin: '8px 0 0', lineHeight: 1.5, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                            {greetingMsg}
                        </h1>
                    )}
                </div>

                {/* ── Template Preview ── */}
                {templateImage && !cardGenerated && (
                    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', marginBottom: 20, position: 'relative', background: '#1e1b4b', minHeight: imgError ? 180 : 'auto' }}>
                        {!imgError ? (
                            <>
                                <img
                                    src={templateImage}
                                    alt="القالب"
                                    crossOrigin="anonymous"
                                    style={{ width: '100%', display: 'block' }}
                                    onError={() => setImgError(true)}
                                />
                                {name.trim() && (
                                    <div style={{
                                        position: 'absolute',
                                        top: `${paramNameY * 100}%`,
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: paramColor || templateTextColor || '#fff',
                                        fontSize: 'clamp(13px,3.5vw,19px)',
                                        fontWeight: 400,
                                        fontFamily: previewFont,
                                        textAlign: 'center',
                                        width: '80%',
                                        direction: 'rtl',
                                        pointerEvents: 'none',
                                    }}>
                                        {name.trim()}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                                جارٍ تحميل القالب...
                            </div>
                        )}
                    </div>
                )}

                {/* ── Generated Card ── */}
                {cardGenerated && cardDataUrl && (
                    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', marginBottom: 20 }}>
                        <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                    </div>
                )}

                {/* ── Input / Action ── */}
                {!cardGenerated ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: 20,
                        padding: 24,
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 14px', textAlign: 'center', lineHeight: 1.7 }}>
                            اكتب اسمك لتحصل على بطاقتك
                        </p>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                            placeholder="اسمك هنا..."
                            dir="rtl"
                            style={{
                                width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)',
                                borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff',
                                fontFamily: UI_FONT, outline: 'none', textAlign: 'center',
                                marginBottom: 14, transition: 'border-color 0.2s',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#a78bfa' }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !name.trim() || !templateImage}
                            style={{
                                width: '100%', padding: '14px 0',
                                background: (generating || !name.trim() || !templateImage)
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                                color: (generating || !name.trim() || !templateImage) ? 'rgba(255,255,255,0.3)' : '#fff',
                                border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                                cursor: (generating || !name.trim() || !templateImage) ? 'not-allowed' : 'pointer',
                                fontFamily: UI_FONT,
                                boxShadow: (generating || !name.trim() || !templateImage) ? 'none' : '0 4px 24px rgba(124,58,237,0.5)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {generating ? '⏳ جارٍ التحضير...' : '✨ احصل على بطاقتك'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={handleDownload} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800,
                            cursor: 'pointer', fontFamily: UI_FONT,
                            boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            تحميل
                        </button>
                        <button onClick={handleShare} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            border: '1.5px solid rgba(255,255,255,0.2)',
                            borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            backdropFilter: 'blur(10px)',
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            مشاركة
                        </button>
                        <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                            width: '100%', padding: '10px 0',
                            background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none',
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: UI_FONT,
                        }}>
                            بطاقة جديدة
                        </button>
                    </div>
                )}

                <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 32 }}>
                    بتقنية <a href="https://sallim.co" style={{ color: 'rgba(167,139,250,0.6)', textDecoration: 'none', fontWeight: 700 }}>سلّم</a>
                </p>
            </div>
        </div>
    )
}

