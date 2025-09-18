import axios from 'axios';

/* ========= Detección de entorno ========= */
const isProd = import.meta.env.MODE === 'production';

/* ========= Normalización de baseURL =========
   - En prod: si VITE_API_URL existe (p. ej. https://api.ssselvasagrada.com), lo usamos y le añadimos /api.
   - En dev: usamos /api para que el proxy de Vite lo redirija al backend.
   - Evitamos dobles /api y barras repetidas.
*/
function buildBaseURL() {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (isProd && envUrl) {
    // Garantiza que termina en /api
    return `${envUrl}/api`;
  }
  // Dev o prod sin VITE_API_URL: relativo, asumiendo proxy o mismo origin
  return '/api';
}

const baseURL = buildBaseURL();

/* ========= Instancia ========= */
export const api = axios.create({
  baseURL,
  withCredentials: true, // cookies httpOnly via CORS
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Algunos setups de CSRF/seguridad esperan esto para XHR
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000,
});

/* ========= Interceptor de request =========
   - Si algún día usas Bearer (localStorage/sessionStorage), se inyecta aquí.
   - No logueamos payloads sensibles, gracias.
*/
api.interceptors.request.use((config) => {
  // Optativo: Authorization Bearer si lo usas en paralelo a cookies
  const bearer =
    typeof window !== 'undefined'
      ? window.localStorage?.getItem('access_token') || window.sessionStorage?.getItem('access_token')
      : null;

  if (bearer && !config.headers?.Authorization) {
    config.headers = { ...config.headers, Authorization: `Bearer ${bearer}` };
  }

  // Defensa contra dobles /api en llamadas mal formadas
  // Ej: api.get('/auth/me') => OK; api.get('auth/me') => también OK
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
    const method = err?.config?.method?.toUpperCase?.();
    const url = err?.config?.url;

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
      });
    }

    // 401: no autenticado o sesión expirada
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

    // Puedes añadir aquí manejo global para 403/429/5xx si te apetece sufrir más.

    return Promise.reject(err);
  }
);

export default api;
