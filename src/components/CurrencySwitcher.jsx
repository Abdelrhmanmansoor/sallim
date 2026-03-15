import { useState, useEffect, useRef } from 'react'
import { useCurrency, setPreferredCurrency, CURRENCY_NAMES, COUNTRY_FLAG } from '../utils/useCurrency'

const POPULAR = [
  { code: 'SAR', country: 'SA' },
  { code: 'EGP', country: 'EG' },
  { code: 'AED', country: 'AE' },
  { code: 'KWD', country: 'KW' },
  { code: 'USD', country: 'US' },
  { code: 'EUR', country: 'DE' },
  { code: 'GBP', country: 'GB' },
]

export default function CurrencySwitcher({ dark = false }) {
  const { currency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const currentFlag = POPULAR.find(c => c.code === currency)
    ? COUNTRY_FLAG[POPULAR.find(c => c.code === currency).country]
    : '🌍'

  useEffect(() => {
    if (!open) return
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const select = (code) => {
    setPreferredCurrency(code === 'SAR' ? null : code)
    window.dispatchEvent(new Event('currency-change'))
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="تغيير العملة"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          fontSize: '13px',
          fontWeight: 700,
          color: dark ? '#fff' : '#374151',
          background: dark ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
          border: '1px solid ' + (dark ? 'rgba(255,255,255,0.2)' : '#e5e5e5'),
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.18)' : '#e8e8e8' }}
        onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }}
      >
        <span style={{ fontSize: '15px' }}>{currentFlag}</span>
        <span>{currency}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 10, height: 10, opacity: 0.5 }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 200,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '160px',
          overflow: 'hidden',
          animation: 'fadeIn 150ms ease',
        }}>
          <div style={{ padding: '8px 12px 6px', fontSize: '10px', fontWeight: 700, color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
            اختر العملة
          </div>
          {POPULAR.map(({ code, country }) => (
            <button
              key={code}
              onClick={() => select(code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px 14px',
                fontSize: '13px',
                fontWeight: currency === code ? 700 : 500,
                color: currency === code ? '#b8860b' : '#374151',
                background: currency === code ? '#fffdf0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'right',
                transition: 'background 100ms',
              }}
              onMouseEnter={e => { if (currency !== code) e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={e => { if (currency !== code) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '16px' }}>{COUNTRY_FLAG[country]}</span>
              <span style={{ flex: 1 }}>{CURRENCY_NAMES[code]}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af' }}>{code}</span>
              {currency === code && (
                <svg viewBox="0 0 20 20" fill="#b8860b" style={{ width: 12, height: 12 }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  )
}
