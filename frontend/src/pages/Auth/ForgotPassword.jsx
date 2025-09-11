import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { api } from '../../lib/api'
import Captcha from '../../components/Captcha'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const captchaRef = useRef()

  const onSubmit = async ({ email }) => {
    try {
      setOk('')
      setError('')
      // Ejecuta reCAPTCHA invisible y obtiene el token
      const captchaToken = await captchaRef.current.execute('forgot_password')
      await api.post('/auth/forgot-password', { email, captchaToken })
      setOk('Si el email existe, enviaremos instrucciones para restablecer tu contraseña.')
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo procesar la solicitud')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Recuperar contraseña</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Tu email"
            className="w-full rounded-md border px-3 py-2"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* reCAPTCHA invisible (usa tu componente reusable) */}
        <Captcha ref={captchaRef} />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Enviar instrucciones
        </button>
      </form>

      {ok && <p className="mt-3 text-green-600">{ok}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}

      <p className="mt-6 text-sm text-zinc-600">
        ¿Ya la recordaste? <a className="underline" href="/login">Inicia sesión</a>
      </p>
    </div>
  )
}
