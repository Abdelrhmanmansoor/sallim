import { useState, useEffect } from 'react'

const DISMISS_KEY = 'sallam_whatsapp_dismissed'

export default function WhatsAppFloat() {
  const [showMessage, setShowMessage] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  
  const phoneNumber = '201007835547'
  const message = 'مرحباً، عندي استفسار عن منصة سَلِّم 🎉'

  useEffect(() => {
    const savedDismissed = window.localStorage.getItem(DISMISS_KEY) === '1'
    setDismissed(savedDismissed)

    const media = window.matchMedia('(min-width: 768px)')
    const updateViewport = () => setIsDesktop(media.matches)
    updateViewport()

    if (media.addEventListener) {
      media.addEventListener('change', updateViewport)
      return () => media.removeEventListener('change', updateViewport)
    }

    media.addListener(updateViewport)
    return () => media.removeListener(updateViewport)
  }, [])
  
  // Show message bubble on desktop only and after a short delay
  useEffect(() => {
    if (!isDesktop || dismissed) {
      setShowMessage(false)
      return
    }

    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [dismissed, isDesktop])
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }
  
  const handleDismiss = (e) => {
    e.stopPropagation()
    setShowMessage(false)
    setDismissed(true)
    window.localStorage.setItem(DISMISS_KEY, '1')
  }
  
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 pointer-events-none">
      {/* Message Bubble */}
      {isDesktop && (
        <div
          className={`hidden sm:block relative bg-white rounded-2xl rounded-br-md p-4 shadow-2xl shadow-black/20 max-w-[280px] pointer-events-auto transition-all duration-400 ease-out ${
            showMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="إغلاق الرسالة"
            className="absolute -top-2 -left-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs transition-colors"
          >
            x
          </button>

          {/* Message content */}
          <div>
            <p className="text-gray-800 text-sm font-bold mb-1">تحتاج مساعدة؟</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              تواصل معنا عبر واتساب لأي استفسار أو اقتراح
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="mt-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              تواصل معنا الآن
            </button>
          </div>

          {/* Bubble tail */}
          <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white transform rotate-45" />
        </div>
      )}
      
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        aria-label="التواصل عبر واتساب"
        className="group pointer-events-auto relative w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        
        {/* WhatsApp icon */}
        <svg className="w-7 h-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </div>
  )
}
