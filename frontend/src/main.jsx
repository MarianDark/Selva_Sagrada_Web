import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'


if (import.meta.env.MODE !== 'production') {
window.addEventListener('unhandledrejection', (e) => {
console.error('[UNHANDLED REJECTION]', e.reason)
})
window.addEventListener('error', (e) => {
console.error('[GLOBAL ERROR]', e.message, e.error)
})
}


ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<App />
</BrowserRouter>
</React.StrictMode>
)