import { createContext, useContext, useState, useEffect } from 'react'

const CompanyContext = createContext(null)

export const CompanyProvider = ({ children }) => {
    const [company, setCompany] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('sallim_company_token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check local storage for token
        const savedToken = localStorage.getItem('sallim_company_token')
        const savedCompanyStr = localStorage.getItem('sallim_company_data')

        if (savedToken && savedCompanyStr) {
            try {
                setCompany(JSON.parse(savedCompanyStr))
                setToken(savedToken)
            } catch (e) {
                localStorage.removeItem('sallim_company_token')
                localStorage.removeItem('sallim_company_data')
            }
        }
        setLoading(false)
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
        setToken(null)
        setCompany(null)
    }

    const updateCompanyData = (newData) => {
        const updated = { ...company, ...newData }
        setCompany(updated)
        localStorage.setItem('sallim_company_data', JSON.stringify(updated))
    }

    const activate = async (email, code, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v1/company/activate`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v1/company/login`, {
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

    return (
        <CompanyContext.Provider value={{
            company,
            token,
            isAuthenticated: !!company,
            loading,
            activate,
            login: loginCompany,
            logout,
            updateCompanyData
        }}>
            {children}
        </CompanyContext.Provider>
    )
}

export const useCompany = () => useContext(CompanyContext)
