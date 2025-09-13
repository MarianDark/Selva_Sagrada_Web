import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      {/* Cinta CTA superior */}
      <div className="bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">¿List@ para tu próxima sesión?</h3>
          <Link to="/reservas" className="px-5 py-2 rounded-xl bg-white text-emerald-700 font-medium hover:bg-emerald-50">
            Reservar ahora
          </Link>
        </div>
      </div>

      {/* Grid principal */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo-192.png" className="h-9 w-9 rounded-lg" alt="Selva Sagrada" />
            <span className="font-semibold text-zinc-800">Selva Sagrada</span>
          </div>
          <p className="text-sm text-zinc-600">
            Terapias holísticas, bienestar y retiros. Acompañamiento integral con amor y presencia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-800 mb-3">Navegación</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/" className="hover:underline">Inicio</Link></li>
            <li><Link to="/reservas" className="hover:underline">Reservas</Link></li>
            {/* <li><Link to="/retiros" className="hover:underline">Retiros</Link></li> */}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-800 mb-3">Contacto</h4>
          <ul className="text-sm space-y-2">
            <li><a href="tel:+34600123456" className="hover:underline">+34 600 123 456</a></li>
            <li><a href="mailto:hola@selvasagrada.com" className="hover:underline">hola@selvasagrada.com</a></li>
            <li><a href="https://wa.me/34600123456" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-zinc-800 mb-3">Legal</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/legal/privacidad" className="hover:underline">Política de privacidad</Link></li>
            <li><Link to="/legal/terminos" className="hover:underline">Términos y condiciones</Link></li>
            <li><Link to="/legal/cookies" className="hover:underline">Política de cookies</Link></li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-xs text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Selva Sagrada. Todos los derechos reservados.</p>
          <p>Hecho con amor y conciencia 🌿</p>
        </div>
      </div>
    </footer>
  )
}
