import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
        <span className="ml-3 text-emerald-700 font-medium">Cargando...</span>
      </div>
    )
  }

  if (!user) {
    // 🚫 No hay sesión -> redirige a login con ?next=<ruta actual>
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (role && user.role !== role) {
    // 🚫 Usuario con sesión pero rol insuficiente
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
        <p className="text-zinc-600">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    )
  }

  // ✅ Usuario permitido
  return children
}
