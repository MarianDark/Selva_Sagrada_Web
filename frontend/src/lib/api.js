// frontend/src/lib/api.js
import axios from "axios";

/* ========= Detección de entorno ========= */
const isProd = import.meta.env.MODE === "production";

/* ========= Resolver ORIGEN del API (sin /api) =========
   Producción: usa VITE_API_URL si existe (p. ej. https://api.ssselvasagrada.com)
               si no existe, cae en https://api.ssselvasagrada.com
   Dev:        usa VITE_API_URL si existe, si no http://localhost:3000
*/
function computeApiOrigin() {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
  if (envUrl) return envUrl;
  return isProd ? "https://api.ssselvasagrada.com" : "http://localhost:3000";
}

const API_ORIGIN = computeApiOrigin();

/* ========= Instancia =========
   OJO: las rutas que llames deben empezar por "/api/..."
   Ej: api.get("/api/auth/me")
*/
export const api = axios.create({
  baseURL: API_ORIGIN,
  withCredentials: true,
  timeout: 15000
});

/* ========= Interceptor de request ========= */
api.interceptors.request.use((config) => {
  // Añade Bearer opcional si lo guardas en storage
  const bearer =
    typeof window !== "undefined"
      ? window.localStorage?.getItem("access_token") ||
        window.sessionStorage?.getItem("access_token")
      : null;

  if (bearer && !config.headers?.Authorization) {
    config.headers = { ...config.headers, Authorization: `Bearer ${bearer}` };
  }

  // Asegura Content-Type JSON solo cuando hay body
  const hasBody = !!config.data;
  if (hasBody && !config.headers?.["Content-Type"]) {
    config.headers = { ...config.headers, "Content-Type": "application/json" };
  }

  // X-Requested-With para facilitar detección de AJAX en backend
  if (!config.headers?.["X-Requested-With"]) {
    config.headers = { ...config.headers, "X-Requested-With": "XMLHttpRequest" };
  }

  // Normaliza urls tipo "//api/auth" -> "/api/auth"
  if (typeof config.url === "string" && config.url.startsWith("//")) {
    config.url = config.url.replace(/^\/+/, "/");
  }

  return config;
});

/* ========= Interceptor de respuestas / errores ========= */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (import.meta.env.DEV) {
      const method = err?.config?.method?.toUpperCase?.();
      const url = err?.config?.url;
      // Evitar volcar credenciales en consola
      const safeData =
        (err?.response?.data &&
          (typeof err.response.data === "object"
            ? { ...err.response.data, password: undefined, token: undefined }
            : err.response.data)) || "(sin body)";

      // eslint-disable-next-line no-console
      console.error("API error:", {
        method,
        url,
        status: status ?? "(sin status)",
        data: safeData
      });
    }

    // Sin redirecciones automáticas en 401: que lo gestione tu guard/ProtectedRoute
    return Promise.reject(err);
  }
);

export default api;
