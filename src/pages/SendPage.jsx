import { useState, useRef } from 'react'
import { useEditorStore } from '../store'
import { generateWhatsAppLink, parseCSV } from '../utils/export'
import { templates } from '../data/templates'
import { Link } from 'react-router-dom'
import { BsWhatsapp, BsSend, BsUpload, BsFileZip, BsClock, BsPersonPlus, BsPeople, BsDownload, BsEnvelope, BsLink45Deg, BsCheck2, BsQrCode, BsTelegram, BsImage, BsGift, BsDice5 } from 'react-icons/bs'
import { HiPhotograph, HiShare } from 'react-icons/hi'
import toast, { Toaster } from 'react-hot-toast'

export default function SendPage() {
  const store = useEditorStore()
  const [sendMode, setSendMode] = useState('link')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('عيد مبارك وكل عام وأنتم بخير')
  const [csvData, setCsvData] = useState([])
  const [csvFileName, setCsvFileName] = useState('')
  const [interval, setInterval] = useState(5)
  const [isSending, setIsSending] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  // Link Card state
  const [linkName, setLinkName] = useState('')
  const [linkTemplate, setLinkTemplate] = useState(1)
  const [linkGreeting, setLinkGreeting] = useState('كل عام وأنتم بخير')
  const [generatedLink, setGeneratedLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  // Eidiya luck spinner state
  const [eidiyaMin, setEidiyaMin] = useState(10)
  const [eidiyaMax, setEidiyaMax] = useState(100)
  const [eidiyaAttempts, setEidiyaAttempts] = useState(1)
  const [eidiyaSenderName, setEidiyaSenderName] = useState('')
  const [eidiyaLink, setEidiyaLink] = useState('')
  const [eidiyaLinkCopied, setEidiyaLinkCopied] = useState(false)
  const [eidiyaCurrency, setEidiyaCurrency] = useState('ريال')
  const [eidiyaDialect, setEidiyaDialect] = useState('sa')

  const handleGenerateLink = () => {
    if (!linkName.trim()) {
      toast.error('أدخل اسم المستلم أولاً')
      return
    }
    const params = new URLSearchParams({
      name: linkName.trim(),
      t: linkTemplate,
      g: linkGreeting,
    })
    const url = `${window.location.origin}/card?${params.toString()}`
    setGeneratedLink(url)
    toast.success('تم إنشاء الرابط!')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setLinkCopied(true)
      toast.success('تم نسخ الرابط!')
      setTimeout(() => setLinkCopied(false), 2000)
    }).catch(() => toast.error('لم نتمكن من النسخ'))
  }

  const handleSingleSend = () => {
    if (!phone) {
      toast.error('أدخل رقم الهاتف')
      return
    }
    const link = generateWhatsAppLink(phone, message)
    window.open(link, '_blank')
    toast.success('تم فتح واتساب!')
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = parseCSV(ev.target.result)
        setCsvData(data)
        setCsvFileName(file.name)
        toast.success(`تم تحميل ${data.length} جهة اتصال!`)
      } catch (err) {
        toast.error('خطأ في قراءة الملف. تأكد من التنسيق الصحيح.')
      }
    }
    reader.readAsText(file)
  }

  const handleBulkSend = async () => {
    if (csvData.length === 0) {
      toast.error('لا يوجد ملف CSV محمّل')
      return
    }
    setIsSending(true)
    setSentCount(0)

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      const personalMessage = message.replace('{name}', row['الاسم'] || row['name'] || '')
      const phoneNum = row['الهاتف'] || row['phone'] || row['رقم'] || ''

      if (phoneNum) {
        const link = generateWhatsAppLink(phoneNum, personalMessage)
        window.open(link, '_blank')
        setSentCount(i + 1)

        // Wait for interval
        if (i < csvData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, interval * 1000))
        }
      }
    }

    setIsSending(false)
    toast.success(`تم إرسال ${csvData.length} رسالة بنجاح!`)
  }

  return (
    <div className="page-shell pb-10 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#17012C', color: '#f0f0f0', border: '1px solid rgba(106,71,237,0.3)' } }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6A47ED]/10 border border-[#6A47ED]/20 rounded-full px-5 py-2 mb-5">
            <BsSend className="text-[#8B6CF6] text-xs" />
            <span className="text-[#A78BFA] text-xs font-medium">مركز الإرسال المتكامل</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gradient-gold-text">أرسل تهنئتك</span>
            <span className="text-[#0F172A]"> بسهولة</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">أرسل بطاقتك عبـر الواتساب فوراً، أو شاركها عبر التيليجرام أو أنشئ رابط مخصص لكل شخص</p>

          {/* Quick visual steps */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 max-w-md mx-auto">
            {['اختر', 'أضف المعلومات', 'أرسل'].map((s, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 py-2.5 px-2 text-center">
                <div className="w-6 h-6 rounded-full bg-[#6A47ED] text-white text-xs font-bold flex items-center justify-center mx-auto mb-1.5">{i + 1}</div>
                <span className="text-gray-300 text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
          {[
            { id: 'eidiya', icon: <BsGift />, label: 'عيدية حظ', desc: 'رابط تفاعلي' },
            { id: 'link', icon: <BsLink45Deg />, label: 'بطاقة رابط', desc: 'رابط مخصص' },
            { id: 'single', icon: <BsPersonPlus />, label: 'إرسال فردي', desc: 'شخص واحد' },
            { id: 'bulk', icon: <BsPeople />, label: 'إرسال جماعي', desc: 'قائمة CSV' },
            { id: 'share', icon: <HiShare />, label: 'مشاركة سريعة', desc: 'كل المنصات' },
            { id: 'zip', icon: <BsFileZip />, label: 'تحميل ZIP', desc: 'بطاقات متعددة' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSendMode(mode.id)}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl text-sm font-medium transition-all min-h-[112px] border ${sendMode === mode.id
                  ? 'bg-[#6A47ED] text-white shadow-lg shadow-[#6A47ED]/20 border-[#6A47ED]/30'
                  : 'glass text-gray-300 hover:text-white border-white/5 hover:border-[#6A47ED]/20'
                }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="font-bold text-xs">{mode.label}</span>
              <span className={`text-[11px] ${sendMode === mode.id ? 'text-white/80' : 'text-gray-500'}`}>{mode.desc}</span>
            </button>
          ))}
        </div>

        {/* Link Card */}
        {sendMode === 'link' && (
          <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-auto border border-white/5 hover:border-[#6A47ED]/10 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6A47ED]/20 flex items-center justify-center border border-[#6A47ED]/10">
                <BsLink45Deg className="text-[#8B6CF6] text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">رابط بطاقة مخصص</h3>
                <p className="text-gray-400 text-sm">أدخل اسماً، اختر تصميم وأنشئ الرابط و أرسله للمستلم مباشرة</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1: Name */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A47ED] text-white text-xs font-bold flex items-center justify-center">1</div>
                  <label className="text-sm text-[#8B6CF6] font-bold">اسم المستلم</label>
                </div>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => { setLinkName(e.target.value); setGeneratedLink('') }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-lg text-center focus:border-[#6A47ED]/50 focus:outline-none focus:ring-1 focus:ring-[#6A47ED]/20 transition-all"
                  dir="rtl"
                  placeholder="اكتب الاسم هنا..."
                />
              </div>

              {/* Step 2: Pick Template */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A47ED] text-white text-xs font-bold flex items-center justify-center">2</div>
                  <label className="text-sm text-[#8B6CF6] font-bold">اختر التصميم</label>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setLinkTemplate(t.id); setGeneratedLink('') }}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-[3/4] group ${linkTemplate === t.id
                          ? 'border-[#6A47ED] shadow-lg shadow-[#6A47ED]/30 scale-105'
                          : 'border-white/10 hover:border-[#6A47ED]/30'
                        }`}
                    >
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      {linkTemplate === t.id && (
                        <div className="absolute inset-0 bg-[#6A47ED]/20 flex items-center justify-center">
                          <BsCheck2 className="text-white text-2xl drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Greeting */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#6A47ED] text-white text-xs font-bold flex items-center justify-center">3</div>
                  <label className="text-sm text-[#8B6CF6] font-bold">نص التهنئة</label>
                </div>
                <textarea
                  value={linkGreeting}
                  onChange={(e) => { setLinkGreeting(e.target.value); setGeneratedLink('') }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base text-center resize-none focus:border-[#6A47ED]/50 focus:outline-none focus:ring-1 focus:ring-[#6A47ED]/20 transition-all"
                  rows={2}
                  dir="rtl"
                  placeholder="كل عام وأنتم بخير"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateLink}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#6A47ED] text-white font-black text-lg transition-all hover:shadow-xl hover:shadow-[#6A47ED]/20 hover:scale-[1.02]"
              >
                <BsSend className="text-xl" />
                أنشئ الرابط
              </button>

              {/* Generated Link & Share */}
              {generatedLink && (
                <div className="space-y-4 pt-4 border-t border-white/5 animate-fadeInUp">
                  <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-[#6A47ED]/20">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="flex-1 bg-transparent text-[#A78BFA] text-sm text-left truncate focus:outline-none"
                      dir="ltr"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${linkCopied
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-[#6A47ED] text-white hover:scale-105'
                        }`}
                    >
                      {linkCopied ? '✓ تم النسخ' : 'نسخ الرابط'}
                    </button>
                  </div>

                  {/* Quick share row */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`${linkGreeting} يا ${linkName}\n\n${generatedLink}`)
                        window.open(`https://wa.me/?text=${text}`, '_blank')
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 transition-all"
                    >
                      <BsWhatsapp className="text-green-400 text-xl" />
                      <span className="text-green-300 text-xs font-bold">واتساب</span>
                    </button>
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(generatedLink)
                        const text = encodeURIComponent(`${linkGreeting} يا ${linkName}`)
                        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                    >
                      <BsTelegram className="text-blue-400 text-xl" />
                      <span className="text-blue-300 text-xs font-bold">تيليجرام</span>
                    </button>
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`${linkGreeting} يا ${linkName}\n\n`)
                        const url = encodeURIComponent(generatedLink)
                        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <span className="text-white font-bold text-lg">𝕏</span>
                      <span className="text-gray-300 text-xs font-bold">تويتر</span>
                    </button>
                  </div>

                  {/* Preview link */}
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[#8B6CF6] hover:text-[#A78BFA] text-sm transition-colors"
                  >
                    معاينة البطاقة
                  </a>
                </div>
              )}
            </div>

            {/* Counter */}
            <div className="mt-8 pt-5 border-t border-white/5 text-center">
              <p className="text-gray-400 text-xs">عدد البطاقات المُنشأة: <span className="text-[#8B6CF6] font-bold">5,450+</span></p>
            </div>
          </div>
        )}

        {/* Single Send */}
        {sendMode === 'single' && (
          <div className="glass rounded-3xl p-8 md:p-12 max-w-lg mx-auto border border-white/5 hover:border-[#6A47ED]/10 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/10">
                <BsWhatsapp className="text-green-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">إرسال فردي</h3>
                <p className="text-gray-400 text-sm">أرسل تهنئة واحدة لشخص واحد عبر واتساب</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-[#8B6CF6] font-medium block mb-2">رقم الهاتف (مع رمز الدولة)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base focus:border-[#6A47ED]/50 focus:outline-none focus:ring-1 focus:ring-[#6A47ED]/20 transition-all"
                    dir="ltr"
                    placeholder="966501234567"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">+</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#8B6CF6] font-medium block mb-2">اسم المستلم (اختياري)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base focus:border-[#6A47ED]/50 focus:outline-none focus:ring-1 focus:ring-[#6A47ED]/20 transition-all"
                  dir="rtl"
                  placeholder="محمد"
                />
              </div>

              <div>
                <label className="text-sm text-[#8B6CF6] font-medium block mb-2">نص الرسالة</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm resize-none focus:border-[#6A47ED]/50 focus:outline-none focus:ring-1 focus:ring-[#6A47ED]/20 transition-all"
                  rows={4}
                  dir="rtl"
                />
              </div>

              <button
                onClick={handleSingleSend}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-all hover:shadow-xl hover:shadow-green-500/20 hover:scale-[1.02]"
              >
                <BsWhatsapp className="text-xl" />
                إرسال عبر واتساب
              </button>

              <p className="text-center text-gray-400 text-xs">سيفتح تطبيق واتساب جاهزاً للإرسال</p>
            </div>
          </div>
        )}

        {/* Bulk Send */}
        {sendMode === 'bulk' && (
          <div className="glass rounded-3xl p-8 md:p-12 max-w-lg mx-auto border border-white/5 hover:border-[#6A47ED]/10 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6A47ED]/20 flex items-center justify-center border border-[#6A47ED]/10">
                <BsPeople className="text-[#8B6CF6] text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">إرسال جماعي</h3>
                <p className="text-gray-400 text-sm">حمّل ملف CSV بالأسماء والأرقام</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* CSV Upload */}
              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-[#6A47ED]/30 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
                <BsUpload className="text-3xl text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-semibold">اضغط لرفع ملف CSV</p>
                <p className="text-gray-400 text-xs mt-2">الأعمدة: الاسم، الهاتف (أو اسم، رقم)</p>
              </div>

              {csvFileName && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                  <BsFileZip className="text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm font-medium">{csvFileName}</p>
                    <p className="text-green-400/70 text-xs">{csvData.length} جهة اتصال</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  نص الرسالة <span className="text-[#8B6CF6]">(استخدم {'{name}'} لإضافة الاسم)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#6A47ED]/50 focus:outline-none"
                  rows={4}
                  dir="rtl"
                  placeholder="عيد مبارك يا {name}، كل عام وأنت بخير"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                  <BsClock />
                  الفاصل الزمني بين الرسائل: <span className="text-[#8B6CF6]">{interval} ثواني</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full accent-[#6A47ED]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 ثواني</span>
                  <span>10 ثواني</span>
                </div>
              </div>

              {isSending && (
                <div className="bg-[#6A47ED]/10 border border-[#6A47ED]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#A78BFA] text-sm">جاري الإرسال...</span>
                    <span className="text-[#8B6CF6] text-sm font-bold">{sentCount}/{csvData.length}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#6A47ED] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(sentCount / csvData.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleBulkSend}
                disabled={isSending || csvData.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#6A47ED] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BsSend />
                {isSending ? 'جاري الإرسال...' : `إرسال إلى ${csvData.length} شخص`}
              </button>
            </div>
          </div>
        )}

        {/* Quick Share */}
        {sendMode === 'share' && (
          <div className="glass rounded-3xl p-8 md:p-12 max-w-lg mx-auto border border-white/5 hover:border-[#6A47ED]/10 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6A47ED]/20 flex items-center justify-center border border-[#6A47ED]/10">
                <HiShare className="text-[#8B6CF6] text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">مشاركة سريعة</h3>
                <p className="text-gray-400 text-sm">شارك الرابط على أي منصة تريدها</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/editor')
                    .then(() => {
                      setCopied(true)
                      toast.success('تم نسخ الرابط!')
                      setTimeout(() => setCopied(false), 2000)
                    })
                    .catch(() => toast.error('لم نتمكن من النسخ'))
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                  {copied ? <BsCheck2 className="text-green-400 text-lg" /> : <BsLink45Deg className="text-gray-400 text-lg group-hover:text-white transition-colors" />}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">{copied ? 'تم النسخ!' : 'نسخ رابط المحرر'}</p>
                  <p className="text-gray-400 text-xs">شارك رابط المحرر مع الجميع</p>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => {
                  const text = encodeURIComponent(`${message}\n\nصمم بطاقتك من هنا: ${window.location.origin}/editor`)
                  window.open(`https://wa.me/?text=${text}`, '_blank')
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <BsWhatsapp className="text-green-400 text-lg" />
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">واتساب</p>
                  <p className="text-gray-400 text-xs">شارك التهنئة عبر واتساب</p>
                </div>
              </button>

              {/* Telegram */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.origin + '/editor')
                  const text = encodeURIComponent(message)
                  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BsTelegram className="text-blue-400 text-lg" />
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">تيليجرام</p>
                  <p className="text-gray-400 text-xs">شارك التهنئة عبر تيليجرام</p>
                </div>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => {
                  const text = encodeURIComponent(`${message}\n\n`)
                  const url = encodeURIComponent(window.location.origin)
                  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">𝕏</span>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">تويتر / X</p>
                  <p className="text-gray-400 text-xs">شارك التهنئة</p>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={() => {
                  const subject = encodeURIComponent('تهنئة عيد سعيد')
                  const body = encodeURIComponent(`${message}\n\nصمم بطاقتك الخاصة من:\n${window.location.origin}/editor`)
                  window.open(`mailto:?subject=${subject}&body=${body}`)
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BsEnvelope className="text-purple-400 text-lg" />
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">بريد إلكتروني</p>
                  <p className="text-gray-400 text-xs">شارك التهنئة بالإيميل</p>
                </div>
              </button>
            </div>

            {/* Customize Message */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <label className="text-sm text-gray-400 block mb-2">تعديل نص المشاركة</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:border-[#6A47ED]/50 focus:outline-none"
                rows={3}
                dir="rtl"
              />
            </div>
          </div>
        )}

        {/* ZIP Download */}
        {sendMode === 'zip' && (
          <div className="glass rounded-3xl p-8 md:p-12 max-w-lg mx-auto border border-white/5 hover:border-[#6A47ED]/10 transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6A47ED]/20 flex items-center justify-center border border-[#6A47ED]/10">
                <BsFileZip className="text-[#8B6CF6] text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">تحميل ZIP</h3>
                <p className="text-gray-400 text-sm">حمّل كـل البطاقات المصممة في ملف واحد</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                <BsFileZip className="text-5xl text-purple-400 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-2">ميزة متقدمة قادمة</h4>
                <p className="text-gray-400 text-sm mb-4">
                  قريباً ارفع ملف CSV بالأسماء وحدد قالب ونحن نولد كل البطاقات في ملف ZIP
                </p>
                <p className="text-purple-300 text-xs">
                  هذه الميزة متاحة لباقة <span className="font-bold">الشركات</span> أو <span className="font-bold">الموزع</span>
                </p>
              </div>

              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
                <BsUpload className="text-2xl text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">ارفع ملف CSV</p>
              </div>

              {csvData.length > 0 && (
                <p className="text-green-400 text-sm text-center">✓ {csvData.length} اسم جاهز للتحميل</p>
              )}

              <Link
                to="/editor"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-500/10 transition-all"
              >
                <BsSend />
                اذهب إلى المحرر
              </Link>
            </div>
          </div>
        )}

        {/* Quick Link to Editor */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-3">لم تصمم بطاقتك بعد؟</p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 text-[#8B6CF6] hover:text-[#A78BFA] transition-colors"
          >
            <BsSend />
            اذهب لمحرر البطاقات
          </Link>
        </div>
      </div>
    </div>
  )
}
