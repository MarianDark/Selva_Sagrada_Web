import axios from 'axios'

// ========= Base URL según entorno =========
const isProd = import.meta.env.MODE === 'production'

// Si defines VITE_API_URL en .env.prod (por ejemplo https://api.ssselvasagrada.com)
const provided = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

// En prod: usa VITE_API_URL si existe, si no cae al proxy /api
// En dev: usa /api (vite proxy o el mismo origin)
const baseURL = isProd && provided ? `${provided}/api` : '/api'

// ========= Instancia =========
export const api = axios.create({
  baseURL,
  withCredentials: true, // cookies httpOnly para la sesión
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // ❌ quitado: 'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 15000,
})

// ========= Interceptor de request (sanidad mínima) =========
api.interceptors.request.use((config) => {
  // Nunca logs de payloads sensibles
  // Si de verdad quieres loguear algo en dev, hazlo aquí filtrando campos
  return config
})

// ========= Interceptor de respuestas / errores =========
let redirecting = false

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const method = err?.config?.method?.toUpperCase?.()
    const url = err?.config?.url

    // Log útil en dev (sin exponer contraseñas ni tokens)
    if (import.meta.env.DEV) {
      console.error('API error:', {
        method,
        url,
        status: status ?? '(sin status)',
        data:
          (err?.response?.data &&
            (typeof err.response.data === 'object'
              ? { ...err.response.data, password: undefined, token: undefined }
              : err.response.data)) ||
          '(sin body)',
      })
    }

    // 401 → sesión expirada o no autenticado: redirigir a login con next
    if (status === 401) {
      const { pathname, search } = window.location
      const current = `${pathname}${search}`

      // Evita bucles si ya estás en auth
      const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) =>
        pathname.startsWith(p)
      )

      if (!isAuthPage && !redirecting) {
        redirecting = true
        window.location.href = `/login?next=${encodeURIComponent(current)}`
      }
    }

    // Opcional: puedes manejar 403, 429 o 5xx si quieres dar mensajes globales

    return Promise.reject(err)
  }
)

export default api
