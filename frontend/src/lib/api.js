// src/lib/api.js
import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
if (isProd && !provided) throw new Error("❌ VITE_API_URL es obligatoria en producción");

const baseURL = provided ? `${provided}/api` : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Log + normalizar error (evita 'Uncaught (in promise) null')
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", {
      method: err.config?.method,
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export { api };
export default api;
