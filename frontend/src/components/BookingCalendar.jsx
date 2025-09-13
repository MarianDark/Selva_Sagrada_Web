// src/components/BookingCalendar.jsx
import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { useNavigate } from 'react-router-dom'

import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Captcha from '@/components/Captcha'

export default function BookingCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const captchaRef = useRef()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const from = new Date()
    const to = new Date()
    to.setMonth(to.getMonth() + 2)

    api
      .get('/availability', { params: { from, to } })
      .then(({ data }) => {
        const ev = data.flatMap((d) =>
          d.slots.map((s) => ({
            start: s.start,
            end: s.end,
            display: 'background', // zonas reservables
          }))
        )
        setEvents(ev)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (info) => {
    // Si el estado de auth aún carga, no hacemos nada
    if (authLoading) return

    // Requiere sesión: si no hay user, enviamos a login
    if (!user) {
      navigate(`/login?next=${encodeURIComponent('/reservas')}`, { replace: true })
      return
    }

    // Solo pedimos nombre y apellido (email sale del contexto)
    const fullName = prompt('Nombre y apellido para la reserva:')
    if (!fullName || !fullName.trim()) return

    try {
      const captchaToken = await captchaRef.current?.execute('book')

      const { data } = await api.post('/booking', {
        name: fullName.trim(),
        email: user.email,               // 👈 se toma del usuario logueado
        userId: user._id ?? undefined,   // (opcional, por si tu backend lo usa)
        service: 'Sesión Holística',
        start: info.startStr,
        end: info.endStr,
        captchaToken,
      })

      alert('Reserva confirmada: ' + new Date(data.start).toLocaleString('es-ES'))
    } catch (e) {
      alert(e?.response?.data?.message || 'No se pudo reservar')
    }
  }

  return (
    <div className="card p-4">
      <Captcha ref={captchaRef} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth',
        }}
        buttonText={{ today: 'hoy', month: 'mes', week: 'semana', day: 'día' }}
        selectable
        selectMirror
        selectOverlap={false}
        select={handleSelect}
        events={events}
        loading={(isLoading) => setLoading(isLoading)}
        nowIndicator
        expandRows
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        height="auto"
        weekNumbers
        stickyHeaderDates
        dayMaxEventRows
      />

      {loading && (
        <p className="text-sm text-zinc-500 mt-2">Cargando disponibilidad…</p>
      )}
      <p className="text-xs text-zinc-500 mt-2">
        {user
          ? `Reservarás con el email: ${user.email}`
          : 'Inicia sesión para confirmar tu reserva.'}
      </p>
      <p className="text-xs text-zinc-500">Selecciona un bloque resaltado para reservar.</p>
    </div>
  )
}
