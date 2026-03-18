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

// ── Elegant light background with subtle animation ──
function ElegantBackground() {
    return (
        <>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) }
                    50% { transform: translateY(-15px) }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3 }
                    50% { opacity: 0.6 }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(28px) }
                    to   { opacity: 1; transform: translateY(0) }
                }
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0) }
                    50%      { transform: translateY(-6px) }
                }
                @keyframes shimmerSweep {
                    0%   { transform: translateX(-100%) }
                    100% { transform: translateX(200%) }
                }
                @keyframes glowRing {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0) }
                    50%      { box-shadow: 0 0 30px 6px rgba(124,58,237,0.13) }
                }
                .greet-card-wrap {
                    animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
                }
                .greet-img-wrap {
                    animation: cardFloat 6s ease-in-out infinite, glowRing 4s ease-in-out infinite;
                }
                .greet-shimmer::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
                    animation: shimmerSweep 2.5s ease-in-out infinite;
                    pointer-events: none;
                    border-radius: inherit;
                }
                .elegant-shape { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
            `}</style>
            {/* Soft gradient shapes */}
            <div className="elegant-shape" style={{ 
                width: 500, height: 500, top: '-200px', right: '-150px', 
                background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)',
                animation: 'pulse 8s ease-in-out infinite'
            }} />
            <div className="elegant-shape" style={{ 
                width: 400, height: 400, bottom: '-150px', left: '-100px', 
                background: 'radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)',
                animation: 'pulse 10s ease-in-out infinite 2s'
            }} />
            <div className="elegant-shape" style={{ 
                width: 250, height: 250, top: '30%', left: '5%', 
                background: 'radial-gradient(circle, rgba(251,191,36,0.05), transparent 70%)',
                animation: 'float 12s ease-in-out infinite'
            }} />
        </>
    )
}

// ── Ramadan/Eid theme for Oud Scent (exclusive) ──
function RamadanBackground() {
    return (
        <>
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1) }
                    50% { opacity: 1; transform: scale(1.2) }
                }
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0) rotate(0deg) }
                    50% { transform: translateY(-20px) rotate(5deg) }
                }
                @keyframes glow {
                    0%, 100% { filter: drop-shadow(0 0 8px rgba(212,168,67,0.3)) }
                    50% { filter: drop-shadow(0 0 20px rgba(212,168,67,0.6)) }
                }
                .ramadan-star { position: fixed; color: #d4a843; pointer-events: none; z-index: 0; opacity: 0; animation: twinkle ease-in-out infinite; }
                .ramadan-lantern { position: fixed; pointer-events: none; z-index: 0; animation: floatSlow ease-in-out infinite; }
                .ramadan-mosque { position: fixed; bottom: 0; left: 0; right: 0; height: 120px; pointer-events: none; z-index: 0; opacity: 0.15; }
            `}</style>
            {/* Mosque silhouette at bottom */}
            <div className="ramadan-mosque" style={{
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 100\'%3E%3Cpath fill=\'%23d4a843\' d=\'M0 100h400V60c-20 0-30-20-30-20s-10 20-30 20-30-20-30-20-10 20-30 20-30-20-30-20-10 20-30 20-30-20-30-20-10 20-30 20-30-20-30-20-10 20-30 20V100z\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'15\' fill=\'%23d4a843\'/%3E%3Crect x=\'47\' y=\'60\' width=\'6\' height=\'40\' fill=\'%23d4a843\'/%3E%3Ccircle cx=\'200\' cy=\'35\' r=\'25\' fill=\'%23d4a843\'/%3E%3Crect x=\'195\' y=\'55\' width=\'10\' height=\'45\' fill=\'%23d4a843\'/%3E%3Ccircle cx=\'350\' cy=\'45\' r=\'18\' fill=\'%23d4a843\'/%3E%3Crect x=\'346\' y=\'60\' width=\'8\' height=\'40\' fill=\'%23d4a843\'/%3E%3C/svg%3E") repeat-x bottom',
                backgroundSize: 'auto 100%',
            }} />
            {/* Golden stars */}
            {[...Array(12)].map((_, i) => (
                <div key={i} className="ramadan-star" style={{
                    left: `${(i * 8.5 + 2) % 100}%`,
                    top: `${(i * 7.3 + 5) % 70}%`,
                    fontSize: `${8 + (i % 4) * 4}px`,
                    animationDuration: `${2 + (i % 3)}s`,
                    animationDelay: `${i * 0.3}s`,
                }}>
                    ✦
                </div>
            ))}
            {/* Crescent moon */}
            <div style={{
                position: 'fixed', top: '8%', right: '8%', fontSize: 48, color: '#d4a843',
                animation: 'glow 3s ease-in-out infinite', zIndex: 0, pointerEvents: 'none',
                textShadow: '0 0 30px rgba(212,168,67,0.5)',
            }}>
                ☪
            </div>
            {/* Soft radial glow */}
            <div style={{
                position: 'fixed', top: '-20%', right: '-10%', width: '60%', height: '60%',
                background: 'radial-gradient(circle, rgba(212,168,67,0.08), transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{
                position: 'fixed', bottom: '-10%', left: '-10%', width: '50%', height: '50%',
                background: 'radial-gradient(circle, rgba(13,122,62,0.06), transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />
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
    const [overlay, setOverlay] = useState({ type: 'none', x: 0.5, y: 0.1, text: '', fontSize: 32, opacity: 0.85, size: 80 })

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
                setOverlay({
                    type: d.overlayType || 'none',
                    x: d.overlayX ?? 0.5,
                    y: d.overlayY ?? 0.1,
                    text: d.overlayText || '',
                    fontSize: d.overlayFontSize || 32,
                    opacity: d.overlayOpacity ?? 0.85,
                    size: d.overlaySize || 80,
                })
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

            // Draw overlay (logo or text watermark)
            if (overlay?.type === 'logo' && companyLogo) {
                try {
                    const { img: logoImg, objUrl: logoObjUrl } = await loadImageForCanvas(companyLogo)
                    const sz = Math.round((overlay.size || 80) * (W / 1080))
                    ctx.globalAlpha = overlay.opacity ?? 0.85
                    ctx.drawImage(logoImg, overlay.x * W - sz / 2, overlay.y * H - sz / 2, sz, sz)
                    ctx.globalAlpha = 1
                    if (logoObjUrl) URL.revokeObjectURL(logoObjUrl)
                } catch { /* ignore overlay errors */ }
            } else if (overlay?.type === 'text' && overlay.text) {
                const sz = Math.round((overlay.fontSize || 32) * (W / 1080))
                ctx.font = `bold ${sz}px 'Cairo', 'Tajawal', sans-serif`
                ctx.fillStyle = '#ffffff'
                ctx.globalAlpha = overlay.opacity ?? 0.85
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(overlay.text, overlay.x * W, overlay.y * H)
                ctx.globalAlpha = 1
            }

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
    
    // Check if this is Oud Scent company for special Ramadan theme
    const isOudScent = ['ريحة عود', 'Oud Scent', 'Oud scent', 'oud scent', 'OUD SCENT'].some(
        n => displayName.toLowerCase().includes(n.toLowerCase())
    )

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#fafafa,#f0f4ff)', fontFamily: UI_FONT }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    // Oud Scent special dark green Ramadan theme
    if (isOudScent) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(160deg, #021a0a 0%, #0d3320 50%, #021a0a 100%)',
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
                <RamadanBackground />

                <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

                    {/* ── Company Brand ── */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        {companyLogo ? (
                            <img src={companyLogo} alt={displayName}
                                style={{ width: 70, height: 70, borderRadius: 18, objectFit: 'cover', margin: '0 auto 12px', display: 'block', boxShadow: '0 4px 24px rgba(212,168,67,0.3)', border: '2px solid rgba(212,168,67,0.3)' }} />
                        ) : displayName ? (
                            <div style={{
                                width: 70, height: 70, borderRadius: 18,
                                background: 'linear-gradient(135deg, #d4a843, #8a6d1f)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px', fontSize: 26, fontWeight: 900, color: '#fff',
                                boxShadow: '0 4px 24px rgba(212,168,67,0.4)',
                            }}>
                                {displayName[0]}
                            </div>
                        ) : null}
                        {displayName && (
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#d4a843', letterSpacing: 1 }}>
                                {displayName}
                            </div>
                        )}
                        {greetingMsg && (
                            <h1 style={{ fontSize: 'clamp(18px,5vw,24px)', fontWeight: 900, color: '#fff', margin: '12px 0 0', lineHeight: 1.5, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                                {greetingMsg}
                            </h1>
                        )}
                    </div>

                    {/* ── Template Preview ── */}
                    {templateImage && !cardGenerated && (
                        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,67,0.15)', marginBottom: 20, position: 'relative', background: '#0d3320', minHeight: imgError ? 180 : 'auto' }}>
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
                                            color: paramColor || templateTextColor || '#d4a843',
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
                                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(212,168,67,0.5)', fontSize: 13 }}>
                                    جارٍ تحميل القالب...
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Generated Card ── */}
                    {cardGenerated && cardDataUrl && (
                        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,67,0.15)', marginBottom: 20 }}>
                            <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                        </div>
                    )}

                    {/* ── Input / Action ── */}
                    {!cardGenerated ? (
                        <div style={{
                            background: 'rgba(13,51,32,0.8)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: 20,
                            padding: 24,
                            border: '1px solid rgba(212,168,67,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px', textAlign: 'center', lineHeight: 1.7 }}>
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
                                    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(212,168,67,0.3)',
                                    borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#fff',
                                    fontFamily: UI_FONT, outline: 'none', textAlign: 'center',
                                    marginBottom: 14, transition: 'border-color 0.2s',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#d4a843' }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(212,168,67,0.3)' }}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !name.trim() || !templateImage}
                                style={{
                                    width: '100%', padding: '14px 0',
                                    background: (generating || !name.trim() || !templateImage)
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'linear-gradient(135deg, #d4a843 0%, #8a6d1f 100%)',
                                    color: (generating || !name.trim() || !templateImage) ? 'rgba(255,255,255,0.3)' : '#fff',
                                    border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                                    cursor: (generating || !name.trim() || !templateImage) ? 'not-allowed' : 'pointer',
                                    fontFamily: UI_FONT,
                                    boxShadow: (generating || !name.trim() || !templateImage) ? 'none' : '0 4px 24px rgba(212,168,67,0.4)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {generating ? 'جارٍ التحضير...' : 'احصل على بطاقتك'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={handleDownload} style={{
                                flex: 1, minWidth: 140, padding: '13px 20px',
                                background: 'linear-gradient(135deg, #d4a843, #8a6d1f)',
                                color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800,
                                cursor: 'pointer', fontFamily: UI_FONT,
                                boxShadow: '0 4px 24px rgba(212,168,67,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                تحميل
                            </button>
                            <button onClick={handleShare} style={{
                                flex: 1, minWidth: 140, padding: '13px 20px',
                                background: 'rgba(13,51,32,0.8)', color: '#d4a843',
                                border: '1.5px solid rgba(212,168,67,0.3)',
                                borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                backdropFilter: 'blur(10px)',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                مشاركة
                            </button>
                            <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                                width: '100%', padding: '10px 0',
                                background: 'transparent', color: 'rgba(212,168,67,0.5)', border: 'none',
                                borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: UI_FONT,
                            }}>
                                بطاقة جديدة
                            </button>
                        </div>
                    )}

                    <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 32 }}>
                        بتقنية <a href="https://sallim.co" style={{ color: 'rgba(212,168,67,0.5)', textDecoration: 'none', fontWeight: 700 }}>سلّم</a>
                    </p>
                </div>
            </div>
        )
    }

    // Default light theme for other companies
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #fafbff 0%, #f0f4ff 50%, #faf5ff 100%)',
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
            <ElegantBackground />

            <div className="greet-card-wrap" style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>

                {/* ── Company Brand ── */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    {companyLogo ? (
                        <img src={companyLogo} alt={displayName}
                            style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', margin: '0 auto 12px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #fff' }} />
                    ) : displayName ? (
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px', fontSize: 24, fontWeight: 900, color: '#fff',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                        }}>
                            {displayName[0]}
                        </div>
                    ) : null}
                    {displayName && (
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', letterSpacing: 0.5 }}>
                            {displayName}
                        </div>
                    )}
                    {greetingMsg && (
                        <h1 style={{ fontSize: 'clamp(18px,5vw,24px)', fontWeight: 900, color: '#1e293b', margin: '10px 0 0', lineHeight: 1.5 }}>
                            {greetingMsg}
                        </h1>
                    )}
                </div>

                {/* ── Template Preview ── */}
                {templateImage && !cardGenerated && (
                    <div className="greet-img-wrap greet-shimmer" style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 16px 56px rgba(0,0,0,0.18)', marginBottom: 24, position: 'relative', background: '#f1f5f9', minHeight: imgError ? 180 : 'auto' }}>
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
                                        fontSize: 'clamp(14px,4vw,22px)',
                                        fontWeight: 400,
                                        fontFamily: previewFont,
                                        textAlign: 'center',
                                        width: '80%',
                                        direction: 'rtl',
                                        pointerEvents: 'none',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                    }}>
                                        {name.trim()}
                                    </div>
                                )}
                                {/* Overlay preview */}
                                {overlay?.type === 'logo' && companyLogo && (
                                    <img src={companyLogo} alt="" style={{
                                        position: 'absolute',
                                        left: `${overlay.x * 100}%`, top: `${overlay.y * 100}%`,
                                        transform: 'translate(-50%,-50%)',
                                        width: `${(overlay.size / 1080) * 100}%`,
                                        opacity: overlay.opacity, pointerEvents: 'none',
                                        borderRadius: 8,
                                    }} />
                                )}
                                {overlay?.type === 'text' && overlay.text && (
                                    <div style={{
                                        position: 'absolute',
                                        left: `${overlay.x * 100}%`, top: `${overlay.y * 100}%`,
                                        transform: 'translate(-50%,-50%)',
                                        color: '#ffffff', opacity: overlay.opacity,
                                        fontSize: `clamp(10px, ${(overlay.fontSize / 1080) * 100}vw, ${overlay.fontSize * 0.5}px)`,
                                        fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                                        pointerEvents: 'none', whiteSpace: 'nowrap',
                                        textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                                    }}>{overlay.text}</div>
                                )}
                            </>
                        ) : (
                            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                                جارٍ تحميل القالب...
                            </div>
                        )}
                    </div>
                )}

                {/* ── Generated Card ── */}
                {cardGenerated && cardDataUrl && (
                    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', marginBottom: 20 }}>
                        <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                    </div>
                )}

                {/* ── Input / Action ── */}
                {!cardGenerated ? (
                    <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        padding: 24,
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px', textAlign: 'center', lineHeight: 1.7 }}>
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
                                background: '#f8fafc', border: '1.5px solid #e2e8f0',
                                borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#1e293b',
                                fontFamily: UI_FONT, outline: 'none', textAlign: 'center',
                                marginBottom: 14, transition: 'border-color 0.2s',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#7c3aed' }}
                            onBlur={e => { e.target.style.borderColor = '#e2e8f0' }}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !name.trim() || !templateImage}
                            style={{
                                width: '100%', padding: '14px 0',
                                background: (generating || !name.trim() || !templateImage)
                                    ? '#e2e8f0'
                                    : 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                                color: (generating || !name.trim() || !templateImage) ? '#94a3b8' : '#fff',
                                border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                                cursor: (generating || !name.trim() || !templateImage) ? 'not-allowed' : 'pointer',
                                fontFamily: UI_FONT,
                                boxShadow: (generating || !name.trim() || !templateImage) ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {generating ? 'جارٍ التحضير...' : 'احصل على بطاقتك'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={handleDownload} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800,
                            cursor: 'pointer', fontFamily: UI_FONT,
                            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            تحميل
                        </button>
                        <button onClick={handleShare} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: '#fff', color: '#475569',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            مشاركة
                        </button>
                        <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                            width: '100%', padding: '10px 0',
                            background: 'transparent', color: '#94a3b8', border: 'none',
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: UI_FONT,
                        }}>
                            بطاقة جديدة
                        </button>
                    </div>
                )}

                <p style={{ textAlign: 'center', fontSize: 11, color: '#cbd5e1', marginTop: 32 }}>
                    بتقنية <a href="https://sallim.co" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 700 }}>سلّم</a>
                </p>
            </div>
        </div>
    )
}

