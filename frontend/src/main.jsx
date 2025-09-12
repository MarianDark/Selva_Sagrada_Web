import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Handlers globales de errores (solo en desarrollo)
if (import.meta.env.MODE !== 'production') {
  window.addEventListener('unhandledrejection', (e) => {
    // Si alguien hace Promise.reject(null) o throw null, aquí lo verás
    console.error('[UNHANDLED REJECTION]', e.reason);
  });
  window.addEventListener('error', (e) => {
    console.error('[GLOBAL ERROR]', e.message, e.error);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
