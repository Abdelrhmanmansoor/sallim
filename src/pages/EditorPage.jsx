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
    } catch {}
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
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && !e.target.closest('input, textarea')) {
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
    <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3">
        {number ? (
          <span className="w-7 h-7 rounded-lg bg-[#2563eb]/15 text-[#3b82f6] flex items-center justify-center font-bold text-xs">{number}</span>
        ) : (
          <span className="text-gray-500">{icon}</span>
        )}
        <span className="font-bold text-white text-sm">{title}</span>
        {badge}
      </div>
      <BsChevronDown className={`text-gray-500 text-xs transition-transform duration-200 ${sections[sectionKey] ? 'rotate-180' : ''}`} />
    </button>
  )

  return (
    <div className="page-shell pb-10 w-full">
      <Toaster position="top-center" toastOptions={{ style: { background: '#111827', color: '#f0f0f0', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '12px' } }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center pt-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-white">محرر البطاقات</h1>
          <p className="text-gray-500 text-sm mt-1">صمّم بطاقتك بثلاث خطوات بسيطة</p>
        </div>

        <div className="flex flex-col xl:flex-row-reverse gap-6 items-start">

          {/* ═══════════════ CANVAS PREVIEW (sticky on desktop) ═══════════════ */}
          <div className="w-full xl:w-[480px] shrink-0">
            <div className="xl:sticky xl:top-20 space-y-4">
              <div ref={containerRef} className="w-full max-w-[480px] mx-auto">
                <div className="bg-[#111827] rounded-2xl p-2.5 ring-1 ring-white/10 relative">
                  <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5">
                    <BsArrowsMove className="text-xs" /> اسحب النصوص
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
              <div className="flex gap-2 justify-center flex-wrap max-w-[480px] mx-auto">
                <button onClick={handleExportPNG} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] transition-all">
                  <BsDownload /> تحميل PNG
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all">
                  <BsFilePdf /> PDF
                </button>
                <button onClick={handleShareWhatsApp} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600/15 ring-1 ring-green-500/20 text-green-400 text-sm font-medium hover:bg-green-600/25 transition-all">
                  <BsWhatsapp />
                </button>
                <button onClick={handleCopyImage} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all">
                  {copied ? <BsCheck2 className="text-green-400" /> : <BsLink45Deg />}
                  {copied ? 'تم!' : 'نسخ'}
                </button>
                <div className="relative">
                  <button onClick={handleShareNative} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all">
                    <BsShareFill />
                  </button>
                  {showShareMenu && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1e293b] rounded-xl p-2 min-w-[130px] space-y-0.5 z-50 ring-1 ring-white/10 shadow-xl">
                      <button onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('عيد مبارك')}&url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">تويتر</button>
                      <button onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">فيسبوك</button>
                      <button onClick={() => { window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('عيد مبارك')}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-xs text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">تليجرام</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════ EDITING PANEL ═══════════════ */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* ── Section 1: Templates ── */}
            <div className="bg-[#111827] rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <SectionHeader sectionKey="templates" number="١" title="اختر القالب"
                badge={store.selectedTemplate && <span className="text-[11px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">✓</span>}
              />
              {sections.templates && (
                <div className="px-4 pb-4 space-y-3">
                  <label className="block border border-dashed border-white/10 rounded-xl p-3 text-center hover:border-[#2563eb]/30 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleTemplateUpload} />
                    <p className="text-gray-500 text-xs"><HiPhotograph className="inline text-base ml-1" /> ارفع صورك الخاصة</p>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {allTemplates.map((t) => (
                      <button key={t.id} onClick={() => store.setTemplate(t.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 ${
                          store.selectedTemplate === t.id ? 'ring-2 ring-[#2563eb] shadow-lg shadow-[#2563eb]/20' : 'ring-1 ring-white/10'
                        }`}
                      >
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                        <div className="absolute inset-0 bg-gray-800 items-center justify-center text-gray-500 text-[10px] text-center p-1 hidden">{t.name}</div>
                        {t.isCustom && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomTemplate(t.id) }} className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center hover:bg-red-500 z-10" aria-label={`حذف ${t.name}`}>×</button>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5">
                          <span className="text-[9px] text-white truncate block text-center">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 2: Text ── */}
            <div className="bg-[#111827] rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <SectionHeader sectionKey="text" number="٢" title="اكتب تهنئتك" />
              {sections.text && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">النص الرئيسي <span className="text-gray-600 mr-1">({store.fontSize}px)</span></label>
                    <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#2563eb]/50 focus:outline-none transition-colors" rows={2} dir="rtl" placeholder="عيد مبارك..." />
                    <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} className="w-full accent-[#2563eb] h-1.5 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">النص الفرعي <span className="text-gray-600 mr-1">({store.subFontSize}px)</span></label>
                    <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#2563eb]/50 focus:outline-none transition-colors" rows={2} dir="rtl" placeholder="كل عام وأنتم بخير" />
                    <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} className="w-full accent-[#2563eb] h-1.5 mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">اسم المُستلِم</label>
                      <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)} onFocus={() => store.setActiveElement('recipientName')} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-[#2563eb]/50 focus:outline-none transition-colors" dir="rtl" placeholder="مثلاً: أم فهد" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">اسم المُرسِل</label>
                      <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)} onFocus={() => store.setActiveElement('senderName')} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white text-sm focus:border-[#2563eb]/50 focus:outline-none transition-colors" dir="rtl" placeholder="اسمك" />
                    </div>
                  </div>
                  {/* Ready-made texts */}
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-[#3b82f6] font-bold flex items-center gap-1.5 select-none py-1 hover:text-[#60a5fa] transition-colors">
                      <BsTextLeft className="text-sm" /> نصوص جاهزة
                      <BsChevronDown className="text-[10px] text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 space-y-1.5">
                      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:border-[#2563eb]/50 focus:outline-none" dir="rtl" placeholder="ابحث في النصوص..." />
                      <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {filteredTexts.map((t) => (
                          <button key={t.id} onClick={() => { store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 40)); store.setSubText(t.text.length > 40 ? t.text.substring(40) : ''); toast.success('تم تحديد النص') }} className="w-full text-right p-2 rounded-lg bg-white/5 hover:bg-[#2563eb]/10 text-gray-300 text-[11px] leading-relaxed transition-all" dir="rtl">
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
            <div className="bg-[#111827] rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <SectionHeader sectionKey="style" number="٣" title="تخصيص الشكل"
                badge={<span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">اختياري</span>}
              />
              {sections.style && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Font Picker — horizontal strip */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">الخط</label>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                      {fonts.map(f => (
                        <button key={f.id} onClick={() => store.setFont(f.id)}
                          className={`shrink-0 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                            store.selectedFont === f.id ? 'bg-[#2563eb]/20 text-[#3b82f6] ring-1 ring-[#2563eb]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                          style={{ fontFamily: f.family }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-400 block">ألوان النصوص</label>
                    <ColorRow value={store.textColor} onChange={store.setTextColor} label="النص الرئيسي" />
                    <ColorRow value={store.subTextColor} onChange={store.setSubTextColor} label="النص الفرعي" />
                    <ColorRow value={store.recipientColor} onChange={store.setRecipientColor} label="اسم المستلِم" />
                    <ColorRow value={store.senderColor} onChange={store.setSenderColor} label="اسم المُرسِل" />
                  </div>

                  {/* Quick Effects */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">تأثيرات</label>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
                      <span className="text-xs text-gray-300">ظل النصوص</span>
                      <button onClick={() => store.setTextShadow(!store.textShadow)} className={`w-10 h-5 rounded-full transition-all relative ${store.textShadow ? 'bg-[#2563eb]' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${store.textShadow ? 'right-0.5' : 'right-[18px]'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
                      <span className="text-xs text-gray-300">حدود النص</span>
                      <button onClick={() => store.setTextStroke(!store.textStroke)} className={`w-10 h-5 rounded-full transition-all relative ${store.textStroke ? 'bg-[#2563eb]' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${store.textStroke ? 'right-0.5' : 'right-[18px]'}`} />
                      </button>
                    </div>
                    {store.textStroke && (
                      <div className="pr-2 space-y-2">
                        <div>
                          <label className="text-[11px] text-gray-500 block mb-1">سمك الحدود: {store.textStrokeWidth}</label>
                          <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                        </div>
                        <ColorRow value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="لون الحدود" />
                      </div>
                    )}
                    {/* Background overlay */}
                    <div className="p-2.5 rounded-lg bg-white/[0.03] space-y-2">
                      <span className="text-xs text-gray-300 block">طبقة خلفية: {Math.round(store.overlayOpacity * 100)}%</span>
                      <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      <div className="flex gap-1.5">
                        {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                          <button key={c} onClick={() => store.setOverlayColor(c)} className={`w-6 h-6 rounded-full border transition-all ${store.overlayColor === c ? 'ring-2 ring-[#2563eb] border-white/30' : 'border-white/10'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 4: Advanced ── */}
            <div className="bg-[#111827] rounded-2xl ring-1 ring-white/10 overflow-hidden">
              <SectionHeader sectionKey="advanced" title="خيارات متقدمة" icon={<BsSliders className="text-sm" />} />
              {sections.advanced && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Rotation */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">تدوير النصوص</label>
                    <div>
                      <span className="text-[11px] text-gray-500">الرئيسي: {store.mainTextRotation}°</span>
                      <input type="range" min={-45} max={45} value={store.mainTextRotation} onChange={(e) => store.setMainTextRotation(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-500">الفرعي: {store.subTextRotation}°</span>
                      <input type="range" min={-45} max={45} value={store.subTextRotation} onChange={(e) => store.setSubTextRotation(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                    </div>
                  </div>

                  {/* Precise movement */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">تحريك دقيق — {{ mainText: 'النص الرئيسي', subText: 'النص الفرعي', recipientName: 'اسم المستلم', senderName: 'اسم المرسل' }[store.activeElement]}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'mainText', label: 'النص الرئيسي' },
                        { key: 'subText', label: 'النص الفرعي' },
                        { key: 'recipientName', label: 'المستلِم' },
                        { key: 'senderName', label: 'المُرسِل' },
                      ].map(el => (
                        <button key={el.key} onClick={() => store.setActiveElement(el.key)}
                          className={`p-2 rounded-lg text-xs font-medium transition-all ${
                            store.activeElement === el.key ? 'bg-[#2563eb]/20 text-[#3b82f6] ring-1 ring-[#2563eb]/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >{el.label}</button>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <div className="grid grid-cols-3 gap-1.5 w-fit">
                        <div />
                        <button onClick={() => moveElement('up')} className="w-9 h-9 rounded-lg bg-white/10 text-white text-sm hover:bg-[#2563eb]/30 transition-all flex items-center justify-center">↑</button>
                        <div />
                        <button onClick={() => moveElement('right')} className="w-9 h-9 rounded-lg bg-white/10 text-white text-sm hover:bg-[#2563eb]/30 transition-all flex items-center justify-center">→</button>
                        <button onClick={() => moveElement('down')} className="w-9 h-9 rounded-lg bg-white/10 text-white text-sm hover:bg-[#2563eb]/30 transition-all flex items-center justify-center">↓</button>
                        <button onClick={() => moveElement('left')} className="w-9 h-9 rounded-lg bg-white/10 text-white text-sm hover:bg-[#2563eb]/30 transition-all flex items-center justify-center">←</button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-[10px] text-center">أو استخدم مفاتيح الأسهم (Shift للتحريك الأسرع)</p>
                  </div>

                  {/* Logo upload */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block">شعار / صورة</label>
                    <label className="block border border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#2563eb]/30 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => { store.setLogoImage(ev.target.result); toast.success('تم رفع الشعار') }
                          reader.readAsDataURL(file)
                        }
                      }} />
                      <HiPhotograph className="text-2xl text-gray-500 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">اضغط لرفع شعار</p>
                    </label>
                    {store.logoImage && (
                      <div className="relative">
                        <img src={store.logoImage} alt="Logo" className="w-full h-24 object-contain rounded-xl bg-white/5 p-3" />
                        <button onClick={() => store.setLogoImage(null)} className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center hover:bg-red-500">×</button>
                      </div>
                    )}
                  </div>

                  {/* Reset */}
                  <button onClick={resetPositions} className="w-full p-2.5 rounded-xl bg-white/5 text-gray-400 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <BsArrowsMove /> إعادة ضبط المواقع
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
