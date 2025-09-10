import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/api'
import { useState } from 'react'

const schema = z.object({
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Incluye mayúscula')
    .regex(/[a-z]/, 'Incluye minúscula')
    .regex(/[0-9]/, 'Incluye número')
    .regex(/[^A-Za-z0-9]/, 'Incluye símbolo'),
})

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setOk('')
      setError('')
      await api.post('/api/auth/reset-password', {
        ...data,
        token,
      })
      setOk('Contraseña actualizada. Ahora puedes iniciar sesión.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al actualizar contraseña')
    }
  }

  if (!token) {
    return <p className="p-6 text-red-600">Falta el token de recuperación en la URL.</p>
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Restablecer contraseña</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="password"
            {...register('password')}
            placeholder="Nueva contraseña"
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Cambiar contraseña
        </button>
      </form>
      {ok && <p className="mt-3 text-green-600">{ok}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  )
}
