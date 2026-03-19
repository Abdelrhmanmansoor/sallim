import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const CompanyContext = createContext(null)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

export const CompanyProvider = ({ children }) => {
    const [company, setCompany] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('sallim_company_token'))
    const [portalCompany, setPortalCompany] = useState(null)
    const [portalToken, setPortalToken] = useState(sessionStorage.getItem('sallim_company_context_token') || localStorage.getItem('sallim_company_context_token'))
    const [userLinkedCompany, setUserLinkedCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    const syncUserLinkedCompany = () => {
        try {
            const rawUser = localStorage.getItem('user')
            if (!rawUser) {
                setUserLinkedCompany(null)
                return
            }
            const user = JSON.parse(rawUser)
            if (user?.company && typeof user.company === 'object') {
                setUserLinkedCompany(user.company)
            } else {
                setUserLinkedCompany(null)
            }
        } catch {
            setUserLinkedCompany(null)
        }
    }

    useEffect(() => {
        const savedToken = localStorage.getItem('sallim_company_token')
        const savedCompanyStr = localStorage.getItem('sallim_company_data')
        const savedPortalToken = sessionStorage.getItem('sallim_company_context_token') || localStorage.getItem('sallim_company_context_token')
        const savedPortalCompany = sessionStorage.getItem('sallim_company_context') || localStorage.getItem('sallim_company_context')

        if (savedToken && savedCompanyStr) {
            try {
                setCompany(JSON.parse(savedCompanyStr))
                setToken(savedToken)
            } catch (e) {
                localStorage.removeItem('sallim_company_token')
                localStorage.removeItem('sallim_company_data')
            }
        }

        if (savedPortalToken && savedPortalCompany) {
            try {
                setPortalToken(savedPortalToken)
                setPortalCompany(JSON.parse(savedPortalCompany))
            } catch {
                sessionStorage.removeItem('sallim_company_context_token')
                sessionStorage.removeItem('sallim_company_context')
                localStorage.removeItem('sallim_company_context_token')
                localStorage.removeItem('sallim_company_context')
            }
        }

        syncUserLinkedCompany()

        const handleUserUpdate = () => syncUserLinkedCompany()
        window.addEventListener('user-update', handleUserUpdate)
        window.addEventListener('storage', handleUserUpdate)

        setLoading(false)

        return () => {
            window.removeEventListener('user-update', handleUserUpdate)
            window.removeEventListener('storage', handleUserUpdate)
        }
    }, [])

    const login = (newToken, companyData) => {
        localStorage.setItem('sallim_company_token', newToken)
        localStorage.setItem('sallim_company_data', JSON.stringify(companyData))
        setToken(newToken)
        setCompany(companyData)
    }

    const logout = () => {
        localStorage.removeItem('sallim_company_token')
        localStorage.removeItem('sallim_company_data')
        sessionStorage.removeItem('sallim_company_context')
        sessionStorage.removeItem('sallim_company_context_token')
        setToken(null)
        setCompany(null)
        setPortalCompany(null)
        setPortalToken(null)
    }

    const setPortalContext = (companyData, companyContextToken) => {
        if (!companyData || !companyContextToken) return
        sessionStorage.setItem('sallim_company_context', JSON.stringify(companyData))
        sessionStorage.setItem('sallim_company_context_token', companyContextToken)
        setPortalCompany(companyData)
        setPortalToken(companyContextToken)
    }

    const clearPortalContext = () => {
        sessionStorage.removeItem('sallim_company_context')
        sessionStorage.removeItem('sallim_company_context_token')
        localStorage.removeItem('sallim_company_context')
        localStorage.removeItem('sallim_company_context_token')
        setPortalCompany(null)
        setPortalToken(null)
    }

    const updateCompanyData = (newData) => {
        const updated = { ...company, ...newData }
        setCompany(updated)
        localStorage.setItem('sallim_company_data', JSON.stringify(updated))
    }

    const registerFree = async (companyName, email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/company/register-free`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, email, password })
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'فشل التسجيل')
            }
            login(data.data.token, data.data.company)
            return { success: true, message: data.message }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const activate = async (email, code, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/company/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'فشل التفعيل')
            }

            // Auto login on success
            login(data.data.token, data.data.company)

            return { success: true, message: data.message }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const loginCompany = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/company/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'فشل تسجيل الدخول')
            }

            login(data.data.token, data.data.company)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const loadCompanyBySlug = async (slug) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/company/context/${encodeURIComponent(slug)}`)
            const data = await response.json()
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'تعذر تحميل بيانات الشركة')
            }
            setPortalContext(data.data, data.companyContextToken)
            return { success: true, data: data.data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const resolveAccessCode = async (accessCode) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/company/access-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessCode })
            })
            const data = await response.json()
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'كود الشركة غير صحيح')
            }
            setPortalContext(data.data, data.companyContextToken)
            return { success: true, data: data.data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const activeCompany = useMemo(
        () => company || portalCompany || userLinkedCompany || null,
        [company, portalCompany, userLinkedCompany]
    )
    const contextMode = company
        ? 'company_account'
        : portalCompany
            ? 'portal'
            : userLinkedCompany
                ? 'user_linked'
                : null

    return (
        <CompanyContext.Provider value={{
            company,
            token,
            portalCompany,
            companyContextToken: portalToken,
            userLinkedCompany,
            activeCompany,
            contextMode,
            isAuthenticated: !!company,
            loading,
            activate,
            registerFree,
            login: loginCompany,
            logout,
            updateCompanyData,
            loadCompanyBySlug,
            resolveAccessCode,
            clearPortalContext,
            setPortalContext,
        }}>
            {children}
        </CompanyContext.Provider>
    )
}

export const useCompany = () => useContext(CompanyContext)
