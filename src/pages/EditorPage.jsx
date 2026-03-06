import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Circle } from 'react-konva'
import { useEditorStore } from '../store'
import { templates, fonts } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { calligraphy, calligraphyCategories } from '../data/calligraphy'
import { BsDownload, BsFilePdf, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2, BsPencilFill, BsStars, BsSearch, BsPersonCircle, BsImage, BsChatLeftText, BsSliders, BsPlusLg, BsX, BsArrowLeft, BsInfoCircle, BsBuilding, BsPeople, BsFileEarmarkText, BsCloudDownload } from 'react-icons/bs'
import { HiPhotograph, HiOutlineColorSwatch } from 'react-icons/hi'
import JSZip from 'jszip'
import toast, { Toaster } from 'react-hot-toast'

/* ═══════════════════════════════════════════════════════════════════
   DESIGN SYSTEM - Tajawal Font, Clean UI
═══════════════════════════════════════════════════════════════════ */
const ds = {
  font: "'Tajawal', sans-serif",
  colors: {
    primary: '#000',
    secondary: '#666',
    muted: '#999',
    border: '#e5e5e5',
    bg: '#fafafa',
    card: '#fff',
    accent: '#2563eb',
    success: '#10b981',
    danger: '#ef4444',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 30px rgba(0,0,0,0.12)',
  }
}

/* ═══ Custom Hook: Load Image ═══ */
function useImage(src) {
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!src) { setImage(null); setLoaded(false); return }
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { setImage(img); setLoaded(true) }
    img.onerror = () => { setImage(null); setLoaded(false) }
    img.src = src
  }, [src])
  return [image, loaded]
}

/* ═══ Draggable Text Component ═══ */
function DraggableText({ text, x, y, width, fontSize, fontFamily, fill, align, opacity, shadowEnabled, shadowColor, shadowBlur, strokeEnabled, stroke, strokeWidth, rotation, onDragEnd, onClick, lineHeight, padding }) {
  if (!text) return null
  return (
    <Text
      text={text} x={x} y={y} width={width} align={align || 'center'}
      fontFamily={fontFamily} fontSize={fontSize} fill={fill}
      opacity={opacity || 1} lineHeight={lineHeight || 1.5} padding={padding || 0}
      wrap="word" rotation={rotation || 0} draggable
      shadowColor={shadowEnabled ? (shadowColor || 'rgba(0,0,0,0.6)') : undefined}
      shadowBlur={shadowEnabled ? (shadowBlur || 8) : 0}
      stroke={strokeEnabled ? stroke : undefined}
      strokeWidth={strokeEnabled ? strokeWidth : 0}
      onDragEnd={onDragEnd} onClick={onClick} onTap={onClick}
      shadowEnabled={shadowEnabled}
    />
  )
}

/* ═══ Tooltip Component ═══ */
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff', padding: '6px 12px', borderRadius: 8,
          fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', marginBottom: 8, zIndex: 100,
          fontFamily: ds.font, animation: 'tooltipIn 150ms ease'
        }}>
          {text}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            border: '6px solid transparent', borderTopColor: '#1a1a1a'
          }} />
        </div>
      )}
    </div>
  )
}

/* ═══ Quick Colors ═══ */
const quickColors = ['#ffffff', '#000000', '#d4a843', '#2563eb', '#fbbf24', '#ef4444', '#4ade80', '#f472b6', '#93c5fd', '#c4b5fd', '#f97316', '#14b8a6']

