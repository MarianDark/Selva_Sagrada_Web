import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Info del usuario (se devuelve en login o puedes hacer un endpoint /me)
        const meRes = await api.get('/api/auth/me').catch(() => null)
        if (meRes) setUser(meRes.data)

        // 2) Mis reservas
        const resBookings = await api.get('/api/bookings/me')
        setBookings(resBookings.data)
      } catch (e) {
        console.error('Error cargando dashboard', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p className="p-6">Cargando tu panel...</p>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Mi Panel</h1>

      {/* Info de usuario */}
      {user && (
        <section className="bg-zinc-50 border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-2">Mis datos</h2>
          <p><b>Nombre:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </section>
      )}

      {/* Reservas */}
      <section>
        <h2 className="text-xl font-medium mb-3">Mis reservas</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-zinc-500">Aún no tienes reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 border">Servicio</th>
                  <th className="px-3 py-2 border">Inicio</th>
                  <th className="px-3 py-2 border">Fin</th>
                  <th className="px-3 py-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-3 py-2">{b.service}</td>
                    <td className="px-3 py-2">
                      {new Date(b.start).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(b.end).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 capitalize">{b.status}</td>
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
