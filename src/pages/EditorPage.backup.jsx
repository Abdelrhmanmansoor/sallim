import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva'
import { useEditorStore } from '../store'
import { templates, fonts } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { BsDownload, BsFilePdf, BsTextLeft, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2, BsSliders, BsArrowsMove, BsChevronDown } from 'react-icons/bs'
import { HiPhotograph } from 'react-icons/hi'
import toast, { Toaster } from 'react-hot-toast'

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
      text={text}
      x={x}
      y={y}
      width={width}
      align={align || 'center'}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fill={fill}
      opacity={opacity || 1}
      lineHeight={lineHeight || 1.5}
      padding={padding || 0}
      wrap="word"
      rotation={rotation || 0}
      draggable
      shadowColor={shadowEnabled ? (shadowColor || 'rgba(0,0,0,0.6)') : undefined}
      shadowBlur={shadowEnabled ? (shadowBlur || 8) : 0}
      stroke={strokeEnabled ? stroke : undefined}
      strokeWidth={strokeEnabled ? strokeWidth : 0}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onTap={onClick}
      shadowEnabled={shadowEnabled}
    />
  )
}

/* ═══ Color picker row ═══ */
const quickColors = ['#ffffff', '#000000', '#2563eb', '#3b82f6', '#fbbf24', '#ef4444', '#4ade80', '#f472b6', '#93c5fd', '#c4b5fd', '#f97316', '#14b8a6']

