// src/lib/api.ts (o .js)
import axios from "axios";

const provided = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
// Dev sin VITE_API_BASE_URL → usa proxy de Vite en /api
const baseURL = provided ? `${provided}/api` : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