/* ═══ Color Picker Row ═══ */
function ColorPicker({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 13, color: ds.colors.secondary, minWidth: 60, fontFamily: ds.font }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {quickColors.slice(0, 8).map(c => (
          <button key={c} onClick={() => onChange(c)}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: value === c ? '2px solid #000' : '1px solid #ddd',
              backgroundColor: c, cursor: 'pointer', transition: 'transform 150ms',
              transform: value === c ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', border: 'none', padding: 0 }} />
      </div>
    </div>
  )
}

/* ═══ Ready Designs ═══ */
const readyDesigns = [
  { id: 'r1', name: 'عيد فطر سعيد', template: '/templates/1.png', nameColor: '#ffffff' },
  { id: 'r2', name: 'عيد مبارك', template: '/templates/2.png', nameColor: '#333333' },
  { id: 'r3', name: 'كل عام وأنتم بخير', template: '/templates/3.png', nameColor: '#ffffff' },
]

/* ═══════════════════════════════════════════════════════════════════
   MAIN EDITOR COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function EditorPage() {
  const store = useEditorStore()
  const stageRef = useRef(null)
  const containerRef = useRef(null)

  // Mode & State
  const [mode, setMode] = useState('designer')
  const [readyDesign, setReadyDesign] = useState(null)
  const [readyName, setReadyName] = useState('')
  const [activePanel, setActivePanel] = useState('backgrounds')
  const [stageSize, setStageSize] = useState({ width: 540, height: 540 })
  const [searchText, setSearchText] = useState('')
  const [calligraphyCat, setCalligraphyCat] = useState('white')
  const [calligraphyLimit, setCalligraphyLimit] = useState(30)
  const [customTemplates, setCustomTemplates] = useState([])
  const [copied, setCopied] = useState(false)

  // Load custom templates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eidgreet_custom_templates')
      if (saved) setCustomTemplates(JSON.parse(saved))
    } catch { }
  }, [])

  // Computed
  const allTemplates = [...templates, ...customTemplates]
  const currentTemplate = allTemplates.find(t => t.id === store.selectedTemplate) || allTemplates[0]
  const currentFont = fonts.find(f => f.id === store.selectedFont) || fonts[1]
  const scale = stageSize.width / 1080

  // Images
  const [bgImage, bgLoaded] = useImage(mode === 'ready' && readyDesign ? readyDesign.template : currentTemplate?.image)
  const [calligraphyImg, calligraphyLoaded] = useImage(store.selectedCalligraphy)
  const [personalPhotoImg, personalPhotoLoaded] = useImage(store.personalPhoto)
  const [logoImg, logoLoaded] = useImage(store.companyLogo)

  const calligraphyWidth = stageSize.width * store.calligraphyScale
  const calligraphyHeight = calligraphyImg ? (calligraphyImg.height / calligraphyImg.width) * calligraphyWidth : 0
  const photoW = stageSize.width * store.photoScale
  const logoW = stageSize.width * store.logoScale
  const logoH = logoImg ? (logoImg.height / logoImg.width) * logoW : logoW

  // Get logo position coordinates
  const getLogoPosition = () => {
    const padding = stageSize.width * 0.03
    switch (store.logoPosition) {
      case 'top-right': return { x: stageSize.width - logoW - padding, y: padding }
      case 'top-left': return { x: padding, y: padding }
      case 'bottom-right': return { x: stageSize.width - logoW - padding, y: stageSize.height - logoH - padding }
      case 'bottom-left': default: return { x: padding, y: stageSize.height - logoH - padding }
    }
  }
  const logoPos = getLogoPosition()

  // Calligraphy filtering
  const allFilteredCalligraphy = calligraphy.filter(c => c.category === calligraphyCat)
  const filteredCalligraphy = allFilteredCalligraphy.slice(0, calligraphyLimit)
  const filteredTexts = greetingTexts.filter(t => t.text.includes(searchText) || t.category?.includes(searchText))

  // Resize handler
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        const size = Math.min(w, 520)
        setStageSize({ width: size, height: size })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Disable pull-to-refresh on mobile
  useEffect(() => {
    const el = document.documentElement
    const onTS = (e) => { if (e.touches.length > 1) return; window._touchStartY = e.touches[0].clientY }
    const onTM = (e) => { if (mode !== 'designer') return; if (window._touchStartY !== undefined && e.touches[0].clientY > window._touchStartY && window.scrollY === 0) e.preventDefault() }
    el.addEventListener('touchstart', onTS)
    el.addEventListener('touchmove', onTM, { passive: false })
    return () => { el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTM) }
  }, [mode])

  /* ═══ Export Functions ═══ */
  const getCanvasDataURL = useCallback(() => {
    if (!stageRef.current) return null
    return stageRef.current.toDataURL({ pixelRatio: 4 })
  }, [])

  const handleExportPNG = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const link = document.createElement('a')
      link.download = `eid-greeting-${Date.now()}.png`
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('تم التحميل بنجاح')
    } catch { toast.error('حدث خطأ') }
  }, [])

  const handleExportPDF = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const { jsPDF } = await import('jspdf')
      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] })
      pdf.addImage(uri, 'PNG', 0, 0, 1080, 1080)
      pdf.save(`eid-greeting-${Date.now()}.pdf`)
      toast.success('تم تحميل PDF')
    } catch { toast.error('خطأ في التصدير') }
  }, [])

  const handleShareWhatsApp = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'تهنئة العيد', text: 'عيد مبارك' })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent('عيد مبارك — من سَلِّم')}`, '_blank')
      }
      toast.success('تم فتح المشاركة')
    } catch { toast.error('خطأ في المشاركة') }
  }, [getCanvasDataURL])

  const handleCopyImage = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      toast.success('تم النسخ')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('المتصفح لا يدعم النسخ') }
  }, [getCanvasDataURL])

  const handleShareNative = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share) await navigator.share({ files: [file] })
      else toast.error('غير مدعوم')
    } catch { toast.error('خطأ') }
  }, [getCanvasDataURL])

  /* ═══ Drag Handlers ═══ */
  const handleDrag = (setter) => (e) => {
    const { x, y } = e.target.position()
    setter({ x: (x + stageSize.width * 0.4) / stageSize.width, y: y / stageSize.height })
  }

  const handleCalligraphyDrag = (e) => {
    const { x, y } = e.target.position()
    store.setCalligraphyPos({
      x: (x + calligraphyWidth / 2) / stageSize.width,
      y: (y + calligraphyHeight / 2) / stageSize.height
    })
  }

  const handlePhotoDrag = (e) => {
    const { x, y } = e.target.position()
    store.setPhotoPos({
      x: (x + photoW / 2) / stageSize.width,
      y: (y + photoW / 2) / stageSize.height
    })
  }

  const handleElementClick = (el) => () => store.setActiveElement(el)

  /* ═══ Template Upload ═══ */
  const handleTemplateUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newTemplate = {
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          image: ev.target.result,
          textColor: '#ffffff',
          isCustom: true,
        }
        setCustomTemplates(prev => {
          const updated = [...prev, newTemplate]
          localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
    toast.success(`تم رفع ${files.length} صورة`)
    e.target.value = ''
  }

  const handleDeleteCustomTemplate = (id) => {
    setCustomTemplates(prev => {
      const updated = prev.filter(ct => ct.id !== id)
      localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
      return updated
    })
    toast.success('تم الحذف')
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      store.setPersonalPhoto(ev.target.result)
      store.setPhotoPos({ x: 0.5, y: 0.75 })
      toast.success('تم إضافة الصورة')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  /* ═══ Tool Items ═══ */
  const toolItems = [
    { id: 'backgrounds', label: 'الخلفية', icon: <BsImage size={20} />, tip: 'اختر خلفية للبطاقة' },
    { id: 'calligraphy', label: 'المخطوطات', icon: <BsStars size={20} />, tip: 'أضف مخطوطة عيدية' },
    { id: 'photo', label: 'صورة', icon: <BsPersonCircle size={20} />, tip: 'أضف صورتك الشخصية' },
    { id: 'logo', label: 'الشعار', icon: <BsBuilding size={20} />, tip: 'شعار شركتك' },
    { id: 'text', label: 'النصوص', icon: <BsChatLeftText size={20} />, tip: 'تعديل نصوص البطاقة' },
    { id: 'style', label: 'التنسيق', icon: <HiOutlineColorSwatch size={20} />, tip: 'الخط والألوان والتأثيرات' },
  ]

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily: ds.font, background: '#f5f5f5', minHeight: '100vh', paddingTop: 0 }}>
      <Toaster position="top-center" toastOptions={{ 
        style: { background: '#1a1a1a', color: '#fff', borderRadius: 12, fontFamily: ds.font, fontSize: 14, padding: '12px 20px' }
      }} />

      {/* ═══ Header ═══ */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #eee',
        padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#000' }}>محرر البطاقات</h1>
        
        {/* Mode Switcher - Prominent */}
        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 14, padding: 4, gap: 4 }}>
          <button onClick={() => setMode('ready')} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12,
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: ds.font,
            background: mode === 'ready' ? '#000' : 'transparent',
            color: mode === 'ready' ? '#fff' : '#555',
            transition: 'all 200ms'
          }}>
            <BsStars size={16} /> جاهز
          </button>
          <button onClick={() => setMode('designer')} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12,
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: ds.font,
            background: mode === 'designer' ? '#000' : 'transparent',
            color: mode === 'designer' ? '#fff' : '#555',
            transition: 'all 200ms'
          }}>
            <BsPencilFill size={14} /> صمّم
          </button>
          <button onClick={() => setMode('batch')} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12,
            border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: ds.font,
            background: mode === 'batch' ? '#000' : 'transparent',
            color: mode === 'batch' ? '#fff' : '#555',
            transition: 'all 200ms'
          }}>
            <BsPeople size={16} /> جماعي
          </button>
        </div>
      </div>

      {/* ═══ Luxury Animated Marquee Banner ═══ */}
      <div style={{
        background: '#2d2d2d',
        padding: '12px 0', overflow: 'hidden', width: '100%'
      }}>
        <div style={{
          display: 'flex', width: 'max-content', animation: 'marquee 20s linear infinite'
        }}>
          {[0, 1].map((idx) => (
            <div key={idx} style={{ display: 'flex', gap: 50, alignItems: 'center', paddingRight: 50 }}>
              <span style={{ color: '#d4af37', fontSize: 13, fontWeight: 600, fontFamily: ds.font }}>✨ صمّم بطاقات عيد احترافية</span>
              <span style={{ color: '#555', fontSize: 8 }}>●</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: ds.font }}>أكثر من 100+ تصميم</span>
              <span style={{ color: '#555', fontSize: 8 }}>●</span>
              <span style={{ color: '#d4af37', fontSize: 13, fontWeight: 600, fontFamily: ds.font }}>مجاني 100%</span>
              <span style={{ color: '#555', fontSize: 8 }}>●</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: ds.font }}>تهنئة جماعية</span>
              <span style={{ color: '#555', fontSize: 8 }}>●</span>
              <span style={{ color: '#d4af37', fontSize: 13, fontWeight: 600, fontFamily: ds.font }}>جودة 4K</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
         READY MODE - Simple 3-Step Flow
      ═══════════════════════════════════════════════════════════════════ */}
      {mode === 'ready' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 40px' }}>
          
          {/* Step 1: Choose Design */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: ds.shadow.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>١</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>اختر التصميم</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {readyDesigns.map(d => (
                <button key={d.id} onClick={() => { setReadyDesign(d); store.setTemplate(null) }} style={{
                  position: 'relative', aspectRatio: '1', borderRadius: 16, overflow: 'hidden',
                  border: readyDesign?.id === d.id ? '3px solid #000' : '2px solid #eee',
                  cursor: 'pointer', padding: 0, transition: 'all 200ms',
                  transform: readyDesign?.id === d.id ? 'scale(1.02)' : 'scale(1)'
                }}>
                  <img src={d.template} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '24px 10px 10px', textAlign: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{d.name}</span>
                  </div>
                  {readyDesign?.id === d.id && (
                    <div style={{ position: 'absolute', top: 10, left: 10, width: 28, height: 28, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Enter Name */}
          {readyDesign && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: ds.shadow.sm, animation: 'fadeUp 300ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>٢</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>اكتب اسمك</h2>
              </div>
              <input type="text" value={readyName} onChange={(e) => setReadyName(e.target.value)}
                placeholder="مثال: محمد العلي" dir="rtl"
                style={{
                  width: '100%', padding: '18px 24px', fontSize: 18, fontWeight: 600, fontFamily: ds.font,
                  border: '2px solid #eee', borderRadius: 14, textAlign: 'center', outline: 'none',
                  transition: 'border-color 200ms', background: '#fafafa'
                }}
                onFocus={(e) => e.target.style.borderColor = '#000'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />
            </div>
          )}

          {/* Step 3: Preview & Export */}
          {readyDesign && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: ds.shadow.sm, animation: 'fadeUp 300ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>٣</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>حمّل أو شارك</h2>
              </div>
              
              {/* Canvas Preview */}
              <div ref={mode === 'ready' ? containerRef : undefined} style={{ maxWidth: 400, margin: '0 auto 24px' }}>
                <div style={{ background: '#000', borderRadius: 16, padding: 8 }}>
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 12, overflow: 'hidden' }}>
                    <Layer>
                      <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                      {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                      {readyName && (
                        <Text text={readyName} x={0} y={stageSize.height * 0.82} width={stageSize.width} align="center"
                          fontFamily="'Cairo', sans-serif" fontSize={24 * scale} fill={readyDesign.nameColor} lineHeight={1.5} />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tooltip text="تحميل بجودة عالية">
                  <button onClick={handleExportPNG} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsDownload size={18} /> تحميل
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة عبر واتساب">
                  <button onClick={handleShareWhatsApp} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px',
                    background: '#25D366', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsWhatsapp size={18} /> واتساب
                  </button>
                </Tooltip>
                <Tooltip text="تحميل PDF">
                  <button onClick={handleExportPDF} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 14,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsFilePdf size={16} /> PDF
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
         DESIGNER MODE - Advanced Editor
      ═══════════════════════════════════════════════════════════════════ */}
      {mode === 'designer' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 40px' }}>
          <div className="designer-grid" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* ═══ Left: Canvas & Actions ═══ */}
            <div className="canvas-section">
              
              {/* Canvas */}
              <div ref={mode === 'designer' ? containerRef : undefined} style={{ maxWidth: 520, margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 10, boxShadow: ds.shadow.lg }}>
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'grab' }}>
                    <Layer>
                      <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                      {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                      {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                      {!bgLoaded && !store.selectedCalligraphy && (
                        <Text text="اختر خلفية للبدء" x={0} y={stageSize.height * 0.45} width={stageSize.width} align="center" fontFamily="'Cairo', sans-serif" fontSize={16 * scale} fill="#888" lineHeight={1.8} />
                      )}
                      {calligraphyImg && calligraphyLoaded && (
                        <KonvaImage image={calligraphyImg}
                          x={store.calligraphyPos.x * stageSize.width - calligraphyWidth / 2}
                          y={store.calligraphyPos.y * stageSize.height - calligraphyHeight / 2}
                          width={calligraphyWidth} height={calligraphyHeight}
                          draggable onDragEnd={handleCalligraphyDrag} />
                      )}
                      {personalPhotoImg && personalPhotoLoaded && (
                        <Group
                          x={store.photoPos.x * stageSize.width - photoW / 2}
                          y={store.photoPos.y * stageSize.height - photoW / 2}
                          draggable onDragEnd={handlePhotoDrag}
                          clipFunc={store.photoShape === 'circle' ? (ctx) => { ctx.arc(photoW / 2, photoW / 2, photoW / 2, 0, Math.PI * 2) } : store.photoShape === 'rounded' ? (ctx) => { const r = photoW * 0.15; ctx.moveTo(r, 0); ctx.lineTo(photoW - r, 0); ctx.quadraticCurveTo(photoW, 0, photoW, r); ctx.lineTo(photoW, photoW - r); ctx.quadraticCurveTo(photoW, photoW, photoW - r, photoW); ctx.lineTo(r, photoW); ctx.quadraticCurveTo(0, photoW, 0, photoW - r); ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0) } : undefined}
                        >
                          {store.photoBorder && store.photoShape === 'circle' && (
                            <Circle x={photoW / 2} y={photoW / 2} radius={photoW / 2} stroke={store.photoBorderColor} strokeWidth={store.photoBorderWidth * scale} />
                          )}
                          {store.photoBorder && store.photoShape !== 'circle' && (
                            <Rect x={0} y={0} width={photoW} height={photoW} cornerRadius={store.photoShape === 'rounded' ? photoW * 0.15 : 0} stroke={store.photoBorderColor} strokeWidth={store.photoBorderWidth * scale} />
                          )}
                          <KonvaImage image={personalPhotoImg} x={0} y={0} width={photoW} height={photoW} />
                        </Group>
                      )}
                      <DraggableText text={store.mainText} x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.mainTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.fontSize * scale} fontFamily={currentFont.family} fill={store.textColor} align="center" lineHeight={1.6} padding={20 * scale} rotation={store.mainTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.6)" shadowBlur={10 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale} onDragEnd={handleDrag(store.setMainTextPos)} onClick={handleElementClick('mainText')} />
                      <DraggableText text={store.subText} x={store.subTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.subTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.subFontSize * scale} fontFamily={currentFont.family} fill={store.subTextColor} align="center" lineHeight={1.5} padding={15 * scale} rotation={store.subTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={8 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.7} onDragEnd={handleDrag(store.setSubTextPos)} onClick={handleElementClick('subText')} />
                      <DraggableText text={store.recipientName} x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4} y={store.recipientPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={22 * scale} fontFamily={currentFont.family} fill={store.recipientColor} align="center" shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={6 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.5} onDragEnd={handleDrag(store.setRecipientPos)} onClick={handleElementClick('recipientName')} />
                      <DraggableText text={store.senderName} x={store.senderPos.x * stageSize.width - stageSize.width * 0.4} y={store.senderPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={18 * scale} fontFamily={currentFont.family} fill={store.senderColor} align="center" opacity={0.85} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.4)" shadowBlur={5 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.4} onDragEnd={handleDrag(store.setSenderPos)} onClick={handleElementClick('senderName')} />
                                            {/* Company Logo */}
                                            {logoImg && logoLoaded && (
                                              <KonvaImage image={logoImg} x={logoPos.x} y={logoPos.y} width={logoW} height={logoH} />
                                            )}
                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ maxWidth: 520, margin: '20px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Tooltip text="تحميل البطاقة بجودة عالية">
                  <button onClick={handleExportPNG} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font, width: '100%'
                  }}>
                    <BsDownload size={18} /> تحميل PNG
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة مباشرة عبر واتساب">
                  <button onClick={handleShareWhatsApp} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px',
                    background: '#25D366', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font, width: '100%'
                  }}>
                    <BsWhatsapp size={18} /> واتساب
                  </button>
                </Tooltip>
              </div>
              <div style={{ maxWidth: 520, margin: '12px auto 0', display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Tooltip text="تحميل PDF">
                  <button onClick={handleExportPDF} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsFilePdf /> PDF
                  </button>
                </Tooltip>
                <Tooltip text="نسخ الصورة">
                  <button onClick={handleCopyImage} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    {copied ? <BsCheck2 color="#10b981" /> : <BsLink45Deg />} {copied ? 'تم' : 'نسخ'}
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة">
                  <button onClick={handleShareNative} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsShareFill /> مشاركة
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* ═══ Right: Tools Panel ═══ */}
            <div className="tools-section">
              {/* Tool Tabs */}
              <div className="tool-tabs" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, direction: 'rtl' }}>
                {toolItems.map(t => (
                  <Tooltip key={t.id} text={t.tip}>
                    <button onClick={() => setActivePanel(t.id)} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '12px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                      background: activePanel === t.id ? '#000' : '#fff',
                      color: activePanel === t.id ? '#fff' : '#666',
                      boxShadow: activePanel === t.id ? ds.shadow.md : 'none',
                      transition: 'all 200ms', minWidth: 70, flexShrink: 0
                    }}>
                      {t.icon}
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{t.label}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>

              {/* Panel Content */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, minHeight: 400 }}>
                {renderPanel()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
         BATCH MODE - Mass Greeting Cards
      ═══════════════════════════════════════════════════════════════════ */}
      {mode === 'batch' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
          
          {/* Preview Canvas - On Top */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 16, boxShadow: ds.shadow.sm, marginBottom: 20 }}>
            <div ref={mode === 'batch' ? containerRef : undefined} style={{ maxWidth: 400, margin: '0 auto' }}>
              <div style={{ background: '#000', borderRadius: 14, padding: 8 }}>
                <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <Layer>
                    <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                    {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                    {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                    {calligraphyImg && calligraphyLoaded && (
                      <KonvaImage image={calligraphyImg}
                        x={store.calligraphyPos.x * stageSize.width - calligraphyWidth / 2}
                        y={store.calligraphyPos.y * stageSize.height - calligraphyHeight / 2}
                        width={calligraphyWidth} height={calligraphyHeight} />
                    )}
                    <DraggableText text={store.mainText} x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.mainTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.fontSize * scale} fontFamily={currentFont.family} fill={store.textColor} align="center" lineHeight={1.6} padding={20 * scale} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.6)" shadowBlur={10 * scale} />
                    <DraggableText text={store.recipientName || 'الاسم هنا'} x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4} y={store.recipientPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={22 * scale} fontFamily={currentFont.family} fill={store.recipientColor} align="center" shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={6 * scale} />
                    {logoImg && logoLoaded && (
                      <KonvaImage image={logoImg} x={logoPos.x} y={logoPos.y} width={logoW} height={logoH} />
                    )}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>

          {/* Progress Circle - When Generating */}
          {store.batchGenerating && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 12px' }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f0f0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#000" strokeWidth="10"
                    strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - store.batchProgress / 100)}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 300ms ease' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 20, fontWeight: 800 }}>
                  {store.batchProgress}%
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>جاري إنشاء: {store.batchNames[store.batchCurrentIndex]}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>{store.batchCurrentIndex + 1} / {store.batchNames.length}</p>
            </div>
          )}

          {/* Names Input Section */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BsPeople size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>تهنئة جماعية</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#888' }}>أدخل أسماء المهنئين</p>
              </div>
            </div>

            {/* File Upload */}
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
              padding: '16px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
              cursor: 'pointer', marginBottom: 16, fontFamily: ds.font
            }}>
              <input type="file" accept=".txt,.csv" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const text = ev.target.result
                  const names = text.split(/[\n,;]+/).map(n => n.trim()).filter(n => n.length > 0)
                  store.setBatchNames(names)
                  toast.success(`تم تحميل ${names.length} اسم`)
                }
                reader.readAsText(file)
                e.target.value = ''
              }} />
              <BsFileEarmarkText size={18} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>رفع ملف (.txt, .csv)</span>
            </label>

            {/* Text Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>أو اكتب الأسماء (اسم في كل سطر)</label>
              <textarea
                dir="rtl"
                rows={5}
                placeholder="محمد العلي&#10;فاطمة السعيد&#10;أحمد الخالد..."
                value={store.batchNames.join('\n')}
                onChange={(e) => {
                  const names = e.target.value.split('\n').map(n => n.trim()).filter(n => n.length > 0)
                  store.setBatchNames(names)
                }}
                style={{
                  width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                  borderRadius: 12, resize: 'none', outline: 'none', background: '#fafafa', lineHeight: 1.8
                }}
              />
            </div>

            {/* Names Count */}
            {store.batchNames.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f0fdf4', borderRadius: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>{store.batchNames.length} اسم جاهز</span>
                <button onClick={() => store.resetBatch()} style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                }}>
                  مسح
                </button>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={async () => {
                if (store.batchNames.length === 0) {
                  toast.error('أدخل أسماء أولاً')
                  return
                }
                store.setBatchGenerating(true)
                store.setGeneratedCards([])
                
                for (let i = 0; i < store.batchNames.length; i++) {
                  store.setBatchCurrentIndex(i)
                  store.setBatchProgress(Math.round(((i + 1) / store.batchNames.length) * 100))
                  store.setRecipientName(store.batchNames[i])
                  await new Promise(resolve => setTimeout(resolve, 300))
                  if (stageRef.current) {
                    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 })
                    store.addGeneratedCard({ name: store.batchNames[i], dataUrl })
                  }
                }
                
                store.setBatchGenerating(false)
                toast.success(`تم إنشاء ${store.batchNames.length} بطاقة!`)
              }}
              disabled={store.batchGenerating || store.batchNames.length === 0}
              style={{
                width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                background: store.batchNames.length > 0 ? '#000' : '#ddd',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: store.batchNames.length > 0 ? 'pointer' : 'not-allowed',
                fontFamily: ds.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              {store.batchGenerating ? (
                <>
                  <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  جاري الإنشاء... {store.batchProgress}%
                </>
              ) : (
                <><BsStars size={18} /> إنشاء البطاقات</>
              )}
            </button>
          </div>

          {/* Generated Cards */}
          {store.generatedCards.length > 0 && !store.batchGenerating && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>البطاقات الجاهزة ({store.generatedCards.length})</h4>
                <button
                  onClick={async () => {
                    const zip = new JSZip()
                    store.generatedCards.forEach((card) => {
                      const base64 = card.dataUrl.split(',')[1]
                      zip.file(`بطاقة-${card.name}.png`, base64, { base64: true })
                    })
                    const content = await zip.generateAsync({ type: 'blob' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(content)
                    link.download = `بطاقات-العيد-${store.generatedCards.length}.zip`
                    link.click()
                    toast.success('تم تحميل الملف!')
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}
                >
                  <BsCloudDownload size={16} /> تحميل ZIP
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                {store.generatedCards.map((card, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid #eee' }}>
                    <img src={card.dataUrl} alt={card.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '12px 6px 6px', textAlign: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 9, fontWeight: 600 }}>{card.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ Attribution Footer ═══ */}
      <div style={{
        background: '#fff', borderTop: '1px solid #eee',
        padding: '50px 20px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Designer Credit Card */}
          <div style={{
            background: '#fafafa', borderRadius: 16, padding: '28px 32px',
            marginBottom: 24, border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888', fontFamily: ds.font }}>
              تم تصميم وتطوير هذا المشروع بواسطة
            </p>
            <a
              href="https://x.com/am_designing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                background: '#000', color: '#fff', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: 600, fontFamily: ds.font
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @am_designing
            </a>
          </div>

          {/* Collaboration */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#999', fontFamily: ds.font }}>هل ترغب بالتعاون معنا؟</span>
            <a
              href="https://x.com/am_designing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: '#000', fontWeight: 600, fontFamily: ds.font,
                textDecoration: 'underline', textUnderlineOffset: 3
              }}
            >
              تواصل معنا →
            </a>
          </div>
        </div>
      </div>
      
            {/* Animations & Responsive */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tooltipIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        input[type="range"] { -webkit-appearance: none; height: 6px; border-radius: 6px; background: #eee; cursor: pointer; width: 100%; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #000; cursor: pointer; }
        
        .tool-tabs::-webkit-scrollbar { height: 4px; }
        .tool-tabs::-webkit-scrollbar-track { background: transparent; }
        .tool-tabs::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        
        /* Desktop Layout */
        @media (min-width: 1024px) {
          .designer-grid {
            display: grid !important;
            grid-template-columns: 1fr 420px !important;
            gap: 28px !important;
            direction: rtl;
          }
          .canvas-section {
            position: sticky;
            top: 140px;
          }
          .tool-tabs {
            display: grid !important;
            grid-template-columns: repeat(6, 1fr) !important;
            overflow: visible !important;
          }
        }
        
        /* Mobile Layout */
        @media (max-width: 1023px) {
          .designer-grid {
            flex-direction: column !important;
          }
          .canvas-section {
            order: 1;
          }
          .tools-section {
            order: 2;
          }
        }
        
        /* Batch mode mobile */
        @media (max-width: 768px) {
          .batch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )

  /* ═══════════════════════════════════════════════════════════════════
     PANEL RENDER FUNCTIONS
  ═══════════════════════════════════════════════════════════════════ */
  function renderPanel() {
    // ─── BACKGROUNDS PANEL ───
    if (activePanel === 'backgrounds') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsImage size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>الخلفيات</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>اختر أو ارفع خلفية</p>
          </div>
        </div>

        {/* Upload Button */}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
          padding: '16px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
          cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font
        }}>
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleTemplateUpload} />
          <BsPlusLg size={16} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>رفع صورة جديدة</span>
        </label>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {allTemplates.map((t) => (
            <button key={t.id} onClick={() => store.setTemplate(t.id)} style={{
              position: 'relative', aspectRatio: '1', borderRadius: 14, overflow: 'hidden', padding: 0,
              border: store.selectedTemplate === t.id ? '3px solid #000' : '2px solid #eee',
              cursor: 'pointer', transition: 'all 200ms'
            }}>
              <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.closest('button').style.display = 'none' }} />
              {t.isCustom && (
                <button onClick={(ev) => { ev.stopPropagation(); handleDeleteCustomTemplate(t.id) }} style={{
                  position: 'absolute', top: 6, left: 6, width: 24, height: 24, borderRadius: '50%',
                  background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14
                }}>×</button>
              )}
              {store.selectedTemplate === t.id && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>
    )

    // ─── CALLIGRAPHY PANEL ───
    if (activePanel === 'calligraphy') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsStars size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>المخطوطات</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{allFilteredCalligraphy.length} مخطوطة متاحة</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {calligraphyCategories.map(cat => (
            <button key={cat.id} onClick={() => { setCalligraphyCat(cat.id); setCalligraphyLimit(30) }} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
              background: calligraphyCat === cat.id ? '#000' : '#f5f5f5',
              color: calligraphyCat === cat.id ? '#fff' : '#666',
              fontSize: 13, fontWeight: 600, transition: 'all 200ms'
            }}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Calligraphy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
          {filteredCalligraphy.map(c => (
            <button key={c.id} onClick={() => { store.setSelectedCalligraphy(store.selectedCalligraphy === c.path ? null : c.path); store.setCalligraphyPos({ x: 0.5, y: 0.25 }) }} style={{
              padding: 10, borderRadius: 12, border: store.selectedCalligraphy === c.path ? '2px solid #000' : '2px solid #eee',
              cursor: 'pointer', background: calligraphyCat === 'black' ? '#f5f5f5' : '#1a1a2e',
              transition: 'all 200ms', minHeight: 70
            }}>
              <img src={c.path} alt={c.name} style={{ width: '100%', height: 'auto', maxHeight: 48, objectFit: 'contain' }} loading="lazy" onError={(e) => { e.target.closest('button').style.display = 'none' }} />
            </button>
          ))}
        </div>

        {calligraphyLimit < allFilteredCalligraphy.length && (
          <button onClick={() => setCalligraphyLimit(prev => prev + 60)} style={{
            width: '100%', padding: '12px', marginTop: 16, borderRadius: 12,
            border: '2px solid #eee', background: '#fff', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: ds.font, color: '#000'
          }}>
            عرض المزيد ({allFilteredCalligraphy.length - calligraphyLimit})
          </button>
        )}

        {/* Scale Control */}
        {store.selectedCalligraphy && (
          <div style={{ marginTop: 20, padding: 16, background: '#f8f8f8', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
              <span style={{ fontSize: 12, color: '#888', background: '#fff', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.calligraphyScale * 100)}%</span>
            </div>
            <input type="range" min={0.15} max={1} step={0.05} value={store.calligraphyScale} onChange={(e) => store.setCalligraphyScale(Number(e.target.value))} style={{ width: '100%' }} />
            <button onClick={() => store.setSelectedCalligraphy(null)} style={{
              width: '100%', padding: '12px', marginTop: 12, borderRadius: 12,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة المخطوطة
            </button>
          </div>
        )}
      </div>
    )

    // ─── PHOTO PANEL ───
    if (activePanel === 'photo') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsPersonCircle size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>الصورة الشخصية</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>أضف صورتك على البطاقة</p>
          </div>
        </div>

        {/* Upload Button */}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
          padding: '20px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
          cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font
        }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
          <BsPersonCircle size={20} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{store.personalPhoto ? 'تغيير الصورة' : 'اختيار صورة'}</span>
        </label>

        {/* Photo Controls */}
        {store.personalPhoto && (
          <div style={{ animation: 'fadeUp 200ms ease' }}>
            {/* Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, overflow: 'hidden', border: '3px solid #000',
                borderRadius: store.photoShape === 'circle' ? '50%' : store.photoShape === 'rounded' ? 16 : 0
              }}>
                <img src={store.personalPhoto} alt="صورة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Shape Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>الشكل</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'circle', label: 'دائرة' }, { id: 'rounded', label: 'مستدير' }, { id: 'square', label: 'مربع' }].map(s => (
                  <button key={s.id} onClick={() => store.setPhotoShape(s.id)} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                    background: store.photoShape === s.id ? '#000' : '#f5f5f5',
                    color: store.photoShape === s.id ? '#fff' : '#666',
                    fontSize: 13, fontWeight: 600, transition: 'all 200ms'
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
                <span style={{ fontSize: 12, color: '#888', background: '#f5f5f5', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.photoScale * 100)}%</span>
              </div>
              <input type="range" min={0.08} max={0.6} step={0.02} value={store.photoScale} onChange={(e) => store.setPhotoScale(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Border Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#f8f8f8', borderRadius: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>إطار</span>
              <button onClick={() => store.setPhotoBorder(!store.photoBorder)} style={{
                width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                background: store.photoBorder ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, transition: 'all 200ms',
                  left: store.photoBorder ? 23 : 3
                }} />
              </button>
            </div>

            {store.photoBorder && (
              <div style={{ padding: 16, background: '#f8f8f8', borderRadius: 14, marginBottom: 12, animation: 'fadeUp 200ms ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>سمك الإطار</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{store.photoBorderWidth}px</span>
                </div>
                <input type="range" min={1} max={8} step={1} value={store.photoBorderWidth} onChange={(e) => store.setPhotoBorderWidth(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
                <ColorPicker value={store.photoBorderColor} onChange={store.setPhotoBorderColor} label="اللون" />
              </div>
            )}

            {/* Remove Button */}
            <button onClick={() => store.setPersonalPhoto(null)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة الصورة
            </button>
          </div>
        )}
      </div>
    )

    // ─── LOGO PANEL ───
    if (activePanel === 'logo') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsBuilding size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>شعار الشركة</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>أضف شعارك على البطاقة</p>
          </div>
        </div>

        {/* Upload Logo */}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
          padding: '20px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
          cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font
        }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = (ev) => {
              store.setCompanyLogo(ev.target.result)
              toast.success('تم إضافة الشعار')
            }
            reader.readAsDataURL(file)
            e.target.value = ''
          }} />
          <BsBuilding size={20} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{store.companyLogo ? 'تغيير الشعار' : 'رفع الشعار'}</span>
        </label>

        {/* Logo Controls */}
        {store.companyLogo && (
          <div style={{ animation: 'fadeUp 200ms ease' }}>
            {/* Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, overflow: 'hidden', border: '2px solid #eee', borderRadius: 12, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={store.companyLogo} alt="شعار" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Position Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>موقع الشعار</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { id: 'top-right', label: 'أعلى يمين' },
                  { id: 'top-left', label: 'أعلى يسار' },
                  { id: 'bottom-right', label: 'أسفل يمين' },
                  { id: 'bottom-left', label: 'أسفل يسار' },
                ].map(pos => (
                  <button key={pos.id} onClick={() => store.setLogoPosition(pos.id)} style={{
                    padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                    background: store.logoPosition === pos.id ? '#000' : '#f5f5f5',
                    color: store.logoPosition === pos.id ? '#fff' : '#666',
                    fontSize: 13, fontWeight: 600, transition: 'all 200ms'
                  }}>
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
                <span style={{ fontSize: 12, color: '#888', background: '#f5f5f5', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.logoScale * 100)}%</span>
              </div>
              <input type="range" min={0.05} max={0.3} step={0.01} value={store.logoScale} onChange={(e) => store.setLogoScale(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Remove Button */}
            <button onClick={() => store.setCompanyLogo(null)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة الشعار
            </button>
          </div>
        )}
      </div>
    )

    // ─── TEXT PANEL ───
    if (activePanel === 'text') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsChatLeftText size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>النصوص</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>تعديل نصوص البطاقة</p>
          </div>
        </div>

        {/* Main Text */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>النص الرئيسي</label>
            <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.fontSize}px</span>
          </div>
          <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')}
            dir="rtl" rows={2} placeholder="عيد مبارك..."
            style={{
              width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
              borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa'
            }}
          />
          <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </div>

        {/* Sub Text */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>النص الفرعي</label>
            <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.subFontSize}px</span>
          </div>
          <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')}
            dir="rtl" rows={2} placeholder="كل عام وأنتم بخير"
            style={{
              width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
              borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa'
            }}
          />
          <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </div>

        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>المُستلِم</label>
            <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)}
              dir="rtl" placeholder="أم فهد"
              style={{
                width: '100%', padding: 12, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>المُرسِل</label>
            <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)}
              dir="rtl" placeholder="اسمك"
              style={{
                width: '100%', padding: 12, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
          </div>
        </div>

        {/* Ready Texts */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>نصوص جاهزة</h4>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <BsSearch style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
              dir="rtl" placeholder="ابحث..."
              style={{
                width: '100%', padding: '10px 36px 10px 12px', fontSize: 13, fontFamily: ds.font,
                border: '2px solid #eee', borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
          </div>
          <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredTexts.slice(0, 10).map((t) => (
              <button key={t.id} onClick={() => {
                store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 60))
                store.setSubText(t.text.length > 60 ? t.text.substring(60, 120) : '')
                toast.success('تم اختيار النص')
              }}
                dir="rtl"
                style={{
                  padding: 12, borderRadius: 10, border: '1px solid #eee', background: '#fafafa',
                  cursor: 'pointer', textAlign: 'right', fontSize: 12, lineHeight: 1.6,
                  fontFamily: ds.font, transition: 'all 200ms'
                }}
              >
                {t.text.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    )

    // ─── STYLE PANEL ───
    if (activePanel === 'style') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineColorSwatch size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>التنسيق</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>الخط والألوان والتأثيرات</p>
          </div>
        </div>

        {/* Font Selection */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>الخط</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fonts.map(f => (
              <button key={f.id} onClick={() => store.setFont(f.id)} style={{
                padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: store.selectedFont === f.id ? '#000' : '#f5f5f5',
                color: store.selectedFont === f.id ? '#fff' : '#666',
                fontSize: 13, fontWeight: 600, fontFamily: f.family, transition: 'all 200ms'
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div style={{ marginBottom: 24, borderTop: '1px solid #eee', paddingTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 14 }}>ألوان النصوص</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ColorPicker value={store.textColor} onChange={store.setTextColor} label="الرئيسي" />
            <ColorPicker value={store.subTextColor} onChange={store.setSubTextColor} label="الفرعي" />
            <ColorPicker value={store.recipientColor} onChange={store.setRecipientColor} label="المستلِم" />
            <ColorPicker value={store.senderColor} onChange={store.setSenderColor} label="المُرسِل" />
          </div>
        </div>

        {/* Effects */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 14 }}>التأثيرات</label>
          
          {/* Shadow Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>ظل النص</span>
            <button onClick={() => store.setTextShadow(!store.textShadow)} style={{
              width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: store.textShadow ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'all 200ms', left: store.textShadow ? 23 : 3 }} />
            </button>
          </div>

          {/* Stroke Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>حدود النص</span>
            <button onClick={() => store.setTextStroke(!store.textStroke)} style={{
              width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: store.textStroke ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'all 200ms', left: store.textStroke ? 23 : 3 }} />
            </button>
          </div>

          {store.textStroke && (
            <div style={{ padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10, animation: 'fadeUp 200ms ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>سمك الحدود</span>
                <span style={{ fontSize: 12, color: '#888' }}>{store.textStrokeWidth}px</span>
              </div>
              <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
              <ColorPicker value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="اللون" />
            </div>
          )}

          {/* Overlay */}
          <div style={{ padding: 14, background: '#f8f8f8', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>طبقة لونية</span>
              <span style={{ fontSize: 12, color: '#888' }}>{Math.round(store.overlayOpacity * 100)}%</span>
            </div>
            <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                <button key={c} onClick={() => store.setOverlayColor(c)} style={{
                  width: 32, height: 32, borderRadius: '50%', border: store.overlayColor === c ? '2px solid #000' : '1px solid #ddd',
                  backgroundColor: c, cursor: 'pointer', transition: 'transform 150ms',
                  transform: store.overlayColor === c ? 'scale(1.15)' : 'scale(1)'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )

    return null
  }
}
