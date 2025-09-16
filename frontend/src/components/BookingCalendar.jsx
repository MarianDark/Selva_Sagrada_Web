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
  const [slots, setSlots] = useState([]) // ← guardamos slots enriquecidos (full/remaining)
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
        // data[].slots[] viene con { start, end, capacity, remaining, full }
        const ev = []
        const collectedSlots = []

        data.forEach(d => {
          (d.slots || []).forEach(s => {
            // Evento de fondo por slot
            ev.push({
              start: s.start,
              end: s.end,
              display: 'background',
              // Colores directos para no depender de clases Tailwind dentro del DOM de FullCalendar
              backgroundColor: s.full ? 'rgba(239,68,68,0.20)' : 'rgba(16,185,129,0.18)', // red-500 vs emerald-500
              borderColor: s.full ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)',
            })

            collectedSlots.push({
              start: new Date(s.start),
              end: new Date(s.end),
              full: !!s.full,
              remaining: Number(s.remaining ?? 0),
              capacity: Number(s.capacity ?? 1),
            })
          })
        })

        setEvents(ev)
        setSlots(collectedSlots)
      })
      .finally(() => setLoading(false))
  }, [])

  // Restringe selección a slots libres
  const selectAllow = (selectInfo) => {
    const { start, end } = selectInfo
    const chosen = slots.find(sl => sl.start <= start && sl.end >= end)
    return !!(chosen && !chosen.full)
  }

  const handleSelect = async (info) => {
    if (authLoading) return

    // Requiere sesión
    if (!user) {
      navigate(`/login?next=${encodeURIComponent('/reservas')}`, { replace: true })
      return
    }

    // Verifica que el rango seleccionado está dentro de un slot libre
    const chosen = slots.find(sl => sl.start <= info.start && sl.end >= info.end)
    if (!chosen) {
      alert('Selecciona dentro de un bloque disponible.')
      return
    }
    if (chosen.full) {
      alert('Ese horario está completo.')
      return
    }

    const fullName = prompt('Nombre y apellido para la reserva:')
    if (!fullName || !fullName.trim()) return

    try {
      const captchaToken = await captchaRef.current?.execute('book')

      const payload = {
        name: fullName.trim(),
        service: 'Sesión Holística',
        start: info.startStr,
        end: info.endStr,
        captchaToken,
      }

      const { data } = await api.post('/booking', payload)

      // Confirmación local
      const when = new Date(data.start).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
      alert('Reserva confirmada: ' + when)
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
        timeZone="Europe/Madrid"
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
        selectAllow={selectAllow}
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

      {loading && <p className="text-sm text-zinc-500 mt-2">Cargando disponibilidad…</p>}

      <p className="text-xs text-zinc-500 mt-2">
        {user ? `Reservarás con el email: ${user.email}` : 'Inicia sesión para confirmar tu reserva.'}
      </p>
      <p className="text-xs text-zinc-500">Selecciona un bloque resaltado para reservar.</p>
    </div>
  )
}
