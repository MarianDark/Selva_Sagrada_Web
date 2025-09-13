import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      // Cualquier llamada a /api irá al backend de Render
      '/api': {
        target: 'https://selva-sagrada-web.onrender.com',
        changeOrigin: true,
        secure: true,
        // Muy importante para que el navegador acepte la cookie como si viniera de localhost
        cookieDomainRewrite: 'localhost',
        // Si tu backend sirve api bajo /api, no reescribas path. Si fuera raíz, usarías: rewrite: (p) => p.replace(/^\/api/, '')
      },
    },
  },
})
