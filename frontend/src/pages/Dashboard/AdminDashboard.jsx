import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const [booking, setBooking] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const [resBooking, resContacts] = await Promise.all([
          api.get('/booking', { signal: controller.signal }),
          api.get('/contact', { signal: controller.signal }),
        ])
        setBooking(Array.isArray(resBooking.data) ? resBooking.data : [])
        setContacts(Array.isArray(resContacts.data) ? resContacts.data : [])
      } catch (e) {
        if (controller.signal.aborted) return
        console.error('Error cargando datos admin', e)
        setError(e?.response?.data?.message || 'No se pudo cargar el panel')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [])

  if (loading) return <p className="p-6">Cargando panel...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>

      {/* Reservas */}
      <section>
        <h2 className="text-xl font-medium mb-3">Reservas</h2>
        {booking.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay reservas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 border text-left">Cliente</th>
                  <th className="px-3 py-2 border text-left">Servicio</th>
                  <th className="px-3 py-2 border text-left">Inicio</th>
                  <th className="px-3 py-2 border text-left">Fin</th>
                  <th className="px-3 py-2 border text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {booking.map((b) => (
                  <tr key={b._id || `${b.start}-${b.email}`} className="border-t">
                    <td className="px-3 py-2">
                      {b.name || '—'} {b.email ? <span className="text-zinc-500">({b.email})</span> : null}
                    </td>
                    <td className="px-3 py-2">{b.service || '—'}</td>
                    <td className="px-3 py-2">
                      {b.start
                        ? new Date(b.start).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'Europe/Madrid',
                          })
                        : '—'}
                    </td>
                    <td className="px-3 py-2">
                      {b.end
                        ? new Date(b.end).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'Europe/Madrid',
                          })
                        : '—'}
                    </td>
                    <td className="px-3 py-2 capitalize">{b.status || 'pendiente'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Mensajes de contacto */}
      <section>
        <h2 className="text-xl font-medium mb-3">Mensajes de contacto</h2>
        {contacts.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay mensajes aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 border text-left">Nombre</th>
                  <th className="px-3 py-2 border text-left">Email</th>
                  <th className="px-3 py-2 border text-left">Mensaje</th>
                  <th className="px-3 py-2 border text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id || `${c.email}-${c.createdAt}`} className="border-t">
                    <td className="px-3 py-2">{c.name || '—'}</td>
                    <td className="px-3 py-2">{c.email || '—'}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={c.message}>
                      {c.message || '—'}
                    </td>
                    <td className="px-3 py-2">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            timeZone: 'Europe/Madrid',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
