// src/pages/Auth/Login.jsx
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import api from '@/lib/api'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const captchaRef = useRef(null)

  const onSubmit = async (form) => {
    setError('')
    setSubmitting(true)
    try {
      if (!captchaToken) {
        setError('Por favor, completa el reCAPTCHA')
        return
      }

      await api.post('/auth/login', { ...form, captchaToken })

      // reset opcional
      try { captchaRef.current?.reset() } catch {}
      setCaptchaToken(null)

      window.location.assign('/mi-cuenta')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Error iniciando sesión'
      console.error('Login error:', e)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Inicia sesión</h1>

      <input {...register('email', { required: true })} placeholder="Email" className="w-full rounded-md border p-2" />
      <input type="password" {...register('password', { required: true })} placeholder="Contraseña" className="w-full rounded-md border p-2" />

      <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={(token) => setCaptchaToken(token)}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button disabled={submitting} className="w-full bg-black text-white rounded-md py-2 disabled:opacity-60">
        {submitting ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
