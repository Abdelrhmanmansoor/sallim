import { useState, useEffect } from 'react'
import { useWhiteLabelStore } from '../store'
import { BsGear, BsPalette, BsGlobe, BsKey, BsShield, BsBarChart, BsPeople, BsFileText, BsTrash, BsTrendingUp, BsCalendar, BsClock } from 'react-icons/bs'
import { HiPhotograph, HiTemplate } from 'react-icons/hi'
import toast, { Toaster } from 'react-hot-toast'

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const numericValue = parseInt(value.replace(/,/g, '').replace(/[^0-9]/g, '')) || 0
    const isPercentage = value.includes('%')
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(numericValue * easeOut)
      
      setCount(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(numericValue)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  const suffix = value.includes('%') ? '%' : ''
  const prefix = value.includes('+') ? '+' : ''
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Eidiya Counter Component
function EidiyaCounter() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isEid, setIsEid] = useState(false)
  
  useEffect(() => {
    // Eid Al-Fitr 2026 - March 30, 2026
    const eidDate = new Date('2026-03-30T00:00:00+03:00')
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = eidDate - now
      
      if (diff <= 0) {
        setIsEid(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  if (isEid) {
    return (
      <div className="text-2xl font-black gradient-gold-text animate-pulse">
        عيد مبارك!
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-2" dir="ltr">
      {[
        { val: timeLeft.days, label: 'يوم' },
        { val: timeLeft.hours, label: 'ساعة' },
        { val: timeLeft.minutes, label: 'دقيقة' },
        { val: timeLeft.seconds, label: 'ثانية' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <span className="text-xl font-black text-white tabular-nums">
            {String(item.val).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gold-400/60 block">{item.label}</span>
          {i < 3 && <span className="text-gold-400/40 mx-1">:</span>}
        </div>
      ))}
    </div>
  )
}

// Sparkline Chart Component
function Sparkline({ data, color = '#b8963a' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((val - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkline-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon 
        points={`0,100 ${points} 100,100`} 
        fill={`url(#sparkline-${color.replace('#', '')})`}
      />
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const sidebarItems = [
  { id: 'brand', icon: <BsPalette />, label: 'الهوية' },
  { id: 'templates', icon: <HiTemplate />, label: 'القوالب' },
  { id: 'domain', icon: <BsGlobe />, label: 'النطاق' },
  { id: 'api', icon: <BsKey />, label: 'API' },
  { id: 'users', icon: <BsPeople />, label: 'المستخدمين' },
  { id: 'reports', icon: <BsBarChart />, label: 'التقارير' },
  { id: 'settings', icon: <BsGear />, label: 'الإعدادات' },
]

const mockUsers = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', plan: 'شخصي', cards: 45, lastActive: '2026-03-04' },
  { id: 2, name: 'سارة العلي', email: 'sara@example.com', plan: 'مجاني', cards: 12, lastActive: '2026-03-03' },
  { id: 3, name: 'خالد العمري', email: 'khalid@example.com', plan: 'شركات', cards: 230, lastActive: '2026-03-05' },
  { id: 4, name: 'فاطمة الزهراني', email: 'fatima@example.com', plan: 'شخصي', cards: 67, lastActive: '2026-03-02' },
  { id: 5, name: 'عبدالله السبيعي', email: 'abd@example.com', plan: 'مجاني', cards: 3, lastActive: '2026-03-01' },
]

const mockStats = [
  { label: 'إجمالي البطاقات', value: '1,247', change: '+23%', icon: <BsFileText />, sparkline: [45, 52, 48, 65, 72, 68, 85, 92, 88, 105, 112, 124] },
  { label: 'المستخدمين النشطين', value: '89', change: '+12%', icon: <BsPeople />, sparkline: [65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 88, 89] },
  { label: 'رسائل مرسلة', value: '456', change: '+45%', icon: <BsBarChart />, sparkline: [120, 135, 158, 172, 195, 220, 245, 280, 325, 380, 420, 456] },
  { label: 'معدل النجاح', value: '99.8', change: '+2%', icon: <BsShield />, sparkline: [95, 96, 96.5, 97, 97.5, 98, 98.2, 98.5, 98.8, 99, 99.5, 99.8] },
]

export default function DashboardPage() {
  const { config, setConfig } = useWhiteLabelStore()
  const [activeSection, setActiveSection] = useState('brand')
  const [apiKey] = useState('eid_' + Math.random().toString(36).substring(2, 15))
  const [managedTemplates, setManagedTemplates] = useState([])

  // Load custom templates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eidgreet_custom_templates')
      if (saved) setManagedTemplates(JSON.parse(saved))
    } catch {}
  }, [])

  const handleUploadTemplates = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newTemplate = {
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          image: ev.target.result,
          textColor: '#ffffff',
          isCustom: true,
        }
        setManagedTemplates(prev => {
          const updated = [...prev, newTemplate]
          localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
    toast.success(`تم رفع ${files.length} قالب`)
  }

  const handleDeleteTemplate = (id) => {
    setManagedTemplates(prev => {
      const updated = prev.filter(t => t.id !== id)
      localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
      return updated
    })
    toast.success('تم حذف القالب')
  }

  const handleRenameTemplate = (id, newName) => {
    setManagedTemplates(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, name: newName } : t)
      localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0c0d12', color: '#f0f0f0', border: '1px solid rgba(184,150,58,0.2)' } }} />

      <div className="max-w-7xl mx-auto">
        {/* Header with Eidiya Counter */}
        <div className="mb-8">
          <div className="glass rounded-3xl p-8 mb-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                <h1 className="text-3xl md:text-5xl font-black mb-2">
                  <span className="gradient-gold-text">لوحة التحكم</span>
                </h1>
                <p className="text-gray-400 text-lg">إدارة الوايت لابل وتخصيص هوية المنصة</p>
              </div>
              
              {/* Eidiya Counter Badge */}
              <div className="flex items-center gap-4">
                <div className="glass-strong rounded-2xl p-4 border border-gold-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-gray-900">
                      <BsCalendar className="text-xl" />
                    </div>
                    <div>
                      <p className="text-gold-400 text-xs font-medium mb-1">عداد العيدية</p>
                      <EidiyaCounter />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, i) => (
            <div 
              key={i} 
              className="glass rounded-2xl p-5 card-hover group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Subtle gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gold-400 text-xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                    <span className="text-gray-400 text-xs">{stat.label}</span>
                  </div>
                  <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <BsTrendingUp className="text-[10px]" />
                    {stat.change}
                  </span>
                </div>
                
                <div className="text-3xl font-black gradient-gold-text mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                
                {/* Sparkline chart */}
                <div className="mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={stat.sparkline} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="glass rounded-2xl p-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* ═══ Brand Section ═══ */}
            {activeSection === 'brand' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsPalette className="text-gold-400" />
                  تخصيص الهوية
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">اسم الشركة</label>
                    <input
                      type="text"
                      value={config.companyName}
                      onChange={(e) => setConfig({ companyName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-gold-500/50 focus:outline-none"
                      dir="rtl"
                      placeholder="اسم شركتك"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 block mb-2">شعار الشركة</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-gold-500/30 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="company-logo"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (ev) => {
                              setConfig({ logo: ev.target.result })
                              toast.success('تم رفع الشعار!')
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <label htmlFor="company-logo" className="cursor-pointer">
                        <HiPhotograph className="text-3xl text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">اضغط لرفع الشعار</p>
                      </label>
                    </div>
                    {config.logo && (
                      <img src={config.logo} alt="Company Logo" className="mt-3 h-16 object-contain" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">اللون الأساسي</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ primaryColor: e.target.value })}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm text-center focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">اللون الثانوي</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ secondaryColor: e.target.value })}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm text-center focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.hideBranding}
                        onChange={(e) => setConfig({ hideBranding: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                    </label>
                    <span className="text-sm text-gray-300">إخفاء علامة سَلِّم التجارية</span>
                  </div>

                  <button
                    onClick={() => toast.success('تم حفظ التغييرات!')}
                    className="w-full px-6 py-3 rounded-xl gradient-gold text-gray-900 font-bold hover:shadow-lg hover:shadow-gold-500/30 transition-all"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}

            {/* ═══ Templates Section ═══ */}
            {activeSection === 'templates' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <HiTemplate className="text-gold-400" />
                  إدارة القوالب
                </h2>

                {/* Upload Area */}
                <div className="mb-6">
                  <label className="block border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-gold-500/30 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files.length) handleUploadTemplates(e.target.files)
                        e.target.value = ''
                      }}
                    />
                    <HiPhotograph className="text-4xl text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-300 text-sm font-medium mb-1">ارفع صور القوالب هنا</p>
                    <p className="text-gray-500 text-xs">PNG أو JPG — يمكنك رفع عدة صور دفعة واحدة</p>
                  </label>
                </div>

                {/* Templates Grid */}
                {managedTemplates.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gold-400">القوالب المرفوعة ({managedTemplates.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {managedTemplates.map((t) => (
                        <div key={t.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                          <img src={t.image} alt={t.name} className="w-full aspect-square object-cover" />
                          <div className="p-2 bg-white/5">
                            <input
                              type="text"
                              value={t.name}
                              onChange={(e) => handleRenameTemplate(t.id, e.target.value)}
                              className="w-full bg-transparent text-white text-xs text-center focus:outline-none focus:bg-white/10 rounded px-1 py-0.5"
                              dir="rtl"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteTemplate(t.id)}
                            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <BsTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">لا توجد قوالب مرفوعة بعد</p>
                    <p className="text-gray-600 text-xs mt-1">ارفع صور القوالب المصممة لعرضها للمستخدمين</p>
                  </div>
                )}
              </div>
            )}

            {/* ═══ Domain Section ═══ */}
            {activeSection === 'domain' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsGlobe className="text-gold-400" />
                  إعدادات النطاق
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">النطاق المخصص</label>
                    <input
                      type="text"
                      value={config.domain}
                      onChange={(e) => setConfig({ domain: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-gold-500/50 focus:outline-none"
                      dir="ltr"
                      placeholder="greetings.yourcompany.com"
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">
                      أضف سجل CNAME يشير إلى <code className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-200">app.tahani.sa</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ API Section ═══ */}
            {activeSection === 'api' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsKey className="text-gold-400" />
                  مفاتيح API
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">مفتاح API الخاص بك</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={apiKey}
                        readOnly
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:outline-none"
                        dir="ltr"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey)
                          toast.success('تم نسخ المفتاح!')
                        }}
                        className="px-4 rounded-xl bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-all"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-300 text-sm">
                      ⚠️ لا تشارك مفتاح API مع أي شخص. استخدمه فقط في السيرفر الخاص بك.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-white mb-2">مثال على الاستخدام:</h4>
                    <pre className="text-xs text-gray-400 overflow-x-auto" dir="ltr">{`
POST /api/v1/cards/generate
Authorization: Bearer ${apiKey}

{
  "template_id": 1,
  "main_text": "عيد مبارك",
  "recipient_name": "أحمد",
  "font": "cairo",
  "theme": "golden"
}
                    `}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Users Section ═══ */}
            {activeSection === 'users' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsPeople className="text-gold-400" />
                  المستخدمين
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">الاسم</th>
                        <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">البريد</th>
                        <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">الخطة</th>
                        <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">البطاقات</th>
                        <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">آخر نشاط</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white text-sm">{user.name}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm" dir="ltr">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.plan === 'شركات' ? 'bg-green-500/20 text-green-400' :
                              user.plan === 'شخصي' ? 'bg-gold-500/20 text-gold-400' :
                              'bg-white/10 text-gray-400'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300 text-sm">{user.cards}</td>
                          <td className="py-3 px-4 text-gray-500 text-sm" dir="ltr">{user.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ Reports Section ═══ */}
            {activeSection === 'reports' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsBarChart className="text-gold-400" />
                  التقارير والإحصائيات
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-gray-400 mb-4">البطاقات المُنشأة (آخر 7 أيام)</h4>
                    <div className="flex items-end gap-1 h-32">
                      {[45, 62, 38, 70, 55, 82, 91].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full gradient-gold rounded-t-lg transition-all hover:opacity-80"
                            style={{ height: `${(v / 100) * 100}%` }}
                          ></div>
                          <span className="text-[10px] text-gray-500">{['سبت', 'أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-gray-400 mb-4">أكثر القوالب استخداماً</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'هلال ذهبي', pct: 35 },
                        { name: 'زخرفة إسلامية', pct: 25 },
                        { name: 'أخضر ملكي', pct: 20 },
                        { name: 'نجوم المساء', pct: 15 },
                        { name: 'بورقندي أنيق', pct: 5 },
                      ].map((t, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{t.name}</span>
                            <span className="text-gold-400">{t.pct}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className="gradient-gold h-2 rounded-full" style={{ width: `${t.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Settings Section ═══ */}
            {activeSection === 'settings' && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BsGear className="text-gold-400" />
                  الإعدادات العامة
                </h2>
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-white mb-2">config.json</h4>
                    <pre className="text-xs text-gray-400 overflow-x-auto" dir="ltr">{JSON.stringify({
                      companyName: config.companyName || 'Your Company',
                      primaryColor: config.primaryColor,
                      secondaryColor: config.secondaryColor,
                      domain: config.domain || 'greetings.yourcompany.com',
                      hideBranding: config.hideBranding,
                      apiKey: apiKey,
                    }, null, 2)}</pre>
                  </div>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify({
                        companyName: config.companyName,
                        primaryColor: config.primaryColor,
                        secondaryColor: config.secondaryColor,
                        domain: config.domain,
                        hideBranding: config.hideBranding,
                      }, null, 2)], { type: 'application/json' })
                      const link = document.createElement('a')
                      link.href = URL.createObjectURL(blob)
                      link.download = 'config.json'
                      link.click()
                      toast.success('تم تحميل ملف الإعدادات!')
                    }}
                    className="px-6 py-3 rounded-xl border border-gold-500/30 text-gold-300 font-medium hover:bg-gold-500/10 transition-all"
                  >
                    تحميل config.json
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
