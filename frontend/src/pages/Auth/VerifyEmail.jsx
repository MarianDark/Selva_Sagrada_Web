import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [msg, setMsg] = useState('Verificando…')

  useEffect(() => {
    const token = searchParams.get('token')
    const next = searchParams.get('next') || '/mi-cuenta'

    if (!token) {
      setStatus('error')
      setMsg('Token ausente en la URL.')
      return
    }

    api
      .post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success')
        setMsg('¡Email verificado! Redirigiendo al inicio de sesión…')
        setTimeout(() => {
          navigate(`/login?verified=1${next ? `&next=${encodeURIComponent(next)}` : ''}`, { replace: true })
        }, 1500)
      })
      .catch((e) => {
        const serverMsg = e?.response?.data?.message
        setStatus('error')
        setMsg(serverMsg || 'Token inválido o expirado.')
      })
  }, [navigate, searchParams])

  return (
    <div className="max-w-md mx-auto p-6 text-center bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-emerald-700 mb-3">Verificación de email</h1>

      {status === 'loading' && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      )}

      <p className={status === 'error' ? 'text-red-600' : 'text-green-700'}>{msg}</p>

      {status === 'error' && (
        <div className="mt-4 space-x-4">
          <Link to="/login" className="text-emerald-700 font-medium hover:underline">
            Ir a iniciar sesión
          </Link>
          <Link to="/register" className="text-emerald-700 font-medium hover:underline">
            Crear cuenta
          </Link>
        </div>
      )}
    </div>
  )
}
