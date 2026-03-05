import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportAsPNG(elementId) {
  const element = document.getElementById(elementId)
  if (!element) return null
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    width: 1080,
    height: 1080,
  })
  
  const link = document.createElement('a')
  link.download = `eid-greeting-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
  
  return canvas.toDataURL('image/png', 1.0)
}

export async function exportAsPDF(elementId) {
  const element = document.getElementById(elementId)
  if (!element) return
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  })
  
  const imgData = canvas.toDataURL('image/png', 1.0)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1080],
  })
  
  pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080)
  pdf.save(`eid-greeting-${Date.now()}.pdf`)
}

export function generateWhatsAppLink(phone, text, imageUrl) {
  const encodedText = encodeURIComponent(text)
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodedText}`
  }
  return `https://wa.me/?text=${encodedText}`
}

export function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] || ''
    })
    return obj
  })
}
