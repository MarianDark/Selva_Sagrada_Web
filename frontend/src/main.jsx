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

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
