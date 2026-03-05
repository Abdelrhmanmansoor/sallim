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

  const activeCategoryMeta = useMemo(
    () => (activeCategory === 'all' ? null : textCategories.find(c => c.id === activeCategory)),
    [activeCategory]
  )

  const resetFilters = () => {
    setSearchQuery('')
    setActiveCategory('all')
  }

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
    <div className="page-shell pb-14 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#17012C', color: '#f0f0f0', border: '1px solid rgba(106,71,237,0.3)' } }} />
      
      <div className="max-w-7xl mx-auto">
        {/* Premium Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#6A47ED]/25 bg-gradient-to-br from-[#241047]/95 via-[#1a0838]/96 to-[#12052d]/98 px-6 sm:px-10 md:px-14 py-12 md:py-16 mb-12 shadow-[0_30px_80px_rgba(5,0,16,0.55)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#6A47ED]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#C6F806]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C6F806]/25 bg-[#C6F806]/10 px-4 py-1.5 text-[11px] font-bold tracking-wider text-[#C6F806] mb-4">
                <BsMoonStars className="text-xs" />
                مكتبة تهاني احترافية
              </span>

              <h1 className="text-3xl md:text-5xl font-black mb-3">
                <span className="gradient-gold-text">بنك النصوص الفاخر</span>
              </h1>
              <p className="text-white/65 text-base md:text-lg leading-[1.9] max-w-2xl">
                نصوص مصاغة بعناية لكل حالة: رسمي، عائلي، قصير، أو مخصص للتصميم السريع داخل المحرر.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
                <p className="text-[#C6F806] text-2xl font-black tabular-nums">{greetingTexts.length}+</p>
                <p className="text-white/55 text-xs mt-1.5">نص جاهز</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
                <p className="text-[#A78BFA] text-2xl font-black tabular-nums">{textCategories.length}</p>
                <p className="text-white/55 text-xs mt-1.5">تصنيف</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search + categories */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 mb-10">
          <div className="relative mb-6">
            <BsSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C6F806]/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#100327]/80 border border-[#6A47ED]/30 rounded-2xl pr-12 pl-4 py-4 text-white text-base focus:border-[#C6F806]/50 focus:outline-none focus:ring-2 focus:ring-[#6A47ED]/20 transition-all"
              dir="rtl"
              placeholder="ابحث في النصوص... (مثال: عائلة، شعر، رسمي)"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#6A47ED] to-[#8B6CF6] text-white shadow-lg shadow-[#6A47ED]/30'
                  : 'bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-[#6A47ED]/35'
              }`}
            >
              الكل ({greetingTexts.length})
            </button>

            {textCategories.map((cat) => {
              const count = cat.count ?? greetingTexts.filter(t => t.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[#6A47ED] to-[#8B6CF6] text-white shadow-lg shadow-[#6A47ED]/30'
                      : 'bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-[#6A47ED]/35'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-xs opacity-75 tabular-nums">({count})</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <p className="text-white/65 text-sm">
            عرض <span className="text-[#C6F806] font-black tabular-nums">{filteredTexts.length}</span> نص
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {activeCategoryMeta && (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold bg-[#6A47ED]/15 border border-[#6A47ED]/30 text-[#A78BFA]">
                <span>{activeCategoryMeta.icon}</span>
                <span>{activeCategoryMeta.label}</span>
              </span>
            )}

            {(searchQuery || activeCategory !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-[#C6F806] text-xs sm:text-sm font-semibold hover:text-white transition-colors"
              >
                مسح التصفية
              </button>
            )}
          </div>
        </div>

        {/* Texts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTexts.map((item, i) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#241047]/95 via-[#1a0838]/95 to-[#120529]/98 p-6 shadow-[0_16px_42px_rgba(4,0,14,0.42)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C6F806]/30 hover:shadow-[0_22px_56px_rgba(36,16,87,0.5)] animate-fade-in-up"
              style={{ animationDelay: `${(i % 12) * 0.03}s` }}
            >
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#C6F806]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Category Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#6A47ED]/15 border border-[#6A47ED]/30 text-[#A78BFA] font-semibold inline-flex items-center gap-1.5">
                  {textCategories.find(c => c.id === item.category)?.icon}{' '}
                  {textCategories.find(c => c.id === item.category)?.label}
                </span>
                <span className="text-white/35 text-xs tabular-nums">#{item.id}</span>
              </div>

              {/* Text */}
              <p className="text-white/90 text-[15px] leading-[2] mb-4 font-tajawal whitespace-pre-line" dir="rtl">
                {item.text}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag, ti) => (
                  <span key={ti} className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/45">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => copyText(item.text, item.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    copiedId === item.id
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                      : 'bg-white/[0.04] border border-white/10 text-white/75 hover:bg-white/[0.08]'
                  }`}
                >
                  <BsClipboard />
                  {copiedId === item.id ? 'تم النسخ!' : 'نسخ'}
                </button>
                <button
                  onClick={() => useInEditor(item.text)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#6A47ED]/30 to-[#8B6CF6]/20 border border-[#6A47ED]/40 text-[#c8b6ff] hover:text-white hover:from-[#6A47ED]/45 hover:to-[#8B6CF6]/35 transition-all"
                >
                  <BsMoonStars />
                  استخدم في المحرر
                  <BsArrowLeft className="text-[11px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTexts.length === 0 && (
          <div className="text-center py-20 rounded-3xl border border-white/10 bg-gradient-to-br from-[#231046]/80 to-[#12052b]/90">
            <p className="text-white/70 text-lg">لا توجد نتائج للبحث</p>
            <button
              onClick={resetFilters}
              className="text-[#C6F806] mt-3 hover:text-white transition-colors"
            >
              عرض جميع النصوص
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
