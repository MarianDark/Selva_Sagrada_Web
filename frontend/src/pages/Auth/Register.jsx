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
          setOk(
            'Registro exitoso. Revisa tu email para verificar la cuenta antes de iniciar sesión.'
          )
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

  // SVG ojo cerrado con pestañas
  const EyeClosed = (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.1 3.5 1 4.9l3.2 2.5A11.6 11.6 0 0 0 1 12c2.1 4.4 6.6 7.5 11 7.5 2.1 0 4.1-.6 5.8-1.7l3.2 2.5 1.1-1.4L2.1 3.5zM12 17c-2.8 0-5-2.2-5-5 0-.5.1-1 .3-1.4l6.1 4.8c-.4.3-.9.6-1.4.6zm9-5c-.7 1.6-1.9 3-3.3 4.1l-1.5-1.2a7.3 7.3 0 0 0 2.2-2.9 10.8 10.8 0 0 0-2.7-3.6l-1.5-1.2a7.2 7.2 0 0 0-1.6-.9l-1.4-1.1c.5-.1 1.1-.2 1.7-.2 4.4 0 8.9 3.1 11 7z"
      />
    </svg>
  )

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
          autoComplete="name"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          {...register('email')}
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          className="w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
          {...register('password')}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={showPassword ? 'true' : 'false'}
          className="absolute inset-y-0 right-3 flex items-center justify-center"
        >
          {showPassword ? (
            <img src="/ojo-turco.jpg" alt="Ojo abierto" className="h-5 w-5" />
          ) : (
            EyeClosed
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

      {/* Confirm */}
      <div className="relative">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          className="w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
          {...register('confirm')}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          aria-label={showConfirm ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
          aria-pressed={showConfirm ? 'true' : 'false'}
          className="absolute inset-y-0 right-3 flex items-center justify-center"
        >
          {showConfirm ? (
            <img src="/ojo-turco.jpg" alt="Ojo abierto" className="h-5 w-5" />
          ) : (
            EyeClosed
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
