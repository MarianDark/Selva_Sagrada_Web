import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Incluye mayúscula')
  .regex(/[a-z]/, 'Incluye minúscula')
  .regex(/[0-9]/, 'Incluye número')
  .regex(/[^A-Za-z0-9]/, 'Incluye símbolo')

const schema = z
  .object({
    name: z.string().min(2, 'Ingresa tu nombre'),
    email: z.string().email('Email inválido'),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  })

export default function Register() {
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
    mode: 'onSubmit',
  })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/mi-cuenta'
  const { loginSuccess } = useAuth()

  const onSubmit = async (values) => {
    setOk('')
    setError('')
    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      })

      try {
        await api.post('/auth/login', {
          email: values.email,
          password: values.password,
        })
        await loginSuccess()
        return navigate(next, { replace: true })
      } catch (e) {
        const status = e?.response?.status
        if (status === 401 || status === 403) {
          setOk('Registro exitoso. Revisa tu email para verificar la cuenta antes de iniciar sesión.')
        } else {
          setOk('Registro exitoso. Ahora puedes iniciar sesión.')
        }
      }

      reset({ name: '', email: '', password: '', confirm: '' })
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo registrar.'
      setError(msg)
    }
  }

  const password = watch('password')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow"
    >
      <h1 className="text-2xl font-bold text-emerald-700">Crear cuenta</h1>

      <div>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password con ojo turco */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          className="w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <img src="/ojo-turco.jpg" alt="Ocultar" className="h-5 w-5" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500">
              <path
                fill="currentColor"
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
              />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          )}
        </button>
        {errors.password ? (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        ) : (
          <ul className="text-xs text-zinc-600 mt-1 list-disc ml-5">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo</li>
          </ul>
        )}
      </div>

      {/* Confirm con ojo turco */}
      <div className="relative">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          className="w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
          {...register('confirm')}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showConfirm ? (
            <img src="/ojo-turco.jpg" alt="Ocultar" className="h-5 w-5" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500">
              <path
                fill="currentColor"
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
              />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          )}
        </button>
        {errors.confirm ? (
          <p className="text-sm text-red-600 mt-1">{errors.confirm.message}</p>
        ) : password ? (
          <p className="text-xs text-zinc-500 mt-1">Debe coincidir con la contraseña.</p>
        ) : null}
      </div>

      {ok && <p className="text-green-600">{ok}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className="mt-4 text-sm text-zinc-600 text-center">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}
          className="text-emerald-700 font-medium hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
