import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { templates as staticTemplates, designerOnlyTemplates, fonts as fontList } from '../data/templates'
import toast, { Toaster } from 'react-hot-toast'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const UI_FONT = "'Tajawal', sans-serif"

// Load image via fetch→blob to avoid CORS/tainted canvas issues
async function loadImageSafe(src) {
    try {
        const res = await fetch(encodeURI(src))
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error('فشل تحميل الصورة'))
            img.src = url
        })
    } catch {
        // Fallback: direct load with crossOrigin
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error('فشل تحميل الصورة'))
            img.src = src
        })
    }
}

export default function GreetPage() {
    const { slug, occasionId, shortId } = useParams()
    const [searchParams] = useSearchParams()
    const prefilledName = searchParams.get('for') || ''

    // These will be overridden by API data when using shortId mode
    const [tmplId, setTmplId] = useState(searchParams.get('tmpl') || '')
    const [greetingMsg, setGreetingMsg] = useState(searchParams.get('msg') || '')
    const [paramFont, setParamFont] = useState(searchParams.get('font') || 'amiri')
    const [paramFontSize, setParamFontSize] = useState(parseInt(searchParams.get('fs')) || 60)
    const [paramNameY, setParamNameY] = useState((parseInt(searchParams.get('y')) || 65) / 100)
    const [paramColor, setParamColor] = useState(searchParams.get('clr') ? `#${searchParams.get('clr')}` : '')
    const [templateImage, setTemplateImage] = useState('') // direct image URL (works for any source)

    const [name, setName] = useState(prefilledName)
    const [company, setCompany] = useState(null)
    const [template, setTemplate] = useState(null)
    const [loadingCompany, setLoadingCompany] = useState(true)
    const [cardGenerated, setCardGenerated] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [cardDataUrl, setCardDataUrl] = useState(null)
    const [templateBlobUrl, setTemplateBlobUrl] = useState(null)

    // ── Mode 1: shortId — fetch all settings from API ──
    useEffect(() => {
        if (!shortId) return
        setLoadingCompany(true)
        fetch(`${API_BASE}/api/v1/company/greet-links/${shortId}`)
            .then(r => r.json())
            .then(res => {
                if (!res.success) { toast.error(res.error || 'الرابط غير صالح'); return }
                const d = res.data
                if (d.company) setCompany(d.company)
                setGreetingMsg(d.greetingText || d.occasionName || '')
                setParamFont(d.font || 'amiri')
                setParamFontSize(d.fontSize || 60)
                setParamNameY(d.nameY || 0.65)
                setParamColor(d.nameColor || '')
                setTemplateImage(d.templateImage || '')
                // Create a synthetic template object so preview works
                setTemplate({ id: d.templateId || 'custom', image: d.templateImage, textColor: d.templateTextColor || '#ffffff', name: d.occasionName || 'قالب' })
            })
            .catch(() => toast.error('حدث خطأ في تحميل الرابط'))
            .finally(() => setLoadingCompany(false))
    }, [shortId])

    // ── Mode 2: legacy /greet/:slug — fetch company then find template ──
    useEffect(() => {
        if (shortId) return // handled above
        if (!slug) { setLoadingCompany(false); return }
        fetch(`${API_BASE}/api/v1/company/public/${slug}`)
            .then(r => r.json())
            .then(res => { if (res.success) setCompany(res.data) })
            .catch(() => {})
            .finally(() => setLoadingCompany(false))
    }, [slug, shortId])

    // Find/load template for legacy mode
    useEffect(() => {
        if (shortId) return // handled via templateImage state
        if (!tmplId) return
        const all = [...staticTemplates, ...designerOnlyTemplates]
        const found = all.find(t => String(t.id) === String(tmplId))
        if (found) {
            setTemplate(found)
            setTemplateImage(found.image)
        }
    }, [tmplId, shortId])

    // Preload template image as blob URL whenever templateImage changes
    useEffect(() => {
        if (!templateImage) return
        let blobUrl = null
        fetch(encodeURI(templateImage))
            .then(r => r.blob())
            .then(blob => {
                blobUrl = URL.createObjectURL(blob)
                setTemplateBlobUrl(blobUrl)
            })
            .catch(() => setTemplateBlobUrl(templateImage))
        return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
    }, [templateImage])

    const generateCard = useCallback(async (recipientName) => {
        if (!templateImage) return null
        setGenerating(true)

        try {
            const templateImg = await loadImageSafe(templateImage)

            const W = templateImg.naturalWidth || 1080
            const H = templateImg.naturalHeight || 1920
            const offscreen = document.createElement('canvas')
            offscreen.width = W
            offscreen.height = H
            const ctx = offscreen.getContext('2d')

            ctx.clearRect(0, 0, W, H)
            ctx.drawImage(templateImg, 0, 0, W, H)

            const currentFont = fontList.find(fo => fo.id === paramFont) || fontList[1]
            const textColor = paramColor || (template && (template.textColor || template.nameColor)) || '#ffffff'
            const scaledSize = Math.round(paramFontSize * (W / 1080))
            ctx.font = `normal ${scaledSize}px ${currentFont.family}`
            ctx.fillStyle = textColor
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.direction = 'rtl'
            ctx.fillText(recipientName, W / 2, H * paramNameY)

            const dataUrl = offscreen.toDataURL('image/png')
            setCardDataUrl(dataUrl)

            // Record card on backend (deducts from balance) — only for legacy slug mode
            if (slug) {
                try {
                    await fetch(`${API_BASE}/api/v1/company/public/${slug}/cards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: recipientName,
                            templateId: String(tmplId || (template && template.id) || ''),
                            font: paramFont,
                            fontSize: paramFontSize,
                            textColor,
                            mainText: greetingMsg || `كل عام وأنت بخير ${recipientName}`,
                        })
                    })
                } catch { /* silent */ }
            } else if (shortId) {
                // Record card via greet-link
                try {
                    await fetch(`${API_BASE}/api/v1/company/greet-links/${shortId}/record`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: recipientName })
                    })
                } catch { /* silent */ }
            }

            return dataUrl
        } catch (err) {
            toast.error(err.message || 'حدث خطأ في التوليد')
            return null
        } finally {
            setGenerating(false)
        }
    }, [templateImage, slug, shortId, greetingMsg, paramFont, paramFontSize, paramNameY, paramColor, template, tmplId])

    const handleGenerate = async () => {
        if (!name.trim()) { toast.error('اكتب اسمك أولاً'); return }
        if (!templateImage) { toast.error('لم يتم تحميل القالب بعد'); return }
        const result = await generateCard(name.trim())
        if (result) {
            setCardGenerated(true)
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

    const previewFont = (fontList.find(fo => fo.id === paramFont) || fontList[1]).family

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: UI_FONT, direction: 'rtl',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <Toaster position="top-center" />

            <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>

                {loadingCompany ? (
                    <div style={{ color: '#94a3b8', padding: 40 }}>جارٍ التحميل...</div>
                ) : (
                    <>
                        {/* Company branding */}
                        {companyLogo ? (
                            <img src={companyLogo} alt={companyName} style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '1px solid #e2e8f0' }} />
                        ) : companyName ? (
                            <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 900, color: '#fff' }}>
                                {companyName[0]}
                            </div>
                        ) : null}

                        {companyName && (
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#334155', marginBottom: 4 }}>{companyName}</h2>
                        )}

                        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, color: '#0f172a', marginBottom: 4, marginTop: companyName ? 10 : 0 }}>
                            {greetingMsg || 'بطاقة تهنئة خاصة بك'}
                        </h1>
                        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.8 }}>
                            اكتب اسمك لتحصل على بطاقتك المخصصة
                        </p>
                    </>
                )}

                {/* Template preview before generation */}
                {templateImage && !cardGenerated && (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 280, width: '100%' }}>
                        <img src={templateBlobUrl || templateImage} alt="القالب" style={{ width: '100%', display: 'block' }} />
                        {name.trim() && (
                            <div style={{ position: 'absolute', top: `${paramNameY * 100}%`, left: '50%', transform: 'translate(-50%,-50%)', color: paramColor || (template && template.textColor) || '#fff', fontSize: 'clamp(14px, 3.5vw, 20px)', fontWeight: 400, fontFamily: previewFont, textAlign: 'center', width: '80%', direction: 'rtl' }}>
                                {name.trim()}
                            </div>
                        )}
                    </div>
                )}

                {/* Generated card */}
                {cardGenerated && cardDataUrl && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 280, margin: '0 auto', display: 'inline-block' }}>
                            <img src={cardDataUrl} alt="بطاقتك" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>
                )}

                {/* Input & Buttons */}
                {!cardGenerated ? (
                    <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,5vw,32px)', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 8, textAlign: 'right' }}>
                            اكتب اسمك
                        </label>
                        <input
                            type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: محمد أحمد"
                            dir="rtl"
                            style={{
                                width: '100%', padding: '14px 18px', boxSizing: 'border-box',
                                background: '#f8fafc', border: '2px solid #e2e8f0',
                                borderRadius: 12, color: '#0f172a', fontSize: 17, fontWeight: 700,
                                fontFamily: UI_FONT, outline: 'none', textAlign: 'center',
                                marginBottom: 16, transition: 'border 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#7c3aed'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !name.trim()}
                            style={{
                                width: '100%', padding: '14px',
                                background: generating ? '#cbd5e1' : !name.trim() ? '#e2e8f0' : '#7c3aed',
                                color: generating || !name.trim() ? '#94a3b8' : '#fff',
                                border: 'none', borderRadius: 14,
                                fontSize: 16, fontWeight: 800,
                                cursor: generating || !name.trim() ? 'not-allowed' : 'pointer',
                                fontFamily: UI_FONT,
                                boxShadow: generating || !name.trim() ? 'none' : '0 4px 16px rgba(124,58,237,0.25)',
                            }}
                        >
                            {generating ? 'جارٍ التحضير...' : 'عرض بطاقتي'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={handleDownload} style={{
                            padding: '12px 28px', background: '#7c3aed',
                            color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800,
                            cursor: 'pointer', fontFamily: UI_FONT, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
                        }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            تحميل البطاقة
                        </button>
                        <button onClick={handleShare} style={{
                            padding: '12px 28px', background: '#fff',
                            color: '#475569', border: '1px solid #e2e8f0', borderRadius: 12,
                            fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: UI_FONT,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            مشاركة
                        </button>
                        <button onClick={() => { setCardGenerated(false); setCardDataUrl(null); setName('') }} style={{
                            padding: '12px 28px', background: '#f1f5f9',
                            color: '#64748b', border: 'none', borderRadius: 12,
                            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: UI_FONT,
                        }}>
                            بطاقة جديدة
                        </button>
                    </div>
                )}

                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 24 }}>
                    مقدمة من منصة <a href="https://sallim.co" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 700 }}>سلّم</a>
                </p>
            </div>
        </div>
    )
}
