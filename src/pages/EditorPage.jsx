import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Circle } from 'react-konva'
import { useEditorStore } from '../store'
import { templates, fonts } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { calligraphy, calligraphyCategories } from '../data/calligraphy'
import { BsDownload, BsFilePdf, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2, BsChevronDown, BsPencilFill, BsStars, BsSearch, BsPersonCircle, BsImage, BsPalette, BsFonts, BsChatLeftText, BsSliders, BsTrash, BsPlusLg, BsArrowRepeat } from 'react-icons/bs'
import { HiPhotograph } from 'react-icons/hi'
import toast, { Toaster } from 'react-hot-toast'

/* ═══ Hook: load image ═══ */
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

/* ═══ Draggable text on Konva canvas ═══ */
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

/* ═══ Color picker row ═══ */
const quickColors = ['#ffffff', '#000000', '#d4a843', '#2563eb', '#fbbf24', '#ef4444', '#4ade80', '#f472b6', '#93c5fd', '#c4b5fd', '#f97316', '#14b8a6']

function ColorRow({ value, onChange, label }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>
      <div className="flex gap-1.5 flex-wrap items-center">
        {quickColors.map(c => (
          <button key={c} onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-full border transition-all ${value === c ? 'ring-2 ring-blue-500 scale-110 border-gray-300' : 'border-gray-200 hover:scale-105'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-6 h-6 rounded-full cursor-pointer border-0" />
      </div>
    </div>
  )
}

/* ═══ Ready-mode pre-composed designs ═══ */
const readyDesigns = [
  { id: 'r1', name: 'عيد فطر سعيد', template: '/templates/1.png', nameColor: '#ffffff' },
  { id: 'r2', name: 'عيد مبارك', template: '/templates/2.png', nameColor: '#333333' },
  { id: 'r3', name: 'كل عام وأنتم بخير', template: '/templates/3.png', nameColor: '#ffffff' },
]


export default function EditorPage() {
  const store = useEditorStore()
  const stageRef = useRef(null)
  const containerRef = useRef(null)

  /* ── Mode ── */
  const [mode, setMode] = useState('designer')
  const [readyDesign, setReadyDesign] = useState(null)
  const [readyName, setReadyName] = useState('')

  /* ── Designer panels ── */
  const [activePanel, setActivePanel] = useState('backgrounds')
  const [stageSize, setStageSize] = useState({ width: 540, height: 540 })
  const [searchText, setSearchText] = useState('')
  const [calligraphyCat, setCalligraphyCat] = useState('white')
  const [calligraphyLimit, setCalligraphyLimit] = useState(30)
  const [customTemplates, setCustomTemplates] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eidgreet_custom_templates')
      if (saved) setCustomTemplates(JSON.parse(saved))
    } catch { }
  }, [])

  const allTemplates = [...templates, ...customTemplates]
  const currentTemplate = allTemplates.find(t => t.id === store.selectedTemplate) || allTemplates[0]
  const currentFont = fonts.find(f => f.id === store.selectedFont) || fonts[1]
  const scale = stageSize.width / 1080

  const [bgImage, bgLoaded] = useImage(mode === 'ready' && readyDesign ? readyDesign.template : currentTemplate?.image)
  const [calligraphyImg, calligraphyLoaded] = useImage(store.selectedCalligraphy)
  const [personalPhotoImg, personalPhotoLoaded] = useImage(store.personalPhoto)

  const calligraphyWidth = stageSize.width * store.calligraphyScale
  const calligraphyHeight = calligraphyImg ? (calligraphyImg.height / calligraphyImg.width) * calligraphyWidth : 0

  const photoSize = stageSize.width * store.photoScale
  const photoImgRatio = personalPhotoImg ? personalPhotoImg.height / personalPhotoImg.width : 1
  const photoW = photoSize
  const photoH = photoSize * photoImgRatio

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        const size = Math.min(w, 540)
        setStageSize({ width: size, height: size })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ── Export ── */
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
      toast.success('تم تحميل البطاقة بجودة عالية!')
    } catch { toast.error('حدث خطأ أثناء التصدير') }
  }, [])

  const handleExportPDF = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const { jsPDF } = await import('jspdf')
      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] })
      pdf.addImage(uri, 'PNG', 0, 0, 1080, 1080)
      pdf.save(`eid-greeting-${Date.now()}.pdf`)
      toast.success('تم تحميل PDF!')
    } catch { toast.error('حدث خطأ أثناء تصدير PDF') }
  }, [])

  const [copied, setCopied] = useState(false)

  const getCanvasDataURL = useCallback(() => {
    if (!stageRef.current) return null
    return stageRef.current.toDataURL({ pixelRatio: 4 })
  }, [])

  const handleShareWhatsApp = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'بطاقة تهنئة العيد', text: 'عيد مبارك وكل عام وأنتم بخير' })
        toast.success('تم فتح المشاركة!')
      } else {
        const text = encodeURIComponent('عيد مبارك وكل عام وأنتم بخير — صمّم بطاقتك من سَلِّم')
        window.open(`https://wa.me/?text=${text}`, '_blank')
        toast.success('تم فتح واتساب!')
      }
    } catch { toast.error('حدث خطأ أثناء المشاركة') }
  }, [getCanvasDataURL])

  const handleCopyImage = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      toast.success('تم نسخ البطاقة!')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('المتصفح لا يدعم نسخ الصور') }
  }, [getCanvasDataURL])

  const handleShareNative = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'بطاقة تهنئة العيد', text: 'عيد مبارك وكل عام وأنتم بخير' })
      }
    } catch { /* silent */ }
  }, [getCanvasDataURL])

  /* ── Text & Drag ── */
  const filteredTexts = greetingTexts.filter(t =>
    !searchText || t.text.includes(searchText) || t.tags.some(tag => tag.includes(searchText))
  ).slice(0, 20)

  const allFilteredCalligraphy = calligraphy.filter(c => c.category === calligraphyCat)
  const filteredCalligraphy = allFilteredCalligraphy.slice(0, calligraphyLimit)

  const handleDrag = (setter) => (e) => {
    const node = e.target
    setter({
      x: (node.x() + stageSize.width * 0.4) / stageSize.width,
      y: node.y() / stageSize.height,
    })
  }

  const handleCalligraphyDrag = (e) => {
    const node = e.target
    store.setCalligraphyPos({
      x: (node.x() + calligraphyWidth / 2) / stageSize.width,
      y: (node.y() + calligraphyHeight / 2) / stageSize.height,
    })
  }

  const handlePhotoDrag = (e) => {
    const node = e.target
    store.setPhotoPos({
      x: (node.x() + photoW / 2) / stageSize.width,
      y: (node.y() + photoW / 2) / stageSize.height,
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      store.setPersonalPhoto(ev.target.result)
      toast.success('تم رفع الصورة!')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleElementClick = (elementName) => () => {
    store.setActiveElement(elementName)
  }

  useEffect(() => {
    const posMap = {
      mainText: { get: () => store.mainTextPos, set: store.setMainTextPos },
      subText: { get: () => store.subTextPos, set: store.setSubTextPos },
      senderName: { get: () => store.senderPos, set: store.setSenderPos },
      recipientName: { get: () => store.recipientPos, set: store.setRecipientPos },
    }
    function onKey(e) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !e.target.closest('input, textarea')) {
        e.preventDefault()
        const entry = posMap[store.activeElement]
        if (!entry) return
        const step = (e.shiftKey ? 5 : 1) / stageSize.width
        const pos = { ...entry.get() }
        if (e.key === 'ArrowUp') pos.y -= step
        if (e.key === 'ArrowDown') pos.y += step
        if (e.key === 'ArrowLeft') pos.x += step
        if (e.key === 'ArrowRight') pos.x -= step
        pos.x = Math.max(0, Math.min(1, pos.x))
        pos.y = Math.max(0, Math.min(1, pos.y))
        entry.set(pos)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [store.activeElement, stageSize.width])

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
    toast.success(`تم رفع ${files.length} قالب جديد`)
    e.target.value = ''
  }

  const handleDeleteCustomTemplate = (id) => {
    setCustomTemplates(prev => {
      const updated = prev.filter(ct => ct.id !== id)
      localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
      return updated
    })
    toast.success('تم حذف القالب')
  }


  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  const toolItems = [
    { id: 'backgrounds', label: 'الخلفيات', icon: <BsImage /> },
    { id: 'calligraphy', label: 'المخطوطات', icon: <BsStars /> },
    { id: 'photo', label: 'صورة', icon: <BsPersonCircle /> },
    { id: 'text', label: 'النصوص', icon: <BsChatLeftText /> },
    { id: 'style', label: 'الشكل', icon: <BsSliders /> },
  ]

  return (
    <div className="page-shell pb-0 w-full bg-[#f8f9fb] min-h-screen relative z-10" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '14px', fontFamily: "'Tajawal', sans-serif", boxShadow: '0 8px 30px -5px rgba(0,0,0,0.1)' } }} />

      {/* ═══ Header ═══ */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[64px] z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <h1 className="text-base sm:text-lg font-black text-gray-900">محرر البطاقات</h1>
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setMode('ready')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'ready'
                ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BsStars className="text-sm" /> تصميم جاهز
            </button>
            <button onClick={() => setMode('designer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'designer'
                ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <BsPencilFill className="text-sm" /> أنت المصمم
            </button>
          </div>
          {mode === 'designer' && (
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={handleExportPNG} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all">
                <BsDownload /> تحميل PNG
              </button>
              <button onClick={handleShareWhatsApp} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/10 text-[#128C7E] text-xs font-medium hover:bg-[#25D366]/20 transition-all">
                <BsWhatsapp />
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all">
                <BsFilePdf />
              </button>
              <button onClick={handleCopyImage} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all">
                {copied ? <BsCheck2 className="text-emerald-500" /> : <BsLink45Deg />}
              </button>
              <button onClick={handleShareNative} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all">
                <BsShareFill />
              </button>
            </div>
          )}
          {mode === 'ready' && <div className="w-1" />}
        </div>
      </div>


      {/* ═══════════════ READY MODE ═══════════════ */}
      {mode === 'ready' && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">١</span>
              اختر التصميم
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {readyDesigns.map(d => (
                <button key={d.id} onClick={() => { setReadyDesign(d); store.setTemplate(null) }}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${readyDesign?.id === d.id
                    ? 'ring-[3px] ring-blue-500 shadow-lg' : 'ring-1 ring-gray-200 shadow-sm hover:shadow-md'}`}
                >
                  <img src={d.template} alt={d.name} className="w-full h-full object-cover bg-gray-100" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
                    <span className="text-white text-[11px] font-bold">{d.name}</span>
                  </div>
                  {readyDesign?.id === d.id && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          {readyDesign && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">٢</span>
                اكتب اسمك
              </h2>
              <input type="text" value={readyName} onChange={(e) => setReadyName(e.target.value)}
                placeholder="مثلاً: محمد العلي"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 text-lg text-center font-bold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-gray-300"
                dir="rtl"
              />
            </div>
          )}

          {/* Step 3 */}
          {readyDesign && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">٣</span>
                المعاينة والتحميل
              </h2>
              <div ref={mode === 'ready' ? containerRef : undefined} className="max-w-[420px] mx-auto">
                <div className="bg-white rounded-xl p-2 shadow-md ring-1 ring-black/[0.04]">
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} className="rounded-lg overflow-hidden mx-auto">
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
              <div className="flex gap-2.5 justify-center flex-wrap mt-6">
                <button onClick={handleExportPNG} className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md transition-all">
                  <BsDownload /> تحميل البطاقة
                </button>
                <button onClick={handleShareWhatsApp} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/15 text-[#128C7E] text-sm font-bold hover:bg-[#25D366]/20 transition-all">
                  <BsWhatsapp /> واتساب
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                  <BsFilePdf /> PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ═══════════════ DESIGNER MODE ═══════════════ */}
      {mode === 'designer' && (
        <div className="flex flex-col xl:flex-row" style={{ minHeight: 'calc(100vh - 128px)' }}>

          {/* ── TOOL SIDEBAR (desktop) ── */}
          <div className="hidden xl:flex flex-col w-16 bg-white border-l border-gray-100 shrink-0 items-center py-4 gap-1">
            {toolItems.map(t => (
              <button key={t.id} onClick={() => setActivePanel(activePanel === t.id ? activePanel : t.id)}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-[10px] font-bold ${activePanel === t.id
                  ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                title={t.label}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="leading-none">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── PANEL (desktop: side column / mobile: below canvas) ── */}
          <div className="hidden xl:block w-[340px] bg-white border-l border-gray-100 shrink-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 128px)' }}>
            <div className="p-5 space-y-5">
              {renderPanel()}
            </div>
          </div>

          {/* ── CANVAS AREA ── */}
          <div className="flex-1 flex flex-col items-center justify-start xl:justify-center px-4 py-6 xl:py-8 min-w-0">
            <div ref={mode === 'designer' ? containerRef : undefined} className="w-full max-w-[500px]">
              <div className="bg-white rounded-xl p-2 sm:p-2.5 shadow-lg ring-1 ring-black/[0.04]">
                <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} className="rounded-lg overflow-hidden mx-auto cursor-grab active:cursor-grabbing">
                  <Layer>
                    <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                    {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                    {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                    {!bgLoaded && !store.selectedCalligraphy && (
                      <Text text="اختر خلفية أو مخطوطة للبدء" x={0} y={stageSize.height * 0.45} width={stageSize.width} align="center" fontFamily="'Cairo', sans-serif" fontSize={16 * scale} fill="#999" lineHeight={1.8} />
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
                        clipFunc={store.photoShape === 'circle' ? (ctx) => {
                          ctx.arc(photoW / 2, photoW / 2, photoW / 2, 0, Math.PI * 2)
                        } : store.photoShape === 'rounded' ? (ctx) => {
                          const r = photoW * 0.15
                          ctx.moveTo(r, 0); ctx.lineTo(photoW - r, 0); ctx.quadraticCurveTo(photoW, 0, photoW, r);
                          ctx.lineTo(photoW, photoW - r); ctx.quadraticCurveTo(photoW, photoW, photoW - r, photoW);
                          ctx.lineTo(r, photoW); ctx.quadraticCurveTo(0, photoW, 0, photoW - r);
                          ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
                        } : undefined}
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
                  </Layer>
                </Stage>
              </div>
            </div>

            {/* Mobile action buttons */}
            <div className="flex sm:hidden gap-2 justify-center flex-wrap mt-4 w-full max-w-[500px]">
              <button onClick={handleExportPNG} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all">
                <BsDownload /> تحميل PNG
              </button>
              <button onClick={handleShareWhatsApp} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366]/10 text-[#128C7E] text-xs font-medium transition-all">
                <BsWhatsapp />
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-medium transition-all">
                <BsFilePdf />
              </button>
              <button onClick={handleCopyImage} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-medium transition-all">
                {copied ? <BsCheck2 className="text-emerald-500" /> : <BsLink45Deg />}
              </button>
            </div>
          </div>

          {/* ── MOBILE: Tool tabs + Panel below canvas ── */}
          <div className="xl:hidden px-4 pb-8 space-y-3">
            <div className="flex gap-1.5 overflow-x-auto custom-scrollbar py-1">
              {toolItems.map(t => (
                <button key={t.id} onClick={() => setActivePanel(t.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activePanel === t.id
                    ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-600'}`}
                >
                  <span className="text-sm">{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
            {renderPanel()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  )

  /* ═══ Panel content renderer ═══ */
  function renderPanel() {
    if (activePanel === 'backgrounds') return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-fadeIn xl:border-0 xl:p-0 xl:rounded-none xl:shadow-none">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <HiPhotograph className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">خلفيتك الخاصة</h3>
              <p className="text-[11px] text-gray-500">ارفع صورة لاستخدامها كخلفية</p>
            </div>
          </div>
          <label className="flex items-center justify-center gap-2 w-full bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 text-sm font-bold py-2.5 rounded-xl transition-all cursor-pointer">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleTemplateUpload} />
            <BsPlusLg className="text-xs" /> رفع صورة
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {allTemplates.map((t) => (
            <button key={t.id} onClick={() => store.setTemplate(t.id)}
              className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 ${store.selectedTemplate === t.id ? 'ring-[3px] ring-blue-500 shadow-lg' : 'ring-1 ring-gray-200 shadow-sm hover:shadow-md'}`}
            >
              <img src={t.image} alt={t.name} className="w-full h-full object-cover bg-gray-100" onError={(e) => { e.target.closest('button').style.display = 'none' }} />
              {t.isCustom && (
                <button onClick={(ev) => { ev.stopPropagation(); handleDeleteCustomTemplate(t.id) }} className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 z-10">×</button>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent pt-5 pb-1.5 px-1.5">
                <span className="text-[9px] text-white font-medium truncate block text-center">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )

    if (activePanel === 'calligraphy') return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-fadeIn xl:border-0 xl:p-0 xl:rounded-none">
        <div className="flex gap-1.5">
          {calligraphyCategories.map(cat => (
            <button key={cat.id} onClick={() => { setCalligraphyCat(cat.id); setCalligraphyLimit(30) }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${calligraphyCat === cat.id
                ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-400 text-center">{allFilteredCalligraphy.length} مخطوطة</p>

        <div className="grid grid-cols-3 gap-2 max-h-[400px] xl:max-h-[55vh] overflow-y-auto custom-scrollbar">
          {filteredCalligraphy.map(c => (
            <button key={c.id}
              onClick={() => { store.setSelectedCalligraphy(store.selectedCalligraphy === c.path ? null : c.path); store.setCalligraphyPos({ x: 0.5, y: 0.25 }) }}
              className={`relative rounded-lg overflow-hidden transition-all hover:scale-[1.03] p-1.5 ${store.selectedCalligraphy === c.path
                ? 'ring-2 ring-blue-500 bg-blue-50' : 'ring-1 ring-gray-200 hover:bg-gray-50'
                } ${calligraphyCat === 'black' ? 'bg-gray-100' : 'bg-[#1a1a2e]'}`}
            >
              <img src={c.path} alt={c.name} className="w-full h-auto max-h-14 object-contain mx-auto" loading="lazy" onError={(e) => { e.target.closest('button').style.display = 'none' }} />
              <span className={`block text-[9px] font-bold mt-0.5 text-center truncate ${calligraphyCat === 'black' ? 'text-gray-600' : 'text-gray-400'}`}>{c.name}</span>
              {store.selectedCalligraphy === c.path && (
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">✓</div>
              )}
            </button>
          ))}
        </div>

        {calligraphyLimit < allFilteredCalligraphy.length && (
          <button onClick={() => setCalligraphyLimit(prev => prev + 60)}
            className="w-full py-2 rounded-lg bg-gray-50 text-blue-600 text-xs font-bold hover:bg-gray-100 transition-all border border-gray-200">
            تحميل المزيد ({allFilteredCalligraphy.length - calligraphyLimit} متبقية)
          </button>
        )}

        {store.selectedCalligraphy && (
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-gray-700">الحجم</label>
              <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{Math.round(store.calligraphyScale * 100)}%</span>
            </div>
            <input type="range" min={0.15} max={1} step={0.05} value={store.calligraphyScale} onChange={(e) => store.setCalligraphyScale(Number(e.target.value))} className="w-full accent-blue-600" />
            <button onClick={() => store.setSelectedCalligraphy(null)} className="w-full py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-all border border-red-100">
              إزالة المخطوطة
            </button>
          </div>
        )}
      </div>
    )

    if (activePanel === 'photo') return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-fadeIn xl:border-0 xl:p-0 xl:rounded-none">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <BsPersonCircle className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">صورة شخصية</h3>
              <p className="text-[11px] text-gray-500">أضف صورة على البطاقة</p>
            </div>
          </div>
          <label className="flex items-center justify-center gap-2 w-full bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 text-sm font-bold py-2.5 rounded-xl transition-all cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <BsPersonCircle /> {store.personalPhoto ? 'تغيير الصورة' : 'اختيار صورة'}
          </label>
        </div>

        {store.personalPhoto && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-center">
              <div className={`w-16 h-16 overflow-hidden ring-2 ring-blue-200 ${store.photoShape === 'circle' ? 'rounded-full' : store.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}>
                <img src={store.personalPhoto} alt="صورة شخصية" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">الشكل</label>
              <div className="flex gap-1.5">
                {[
                  { id: 'circle', label: 'دائرة' },
                  { id: 'rounded', label: 'مستدير' },
                  { id: 'square', label: 'مربع' },
                ].map(s => (
                  <button key={s.id} onClick={() => store.setPhotoShape(s.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${store.photoShape === s.id
                      ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">الحجم</label>
                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{Math.round(store.photoScale * 100)}%</span>
              </div>
              <input type="range" min={0.08} max={0.6} step={0.02} value={store.photoScale} onChange={(e) => store.setPhotoScale(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-700">إطار</span>
                <button onClick={() => store.setPhotoBorder(!store.photoBorder)} className={`w-10 h-5.5 rounded-full transition-all relative ${store.photoBorder ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: 40, height: 22 }}>
                  <div className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all shadow-sm ${store.photoBorder ? 'right-[2px]' : 'right-[20px]'}`} />
                </button>
              </div>
              {store.photoBorder && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-500 flex justify-between">سمك <span>{store.photoBorderWidth}px</span></label>
                    <input type="range" min={1} max={8} step={1} value={store.photoBorderWidth} onChange={(e) => store.setPhotoBorderWidth(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                  <ColorRow value={store.photoBorderColor} onChange={store.setPhotoBorderColor} label="اللون" />
                </div>
              )}
            </div>

            <button onClick={() => store.setPersonalPhoto(null)} className="w-full py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-all border border-red-100">
              إزالة الصورة
            </button>
          </div>
        )}
      </div>
    )

    if (activePanel === 'text') return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 animate-fadeIn xl:border-0 xl:p-0 xl:rounded-none">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700">النص الرئيسي</label>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{store.fontSize}px</span>
          </div>
          <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 text-sm resize-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all outline-none" rows={2} dir="rtl" placeholder="عيد مبارك..." />
          <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} className="w-full accent-blue-600 h-1" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700">النص الفرعي</label>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{store.subFontSize}px</span>
          </div>
          <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 text-sm resize-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all outline-none" rows={2} dir="rtl" placeholder="كل عام وأنتم بخير" />
          <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} className="w-full accent-blue-600 h-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">المُستلِم</label>
            <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)} onFocus={() => store.setActiveElement('recipientName')}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all outline-none" dir="rtl" placeholder="أم فهد" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">المُرسِل</label>
            <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)} onFocus={() => store.setActiveElement('senderName')}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 focus:bg-white transition-all outline-none" dir="rtl" placeholder="اسمك" />
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><BsChatLeftText className="text-blue-500" /> نصوص جاهزة</h3>
          <div className="relative">
            <BsSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-8 pl-3 py-2 text-gray-900 text-xs focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 outline-none transition-all placeholder-gray-400" dir="rtl" placeholder="ابحث..." />
          </div>
          <div className="space-y-1 max-h-44 overflow-y-auto custom-scrollbar">
            {filteredTexts.map((t) => (
              <button key={t.id} onClick={() => {
                store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 60))
                store.setSubText(t.text.length > 60 ? t.text.substring(60, 120) : '')
                toast.success('تم تحديد النص')
              }}
                className="w-full text-right p-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 text-[11px] leading-relaxed transition-all border border-gray-100 hover:border-blue-200" dir="rtl"
              >
                {t.text.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    )

    if (activePanel === 'style') return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5 animate-fadeIn xl:border-0 xl:p-0 xl:rounded-none">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">الخط</label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {fonts.map(f => (
              <button key={f.id} onClick={() => store.setFont(f.id)}
                className={`shrink-0 px-3.5 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${store.selectedFont === f.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                style={{ fontFamily: f.family }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700">ألوان النصوص</label>
          <div className="space-y-2.5">
            <ColorRow value={store.textColor} onChange={store.setTextColor} label="الرئيسي" />
            <ColorRow value={store.subTextColor} onChange={store.setSubTextColor} label="الفرعي" />
            <ColorRow value={store.recipientColor} onChange={store.setRecipientColor} label="المستلِم" />
            <ColorRow value={store.senderColor} onChange={store.setSenderColor} label="المُرسِل" />
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700">تأثيرات</label>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-700">ظل</span>
            <button onClick={() => store.setTextShadow(!store.textShadow)} className={`w-10 rounded-full transition-all relative ${store.textShadow ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: 40, height: 22 }}>
              <div className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all shadow-sm ${store.textShadow ? 'right-[2px]' : 'right-[20px]'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-700">حدود</span>
            <button onClick={() => store.setTextStroke(!store.textStroke)} className={`w-10 rounded-full transition-all relative ${store.textStroke ? 'bg-blue-600' : 'bg-gray-300'}`} style={{ width: 40, height: 22 }}>
              <div className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all shadow-sm ${store.textStroke ? 'right-[2px]' : 'right-[20px]'}`} />
            </button>
          </div>
          {store.textStroke && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-500 flex justify-between">سمك <span>{store.textStrokeWidth}px</span></label>
                <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <ColorRow value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="اللون" />
            </div>
          )}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">طبقة خلفية</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{Math.round(store.overlayOpacity * 100)}%</span>
            </div>
            <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex gap-1.5">
              {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                <button key={c} onClick={() => store.setOverlayColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all ${store.overlayColor === c ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent scale-110' : 'border-gray-200 hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )

    return null
  }
}
