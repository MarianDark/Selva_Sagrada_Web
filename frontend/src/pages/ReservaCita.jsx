// src/pages/ReservaCita.jsx
import BookingCalendar from '../components/BookingCalendar'

export default function ReservaCita() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Encabezado de la página */}
      <header className="text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jungle-900">
          Reserva tu sesión
        </h1>
        <p className="text-zinc-700 mt-3">
          Elige el horario que mejor se adapte a ti y asegura tu lugar en Selva Sagrada.
        </p>
      </header>

      {/* Calendario elegante */}
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white/90 backdrop-blur">
        <BookingCalendar />
      </div>
    </section>
  )
}
