import { Link } from 'react-router-dom'
import ContactFooterForm from './ContactFooterForm.jsx'
import { useA2HS } from '@/hooks/useA2HS'

export default function Footer() {
  const { canInstall, promptInstall } = useA2HS()

  return (
    <footer className="mt-12 bg-jungle-900 text-zinc-2 00 relative overflow-hidden">
      <section id="contacto" className="relative max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="mx-auto w-full max-w-md bg-white text-zinc-800 rounded-xl shadow-xl p-5 md:p-6">
          <ContactFooterForm />
        </div>
      </section>

      <div className="md:text-right">
        <ul className="text-sm space-y-2 px-4 lg:px-8 max-w-7xl mx-auto">
          <li>Email: <a href="mailto:contacto@selvasagrada.com" className="hover:underline">contacto@selvasagrada.com</a></li>
          <li>Teléfono: <a href="tel:+34600123456" className="hover:underline">+34 600 123 456</a></li>
          <li>Dirección: Málaga, España</li>
        </ul>
      </div>

      <div className="border-t border-white/10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 text-xs text-zinc-300 flex flex-col items-center gap-3">
        <p>© {new Date().getFullYear()} Selva Sagrada. Todos los derechos reservados.</p>
        {canInstall && (
          <button onClick={promptInstall} className="px-4 py-2 rounded-lg border border-emerald-400 text-emerald-200 font-semibold hover:bg-white/10">
            Instalar app
          </button>
        )}
        <div className="flex items-center gap-4">{/* redes si quieres */}</div>
        <div className="flex items-center gap-4">
          <Link to="/legal/privacidad" className="hover:underline">Política &amp; Términos</Link>
          <Link to="/legal/aviso-legal" className="hover:underline">Aviso Legal</Link>
        </div>
      </div>
    </footer>
  )
}
