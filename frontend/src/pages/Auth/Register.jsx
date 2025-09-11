import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { api } from '../../lib/api'

const passwordSchema = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Incluye mayúscula')
  .regex(/[a-z]/, 'Incluye minúscula')
  .regex(/[0-9]/, 'Incluye número')
  .regex(/[^A-Za-z0-9]/, 'Incluye símbolo')

const schema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})

export default function Register() {
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
    mode: 'onSubmit',
  })

  const onSubmit = async (values) => {
    try {
      setOk('')
      setError('')
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      })
      setOk('Registro exitoso. Revisa tu email para verificar la cuenta.')
      reset({ name: '', email: '', password: '', confirm: '' })
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo registrar.'
      setError(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>

      <div>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full rounded-md border px-3 py-2"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full rounded-md border px-3 py-2"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        ) : (
          <ul className="text-xs text-zinc-600 mt-1 list-disc ml-5">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo</li>
          </ul>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full rounded-md border px-3 py-2"
          {...register('confirm')}
        />
        {errors.confirm && <p className="text-sm text-red-600 mt-1">{errors.confirm.message}</p>}
      </div>

      {ok && <p className="text-green-600">{ok}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className="mt-4 text-sm text-zinc-600 text-center">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a>
      </p>
    </form>
  )
}
