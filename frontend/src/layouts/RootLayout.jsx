import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AddToHomeBanner from '@/components/AddToHomeBanner'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[image:var(--bg-grad)] text-zinc-800">
        {/* Header global */}
        <Header />

        {/* Contenido dinámico de las rutas */}
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>

        {/* Footer global */}
        <Footer />

        {/* Banner “Añadir a pantalla de inicio” (PWA) */}
        <AddToHomeBanner />
      </div>
    </ErrorBoundary>
  )
}
