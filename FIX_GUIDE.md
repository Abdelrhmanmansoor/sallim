# إصلاح مشكلة اختيار القوالب في المحرر

## المشكلة
عند ضغط أي قالب في قسم "جاهز" يظهر إشعار "يرجى إعادة تحميل الصفحة" وفشل.

## الأسباب المحتملة
1. عدم وجود معالجة أخطاء في دالة اختيار القالب
2. عدم التحقق من صحة بيانات القالب قبل استعمالها
3. خطأ في التحقق من `selectedTemplate` في المتجر
4. خطأ في تصوير `applyPersonalSnapshot` يحاول الوصول إلى `snapshot.designer` بدلاً من `snapshot.designer`

## الحلول المقترحة

### 1. إضافة دالة آمنة لاختيار القالب

أضف هذه الدالة داخل مكون `EditorPageInner` (بعد تعريف المتغيرات):

```javascript
/* Safe Template Selection Handler */
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
    
    // If in ready mode, set default colors from template
    if (mode === 'ready' && template.textColor) {
      setReadyNameColor(template.textColor)
    }
    
    console.log('Template selected successfully:', template.id)
  } catch (error) {
    console.error('Error in handleTemplateSelect:', error)
    toast.error('حدث خطأ أثناء اختيار القالب')
    // Don't let error propagate to error boundary
  }
}, [store, mode])
```

### 2. استبدال جميع معالجات ضغط الأزرار

في قسم "جاهز" (READY MODE)، ابحث عن:
```javascript
onClick={() => {
  store.setTemplate(t.id)
}}
```

واستبدلها بـ:
```javascript
onClick={(e) => {
  e.preventDefault()
  e.stopPropagation()
  handleTemplateSelect(t)
}}
```

كرر هذا في:
- قسم "جاهز" (READY MODE) - حوالي السطر 1800
- قسم "جماعي" (BATCH MODE) - حوالي السطر 2500  
- قسم "مصمم" (DESIGNER MODE) - في panel الخلفيات، حوالي السطر 3400

### 3. إصلاح خطأ في `applyPersonalSnapshot`

في دالة `applyPersonalSnapshot`، ابحث عن:
```javascript
if (snapshot.designer) {
```

واستبدلها بـ:
```javascript
if (snapshot.designer) {
```

هذا خطأ مطبعي.

### 4. تحسين `EditorErrorBoundary`

استبدل الـ `EditorErrorBoundary` الحالي بهذا الإصدار المحسّن:

```javascript
class EditorErrorBoundary extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { hasError: false, errorInfo: null } 
  }
  
  static getDerivedStateFromError(error) { 
    console.error('EditorErrorBoundary caught an error:', error)
    return { hasError: true, errorInfo: error?.message || 'Unknown error' } 
  }
  
  componentDidCatch(err, info) {
    console.error('EditorPage error:', err)
    console.error('Error info:', info)
    console.error('Component stack:', info.componentStack)
    
    // Log error for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('editor_errors') || '[]')
      errors.push({
        message: err?.message,
        stack: err?.stack,
        timestamp: new Date().toISOString()
      })
      // Keep only last 10 errors
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
              fontFamily: ds.font
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
```

### 5. تحسين `useImage` hook

استبدل دالة `useImage` الحالية بهذا الإصدار المحسّن:

```javascript
function useImage(src) {
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    if (!src) { 
      setImage(null); 
      setLoaded(false); 
      return
    }
    
    setImage(null)
    setLoaded(false)
    
    let cancelled = false
    const img = new window.Image()
    
    // Set crossOrigin for external URLs to avoid tainted canvas issues
    if (src.startsWith('http') || src.startsWith('/')) {
      img.crossOrigin = 'anonymous'
    }
    
    img.onload = () => {
      if (cancelled) return
      console.log('Image loaded successfully:', src)
      setImage(img)
      setLoaded(true)
    }
    
    img.onerror = (err) => {
      console.warn('Image load failed:', src, err)
      if (!cancelled) { 
        setImage(null)
        setLoaded(false)
        
        // Show toast notification for failed images
        toast.error('فشل تحميل الصورة: ' + (typeof src === 'string' ? src.split('/').pop() : 'unknown'))
      }
    }
    
    img.src = src
    
    return () => { 
      cancelled = true
      img.onload = null
      img.onerror = null
    }
  }, [src])
  
  return [image, loaded]
}
```

## خطوات التنفيذ

1. **أضف دالة `handleTemplateSelect`**:
   - في مكون `EditorPageInner`، بعد تعريف جميع `useState` hooks (حوالي السطر 280)
   - أضف الكود الكامل للدالة كما هو موضح أعلاه

2. **قم بتعديل أزرار القوالب**:
   - ابحث عن جميع الأماكن التي تستخدم `store.setTemplate(t.id)` مباشرة
   - استبدلها باستخدام `handleTemplateSelect(t)`

3. **أصلح خطأ `designer`**:
   - في `applyPersonalSnapshot`، استبدل `snapshot.designer` بـ `snapshot.designer`

4. **استبدل `EditorErrorBoundary`**:
   - استبدل الـ class الحالي بالكود المحسّن الموضح أعلاه

5. **استبدل `useImage`** (اختياري):
   - استبدل الدالة بالكود المحسّن الموضح أعلاه

6. **اختبر التعديلات**:
   - افتح المتصفح واضغط F12 لفتح Console
   - جرب اختيار قالب مختلفة
   - تحقق من عدم ظهور أخطاء

## ملاحظات مهمة

- الملف `EditorPage.jsx` كبير جداً (أكثر من 4000 سطر)
- يحتوي مشاكل ترميز للنص العربي
- يُنصح بالتعديل بحذر لتجنب تدمير الملف

## إذا فشلت التعديلات

1. قم بعمل نسخة احتياطية من `EditorPage.jsx`
2. جرب تعديل قسم واحد في كل مرة
3. اختبر كل قسم على حدة
4. إذا استمرت المشكلة، قد تحتاج إلى إعادة كتابة الملف بالكامل