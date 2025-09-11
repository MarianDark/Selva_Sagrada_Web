import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function ProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    // Minimal: comprobar si cookie/JWT válido y rol (si se requiere)
    api.get('/health')
      .then(() => setAllowed(true)) // en tu app real consulta /me
      .catch(() => setAllowed(false))
  }, [])

  if (allowed === null) return <div className="p-6">Cargando...</div>
  if (!allowed) { window.location.href = '/login'; return null }
  // Si deseas validar role, consulta a la API por el usuario y compara.
  return children
}