function ColorRow({ value, onChange, label }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <div className="flex gap-1.5 flex-wrap items-center">
        {quickColors.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-full border transition-all ${value === c ? 'ring-2 ring-[#3b82f6] scale-110 border-white/40' : 'border-white/10 hover:scale-105'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-6 h-6 rounded-full cursor-pointer border-0" />
      </div>
    </div>
  )
}

export default function EditorPage() {
  const store = useEditorStore()
  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const [sections, setSections] = useState({ templates: true, text: true, style: false, advanced: false })
  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }))
  const [stageSize, setStageSize] = useState({ width: 540, height: 540 })
  const [searchText, setSearchText] = useState('')
  const [customTemplates, setCustomTemplates] = useState([])

  // Load custom templates from localStorage
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

  // Load background image
  const [bgImage, bgLoaded] = useImage(currentTemplate?.image)

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
    } catch (e) {
      toast.error('حدث خطأ أثناء التصدير')
    }
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
    } catch (e) {
      toast.error('حدث خطأ أثناء تصدير PDF')
    }
  }, [])

  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const getCanvasDataURL = useCallback(() => {
    if (!stageRef.current) return null
    return stageRef.current.toDataURL({ pixelRatio: 4 })
  }, [])

  const handleShareWhatsApp = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      // Convert data URL to blob for sharing
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'بطاقة تهنئة العيد',
          text: 'عيد مبارك وكل عام وأنتم بخير',
        })
        toast.success('تم فتح المشاركة!')
      } else {
        // Fallback: open WhatsApp with text only
        const text = encodeURIComponent('عيد مبارك وكل عام وأنتم بخير — صمّ بطاقتك من سَلِّم')
        window.open(`https://wa.me/?text=${text}`, '_blank')
        toast.success('تم فتح واتساب!')
      }
    } catch (e) {
      toast.error('حدث خطأ أثناء المشاركة')
    }
  }, [getCanvasDataURL])

  const handleCopyImage = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      toast.success('تم نسخ البطاقة!')
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      toast.error('المتصفح لا يدعم نسخ الصور — حمّل البطاقة بدلاً من ذلك')
    }
  }, [getCanvasDataURL])

  const handleShareNative = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'بطاقة تهنئة العيد',
          text: 'عيد مبارك وكل عام وأنتم بخير',
        })
      } else {
        setShowShareMenu(prev => !prev)
      }
    } catch (e) {
      setShowShareMenu(prev => !prev)
    }
  }, [getCanvasDataURL])

  const filteredTexts = greetingTexts.filter(t =>
    !searchText || t.text.includes(searchText) || t.tags.some(tag => tag.includes(searchText))
  ).slice(0, 15)

  // Drag handlers — persist normalized 0-1 positions
  // The rendering formula is: x = pos.x * width - width * 0.4
  // So we reverse it: pos.x = (node.x() + width * 0.4) / width
  const handleDrag = (setter) => (e) => {
    const node = e.target
    setter({
      x: (node.x() + stageSize.width * 0.4) / stageSize.width,
      y: node.y() / stageSize.height,
    })
  }

  const handleElementClick = (elementName) => () => {
    store.setActiveElement(elementName)
    setActiveTab('text')
  }

  // Arrow key precise movement — 1px per press, 5px with Shift
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
        if (e.key === 'ArrowLeft') pos.x += step  // RTL: left = increase x
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

  const resetPositions = () => {
    store.setMainTextPos({ x: 0.5, y: 0.35 })
    store.setSubTextPos({ x: 0.5, y: 0.55 })
    store.setRecipientPos({ x: 0.5, y: 0.75 })
    store.setSenderPos({ x: 0.5, y: 0.85 })
    store.setMainTextRotation(0)
    store.setSubTextRotation(0)
    toast.success('تم إعادة المواقع الافتراضية')
  }

  const moveElement = (dir) => {
    const posMap = {
      mainText: [store.mainTextPos, store.setMainTextPos],
      subText: [store.subTextPos, store.setSubTextPos],
      senderName: [store.senderPos, store.setSenderPos],
      recipientName: [store.recipientPos, store.setRecipientPos],
    }
    const entry = posMap[store.activeElement]
    if (!entry) return
    const [pos, set] = entry
    const step = 2 / stageSize.width
    const next = { ...pos }
    if (dir === 'up') next.y = Math.max(0, pos.y - step)
    if (dir === 'down') next.y = Math.min(1, pos.y + step)
    if (dir === 'right') next.x = Math.min(1, pos.x + step)
    if (dir === 'left') next.x = Math.max(0, pos.x - step)
    set(next)
  }

  const SectionHeader = ({ sectionKey, number, title, badge, icon }) => (
    <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        {number ? (
          <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">{number}</span>
        ) : (
          <span className="text-gray-400">{icon}</span>
        )}
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        {badge}
      </div>
      <BsChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${sections[sectionKey] ? 'rotate-180' : ''}`} />
    </button>
  )

  return (
    <div className="page-shell pb-10 w-full bg-gray-50/50 min-h-screen relative z-10">
      <Toaster position="top-center" toastOptions={{ style: { background: '#ffffff', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '12px' } }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center pt-6 sm:pt-10 mb-8 sm:mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">محرر البطاقات</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">صمّم بطاقتك بثلاث خطوات بسيطة</p>
        </div>

        <div className="flex flex-col xl:flex-row-reverse gap-8 items-start">

          {/* ═══════════════ CANVAS PREVIEW (sticky on desktop) ═══════════════ */}
          <div className="w-full xl:w-[500px] shrink-0 xl:sticky xl:top-24 order-1 xl:order-none">
            <div className="space-y-6">
              <div ref={containerRef} className="w-full max-w-[500px] mx-auto">
                <div className="bg-white rounded-[24px] p-3 sm:p-4 shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5 relative">
                  <div className="absolute top-6 inset-x-0 mx-auto w-fit z-20 bg-blue-600/95 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full pointer-events-none flex items-center gap-2 shadow-lg shadow-blue-900/20 animate-pulse">
                    <BsArrowsMove className="text-sm" /> اسحب أي نص لتغيير مكانه بحرية
                  </div>
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} className="rounded-xl overflow-hidden mx-auto cursor-grab active:cursor-grabbing">
                    <Layer>
                      <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                      {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                      {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                      {!bgLoaded && (
                        <Text text="اختر قالباً للبدء" x={0} y={stageSize.height * 0.45} width={stageSize.width} align="center" fontFamily="'Cairo', sans-serif" fontSize={18 * scale} fill="#555" lineHeight={1.8} />
                      )}
                      <DraggableText text={store.mainText} x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.mainTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.fontSize * scale} fontFamily={currentFont.family} fill={store.textColor} align="center" lineHeight={1.6} padding={20 * scale} rotation={store.mainTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.6)" shadowBlur={10 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale} onDragEnd={handleDrag(store.setMainTextPos)} onClick={handleElementClick('mainText')} />
                      <DraggableText text={store.subText} x={store.subTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.subTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.subFontSize * scale} fontFamily={currentFont.family} fill={store.subTextColor} align="center" lineHeight={1.5} padding={15 * scale} rotation={store.subTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={8 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.7} onDragEnd={handleDrag(store.setSubTextPos)} onClick={handleElementClick('subText')} />
                      <DraggableText text={store.recipientName} x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4} y={store.recipientPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={22 * scale} fontFamily={currentFont.family} fill={store.recipientColor} align="center" shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={6 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.5} onDragEnd={handleDrag(store.setRecipientPos)} onClick={handleElementClick('recipientName')} />
                      <DraggableText text={store.senderName} x={store.senderPos.x * stageSize.width - stageSize.width * 0.4} y={store.senderPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={18 * scale} fontFamily={currentFont.family} fill={store.senderColor} align="center" opacity={0.85} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.4)" shadowBlur={5 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.4} onDragEnd={handleDrag(store.setSenderPos)} onClick={handleElementClick('senderName')} />
                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 justify-center flex-wrap max-w-[500px] mx-auto px-2">
                <button onClick={handleExportPNG} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
                  <BsDownload /> تحميل PNG
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                  <BsFilePdf /> PDF
                </button>
                <button onClick={handleShareWhatsApp} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#128C7E] text-sm font-medium hover:bg-[#25D366]/20 transition-all">
                  <BsWhatsapp className="text-lg" />
                </button>
                <button onClick={handleCopyImage} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                  {copied ? <BsCheck2 className="text-emerald-500" /> : <BsLink45Deg className="text-gray-500" />}
                  {copied ? 'تم!' : 'نسخ'}
                </button>
                <div className="relative">
                  <button onClick={handleShareNative} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
                    <BsShareFill className="text-gray-500" />
                  </button>
                  {showShareMenu && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white rounded-xl p-2 min-w-[140px] space-y-1 z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
                      <button onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('عيد مبارك')}&url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-600 font-medium hover:text-blue-500 p-2.5 rounded-lg hover:bg-blue-50 transition-colors">تويتر</button>
                      <button onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-600 font-medium hover:text-blue-700 p-2.5 rounded-lg hover:bg-blue-50 transition-colors">فيسبوك</button>
                      <button onClick={() => { window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('عيد مبارك')}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-600 font-medium hover:text-blue-400 p-2.5 rounded-lg hover:bg-blue-50 transition-colors">تليجرام</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ EDITING PANEL ═══════════════ */}
          <div className="flex-1 min-w-0 space-y-4 xl:space-y-5 order-2 xl:order-none">

            {/* ── Section 1: Templates ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-right">
              <SectionHeader sectionKey="templates" number="١" title="اختر القالب"
                badge={store.selectedTemplate && <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">✓ تم الاختيار</span>}
              />
              {sections.templates && (
                <div className="px-5 pb-5 pt-2 space-y-4">
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-4 relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative z-10 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex flex-shrink-0 items-center justify-center text-blue-600">
                        <HiPhotograph className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-0.5">هل لديك تصميم خاص؟</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">ارفع أي صورة من جهازك واستخدمها كخلفية لبطاقتك بكل سهولة</p>
                      </div>
                    </div>
                    <label className="flex items-center justify-center gap-2 w-full bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 text-sm font-bold py-3 rounded-xl transition-all cursor-pointer relative z-10">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleTemplateUpload} />
                      <HiPhotograph className="text-lg" />
                      اختيار صورة من الجهاز
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {allTemplates.map((t) => (
                      <button key={t.id} onClick={() => store.setTemplate(t.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:-translate-y-1 ${store.selectedTemplate === t.id ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 scale-100' : 'ring-1 ring-gray-200 shadow-sm hover:shadow-md'
                          }`}
                      >
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover bg-gray-100" onError={(e) => { e.target.closest('button').style.display = 'none' }} />
                        {t.isCustom && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomTemplate(t.id) }} className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-red-500/90 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow-sm z-10 transition-colors" aria-label={`حذف ${t.name}`}>×</button>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/80 to-transparent pt-6 pb-2 px-2">
                          <span className="text-[10px] text-white font-medium truncate block text-center drop-shadow-md">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 2: Text ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-right">
              <SectionHeader sectionKey="text" number="٢" title="اكتب تهنئتك" />
              {sections.text && (
                <div className="px-5 pb-5 pt-2 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                      النص الرئيسي <span className="text-gray-400 text-xs font-normal bg-gray-100 px-2 py-0.5 rounded-md">{store.fontSize}px</span>
                    </label>
                    <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 text-sm resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" rows={2} dir="rtl" placeholder="عيد مبارك..." />
                    <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} className="w-full accent-blue-600 h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                      النص الفرعي <span className="text-gray-400 text-xs font-normal bg-gray-100 px-2 py-0.5 rounded-md">{store.subFontSize}px</span>
                    </label>
                    <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 text-sm resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" rows={2} dir="rtl" placeholder="كل عام وأنتم بخير" />
                    <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} className="w-full accent-blue-600 h-1.5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 block">اسم المُستلِم</label>
                      <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)} onFocus={() => store.setActiveElement('recipientName')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" dir="rtl" placeholder="مثلاً: أم فهد" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 block">اسم المُرسِل (أنت)</label>
                      <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)} onFocus={() => store.setActiveElement('senderName')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" dir="rtl" placeholder="اسمك" />
                    </div>
                  </div>
                  {/* Ready-made texts */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3 mt-4 mb-2">
                    <BsArrowsMove className="text-blue-500 flex-shrink-0 text-xl mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      <strong className="text-blue-900 block mb-1">تلميحة احترافية:</strong>
                      يمكنك سحب أي نص على البطاقة وتحريكه عبر الماوس أو اللمس لوضعه في المكان الذي تراه مناسباً.
                    </p>
                  </div>

                  <details className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <summary className="cursor-pointer text-sm text-gray-700 font-bold flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors select-none">
                      <div className="flex items-center gap-2">
                        <BsTextLeft className="text-gray-400 text-lg" /> نصوص جاهزة للتهنئة
                      </div>
                      <BsChevronDown className="text-xs text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="p-3.5 border-t border-gray-100 space-y-3 bg-gray-50/50">
                      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-gray-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400" dir="rtl" placeholder="البحث في النصوص الجاهزة..." />
                      <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {filteredTexts.map((t) => (
                          <button key={t.id} onClick={() => { store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 40)); store.setSubText(t.text.length > 40 ? t.text.substring(40) : ''); toast.success('تم إدراج النص بنجاح') }} className="w-full text-right p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-gray-600 text-[11px] leading-relaxed transition-all shadow-sm" dir="rtl">
                            {t.text.substring(0, 80)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              )}
            </div>

            {/* ── Section 3: Style ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-right">
              <SectionHeader sectionKey="style" number="٣" title="تخصيص الخيارات"
                badge={<span className="text-[10px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">اختياري</span>}
              />
              {sections.style && (
                <div className="px-5 pb-5 pt-2 space-y-6">
                  {/* Font Picker — horizontal strip */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block">اختيار الخط</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar -mx-2 px-2">
                      {fonts.map(f => (
                        <button key={f.id} onClick={() => store.setFont(f.id)}
                          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all shadow-sm ${store.selectedFont === f.id ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500 font-bold' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          style={{ fontFamily: f.family }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Colors */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block">ألوان النصوص</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <ColorRow value={store.textColor} onChange={store.setTextColor} label="النص الرئيسي" />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <ColorRow value={store.subTextColor} onChange={store.setSubTextColor} label="النص الفرعي" />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <ColorRow value={store.recipientColor} onChange={store.setRecipientColor} label="اسم المستلِم" />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <ColorRow value={store.senderColor} onChange={store.setSenderColor} label="اسم المُرسِل" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Quick Effects */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 block">تأثيرات إضافية (اختياري)</label>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                      <span className="text-sm font-medium text-gray-700">ظلال للنصوص <span className="text-xs text-gray-400 block font-normal mt-0.5">يزيد من وضوح النص على الخلفيات المزدحمة</span></span>
                      <button onClick={() => store.setTextShadow(!store.textShadow)} className={`w-11 h-6 rounded-full transition-all relative shadow-inner ${store.textShadow ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${store.textShadow ? 'right-0.5' : 'right-[22px]'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                      <span className="text-sm font-medium text-gray-700">حدود خارجية (Stroke)</span>
                      <button onClick={() => store.setTextStroke(!store.textStroke)} className={`w-11 h-6 rounded-full transition-all relative shadow-inner ${store.textStroke ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${store.textStroke ? 'right-0.5' : 'right-[22px]'}`} />
                      </button>
                    </div>
                    {store.textStroke && (
                      <div className="pr-3 pl-3 py-3 bg-gray-50/50 rounded-xl border border-gray-100 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600 flex justify-between">سمك الحدود <span>{store.textStrokeWidth}px</span></label>
                          <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                        <ColorRow value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="لون الحدود" />
                      </div>
                    )}
                    {/* Background overlay */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 block">تعتيم الخلفية (فلتر)</span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">{Math.round(store.overlayOpacity * 100)}%</span>
                      </div>
                      <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} className="w-full accent-blue-500" />
                      <div className="flex gap-2">
                        {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                          <button key={c} onClick={() => store.setOverlayColor(c)} className={`w-7 h-7 rounded-full border shadow-sm transition-all ${store.overlayColor === c ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent scale-110' : 'border-gray-200 hover:scale-105'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 4: Advanced ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-right mb-10">
              <SectionHeader sectionKey="advanced" title="تعديلات دقيقة (للمحترفين)" icon={<BsSliders className="text-lg text-gray-400" />} />
              {sections.advanced && (
                <div className="px-5 pb-5 pt-2 space-y-6">
                  {/* Rotation */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                    <label className="text-sm font-bold text-gray-700 block text-center mb-1 border-b border-gray-200 pb-2">زاوية الدوران</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-center">
                        <span className="text-xs font-medium text-gray-600 block mb-1">النص الرئيسي <span className="text-blue-600" dir="ltr">{store.mainTextRotation}°</span></span>
                        <input type="range" min={-45} max={45} value={store.mainTextRotation} onChange={(e) => store.setMainTextRotation(Number(e.target.value))} className="w-full accent-blue-500" />
                      </div>
                      <div className="space-y-1 text-center">
                        <span className="text-xs font-medium text-gray-600 block mb-1">النص الفرعي <span className="text-blue-600" dir="ltr">{store.subTextRotation}°</span></span>
                        <input type="range" min={-45} max={45} value={store.subTextRotation} onChange={(e) => store.setSubTextRotation(Number(e.target.value))} className="w-full accent-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Precise movement */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4 text-center">
                    <label className="text-sm font-bold text-gray-700 block mb-1 border-b border-gray-200 pb-2">تحريك دقيق للأسهم</label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { key: 'mainText', label: 'النص الرئيسي' },
                        { key: 'subText', label: 'النص الفرعي' },
                        { key: 'recipientName', label: 'المستلِم' },
                        { key: 'senderName', label: 'الوُرسِل' },
                      ].map(el => (
                        <button key={el.key} onClick={() => store.setActiveElement(el.key)}
                          className={`p-2.5 rounded-lg text-xs font-bold transition-all ${store.activeElement === el.key ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300 shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >{el.label}</button>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <div className="grid grid-cols-3 gap-2 w-fit">
                        <div />
                        <button onClick={() => moveElement('up')} className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all flex items-center justify-center">↑</button>
                        <div />
                        <button onClick={() => moveElement('right')} className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all flex items-center justify-center">→</button>
                        <button onClick={() => moveElement('down')} className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all flex items-center justify-center">↓</button>
                        <button onClick={() => moveElement('left')} className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 text-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all flex items-center justify-center">←</button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-2">💡 يمكنك استخدام أسهم الكيبورد للتحريك أيضاً (اضغط Shift للسرعة)</p>
                  </div>

                  {/* Reset */}
                  <button onClick={resetPositions} className="w-full p-3.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 mt-4">
                    <BsArrowsMove /> إعادة النصوص لأماكنها الأصلية
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}
