import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva'
import { useEditorStore } from '../store'
import { templates, fonts } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { BsDownload, BsFilePdf, BsPalette, BsFonts, BsImage, BsTextLeft, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2, BsSliders, BsArrowsMove } from 'react-icons/bs'
import { HiTemplate, HiPhotograph } from 'react-icons/hi'
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

function TabButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
        active ? 'bg-[#2563eb]/20 text-[#3b82f6] shadow-inner shadow-[#2563eb]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
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
  const [activeTab, setActiveTab] = useState('templates')
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
  const handleDrag = (setter) => (e) => {
    const node = e.target
    setter({
      x: node.x() / stageSize.width,
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

  return (
    <div className="page-shell pb-10 px-4 w-full">
      <Toaster position="top-center" toastOptions={{ style: { background: '#17012C', color: '#f0f0f0', border: '1px solid rgba(106,71,237,0.3)' } }} />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-black mb-2">
            <span className="gradient-gold-text">محرر البطاقات</span>
          </h1>
          <p className="text-gray-400 text-sm">اسحب النصوص لتحريكها — أو استخدم الأسهم ⬆️⬇️⬅️➡️ للتحريك الدقيق</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ═══ CANVAS ═══ */}
          <div className="flex-1 flex flex-col items-center">
            <div ref={containerRef} className="w-full max-w-[540px]">
              <div className="glass rounded-2xl p-3 mb-4 relative">
                {/* Drag hint badge */}
                <div className="absolute top-4 right-4 z-20 bg-[#2563eb]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <BsArrowsMove className="text-[#3b82f6]" /> اسحب أو استخدم الأسهم
                </div>

                <Stage
                  ref={stageRef}
                  width={stageSize.width}
                  height={stageSize.height}
                  className="rounded-xl overflow-hidden mx-auto cursor-grab active:cursor-grabbing"
                >
                  <Layer>
                    <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />

                    {bgImage && bgLoaded && (
                      <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />
                    )}

                    {/* Dark overlay for contrast */}
                    {store.overlayOpacity > 0 && (
                      <Rect
                        width={stageSize.width}
                        height={stageSize.height}
                        fill={store.overlayColor}
                        opacity={store.overlayOpacity}
                      />
                    )}

                    {!bgLoaded && (
                      <Text
                        text={"اختر قالباً من القائمة\nأو ارفع صورة خلفية"}
                        x={0}
                        y={stageSize.height * 0.38}
                        width={stageSize.width}
                        align="center"
                        fontFamily="'Cairo', sans-serif"
                        fontSize={18 * scale}
                        fill="#666"
                        lineHeight={1.8}
                      />
                    )}

                    {/* Main Text — Draggable */}
                    <DraggableText
                      text={store.mainText}
                      x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4}
                      y={store.mainTextPos.y * stageSize.height}
                      width={stageSize.width * 0.8}
                      fontSize={store.fontSize * scale}
                      fontFamily={currentFont.family}
                      fill={store.textColor}
                      align="center"
                      lineHeight={1.6}
                      padding={20 * scale}
                      rotation={store.mainTextRotation}
                      shadowEnabled={store.textShadow}
                      shadowColor="rgba(0,0,0,0.6)"
                      shadowBlur={10 * scale}
                      strokeEnabled={store.textStroke}
                      stroke={store.textStrokeColor}
                      strokeWidth={store.textStrokeWidth * scale}
                      onDragEnd={handleDrag(store.setMainTextPos)}
                      onClick={handleElementClick('mainText')}
                    />

                    {/* Sub Text — Draggable */}
                    <DraggableText
                      text={store.subText}
                      x={store.subTextPos.x * stageSize.width - stageSize.width * 0.4}
                      y={store.subTextPos.y * stageSize.height}
                      width={stageSize.width * 0.8}
                      fontSize={store.subFontSize * scale}
                      fontFamily={currentFont.family}
                      fill={store.subTextColor}
                      align="center"
                      lineHeight={1.5}
                      padding={15 * scale}
                      rotation={store.subTextRotation}
                      shadowEnabled={store.textShadow}
                      shadowColor="rgba(0,0,0,0.5)"
                      shadowBlur={8 * scale}
                      strokeEnabled={store.textStroke}
                      stroke={store.textStrokeColor}
                      strokeWidth={store.textStrokeWidth * scale * 0.7}
                      onDragEnd={handleDrag(store.setSubTextPos)}
                      onClick={handleElementClick('subText')}
                    />

                    {/* Recipient — Draggable */}
                    <DraggableText
                      text={store.recipientName}
                      x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4}
                      y={store.recipientPos.y * stageSize.height}
                      width={stageSize.width * 0.8}
                      fontSize={22 * scale}
                      fontFamily={currentFont.family}
                      fill={store.recipientColor}
                      align="center"
                      shadowEnabled={store.textShadow}
                      shadowColor="rgba(0,0,0,0.5)"
                      shadowBlur={6 * scale}
                      strokeEnabled={store.textStroke}
                      stroke={store.textStrokeColor}
                      strokeWidth={store.textStrokeWidth * scale * 0.5}
                      onDragEnd={handleDrag(store.setRecipientPos)}
                      onClick={handleElementClick('recipientName')}
                    />

                    {/* Sender — Draggable */}
                    <DraggableText
                      text={store.senderName}
                      x={store.senderPos.x * stageSize.width - stageSize.width * 0.4}
                      y={store.senderPos.y * stageSize.height}
                      width={stageSize.width * 0.8}
                      fontSize={18 * scale}
                      fontFamily={currentFont.family}
                      fill={store.senderColor}
                      align="center"
                      opacity={0.85}
                      shadowEnabled={store.textShadow}
                      shadowColor="rgba(0,0,0,0.4)"
                      shadowBlur={5 * scale}
                      strokeEnabled={store.textStroke}
                      stroke={store.textStrokeColor}
                      strokeWidth={store.textStrokeWidth * scale * 0.4}
                      onDragEnd={handleDrag(store.setSenderPos)}
                      onClick={handleElementClick('senderName')}
                    />
                  </Layer>
                </Stage>
              </div>

              <div className="space-y-3">
                {/* Download Buttons */}
                <div className="flex gap-3 justify-center">
                  <button onClick={handleExportPNG} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563eb] text-white font-bold hover:shadow-lg hover:shadow-[#2563eb]/30 transition-all hover:scale-105">
                    <BsDownload /> تحميل PNG
                  </button>
                  <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#2563eb]/30 text-[#8B6CF6] font-medium hover:bg-[#2563eb]/10 transition-all hover:scale-105">
                    <BsFilePdf /> تحميل PDF
                  </button>
                </div>
                
                {/* Share Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={handleShareWhatsApp} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-600/30 transition-all hover:scale-105">
                    <BsWhatsapp /> واتساب
                  </button>
                  <button onClick={handleCopyImage} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all hover:scale-105">
                    {copied ? <BsCheck2 className="text-green-400" /> : <BsLink45Deg />}
                    {copied ? 'تم النسخ!' : 'نسخ الصورة'}
                  </button>
                  <div className="relative">
                    <button onClick={handleShareNative} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all hover:scale-105">
                      <BsShareFill /> مشاركة
                    </button>
                    {showShareMenu && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass rounded-xl p-3 min-w-[160px] space-y-2 z-50">
                        <button onClick={() => { const url = encodeURIComponent(window.location.href); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('عيد مبارك')}&url=${url}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                          تويتر
                        </button>
                        <button onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                          فيسبوك
                        </button>
                        <button onClick={() => { window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('عيد مبارك')}`, '_blank'); setShowShareMenu(false) }} className="w-full text-right text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                          تليجرام
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ CONTROL PANEL ═══ */}
          <div className="w-full lg:w-[420px]">
            <div className="glass rounded-2xl overflow-hidden sticky top-20">
              {/* Tabs */}
              <div className="flex overflow-x-auto gap-1 p-2 border-b border-white/5">
                <TabButton active={activeTab === 'templates'} icon={<HiTemplate />} label="القوالب" onClick={() => setActiveTab('templates')} />
                <TabButton active={activeTab === 'text'} icon={<BsTextLeft />} label="النصوص" onClick={() => setActiveTab('text')} />
                <TabButton active={activeTab === 'colors'} icon={<BsPalette />} label="الألوان" onClick={() => setActiveTab('colors')} />
                <TabButton active={activeTab === 'fonts'} icon={<BsFonts />} label="الخطوط" onClick={() => setActiveTab('fonts')} />
                <TabButton active={activeTab === 'effects'} icon={<BsSliders />} label="التأثيرات" onClick={() => setActiveTab('effects')} />
                <TabButton active={activeTab === 'logo'} icon={<BsImage />} label="الشعار" onClick={() => setActiveTab('logo')} />
              </div>

              <div className="p-4 max-h-[58vh] lg:max-h-[500px] overflow-y-auto custom-scrollbar">

                {/* ═══ TEMPLATES TAB ═══ */}
                {activeTab === 'templates' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#3b82f6] mb-3">اختر القالب</h3>
                    
                    {/* Upload new template */}
                    <div className="mb-4">
                      <label className="block border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#2563eb]/30 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
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
                          }}
                        />
                        <HiPhotograph className="text-2xl text-gray-500 mx-auto mb-1" />
                        <p className="text-gray-400 text-xs">ارفع صور القوالب هنا</p>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {allTemplates.map((t) => (
                        <div
                          key={t.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => store.setTemplate(t.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              store.setTemplate(t.id)
                            }
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                            store.selectedTemplate === t.id
                              ? 'ring-2 ring-[#2563eb] shadow-lg shadow-[#2563eb]/20'
                              : 'ring-1 ring-white/10'
                          }`}
                        >
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="absolute inset-0 bg-gray-800 items-center justify-center text-gray-500 text-xs text-center p-1 hidden">
                            {t.name}
                          </div>
                          {t.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setCustomTemplates(prev => {
                                  const updated = prev.filter(ct => ct.id !== t.id)
                                  localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
                                  return updated
                                })
                                toast.success('تم حذف القالب')
                              }}
                              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500 z-10"
                              aria-label={`حذف قالب ${t.name}`}
                            >
                              ×
                            </button>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5">
                            <span className="text-[10px] text-white truncate block text-center">{t.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ TEXT TAB ═══ */}
                {activeTab === 'text' && (
                  <div className="space-y-5">
                    {/* Element selector */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-2">العنصر النشط — اضغط على نص في البطاقة لتحديده</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'mainText', label: 'النص الرئيسي', emoji: '✨' },
                          { key: 'subText', label: 'النص الفرعي', emoji: '📝' },
                          { key: 'recipientName', label: 'اسم المستلِم', emoji: '🎯' },
                          { key: 'senderName', label: 'اسم المُرسِل', emoji: '✍️' },
                        ].map(el => (
                          <button
                            key={el.key}
                            onClick={() => store.setActiveElement(el.key)}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all text-right flex items-center gap-2 ${
                              store.activeElement === el.key 
                                ? 'bg-[#2563eb]/20 text-[#3b82f6] ring-1 ring-[#2563eb]/40' 
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span>{el.emoji}</span>
                            <span>{el.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Main Text */}
                    <div className={`p-3 rounded-xl transition-all ${store.activeElement === 'mainText' ? 'bg-[#2563eb]/10 ring-1 ring-[#2563eb]/30' : 'bg-white/[0.02]'}`}>
                      <label className="text-sm font-bold text-[#3b82f6] block mb-2">✨ النص الرئيسي</label>
                      <textarea
                        value={store.mainText}
                        onChange={(e) => store.setMainText(e.target.value)}
                        onFocus={() => store.setActiveElement('mainText')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#2563eb]/50 focus:outline-none"
                        rows={2}
                        dir="rtl"
                        placeholder="عيد مبارك..."
                      />
                      <div className="mt-2">
                        <label className="text-xs text-gray-400 block mb-1">حجم الخط: {store.fontSize}</label>
                        <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      </div>
                    </div>

                    {/* Sub Text */}
                    <div className={`p-3 rounded-xl transition-all ${store.activeElement === 'subText' ? 'bg-[#2563eb]/10 ring-1 ring-[#2563eb]/30' : 'bg-white/[0.02]'}`}>
                      <label className="text-sm font-bold text-[#3b82f6] block mb-2">📝 النص الفرعي</label>
                      <textarea
                        value={store.subText}
                        onChange={(e) => store.setSubText(e.target.value)}
                        onFocus={() => store.setActiveElement('subText')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#2563eb]/50 focus:outline-none"
                        rows={2}
                        dir="rtl"
                        placeholder="كل عام وأنتم بخير"
                      />
                      <div className="mt-2">
                        <label className="text-xs text-gray-400 block mb-1">حجم الخط: {store.subFontSize}</label>
                        <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      </div>
                    </div>

                    {/* Names */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl transition-all ${store.activeElement === 'recipientName' ? 'bg-[#2563eb]/10 ring-1 ring-[#2563eb]/30' : 'bg-white/[0.02]'}`}>
                        <label className="text-xs font-bold text-gray-300 block mb-1.5">🎯 اسم المُستلِم</label>
                        <input
                          type="text"
                          value={store.recipientName}
                          onChange={(e) => store.setRecipientName(e.target.value)}
                          onFocus={() => store.setActiveElement('recipientName')}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-[#2563eb]/50 focus:outline-none"
                          dir="rtl"
                          placeholder="اسم المستلم"
                        />
                      </div>
                      <div className={`p-3 rounded-xl transition-all ${store.activeElement === 'senderName' ? 'bg-[#2563eb]/10 ring-1 ring-[#2563eb]/30' : 'bg-white/[0.02]'}`}>
                        <label className="text-xs font-bold text-gray-300 block mb-1.5">✍️ اسم المُرسِل</label>
                        <input
                          type="text"
                          value={store.senderName}
                          onChange={(e) => store.setSenderName(e.target.value)}
                          onFocus={() => store.setActiveElement('senderName')}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-[#2563eb]/50 focus:outline-none"
                          dir="rtl"
                          placeholder="اسمك"
                        />
                      </div>
                    </div>

                    {/* Ready-made texts */}
                    <div>
                      <label className="text-sm font-bold text-[#3b82f6] block mb-2">📚 نصوص جاهزة</label>
                      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm mb-2 focus:border-[#2563eb]/50 focus:outline-none" dir="rtl" placeholder="ابحث في النصوص..." />
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filteredTexts.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 40))
                              store.setSubText(t.text.length > 40 ? t.text.substring(40) : '')
                              toast.success('تم تحديد النص')
                            }}
                            className="w-full text-right p-2 rounded-lg bg-white/5 hover:bg-[#2563eb]/10 text-gray-300 text-xs leading-relaxed transition-all border border-transparent hover:border-[#2563eb]/20"
                            dir="rtl"
                          >
                            {t.text.substring(0, 80)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fonts Tab */}
                {activeTab === 'fonts' && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#3b82f6] mb-3">اختر الخط</h3>
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => store.setFont(f.id)}
                        className={`w-full text-right p-4 rounded-xl transition-all ${
                          store.selectedFont === f.id ? 'bg-[#2563eb]/20 ring-2 ring-[#2563eb]' : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg text-white block" style={{ fontFamily: f.family }}>بسم الله الرحمن الرحيم</span>
                        <span className="text-xs text-gray-400 mt-1 block">{f.label} — {f.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* ═══ COLORS TAB ═══ */}
                {activeTab === 'colors' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-[#3b82f6] mb-1">لون كل عنصر — تحكّم فردي</h3>
                    <p className="text-gray-500 text-[11px] mb-3">كل نص في البطاقة له لون مستقل — غيّره حسب رغبتك</p>
                    
                    <ColorRow value={store.textColor} onChange={store.setTextColor} label="✨ لون النص الرئيسي" />
                    <ColorRow value={store.subTextColor} onChange={store.setSubTextColor} label="📝 لون النص الفرعي" />
                    <ColorRow value={store.recipientColor} onChange={store.setRecipientColor} label="🎯 لون اسم المستلِم" />
                    <ColorRow value={store.senderColor} onChange={store.setSenderColor} label="✍️ لون اسم المُرسِل" />

                    {/* Stroke color (only when stroke enabled) */}
                    {store.textStroke && (
                      <ColorRow value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="🖊️ لون حدود النص" />
                    )}
                  </div>
                )}

                {/* ═══ EFFECTS TAB ═══ */}
                {activeTab === 'effects' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-[#3b82f6] mb-1">تأثيرات خرافية</h3>
                    <p className="text-gray-500 text-[11px] mb-3">ظل، حدود، شفافية، تدوير — كل شي تحت سيطرتك</p>

                    {/* Text Shadow */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                      <span className="text-sm text-white font-medium">🌑 ظل النصوص</span>
                      <button
                        onClick={() => store.setTextShadow(!store.textShadow)}
                        className={`w-12 h-6 rounded-full transition-all relative ${store.textShadow ? 'bg-[#2563eb]' : 'bg-white/10'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${store.textShadow ? 'right-0.5' : 'right-[22px]'}`} />
                      </button>
                    </div>

                    {/* Text Stroke */}
                    <div className="p-3 rounded-xl bg-white/[0.03] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium">🖊️ حدود النص</span>
                        <button
                          onClick={() => store.setTextStroke(!store.textStroke)}
                          className={`w-12 h-6 rounded-full transition-all relative ${store.textStroke ? 'bg-[#2563eb]' : 'bg-white/10'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${store.textStroke ? 'right-0.5' : 'right-[22px]'}`} />
                        </button>
                      </div>
                      {store.textStroke && (
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">سمك الحدود: {store.textStrokeWidth}</label>
                          <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                        </div>
                      )}
                    </div>

                    {/* Background Overlay */}
                    <div className="p-3 rounded-xl bg-white/[0.03] space-y-3">
                      <span className="text-sm text-white font-medium block">🌫️ طبقة خلفية (لتوضيح النص)</span>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">الشفافية: {Math.round(store.overlayOpacity * 100)}%</label>
                        <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      </div>
                      <div className="flex gap-2">
                        {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                          <button
                            key={c}
                            onClick={() => store.setOverlayColor(c)}
                            className={`w-7 h-7 rounded-full border transition-all ${store.overlayColor === c ? 'ring-2 ring-[#3b82f6] border-white/30' : 'border-white/10'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Text Rotation */}
                    <div className="p-3 rounded-xl bg-white/[0.03] space-y-3">
                      <span className="text-sm text-white font-medium block">🔄 تدوير النصوص</span>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">النص الرئيسي: {store.mainTextRotation}°</label>
                        <input type="range" min={-45} max={45} value={store.mainTextRotation} onChange={(e) => store.setMainTextRotation(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">النص الفرعي: {store.subTextRotation}°</label>
                        <input type="range" min={-45} max={45} value={store.subTextRotation} onChange={(e) => store.setSubTextRotation(Number(e.target.value))} className="w-full accent-[#2563eb]" />
                      </div>
                    </div>

                    {/* Reset positions */}
                    <button
                      onClick={() => {
                        store.setMainTextPos({ x: 0.5, y: 0.35 })
                        store.setSubTextPos({ x: 0.5, y: 0.55 })
                        store.setRecipientPos({ x: 0.5, y: 0.75 })
                        store.setSenderPos({ x: 0.5, y: 0.85 })
                        store.setMainTextRotation(0)
                        store.setSubTextRotation(0)
                        toast.success('تم إعادة المواقع الافتراضية')
                      }}
                      className="w-full p-3 rounded-xl bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <BsArrowsMove /> إعادة ضبط مواقع النصوص
                    </button>

                    {/* Precise arrow controls for active element */}
                    <div className="p-3 rounded-xl bg-white/[0.03] space-y-3">
                      <span className="text-sm text-white font-medium block">🎯 تحريك دقيق — {
                        { mainText: 'النص الرئيسي', subText: 'النص الفرعي', recipientName: 'اسم المستلم', senderName: 'اسم المرسل' }[store.activeElement]
                      }</span>
                      <p className="text-gray-500 text-[11px]">استخدم الأزرار أو مفاتيح الأسهم (Shift للتحريك الأسرع)</p>
                      <div className="flex justify-center">
                        <div className="grid grid-cols-3 gap-1.5 w-fit">
                          <div />
                          <button onClick={() => { const posMap = { mainText: [store.mainTextPos, store.setMainTextPos], subText: [store.subTextPos, store.setSubTextPos], senderName: [store.senderPos, store.setSenderPos], recipientName: [store.recipientPos, store.setRecipientPos] }; const [pos, set] = posMap[store.activeElement]; set({ ...pos, y: Math.max(0, pos.y - 2/stageSize.width) }) }} className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-[#2563eb]/30 transition-all flex items-center justify-center text-lg">↑</button>
                          <div />
                          <button onClick={() => { const posMap = { mainText: [store.mainTextPos, store.setMainTextPos], subText: [store.subTextPos, store.setSubTextPos], senderName: [store.senderPos, store.setSenderPos], recipientName: [store.recipientPos, store.setRecipientPos] }; const [pos, set] = posMap[store.activeElement]; set({ ...pos, x: Math.min(1, pos.x + 2/stageSize.width) }) }} className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-[#2563eb]/30 transition-all flex items-center justify-center text-lg">→</button>
                          <button onClick={() => { const posMap = { mainText: [store.mainTextPos, store.setMainTextPos], subText: [store.subTextPos, store.setSubTextPos], senderName: [store.senderPos, store.setSenderPos], recipientName: [store.recipientPos, store.setRecipientPos] }; const [pos, set] = posMap[store.activeElement]; set({ ...pos, y: Math.min(1, pos.y + 2/stageSize.width) }) }} className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-[#2563eb]/30 transition-all flex items-center justify-center text-lg">↓</button>
                          <button onClick={() => { const posMap = { mainText: [store.mainTextPos, store.setMainTextPos], subText: [store.subTextPos, store.setSubTextPos], senderName: [store.senderPos, store.setSenderPos], recipientName: [store.recipientPos, store.setRecipientPos] }; const [pos, set] = posMap[store.activeElement]; set({ ...pos, x: Math.max(0, pos.x - 2/stageSize.width) }) }} className="w-10 h-10 rounded-lg bg-white/10 text-white font-bold hover:bg-[#2563eb]/30 transition-all flex items-center justify-center text-lg">←</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ LOGO TAB ═══ */}
                {activeTab === 'logo' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#3b82f6] mb-3">شعار / صورة</h3>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#2563eb]/30 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" id="logo-upload" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => { store.setLogoImage(ev.target.result); toast.success('تم رفع الشعار') }
                          reader.readAsDataURL(file)
                        }
                      }} />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <HiPhotograph className="text-4xl text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">اضغط لرفع شعار أو صورة</p>
                        <p className="text-gray-500 text-xs mt-1">PNG أو JPG</p>
                      </label>
                    </div>
                    {store.logoImage && (
                      <div className="relative">
                        <img src={store.logoImage} alt="Logo" className="w-full h-32 object-contain rounded-xl bg-white/5 p-4" />
                        <button onClick={() => store.setLogoImage(null)} className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
