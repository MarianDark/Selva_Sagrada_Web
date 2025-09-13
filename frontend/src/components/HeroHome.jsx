import { Link } from 'react-router-dom'

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo con imagen y degradado */}
      <div
        className="absolute inset-0 bg-[url('/selva-bg.jpg')] bg-cover bg-center opacity-40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white/70 to-white" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 leading-tight">
            Sanación y bienestar en armonía con la naturaleza
          </h1>
          <p className="mt-4 text-lg text-zinc-700">
            Terapias holísticas y sesiones personalizadas para reconectar contigo. Reserva de forma fácil y rápida.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/reservas"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
            >
              Reservar ahora
            </Link>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            >
              Explorar terapias
            </a>
          </div>

          {/* Confianza / badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-2">
              ✅ Atención personalizada
            </span>
            <span className="inline-flex items-center gap-2">
              ✅ Reserva online fácil
            </span>
            <span className="inline-flex items-center gap-2">
              ✅ Enfoque integral
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
