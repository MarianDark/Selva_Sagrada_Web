// frontend/src/components/LogoutButton.jsx
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
    >
      {loading ? 'Cerrando…' : 'Cerrar sesión'}
    </button>
  )
}
