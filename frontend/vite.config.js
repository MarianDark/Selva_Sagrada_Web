import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      '/api': {
        target: 'https://selva-sagrada-web.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost', // 👈 clave para que la cookie se guarde en dev
      },
    },
  },
})
