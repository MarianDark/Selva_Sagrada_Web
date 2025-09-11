// src/lib/api.js
import axios from "axios";

// Detectar modo de ejecución (vite injecta import.meta.env.MODE)
const isProd = import.meta.env.MODE === "production";

// Leer VITE_API_URL desde tu .env
const provided = import.meta.env.VITE_API_URL?.replace(/\/+$/, ""); // quita barras extra

// Si estás en producción y no diste API URL → error al arrancar
if (isProd && !provided) {
  throw new Error("❌ VITE_API_URL es obligatoria en producción");
}

// Base URL para axios
// - En producción: VITE_API_URL + /api
// - En desarrollo: proxy a /api (vite.config.js puede reenviar al backend)
const baseURL = provided ? `${provided}/api` : "/api";

// Crear la instancia de axios
const api = axios.create({
  baseURL,
  withCredentials: true, // importante para enviar/recibir la cookie "token"
  headers: {
    "Content-Type": "application/json",
  },
});

// Exportar (tienes dos formas de importar según prefieras)
export { api }; // import { api } from '@/lib/api'
export default api; // import api from '@/lib/api'
