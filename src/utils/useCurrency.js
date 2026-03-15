import { useState, useEffect } from 'react'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

const TZ_COUNTRY = {
  'Asia/Riyadh': 'SA', 'Asia/Dubai': 'AE', 'Asia/Muscat': 'OM', 'Asia/Qatar': 'QA',
  'Asia/Bahrain': 'BH', 'Asia/Kuwait': 'KW', 'Africa/Cairo': 'EG', 'Asia/Amman': 'JO',
  'Asia/Baghdad': 'IQ', 'Asia/Beirut': 'LB', 'Asia/Damascus': 'SY', 'Asia/Aden': 'YE',
  'Africa/Casablanca': 'MA', 'Africa/Tunis': 'TN', 'Africa/Algiers': 'DZ', 'Africa/Tripoli': 'LY',
  'Africa/Khartoum': 'SD', 'Asia/Gaza': 'PS', 'Asia/Hebron': 'PS',
  'Europe/Istanbul': 'TR', 'Asia/Karachi': 'PK', 'Asia/Kolkata': 'IN', 'Asia/Dhaka': 'BD',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'Europe/London': 'GB', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN',
  'Asia/Seoul': 'KR', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH',
  'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK', 'Asia/Bangkok': 'TH',
  'Australia/Sydney': 'AU', 'Pacific/Auckland': 'NZ', 'America/Toronto': 'CA',
  'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX', 'Africa/Johannesburg': 'ZA',
}

export const CURRENCY_NAMES = {
  SAR: 'ريال سعودي', AED: 'درهم إماراتي', KWD: 'دينار كويتي', BHD: 'دينار بحريني',
  OMR: 'ريال عماني', QAR: 'ريال قطري', EGP: 'جنيه مصري', JOD: 'دينار أردني',
  LBP: 'ليرة لبنانية', IQD: 'دينار عراقي', MAD: 'درهم مغربي', TND: 'دينار تونسي',
  DZD: 'دينار جزائري', LYD: 'دينار ليبي', ILS: 'شيكل',
  USD: 'دولار أمريكي', EUR: 'يورو', GBP: 'جنيه إسترليني',
  TRY: 'ليرة تركية', INR: 'روبية هندية', PKR: 'روبية باكستانية',
  MYR: 'رينغيت ماليزي', SGD: 'دولار سنغافوري', HKD: 'دولار هونغ كونغ',
  JPY: 'ين ياباني', CNY: 'يوان صيني', KRW: 'وون كوري',
  CAD: 'دولار كندي', AUD: 'دولار أسترالي', BRL: 'ريال برازيلي',
}

export const COUNTRY_FLAG = {
  SA: '🇸🇦', AE: '🇦🇪', KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲', QA: '🇶🇦',
  EG: '🇪🇬', JO: '🇯🇴', LB: '🇱🇧', IQ: '🇮🇶', MA: '🇲🇦', TN: '🇹🇳',
  DZ: '🇩🇿', LY: '🇱🇾', SD: '🇸🇩', PS: '🇵🇸', TR: '🇹🇷', IN: '🇮🇳',
  PK: '🇵🇰', US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸',
  JP: '🇯🇵', CN: '🇨🇳', SG: '🇸🇬', AU: '🇦🇺', CA: '🇨🇦',
}

function detectCountry() {
  try { return TZ_COUNTRY[Intl.DateTimeFormat().resolvedOptions().timeZone] || null }
  catch { return null }
}

// Module-level singleton — shared across all instances
let _cache = null
let _cacheTs = 0
let _inflight = null
const TTL = 30 * 1000

function getPreferredCurrency() {
  try { return localStorage.getItem('sallim_currency') || null } catch { return null }
}

export function setPreferredCurrency(code) {
  try {
    if (code) localStorage.setItem('sallim_currency', code)
    else localStorage.removeItem('sallim_currency')
  } catch {}
  _cache = null
  _cacheTs = 0
}

export async function fetchRates() {
  if (_cache && Date.now() - _cacheTs < TTL) return _cache
  if (_inflight) return _inflight
  const country = detectCountry()
  const preferred = getPreferredCurrency()
  const params = new URLSearchParams()
  if (country) params.set('country', country)
  if (preferred) params.set('currency', preferred)
  const qs = params.toString()
  const url = `${apiBase}/api/v1/checkout/exchange-rate${qs ? `?${qs}` : ''}`
  _inflight = fetch(url)
    .then(r => r.json())
    .then(d => { if (d?.success) { _cache = d; _cacheTs = Date.now() }; _inflight = null; return _cache })
    .catch(() => { _inflight = null; return _cache })
  return _inflight
}

// Pre-fetch silently on module import
fetchRates()

export function useCurrency() {
  const [info, setInfo] = useState(_cache)

  useEffect(() => {
    if (_cache) { setInfo(_cache); return }
    fetchRates().then(d => { if (d) setInfo(d) })
  }, [])

  useEffect(() => {
    const id = setInterval(() => fetchRates().then(d => { if (d) setInfo(d) }), TTL)
    return () => clearInterval(id)
  }, [])

  // Re-fetch when currency preference changes (custom event)
  useEffect(() => {
    const onCurrencyChange = () => fetchRates().then(d => { if (d) setInfo(d) })
    window.addEventListener('currency-change', onCurrencyChange)
    return () => window.removeEventListener('currency-change', onCurrencyChange)
  }, [])

  // isForeign: true whenever the active currency is not SAR (auto-detected or manually chosen)
  const isForeign = !!(info && info.visitorCurrency && info.visitorCurrency !== 'SAR')

  function convertFromSAR(amountSAR) {
    if (!isForeign || !amountSAR || !info.visitorRate) return null
    return (Math.ceil(amountSAR * info.visitorRate * 100) / 100).toFixed(2)
  }

  // For the flag: prefer the visitor's country flag; fall back to a flag matching the chosen currency
  const currencyCountry = info?.country || Object.keys(COUNTRY_FLAG).find(
    c => (({ SA:'SAR',AE:'AED',KW:'KWD',BH:'BHD',OM:'OMR',QA:'QAR',EG:'EGP',JO:'JOD',
              US:'USD',GB:'GBP',DE:'EUR',JP:'JPY' })[c] === info?.visitorCurrency)
  )

  return {
    exchangeInfo: info,
    isForeign,
    convertFromSAR,
    currency: info?.visitorCurrency || 'SAR',
    currencyName: CURRENCY_NAMES[info?.visitorCurrency] || '',
    flag: COUNTRY_FLAG[currencyCountry] || '🌍',
  }
}
