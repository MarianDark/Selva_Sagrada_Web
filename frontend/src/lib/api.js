// src/lib/api.js
import axios from 'axios'

// Detectamos entorno y construimos baseURL
const isProd = import.meta.env.MODE === 'production'
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const baseURL = isProd && provided ? `${provided}/api` : '/api'

export const api = axios.create({
  baseURL,
  withCredentials: true, // importante para cookies httpOnly
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// ====== Interceptor de errores global ======
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const method = err.config?.method?.toUpperCase()
    const url = err.config?.url

    // Log más descriptivo (útil en dev/debug)
    console.error('API error:', {
      method,
      url,
      status,
      data: err.response?.data,
    })

    if (status === 401) {
      console.warn('No autorizado o sesión expirada')

      // 🚫 Evita bucle si ya estamos en páginas de auth
      const current = window.location.pathname
      const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) =>
        current.startsWith(p)
      )

      if (!isAuthPage) {
        // 🔄 Redirige con "next" para volver luego
        window.location.href = `/login?next=${encodeURIComponent(current)}`
      }
    }

    return Promise.reject(err)
  }
)

export default api
