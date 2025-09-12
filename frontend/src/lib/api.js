// src/lib/api.js
import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
if (isProd && !provided) throw new Error("❌ VITE_API_URL es obligatoria en producción");

const baseURL = provided ? `${provided}/api` : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // ⬅️ cookies JWT
  headers: { "Content-Type": "application/json" },
});

// Interceptores de respuesta
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // Log de error detallado
    console.error("API error:", {
      method: err.config?.method,
      url: err.config?.url,
      status,
      data: err.response?.data,
    });

    // Manejo centralizado de 401 → redirigir a login
    if (status === 401) {
      const current = window.location.pathname;
      if (!current.startsWith("/login")) {
        window.location.href = `/login?next=${encodeURIComponent(current)}`;
      }
    }

    return Promise.reject(err);
  }
);

export { api };
export default api;
