import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { api } from '../lib/api'

const phoneRegex = /^[0-9+()\s-]{7,20}$/

const baseSchema = z.object({
  name: z.string().min(2, 'Escribe tu nombre'),
  email: z.string().email('Email inválido'),
  phone: z.string().trim().optional().or(z.literal('')), // opcional
  message: z.string().min(10, 'Cuéntanos un poco más (mín. 10 caracteres)'),
  contactMethod: z.enum(['email', 'phone', 'whatsapp'], {
    errorMap: () => ({ message: 'Elige un método de contacto' }),
  }),
  acceptPrivacy: z
    .boolean()
    .refine((v) => v === true, 'Debes aceptar la política de privacidad'),
})

const schema = baseSchema.superRefine((data, ctx) => {
  // Si prefiere llamada o WhatsApp → teléfono requerido y válido
  if (data.contactMethod === 'phone' || data.contactMethod === 'whatsapp') {
    if (!data.phone || !phoneRegex.test(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message:
          'Introduce un teléfono válido (incluye prefijo, ej. +34, si aplica).',
      })
    }
  } else {
    // Si prefiere email y ha escrito teléfono, validar formato si no está vacío
    if (data.phone && !phoneRegex.test(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Formato de teléfono inválido.',
      })
    }
  }
})

export default function ContactFooterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      contactMethod: 'email',
      acceptPrivacy: false,
    },
    mode: 'onSubmit',
  })

  const contactMethod = watch('contactMethod')
  const [sending, setSending] = useState(false)
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const captchaRef = useRef(null)

  const onSubmit = async (data) => {
    setOk('')
    setError('')
    try {
      setSending(true)
      // Obtener token de reCAPTCHA invisible
      const captchaToken = await captchaRef.current?.executeAsync()
      captchaRef.current?.reset()

      if (!captchaToken) {
        setError('No pudimos verificar el reCAPTCHA. Intenta de nuevo.')
        return
      }

      await api.post('/contact', { ...data, captchaToken })

      const methodLabel =
        data.contactMethod === 'phone'
          ? 'llamada telefónica'
          : data.contactMethod === 'whatsapp'
          ? 'WhatsApp'
          : 'email'

      setOk(`¡Gracias! Te responderemos por ${methodLabel} pronto.`)
      reset({
        name: '',
        email: '',
        phone: '',
        message: '',
        contactMethod: 'email',
        acceptPrivacy: false,
      })
    } catch (e) {
      const apiMsg = e?.response?.data?.message
      setError(apiMsg || 'No se pudo enviar. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const phoneRequired = contactMethod === 'phone' || contactMethod === 'whatsapp'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Nombre */}
      <div>
        <input
          {...register('name')}
          placeholder="Tu nombre"
          className="w-full rounded-lg border px-3 py-2"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'err-name' : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p id="err-name" className="text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border px-3 py-2"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'err-email' : undefined}
          autoComplete="email"
          inputMode="email"
        />
        {errors.email && (
          <p id="err-email" className="text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Teléfono (opcional / requerido según preferencia) */}
      <div>
        <input
          {...register('phone')}
          type="tel"
          placeholder={
            phoneRequired
              ? 'Teléfono (requerido para llamada/WhatsApp)'
              : 'Teléfono (opcional)'
          }
          className="w-full rounded-lg border px-3 py-2"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'err-phone' : undefined}
          inputMode="tel"
        />
        {errors.phone ? (
          <p id="err-phone" className="text-xs text-red-600">
            {errors.phone.message}
          </p>
        ) : (
          <p className="text-xs text-zinc-500 mt-1">
            Acepta formatos como +34 600 123 456 o (600) 123-456.
          </p>
        )}
      </div>

      {/* Preferencia de contacto */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-700">
          ¿Cómo prefieres que te contactemos?
        </legend>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="email"
              {...register('contactMethod')}
              className="accent-emerald-600"
            />
            <span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="phone"
              {...register('contactMethod')}
              className="accent-emerald-600"
            />
            <span>Llamada telefónica</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="whatsapp"
              {...register('contactMethod')}
              className="accent-emerald-600"
            />
            <span>WhatsApp</span>
          </label>
        </div>
        {errors.contactMethod && (
          <p className="text-xs text-red-600">{errors.contactMethod.message}</p>
        )}
      </fieldset>

      {/* Mensaje */}
      <div>
        <textarea
          {...register('message')}
          placeholder="Mensaje"
          rows={4}
          className="w-full rounded-lg border px-3 py-2"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
        />
        {errors.message && (
          <p id="err-message" className="text-xs text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Acepto privacidad */}
      <div className="flex items-start gap-2">
        <input
          id="acceptPrivacy"
          type="checkbox"
          {...register('acceptPrivacy')}
          className="mt-1 accent-emerald-600"
          aria-invalid={!!errors.acceptPrivacy}
          aria-describedby={errors.acceptPrivacy ? 'err-privacy' : undefined}
        />
        <label htmlFor="acceptPrivacy" className="text-sm text-zinc-700">
          He leído y acepto la{' '}
          <Link
            to="/legal/privacidad"
            className="text-emerald-700 underline hover:no-underline"
          >
            Política de Privacidad
          </Link>
          .
        </label>
      </div>
      {errors.acceptPrivacy && (
        <p id="err-privacy" className="text-xs text-red-600">
          {errors.acceptPrivacy.message}
        </p>
      )}

      {/* reCAPTCHA invisible */}
      <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        size="invisible"
      />

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting || sending}
        className="btn-primary disabled:opacity-60"
      >
        {isSubmitting || sending ? 'Enviando…' : 'Enviar'}
      </button>

      {/* Mensajes */}
      {ok && <p className="text-sm text-green-600">{ok}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
