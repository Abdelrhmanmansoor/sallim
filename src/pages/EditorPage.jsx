import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva'
import { useEditorStore } from '../store'
import { templates, themes, fonts } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { BsDownload, BsFilePdf, BsPalette, BsFonts, BsImage, BsTextLeft, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2 } from 'react-icons/bs'
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
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        active ? 'bg-gold-500/20 text-gold-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
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
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `eid-greeting-${Date.now()}.png`
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('تم تحميل البطاقة!')
    } catch (e) {
      toast.error('حدث خطأ أثناء التصدير')
    }
  }, [])

  const handleExportPDF = useCallback(async () => {
    if (!stageRef.current) return
    try {
      const { jsPDF } = await import('jspdf')
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
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
    return stageRef.current.toDataURL({ pixelRatio: 2 })
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

  const textColor = currentTemplate?.textColor || store.textColor

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 w-full">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0c0d12', color: '#f0f0f0', border: '1px solid rgba(184,150,58,0.2)' } }} />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-black mb-2">
            <span className="gradient-gold-text">محرر البطاقات</span>
          </h1>
          <p className="text-gray-400">اختر القالب وعدّل النصوص حسب رغبتك</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas */}
          <div className="flex-1 flex flex-col items-center">
            <div ref={containerRef} className="w-full max-w-[540px]">
              <div className="glass rounded-2xl p-4 mb-4">
                <Stage
                  ref={stageRef}
                  width={stageSize.width}
                  height={stageSize.height}
                  className="rounded-xl overflow-hidden mx-auto"
                >
                  <Layer>
                    <Rect width={stageSize.width} height={stageSize.height} fill="#08090d" />

                    {bgImage && bgLoaded && (
                      <KonvaImage
                        image={bgImage}
                        width={stageSize.width}
                        height={stageSize.height}
                      />
                    )}

                    {!bgLoaded && (
                      <Text
                        text={"ارفع صور القوالب في\npublic/templates/"}
                        x={0}
                        y={stageSize.height * 0.38}
                        width={stageSize.width}
                        align="center"
                        fontFamily="'Cairo', sans-serif"
                        fontSize={18 * scale}
                        fill="#555"
                        lineHeight={1.8}
                      />
                    )}

                    <Text
                      text={store.mainText}
                      x={0}
                      y={stageSize.height * 0.32}
                      width={stageSize.width}
                      align="center"
                      fontFamily={currentFont.family}
                      fontSize={store.fontSize * scale}
                      fill={textColor}
                      lineHeight={1.6}
                      padding={40 * scale}
                      wrap="word"
                      shadowColor="rgba(0,0,0,0.5)"
                      shadowBlur={8 * scale}
                    />

                    <Text
                      text={store.subText}
                      x={0}
                      y={stageSize.height * 0.58}
                      width={stageSize.width}
                      align="center"
                      fontFamily={currentFont.family}
                      fontSize={store.subFontSize * scale}
                      fill={textColor}
                      opacity={0.9}
                      lineHeight={1.5}
                      padding={30 * scale}
                      wrap="word"
                      shadowColor="rgba(0,0,0,0.4)"
                      shadowBlur={6 * scale}
                    />

                    {store.recipientName && (
                      <Text
                        text={store.recipientName}
                        x={0}
                        y={stageSize.height * 0.75}
                        width={stageSize.width}
                        align="center"
                        fontFamily={currentFont.family}
                        fontSize={22 * scale}
                        fill={textColor}
                        opacity={0.95}
                        shadowColor="rgba(0,0,0,0.4)"
                        shadowBlur={4 * scale}
                      />
                    )}

                    {store.senderName && (
                      <Text
                        text={store.senderName}
                        x={0}
                        y={stageSize.height * 0.85}
                        width={stageSize.width}
                        align="center"
                        fontFamily={currentFont.family}
                        fontSize={18 * scale}
                        fill={textColor}
                        opacity={0.7}
                        shadowColor="rgba(0,0,0,0.3)"
                        shadowBlur={4 * scale}
                      />
                    )}
                  </Layer>
                </Stage>
              </div>

              <div className="space-y-3">
                {/* Download Buttons */}
                <div className="flex gap-3 justify-center">
                  <button onClick={handleExportPNG} className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-gray-900 font-bold hover:shadow-lg hover:shadow-gold-500/30 transition-all hover:scale-105">
                    <BsDownload /> تحميل PNG
                  </button>
                  <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-500/30 text-gold-300 font-medium hover:bg-gold-500/10 transition-all hover:scale-105">
                    <BsFilePdf /> تحميل PDF
                  </button>
                </div>
                
                {/* Share Buttons */}
                <div className="flex gap-2 justify-center">
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

          {/* Control Panel */}
          <div className="w-full lg:w-96">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex overflow-x-auto gap-1 p-2 border-b border-white/5">
                <TabButton active={activeTab === 'templates'} icon={<HiTemplate />} label="القوالب" onClick={() => setActiveTab('templates')} />
                <TabButton active={activeTab === 'text'} icon={<BsTextLeft />} label="النصوص" onClick={() => setActiveTab('text')} />
                <TabButton active={activeTab === 'fonts'} icon={<BsFonts />} label="الخطوط" onClick={() => setActiveTab('fonts')} />
                <TabButton active={activeTab === 'colors'} icon={<BsPalette />} label="الألوان" onClick={() => setActiveTab('colors')} />
                <TabButton active={activeTab === 'logo'} icon={<BsImage />} label="الشعار" onClick={() => setActiveTab('logo')} />
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {/* Templates Tab */}
                {activeTab === 'templates' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gold-400 mb-3">اختر القالب</h3>
                    
                    {/* Upload new template */}
                    <div className="mb-4">
                      <label className="block border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-gold-500/30 transition-colors cursor-pointer">
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
                        <button
                          key={t.id}
                          onClick={() => store.setTemplate(t.id)}
                          className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 ${
                            store.selectedTemplate === t.id
                              ? 'ring-2 ring-gold-400 shadow-lg shadow-gold-500/20'
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
                          <div className="absolute inset-0 bg-gray-800 items-center justify-center text-gray-500 text-[10px] text-center p-1 hidden">
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
                              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center hover:bg-red-500 z-10"
                            >
                              ×
                            </button>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5">
                            <span className="text-[9px] text-white truncate block text-center">{t.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Tab */}
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gold-400 block mb-2">النص الرئيسي</label>
                      <textarea
                        value={store.mainText}
                        onChange={(e) => store.setMainText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-gold-500/50 focus:outline-none"
                        rows={3}
                        dir="rtl"
                        placeholder="عيد مبارك..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gold-400 block mb-2">النص الفرعي</label>
                      <textarea
                        value={store.subText}
                        onChange={(e) => store.setSubText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-gold-500/50 focus:outline-none"
                        rows={2}
                        dir="rtl"
                        placeholder="كل عام وأنتم بخير"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">اسم المُرسِل</label>
                        <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-gold-500/50 focus:outline-none" dir="rtl" placeholder="اسمك" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">اسم المُستلِم</label>
                        <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-gold-500/50 focus:outline-none" dir="rtl" placeholder="اسم المستلم" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">حجم الخط الرئيسي: {store.fontSize}</label>
                        <input type="range" min={20} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} className="w-full accent-gold-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">حجم الخط الفرعي: {store.subFontSize}</label>
                        <input type="range" min={12} max={48} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} className="w-full accent-gold-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gold-400 block mb-2">نصوص جاهزة</label>
                      <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm mb-2 focus:border-gold-500/50 focus:outline-none" dir="rtl" placeholder="ابحث في النصوص..." />
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filteredTexts.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 40))
                              store.setSubText(t.text.length > 40 ? t.text.substring(40) : '')
                              toast.success('تم تحديد النص')
                            }}
                            className="w-full text-right p-2 rounded-lg bg-white/5 hover:bg-gold-500/10 text-gray-300 text-xs leading-relaxed transition-all border border-transparent hover:border-gold-500/20"
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
                    <h3 className="text-sm font-bold text-gold-400 mb-3">اختر الخط</h3>
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => store.setFont(f.id)}
                        className={`w-full text-right p-4 rounded-xl transition-all ${
                          store.selectedFont === f.id ? 'bg-gold-500/20 ring-2 ring-gold-400' : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg text-white block" style={{ fontFamily: f.family }}>بسم الله الرحمن الرحيم</span>
                        <span className="text-xs text-gray-400 mt-1 block">{f.label} — {f.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gold-400 block mb-2">لون النص</label>
                      <div className="flex gap-2 flex-wrap">
                        {['#ffffff', '#000000', '#d4a843', '#f5d78e', '#4ade80', '#f472b6', '#93c5fd', '#c4b5fd', '#fbbf24', '#ef4444'].map((c) => (
                          <button
                            key={c}
                            onClick={() => store.setTextColor(c)}
                            className={`w-8 h-8 rounded-full border border-white/20 transition-all ${
                              store.textColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input type="color" value={store.textColor} onChange={(e) => store.setTextColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gold-400 mb-3">ثيمات جاهزة</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => store.setTheme(t.id)}
                            className={`p-3 rounded-xl text-right transition-all ${
                              store.selectedTheme === t.id ? 'ring-2 ring-gold-400' : 'ring-1 ring-white/10'
                            }`}
                            style={{ backgroundColor: t.bg }}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.primary }}></div>
                              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.secondary }}></div>
                            </div>
                            <span className="text-xs" style={{ color: t.primary }}>{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Logo Tab */}
                {activeTab === 'logo' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gold-400 mb-3">شعار / صورة</h3>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-gold-500/30 transition-colors cursor-pointer">
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
