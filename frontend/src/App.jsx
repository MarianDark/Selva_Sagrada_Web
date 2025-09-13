// src/App.jsx
import Header from './components/Header'
import Footer from './components/Footer'
import RoutesView from './routes'
import { AuthProvider } from './context/AuthContext' // Proveedor global de autenticación

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[image:var(--bg-grad)] text-zinc-800">
        {/* Header global */}
        <Header />

        {/* Contenido principal */}
        <main id="main-content" className="flex-1">
          <RoutesView />
        </main>

        {/* Footer global */}
        <Footer />
      </div>
    </AuthProvider>
  )
}
