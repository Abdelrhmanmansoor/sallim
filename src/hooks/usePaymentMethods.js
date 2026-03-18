import { useEffect, useState, useRef } from 'react'
import { getPaymobPaymentMethods } from '../utils/api'

let sharedMethods = null
let sharedError = null
let sharedPromise = null

function normalizeMethods(res) {
  return Array.isArray(res?.methods?.payment_methods)
    ? res.methods.payment_methods
    : Array.isArray(res?.methods)
      ? res.methods
      : []
}

export function mapPaymentMethodsForDisplay(methods = []) {
  const priority = ['apple pay', 'visa', 'mastercard', 'mada']
  const mapped = (methods || []).map((m) => {
    const name = String(m.name_ar || m.name_en || m.name || '').trim()
    return {
      id: m.identifier || m.name || m.id || name,
      name,
      logo: m.logo_url || m.logo || m.image || '',
      nameKey: name.toLowerCase(),
    }
  }).filter((m) => m.id || m.name)

  const deduped = mapped.filter((m, i, arr) => (
    i === arr.findIndex((x) => String(x.id) === String(m.id) || x.nameKey === m.nameKey)
  ))

  return deduped.sort((a, b) => {
    const ai = priority.findIndex((p) => a.nameKey.includes(p))
    const bi = priority.findIndex((p) => b.nameKey.includes(p))
    const ar = ai === -1 ? 999 : ai
    const br = bi === -1 ? 999 : bi
    if (ar !== br) return ar - br
    return a.name.localeCompare(b.name, 'ar')
  })
}

export async function prefetchPaymentMethods() {
  if (sharedMethods) return sharedMethods
  if (sharedPromise) return sharedPromise

  sharedPromise = getPaymobPaymentMethods()
    .then((res) => {
      sharedMethods = normalizeMethods(res)
      sharedError = null
      return sharedMethods
    })
    .catch((err) => {
      sharedError = err?.message || 'فشل تحميل طرق الدفع'
      throw err
    })
    .finally(() => {
      sharedPromise = null
    })

  return sharedPromise
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    if (sharedMethods) {
      setMethods(sharedMethods)
      setError(sharedError)
      return
    }

    setLoading(true)
    prefetchPaymentMethods()
      .then((list) => setMethods(list))
      .catch((err) => setError(err?.message || 'فشل تحميل طرق الدفع'))
      .finally(() => setLoading(false))
  }, [])

  return { methods, loading, error }
}
