import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/api'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useState } from 'react'


const schema = z.object({
name: z.string().min(2),
email: z.string().email(),
message: z.string().min(10),
})


export default function ContactFooterForm(){
const { register, handleSubmit, formState:{ errors }, reset } = useForm({ resolver: zodResolver(schema) })
const [sending, setSending] = useState(false)
const [ok, setOk] = useState('')
const captchaRef = useRef()


const onSubmit = async (data) => {
try {
setSending(true)
const captchaToken = await captchaRef.current.executeAsync()
captchaRef.current.reset()
await api.post('/contact', { ...data, captchaToken })
setOk('¡Gracias! Te responderemos pronto.')
reset()
} catch (e) {
setOk('No se pudo enviar. Intenta de nuevo.')
} finally { setSending(false) }
}


return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
<input {...register('name')} placeholder="Tu nombre" className="w-full rounded-md" />
{errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
<input {...register('email')} placeholder="Email" className="w-full rounded-md" />
{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
<textarea {...register('message')} placeholder="Mensaje" rows={4} className="w-full rounded-md" />
{errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
<ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} size="invisible" ref={captchaRef} />
<button disabled={sending} className="px-4 py-2 rounded-md bg-black text-white">{sending?'Enviando…':'Enviar'}</button>
{ok && <p className="text-sm">{ok}</p>}
</form>
)
}