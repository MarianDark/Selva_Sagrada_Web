import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [booking, setBooking] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        setState({ loading: true, error: '' })
        const [meRes, resBooking] = await Promise.all([
          api.get('/auth/me', { signal: controller.signal }),
          api.get('/booking/me', { signal: controller.signal }),
        ])
        setUser(meRes.data || null)
        setBooking(Array.isArray(resBooking.data) ? resBooking.data : [])
        setState({ loading: false, error: '' })
      } catch (e) {
        if (controller.signal.aborted) return
        console.error('Error cargando dashboard', e)
        const msg = e?.response?.data?.message || 'No se pudo cargar tu panel'
        setState({ loading: false, error: msg })
      }
    })()

    return () => controller.abort()
  }, [])

  if (state.loading) return <p className="p-6">Cargando tu panel...</p>

  if (state.error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{state.error}</p>
        <Link to="/login" className="text-emerald-700 underline">Inicia sesión</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Mi cuenta</h1>

      {/* Info de usuario */}
      {user && (
        <section className="bg-zinc-50 border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-2">Mis datos</h2>
          <p><b>Nombre:</b> {user.name || '—'}</p>
          <p><b>Email:</b> {user.email || '—'}</p>
        </section>
      )}

      {/* Reservas */}
      <section>
        <h2 className="text-xl font-medium mb-3">Mis reservas</h2>
        {booking.length === 0 ? (
          <p className="text-sm text-zinc-500">Aún no tienes reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 border text-left">Servicio</th>
                  <th className="px-3 py-2 border text-left">Inicio</th>
                  <th className="px-3 py-2 border text-left">Fin</th>
                  <th className="px-3 py-2 border text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {booking.map((b) => (
                  <tr key={b._id || `${b.start}-${b.service}`} className="border-t">
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
    </div>
  )
}
