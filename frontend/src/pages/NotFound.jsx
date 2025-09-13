import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 bg-[url('/selva-bg.jpg')] bg-cover bg-center opacity-20"
        aria-hidden="true"
      />

      {/* Silueta meditativa */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-30">
        <img
          src="/meditation-silhouette.png"
          alt="Meditación"
          className="w-64 h-auto"
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-xl px-6">
        <h1 className="text-7xl font-extrabold text-emerald-700 drop-shadow mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-800 mb-3">
          Página no encontrada
        </h2>
        <p className="text-zinc-600 mb-8">
          La página que buscas se perdió entre la selva mística 🌱.  
          Regresa al inicio para continuar tu viaje espiritual.
        </p>

        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
