import { useState } from 'react'
import { api } from '../lib/api'

export default function FormContact() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email,   setEmail]   = useState('')
  const [mensaje, setMensaje] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [prefLlamada, setPrefLlamada]   = useState(false)
  const [prefEmail, setPrefEmail]       = useState(false)
  const [prefWhatsapp, setPrefWhatsapp] = useState(false)

  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setOk('')
    setError('')

    // Validaciones coherentes con tu backend:
    // - name min 2
    // - message min 5
    // - al menos email válido o teléfono con 7+ chars
    if (!aceptaTerminos) {
      setError('Debes aceptar la política de privacidad.')
      return
    }
    const nameTrim = nombre.trim()
    const msgTrim  = mensaje.trim()
    const telTrim  = telefono.trim()
    const mailTrim = email.trim()

    if (nameTrim.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (msgTrim.length < 5) {
      setError('El mensaje debe tener al menos 5 caracteres.')
      return
    }
    if (!mailTrim && telTrim.length < 7) {
      setError('Indica al menos un medio de contacto (email o teléfono).')
      return
    }
    if (mailTrim && !/^\S+@\S+\.\S+$/.test(mailTrim)) {
      setError('Email inválido.')
      return
    }

    try {
      setEnviando(true)

      await api.post('/contact', {
        name: nameTrim,
        phone: telTrim || undefined,
        email: mailTrim || undefined,
        message: msgTrim,
        preferences: {
          call: !!prefLlamada,
          email: !!prefEmail,
          whatsapp: !!prefWhatsapp,
        },
        // adiós captchaToken
      })

      setOk('¡Gracias! Hemos recibido tu mensaje y te contactaremos muy pronto.')
      setNombre('')
      setTelefono('')
      setEmail('')
      setMensaje('')
      setAceptaTerminos(false)
      setPrefLlamada(false)
      setPrefEmail(false)
      setPrefWhatsapp(false)
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo enviar. Intenta de nuevo.'
      setError(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div id="contacto" className="pt-2">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-lg mx-auto"
        noValidate
      >
        <h2 className="text-xl font-semibold text-emerald-800 text-center">
          Contáctanos
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          className="border rounded px-4 py-2 w-full text-black"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          autoComplete="name"
        />

        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          className="border rounded px-4 py-2 w-full text-black"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          autoComplete="tel"
          inputMode="tel"
        />

        <input
          type="email"
          placeholder="Email (opcional)"
          className="border rounded px-4 py-2 w-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />

        <textarea
          placeholder="Escribe tu mensaje (máx. 5000 caracteres)"
          className="border rounded px-4 py-2 w-full text-black h-32 resize-none"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          maxLength={5000}
          required
        />

        {/* Preferencias de contacto */}
        <div className="flex flex-col gap-2 text-left text-sm text-zinc-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefLlamada}
              onChange={(e) => setPrefLlamada(e.target.checked)}
              className="accent-emerald-600 w-5 h-5"
            />
            Prefiero que me llamen
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefEmail}
              onChange={(e) => setPrefEmail(e.target.checked)}
              className="accent-emerald-600 w-5 h-5"
            />
            Prefiero que me envíen email
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefWhatsapp}
              onChange={(e) => setPrefWhatsapp(e.target.checked)}
              className="accent-emerald-600 w-5 h-5"
            />
            Prefiero WhatsApp
          </label>
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-start gap-2 text-left">
          <input
            id="acepta-terminos"
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="accent-emerald-600 w-5 h-5 mt-1"
            required
          />
          <label htmlFor="acepta-terminos" className="text-sm text-zinc-700">
            Acepto la{' '}
            <a
              href="/legal/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline hover:text-emerald-800"
            >
              Política de Privacidad
            </a>
            .
          </label>
        </div>

        {/* Mensajes */}
        {ok && <p className="text-emerald-700 text-sm">{ok}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={enviando}
          className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg shadow-md transition w-full disabled:opacity-60"
        >
          {enviando ? 'Enviando…' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
