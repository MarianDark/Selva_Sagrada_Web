import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ReservaCita from './pages/ReservaCita'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import VerifyEmail from './pages/Auth/VerifyEmail'
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'


export default function RoutesView() {
return (
<Routes>
<Route path="/" element={<Home />} />
<Route path="/reservas" element={<ReservaCita />} />


{/* Auth */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/verify-email" element={<VerifyEmail />} />


{/* Paneles */}
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


{/* 404 simple */}
<Route path="*" element={<div className="max-w-3xl mx-auto p-10">Página no encontrada.</div>} />
</Routes>
)
}