import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Group, Circle } from 'react-konva'
import { useEditorStore, useCompanyStore } from '../store'
import { templates as staticTemplates, fonts, designerOnlyTemplates as staticDesignerTemplates } from '../data/templates'
import { greetingTexts } from '../data/texts'
import { activateLicense, capturePayPalOrder, consumeBatchOrder, consumePersonalOrder, createBatchOrder, createPayPalOrder, createPersonalOrder, getPaymobFlashStatus, getPersonalOrder, getTemplates, logProtectionEvent, trackStat, verifyLicense } from '../utils/api'
import { useCompany } from '../context/CompanyContext'
import { calligraphy, calligraphyCategories } from '../data/calligraphy'
import { BsDownload, BsFilePdf, BsWhatsapp, BsLink45Deg, BsShareFill, BsCheck2, BsPencilFill, BsStars, BsSearch, BsPersonCircle, BsImage, BsChatLeftText, BsSliders, BsPlusLg, BsX, BsArrowLeft, BsInfoCircle, BsBuilding, BsPeople, BsFileEarmarkText, BsCloudDownload, BsTwitterX, BsFacebook } from 'react-icons/bs'
import { HiPhotograph, HiOutlineColorSwatch } from 'react-icons/hi'
import JSZip from 'jszip'
import toast, { Toaster } from 'react-hot-toast'

class EditorErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorInfo: null } }
  static getDerivedStateFromError(error) { 
    console.error('EditorErrorBoundary caught an error:', error)
    return { hasError: true, errorInfo: error?.message || 'Unknown error' } 
  }
  
  componentDidCatch(err, info) {
    console.error('EditorPage error:', err)
    console.error('Error info:', info)
    console.error('Component stack:', info.componentStack)
    
    try {
      const errors = JSON.parse(localStorage.getItem('editor_errors') || '[]')
      errors.push({
        message: err?.message,
        stack: err?.stack,
        timestamp: new Date().toISOString()
      })
      if (errors.length > 10) errors.shift()
      localStorage.setItem('editor_errors', JSON.stringify(errors))
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Tajawal', sans-serif", direction: 'rtl' }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>⚠️ حدث خطأ في المحرر</h2>
          <p style={{ marginBottom: 20, color: '#666' }}>
            {this.state.errorInfo || 'يرجى إعادة تحميل الصفحة'}
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false, errorInfo: null })
              window.location.reload()
            }}
            style={{ 
              padding: '12px 28px', 
              background: '#000', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 12, 
              fontSize: 16, 
              cursor: 'pointer',
              marginBottom: 16
            }}
          >
            إعادة تحميل
          </button>
          <button 
            onClick={() => {
              try {
                localStorage.removeItem('editor_errors')
                this.setState({ hasError: false, errorInfo: null })
              } catch (e) {
                console.error('Failed to clear errors:', e)
              }
            }}
            style={{ 
              padding: '10px 20px', 
              background: 'transparent', 
              color: '#666', 
              border: '1px solid #ddd', 
              borderRadius: 12, 
              fontSize: 14, 
              cursor: 'pointer',
              fontFamily: "'Tajawal', sans-serif"
            }}
          >
            محاولة المتابعة
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
   DESIGN SYSTEM - Tajawal Font, Clean UI
أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
const ds = {
  font: "'Tajawal', sans-serif",
  colors: {
    primary: '#000',
    secondary: '#666',
    muted: '#999',
    border: '#e5e5e5',
    bg: '#fafafa',
    card: '#fff',
    accent: '#2563eb',
    success: '#10b981',
    danger: '#ef4444',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 30px rgba(0,0,0,0.12)',
  }
}

const PERSONAL_CARD_PRICE = 29
const BATCH_ZIP_PRICE = 79
const BATCH_PAYPAL_USD_PRICE = 21
const BATCH_ZIP_MAX_RECIPIENTS = 50
const LICENSE_TOKEN_KEY = 'eidgreet_license_token'
const LICENSE_DEVICE_KEY = 'eidgreet_license_device'
const PAYPAL_BATCH_PENDING_KEY = 'eidgreet_paypal_batch_pending'
const PAYPAL_RETURN_PATH_KEY = 'eidgreet_paypal_return_path'
const SUPPORT_CONTACT = '+201007835547'
const PREVIEW_NOTICE_KEY = 'sallim_preview_notice_seen'
const PAYMENT_WARNING_KEY = 'sallim_payment_warning_seen'
const PERSONAL_CHECKOUT_KEY = 'sallim_personal_checkout'

