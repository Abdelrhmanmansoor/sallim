import { useState, useMemo } from 'react'
import { greetingTexts, textCategories } from '../data/texts'
import { useEditorStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { Search, Copy, ArrowLeft, Sparkles, Check } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function TextBankPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const store = useEditorStore()
  const navigate = useNavigate()

  const filteredTexts = useMemo(() => {
    let texts = greetingTexts
    if (activeCategory !== 'all') texts = texts.filter(t => t.category === activeCategory)
    if (searchQuery) texts = texts.filter(t => t.text.includes(searchQuery) || t.tags.some(tag => tag.includes(searchQuery)))
    return texts
  }, [activeCategory, searchQuery])

  const resetFilters = () => { setSearchQuery(''); setActiveCategory('all') }

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('تم نسخ النص!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const useInEditor = (text) => {
    const parts = text.split('\n')
    store.setMainText(parts[0] || text.substring(0, 50))
    if (parts.length > 1) store.setSubText(parts.slice(1).join('\n'))
    else if (text.length > 50) store.setSubText(text.substring(50))
    toast.success('تم نقل النص للمحرر!')
    navigate('/editor')
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#0f172a', color: '#f0f0f0', border: '1px solid rgba(45,212,191,0.3)' } }} />

      {/* Hero header */}
      <section style={{
        background: 'linear-gradient(180deg, #070d1a 0%, #0c1929 50%, #111f36 100%)',
        paddingTop: '140px',
        paddingBottom: '60px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '9999px',
            border: '1px solid rgba(45,212,191,0.2)', background: 'rgba(45,212,191,0.06)', marginBottom: '24px',
          }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#2dd4bf' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2dd4bf' }}>مكتبة تهاني احترافية</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            بنك النصوص
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '32px' }}>
            نصوص مصاغة بعناية لكل حالة — رسمي، عائلي، قصير، أو مخصص
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2dd4bf' }}>{greetingTexts.length}+</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>نص جاهز</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#2dd4bf' }}>{textCategories.length}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>تصنيف</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section style={{ background: '#ffffff', paddingTop: '48px', paddingBottom: '0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في النصوص..."
              dir="rtl"
              style={{
                width: '100%', padding: '16px 48px 16px 16px',
                borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fafbfc',
                fontSize: '15px', fontFamily: 'inherit', outline: 'none', color: '#0f172a',
              }}
              onFocus={e => e.target.style.borderColor = '#2dd4bf'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '10px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                border: activeCategory === 'all' ? 'none' : '1px solid #e2e8f0',
                background: activeCategory === 'all' ? 'linear-gradient(135deg, #2dd4bf, #06b6d4)' : '#fff',
                color: activeCategory === 'all' ? '#020617' : '#64748b',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              الكل ({greetingTexts.length})
            </button>
            {textCategories.map(cat => {
              const count = cat.count ?? greetingTexts.filter(t => t.category === cat.id).length
              const active = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '10px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                    border: active ? 'none' : '1px solid #e2e8f0',
                    background: active ? 'linear-gradient(135deg, #2dd4bf, #06b6d4)' : '#fff',
                    color: active ? '#020617' : '#64748b',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{ opacity: 0.6 }}>({count})</span>
                </button>
              )
            })}
          </div>

          {/* Results info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              عرض <span style={{ color: '#0d9488', fontWeight: 700 }}>{filteredTexts.length}</span> نص
            </p>
            {(searchQuery || activeCategory !== 'all') && (
              <button onClick={resetFilters}
                style={{ fontSize: '13px', color: '#2dd4bf', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >
                مسح التصفية
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Texts Grid */}
      <section style={{ background: '#ffffff', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {filteredTexts.map((item) => (
              <div key={item.id} style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                background: '#fafbfc',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#99f6e4'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Category badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '4px 12px',
                    borderRadius: '9999px', background: '#f0fdfa', color: '#0d9488',
                    border: '1px solid #99f6e4',
                  }}>
                    {textCategories.find(c => c.id === item.category)?.icon}{' '}
                    {textCategories.find(c => c.id === item.category)?.label}
                  </span>
                </div>

                {/* Text */}
                <p dir="rtl" style={{ fontSize: '15px', color: '#1e293b', lineHeight: 2, marginBottom: '14px', whiteSpace: 'pre-line' }}>
                  {item.text}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {item.tags.map((tag, ti) => (
                    <span key={ti} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', background: '#f1f5f9', color: '#94a3b8' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => copyText(item.text, item.id)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                      border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s',
                      background: copiedId === item.id ? '#f0fdf4' : '#fff',
                      color: copiedId === item.id ? '#16a34a' : '#64748b',
                    }}
                  >
                    {copiedId === item.id ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                    {copiedId === item.id ? 'تم النسخ!' : 'نسخ'}
                  </button>
                  <button onClick={() => useInEditor(item.text)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)', color: '#020617',
                    }}
                  >
                    استخدم في المحرر
                    <ArrowLeft style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTexts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fafbfc' }}>
              <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '12px' }}>لا توجد نتائج للبحث</p>
              <button onClick={resetFilters}
                style={{ fontSize: '14px', color: '#2dd4bf', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >
                عرض جميع النصوص
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
