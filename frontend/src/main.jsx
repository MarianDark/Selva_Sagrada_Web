import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 👉 Registro del Service Worker de PWA
// import { registerSW } from 'virtual:pwa-register'
if (import.meta.env.PROD) {
  const { registerSW } = await import('virtual:pwa-register')
  registerSW()
}

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

// 🚀 Inicializa el Service Worker (PWA)
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
