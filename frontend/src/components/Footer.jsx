import { Link } from 'react-router-dom'
import ContactFooterForm from './ContactFooterForm.jsx'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
    </svg>
  )
}
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M13 22v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4Z"/>
    </svg>
  )
}
function WhatsIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" {...props}>
      <path d="M19.1 17.6c-.3-.2-1.8-.9-2-1s-.5-.1-.7.2c-.2.3-.8 1-.9 1.1s-.3.2-.6.1a7.5 7.5 0 0 1-2.2-1.4 8.1 8.1 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.7c.2-.2.2-.4 0-.7l-1-2c-.2-.5-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.1 3.1 0 0 0-1 2.3c0 1.4 1 2.8 1.1 3 .1.2 2.2 3.4 5.4 4.7 3.3 1.3 3.3.9 3.9.9s2-.8 2.3-1.6c.2-.8.2-1.5.1-1.6 0-.1-.2-.2-.5-.3ZM16 3a13 13 0 0 0-11 19.4L3.4 29 10 27a13 13 0 1 0 6-24Zm7.6 20a10.4 10.4 0 0 1-14.4 1.2l-.3-.2-3.4.9.9-3.3-.2-.4A10.4 10.4 0 1 1 23.6 23Z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#16202c] text-zinc-200">
      {/* Zona de formulario centrado */}
      <section id="contacto" className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="mx-auto w-full max-w-md bg-white text-zinc-800 rounded-xl shadow-xl p-5 md:p-6">
          <ContactFooterForm />
        </div>
      </section>

      {/* Grid inferior */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo-192.png" className="h-9 w-9 rounded-lg" alt="Selva Sagrada" />
            <span className="font-semibold text-white">Selva Sagrada</span>
          </div>
          <p className="text-sm text-zinc-300">
            Terapias holísticas y retiros para reconectar contigo y con la naturaleza.
          </p>
        </div>

        <div className="text-center">
          <ul className="text-sm space-y-2">
            <li><Link to="/servicios" className="hover:underline">Servicios</Link></li>
            <li><Link to="/testimonios" className="hover:underline">Testimonios</Link></li>
            <li><Link to="/adicionales" className="hover:underline">Adicionales</Link></li>
            <li><Link to="/nosotros" className="hover:underline">Nosotros</Link></li>
          </ul>
        </div>

        <div className="md:text-right">
          <ul className="text-sm space-y-2">
            <li>Email: <a href="mailto:hola@selvasagrada.com" className="hover:underline">hola@selvasagrada.com</a></li>
            <li>Teléfono: <a href="tel:+34600123456" className="hover:underline">+34 600 123 456</a></li>
            <li>Dirección: Madrid, España</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 text-xs text-zinc-300 flex flex-col items-center gap-3">
        <p>© {new Date().getFullYear()} Selva Sagrada. Todos los derechos reservados.</p>

        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white">
            <InstagramIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white">
            <FacebookIcon />
          </a>
          <a href="https://wa.me/34600123456" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-white">
            <WhatsIcon />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/legal/privacidad" className="hover:underline">Política &amp; Términos</Link>
          <Link to="/legal/aviso-legal" className="hover:underline">Aviso Legal</Link>
        </div>
      </div>
    </footer>
  )
}
