// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // lee .env* sin prefijo VITE_ obligatorio
  // Puedes usar:
  // - VITE_PROXY_TARGET=http://localhost:3000  (dev local por defecto)
  // - VITE_PROXY_TARGET=https://selva-sagrada-web.onrender.com  (proxy a Render)
  const target = env.VITE_PROXY_TARGET || 'http://localhost:3000'
  const isHttps = /^https:/i.test(target)

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo-192.png', 'logo-512.png'],
        manifest: {
          name: 'Selva Sagrada',
          short_name: 'SelvaSagrada',
          description:
            'Selva Sagrada - Terapias holísticas, bienestar y retiros. Reserva tu sesión de forma fácil y rápida.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#3a6f45',
          icons: [
            { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              urlPattern: /^https:\/\/cdn.jsdelivr.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            },
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }
              }
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'script' || request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },
    server: {
      hmr: { overlay: false }, // oculta overlay de errores en dev
      proxy: {
        '/api': {
          target,                    // ← http://localhost:3000 o https://selva-sagrada-web.onrender.com
          changeOrigin: true,
          secure: isHttps,           // si es https en Render: true, si es http local: false
          // Mantiene cookies con dominio localhost al desarrollar.
          // En prod no se usa el proxy de Vite, así que no afecta.
          cookieDomainRewrite: 'localhost'
        }
      }
    }
  }
})
