import { useEffect, useState } from 'react'
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBookings, resContacts] = await Promise.all([
          api.get('/bookings'),
          api.get('/contact'), // este endpoint debe crearse para listar mensajes si no existe
        ])
        setBookings(resBookings.data)
        setContacts(resContacts.data)
      } catch (e) {
        console.error('Error cargando datos admin', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p className="p-6">Cargando panel...</p>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>

      {/* Reservas */}
      <section>
        <h2 className="text-xl font-medium mb-3">Reservas</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay reservas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 border">Cliente</th>
                  <th className="px-3 py-2 border">Servicio</th>
                  <th className="px-3 py-2 border">Inicio</th>
                  <th className="px-3 py-2 border">Fin</th>
                  <th className="px-3 py-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-3 py-2">{b.name} ({b.email})</td>
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
                  <th className="px-3 py-2 border">Nombre</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Mensaje</th>
                  <th className="px-3 py-2 border">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">{c.email}</td>
                    <td className="px-3 py-2 max-w-xs truncate">{c.message}</td>
                    <td className="px-3 py-2">
                      {new Date(c.createdAt).toLocaleString()}
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
