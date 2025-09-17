// frontend/src/pages/Login.jsx
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

function EyeTurcoIcon({ className = 'w-5 h-5' }) {
  // Ojo turco (nazar) en SVG: anillos azul oscuro, blanco, azul claro y pupila negra
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" fill="#0B4AA2" />       {/* azul oscuro */}
      <circle cx="12" cy="12" r="6.8" fill="#FFFFFF" />      {/* blanco */}
      <circle cx="12" cy="12" r="4.4" fill="#32A5FF" />      {/* azul claro */}
      <circle cx="12" cy="12" r="2" fill="#000000" />        {/* pupila */}
    </svg>
  )
}

export default function Login() {
  const { register, handleSubmit, setValue } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const passInputRef = useRef(null)

  const { loginSuccess } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onSubmit = async (form) => {
    setError('')
    setSubmitting(true)
    try {
      // Mandamos credenciales y punto. No se guardan en estado.
      await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })

      await loginSuccess()

      // Higiene: limpia el password y saca foco del campo
      setValue('password', '')
      passInputRef.current?.blur()

      const next = searchParams.get('next') || '/mi-cuenta'
      navigate(next, { replace: true })
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || 'Error iniciando sesión'
      setError(msg)
      // limpia y vuelve el foco al password para reintento rápido
      setValue('password', '')
      passInputRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow"
      autoComplete="on"
    >
      <h1 className="text-2xl font-bold text-emerald-700">Inicia sesión</h1>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Email</label>
        <input
          {...register('email', { required: true })}
          placeholder="tucorreo@dominio.com"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="w-full rounded-md border p-2 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">Contraseña</label>
        <div className="relative">
          <input
            {...register('password', { required: true })}
            ref={passInputRef}
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            autoComplete="current-password"
            className="w-full rounded-md border p-2 pr-12 focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword ? 'true' : 'false'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <EyeTurcoIcon className={`w-5 h-5 ${showPassword ? '' : 'opacity-80'}`} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
