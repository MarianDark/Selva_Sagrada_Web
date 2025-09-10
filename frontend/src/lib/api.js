// src/lib/api.ts (o .js)
import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const provided = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, ""); // sin barra final

// Si NO hay VITE_API_BASE_URL y estamos en dev → usamos el proxy de Vite: '/api'
const usingProxy = !isProd && !provided;

// Base URL:
// - Dev con proxy:    '/api'
// - Con URL explícita: '<URL>/api'
// - Fallback dev:      'http://localhost:4000/api'
const baseURL = usingProxy
  ? "/api"
  : `${provided ?? "http://localhost:4000"}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true, // imprescindible para cookies
  headers: { "Content-Type": "application/json" },
});

// Opcional: interceptores útiles
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Si te expulsan por 401, puedes redirigir al login
    if (err?.response?.status === 401 && window.location.pathname !== "/login") {
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
