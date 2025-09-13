// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data) // { _id, name, email, role, ... }
    } catch (e) {
      // 401 => simplemente no hay sesión; no es error de app
      if (e?.response?.status === 401) setUser(null)
      else console.error('auth/me error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // helpers para usar desde Login/Logout sin repetir lógica
  const loginSuccess = useCallback(async () => {
    // tras /auth/login en el backend, refrescamos el usuario
    await refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout').catch(() => {})
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const value = { user, loading, refresh, setUser, loginSuccess, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
