// Fix for template selection issue in EditorPage.jsx
// This file contains the fixes needed to resolve the "يرجى إعادة تحميل الصفحة" error

// STEP 1: Add this safe template selection handler after the readyDesigns constant
// (around line 268 in EditorPage.jsx, after the readyDesigns array definition)

/* •¯•¯•¯•¯ Safe Template Selection Handler •¯•¯•¯•¯ */
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
    
    // Safely set the template
    store.setTemplate(template.id)
    
    // If in ready mode, set default colors from template
    if (mode === 'ready' && template.textColor) {
      setReadyNameColor(template.textColor)
    }
    
    // Success feedback
    console.log('Template selected successfully:', template.id)
  } catch (error) {
    console.error('Error in handleTemplateSelect:', error)
    toast.error('حدث خطأ أثناء اختيار القالب')
    // Don't let the error propagate to the error boundary
  }
}, [store, mode, setReadyNameColor])

// STEP 2: Replace all template button onClick handlers in the READY MODE section
// Find the template buttons and replace their onClick handlers

// ORIGINAL CODE (around line 1800-1850 in READY MODE section):
/*
                finalReadyTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      store.setTemplate(t.id)
                    }}
*/

// REPLACE WITH:
/*
                finalReadyTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleTemplateSelect(t)
                    }}
*/

// STEP 3: Also update the BATCH MODE template selection (around line 2500)
// Find similar onClick handlers and replace them

// ORIGINAL CODE in BATCH MODE:
/*
                allTemplates.filter(t => !t.image?.includes('مخطوطات بيضاء')).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => store.setTemplate(t.id)}
*/

// REPLACE WITH:
/*
                allTemplates.filter(t => !t.image?.includes('مخطوطات بيضاء')).map((t) => (
                  <button
                    key={t.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleTemplateSelect(t)
                    }}
*/

// STEP 4: Update the Designer Mode backgrounds panel (around line 3400)
// ORIGINAL CODE:
/*
          {allTemplates.map((t) => (
            <button key={t.id} onClick={() => store.setTemplate(t.id)} style={...}>
*/

// REPLACE WITH:
/*
          {allTemplates.map((t) => (
            <button key={t.id} onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleTemplateSelect(t)
            }} style={...}>
*/

// STEP 5: Improve the EditorErrorBoundary to provide more detailed error info
// Replace the existing EditorErrorBoundary class (around line 20-45) with this improved version:

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
    console.error('Error boundary:', info)
    
    // Log the error for debugging
    const errorDetails = {
      message: err?.message,
      stack: err?.stack,
      componentStack: info?.componentStack,
      timestamp: new Date().toISOString()
    }
    
    // Store error details in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('editor_errors') || '[]')
      errors.push(errorDetails)
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.shift()
      }
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
              // Clear error logs and try to recover
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
              cursor: 'pointer'
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

// STEP 6: Add error handling to the useImage hook
// Replace the existing useImage function (around line 130-170) with this improved version:

function useImage(src) {
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    if (!src) { 
      setImage(null)
      setLoaded(false)
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

// STEP 7: Add null checks before rendering images
// In the Stage component, add null checks:

// ORIGINAL:
// {bgImage && bgLoaded && <KonvaImage image={bgImage} width={stageSize.width} height={stageSize.height} />}

// KEEP AS IS - it already has proper null checks

// STEP 8: Validate template data before rendering
// Add this check after the template computation (around line 430):

// After this line:
// const currentTemplate = allTemplates.find(t => t.id === store.selectedTemplate) || allTemplates[0]

// Add:
/*
  // Validate currentTemplate
  useEffect(() => {
    if (store.selectedTemplate && !currentTemplate) {
      console.warn('Selected template not found:', store.selectedTemplate)
      // Try to find the template in the merged arrays
      const foundInReady = finalReadyTemplates.find(t => t.id === store.selectedTemplate)
      const foundInDesigner = finalDesignerTemplates.find(t => t.id === store.selectedTemplate)
      const foundInCustom = customTemplates.find(t => t.id === store.selectedTemplate)
      
      if (foundInReady || foundInDesigner || foundInCustom) {
        console.log('Found template in fallback:', foundInReady || foundInDesigner || foundInCustom)
        // It's in one of the arrays but not in allTemplates
        // This shouldn't happen, but if it does, we can recover
      } else {
        console.error('Template not found anywhere:', store.selectedTemplate)
        // Reset to first available template
        if (allTemplates.length > 0) {
          console.log('Resetting to first template:', allTemplates[0].id)
          store.setTemplate(allTemplates[0].id)
        }
      }
    }
  }, [store.selectedTemplate, currentTemplate, allTemplates, finalReadyTemplates, finalDesignerTemplates, customTemplates, store])
*/

// INSTRUCTIONS FOR APPLYING THE FIX:
// 1. Add the handleTemplateSelect function after the readyDesigns array (STEP 1)
// 2. Replace all template button onClick handlers with the safe version (STEPS 2, 3, 4)
// 3. Replace the EditorErrorBoundary class with the improved version (STEP 5)
// 4. Optionally replace the useImage function with the improved version (STEP 6)
// 5. Add the template validation useEffect (STEP 8)

// IMPORTANT: The handleTemplateSelect function uses `store`, `mode`, `setReadyNameColor`
// Make sure these are all available in the scope where you add the function
// It should be added inside the EditorPageInner component function

console.log('Template selection fix file loaded. Follow the instructions above to apply the fixes.')