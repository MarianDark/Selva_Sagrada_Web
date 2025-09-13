// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  if (!user) {
    // 🚫 No hay sesión -> redirige a login
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`
    return null
  }

  if (role && user.role !== role) {
    // 🚫 Tiene sesión, pero rol insuficiente
    return <div className="p-6 text-red-600">Acceso denegado.</div>
  }

  // ✅ Usuario permitido
  return children
}
