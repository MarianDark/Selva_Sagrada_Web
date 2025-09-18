import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LogoutButton } from '@/components/LogoutButton'

const LOGO = '/logo.png'

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `tab ${isActive ? 'tab-active' : 'tab-inactive'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prevY = useRef(0)
  const ticking = useRef(false)

  const { user, loading } = useAuth()

  const close = () => setOpen(false)

  // Auto-ocultar en mobile: al bajar oculta, al subir muestra
  useEffect(() => {
    prevY.current = window.scrollY
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const isMobile = window.innerWidth < 768
        const down = y > prevY.current + 4
        const up = y < prevY.current - 4

        setScrolled(y > 4)

        if (isMobile && !open) {
          if (down && y > 64) setHidden(true)
          else if (up || y <= 64) setHidden(false)
        } else {
          setHidden(false)
        }

        prevY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 w-full
                  bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75
                  border-b border-jungle-100/60
                  transition-transform duration-300 will-change-transform
                  ${hidden ? '-translate-y-full' : 'translate-y-0'}
                  ${scrolled
                    ? 'shadow-[0_12px_28px_rgba(16,24,16,0.14)]'
                    : 'shadow-[0_6px_18px_rgba(16,24,16,0.10)]'}`}
    >
      {/* Grid de 3 columnas: [izquierda flexible | centro auto | derecha flexible] */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Izquierda: logo + marca */}
        <div className="justify-self-start flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <img src={LOGO} alt="Selva Sagrada" className="h-8 w-8 rounded-xl" />
          </Link>
        </div>

        {/* Centro: pestañas (desktop) */}
        <nav className="hidden md:flex justify-self-center items-center gap-2">
          <Tab to="/">Inicio</Tab>
          <Tab to="/nosotros">Nosotros</Tab>
          {/* <Tab to="/terapias">Terapias</Tab> */}
        </nav>

        {/* Derecha (desktop): Auth-aware */}
        <div className="hidden md:flex justify-self-end items-center gap-3">
          {!loading && user ? (
            <>
              <Link
                to="/mi-cuenta"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100"
                title="Ir a mi cuenta"
              >
                Hola, {user.name?.split(' ')[0] || 'Usuario'}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100"
              >
                Registro
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100"
              >
                Inicio de sesión
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa (solo móvil) */}
        <div className="md:hidden justify-self-end flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-earth-100"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute top-0 right-0 w-[82%] max-w-sm h-full bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Link to="/" onClick={close} className="flex items-center gap-2">
                <img src={LOGO} alt="Selva Sagrada" className="h-6 w-6 rounded-lg" />
                <span className="text-jungle-900 font-semibold">Selva Sagrada</span>
              </Link>
              <button className="p-2 rounded-lg hover:bg-earth-100" onClick={close} aria-label="Cerrar menú">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="mt-2 flex flex-col gap-2">
              <Link to="/" onClick={close} className="tab tab-inactive">Inicio</Link>
              <Link to="/nosotros" onClick={close} className="tab tab-inactive">Nosotros</Link>
            </nav>

            {/* Panel Auth (móvil) */}
            <div className="mt-4 grid gap-2">
              {!loading && user ? (
                <>
                  <Link
                    to="/mi-cuenta"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100 text-center"
                  >
                    Mi cuenta
                  </Link>
                  {/* Botón de logout dentro del drawer */}
                  <div className="flex justify-center">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100 text-center"
                  >
                    Registro
                  </Link>
                  <Link
                    to="/login"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-earth-100 text-center"
                  >
                    Inicio de sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
