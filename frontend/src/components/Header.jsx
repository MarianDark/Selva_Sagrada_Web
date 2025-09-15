import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useA2HS } from '@/hooks/useA2HS' // ⬅️ hook de A2HS

export default function Header() {
  const [open, setOpen] = useState(false)

  // ⬇️ A2HS
  const { canInstall, promptInstall, showBanner, mode, dismiss } = useA2HS()

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      end
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg transition font-medium ${
          isActive
            ? 'text-emerald-700 bg-emerald-50'
            : 'text-zinc-800 hover:text-emerald-700'
        }`
      }
    >
      {children}
    </NavLink>
  )

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-zinc-200 shadow-sm">
        <div className="mx-auto max-w-7xl h-16 px-4 lg:px-8 flex items-center justify-between">
          {/* Logo a la izquierda */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-192.png" alt="Selva Sagrada" className="h-9 w-9 rounded-lg" />
            <span className="text-zinc-900 font-semibold">Selva Sagrada</span>
          </Link>

          {/* Navegación (solo desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Inicio</NavItem>
            <NavItem to="/register">Registro</NavItem>
            <NavItem to="/login">Inicio de sesión</NavItem>
          </nav>

          {/* CTAs derecha (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Botón A2HS (Android) */}
            {canInstall && (
              <button
                onClick={promptInstall}
                className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50"
              >
                Instalar app
              </button>
            )}
            {/* Contacto */}
            <a
              href="/#contacto"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
            >
              Contáctanos
            </a>
          </div>

          {/* Hamburguesa (solo móvil) */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer móvil */}
        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <img src="/logo-192.png" className="h-8 w-8 rounded" alt="Selva Sagrada" />
                  <span className="font-semibold text-zinc-900">Selva Sagrada</span>
                </Link>
                <button className="p-2 rounded-lg hover:bg-zinc-100" onClick={() => setOpen(false)} aria-label="Cerrar menú">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                <NavItem to="/">Inicio</NavItem>
                <NavItem to="/register">Registro</NavItem>
                <NavItem to="/login">Inicio de sesión</NavItem>
              </nav>

              {/* CTA y A2HS en móvil */}
              <div className="mt-auto grid gap-2">
                {canInstall && (
                  <button
                    onClick={() => { setOpen(false); promptInstall() }}
                    className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50"
                  >
                    Instalar app
                  </button>
                )}
                <a
                  href="/#contacto"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-center hover:bg-emerald-800"
                >
                  Contáctanos
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Banner A2HS (Android/iOS) */}
      {showBanner && (
        <div className="fixed bottom-4 inset-x-4 z-50 rounded-xl bg-white shadow-lg p-4 flex flex-col md:flex-row items-center gap-3 border border-zinc-200">
          <div className="flex-1">
            <p className="font-semibold">Instala Selva Sagrada</p>
            {mode === 'android' ? (
              <p className="text-sm text-zinc-600">
                Acceso rápido desde tu pantalla de inicio.
              </p>
            ) : (
              <p className="text-sm text-zinc-600">
                En iPhone/iPad: toca <span className="font-medium">Compartir</span> →{' '}
                <span className="font-medium">Añadir a pantalla de inicio</span>.
              </p>
            )}
          </div>

          {mode === 'android' ? (
            <button onClick={promptInstall} className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800">
              Instalar
            </button>
          ) : (
            <a
              href="https://support.apple.com/es-es/guide/iphone/iph42ab2f3a7/ios"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
            >
              Cómo instalar
            </a>
          )}

          <button
            onClick={dismiss}
            className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900"
            aria-label="Cerrar banner de instalación"
          >
            Ahora no
          </button>
        </div>
      )}
    </>
  )
}
