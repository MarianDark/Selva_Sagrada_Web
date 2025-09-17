// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  // Carga variables de entorno (no solo VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  // Backend para el proxy en dev
  const target = env.VITE_PROXY_TARGET || 'http://localhost:4000'
  const isHttps = /^https:/i.test(target)

  const plugins = [react()]

  // PWA solo en producción (en dev no queremos SW cacheando nada)
  if (mode === 'production') {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'logo-192.png',
          'logo-512.png',
        ],
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
            { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-stylesheets' },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'script' || request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      hmr: { overlay: false },
      proxy: {
        '/api': {
          target,                  // p.ej. http://localhost:4000 o el remoto
          changeOrigin: true,
          secure: isHttps,         // true si el target https tiene cert válido
          cookieDomainRewrite: 'localhost', // que la cookie no se pierda en dev
        },
      },
    },
    // Con Tailwind v4 no necesitas postcss aquí; ya estás usando @import "tailwindcss" en index.css
  }
})
