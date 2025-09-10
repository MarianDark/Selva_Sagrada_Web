import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VerifyEmail from './pages/Auth/VerifyEmail'
import ReservaCita from './pages/Reservas/ReservaCita'
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './pages/Auth/ResetPassword'
import ForgotPassword from './pages/Auth/ForgotPassword'
import AvisoLegal from './pages/Legal/AvisoLegal'
import CookiesPage from './pages/Legal/Cookies'
import Privacidad from './pages/Legal/Privacidad'

export default function RoutesView() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reservas" element={<ReservaCita />} />
      <Route path="/mi-cuenta" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/aviso-legal" element={<AvisoLegal />} />
      <Route path="/politica-cookies" element={<CookiesPage />} />
      <Route path="/politica-privacidad" element={<Privacidad />} />
    </Routes>
  )
}
