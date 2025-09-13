import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const captchaRef = useRef(null)

  const { loginSuccess } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onSubmit = async (form) => {
    setError('')
    setSubmitting(true)
    try {
      if (!captchaToken) {
        setError('Por favor, completa el reCAPTCHA')
        return
      }

      // 👉 login en backend
      await api.post('/auth/login', { ...form, captchaToken })

      // 👉 refresca el user en el AuthContext
      await loginSuccess()

      // reset captcha
      try {
        captchaRef.current?.reset()
      } catch {}
      setCaptchaToken(null)

      // 🚀 redirección: primero a ?next=..., si no, a /mi-cuenta
      const next = searchParams.get('next') || '/mi-cuenta'
      navigate(next, { replace: true })
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || 'Error iniciando sesión'
      console.error('Login error:', e)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow"
    >
      <h1 className="text-2xl font-bold text-emerald-700">Inicia sesión</h1>

      <input
        {...register('email', { required: true })}
        placeholder="Email"
        type="email"
        className="w-full rounded-md border p-2 focus:ring-2 focus:ring-emerald-500"
      />

      <input
        type="password"
        {...register('password', { required: true })}
        placeholder="Contraseña"
        className="w-full rounded-md border p-2 focus:ring-2 focus:ring-emerald-500"
      />

      <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={(token) => setCaptchaToken(token)}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        disabled={submitting}
        className="w-full bg-emerald-600 text-white rounded-md py-2 font-medium hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
