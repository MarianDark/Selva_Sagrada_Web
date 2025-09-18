// frontend/src/lib/api.js
import axios from 'axios';

/* ========= Detección de entorno ========= */
const isProd = import.meta.env.MODE === 'production';

/* ========= Normalización de baseURL ========= */
function buildBaseURL() {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (isProd && envUrl) return `${envUrl}/api`;
  return '/api';
}
const baseURL = buildBaseURL();

/* ========= Instancia ========= */
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Quitamos X-Requested-With para no detonar CORS
  },
  timeout: 15000,
});

/* ========= Interceptor de request ========= */
api.interceptors.request.use((config) => {
  const bearer =
    typeof window !== 'undefined'
      ? window.localStorage?.getItem('access_token') || window.sessionStorage?.getItem('access_token')
      : null;

  if (bearer && !config.headers?.Authorization) {
    config.headers = { ...config.headers, Authorization: `Bearer ${bearer}` };
  }

  if (config.url && config.url.startsWith('//')) {
    config.url = config.url.replace(/^\/+/, '/');
  }

  return config;
});

/* ========= Interceptor de respuestas / errores ========= */
let redirecting = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (import.meta.env.DEV) {
      const method = err?.config?.method?.toUpperCase?.();
      const url = err?.config?.url;
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
      });
    }

    if (status === 401) {
      const { pathname, search } = window.location;
      const current = `${pathname}${search}`;
      const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) =>
        pathname.startsWith(p)
      );

      if (!isAuthPage && !redirecting) {
        redirecting = true;
        window.location.href = `/login?next=${encodeURIComponent(current)}`;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
