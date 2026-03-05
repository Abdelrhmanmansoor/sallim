import { useState, useMemo } from 'react'
import { greetingTexts, textCategories } from '../data/texts'
import { useEditorStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { BsSearch, BsClipboard, BsArrowLeft, BsMoonStars } from 'react-icons/bs'
import toast, { Toaster } from 'react-hot-toast'

export default function TextBankPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const store = useEditorStore()
  const navigate = useNavigate()

  const filteredTexts = useMemo(() => {
    let texts = greetingTexts
    if (activeCategory !== 'all') {
      texts = texts.filter(t => t.category === activeCategory)
    }
    if (searchQuery) {
      texts = texts.filter(t =>
        t.text.includes(searchQuery) ||
        t.tags.some(tag => tag.includes(searchQuery))
      )
    }
    return texts
  }, [activeCategory, searchQuery])

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('تم نسخ النص!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const useInEditor = (text) => {
    const parts = text.split('\n')
    store.setMainText(parts[0] || text.substring(0, 50))
    if (parts.length > 1) {
      store.setSubText(parts.slice(1).join('\n'))
    } else if (text.length > 50) {
      store.setSubText(text.substring(50))
    }
    toast.success('تم نقل النص للمحرر!')
    navigate('/editor')
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0c0d12', color: '#f0f0f0', border: '1px solid rgba(184,150,58,0.2)' } }} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="gradient-gold-text">بنك النصوص</span>
          </h1>
          <p className="text-gray-400 text-lg">
            أكثر من <span className="text-gold-400 font-bold">100 نص تهنئة</span> جاهز للاستخدام
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <BsSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pr-11 pl-4 py-4 text-white text-base focus:border-gold-500/50 focus:outline-none transition-colors"
              dir="rtl"
              placeholder="ابحث في النصوص... (مثال: عائلة، شعر، رسمي)"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'gradient-gold text-gray-900'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            الكل ({greetingTexts.length})
          </button>
          {textCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'gradient-gold text-gray-900'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            عرض <span className="text-gold-400 font-bold">{filteredTexts.length}</span> نص
          </p>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="text-gold-400 text-sm hover:underline"
            >
              مسح البحث
            </button>
          )}
        </div>

        {/* Texts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTexts.map((item, i) => (
            <div
              key={item.id}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group animate-fade-in-up"
              style={{ animationDelay: `${(i % 12) * 0.03}s` }}
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gold-500/10 text-gold-400">
                  {textCategories.find(c => c.id === item.category)?.icon}{' '}
                  {textCategories.find(c => c.id === item.category)?.label}
                </span>
                <span className="text-gray-600 text-xs">#{item.id}</span>
              </div>

              {/* Text */}
              <p className="text-gray-200 text-sm leading-loose mb-4 font-tajawal whitespace-pre-line" dir="rtl">
                {item.text}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag, ti) => (
                  <span key={ti} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyText(item.text, item.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    copiedId === item.id
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <BsClipboard />
                  {copiedId === item.id ? 'تم النسخ!' : 'نسخ'}
                </button>
                <button
                  onClick={() => useInEditor(item.text)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-all"
                >
                  <BsMoonStars />
                  استخدم في المحرر
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTexts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">لا توجد نتائج للبحث 🔍</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="text-gold-400 mt-3 hover:underline"
            >
              عرض جميع النصوص
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
