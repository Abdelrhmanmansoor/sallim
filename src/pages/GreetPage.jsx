import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { templates as staticTemplates, designerOnlyTemplates, fonts as fontList } from '../data/templates'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const UI_FONT = "'Tajawal', sans-serif"

async function loadImageForCanvas(src) {
    // Try fetch→blob first (avoids CORS tainted canvas issue)
    try {
        const res = await fetch(src, { mode: 'cors' })
        if (res.ok) {
            const blob = await res.blob()
            const objUrl = URL.createObjectURL(blob)
            return await new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve({ img, objUrl })
                img.onerror = () => { URL.revokeObjectURL(objUrl); reject() }
                img.src = objUrl
            })
        }
    } catch { /* fall through */ }
    // Fallback: direct with crossOrigin
    return await new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve({ img, objUrl: null })
        img.onerror = reject
        img.src = src
    })
}

export default function GreetPage() {
    const { slug, occasionId, shortId } = useParams()
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
    const [template, setTemplate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cardGenerated, setCardGenerated] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [cardDataUrl, setCardDataUrl] = useState(null)
    const [imgPreviewUrl, setImgPreviewUrl] = useState('')

    // ── Mode 1: /g/:shortId — fetch all settings from API ──
    useEffect(() => {
        if (!shortId) return
        setLoading(true)
        fetch(`${API_BASE}/api/v1/company/greet-links/${shortId}`)
            .then(r => r.json())
            .then(res => {
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
                // Fix relative URLs (e.g. /templates/... stored before absolute-URL fix)
                const imgUrl = d.templateImage || ''
                const absImg = imgUrl && !imgUrl.startsWith('http') ? `https://www.sallim.co${imgUrl}` : imgUrl
                setTemplateImage(absImg)
                setTemplate({ id: d.templateId || 'custom', image: absImg, textColor: d.templateTextColor || '#ffffff' })
            })
            .catch(() => {})
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
            setTemplate(found)
            setTemplateImage(found.image.startsWith('http') ? found.image : `${window.location.origin}${found.image}`)
            setTemplateTextColor(found.textColor || '#ffffff')
        }
    }, [tmplId, shortId])

    // Preload preview image
    useEffect(() => {
        if (!templateImage) return
        setImgPreviewUrl(templateImage) // set immediately so img tag shows
    }, [templateImage])

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
            const creditEndpoint = shortId
                ? `${API_BASE}/api/v1/company/greet-links/${shortId}/record`
                : slug ? `${API_BASE}/api/v1/company/public/${slug}/cards` : null
            if (creditEndpoint) {
                fetch(creditEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: recipientName }),
                }).catch(() => {})
            }

            return dataUrl
        } catch {
            return null
        } finally {
            if (objUrl) URL.revokeObjectURL(objUrl)
            setGenerating(false)
        }
    }, [templateImage, slug, shortId, paramFont, paramFontSize, paramNameY, paramColor, templateTextColor])

    const handleGenerate = async () => {
        if (!name.trim()) return
        if (!templateImage) return
        const result = await generateCard(name.trim())
        if (result) setCardGenerated(true)
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
            }
        } catch { /* silent */ }
    }

    const displayCompanyName = customCompanyName || company?.name || ''
    const companyLogo = company?.logoUrl || ''
    const previewFont = (fontList.find(fo => fo.id === paramFont) || fontList[1]).family

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: UI_FONT }}>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #fafafa 0%, #f0f4ff 100%)',
            fontFamily: UI_FONT,
            direction: 'rtl',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px 48px',
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

                {/* ── Company Brand ── */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    {companyLogo ? (
                        <img src={companyLogo} alt={displayCompanyName}
                            style={{ width: 64, height: 64, borderRadius: 18, objectFit: 'cover', margin: '0 auto 12px', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    ) : displayCompanyName ? (
                        <div style={{
                            width: 64, height: 64, borderRadius: 18,
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px', fontSize: 26, fontWeight: 900, color: '#fff',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                        }}>
                            {displayCompanyName[0]}
                        </div>
                    ) : null}

                    {displayCompanyName && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', letterSpacing: 0.5 }}>
                            {displayCompanyName}
                        </div>
                    )}
                    {greetingMsg && (
                        <h1 style={{ fontSize: 'clamp(18px,5vw,24px)', fontWeight: 900, color: '#0f172a', margin: '10px 0 0', lineHeight: 1.4 }}>
                            {greetingMsg}
                        </h1>
                    )}
                </div>

                {/* ── Template Preview ── */}
                {imgPreviewUrl && !cardGenerated && (
                    <div style={{
                        position: 'relative', borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.14)', marginBottom: 24,
                        background: '#e2e8f0',
                    }}>
                        <img
                            src={imgPreviewUrl}
                            alt="القالب"
                            style={{ width: '100%', display: 'block' }}
                            onError={e => { e.target.style.display = 'none' }}
                        />
                        {name.trim() && (
                            <div style={{
                                position: 'absolute',
                                top: `${paramNameY * 100}%`,
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: paramColor || templateTextColor || '#fff',
                                fontSize: 'clamp(13px, 3.5vw, 19px)',
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
                    </div>
                )}

                {/* ── Generated Card ── */}
                {cardGenerated && cardDataUrl && (
                    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)', marginBottom: 24 }}>
                        <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                    </div>
                )}

                {/* ── Input / Action ── */}
                {!cardGenerated ? (
                    <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        padding: 24,
                        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.06)',
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
                                borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#0f172a',
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
                                background: (generating || !name.trim() || !templateImage) ? '#e2e8f0' : 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                                color: (generating || !name.trim() || !templateImage) ? '#94a3b8' : '#fff',
                                border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800,
                                cursor: (generating || !name.trim() || !templateImage) ? 'not-allowed' : 'pointer',
                                fontFamily: UI_FONT,
                                boxShadow: (generating || !name.trim() || !templateImage) ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {generating ? '⏳ جارٍ التحضير...' : 'احصل على بطاقتك'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={handleDownload} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                            color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800,
                            cursor: 'pointer', fontFamily: UI_FONT,
                            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            تحميل
                        </button>
                        <button onClick={handleShare} style={{
                            flex: 1, minWidth: 140, padding: '13px 20px',
                            background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0',
                            borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            مشاركة
                        </button>
                        <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                            width: '100%', padding: '11px 0',
                            background: 'transparent', color: '#94a3b8', border: 'none',
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: UI_FONT,
                        }}>
                            بطاقة جديدة
                        </button>
                    </div>
                )}

                {/* Minimal watermark */}
                <p style={{ textAlign: 'center', fontSize: 11, color: '#cbd5e1', marginTop: 32 }}>
                    بتقنية <a href="https://sallim.co" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 700 }}>سلّم</a>
                </p>
            </div>
        </div>
    )
}
