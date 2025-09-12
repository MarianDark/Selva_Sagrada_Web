import BookingCalendar from '../components/BookingCalendar'
export default function ReservaCita(){
return (
<div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
<header className="text-center">
<h1 className="font-display text-3xl md:text-4xl font-bold text-jungle-900">Reserva tu sesión</h1>
<p className="text-zinc-700 mt-2">Elige el horario que mejor se adapte a ti.</p>
</header>
<BookingCalendar />
</div>
)
}