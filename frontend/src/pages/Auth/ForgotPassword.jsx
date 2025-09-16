import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/mi-cuenta'

  const onSubmit = async ({ email }) => {
    setOk(''); setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setOk('Si el email existe, enviaremos instrucciones para restablecer tu contraseña.')
      reset({ email: '' })
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo procesar la solicitud'
      setError(msg)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">Recuperar contraseña</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Tu email"
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {ok && <p className="text-green-600">{ok}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando…' : 'Enviar instrucciones'}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600 text-center">
        ¿Ya la recordaste?{' '}
        <Link
          to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="text-emerald-700 font-medium hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
