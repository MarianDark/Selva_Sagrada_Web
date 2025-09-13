import axios from 'axios'

const isProd = import.meta.env.MODE === 'production'
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

const baseURL = isProd && provided ? `${provided}/api` : '/api' // 👈 dev -> proxy

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    console.error('API error:', {
      method: err.config?.method,
      url: err.config?.url,
      status,
      data: err.response?.data,
    })
    if (status === 401) {
      const current = window.location.pathname
      if (!current.startsWith('/login')) {
        window.location.href = `/login?next=${encodeURIComponent(current)}`
      }
    }
    return Promise.reject(err)
  }
)

export { api }
export default api
