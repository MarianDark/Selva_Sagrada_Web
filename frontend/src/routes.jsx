import { Routes, Route } from 'react-router-dom'

// Páginas principales
import Home from './pages/Home'
import ReservaCita from './pages/ReservaCita'

// Autenticación
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'

// Dashboards
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'

// Componentes de protección
import ProtectedRoute from './components/ProtectedRoute'

export default function RoutesView() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/reservas" element={<ReservaCita />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Paneles protegidos */}
      <Route
        path="/mi-cuenta"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="max-w-3xl mx-auto p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">404</h1>
            <p className="text-zinc-600">Página no encontrada.</p>
          </div>
        }
      />
    </Routes>
  )
}