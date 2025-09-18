// frontend/src/lib/api.js
import axios from 'axios'

/* ========= Detección de entorno ========= */
const isProd = import.meta.env.MODE === 'production'

/* ========= Normalización de baseURL ========= */
function buildBaseURL() {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
  if (isProd && envUrl) return `${envUrl}/api`
  return '/api'
}
const baseURL = buildBaseURL()

/* ========= Instancia ========= */
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

/* ========= Interceptor de request ========= */
api.interceptors.request.use((config) => {
  const bearer =
    typeof window !== 'undefined'
      ? window.localStorage?.getItem('access_token') ||
        window.sessionStorage?.getItem('access_token')
      : null

  if (bearer && !config.headers?.Authorization) {
    config.headers = { ...config.headers, Authorization: `Bearer ${bearer}` }
  }

  if (config.url && config.url.startsWith('//')) {
    config.url = config.url.replace(/^\/+/, '/')
  }

  return config
})

/* ========= Interceptor de respuestas / errores ========= */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status

    if (import.meta.env.DEV) {
      const method = err?.config?.method?.toUpperCase?.()
      const url = err?.config?.url
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

    // ❌ Nada de redirecciones globales en 401.
    // El flujo de acceso se controla en <ProtectedRoute />.
    // Si quieres redirigir en algún caso concreto, hazlo desde ese componente.

    return Promise.reject(err)
  }
)

export default api
