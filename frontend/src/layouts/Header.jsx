import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.81 19.79 19.79 0 0 1 .08 1.18 2 2 0 0 1 2.06 0h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.6 2.63a2 2 0 0 1-.45 2.11L6.1 7.57a16 16 0 0 0 6.33 6.33l1.11-1.11a2 2 0 0 1 2.11-.45c.85.28 1.73.48 2.63.6A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}
function WhatsIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" {...props}>
      <path d="M19.1 17.6c-.3-.2-1.8-.9-2-1s-.5-.1-.7.2c-.2.3-.8 1-.9 1.1s-.3.2-.6.1a7.5 7.5 0 0 1-2.2-1.4 8.1 8.1 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.7c.2-.2.2-.4 0-.7l-1-2c-.2-.5-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.1 3.1 0 0 0-1 2.3c0 1.4 1 2.8 1.1 3 .1.2 2.2 3.4 5.4 4.7 3.3 1.3 3.3.9 3.9.9s2-.8 2.3-1.6c.2-.8.2-1.5.1-1.6 0-.1-.2-.2-.5-.3ZM16 3a13 13 0 0 0-11 19.4L3.4 29 10 27a13 13 0 1 0 6-24Zm7.6 20a10.4 10.4 0 0 1-14.4 1.2l-.3-.2-3.4.9.9-3.3-.2-.4A10.4 10.4 0 1 1 23.6 23Z"/>
    </svg>
  )
}
function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const NavLinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg transition ${
          isActive ? 'text-emerald-700 font-semibold' : 'text-zinc-700 hover:text-emerald-700'
        }`
      }
      end
    >
      {children}
    </NavLink>
  )

  return (
    <header className="w-full sticky top-0 z-40">
      {/* Top bar contacto */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-8 py-2 bg-emerald-700 text-white text-sm">
        <div className="flex items-center gap-4">
          <a href="tel:+34600123456" className="inline-flex items-center gap-2 hover:underline">
            <PhoneIcon /> +34 600 123 456
          </a>
          <a href="mailto:hola@selvasagrada.com" className="inline-flex items-center gap-2 hover:underline">
            <MailIcon /> hola@selvasagrada.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://wa.me/34600123456" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            <WhatsIcon /> WhatsApp
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <div className="bg-white/95 backdrop-blur border-b border-zinc-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-192.png" alt="Selva Sagrada" className="h-9 w-9 rounded-lg" />
            <span className="font-semibold text-zinc-800">Selva Sagrada</span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLinkItem to="/">Inicio</NavLinkItem>
            <NavLinkItem to="/reservas">Reservas</NavLinkItem>
            {/* Añade más secciones si quieres: <NavLinkItem to="/retiros">Retiros</NavLinkItem> */}
          </nav>

          {/* CTAs derecha */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/reservas"
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
            >
              Reservar ahora
            </Link>
            {user ? (
              <>
                <Link to="/mi-cuenta" className="px-3 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Mi cuenta
                </Link>
                <button onClick={logout} className="px-3 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100">
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50">
                Entrar
              </Link>
            )}
          </div>

          {/* Menú móvil */}
          <button className="md:hidden p-2 rounded-lg hover:bg-zinc-100" onClick={() => setOpen(true)}>
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <img src="/logo-192.png" className="h-8 w-8 rounded" alt="Selva Sagrada" />
                <span className="font-semibold">Selva Sagrada</span>
              </Link>
              <button className="p-2 rounded-lg hover:bg-zinc-100" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col">
              <NavLinkItem to="/">Inicio</NavLinkItem>
              <NavLinkItem to="/reservas">Reservas</NavLinkItem>
            </nav>

            <div className="mt-auto pt-4 flex flex-col gap-2">
              <Link
                to="/reservas"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium text-center"
              >
                Reservar ahora
              </Link>

              {user ? (
                <>
                  <Link
                    to="/mi-cuenta"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 text-center"
                  >
                    Mi cuenta
                  </Link>
                  <button onClick={() => { setOpen(false); logout(); }} className="px-4 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100">
                    Salir
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 text-center">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
