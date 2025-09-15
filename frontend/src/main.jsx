import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Handlers globales de errores (solo en desarrollo)
if (import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (e) => {
    console.groupCollapsed('[UNHANDLED REJECTION]')
    console.error(e?.reason || e)
    console.groupEnd()
  })
  window.addEventListener('error', (e) => {
    console.groupCollapsed('[GLOBAL ERROR]')
    console.error(e?.message, e?.error || e)
    console.groupEnd()
  })
}

// Asegura que exista el contenedor root
let rootEl = document.getElementById('root')
if (!rootEl) {
  rootEl = document.createElement('div')
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
}

// Inicializa React
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// 🚀 Registro del Service Worker (solo en producción)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh() {
          if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
            updateSW(true)
          }
        },
        onOfflineReady() {
          console.log('✅ App lista para usarse offline 🚀')
        }
      })
    })
    .catch((err) => {
      console.warn('[PWA] No se pudo registrar el Service Worker:', err)
    })
}
