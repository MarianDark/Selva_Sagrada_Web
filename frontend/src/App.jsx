import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Home from './pages/Home'
import ReservaCita from './pages/ReservaCita'
import Nosotros from './pages/Nosotros'
import LegalPrivacidad from './pages/Legal/Privacidad'
import LegalAviso from './pages/Legal/AvisoLegal'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'

import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'

import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/reservas" element={<ReservaCita />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/legal/privacidad" element={<LegalPrivacidad />} />
          <Route path="/legal/aviso-legal" element={<LegalAviso />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<DashboardLayout />}>
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