// Template IDs that are free (no payment required)
const FREE_TEMPLATE_IDS = new Set([3, '3', 114, '114', 5, '5', 7, '7', 8, '8', 9, '9', 16, '16'])

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Custom Hook: Load Image أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
function useImage(src) {
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!src) { setImage(null); setLoaded(false); return }
    setImage(null)
    setLoaded(false)
    let cancelled = false
    const img = new window.Image()
    // Only set crossOrigin for external URLs to avoid tainted canvas issues
    if (src.startsWith('http')) img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      setImage(img); setLoaded(true)
    }
    img.onerror = (err) => {
      console.warn('Image load failed:', src, err)
      if (!cancelled) { setImage(null); setLoaded(false) }
    }
    img.src = src
    return () => { cancelled = true }
  }, [src])
  return [image, loaded]
}

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Draggable Text Component أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
function DraggableText({ text, x, y, width, fontSize, fontFamily, fill, align, opacity, shadowEnabled, shadowColor, shadowBlur, strokeEnabled, stroke, strokeWidth, rotation, onDragEnd, onClick, lineHeight, padding }) {
  if (!text) return null

  return (
    <Text
      text={text} x={x} y={y} width={width} align={align || 'center'}
      fontFamily={fontFamily} fontSize={fontSize} fill={fill}
      opacity={opacity || 1} lineHeight={lineHeight || 1.5} padding={padding || 0}
      wrap="word" rotation={rotation || 0} draggable
      shadowColor={shadowEnabled ? (shadowColor || 'rgba(0,0,0,0.6)') : undefined}
      shadowBlur={shadowEnabled ? (shadowBlur || 8) : 0}
      stroke={strokeEnabled ? stroke : undefined}
      strokeWidth={strokeEnabled ? strokeWidth : 0}
      onDragEnd={onDragEnd} onClick={onClick} onTap={onClick}
      shadowEnabled={shadowEnabled}
    />
  )
}

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Tooltip Component أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff', padding: '6px 12px', borderRadius: 8,
          fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', marginBottom: 8, zIndex: 100,
          fontFamily: ds.font, animation: 'tooltipIn 150ms ease'
        }}>
          {text}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            border: '6px solid transparent', borderTopColor: '#1a1a1a'
          }} />
        </div>
      )}
    </div>
  )
}

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Quick Colors أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
const quickColors = ['#ffffff', '#000000', '#d4a843', '#2563eb', '#fbbf24', '#ef4444', '#4ade80', '#f472b6', '#93c5fd', '#c4b5fd', '#f97316', '#14b8a6']

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Color Picker Row أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
function ColorPicker({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 13, color: ds.colors.secondary, minWidth: 60, fontFamily: ds.font }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {quickColors.slice(0, 8).map(c => (
          <button key={c} onClick={() => onChange(c)}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: value === c ? '2px solid #000' : '1px solid #ddd',
              backgroundColor: c, cursor: 'pointer', transition: 'transform 150ms',
              transform: value === c ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', border: 'none', padding: 0 }} />
      </div>
    </div>
  )
}

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Ready Designs أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
const readyDesigns = [
  { id: 'r10', name: 'تصميم جاهز ١٠', template: '/templates/جاهزة/10.png', nameColor: '#ffffff' },
  { id: 'r11', name: 'تصميم جاهز ١١', template: '/templates/جاهزة/11.png', nameColor: '#ffffff' },
  { id: 'r12', name: 'تصميم جاهز ١٢', template: '/templates/جاهزة/13.png', nameColor: '#ffffff' },
  { id: 'r13', name: 'تصميم جاهز ١٣', template: '/templates/جاهزة/14.png', nameColor: '#ffffff' },
  { id: 'r14', name: 'تصميم جاهز ١٤', template: '/templates/جاهزة/15.png', nameColor: '#ffffff' },
  { id: 'r15', name: 'تصميم جاهز ١٥', template: '/templates/جاهزة/16.png', nameColor: '#ffffff' },
  { id: 'r16', name: 'تصميم جاهز ١٦', template: '/templates/جاهزة/17.png', nameColor: '#ffffff' },
  { id: 'r1', name: 'تصميم جاهز ١', template: '/templates/جاهزة/3.png', nameColor: '#ffffff' },
  { id: 'r2', name: 'تصميم جاهز ٢', template: '/templates/جاهزة/5.png', nameColor: '#ffffff' },
  { id: 'r3', name: 'تصميم جاهز ٣', template: '/templates/جاهزة/6.png', nameColor: '#ffffff' },
  { id: 'r4', name: 'تصميم جاهز ٤', template: '/templates/جاهزة/7.png', nameColor: '#ffffff' },
  { id: 'r5', name: 'تصميم جاهز ٥', template: '/templates/جاهزة/8.png', nameColor: '#ffffff' },
  { id: 'r6', name: 'تصميم جاهز ٦', template: '/templates/جاهزة/9.png', nameColor: '#ffffff' },
  { id: 'r7', name: 'تصميم جاهز ٧', template: '/templates/جاهزة/Artboard 1.png', nameColor: '#ffffff' },
  { id: 'r8', name: 'تصميم جاهز ٨', template: '/templates/جاهزة/Artboard 2.png', nameColor: '#ffffff' },
  { id: 'r9', name: 'تصميم جاهز ٩', template: '/templates/جاهزة/Artboard 4.png', nameColor: '#ffffff' },
]

/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
   MAIN EDITOR COMPONENT
أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
function EditorPageInner() {
  const store = useEditorStore()
  const { company, activeCompany, contextMode } = useCompany()
  const navigate = useNavigate()
  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const autoDownloadAttemptedRef = useRef(false)
  const protectionCooldownRef = useRef({})
  const protectionStateRef = useRef({
    isCompanyUnlocked: false,
    personalOrderStatus: null,
  })
  const personalDownloadRef = useRef(null)
  const logProtectedActionRef = useRef(() => { })
  const pendingPersonalPurchaseRef = useRef(null)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const isTrial = !!(location.state?.isTrial)

  // API Templates State
  const [fetchedTemplates, setFetchedTemplates] = useState([])
  const [dbReadyTemplates, setDbReadyTemplates] = useState([])
  const [dbDesignerTemplates, setDbDesignerTemplates] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)

  // Mode & State
  const [mode, setMode] = useState('ready')
  const [readyName, setReadyName] = useState('')
  const [readySenderName, setReadySenderName] = useState('')
  const [readyFontSize, setReadyFontSize] = useState(60)
  const [readyNameY, setReadyNameY] = useState(0.65)
  const [readyNameColor, setReadyNameColor] = useState(null)
  const [readySenderY, setReadySenderY] = useState(0.75)
  const [readySenderFontSize, setReadySenderFontSize] = useState(40)
  const [activePanel, setActivePanel] = useState('backgrounds')
  const [stageSize, setStageSize] = useState({ width: 540, height: 540 })
  const [searchText, setSearchText] = useState('')
  const [calligraphyCat, setCalligraphyCat] = useState('white')
  const [calligraphyLimit, setCalligraphyLimit] = useState(30)
  const [customTemplates, setCustomTemplates] = useState([])
  const [copied, setCopied] = useState(false)
  const [showProtectionNotice, setShowProtectionNotice] = useState(false)
  const [showPaymentWarning, setShowPaymentWarning] = useState(false)
  const [protectionFlash, setProtectionFlash] = useState(false)
  const [processingPersonalOrder, setProcessingPersonalOrder] = useState(false)
  const [activePersonalOrder, setActivePersonalOrder] = useState(null)
  const [temporarilyUnlocked, setTemporarilyUnlocked] = useState(false)
  const [personalPaymentError, setPersonalPaymentError] = useState('')
  const [processingBatchOrder, setProcessingBatchOrder] = useState(false)
  const [activeBatchOrder, setActiveBatchOrder] = useState(null)
  const [batchPaymentData, setBatchPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })
  const [batchPaymentError, setBatchPaymentError] = useState('')
  const [batchWhatsAppPresetId, setBatchWhatsAppPresetId] = useState('ksa_formal_1')
  const [batchWhatsAppTemplate, setBatchWhatsAppTemplate] = useState('عيدكم مبارك، وتقبل الله طاعتكم، وكل عام وأنتم بخير.')
  const [batchNamesInputMode, setBatchNamesInputMode] = useState('list')
  const batchNameRefs = useRef([])
  const [licenseCode, setLicenseCode] = useState('')
  const [licenseActive, setLicenseActive] = useState(false)
  const [licenseMaxRecipients, setLicenseMaxRecipients] = useState(0)
  const [licenseError, setLicenseError] = useState('')
  const [showBatchCardPayment, setShowBatchCardPayment] = useState(false)
  const [processingPayPal, setProcessingPayPal] = useState(false)
  const [payPalError, setPayPalError] = useState('')
  const scopedCompany = activeCompany || company || null
  const companyIsActive = Boolean(
    scopedCompany &&
    (scopedCompany.status === 'active' || scopedCompany.isActive !== false)
  )

  // Handle URL template parameter - select template from landing page
  const urlTemplateId = searchParams.get('template')
  useEffect(() => {
    if (urlTemplateId) {
      const numericTemplateId = Number(urlTemplateId)
      const id = Number.isNaN(numericTemplateId) ? urlTemplateId : numericTemplateId
      useEditorStore.getState().setTemplate(id)
      setMode('ready')
      // Free templates bypass payment protection (from URL or by ID)
      if (searchParams.get('free') === '1' || FREE_TEMPLATE_IDS.has(id)) {
        setTemporarilyUnlocked(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTemplateId])

  // Apply prefilledName from navigation state (trial mode)
  useEffect(() => {
    if (location.state?.prefilledName) {
      setReadyName(location.state.prefilledName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load custom templates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eidgreet_custom_templates')
      if (saved) setCustomTemplates(JSON.parse(saved))
    } catch { }
  }, [])

  const getOrCreateLicenseDeviceId = useCallback(() => {
    try {
      const existing = localStorage.getItem(LICENSE_DEVICE_KEY)
      if (existing) return existing
      const id = (crypto?.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`)
      localStorage.setItem(LICENSE_DEVICE_KEY, id)
      return id
    } catch {
      return `dev-${Date.now()}`
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadLicense() {
      setLicenseError('')
      try {
        const token = localStorage.getItem(LICENSE_TOKEN_KEY)
        if (!token) {
          if (!cancelled) {
            setLicenseActive(false)
            setLicenseMaxRecipients(0)
          }
          return
        }
        const res = await verifyLicense()
        if (cancelled) return
        setLicenseActive(Boolean(res.data?.active))
        setLicenseMaxRecipients(Number(res.data?.maxRecipients || 0))
      } catch (err) {
        try { localStorage.removeItem(LICENSE_TOKEN_KEY) } catch { }
        if (!cancelled) {
          setLicenseActive(false)
          setLicenseMaxRecipients(0)
        }
      }
    }
    loadLicense()
    return () => { cancelled = true }
  }, [])

  const activateLicenseCode = useCallback(async () => {
    try {
      setLicenseError('')
      const deviceId = getOrCreateLicenseDeviceId()
      const res = await activateLicense(licenseCode, deviceId)
      const token = res.data?.token
      if (!token) throw new Error('تعذر تفعيل الكود.')
      localStorage.setItem(LICENSE_TOKEN_KEY, token)
      setLicenseActive(true)
      setLicenseMaxRecipients(Number(res.data?.maxRecipients || 0))
      setLicenseCode('')
      toast.success('تم تفعيل الكود بنجاح.')
    } catch (err) {
      const message = err?.message || 'تعذر تفعيل الكود.'
      setLicenseError(message)
      toast.error(message)
    }
  }, [getOrCreateLicenseDeviceId, licenseCode])

  // Fetch templates from API
  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoadingTemplates(true)
        const res = await getTemplates()
        if (res.success && res.data) {

          // Filter templates based on company access
          const accessibleTemplates = res.data.filter(t => {
            if (t.type === 'public') return true

            // If it's premium or exclusive, company must be logged in and active
            if (!companyIsActive) return false

            if (t.type === 'premium') return true // All active companies get premium

            if (t.type === 'exclusive') {
              // Must have the specific feature flag
              return scopedCompany?.features && scopedCompany.features.includes(t.requiredFeature)
            }
            return false
          })

          setFetchedTemplates(accessibleTemplates)

          // Map to editor format
          const mappedReady = accessibleTemplates
            .filter(t => t.type === 'public' || t.type === 'premium')
            .map(t => ({ id: t._id, name: t.name, image: t.imageUrl, textColor: '#ffffff' }))

          const mappedDesigner = accessibleTemplates
            .filter(t => t.type === 'exclusive')
            .map(t => ({ id: t._id, name: t.name, image: t.imageUrl, textColor: '#ffffff', exclusive: true }))

          setDbReadyTemplates(mappedReady)
          setDbDesignerTemplates(mappedDesigner)
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      } finally {
        setIsLoadingTemplates(false)
      }
    }
    loadTemplates()
  }, [companyIsActive, scopedCompany])

  // Computed - Combine API templates with static fallbacks + custom uploads
  const mergedReady = [...staticTemplates, ...dbReadyTemplates]
  const finalReadyTemplates = mergedReady.filter((t, i, self) => i === self.findIndex((tx) => tx.image === t.image))

  const mergedDesigner = [...staticDesignerTemplates, ...dbDesignerTemplates]
  const finalDesignerTemplates = mergedDesigner.filter((t, i, self) => i === self.findIndex((tx) => tx.image === t.image))

  const allTemplates = mode === 'designer'
    ? [...finalDesignerTemplates, ...customTemplates]
    : mode === 'batch'
      ? [...finalReadyTemplates, ...finalDesignerTemplates, ...customTemplates]
      : [...finalReadyTemplates, ...customTemplates]

  const allowedFontsSet = new Set(
    (Array.isArray(scopedCompany?.allowedFonts) ? scopedCompany.allowedFonts : [])
      .map((f) => String(f).trim().toLowerCase())
      .filter(Boolean)
  )
  const filteredCompanyFonts = allowedFontsSet.size > 0
    ? fonts.filter((f) => (
      allowedFontsSet.has(String(f.id).toLowerCase()) ||
      allowedFontsSet.has(String(f.name || '').toLowerCase())
    ))
    : []
  const availableFonts = filteredCompanyFonts.length > 0 ? filteredCompanyFonts : fonts
  const currentTemplate = allTemplates.find(t => t.id === store.selectedTemplate) || allTemplates[0]
  const currentFont = availableFonts.find(f => f.id === store.selectedFont) || fonts.find(f => f.id === store.selectedFont) || availableFonts[0] || fonts[1]
  const scale = stageSize.width / 1080
  const purchaseOrderId = searchParams.get('purchaseOrderId')
  const paymobSessionId = searchParams.get('paymobSession')
  const isCompanyUnlocked = Boolean(
    companyIsActive &&
    (!scopedCompany?.subscription?.expiresAt || new Date(scopedCompany.subscription.expiresAt) >= new Date()) &&
    (scopedCompany?.subscription?.isActive !== false)
  )
  const isPersonalDesignLocked = !isCompanyUnlocked && Boolean(activePersonalOrder)
  const isBatchDesignLocked = !isCompanyUnlocked && ['paid', 'consumed'].includes(activeBatchOrder?.status)
  const isPreviewProtected = !isCompanyUnlocked && activePersonalOrder?.status !== 'consumed' && !temporarilyUnlocked
  const batchMaxRecipients = isCompanyUnlocked
    ? 2000
    : (licenseActive ? Math.max(1, Number(licenseMaxRecipients || 500)) : BATCH_ZIP_MAX_RECIPIENTS)
  const personalRecipientName = (mode === 'ready' ? readyName : store.recipientName || readyName).trim()
  const personalSenderName = (mode === 'ready' ? readySenderName : store.senderName || readySenderName).trim()

  useEffect(() => {
    if (!availableFonts.length) return
    if (!availableFonts.some((f) => f.id === store.selectedFont)) {
      store.setFont(availableFonts[0].id)
    }
  }, [availableFonts, store])

  useEffect(() => {
    if (!scopedCompany || !companyIsActive) return

    const companyLogoUrl = scopedCompany.logoUrl || ''
    const primaryBrand = scopedCompany?.brandColors?.primary || scopedCompany?.primaryColor
    const secondaryBrand = scopedCompany?.brandColors?.secondary

    if (companyLogoUrl && !store.companyLogo) {
      store.setCompanyLogo(companyLogoUrl)
    }
    if (primaryBrand && !readyNameColor) {
      setReadyNameColor(primaryBrand)
    }
    if (primaryBrand && store.textColor === '#ffffff') {
      store.setTextColor(primaryBrand)
    }
    if (secondaryBrand && store.subTextColor === '#ffffff') {
      store.setSubTextColor(secondaryBrand)
    }
  }, [companyIsActive, readyNameColor, scopedCompany, store])

  useEffect(() => {
    protectionStateRef.current = {
      isCompanyUnlocked,
      personalOrderStatus: activePersonalOrder?.status || null,
      temporarilyUnlocked,
    }
  }, [activePersonalOrder?.status, isCompanyUnlocked, temporarilyUnlocked])

  // Images - use currentTemplate when no readyDesign is selected
  const [bgImage, bgLoaded] = useImage(currentTemplate?.image)
  const [calligraphyImg, calligraphyLoaded] = useImage(store.selectedCalligraphy)
  const [personalPhotoImg, personalPhotoLoaded] = useImage(store.personalPhoto)
  const [logoImg, logoLoaded] = useImage(store.companyLogo)

  const calligraphyWidth = stageSize.width * store.calligraphyScale
  const calligraphyHeight = calligraphyImg ? (calligraphyImg.height / calligraphyImg.width) * calligraphyWidth : 0
  const photoW = stageSize.width * store.photoScale
  const logoW = stageSize.width * store.logoScale
  const logoH = logoImg ? (logoImg.height / logoImg.width) * logoW : logoW

  // Get logo position coordinates
  const getLogoPosition = () => {
    const padding = stageSize.width * 0.03
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max))

    if (store.logoPosition === 'free' && store.logoPos) {
      const x = store.logoPos.x * stageSize.width - logoW / 2
      const y = store.logoPos.y * stageSize.height - logoH / 2
      return {
        x: clamp(x, padding, stageSize.width - logoW - padding),
        y: clamp(y, padding, stageSize.height - logoH - padding),
      }
    }

    switch (store.logoPosition) {
      case 'top-right': return { x: stageSize.width - logoW - padding, y: padding }
      case 'top-left': return { x: padding, y: padding }
      case 'bottom-right': return { x: stageSize.width - logoW - padding, y: stageSize.height - logoH - padding }
      case 'bottom-left': default: return { x: padding, y: stageSize.height - logoH - padding }
    }
  }
  const logoPos = getLogoPosition()

  const handleLogoDragEnd = useCallback((e) => {
    const s = useEditorStore.getState()
    if (!s.companyLogo) return

    const padding = stageSize.width * 0.03
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max))

    const node = e.target
    const nextX = clamp(node.x(), padding, stageSize.width - logoW - padding)
    const nextY = clamp(node.y(), padding, stageSize.height - logoH - padding)

    node.x(nextX)
    node.y(nextY)

    s.setLogoPosition('free')
    s.setLogoPos({
      x: (nextX + logoW / 2) / stageSize.width,
      y: (nextY + logoH / 2) / stageSize.height,
    })
  }, [logoH, logoW, stageSize.height, stageSize.width])

  // Calligraphy filtering
  const allFilteredCalligraphy = calligraphy.filter(c => c.category === calligraphyCat)
  const filteredCalligraphy = allFilteredCalligraphy.slice(0, calligraphyLimit)
  const filteredTexts = greetingTexts.filter(t => t.text.includes(searchText) || t.category?.includes(searchText))

  // Safe template selection handler
  const handleTemplateSelect = useCallback((template) => {
    try {
      console.log('handleTemplateSelect called with:', template)
      
      // Validate template object
      if (!template) {
        console.error('Template selection failed: template is null/undefined')
        toast.error('تعذر اختيار القالب')
        return
      }

      if (!template.id) {
        console.error('Template selection failed: template has no id', template)
        toast.error('تعذر اختيار القالب - معرف غير صالح')
        return
      }

      if (!template.image) {
        console.error('Template selection failed: template has no image', template)
        toast.error('تعذر اختيار القالب - صورة غير موجودة')
        return
      }

      console.log('Selecting template:', template.id, template.name)
      
      // Safely set template
      store.setTemplate(template.id)

      // Update free/paid unlock status based on template
      setTemporarilyUnlocked(FREE_TEMPLATE_IDS.has(template.id))
      
      // If in ready mode, set default colors from template
      if (mode === 'ready' && template.textColor) {
        setReadyNameColor(template.textColor)
      }
      
      console.log('Template selected successfully:', template.id)
    } catch (error) {
      console.error('Error in handleTemplateSelect:', error)
      toast.error('حدث خطأ أثناء اختيار القالب')
    }
  }, [store, mode])

  // Resize handler
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        const baseWidth = Math.min(w, 520)

        if (mode === 'ready') {
          // Maintain natural aspect ratio of the loaded image
          if (bgImage && bgLoaded && bgImage.width > 0 && bgImage.height > 0) {
            const ratio = bgImage.height / bgImage.width
            setStageSize({ width: baseWidth, height: baseWidth * ratio })
          } else {
            // Default vertical ratio
            setStageSize({ width: baseWidth, height: baseWidth * 1.333 })
          }
        } else {
          // Designer mode is a square
          setStageSize({ width: baseWidth, height: baseWidth })
        }
      }
    }

    // Call once and on resize
    handleResize()

    // Also re-run when the image loads
    const img = bgImage
    if (img && !bgLoaded) {
      img.addEventListener('load', handleResize)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (img) img.removeEventListener('load', handleResize)
    }
  }, [mode, bgImage, bgLoaded])

  // Disable pull-to-refresh on mobile
  useEffect(() => {
    const el = document.documentElement
    const onTS = (e) => { if (e.touches.length > 1) return; window._touchStartY = e.touches[0].clientY }
    const onTM = (e) => { if (mode !== 'designer') return; if (window._touchStartY !== undefined && e.touches[0].clientY > window._touchStartY && window.scrollY === 0) e.preventDefault() }
    el.addEventListener('touchstart', onTS)
    el.addEventListener('touchmove', onTM, { passive: false })
    return () => { el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTM) }
  }, [mode])

  /* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Export Functions أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
  const buildPersonalSnapshot = useCallback(() => ({
    version: 1,
    mode,
    selectedTemplate: store.selectedTemplate || currentTemplate?.id || null,
    selectedFont: store.selectedFont,
    companyLogo: store.companyLogo,
    logoPosition: store.logoPosition,
    logoScale: store.logoScale,
    logoPos: store.logoPos,
    ready: {
      recipientName: readyName,
      senderName: readySenderName,
      fontSize: readyFontSize,
      nameY: readyNameY,
      nameColor: readyNameColor,
      senderY: readySenderY,
      senderFontSize: readySenderFontSize,
    },
    designer: {
      mainText: store.mainText,
      subText: store.subText,
      senderName: store.senderName,
      recipientName: store.recipientName,
      fontSize: store.fontSize,
      subFontSize: store.subFontSize,
      recipientFontSize: store.recipientFontSize,
      senderFontSize: store.senderFontSize,
      textColor: store.textColor,
      subTextColor: store.subTextColor,
      senderColor: store.senderColor,
      recipientColor: store.recipientColor,
      mainTextPos: store.mainTextPos,
      subTextPos: store.subTextPos,
      senderPos: store.senderPos,
      recipientPos: store.recipientPos,
      selectedCalligraphy: store.selectedCalligraphy,
      calligraphyPos: store.calligraphyPos,
      calligraphyScale: store.calligraphyScale,
      personalPhoto: store.personalPhoto,
      photoPos: store.photoPos,
      photoScale: store.photoScale,
      photoShape: store.photoShape,
      photoBorder: store.photoBorder,
      photoBorderColor: store.photoBorderColor,
      photoBorderWidth: store.photoBorderWidth,
      textShadow: store.textShadow,
      textStroke: store.textStroke,
      textStrokeColor: store.textStrokeColor,
      textStrokeWidth: store.textStrokeWidth,
      overlayOpacity: store.overlayOpacity,
      overlayColor: store.overlayColor,
      mainTextRotation: store.mainTextRotation,
      subTextRotation: store.subTextRotation,
    },
  }), [
    currentTemplate?.id,
    mode,
    readyFontSize,
    readyName,
    readyNameColor,
    readyNameY,
    readySenderFontSize,
    readySenderName,
    readySenderY,
    store.calligraphyPos,
    store.calligraphyScale,
    store.companyLogo,
    store.fontSize,
    store.logoPosition,
    store.logoScale,
    store.logoPos,
    store.mainText,
    store.mainTextPos,
    store.mainTextRotation,
    store.overlayColor,
    store.overlayOpacity,
    store.personalPhoto,
    store.photoBorder,
    store.photoBorderColor,
    store.photoBorderWidth,
    store.photoPos,
    store.photoScale,
    store.photoShape,
    store.recipientColor,
    store.recipientFontSize,
    store.recipientName,
    store.recipientPos,
    store.selectedCalligraphy,
    store.selectedFont,
    store.selectedTemplate,
    store.senderColor,
    store.senderFontSize,
    store.senderName,
    store.senderPos,
    store.subFontSize,
    store.subText,
    store.subTextColor,
    store.subTextPos,
    store.subTextRotation,
    store.textColor,
    store.textShadow,
    store.textStroke,
    store.textStrokeColor,
    store.textStrokeWidth,
  ])

  const applyPersonalSnapshot = useCallback((snapshot) => {
    if (!snapshot) return

    setMode(snapshot.mode || 'ready')

    if (snapshot.selectedTemplate) store.setTemplate(snapshot.selectedTemplate)
    if (snapshot.selectedFont) store.setFont(snapshot.selectedFont)
    if (snapshot.companyLogo !== undefined) store.setCompanyLogo(snapshot.companyLogo)
    if (snapshot.logoPosition) store.setLogoPosition(snapshot.logoPosition)
    if (snapshot.logoScale) store.setLogoScale(snapshot.logoScale)
    if (snapshot.logoPos) store.setLogoPos(snapshot.logoPos)

    if (snapshot.ready) {
      setReadyName(snapshot.ready.recipientName || '')
      setReadySenderName(snapshot.ready.senderName || '')
      setReadyFontSize(snapshot.ready.fontSize || 60)
      setReadyNameY(snapshot.ready.nameY || 0.65)
      setReadyNameColor(snapshot.ready.nameColor || null)
      setReadySenderY(snapshot.ready.senderY || 0.75)
      setReadySenderFontSize(snapshot.ready.senderFontSize || 40)
    }

    if (snapshot.designer) {
      store.setMainText(snapshot.designer.mainText || '')
      store.setSubText(snapshot.designer.subText || '')
      store.setSenderName(snapshot.designer.senderName || '')
      store.setRecipientName(snapshot.designer.recipientName || '')
      store.setFontSize(snapshot.designer.fontSize || 42)
      store.setSubFontSize(snapshot.designer.subFontSize || 24)
      store.setRecipientFontSize(snapshot.designer.recipientFontSize || 22)
      store.setSenderFontSize(snapshot.designer.senderFontSize || 18)
      store.setTextColor(snapshot.designer.textColor || '#ffffff')
      store.setSubTextColor(snapshot.designer.subTextColor || '#ffffff')
      store.setSenderColor(snapshot.designer.senderColor || '#ffffff')
      store.setRecipientColor(snapshot.designer.recipientColor || '#ffffff')
      store.setMainTextPos(snapshot.designer.mainTextPos || { x: 0.5, y: 0.35 })
      store.setSubTextPos(snapshot.designer.subTextPos || { x: 0.5, y: 0.55 })
      store.setSenderPos(snapshot.designer.senderPos || { x: 0.5, y: 0.85 })
      store.setRecipientPos(snapshot.designer.recipientPos || { x: 0.5, y: 0.75 })
      store.setSelectedCalligraphy(snapshot.designer.selectedCalligraphy || null)
      store.setCalligraphyPos(snapshot.designer.calligraphyPos || { x: 0.5, y: 0.25 })
      store.setCalligraphyScale(snapshot.designer.calligraphyScale || 0.6)
      store.setPersonalPhoto(snapshot.designer.personalPhoto || null)
      store.setPhotoPos(snapshot.designer.photoPos || { x: 0.5, y: 0.7 })
      store.setPhotoScale(snapshot.designer.photoScale || 0.25)
      store.setPhotoShape(snapshot.designer.photoShape || 'circle')
      store.setPhotoBorder(snapshot.designer.photoBorder ?? true)
      store.setPhotoBorderColor(snapshot.designer.photoBorderColor || '#ffffff')
      store.setPhotoBorderWidth(snapshot.designer.photoBorderWidth || 3)
      store.setTextShadow(Boolean(snapshot.designer.textShadow))
      store.setTextStroke(Boolean(snapshot.designer.textStroke))
      store.setTextStrokeColor(snapshot.designer.textStrokeColor || '#000000')
      store.setTextStrokeWidth(snapshot.designer.textStrokeWidth || 1)
      store.setOverlayOpacity(snapshot.designer.overlayOpacity || 0)
      store.setOverlayColor(snapshot.designer.overlayColor || '#000000')
      store.setMainTextRotation(snapshot.designer.mainTextRotation || 0)
      store.setSubTextRotation(snapshot.designer.subTextRotation || 0)
    }
  }, [store])

  const logProtectedAction = useCallback((eventType, details = {}) => {
    const now = Date.now()
    const previous = protectionCooldownRef.current[eventType] || 0
    if (now - previous < 2000) return
    protectionCooldownRef.current[eventType] = now

    logProtectionEvent(eventType, {
      orderId: activePersonalOrder?.orderId || purchaseOrderId,
      details,
    }).catch(() => { })
  }, [activePersonalOrder?.orderId, purchaseOrderId])

  useEffect(() => {
    logProtectedActionRef.current = logProtectedAction
  }, [logProtectedAction])

  useEffect(() => {
    if (isCompanyUnlocked) return
    if (temporarilyUnlocked) return
    if (sessionStorage.getItem(PREVIEW_NOTICE_KEY)) return
    setShowProtectionNotice(true)
  }, [isCompanyUnlocked, temporarilyUnlocked])

  useEffect(() => {
    if (!purchaseOrderId) {
      setActivePersonalOrder(null)
      autoDownloadAttemptedRef.current = false
      return
    }

    let cancelled = false

    async function loadOrder() {
      try {
        const res = await getPersonalOrder(purchaseOrderId)
        if (cancelled) return

        const orderData = {
          ...res.data,
          orderId: res.data.orderId || purchaseOrderId,
        }

        setActivePersonalOrder(orderData)
        applyPersonalSnapshot(orderData.snapshot)
      } catch (error) {
        if (cancelled) return
        toast.error(error.message || 'تعذر جلب بيانات الطلب.')
      }
    }

    loadOrder()

    return () => {
      cancelled = true
    }
  }, [applyPersonalSnapshot, purchaseOrderId])

  useEffect(() => {
    if (!paymobSessionId) return
    let cancelled = false
    let attempts = 0
    let intervalId = null

    async function verifyPaymobAccess() {
      try {
        const res = await getPaymobFlashStatus(paymobSessionId)
        if (cancelled) return
        if (res.success && res.status === 'completed') {
          setTemporarilyUnlocked(true)
          return true
        }
      } catch {
        // ignore and keep protection enabled
      }
      return false
    }

    verifyPaymobAccess().then((done) => {
      if (done || cancelled) return
      intervalId = window.setInterval(async () => {
        attempts += 1
        if (attempts > 40 || cancelled) {
          window.clearInterval(intervalId)
          return
        }
        const unlocked = await verifyPaymobAccess()
        if (unlocked) {
          window.clearInterval(intervalId)
        }
      }, 3000)
    })

    return () => {
      cancelled = true
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [paymobSessionId])

  useEffect(() => {
    if (!isPreviewProtected) return

    const handleContextMenu = (event) => {
      event.preventDefault()
      logProtectedAction('context_menu_blocked', { tagName: event.target?.tagName })
    }

    const handleDragStart = (event) => {
      event.preventDefault()
      logProtectedAction('drag_drop_blocked', { tagName: event.target?.tagName })
    }

    const handleDrop = (event) => {
      event.preventDefault()
      logProtectedAction('drag_drop_blocked', { event: 'drop' })
    }

    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase()
      const hasModifier = event.ctrlKey || event.metaKey

      if (hasModifier && (key === 's' || key === 'p')) {
        event.preventDefault()
        logProtectedAction('save_or_print_blocked', { key: event.key })
      }

      if (event.key === 'PrintScreen') {
        event.preventDefault()
        setProtectionFlash(true)
        logProtectedAction('printscreen_blocked', { key: event.key })
        window.setTimeout(() => setProtectionFlash(false), 1200)
      }
    }

    window.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('drop', handleDrop)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('drop', handleDrop)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPreviewProtected, logProtectedAction])

  const validatePersonalPayment = useCallback(() => {
    setPersonalPaymentError('')

    if (!personalRecipientName) {
      setPersonalPaymentError('اكتب الاسم أولاً.')
      return false
    }

    if (!stageRef.current) {
      setPersonalPaymentError('تعذر تجهيز المعاينة حالياً.')
      return false
    }

    if (mode === 'ready' && !bgLoaded) {
      setPersonalPaymentError('انتظر تحميل التصميم أولاً.')
      return false
    }

    return true
  }, [bgLoaded, mode, personalRecipientName])

  const handleBatchPaymentChange = useCallback((e) => {
    const { name, value } = e.target
    setBatchPaymentData(prev => ({ ...prev, [name]: value }))
  }, [])

  const normalizeBatchNames = useCallback(() => {
    const max = isCompanyUnlocked
      ? 2000
      : (licenseActive ? Math.max(1, Number(licenseMaxRecipients || 500)) : BATCH_ZIP_MAX_RECIPIENTS)

    return (store.batchNames || [])
      .map(n => String(n || '').trim())
      .filter(Boolean)
      .slice(0, max)
  }, [isCompanyUnlocked, licenseActive, licenseMaxRecipients, store.batchNames])

  const whatsAppPresets = [
    {
      id: 'ksa_formal_1',
      label: 'فخمة رسمية',
      text: 'عيدكم مبارك، وتقبل الله طاعتكم، وأسأل الله أن يجعل أيامكم سعادة وطمأنينة، وكل عام وأنتم بخير.',
    },
    {
      id: 'ksa_formal_2',
      label: 'فخمة رسمية (قصيرة)',
      text: 'كل عام وأنتم بخير، عيدكم مبارك، وعساكم من عوّاده.',
    },
    {
      id: 'ksa_dua_1',
      label: 'دعاء راقي',
      text: 'عيد مبارك، جعل الله عيدكم فرحاً لا ينقطع، ورزقكم القبول والسعادة والرضا.',
    },
    {
      id: 'ksa_business_1',
      label: 'للعملاء (رسمي)',
      text: 'يسرّنا تهنئتكم بمناسبة العيد، تقبل الله منا ومنكم، وكل عام وأنتم بخير.',
    },
    {
      id: 'ksa_luxury_1',
      label: 'فخم جدًا',
      text: 'أزفّ لكم أطيب التهاني بمناسبة العيد، وأسأل الله أن يبارك لكم في أوقاتكم وأهلكم ورزقكم، وكل عام وأنتم بخير.',
    },
  ]

  const openWhatsAppWithMessage = useCallback(() => {
    const text = String(batchWhatsAppTemplate || '').trim()
    if (!text) {
      toast.error('اكتب الرسالة أولاً')
      return
    }
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }, [batchWhatsAppTemplate])

  const copyWhatsAppMessage = useCallback(async () => {
    const text = String(batchWhatsAppTemplate || '').trim()
    if (!text) {
      toast.error('اكتب الرسالة أولاً')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      toast.success('تم نسخ الرسالة')
    } catch {
      toast.error('تعذر النسخ على هذا الجهاز')
    }
  }, [batchWhatsAppTemplate])

  const buildWhatsAppSupportUrl = useCallback((text) => {
    const phone = String(SUPPORT_CONTACT || '').replace(/\D/g, '')
    const message = encodeURIComponent(String(text || '').trim())
    return `https://wa.me/${phone}?text=${message}`
  }, [])

  const startPayPalPayment = useCallback(async () => {
    try {
      setPayPalError('')
      const names = normalizeBatchNames()
      if (names.length === 0) {
        toast.error('أدخل اسماً واحداً على الأقل')
        return
      }

      const templateId = String(useEditorStore.getState().selectedTemplate || currentTemplate?.id || '')
      const snapshot = buildPersonalSnapshot()

      localStorage.setItem(PAYPAL_BATCH_PENDING_KEY, JSON.stringify({
        templateId,
        snapshot,
        names,
        ts: Date.now(),
      }))
      try {
        const returnPath = `${window.location.pathname}${window.location.search}`
        localStorage.setItem(PAYPAL_RETURN_PATH_KEY, returnPath || '/editor')
      } catch {}

      setProcessingPayPal(true)
      const res = await createPayPalOrder()
      const approveUrl = res.data?.approveUrl
      const orderId = res.data?.orderId
      if (!approveUrl || !orderId) throw new Error('تعذر بدء الدفع.')

      setActiveBatchOrder({
        status: 'pending',
        paymentProvider: 'paypal',
        paypalOrderId: orderId,
      })

      window.location.href = approveUrl
    } catch (err) {
      const message = err?.message || 'تعذر بدء الدفع.'
      setPayPalError(message)
      toast.error(message)
    } finally {
      setProcessingPayPal(false)
    }
  }, [buildPersonalSnapshot, currentTemplate?.id, normalizeBatchNames])

  const paypalToken = searchParams.get('token')
  const paypalFlag = searchParams.get('paypal')

  useEffect(() => {
    if (!paypalToken) return

    let cancelled = false
    async function finalize() {
      try {
        setProcessingPayPal(true)
        setPayPalError('')
        const capture = await capturePayPalOrder(paypalToken)
        const captureId = capture.data?.captureId
        if (!captureId) throw new Error('تعذر تأكيد الدفع.')

        const savedRaw = localStorage.getItem(PAYPAL_BATCH_PENDING_KEY)
        if (savedRaw) {
          const saved = JSON.parse(savedRaw)
          if (saved?.snapshot) applyPersonalSnapshot(saved.snapshot)
          const s = useEditorStore.getState()
          if (saved?.templateId) s.setTemplate(saved.templateId)
          if (Array.isArray(saved?.names) && saved.names.length) s.setBatchNames(saved.names)
        }

        if (cancelled) return

        setMode('batch')
        setActiveBatchOrder({
          status: 'paid',
          paymentProvider: 'paypal',
          paypalOrderId: paypalToken,
          paypalCaptureId: captureId,
        })

        const returnPath = localStorage.getItem(PAYPAL_RETURN_PATH_KEY) || '/editor'
        try {
          localStorage.removeItem(PAYPAL_BATCH_PENDING_KEY)
          localStorage.removeItem(PAYPAL_RETURN_PATH_KEY)
        } catch { }
        navigate(returnPath || '/editor', { replace: true })
        toast.success('تم الدفع بنجاح.')
      } catch (err) {
        const returnPath = localStorage.getItem(PAYPAL_RETURN_PATH_KEY) || '/editor'
        try {
          localStorage.removeItem(PAYPAL_BATCH_PENDING_KEY)
          localStorage.removeItem(PAYPAL_RETURN_PATH_KEY)
        } catch { }
        if (!cancelled) {
          const message = err?.message || 'تعذر تأكيد الدفع.'
          setPayPalError(message)
          toast.error(message)
        }
        navigate(returnPath || '/editor', { replace: true })
      } finally {
        if (!cancelled) setProcessingPayPal(false)
      }
    }

    finalize()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, paypalToken])

  useEffect(() => {
    if (paypalFlag !== '0') return
    const returnPath = localStorage.getItem(PAYPAL_RETURN_PATH_KEY) || '/editor'
    try {
      localStorage.removeItem(PAYPAL_BATCH_PENDING_KEY)
      localStorage.removeItem(PAYPAL_RETURN_PATH_KEY)
    } catch { }
    navigate(returnPath || '/editor', { replace: true })
  }, [navigate, paypalFlag])

  const setBatchNameAtIndex = useCallback((index, value) => {
    const s = useEditorStore.getState()
    const names = (s.batchNames || []).slice()
    if (index < 0) return
    if (names.length === 0 && index === 0) names.push('')
    if (index >= names.length) return
    names[index] = value
    s.setBatchNames(names)
  }, [])

  const insertBatchNameAfter = useCallback((index) => {
    const s = useEditorStore.getState()
    const names = (s.batchNames || []).slice(0, batchMaxRecipients)
    const safeIndex = Math.max(-1, Math.min(index, names.length - 1))
    const next = names.slice()
    next.splice(safeIndex + 1, 0, '')
    s.setBatchNames(next.slice(0, batchMaxRecipients))
    window.setTimeout(() => batchNameRefs.current[safeIndex + 1]?.focus?.(), 0)
  }, [batchMaxRecipients])

  const removeBatchNameAt = useCallback((index) => {
    const s = useEditorStore.getState()
    const names = (s.batchNames || []).slice()
    if (names.length <= 1) return
    if (index < 0 || index >= names.length) return
    names.splice(index, 1)
    s.setBatchNames(names)
    window.setTimeout(() => batchNameRefs.current[Math.max(0, index - 1)]?.focus?.(), 0)
  }, [])

  const validateBatchPayment = useCallback(() => {
    setBatchPaymentError('')

    if (isCompanyUnlocked) return true
    if (licenseActive) return true
    if (activeBatchOrder?.status === 'paid') return true

    const names = normalizeBatchNames()
    if (names.length === 0) {
      setBatchPaymentError('أدخل اسماً واحداً على الأقل.')
      return false
    }

    if (names.length > batchMaxRecipients) {
      setBatchPaymentError(`الحد الأقصى هو ${batchMaxRecipients} اسماً.`)
      return false
    }

    setBatchPaymentError('ادفع عبر بايبال أو فعّل كود الشركة.')
    return false
  }, [activeBatchOrder?.status, batchMaxRecipients, isCompanyUnlocked, licenseActive, normalizeBatchNames])

  const generateBatchZipBlob = useCallback(async (names) => {
    if (!stageRef.current) throw new Error('تعذر تجهيز المعاينة حالياً.')

    store.setBatchGenerating(true)
    store.setGeneratedCards([])

    const zip = new JSZip()

    for (let i = 0; i < names.length; i++) {
      store.setBatchCurrentIndex(i)
      store.setBatchProgress(Math.round(((i + 1) / names.length) * 100))
      store.setRecipientName(names[i])

      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 })
      const base64 = dataUrl.split(',')[1]
      zip.file(`card-${names[i]}.png`, base64, { base64: true })
    }

    const content = await zip.generateAsync({ type: 'blob' })
    return content
  }, [store])

  const executeBatchPurchase = useCallback(async () => {
    const names = normalizeBatchNames()
    if (!isCompanyUnlocked && !validateBatchPayment()) return

    if (!licenseActive && activeBatchOrder?.status === 'consumed') {
      toast.error(`عذراً 🙏 لا يمكن تنزيل ملف ZIP مرة ثانية.\nللمساعدة: ${SUPPORT_CONTACT}`)
      return
    }

    const templateId = String(store.selectedTemplate || currentTemplate?.id || '')
    const snapshot = buildPersonalSnapshot()

    try {
      setProcessingBatchOrder(true)
      setBatchPaymentError('')

      let orderId = activeBatchOrder?.orderId
      let orderStatus = activeBatchOrder?.status

      if (!isCompanyUnlocked && !licenseActive && (!orderId || orderStatus !== 'paid')) {
        await new Promise(resolve => setTimeout(resolve, 700))
        const orderRes = await createBatchOrder({
          templateId,
          snapshot,
          names,
          maxRecipients: batchMaxRecipients,
          paymentProvider: activeBatchOrder?.paymentProvider || 'paypal',
          paypalOrderId: activeBatchOrder?.paypalOrderId || '',
          paypalCaptureId: activeBatchOrder?.paypalCaptureId || '',
        })
        orderId = orderRes.data?.orderId
        if (!orderId) throw new Error('تعذر إنشاء الطلب.')
        setActiveBatchOrder({ ...(orderRes.data || {}), orderId, status: 'paid' })
      }

      const zipBlob = await generateBatchZipBlob(names)

      if (!isCompanyUnlocked && !licenseActive) {
        const consumeRes = await consumeBatchOrder(orderId, snapshot, names)
        setActiveBatchOrder(prev => prev ? {
          ...prev,
          status: 'consumed',
          downloadedAt: consumeRes.data?.downloadedAt || new Date().toISOString(),
        } : prev)
      }

      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = `cards-batch-${names.length}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('تم تنزيل ملف ZIP.')
      trackStat('downloads')
    } catch (error) {
      const message = error?.message || `تعذر إتمام العملية. للمساعدة: ${SUPPORT_CONTACT}`
      setBatchPaymentError(message)
      toast.error(message)
    } finally {
      store.setBatchGenerating(false)
      setProcessingBatchOrder(false)
      store.setBatchProgress(0)
    }
  }, [activeBatchOrder?.orderId, activeBatchOrder?.paypalCaptureId, activeBatchOrder?.paypalOrderId, activeBatchOrder?.paymentProvider, activeBatchOrder?.status, batchMaxRecipients, buildPersonalSnapshot, currentTemplate?.id, generateBatchZipBlob, isCompanyUnlocked, licenseActive, normalizeBatchNames, store, validateBatchPayment])

  const executePersonalPurchase = useCallback(async (payload) => {
    if (!payload?.templateId || !payload?.recipientName || !payload?.snapshot) return

    try {
      setProcessingPersonalOrder(true)
      setPersonalPaymentError('')

      await new Promise(resolve => setTimeout(resolve, 900))

      const orderRes = await createPersonalOrder(payload)
      const orderId = orderRes.data?.orderId
      if (!orderId) throw new Error('تعذر إنشاء الطلب.')

      setActivePersonalOrder({
        ...(orderRes.data || {}),
        orderId,
        status: 'paid',
      })

      const consumeRes = await consumePersonalOrder(orderId, payload.snapshot)

      setTemporarilyUnlocked(true)
      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const link = document.createElement('a')
      link.download = `eid-greeting-${Date.now()}.png`
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setActivePersonalOrder(prev => prev ? {
        ...prev,
        status: 'consumed',
        downloadedAt: consumeRes.data?.downloadedAt || new Date().toISOString(),
      } : prev)

      toast.success(consumeRes.message || 'تم تحميل بطاقتك بنجاح. نهنئكم بحلول عيد الفطر المبارك 🌙')
      trackStat('downloads')
    } catch (error) {
      const message = error?.message || `تعذر إتمام العملية. للمساعدة: ${SUPPORT_CONTACT}`
      setPersonalPaymentError(message)
      toast.error(message)
    } finally {
      pendingPersonalPurchaseRef.current = null
      setTemporarilyUnlocked(false)
      setProcessingPersonalOrder(false)
    }
  }, [])

  const persistCheckoutDraft = useCallback(() => {
    if (!personalRecipientName) {
      toast.error('اكتب اسم المستلم أولاً.')
      return
    }

    const payload = {
      templateId: String(store.selectedTemplate || currentTemplate?.id || ''),
      templateName: currentTemplate?.name || 'تصميم مختار',
      recipientName: personalRecipientName,
      senderName: personalSenderName,
      snapshot: buildPersonalSnapshot(),
    }

    sessionStorage.setItem(PERSONAL_CHECKOUT_KEY, JSON.stringify(payload))
    const checkoutUrl = `/checkout?product=template&templateId=${encodeURIComponent(payload.templateId)}&price=${PERSONAL_CARD_PRICE}&name=${encodeURIComponent(payload.templateName || 'تصميم مميز')}`
    navigate(checkoutUrl)
  }, [buildPersonalSnapshot, currentTemplate?.id, currentTemplate?.name, navigate, personalRecipientName, personalSenderName, store.selectedTemplate])

  const startPersonalCheckout = useCallback(() => {
    if (activePersonalOrder?.status === 'consumed') {
      toast.error(`عذراً 🙏 لا يمكن تنزيل البطاقة مرة ثانية.\nللمساعدة: ${SUPPORT_CONTACT}`)
      logProtectedAction('download_before_payment', { reason: 'reused_paid_order' })
      return
    }

    if (!validatePersonalPayment()) return

    const payload = {
      templateId: String(store.selectedTemplate || currentTemplate?.id || ''),
      recipientName: personalRecipientName,
      senderName: personalSenderName,
      snapshot: buildPersonalSnapshot(),
    }

    pendingPersonalPurchaseRef.current = payload

    if (!sessionStorage.getItem(PAYMENT_WARNING_KEY)) {
      setShowPaymentWarning(true)
      return
    }

    persistCheckoutDraft()
  }, [activePersonalOrder?.status, buildPersonalSnapshot, currentTemplate?.id, logProtectedAction, persistCheckoutDraft, personalRecipientName, personalSenderName, store.selectedTemplate, validatePersonalPayment])

  const confirmPaymentWarning = useCallback(() => {
    sessionStorage.setItem(PAYMENT_WARNING_KEY, 'true')
    setShowPaymentWarning(false)
    if (pendingPersonalPurchaseRef.current) persistCheckoutDraft()
  }, [persistCheckoutDraft])

  const handlePersonalDownload = useCallback(async () => {
    if (!stageRef.current || !activePersonalOrder?.orderId) return

    try {
      setProcessingPersonalOrder(true)
      const snapshot = buildPersonalSnapshot()
      const res = await consumePersonalOrder(activePersonalOrder.orderId, snapshot)

      setTemporarilyUnlocked(true)
      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)))

      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const link = document.createElement('a')
      link.download = `eid-greeting-${Date.now()}.png`
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setActivePersonalOrder(prev => prev ? {
        ...prev,
        status: 'consumed',
        downloadedAt: res.data?.downloadedAt || new Date().toISOString(),
      } : prev)

      toast.success(res.message || 'تم تحميل بطاقتك فورًا! نهنئكم بحلول عيد الفطر المبارك 🌙')
      trackStat('downloads')
    } catch (error) {
      toast.error(error.message || `تعذر تجهيز البطاقة الحالية. للمساعدة: ${SUPPORT_CONTACT}`)
    } finally {
      setTemporarilyUnlocked(false)
      setProcessingPersonalOrder(false)
    }
  }, [activePersonalOrder?.orderId, buildPersonalSnapshot])

  useEffect(() => {
    personalDownloadRef.current = handlePersonalDownload
  }, [handlePersonalDownload])

  const autodownloadParam = searchParams.get('autodownload')
  useEffect(() => {
    if (autodownloadParam !== '1') return
    if (!activePersonalOrder?.orderId || activePersonalOrder.status !== 'paid') return
    if (!stageRef.current || !currentTemplate) return
    if (mode === 'ready' && !bgLoaded) return
    if (autoDownloadAttemptedRef.current) return

    autoDownloadAttemptedRef.current = true
    const timer = window.setTimeout(() => {
      handlePersonalDownload()
    }, 250)

    return () => window.clearTimeout(timer)
  }, [activePersonalOrder, bgLoaded, currentTemplate, handlePersonalDownload, mode, autodownloadParam])

  const getCanvasDataURL = useCallback(() => {
    if (!stageRef.current) return null
    return stageRef.current.toDataURL({ pixelRatio: 4 })
  }, [])

  const handleExportPNG = useCallback(async () => {
    if (!stageRef.current) return
    // In trial mode, redirect to buy instead of downloading
    if (isTrial) {
      navigate('/bulk')
      return
    }
    const { isCompanyUnlocked: compUnlocked, personalOrderStatus, temporarilyUnlocked: freeUnlocked } = protectionStateRef.current
    if (!compUnlocked && !freeUnlocked) {
      if (personalOrderStatus === 'paid') {
        personalDownloadRef.current?.()
      } else {
        toast.error('التحميل متاح بعد الدفع فقط.')
        logProtectedActionRef.current('download_before_payment', { format: 'png' })
      }
      return
    }
    try {
      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const link = document.createElement('a')
      link.download = `eid-greeting-${Date.now()}.png`
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('تم التحميل بنجاح.')
      trackStat('downloads')
    } catch { toast.error('حدث خطأ أثناء التحميل.') }
  }, [])

  useEffect(() => {
    if (autodownloadParam !== '1') return
    if (!temporarilyUnlocked) return
    if (!stageRef.current || !currentTemplate) return
    if (mode === 'ready' && !bgLoaded) return
    if (autoDownloadAttemptedRef.current) return

    autoDownloadAttemptedRef.current = true
    const timer = window.setTimeout(() => {
      handleExportPNG()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [autodownloadParam, bgLoaded, currentTemplate, handleExportPNG, mode, temporarilyUnlocked])

  const handleExportPDF = useCallback(async () => {
    if (!stageRef.current) return
    const { isCompanyUnlocked: compUnlocked, temporarilyUnlocked: freeUnlocked } = protectionStateRef.current
    if (!compUnlocked && !freeUnlocked) {
      toast.error('تحميل PDF متاح بعد الدفع فقط.')
      logProtectedActionRef.current('download_before_payment', { format: 'pdf' })
      return
    }
    try {
      const { jsPDF } = await import('jspdf')
      const uri = stageRef.current.toDataURL({ pixelRatio: 4 })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] })
      pdf.addImage(uri, 'PNG', 0, 0, 1080, 1080)
      pdf.save(`eid-greeting-${Date.now()}.pdf`)
      toast.success('تم تحميل PDF.')
      trackStat('downloads')
    } catch { toast.error('تعذر تصدير PDF حالياً.') }
  }, [])

  const handleShareWhatsApp = useCallback(async () => {
    if (!stageRef.current) return
    const { isCompanyUnlocked: compUnlocked, temporarilyUnlocked: freeUnlocked } = protectionStateRef.current
    if (!compUnlocked && !freeUnlocked) {
      toast.error('المشاركة متاحة بعد الدفع فقط.')
      logProtectedActionRef.current('download_before_payment', { action: 'share_whatsapp' })
      return
    }
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'بطاقة تهنئة', text: 'شارك بطاقتك' })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent('شاركني بطاقتي')}`, '_blank')
      }
      toast.success('تم فتح المشاركة.')
    } catch { toast.error('تعذر المشاركة حالياً.') }
  }, [getCanvasDataURL])

  const handleCopyImage = useCallback(async () => {
    if (!stageRef.current) return
    const { isCompanyUnlocked: compUnlocked, temporarilyUnlocked: freeUnlocked } = protectionStateRef.current
    if (!compUnlocked && !freeUnlocked) {
      toast.error('نسخ الصورة متاح بعد الدفع فقط.')
      logProtectedActionRef.current('download_before_payment', { action: 'copy_image' })
      return
    }
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      toast.success('تم النسخ.')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('تعذر نسخ الصورة.') }
  }, [getCanvasDataURL])

  const handleShareNative = useCallback(async () => {
    if (!stageRef.current) return
    const { isCompanyUnlocked: compUnlocked, temporarilyUnlocked: freeUnlocked } = protectionStateRef.current
    if (!compUnlocked && !freeUnlocked) {
      toast.error('المشاركة متاحة بعد الدفع فقط.')
      logProtectedActionRef.current('download_before_payment', { action: 'share_native' })
      return
    }
    try {
      const uri = getCanvasDataURL()
      const res = await fetch(uri)
      const blob = await res.blob()
      const file = new File([blob], 'eid-greeting.png', { type: 'image/png' })
      if (navigator.share) await navigator.share({ files: [file] })
      else toast.error('المشاركة غير مدعومة على هذا الجهاز.')
    } catch { toast.error('تعذر المشاركة.') }
  }, [getCanvasDataURL])

  /* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Drag Handlers أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
  const handleDrag = (setter) => (e) => {
    const { x, y } = e.target.position()
    setter({ x: (x + stageSize.width * 0.4) / stageSize.width, y: y / stageSize.height })
  }

  const handleCalligraphyDrag = (e) => {
    const { x, y } = e.target.position()
    store.setCalligraphyPos({
      x: (x + calligraphyWidth / 2) / stageSize.width,
      y: (y + calligraphyHeight / 2) / stageSize.height
    })
  }

  const handlePhotoDrag = (e) => {
    const { x, y } = e.target.position()
    store.setPhotoPos({
      x: (x + photoW / 2) / stageSize.width,
      y: (y + photoW / 2) / stageSize.height
    })
  }

  const handleElementClick = (el) => () => store.setActiveElement(el)

  /* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Template Upload أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
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
    toast.success(`تم رفع ${files.length} صورة`)
    e.target.value = ''
  }

  const handleDeleteCustomTemplate = (id) => {
    setCustomTemplates(prev => {
      const updated = prev.filter(ct => ct.id !== id)
      localStorage.setItem('eidgreet_custom_templates', JSON.stringify(updated))
      return updated
    })
    toast.success('تم الحذف')
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      store.setPersonalPhoto(ev.target.result)
      store.setPhotoPos({ x: 0.5, y: 0.75 })
      toast.success('تم إضافة الصورة')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  /* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Tool Items أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
  const toolItems = [
    { id: 'backgrounds', label: 'الخلفيات', icon: <BsImage size={20} />, tip: 'اختر خلفية البطاقة' },
    { id: 'calligraphy', label: 'المخطوطات', icon: <BsStars size={20} />, tip: 'أضف مخطوطة جميلة' },
    { id: 'photo', label: 'الصورة', icon: <BsPersonCircle size={20} />, tip: 'أضف صورتك الشخصية' },
    { id: 'logo', label: 'الشعار', icon: <BsBuilding size={20} />, tip: 'أضف شعار الشركة' },
    { id: 'text', label: 'النصوص', icon: <BsChatLeftText size={20} />, tip: 'عدّل نصوص البطاقة' },
    { id: 'style', label: 'التنسيق', icon: <HiOutlineColorSwatch size={20} />, tip: 'تحكم بالألوان والخطوط' },
  ]
  const renderProtectionOverlay = () => {
    if (!isPreviewProtected) return null

    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 16,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: protectionFlash ? 'rgba(15, 23, 42, 0.86)' : 'linear-gradient(180deg, rgba(15,23,42,0.18), rgba(15,23,42,0.28))',
        zIndex: 4,
      }}>
        <div style={{
          position: 'absolute',
          inset: '-20%',
          display: 'grid',
          placeItems: 'center',
          transform: 'rotate(-24deg)',
          opacity: 0.22,
          fontSize: stageSize.width > 480 ? 34 : 24,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: 2,
          lineHeight: 2.3,
          whiteSpace: 'pre-line',
        }}>
          {`معاينة محمية\nالتحميل متاح بعد الدفع فقط\n\nمعاينة محمية\nالتحميل متاح بعد الدفع فقط\n\nمعاينة محمية`}
        </div>
        <div style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          padding: '12px 16px',
          borderRadius: 14,
          background: 'rgba(15, 23, 42, 0.82)',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.24)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 4 }}>التحميل متاح بعد الدفع فقط</div>
          <div style={{ fontSize: 11, lineHeight: 1.6, opacity: 0.85 }}>يمكنك تعديل البطاقة الآن، لكن التصدير مقفول حتى إتمام الدفع.</div>
        </div>
      </div>
    )
  }

  const renderPersonalCheckoutCard = (compact = false) => {
    if (isCompanyUnlocked) return null

    if (activePersonalOrder?.status === 'paid') {
      return (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 18,
          padding: compact ? 16 : 20,
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: compact ? 15 : 16, fontWeight: 800, color: '#0f172a' }}>
            تم الدفع بنجاح ✅
          </p>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
            نهنئكم بحلول عيد الفطر المبارك 🌙
            <br />
            سيبدأ التحميل تلقائياً. إن لم يبدأ، استخدم الزر التالي مرة واحدة.
          </p>
          <button onClick={handlePersonalDownload} disabled={processingPersonalOrder} style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 14,
            border: 'none',
            background: '#0f172a',
            color: '#fff',
            fontSize: 15,
            fontWeight: 800,
            cursor: processingPersonalOrder ? 'not-allowed' : 'pointer',
            opacity: processingPersonalOrder ? 0.7 : 1,
            fontFamily: ds.font,
          }}>
            {processingPersonalOrder ? 'جارٍ التحميل...' : 'تحميل بطاقتي فورًا'}
          </button>
        </div>
      )
    }

    if (activePersonalOrder?.status === 'consumed') {
      return (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 18,
          padding: compact ? 16 : 20,
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: compact ? 15 : 16, fontWeight: 900, color: '#166534' }}>
            تم تحميل البطاقة بالفعل ✅
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#166534', lineHeight: 1.8 }}>
            كل عملية شراء مخصصة لتحميل واحد فقط. للمساعدة: {SUPPORT_CONTACT}
          </p>
        </div>
      )
    }

    return (
      <div style={{
        width: '100%',
        background: '#fffaf0',
        border: '1px solid #f4d7a4',
        borderRadius: 18,
        padding: compact ? 16 : 20,
        textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 10px', fontSize: compact ? 15 : 16, fontWeight: 900, color: '#92400e' }}>
          شراء فردي
        </p>
        <p style={{ margin: '0 0 12px', fontSize: compact ? 28 : 34, fontWeight: 900, color: '#0f172a' }}>
          {PERSONAL_CARD_PRICE} <span style={{ fontSize: compact ? 16 : 18 }}>ر.س</span>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {['VISA', 'MADA', 'Mastercard'].map(method => (
            <span key={method} style={{
              padding: '6px 10px',
              borderRadius: 999,
              background: '#fff',
              border: '1px solid #e5e7eb',
              fontSize: 11,
              fontWeight: 900,
              color: '#0f172a',
            }}>
              {method}
            </span>
          ))}
        </div>
        <div style={{
          marginBottom: 12,
          padding: '12px 14px',
          borderRadius: 14,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#334155',
          fontSize: 12,
          lineHeight: 1.9,
          textAlign: 'right',
        }}>
          لن نطلب منك إدخال بيانات البطاقة هنا.
          <br />
          عند الضغط على الدفع سيتم تحويلك مباشرة إلى بوابة دفع آمنة لإتمام العملية.
        </div>
        {personalPaymentError && (
          <div style={{
            margin: '0 0 12px',
            padding: '10px 12px',
            borderRadius: 14,
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#9f1239',
            fontSize: 12,
            lineHeight: 1.8,
            textAlign: 'right',
          }}>
            {personalPaymentError}
          </div>
        )}
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#92400e', lineHeight: 1.9 }}>
          اكتب الاسم أولاً، ثم ادفع عبر البوابة الآمنة، وبعد التأكيد سيظهر التحميل فوراً.
        </p>
        <button onClick={startPersonalCheckout} disabled={processingPersonalOrder} style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: 14,
          border: 'none',
          background: '#0f172a',
          color: '#fff',
          fontSize: 15,
          fontWeight: 800,
          cursor: processingPersonalOrder ? 'not-allowed' : 'pointer',
          opacity: processingPersonalOrder ? 0.7 : 1,
          fontFamily: ds.font,
        }}>
          {processingPersonalOrder ? 'جارٍ التحويل...' : 'متابعة إلى الدفع الآمن'}
        </button>
      </div>
    )
  }
  return (
    <div style={{ fontFamily: ds.font, background: '#f5f5f5', minHeight: '100vh', paddingTop: 0 }}>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1a1a', color: '#fff', borderRadius: 12, fontFamily: ds.font, fontSize: 14, padding: '12px 20px' }
      }} />
      {showProtectionNotice && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(10px)',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 520,
            background: '#fff',
            borderRadius: 28,
            padding: '32px 28px',
            textAlign: 'center',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#0f172a' }}>
              <BsInfoCircle size={26} />
            </div>
            <p style={{ margin: '0 0 22px', fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.9 }}>
              يمكنك تعديل البطاقة بحرية الآن.
              <br />
              التحميل/التصدير متاح بعد الدفع فقط.
              <br />
              شكراً لتفهمك.
            </p>
            <button
              onClick={() => {
                sessionStorage.setItem(PREVIEW_NOTICE_KEY, 'true')
                setShowProtectionNotice(false)
              }}
              style={{
                border: 'none',
                borderRadius: 16,
                background: '#0f172a',
                color: '#fff',
                fontSize: 15,
                fontWeight: 800,
                padding: '14px 24px',
                cursor: 'pointer',
                fontFamily: ds.font,
              }}
            >
              فهمت
            </button>
          </div>
        </div>
      )}
      {showPaymentWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(10px)',
          zIndex: 91,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 460,
            background: '#fff',
            borderRadius: 28,
            padding: '32px 28px',
            textAlign: 'center',
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#c2410c' }}>
              <BsStars size={24} />
            </div>
            <p style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.9 }}>
              الاسم الذي أدخلته نهائي ولن يمكن تعديله بعد الدفع.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  pendingPersonalPurchaseRef.current = null
                  setShowPaymentWarning(false)
                }}
                style={{
                  flex: 1,
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  background: '#fff',
                  color: '#475569',
                  fontSize: 15,
                  fontWeight: 700,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  fontFamily: ds.font,
                }}
              >
                رجوع
              </button>
              <button
                onClick={confirmPaymentWarning}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 16,
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 800,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  fontFamily: ds.font,
                }}
              >
                متابعة الدفع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trial Banner */}
      {isTrial && (
        <div style={{
          background: '#fef9c3', borderBottom: '1px solid #fde047',
          padding: '10px 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          fontFamily: ds.font, direction: 'rtl',
        }}>
          <span style={{ fontSize: 13, color: '#713f12', fontWeight: 600 }}>
            وضع التجربة — لتحميل بطاقتك اشترِ باقة
          </span>
          <button
            onClick={() => navigate('/bulk')}
            style={{
              padding: '7px 18px', background: '#7c3aed', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font,
            }}
          >اشترِ الآن</button>
        </div>
      )}

      {/* ••• Header ••• */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #eee',
        padding: '16px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        boxSizing: 'border-box',
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#000' }}>محرر البطاقات</h1>
        {scopedCompany && companyIsActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 999,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}>
            {scopedCompany.logoUrl ? (
              <img
                src={scopedCompany.logoUrl}
                alt={scopedCompany.name || 'company'}
                style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }}
              />
            ) : (
              <span style={{ width: 20, height: 20, borderRadius: 4, background: scopedCompany?.brandColors?.primary || '#2563eb', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>
                {(scopedCompany?.name || 'ش')[0]}
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', fontFamily: ds.font }}>
              {scopedCompany?.name}
            </span>
            {contextMode === 'portal' && (
              <span style={{ fontSize: 10, color: '#64748b', fontFamily: ds.font }}>
                بوابة الشركة
              </span>
            )}
          </div>
        )}

        {/* Mode Switcher - Prominent */}
        <div style={{
          display: 'flex',
          background: '#f0f0f0',
          borderRadius: 14,
          padding: 4,
          gap: 4,
          width: '100%',
          maxWidth: 520,
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: 6,
        }}>
          <button onClick={() => {
            if (isPersonalDesignLocked && mode !== 'ready') return
            setMode('ready')
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 'clamp(10px, 2.6vw, 12px) clamp(12px, 4.6vw, 24px)',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(12px, 3.2vw, 14px)',
            fontWeight: 700,
            fontFamily: ds.font,
            whiteSpace: 'nowrap',
            flex: '1 1 140px',
            justifyContent: 'center',
            background: mode === 'ready' ? '#000' : 'transparent',
            color: mode === 'ready' ? '#fff' : '#555',
            transition: 'all 200ms'
          }}>
            <BsStars size={16} /> جاهز
          </button>
          <button onClick={() => {
            if (isPersonalDesignLocked && mode !== 'designer') return
            setMode('designer')
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 'clamp(10px, 2.6vw, 12px) clamp(12px, 4.6vw, 24px)',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(12px, 3.2vw, 14px)',
            fontWeight: 700,
            fontFamily: ds.font,
            whiteSpace: 'nowrap',
            flex: '1 1 140px',
            justifyContent: 'center',
            background: mode === 'designer' ? '#000' : 'transparent',
            color: mode === 'designer' ? '#fff' : '#555',
            transition: 'all 200ms'
          }}>
            <BsPencilFill size={14} /> مصمم
          </button>
        </div>

        {/* Bulk Sending CTA - visible in ready/designer modes */}
        {mode !== 'batch' && (
          <div
            onClick={() => window.location.href = '/bulk'}
            style={{
              width: '100%',
              maxWidth: 520,
              background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              border: '2px solid #c4b5fd',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 200ms',
              marginTop: 6,
            }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
            }}>
              <BsPeople size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#5b21b6', marginBottom: 2, fontFamily: ds.font }}>
                تريد ترسل لمجموعة كبيرة؟
              </div>
              <div style={{ fontSize: 11, color: '#7c3aed', lineHeight: 1.6, fontFamily: ds.font }}>
                نظام الإرسال الجماعي — اكتب الأسماء وحمّل كل البطاقات دفعة واحدة
              </div>
            </div>
            <BsArrowLeft size={16} color="#7c3aed" />
          </div>
        )}

        {/* Business Notification - Subtle */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '1px solid #fbbf24',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 500,
          boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)',
          marginTop: 10
        }}>
          <BsBuilding size={18} color="#b45309" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92400e', margin: '0 0 4px 0', fontFamily: ds.font }}>
              {companyIsActive ? 'حساب شركة مفعل' : 'للشركات: افتح المحرر الكامل'}
            </p>
            <p style={{ fontSize: 11, color: '#b45309', margin: 0, fontFamily: ds.font }}>
              {companyIsActive ? 'استمتع بكل المزايا والتحميل غير المحدود.' : 'بعد الشراء ستحصل على حساب شركة ورابط خاص للموظفين.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {companyIsActive ? (
              <a
                href="/company/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 14px',
                  background: '#b45309',
                  color: '#fff',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: ds.font,
                  boxShadow: '0 2px 4px rgba(180, 83, 9, 0.3)'
                }}
              >
                لوحة الشركة
              </a>
            ) : (
              <>
                <a href="https://wa.me/201007835547" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: '#25D366', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 11, fontWeight: 600, fontFamily: ds.font }}>
                  <BsWhatsapp size={14} /> واتساب
                </a>
                <a href="https://x.com/am_designing" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: '#000', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 11, fontWeight: 600, fontFamily: ds.font }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg> X
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
         READY MODE - Simple 3-Step Flow
      أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
      {mode === 'ready' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 40px' }}>

          {/* Step 1: Choose Design أ¢â‚¬â€‌ Manual Selector */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 0', marginBottom: 20, boxShadow: ds.shadow.sm, opacity: isPersonalDesignLocked ? 0.6 : 1, pointerEvents: isPersonalDesignLocked ? 'none' : 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '0 28px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>1</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>اختر التصميم</h2>
            </div>

            <div style={{
              display: 'flex',
              gap: 14,
              padding: '0 28px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: 10
            }}>
              {isLoadingTemplates ? (
                <div style={{ padding: '20px 0', width: '100%', textAlign: 'center', color: '#888', fontSize: 14 }}>جارٍ تحميل التصاميم...</div>
              ) : finalReadyTemplates.length === 0 ? (
                <div style={{ padding: '20px 0', width: '100%', textAlign: 'center', color: '#888', fontSize: 14 }}>لا توجد تصاميم متاحة حالياً.</div>
              ) : (
                finalReadyTemplates.map((t) => {
                  const isFreeT = FREE_TEMPLATE_IDS.has(t.id)
                  return (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateSelect(t)}
                    style={{
                      position: 'relative',
                      width: 140,
                      minWidth: 140,
                      aspectRatio: '1',
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: store.selectedTemplate === t.id ? '3px solid #000' : '2px solid #eee',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 300ms',
                      transform: store.selectedTemplate === t.id ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: store.selectedTemplate === t.id ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      background: '#f8f9fa'
                    }}
                  >
                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                    <div style={{
                      position: 'absolute', top: 6, left: 6, padding: '2px 7px', borderRadius: 6,
                      background: isFreeT ? '#059669' : 'rgba(15,23,42,0.75)',
                      color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: ds.font,
                      backdropFilter: 'blur(4px)'
                    }}>
                      {isFreeT ? 'مجاني' : 'مدفوع'}
                    </div>
                    {store.selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BsCheck2 size={16} />
                      </div>
                    )}
                  </button>
                  )
                })
              )}
            </div>

            <p style={{ fontSize: 11, color: '#888', padding: '12px 28px 0', fontFamily: ds.font }}>
              اسحب يميناً ويساراً لاستعراض التصاميم
            </p>
          </div>

          {/* Step 2: Customize */}
          {store.selectedTemplate && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: ds.shadow.sm, animation: 'fadeUp 300ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>2</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>خصّص البطاقة</h2>
              </div>

              {/* Recipient Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>اسم المستلم</label>
                <input type="text" value={readyName} onChange={(e) => setReadyName(e.target.value)}
                  placeholder="مثال: أم خالد" dir="rtl"
                  style={{
                    width: '100%', padding: '16px 24px', fontSize: 16, fontWeight: 600, fontFamily: ds.font,
                    border: '2px solid #eee', borderRadius: 14, textAlign: 'center', outline: 'none',
                    transition: 'border-color 200ms', background: '#fafafa'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#eee'}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                />
              </div>

              {/* Sender Name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>اسم المرسل</label>
                <input type="text" value={readySenderName} onChange={(e) => setReadySenderName(e.target.value)}
                  placeholder="مثال: محمد" dir="rtl"
                  style={{
                    width: '100%', padding: '16px 24px', fontSize: 16, fontWeight: 600, fontFamily: ds.font,
                    border: '2px solid #eee', borderRadius: 14, textAlign: 'center', outline: 'none',
                    transition: 'border-color 200ms', background: '#fafafa'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#eee'}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                />
              </div>

              {/* Font Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>الخط</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {availableFonts.map(f => (
                    <button key={f.id} onClick={() => store.setFont(f.id)} style={{
                      padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: store.selectedFont === f.id ? '#000' : '#f5f5f5',
                      color: store.selectedFont === f.id ? '#fff' : '#666',
                      fontSize: 12, fontWeight: 600, fontFamily: f.family, transition: 'all 200ms'
                    }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Color */}
              <div style={{ marginBottom: 20 }}>
                <ColorPicker value={readyNameColor || currentTemplate?.textColor || '#ffffff'} onChange={setReadyNameColor} label="لون الاسم" />
              </div>

              {/* Logo Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>الشعار</label>
                {store.companyLogo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, border: '2px solid #eee', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={store.companyLogo} alt="شعار" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <button onClick={() => store.setCompanyLogo(null)} style={{
                      padding: '8px 14px', borderRadius: 10, border: 'none', background: '#fee2e2', color: '#dc2626',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                    }}>
                      إزالة
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 12,
                    cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (ev) => { store.setCompanyLogo(ev.target.result); toast.success('تم إضافة الشعار') }
                      reader.readAsDataURL(file)
                      e.target.value = ''
                    }} />
                    <BsBuilding size={16} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>رفع شعار</span>
                  </label>
                )}
              </div>

              {/* --- Advanced Controls (collapsible style) --- */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 14, color: '#666' }}>إعدادات متقدمة</label>

                {/* Recipient Font Size */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>حجم خط اسم المستلم</span>
                    <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{readyFontSize}px</span>
                  </div>
                  <input type="range" min={14} max={100} value={readyFontSize} onChange={(e) => setReadyFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                {/* Recipient Position */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>موضع اسم المستلم</span>
                    <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{Math.round(readyNameY * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={0.95} step={0.01} value={readyNameY} onChange={(e) => setReadyNameY(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                {/* Sender Font Size */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>حجم خط اسم المرسل</span>
                    <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{readySenderFontSize}px</span>
                  </div>
                  <input type="range" min={14} max={80} value={readySenderFontSize} onChange={(e) => setReadySenderFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                {/* Sender Position */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>موضع اسم المرسل</span>
                    <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{Math.round(readySenderY * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={0.95} step={0.01} value={readySenderY} onChange={(e) => setReadySenderY(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                {/* Logo Size & Position */}
                {store.companyLogo && (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>حجم الشعار</span>
                        <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{Math.round(store.logoScale * 100)}%</span>
                      </div>
                      <input type="range" min={0.05} max={0.3} step={0.01} value={store.logoScale} onChange={(e) => store.setLogoScale(Number(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>موضع الشعار</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {[
                          { id: 'top-right', label: 'أعلى يمين' },
                          { id: 'top-left', label: 'أعلى يسار' },
                          { id: 'bottom-right', label: 'أسفل يمين' },
                          { id: 'bottom-left', label: 'أسفل يسار' },
                          { id: 'free', label: 'حر' },
                        ].map(pos => (
                          <button key={pos.id} onClick={() => store.setLogoPosition(pos.id)} style={{
                            padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                            background: store.logoPosition === pos.id ? '#000' : '#f5f5f5',
                            color: store.logoPosition === pos.id ? '#fff' : '#666',
                            fontSize: 12, fontWeight: 600, transition: 'all 200ms'
                          }}>
                            {pos.label}
                          </button>
                        ))}
                      </div>
                      {store.logoPosition === 'free' && (
                        <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', lineHeight: 1.7 }}>
                          اسحب الشعار داخل المعاينة لوضعه بحرية.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Preview & Export */}
          {store.selectedTemplate && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: ds.shadow.sm, animation: 'fadeUp 300ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>3</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>عاين وحمّل</h2>
              </div>

              {/* Canvas Preview */}
              <div ref={mode === 'ready' ? containerRef : undefined} style={{ maxWidth: 400, margin: '0 auto 24px' }}>
                <div style={{ background: '#000', borderRadius: 16, padding: 8, position: 'relative' }}>
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 12, overflow: 'hidden' }}>
                    <Layer>
                      <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                      {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                      {readyName && (
                        <Text text={readyName} x={0} y={stageSize.height * readyNameY} width={stageSize.width} align="center"
                          fontFamily={currentFont.family} fontSize={readyFontSize * scale} fill={readyNameColor || currentTemplate?.textColor || '#ffffff'} lineHeight={1.5} />
                      )}
                      {readySenderName && (
                        <Text text={readySenderName} x={0} y={stageSize.height * readySenderY} width={stageSize.width} align="center"
                          fontFamily={currentFont.family} fontSize={readySenderFontSize * scale} fill={readyNameColor || currentTemplate?.textColor || '#ffffff'} opacity={0.85} lineHeight={1.5} />
                      )}
                      {logoImg && logoLoaded && (
                        <KonvaImage
                          image={logoImg}
                          x={logoPos.x}
                          y={logoPos.y}
                          width={logoW}
                          height={logoH}
                          draggable={store.logoPosition === 'free'}
                          onDragEnd={handleLogoDragEnd}
                        />
                      )}
                    </Layer>
                  </Stage>
                  {typeof renderProtectionOverlay === 'function' ? renderProtectionOverlay() : null}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: (isCompanyUnlocked || temporarilyUnlocked) ? 'flex' : 'none', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tooltip text="تحميل PNG">
                  <button onClick={handleExportPNG} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsDownload size={18} /> تحميل PNG
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة عبر واتساب">
                  <button onClick={handleShareWhatsApp} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px',
                    background: '#25D366', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsWhatsapp size={18} /> واتساب
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة عبر X">
                  <button onClick={() => {
                    const text = encodeURIComponent('بطاقة تهنئة العيد من سَلِّم 🌙✨')
                    const url = encodeURIComponent('https://www.sallim.co')
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsTwitterX size={16} /> X
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة عبر فيسبوك">
                  <button onClick={() => {
                    const url = encodeURIComponent('https://www.sallim.co')
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px',
                    background: '#1877F2', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsFacebook size={16} /> فيسبوك
                  </button>
                </Tooltip>
              </div>
              <div style={{ display: (isCompanyUnlocked || temporarilyUnlocked) ? 'flex' : 'none', gap: 10, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                <Tooltip text="تحميل PDF">
                  <button onClick={handleExportPDF} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsFilePdf size={16} /> PDF
                  </button>
                </Tooltip>
                <Tooltip text="نسخ الصورة">
                  <button onClick={handleCopyImage} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    {copied ? <BsCheck2 color="#10b981" /> : <BsLink45Deg />} {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة (استوري واتساب وغيره)">
                  <button onClick={handleShareNative} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsShareFill /> مشاركة
                  </button>
                </Tooltip>
              </div>
              {!isCompanyUnlocked && !temporarilyUnlocked && typeof renderPersonalCheckoutCard === 'function' && renderPersonalCheckoutCard()}
            </div>
          )}
        </div>
      )}

      {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
         DESIGNER MODE - Advanced Editor
      أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
      {mode === 'designer' && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 40px' }}>
          <div className="designer-grid" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Left: Canvas & Actions أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
            <div className="canvas-section">

              {/* Canvas */}
              <div ref={mode === 'designer' ? containerRef : undefined} style={{ maxWidth: 520, margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 10, boxShadow: ds.shadow.lg }}>
                  <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'grab' }}>
                    <Layer>
                      <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                      {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                      {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                      {!bgLoaded && !store.selectedCalligraphy && (
                        <Text text="اختر خلفية للبطاقة" x={0} y={stageSize.height * 0.45} width={stageSize.width} align="center" fontFamily="'Cairo', sans-serif" fontSize={16 * scale} fill="#888" lineHeight={1.8} />
                      )}
                      {calligraphyImg && calligraphyLoaded && (
                        <KonvaImage image={calligraphyImg}
                          x={store.calligraphyPos.x * stageSize.width - calligraphyWidth / 2}
                          y={store.calligraphyPos.y * stageSize.height - calligraphyHeight / 2}
                          width={calligraphyWidth} height={calligraphyHeight}
                          draggable onDragEnd={handleCalligraphyDrag} />
                      )}
                      {personalPhotoImg && personalPhotoLoaded && (
                        <Group
                          x={store.photoPos.x * stageSize.width - photoW / 2}
                          y={store.photoPos.y * stageSize.height - photoW / 2}
                          draggable onDragEnd={handlePhotoDrag}
                          clipFunc={store.photoShape === 'circle' ? (ctx) => { ctx.arc(photoW / 2, photoW / 2, photoW / 2, 0, Math.PI * 2) } : store.photoShape === 'rounded' ? (ctx) => { const r = photoW * 0.15; ctx.moveTo(r, 0); ctx.lineTo(photoW - r, 0); ctx.quadraticCurveTo(photoW, 0, photoW, r); ctx.lineTo(photoW, photoW - r); ctx.quadraticCurveTo(photoW, photoW, photoW - r, photoW); ctx.lineTo(r, photoW); ctx.quadraticCurveTo(0, photoW, 0, photoW - r); ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0) } : undefined}
                        >
                          {store.photoBorder && store.photoShape === 'circle' && (
                            <Circle x={photoW / 2} y={photoW / 2} radius={photoW / 2} stroke={store.photoBorderColor} strokeWidth={store.photoBorderWidth * scale} />
                          )}
                          {store.photoBorder && store.photoShape !== 'circle' && (
                            <Rect x={0} y={0} width={photoW} height={photoW} cornerRadius={store.photoShape === 'rounded' ? photoW * 0.15 : 0} stroke={store.photoBorderColor} strokeWidth={store.photoBorderWidth * scale} />
                          )}
                          <KonvaImage image={personalPhotoImg} x={0} y={0} width={photoW} height={photoW} />
                        </Group>
                      )}
                      <DraggableText text={store.mainText} x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.mainTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.fontSize * scale} fontFamily={currentFont.family} fill={store.textColor} align="center" lineHeight={1.6} padding={20 * scale} rotation={store.mainTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.6)" shadowBlur={10 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale} onDragEnd={handleDrag(store.setMainTextPos)} onClick={handleElementClick('mainText')} />
                      <DraggableText text={store.subText} x={store.subTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.subTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.subFontSize * scale} fontFamily={currentFont.family} fill={store.subTextColor} align="center" lineHeight={1.5} padding={15 * scale} rotation={store.subTextRotation} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={8 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.7} onDragEnd={handleDrag(store.setSubTextPos)} onClick={handleElementClick('subText')} />
                      <DraggableText text={store.recipientName} x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4} y={store.recipientPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.recipientFontSize * scale} fontFamily={currentFont.family} fill={store.recipientColor} align="center" shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={6 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.5} onDragEnd={handleDrag(store.setRecipientPos)} onClick={handleElementClick('recipientName')} />
                      <DraggableText text={store.senderName} x={store.senderPos.x * stageSize.width - stageSize.width * 0.4} y={store.senderPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.senderFontSize * scale} fontFamily={currentFont.family} fill={store.senderColor} align="center" opacity={0.85} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.4)" shadowBlur={5 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.4} onDragEnd={handleDrag(store.setSenderPos)} onClick={handleElementClick('senderName')} />
                      {/* Company Logo */}
                      {logoImg && logoLoaded && (
                        <KonvaImage
                          image={logoImg}
                          x={logoPos.x}
                          y={logoPos.y}
                          width={logoW}
                          height={logoH}
                          draggable={store.logoPosition === 'free'}
                          onDragEnd={handleLogoDragEnd}
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ maxWidth: 520, margin: '20px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Tooltip text="تحميل PNG">
                  <button onClick={handleExportPNG} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font, width: '100%'
                  }}>
                    <BsDownload size={18} /> تحميل PNG
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة عبر واتساب">
                  <button onClick={handleShareWhatsApp} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 24px',
                    background: '#25D366', color: '#fff', border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: ds.font, width: '100%'
                  }}>
                    <BsWhatsapp size={18} /> واتساب
                  </button>
                </Tooltip>
              </div>
              <div style={{ maxWidth: 520, margin: '12px auto 0', display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Tooltip text="تحميل PDF">
                  <button onClick={handleExportPDF} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsFilePdf /> PDF
                  </button>
                </Tooltip>
                <Tooltip text="نسخ الصورة">
                  <button onClick={handleCopyImage} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    {copied ? <BsCheck2 color="#10b981" /> : <BsLink45Deg />} {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </Tooltip>
                <Tooltip text="مشاركة">
                  <button onClick={handleShareNative} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    background: '#fff', color: '#333', border: '2px solid #eee', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}>
                    <BsShareFill /> مشاركة
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Right: Tools Panel أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
            <div className="tools-section">
              {/* Tool Tabs */}
              <div className="tool-tabs" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, direction: 'rtl' }}>
                {toolItems.map(t => (
                  <Tooltip key={t.id} text={t.tip}>
                    <button onClick={() => setActivePanel(t.id)} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '12px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                      background: activePanel === t.id ? '#000' : '#fff',
                      color: activePanel === t.id ? '#fff' : '#666',
                      boxShadow: activePanel === t.id ? ds.shadow.md : 'none',
                      transition: 'all 200ms', minWidth: 70, flexShrink: 0
                    }}>
                      {t.icon}
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{t.label}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>

              {toolItems.find(t => t.id === activePanel)?.tip && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', marginBottom: 4, fontFamily: ds.font }}>
                    {toolItems.find(t => t.id === activePanel)?.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.8, fontFamily: ds.font }}>
                    {toolItems.find(t => t.id === activePanel)?.tip}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, lineHeight: 1.8, fontFamily: ds.font }}>
                    تلميح: اسحب النصوص/الصورة/الشعار داخل المعاينة لتحريكهم مباشرة.
                  </div>
                </div>
              )}

              {/* Panel Content */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, minHeight: 400 }}>
                {renderPanel()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
         BATCH MODE - Mass Greeting Cards
      أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
      {mode === 'batch' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>

          {/* Step 1: Choose Design */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 0', marginBottom: 20, boxShadow: ds.shadow.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '0 28px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>1</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>اختر التصميم (للإرسال الجماعي)</h2>
            </div>
            <div style={{ display: 'flex', gap: 14, padding: '0 28px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: 10 }}>
              {isLoadingTemplates ? (
                <div style={{ padding: '20px 0', width: '100%', textAlign: 'center', color: '#888', fontSize: 14 }}>جارٍ تحميل التصاميم...</div>
              ) : allTemplates.length === 0 ? (
                <div style={{ padding: '20px 0', width: '100%', textAlign: 'center', color: '#888', fontSize: 14 }}>لا توجد تصاميم متاحة حالياً.</div>
              ) : (
                allTemplates.filter(t => !t.image?.includes('تصميم لرفع صورة')).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateSelect(t)}
                    style={{
                      position: 'relative', width: 140, minWidth: 140, aspectRatio: '9/16', borderRadius: 16, overflow: 'hidden',
                      border: store.selectedTemplate === t.id ? '3px solid #000' : '2px solid #eee',
                      cursor: 'pointer', padding: 0, transition: 'all 300ms',
                      transform: store.selectedTemplate === t.id ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: store.selectedTemplate === t.id ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                      flexShrink: 0, scrollSnapAlign: 'start', background: '#f8f9fa'
                    }}
                  >
                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
                    {store.selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BsCheck2 size={16} />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Step 2: Customize */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: ds.shadow.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>2</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>خصّص الرسالة</h2>
            </div>

            {/* Font */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>الخط</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {availableFonts.map(f => (
                  <button key={f.id} onClick={() => store.setFont(f.id)} style={{
                    padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: store.selectedFont === f.id ? '#000' : '#f5f5f5', color: store.selectedFont === f.id ? '#fff' : '#666',
                    fontSize: 12, fontWeight: 600, fontFamily: f.family
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Text Customization */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700 }}>النص الرئيسي</label>
                <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.fontSize}px</span>
              </div>
              <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')}
                dir="rtl" rows={2} placeholder="اكتب التهنئة..."
                style={{ width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee', borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>موضع النص (عمودي)</span>
                    <span style={{ fontSize: 10, color: '#999' }}>{Math.round(store.mainTextPos.y * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={0.95} step={0.01} value={store.mainTextPos.y} onChange={(e) => store.setMainTextPos({ ...store.mainTextPos, y: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>حجم الخط</span>
                  </div>
                  <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
              <ColorPicker value={store.textColor} onChange={store.setTextColor} label="لون النص الرئيسي" />
            </div>

            {/* Sub Text Customization */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700 }}>النص الفرعي</label>
                <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.subFontSize}px</span>
              </div>
              <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')}
                dir="rtl" rows={2} placeholder="مثال: تقبل الله طاعاتكم"
                style={{ width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee', borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>موضع النص (عمودي)</span>
                    <span style={{ fontSize: 10, color: '#999' }}>{Math.round(store.subTextPos.y * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={0.95} step={0.01} value={store.subTextPos.y} onChange={(e) => store.setSubTextPos({ ...store.subTextPos, y: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>حجم الخط</span>
                  </div>
                  <input type="range" min={10} max={60} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
              <ColorPicker value={store.subTextColor} onChange={store.setSubTextColor} label="لون النص الفرعي" />
            </div>

            {/* Recipient Customization */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>إعدادات اسم المستلم</label>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>موضع الاسم</span>
                    <span style={{ fontSize: 10, color: '#999' }}>{Math.round(store.recipientPos.y * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={0.95} step={0.01} value={store.recipientPos.y} onChange={(e) => store.setRecipientPos({ ...store.recipientPos, y: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>حجم خط الاسم</span>
                    <span style={{ fontSize: 10, color: '#999' }}>{store.recipientFontSize}px</span>
                  </div>
                  <input type="range" min={20} max={100} value={store.recipientFontSize} onChange={(e) => store.setRecipientFontSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
              <ColorPicker value={store.recipientColor} onChange={store.setRecipientColor} label="لون اسم المستلم" />
            </div>

          </div>

          {/* Preview Canvas - On Top */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 16, boxShadow: ds.shadow.sm, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>3</div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>المعاينة</h2>
            </div>
            <div ref={mode === 'batch' ? containerRef : undefined} style={{ maxWidth: 400, margin: '0 auto' }}>
              <div style={{ background: '#000', borderRadius: 14, padding: 8 }}>
                <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <Layer>
                    <Rect width={stageSize.width} height={stageSize.height} fill="#17012C" />
                    {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}
                    {store.overlayOpacity > 0 && <Rect width={stageSize.width} height={stageSize.height} fill={store.overlayColor} opacity={store.overlayOpacity} />}
                    {calligraphyImg && calligraphyLoaded && (
                      <KonvaImage image={calligraphyImg}
                        x={store.calligraphyPos.x * stageSize.width - calligraphyWidth / 2}
                        y={store.calligraphyPos.y * stageSize.height - calligraphyHeight / 2}
                        width={calligraphyWidth} height={calligraphyHeight} />
                    )}
                    <DraggableText text={store.mainText} x={store.mainTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.mainTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.fontSize * scale} fontFamily={currentFont.family} fill={store.textColor} align="center" lineHeight={1.6} padding={20 * scale} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.6)" shadowBlur={10 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale} />
                    <DraggableText text={store.subText} x={store.subTextPos.x * stageSize.width - stageSize.width * 0.4} y={store.subTextPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.subFontSize * scale} fontFamily={currentFont.family} fill={store.subTextColor} align="center" lineHeight={1.5} padding={15 * scale} shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={8 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.7} />
                    <DraggableText text={store.recipientName || 'اسم المستلم'} x={store.recipientPos.x * stageSize.width - stageSize.width * 0.4} y={store.recipientPos.y * stageSize.height} width={stageSize.width * 0.8} fontSize={store.recipientFontSize * scale} fontFamily={currentFont.family} fill={store.recipientColor} align="center" shadowEnabled={store.textShadow} shadowColor="rgba(0,0,0,0.5)" shadowBlur={6 * scale} strokeEnabled={store.textStroke} stroke={store.textStrokeColor} strokeWidth={store.textStrokeWidth * scale * 0.5} />
                    {logoImg && logoLoaded && (
                      <KonvaImage
                        image={logoImg}
                        x={logoPos.x}
                        y={logoPos.y}
                        width={logoW}
                        height={logoH}
                        draggable={store.logoPosition === 'free'}
                        onDragEnd={handleLogoDragEnd}
                      />
                    )}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>

          {/* Progress Circle - When Generating */}
          {store.batchGenerating && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 12px' }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f0f0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#000" strokeWidth="10"
                    strokeDasharray={276.5} strokeDashoffset={276.5 * (1 - store.batchProgress / 100)}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 300ms ease' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 20, fontWeight: 800 }}>
                  {store.batchProgress}%
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>جارٍ إنشاء البطاقة: {store.batchNames[store.batchCurrentIndex]}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>{store.batchCurrentIndex + 1} / {store.batchNames.length}</p>
            </div>
          )}

          {/* Names Input Section */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>4</div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>أدخل أسماء المستلمين</h2>
            </div>

            {/* File Upload */}
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
              padding: '16px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
              cursor: (isBatchDesignLocked || processingBatchOrder || store.batchGenerating) ? 'not-allowed' : 'pointer',
              opacity: (isBatchDesignLocked || processingBatchOrder || store.batchGenerating) ? 0.65 : 1,
              marginBottom: 16, fontFamily: ds.font
            }}>
              <input type="file" accept=".txt,.csv" disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating} style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const text = ev.target.result
                  const names = text.split(/[\n,;]+/).map(n => n.trim()).filter(n => n.length > 0)
                  store.setBatchNames(names)
                  toast.success(`تم تحميل ${names.length} اسم`)
                }
                reader.readAsText(file)
                e.target.value = ''
              }} />
              <BsFileEarmarkText size={18} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>رفع ملف أسماء (.txt, .csv)</span>
            </label>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setBatchNamesInputMode('list')}
                  type="button"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    background: batchNamesInputMode === 'list' ? '#0f172a' : '#fff',
                    color: batchNamesInputMode === 'list' ? '#fff' : '#0f172a',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: ds.font,
                  }}
                >
                  قائمة أسماء (مناسب للجوال)
                </button>
                <button
                  onClick={() => setBatchNamesInputMode('text')}
                  type="button"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    background: batchNamesInputMode === 'text' ? '#0f172a' : '#fff',
                    color: batchNamesInputMode === 'text' ? '#fff' : '#0f172a',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: ds.font,
                  }}
                >
                  نص (لصق سريع)
                </button>
              </div>

              {batchNamesInputMode === 'list' ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {(store.batchNames.length ? store.batchNames : ['']).slice(0, BATCH_ZIP_MAX_RECIPIENTS).map((name, index) => (
                    <div key={`name-${index}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        ref={(el) => { batchNameRefs.current[index] = el }}
                        type="text"
                        value={name || ''}
                        onChange={(e) => setBatchNameAtIndex(index, e.target.value)}
                        dir="rtl"
                        inputMode="text"
                        enterKeyHint="next"
                        placeholder={`الاسم ${index + 1}`}
                        disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            insertBatchNameAfter(index)
                          }
                          if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            batchNameRefs.current[index + 1]?.focus?.()
                          }
                          if (e.key === 'ArrowUp') {
                            e.preventDefault()
                            batchNameRefs.current[index - 1]?.focus?.()
                          }
                          if (e.key === 'Backspace' && !String(name || '').length && (store.batchNames || []).length > 1) {
                            e.preventDefault()
                            removeBatchNameAt(index)
                          }
                        }}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeBatchNameAt(index)}
                        disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating || (store.batchNames || []).length <= 1}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 14,
                          border: '1px solid #fee2e2',
                          background: '#fff1f2',
                          color: '#be123c',
                          cursor: 'pointer',
                          fontWeight: 900,
                          opacity: (store.batchNames || []).length <= 1 ? 0.5 : 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => insertBatchNameAfter((store.batchNames || []).length - 1)}
                    disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating || (store.batchNames || []).length >= BATCH_ZIP_MAX_RECIPIENTS}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: '1px dashed #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: 'pointer',
                      fontFamily: ds.font,
                      opacity: (store.batchNames || []).length >= BATCH_ZIP_MAX_RECIPIENTS ? 0.6 : 1,
                    }}
                  >
                    إضافة اسم جديد
                  </button>

                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.8 }}>
                    تلميح: اضغط Enter لإضافة الاسم التالي، أو استخدم سهم الأسفل/الأعلى للتنقل.
                  </div>
                </div>
              ) : (
                <>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>الصق الأسماء (كل اسم في سطر)</label>
                  <textarea
                    dir="rtl"
                    rows={8}
                    placeholder="محمد\nأحمد\nفاطمة\n\nمثال: اكتب كل اسم في سطر"
                    value={store.batchNames.join('\n')}
                    disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating}
                    onChange={(e) => {
                      const names = e.target.value.split(/[\n,;,]/).map(n => n.trim()).filter(n => n.length > 0)
                      store.setBatchNames(names.slice(0, BATCH_ZIP_MAX_RECIPIENTS))
                    }}
                    style={{
                      width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                      borderRadius: 12, resize: 'vertical', outline: 'none', background: '#fafafa', lineHeight: 1.8,
                      minHeight: '200px', maxHeight: '500px'
                    }}
                  />
                  <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>سيتم فصل الأسماء تلقائياً. الحد الأقصى: {BATCH_ZIP_MAX_RECIPIENTS}.</p>
                </>
              )}
            </div>

            {/* Names Count */}
            {store.batchNames.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f0fdf4', borderRadius: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>{store.batchNames.length} اسم جاهز</span>
                <button onClick={() => store.resetBatch()} disabled={isBatchDesignLocked || processingBatchOrder || store.batchGenerating} style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626',
                  fontSize: 12, fontWeight: 600,
                  cursor: (isBatchDesignLocked || processingBatchOrder || store.batchGenerating) ? 'not-allowed' : 'pointer',
                  opacity: (isBatchDesignLocked || processingBatchOrder || store.batchGenerating) ? 0.7 : 1,
                  fontFamily: ds.font
                }}>
                  مسح
                </button>
              </div>
            )}

            <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>رسائل واتساب (سعودية)</div>
              <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.8, marginBottom: 12 }}>
                اختر رسالة فخمة جاهزة أو اكتب رسالتك، ثم افتح واتساب بالرسالة مباشرة.
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>اختيار جاهز</label>
                <select
                  value={batchWhatsAppPresetId}
                  onChange={(e) => {
                    const id = e.target.value
                    setBatchWhatsAppPresetId(id)
                    const preset = whatsAppPresets.find(p => p.id === id)
                    if (preset) setBatchWhatsAppTemplate(preset.text)
                  }}
                  disabled={processingBatchOrder || store.batchGenerating}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    fontWeight: 900,
                    fontSize: 12,
                    fontFamily: ds.font,
                  }}
                >
                  <option value="custom">رسالة مخصصة</option>
                  {whatsAppPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>

                <label style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>نص الرسالة</label>
                <textarea
                  dir="rtl"
                  rows={4}
                  placeholder="اكتب رسالتك هنا..."
                  value={batchWhatsAppTemplate}
                  onChange={(e) => {
                    setBatchWhatsAppPresetId('custom')
                    setBatchWhatsAppTemplate(e.target.value)
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900"
                  disabled={processingBatchOrder || store.batchGenerating}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={openWhatsAppWithMessage}
                    disabled={processingBatchOrder || store.batchGenerating}
                    style={{
                      padding: '12px 12px',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      background: '#25D366',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                      fontFamily: ds.font,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <BsWhatsapp size={16} /> فتح واتساب
                  </button>
                  <button
                    type="button"
                    onClick={copyWhatsAppMessage}
                    disabled={processingBatchOrder || store.batchGenerating}
                    style={{
                      padding: '12px 12px',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      color: '#0f172a',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                      fontFamily: ds.font,
                    }}
                  >
                    نسخ الرسالة
                  </button>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            {isCompanyUnlocked ? (
              <button
                onClick={async () => {
                  if (store.batchNames.length === 0) {
                    toast.error('أدخل اسماً واحداً على الأقل')
                    return
                  }
                  store.setBatchGenerating(true)
                  store.setGeneratedCards([])

                  for (let i = 0; i < store.batchNames.length; i++) {
                    store.setBatchCurrentIndex(i)
                    store.setBatchProgress(Math.round(((i + 1) / store.batchNames.length) * 100))
                    store.setRecipientName(store.batchNames[i])
                    await new Promise(resolve => setTimeout(resolve, 300))
                    if (stageRef.current) {
                      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 })
                      store.addGeneratedCard({ name: store.batchNames[i], dataUrl })
                    }
                  }

                  store.setBatchGenerating(false)
                  toast.success(`تم إنشاء ${store.batchNames.length} بطاقة!`)
                }}
                disabled={store.batchGenerating || store.batchNames.length === 0}
                style={{
                  width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                  background: store.batchNames.length > 0 ? '#000' : '#ddd',
                  color: '#fff', fontSize: 15, fontWeight: 700, cursor: store.batchNames.length > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: ds.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                }}
              >
                {store.batchGenerating ? (
                  <>
                    <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    جارٍ الإنشاء... {store.batchProgress}%
                  </>
                ) : (
                  <><BsStars size={18} /> إنشاء البطاقات</>
                )}
              </button>
            ) : (
              <div style={{ borderRadius: 16, border: '1px solid #fde68a', background: '#fffbeb', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#92400e' }}>شراء إرسال جماعي</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                    {BATCH_ZIP_PRICE} <span style={{ fontSize: 12, fontWeight: 800, color: '#92400e' }}>ر.س</span> <span style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>≈</span> <span style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>${BATCH_PAYPAL_USD_PRICE}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.9, color: '#92400e', marginBottom: 12 }}>
                  حتى {batchMaxRecipients} اسم.
                </div>

                <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>كود الشركة</div>
                    {licenseActive && (
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#166534' }}>مفعل</div>
                    )}
                  </div>
                  {!licenseActive && (
                    <div style={{ display: 'grid', gap: 10 }}>
                      <input
                        type="text"
                        value={licenseCode}
                        onChange={(e) => setLicenseCode(e.target.value)}
                        placeholder="اكتب كود التفعيل"
                        disabled={processingBatchOrder || store.batchGenerating}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900"
                      />
                      {licenseError && (
                        <div style={{
                          padding: '10px 12px',
                          borderRadius: 14,
                          background: '#fff1f2',
                          border: '1px solid #fecdd3',
                          color: '#9f1239',
                          fontSize: 12,
                          lineHeight: 1.8,
                          textAlign: 'right',
                        }}>
                          {licenseError}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={activateLicenseCode}
                        disabled={processingBatchOrder || store.batchGenerating || !licenseCode.trim()}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 14,
                          border: 'none',
                          background: '#0f172a',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 900,
                          cursor: (!licenseCode.trim() || processingBatchOrder || store.batchGenerating) ? 'not-allowed' : 'pointer',
                          opacity: (!licenseCode.trim() || processingBatchOrder || store.batchGenerating) ? 0.7 : 1,
                          fontFamily: ds.font,
                        }}
                      >
                        تفعيل الكود
                      </button>
                    </div>
                  )}
                </div>

                {licenseActive ? (
                  <button
                    onClick={executeBatchPurchase}
                    disabled={processingBatchOrder || store.batchGenerating}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 14,
                      border: 'none',
                      background: '#0f172a',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: (processingBatchOrder || store.batchGenerating) ? 'not-allowed' : 'pointer',
                      opacity: (processingBatchOrder || store.batchGenerating) ? 0.7 : 1,
                      fontFamily: ds.font,
                    }}
                  >
                    {processingBatchOrder ? 'جارٍ التحضير...' : 'تجهيز وتحميل ZIP'}
                  </button>
                ) : activeBatchOrder?.status === 'consumed' ? (
                  <div style={{ padding: '10px 12px', borderRadius: 14, background: '#ecfdf5', border: '1px solid #bbf7d0', color: '#166534', fontSize: 12, lineHeight: 1.9 }}>
                    تم تحميل ملف ZIP بالفعل. كل عملية شراء مخصصة لتحميل واحد فقط. للمساعدة: {SUPPORT_CONTACT}
                  </div>
                ) : activeBatchOrder?.status === 'paid' ? (
                  <>
                    <div style={{ padding: '10px 12px', borderRadius: 14, background: '#ecfdf5', border: '1px solid #bbf7d0', color: '#166534', fontSize: 12, lineHeight: 1.9, marginBottom: 12 }}>
                      تم الدفع بنجاح. حمّل ملف ZIP الآن (تحميل مرة واحدة فقط).
                    </div>

                    {batchPaymentError && (
                      <div style={{
                        margin: '0 0 12px',
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: '#fff1f2',
                        border: '1px solid #fecdd3',
                        color: '#9f1239',
                        fontSize: 12,
                        lineHeight: 1.8,
                        textAlign: 'right',
                      }}>
                        {batchPaymentError}
                      </div>
                    )}

                    <button
                      onClick={executeBatchPurchase}
                      disabled={processingBatchOrder || store.batchGenerating}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: 14,
                        border: 'none',
                        background: '#0f172a',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 800,
                        cursor: (processingBatchOrder || store.batchGenerating) ? 'not-allowed' : 'pointer',
                        opacity: (processingBatchOrder || store.batchGenerating) ? 0.7 : 1,
                        fontFamily: ds.font,
                      }}
                    >
                      {processingBatchOrder ? 'جارٍ التحضير...' : 'حمّل ZIP الآن'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      marginBottom: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                          alt="PayPal"
                          style={{ width: 37, height: 23, display: 'block' }}
                        />
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>الدفع عبر بايبال</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: 10 }}>
                      <div>
                        <style>{`.pp-K7978QWGA8CHJ{text-align:center;border:none;border-radius:0.25rem;min-width:11.625rem;padding:0 2rem;height:2.625rem;font-weight:bold;background-color:#FFD140;color:#000000;font-family:"Helvetica Neue",Arial,sans-serif;font-size:1rem;line-height:1.25rem;cursor:pointer;}`}</style>
                        <form
                          action="https://www.paypal.com/ncp/payment/K7978QWGA8CHJ"
                          method="post"
                          target="_blank"
                          style={{ display: 'inline-grid', justifyItems: 'center', alignContent: 'start', gap: '0.5rem', width: '100%' }}
                        >
                          <input className="pp-K7978QWGA8CHJ" type="submit" value="ادفع ببايبال ($21)" />
                          <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="cards" />
                          <section style={{ fontSize: '0.75rem' }}>
                            مدعوم من{' '}
                            <img
                              src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                              alt="paypal"
                              style={{ height: '0.875rem', verticalAlign: 'middle' }}
                            />
                          </section>
                        </form>
                      </div>

                      <a
                        href={buildWhatsAppSupportUrl('أريد كود تفعيل للجماعي')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '14px 18px',
                          borderRadius: 14,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          color: '#0f172a',
                          fontSize: 15,
                          fontWeight: 900,
                          textDecoration: 'none',
                          textAlign: 'center',
                          fontFamily: ds.font,
                        }}
                      >
                        الدفع بكود تفعيل
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Generated Cards */}
          {isCompanyUnlocked && store.generatedCards.length > 0 && !store.batchGenerating && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: ds.shadow.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>البطاقات المُولّدة ({store.generatedCards.length})</h4>
                <button
                  onClick={async () => {
                    const zip = new JSZip()
                    store.generatedCards.forEach((card) => {
                      const base64 = card.dataUrl.split(',')[1]
                      zip.file(`card-${card.name}.png`, base64, { base64: true })
                    })
                    const content = await zip.generateAsync({ type: 'blob' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(content)
                    link.download = `cards-batch-${store.generatedCards.length}.zip`
                    link.click()
                    toast.success('تم تحميل ملف ZIP.')
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    background: '#000', color: '#fff', border: 'none', borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ds.font
                  }}
                >
                  <BsCloudDownload size={16} /> تحميل ZIP
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                {store.generatedCards.map((card, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid #eee' }}>
                    <img src={card.dataUrl} alt={card.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '12px 6px 6px', textAlign: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 9, fontWeight: 600 }}>{card.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ Attribution Footer أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */}
      <div style={{
        background: '#fff', borderTop: '1px solid #eee',
        padding: '50px 20px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Designer Credit Card */}
          <div style={{
            background: '#fafafa', borderRadius: 16, padding: '28px 32px',
            marginBottom: 24, border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888', fontFamily: ds.font }}>
              تم تصميم واجهة المحرر بالتعاون مع
            </p>
            <a
              href="https://x.com/am_designing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                background: '#000', color: '#fff', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: 600, fontFamily: ds.font
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @am_designing
            </a>
          </div>

          {/* Collaboration */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#999', fontFamily: ds.font }}>شراكة وتعاون مع فريق التصميم</span>
            <a
              href="https://x.com/am_designing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: '#000', fontWeight: 600, fontFamily: ds.font,
                textDecoration: 'underline', textUnderlineOffset: 3
              }}
            >
              am_designing
            </a>
          </div>
        </div>
      </div>

      {/* Animations & Responsive */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tooltipIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        input[type="range"] { -webkit-appearance: none; height: 6px; border-radius: 6px; background: #eee; cursor: pointer; width: 100%; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #000; cursor: pointer; }
        
        .tool-tabs::-webkit-scrollbar { height: 4px; }
        .tool-tabs::-webkit-scrollbar-track { background: transparent; }
        .tool-tabs::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        
        /* Desktop Layout */
        @media (min-width: 1024px) {
          .designer-grid {
            display: grid !important;
            grid-template-columns: 1fr 420px !important;
            gap: 28px !important;
            direction: rtl;
          }
          .canvas-section {
            position: sticky;
            top: 140px;
          }
          .tool-tabs {
            display: grid !important;
            grid-template-columns: repeat(6, 1fr) !important;
            overflow: visible !important;
          }
        }
        
        /* Mobile Layout */
        @media (max-width: 1023px) {
          .designer-grid {
            flex-direction: column !important;
          }
          .canvas-section {
            order: 1;
          }
          .tools-section {
            order: 2;
          }
        }
        
        /* Batch mode mobile */
        @media (max-width: 768px) {
          .batch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )

  /* أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯
     PANEL RENDER FUNCTIONS
  أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯أ¢â€¢ع¯ */
  function renderPanel() {
    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ BACKGROUNDS PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'backgrounds') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsImage size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>الخلفيات</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>اختر أو ارفع خلفية للبطاقة</p>
          </div>
        </div>

        {/* Upload Button - Paid Feature (35 SAR) */}
        <div
          onClick={() => navigate('/checkout?product=custom-design&price=35&name=' + encodeURIComponent('رفع تصميم خاص'))}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
            padding: '16px', background: 'linear-gradient(135deg, #f9f6ef, #fdf8ee)', border: '2px dashed #d4af37', borderRadius: 14,
            cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font, position: 'relative'
          }}
        >
          <BsPlusLg size={16} color="#b8860b" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#b8860b' }}>رفع تصميم خاص</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', background: '#b8860b', padding: '3px 10px', borderRadius: 6 }}>35 ر.س</span>
        </div>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {allTemplates.map((t) => (
            <button key={t.id} onClick={() => handleTemplateSelect(t)} style={{
              position: 'relative', aspectRatio: '1', borderRadius: 14, overflow: 'hidden', padding: 0,
              border: store.selectedTemplate === t.id ? '3px solid #000' : '2px solid #eee',
              cursor: 'pointer', transition: 'all 200ms'
            }}>
              <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.closest('button').style.display = 'none' }} />
              {t.exclusive && (
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  background: 'linear-gradient(135deg, #d4af37, #f5d67b)',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: ds.font,
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                }}>
                  حصري
                </div>
              )}
              {t.isCustom && (
                <button onClick={(ev) => { ev.stopPropagation(); handleDeleteCustomTemplate(t.id) }} style={{
                  position: 'absolute', top: 6, left: 6, width: 24, height: 24, borderRadius: '50%',
                  background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14
                }}>×</button>
              )}
              {store.selectedTemplate === t.id && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BsCheck2 size={14} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )

    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ CALLIGRAPHY PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'calligraphy') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsStars size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>المخطوطات</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{allFilteredCalligraphy.length} مخطوطة متاحة</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {calligraphyCategories.map(cat => (
            <button key={cat.id} onClick={() => { setCalligraphyCat(cat.id); setCalligraphyLimit(30) }} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
              background: calligraphyCat === cat.id ? '#000' : '#f5f5f5',
              color: calligraphyCat === cat.id ? '#fff' : '#666',
              fontSize: 13, fontWeight: 600, transition: 'all 200ms'
            }}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Calligraphy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
          {filteredCalligraphy.map(c => (
            <button key={c.id} onClick={() => { store.setSelectedCalligraphy(store.selectedCalligraphy === c.path ? null : c.path); store.setCalligraphyPos({ x: 0.5, y: 0.25 }) }} style={{
              padding: 10, borderRadius: 12, border: store.selectedCalligraphy === c.path ? '2px solid #000' : '2px solid #eee',
              cursor: 'pointer', background: calligraphyCat === 'black' ? '#f5f5f5' : '#1a1a2e',
              transition: 'all 200ms', minHeight: 70
            }}>
              <img src={c.path} alt={c.name} style={{ width: '100%', height: 'auto', maxHeight: 48, objectFit: 'contain' }} loading="lazy" onError={(e) => { e.target.closest('button').style.display = 'none' }} />
            </button>
          ))}
        </div>

        {calligraphyLimit < allFilteredCalligraphy.length && (
          <button onClick={() => setCalligraphyLimit(prev => prev + 60)} style={{
            width: '100%', padding: '12px', marginTop: 16, borderRadius: 12,
            border: '2px solid #eee', background: '#fff', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: ds.font, color: '#000'
          }}>
            عرض المزيد ({allFilteredCalligraphy.length - calligraphyLimit})
          </button>
        )}

        {/* Scale Control */}
        {store.selectedCalligraphy && (
          <div style={{ marginTop: 20, padding: 16, background: '#f8f8f8', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
              <span style={{ fontSize: 12, color: '#888', background: '#fff', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.calligraphyScale * 100)}%</span>
            </div>
            <input type="range" min={0.15} max={1} step={0.05} value={store.calligraphyScale} onChange={(e) => store.setCalligraphyScale(Number(e.target.value))} style={{ width: '100%' }} />
            <button onClick={() => store.setSelectedCalligraphy(null)} style={{
              width: '100%', padding: '12px', marginTop: 12, borderRadius: 12,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة المخطوطة
            </button>
          </div>
        )}
      </div>
    )

    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ PHOTO PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'photo') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsPersonCircle size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>الصورة</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>أضف صورة للبطاقة</p>
          </div>
        </div>

        {/* Upload Button */}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
          padding: '20px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
          cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font
        }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
          <BsPersonCircle size={20} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{store.personalPhoto ? 'تغيير الصورة' : 'اختر صورة'}</span>
        </label>

        {/* Photo Controls */}
        {store.personalPhoto && (
          <div style={{ animation: 'fadeUp 200ms ease' }}>
            {/* Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, overflow: 'hidden', border: '3px solid #000',
                borderRadius: store.photoShape === 'circle' ? '50%' : store.photoShape === 'rounded' ? 16 : 0
              }}>
                <img src={store.personalPhoto} alt="صورة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Shape Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>الشكل</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'circle', label: 'دائرة' }, { id: 'rounded', label: 'مستدير' }, { id: 'square', label: 'مربع' }].map(s => (
                  <button key={s.id} onClick={() => store.setPhotoShape(s.id)} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                    background: store.photoShape === s.id ? '#000' : '#f5f5f5',
                    color: store.photoShape === s.id ? '#fff' : '#666',
                    fontSize: 13, fontWeight: 600, transition: 'all 200ms'
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
                <span style={{ fontSize: 12, color: '#888', background: '#f5f5f5', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.photoScale * 100)}%</span>
              </div>
              <input type="range" min={0.08} max={0.6} step={0.02} value={store.photoScale} onChange={(e) => store.setPhotoScale(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Border Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#f8f8f8', borderRadius: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>إطار</span>
              <button onClick={() => store.setPhotoBorder(!store.photoBorder)} style={{
                width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                background: store.photoBorder ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, transition: 'all 200ms',
                  left: store.photoBorder ? 23 : 3
                }} />
              </button>
            </div>

            {store.photoBorder && (
              <div style={{ padding: 16, background: '#f8f8f8', borderRadius: 14, marginBottom: 12, animation: 'fadeUp 200ms ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>سمك الإطار</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{store.photoBorderWidth}px</span>
                </div>
                <input type="range" min={1} max={8} step={1} value={store.photoBorderWidth} onChange={(e) => store.setPhotoBorderWidth(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
                <ColorPicker value={store.photoBorderColor} onChange={store.setPhotoBorderColor} label="اللون" />
              </div>
            )}

            {/* Remove Button */}
            <button onClick={() => store.setPersonalPhoto(null)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة الصورة
            </button>
          </div>
        )}
      </div>
    )

    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ LOGO PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'logo') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsBuilding size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>الشعار</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>أضف شعاراً للبطاقة</p>
          </div>
        </div>

        {/* Upload Logo */}
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
          padding: '20px', background: '#f8f8f8', border: '2px dashed #ddd', borderRadius: 14,
          cursor: 'pointer', marginBottom: 20, transition: 'all 200ms', fontFamily: ds.font
        }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = (ev) => {
              store.setCompanyLogo(ev.target.result)
              toast.success('تم إضافة الشعار')
            }
            reader.readAsDataURL(file)
            e.target.value = ''
          }} />
          <BsBuilding size={20} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{store.companyLogo ? 'تغيير الشعار' : 'رفع شعار'}</span>
        </label>

        {/* Logo Controls */}
        {store.companyLogo && (
          <div style={{ animation: 'fadeUp 200ms ease' }}>
            {/* Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, overflow: 'hidden', border: '2px solid #eee', borderRadius: 12, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={store.companyLogo} alt="شعار" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Position Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>موضع الشعار</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { id: 'top-right', label: 'أعلى يمين' },
                  { id: 'top-left', label: 'أعلى يسار' },
                  { id: 'bottom-right', label: 'أسفل يمين' },
                  { id: 'bottom-left', label: 'أسفل يسار' },
                  { id: 'free', label: 'حر' },
                ].map(pos => (
                  <button key={pos.id} onClick={() => store.setLogoPosition(pos.id)} style={{
                    padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: ds.font,
                    background: store.logoPosition === pos.id ? '#000' : '#f5f5f5',
                    color: store.logoPosition === pos.id ? '#fff' : '#666',
                    fontSize: 13, fontWeight: 600, transition: 'all 200ms'
                  }}>
                    {pos.label}
                  </button>
                ))}
              </div>
              {store.logoPosition === 'free' && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
                  اسحب الشعار داخل المعاينة لوضعه في أي مكان.
                </div>
              )}
            </div>

            {/* Size */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>الحجم</span>
                <span style={{ fontSize: 12, color: '#888', background: '#f5f5f5', padding: '4px 10px', borderRadius: 8 }}>{Math.round(store.logoScale * 100)}%</span>
              </div>
              <input type="range" min={0.05} max={0.3} step={0.01} value={store.logoScale} onChange={(e) => store.setLogoScale(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            {/* Remove Button */}
            <button onClick={() => store.setCompanyLogo(null)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: ds.font
            }}>
              إزالة الشعار
            </button>
          </div>
        )}
      </div>
    )

    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ TEXT PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'text') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BsChatLeftText size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>النصوص</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>حرّر نصوص البطاقة بسهولة</p>
          </div>
        </div>

        {/* Main Text */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>النص الرئيسي</label>
            <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.fontSize}px</span>
          </div>
          <textarea value={store.mainText} onChange={(e) => store.setMainText(e.target.value)} onFocus={() => store.setActiveElement('mainText')}
            dir="rtl" rows={2} placeholder="اكتب التهنئة..."
            style={{
              width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
              borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa'
            }}
          />
          <input type="range" min={16} max={80} value={store.fontSize} onChange={(e) => store.setFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </div>

        {/* Sub Text */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>النص الفرعي</label>
            <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.subFontSize}px</span>
          </div>
          <textarea value={store.subText} onChange={(e) => store.setSubText(e.target.value)} onFocus={() => store.setActiveElement('subText')}
            dir="rtl" rows={2} placeholder="مثال: تقبل الله طاعاتكم"
            style={{
              width: '100%', padding: 14, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
              borderRadius: 12, resize: 'none', outline: 'none', transition: 'border-color 200ms', background: '#fafafa'
            }}
          />
          <input type="range" min={10} max={52} value={store.subFontSize} onChange={(e) => store.setSubFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
        </div>

        {/* Names */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>اسم المستلم</label>
              <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.recipientFontSize}px</span>
            </div>
            <input type="text" value={store.recipientName} onChange={(e) => store.setRecipientName(e.target.value)}
              dir="rtl" placeholder="مثال: أم خالد"
              style={{
                width: '100%', padding: 12, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
            <input type="range" min={10} max={52} value={store.recipientFontSize} onChange={(e) => store.setRecipientFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>اسم المرسل</label>
              <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: 6 }}>{store.senderFontSize}px</span>
            </div>
            <input type="text" value={store.senderName} onChange={(e) => store.setSenderName(e.target.value)}
              dir="rtl" placeholder="مثال: محمد"
              style={{
                width: '100%', padding: 12, fontSize: 14, fontFamily: ds.font, border: '2px solid #eee',
                borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
            <input type="range" min={10} max={52} value={store.senderFontSize} onChange={(e) => store.setSenderFontSize(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
          </div>
        </div>

        {/* Ready Texts */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>نصوص جاهزة</h4>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <BsSearch style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
              dir="rtl" placeholder="ابحث..."
              style={{
                width: '100%', padding: '10px 36px 10px 12px', fontSize: 13, fontFamily: ds.font,
                border: '2px solid #eee', borderRadius: 10, outline: 'none', background: '#fafafa'
              }}
            />
          </div>
          <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredTexts.slice(0, 10).map((t) => (
              <button key={t.id} onClick={() => {
                store.setMainText(t.text.split('\n')[0] || t.text.substring(0, 60))
                store.setSubText(t.text.length > 60 ? t.text.substring(60, 120) : '')
                toast.success('تم اختيار النص')
              }}
                dir="rtl"
                style={{
                  padding: 12, borderRadius: 10, border: '1px solid #eee', background: '#fafafa',
                  cursor: 'pointer', textAlign: 'right', fontSize: 12, lineHeight: 1.6,
                  fontFamily: ds.font, transition: 'all 200ms'
                }}
              >
                {t.text.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    )

    // أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬ STYLE PANEL أ¢â€‌â‚¬أ¢â€‌â‚¬أ¢â€‌â‚¬
    if (activePanel === 'style') return (
      <div style={{ animation: 'fadeUp 200ms ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineColorSwatch size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>التنسيق</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>الخط والألوان والتأثيرات</p>
          </div>
        </div>

        {/* Font Selection */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>الخط</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {availableFonts.map(f => (
              <button key={f.id} onClick={() => store.setFont(f.id)} style={{
                padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: store.selectedFont === f.id ? '#000' : '#f5f5f5',
                color: store.selectedFont === f.id ? '#fff' : '#666',
                fontSize: 13, fontWeight: 600, fontFamily: f.family, transition: 'all 200ms'
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div style={{ marginBottom: 24, borderTop: '1px solid #eee', paddingTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 14 }}>ألوان النصوص</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ColorPicker value={store.textColor} onChange={store.setTextColor} label="الرئيسي" />
            <ColorPicker value={store.subTextColor} onChange={store.setSubTextColor} label="الفرعي" />
            <ColorPicker value={store.recipientColor} onChange={store.setRecipientColor} label="المستلم" />
            <ColorPicker value={store.senderColor} onChange={store.setSenderColor} label="المرسل" />
          </div>
        </div>

        {/* Effects */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 14 }}>التأثيرات</label>

          {/* Shadow Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>ظل النص</span>
            <button onClick={() => store.setTextShadow(!store.textShadow)} style={{
              width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: store.textShadow ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'all 200ms', left: store.textShadow ? 23 : 3 }} />
            </button>
          </div>

          {/* Stroke Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>حدود النص</span>
            <button onClick={() => store.setTextStroke(!store.textStroke)} style={{
              width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: store.textStroke ? '#000' : '#ddd', position: 'relative', transition: 'all 200ms'
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'all 200ms', left: store.textStroke ? 23 : 3 }} />
            </button>
          </div>

          {store.textStroke && (
            <div style={{ padding: 14, background: '#f8f8f8', borderRadius: 12, marginBottom: 10, animation: 'fadeUp 200ms ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>سمك الحدود</span>
                <span style={{ fontSize: 12, color: '#888' }}>{store.textStrokeWidth}px</span>
              </div>
              <input type="range" min={0.5} max={5} step={0.5} value={store.textStrokeWidth} onChange={(e) => store.setTextStrokeWidth(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
              <ColorPicker value={store.textStrokeColor} onChange={store.setTextStrokeColor} label="اللون" />
            </div>
          )}

          {/* Overlay */}
          <div style={{ padding: 14, background: '#f8f8f8', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>طبقة لونية</span>
              <span style={{ fontSize: 12, color: '#888' }}>{Math.round(store.overlayOpacity * 100)}%</span>
            </div>
            <input type="range" min={0} max={0.8} step={0.05} value={store.overlayOpacity} onChange={(e) => store.setOverlayOpacity(Number(e.target.value))} style={{ width: '100%', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {['#000000', '#17012C', '#ffffff', '#0a1628'].map(c => (
                <button key={c} onClick={() => store.setOverlayColor(c)} style={{
                  width: 32, height: 32, borderRadius: '50%', border: store.overlayColor === c ? '2px solid #000' : '1px solid #ddd',
                  backgroundColor: c, cursor: 'pointer', transition: 'transform 150ms',
                  transform: store.overlayColor === c ? 'scale(1.15)' : 'scale(1)'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )

    return null
  }
}

export default function EditorPage() {
  return (
    <EditorErrorBoundary>
      <EditorPageInner />
    </EditorErrorBoundary>
  )
}
