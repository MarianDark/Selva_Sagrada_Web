// src/lib/api.js
import axios from 'axios'

const isProd = import.meta.env.MODE === 'production'
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

// 👉 En dev usamos proxy (/api -> vite.config), en prod tomamos la VITE_API_URL
const baseURL = isProd && provided ? `${provided}/api` : '/api'

const api = axios.create({
  baseURL,
  withCredentials: true, // cookies (session)
  headers: { 'Content-Type': 'application/json' },
})

// ====== Interceptor de errores global ======
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const method = err.config?.method?.toUpperCase()
    const url = err.config?.url

    console.error('API error:', {
      method,
      url,
      status,
      data: err.response?.data,
    })

    if (status === 401) {
      // 🚫 evita redirigir si ya estamos en login o registro
      const current = window.location.pathname
      const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) =>
        current.startsWith(p)
      )

      if (!isAuthPage) {
        // opcional: muestra aviso antes de redirigir
        console.warn('Sesión expirada, redirigiendo a login...')
        window.location.href = `/login?next=${encodeURIComponent(current)}`
      }
    }

    return Promise.reject(err)
  }
)

export { api }
export default api
