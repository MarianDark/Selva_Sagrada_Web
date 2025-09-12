import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/api'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useState } from 'react'


const schema = z.object({
name: z.string().min(2, 'Escribe tu nombre'),
email: z.string().email('Email inválido'),
message: z.string().min(10, 'Cuéntanos un poco más (mín. 10 caracteres)'),
})


export default function ContactFooterForm() {
const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) })
const [sending, setSending] = useState(false)
const [ok, setOk] = useState('')
const captchaRef = useRef(null)


const onSubmit = async (data) => {
setOk('')
try {
setSending(true)
const captchaToken = await captchaRef.current.executeAsync()
captchaRef.current.reset()
await api.post('/contact', { ...data, captchaToken })
setOk('¡Gracias! Te responderemos pronto.')
reset()
} catch (e) {
const apiMsg = e?.response?.data?.message
setOk(apiMsg ? `No se pudo enviar: ${apiMsg}` : 'No se pudo enviar. Intenta de nuevo.')
} finally { setSending(false) }
}


return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
<input {...register('name')} placeholder="Tu nombre" className="w-full rounded-lg border px-3 py-2" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} autoComplete="name" />
{errors.name && <p id="err-name" className="text-xs text-red-600">{errors.name.message}</p>}


<input {...register('email')} placeholder="Email" className="w-full rounded-lg border px-3 py-2" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} autoComplete="email" inputMode="email" />
{errors.email && <p id="err-email" className="text-xs text-red-600">{errors.email.message}</p>}


<textarea {...register('message')} placeholder="Mensaje" rows={4} className="w-full rounded-lg border px-3 py-2" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} />
{errors.message && <p id="err-message" className="text-xs text-red-600">{errors.message.message}</p>}


<ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} size="invisible" />


<button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
{sending ? 'Enviando…' : 'Enviar'}
</button>


{ok && <p className="text-sm">{ok}</p>}
</form>
)
}