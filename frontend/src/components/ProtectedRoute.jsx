import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
        <span className="ml-3 text-emerald-700 font-medium">Cargando...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/mi-cuenta" replace />
  }

  return children
}
