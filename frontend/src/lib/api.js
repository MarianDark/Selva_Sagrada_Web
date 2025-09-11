// src/lib/api.js
import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const provided = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

if (isProd && !provided) {
  throw new Error("VITE_API_BASE_URL es obligatoria en producción");
}

const baseURL = provided ? `${provided}/api` : "/api"; // dev con proxy usa '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
