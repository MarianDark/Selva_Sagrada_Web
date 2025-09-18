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
        [
          'relative px-3 py-1.5 rounded-full text-sm font-medium outline-none',
          'transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-emerald-400/60',
          isActive
            ? [
                'text-transparent bg-clip-text',
                'bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600',
                'after:absolute after:inset-x-2 after:-bottom-1 after:h-px',
                'after:bg-gradient-to-r after:from-transparent after:via-emerald-500/70 after:to-transparent',
              ].join(' ')
            : [
                'text-jungle-800/80 hover:text-jungle-900',
                'hover:bg-emerald-50/70 dark:hover:bg-emerald-900/10',
              ].join(' '),
        ].join(' ')
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

        setScrolled(y > 6)

        if (isMobile && !open) {
          if (down && y > 72) setHidden(true)
          else if (up || y <= 72) setHidden(false)
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
      className={[
        'sticky top-0 z-50 w-full border-b',
        'transition-transform duration-300 will-change-transform',
        hidden ? '-translate-y-full' : 'translate-y-0',
        // Glass + niebla mística
        'bg-white/85 dark:bg-zinc-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65',
        'border-emerald-900/5 dark:border-emerald-400/10',
        scrolled
          ? 'shadow-[0_12px_28px_rgba(16,24,16,0.14)]'
          : 'shadow-[0_6px_18px_rgba(16,24,16,0.10)]',
      ].join(' ')}
    >
      {/* Aura mística detrás del header (solo al hacer scroll) */}
      <div
        aria-hidden
        className={[
          'pointer-events-none absolute inset-0 -z-10 opacity-0',
          scrolled ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300',
        ].join(' ')}
        style={{
          maskImage:
            'radial-gradient(120%_80% at 50% 0%, black 40%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(120%_80% at 50% 0%, black 40%, transparent 75%)',
          background:
            'radial-gradient(1200px 200px at 50% 0%, rgba(16,185,129,0.10), rgba(0,0,0,0))',
        }}
      />

      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Izquierda: logo + marca */}
        <div className="justify-self-start flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-3 no-underline group">
            <img
              src={LOGO}
              alt="Selva Sagrada"
              className="h-9 w-9 rounded-2xl ring-1 ring-emerald-600/15 group-hover:ring-emerald-600/30 transition"
              loading="eager"
              decoding="async"
            />
            <span className="hidden sm:inline text-base font-semibold tracking-wide text-jungle-900 dark:text-emerald-100">
              Selva Sagrada
            </span>
          </Link>
        </div>

        {/* Centro: pestañas (desktop) */}
        <nav className="hidden md:flex justify-self-center items-center gap-1.5">
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
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
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
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
              >
                Registro
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-jungle-900 dark:text-emerald-100 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
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
            className="p-2 rounded-lg hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div
            className="absolute top-0 right-0 w-[84%] max-w-sm h-full p-4 shadow-xl flex flex-col"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(246,253,250,0.95) 60%, rgba(240,255,250,0.95) 100%)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="relative overflow-hidden rounded-xl border border-emerald-900/10">
              {/* patrón sutil tipo hojas */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 10%, #10b981 1px, transparent 1px), radial-gradient(circle at 80% 30%, #34d399 1px, transparent 1px), radial-gradient(circle at 50% 70%, #059669 1px, transparent 1px)',
                  backgroundSize: '22px 22px, 26px 26px, 30px 30px',
                }}
              />
              <div className="relative z-[1] p-3 bg-white/60 backdrop-blur">
                <div className="flex items-center justify-between">
                  <Link to="/" onClick={close} className="flex items-center gap-2">
                    <img src={LOGO} alt="Selva Sagrada" className="h-7 w-7 rounded-lg ring-1 ring-emerald-600/15" />
                    <span className="text-jungle-900 font-semibold">Selva Sagrada</span>
                  </Link>
                  <button
                    className="p-2 rounded-lg hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                    onClick={close}
                    aria-label="Cerrar menú"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/" onClick={close} className="px-3 py-2 rounded-lg text-base font-medium text-jungle-900 hover:bg-emerald-50/70">Inicio</Link>
              <Link to="/nosotros" onClick={close} className="px-3 py-2 rounded-lg text-base font-medium text-jungle-900 hover:bg-emerald-50/70">Nosotros</Link>
              {/* <Link to="/terapias" onClick={close} className="px-3 py-2 rounded-lg text-base font-medium text-jungle-900 hover:bg-emerald-50/70">Terapias</Link> */}
            </nav>

            {/* Panel Auth (móvil) */}
            <div className="mt-4 grid gap-2">
              {!loading && user ? (
                <>
                  <Link
                    to="/mi-cuenta"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-emerald-50/70 text-center"
                  >
                    Mi cuenta
                  </Link>
                  <div className="flex justify-center">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-emerald-50/70 text-center"
                  >
                    Registro
                  </Link>
                  <Link
                    to="/login"
                    onClick={close}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-jungle-900 hover:bg-emerald-50/70 text-center"
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
