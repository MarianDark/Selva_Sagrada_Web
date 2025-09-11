import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

export default function VerifyEmail() {
  const [msg, setMsg] = useState('Verificando...')
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const navigate = useNavigate()

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) {
      setMsg('Token ausente.')
      setStatus('error')
      return
    }
    api.post('/auth/verify-email', { token })
      .then(() => {
        setMsg('¡Email verificado! Redirigiendo al login...')
        setStatus('success')
        setTimeout(() => {
          navigate('/login?verified=1')
        }, 2000) // 2 segundos antes de redirigir
      })
      .catch(() => {
        setMsg('Token inválido o expirado.')
        setStatus('error')
      })
  }, [navigate])

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Verificación de email</h1>
      <p className={status === 'error' ? 'text-red-600' : 'text-green-600'}>
        {msg}
      </p>
    </div>
  )
}
