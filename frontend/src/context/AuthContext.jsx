import React, {
  createContext, useContext, useEffect, useState, useCallback, useMemo
} from 'react'
import { api } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch (e) {
      const s = e?.response?.status
      if (s === 401 || !e?.response || (s >= 500 && s <= 599)) setUser(null)
      else console.error('auth/me error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const loginSuccess = useCallback(async () => {
    await refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      setLoggingOut(true)
      await api.post('/auth/logout').catch(() => {})
    } finally {
      setUser(null)
      setLoggingOut(false)
      try { localStorage.setItem('ss-logout', String(Date.now())) } catch {}
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useEffect(() => {
    const onStorage = (e) => { if (e.key === 'ss-logout') setUser(null) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isAuthenticated = !!user
  const hasRole = useCallback(
    (roles) => {
      if (!user?.role) return false
      const list = Array.isArray(roles) ? roles : [roles]
      return list.map(String).includes(String(user.role))
    },
    [user?.role]
  )

  const value = useMemo(() => ({
    user, loading, loggingOut, refresh, setUser, loginSuccess, logout, isAuthenticated, hasRole
  }), [user, loading, loggingOut, refresh, loginSuccess, logout, isAuthenticated, hasRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
