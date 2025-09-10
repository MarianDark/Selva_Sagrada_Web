import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Cierra el menú cuando cambias de ruta
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-amber-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Nombre */}
        <Link
          to="/"
          className="font-bold text-xl text-white tracking-wide hover:text-amber-200 transition"
        >
          Selva Sagrada
        </Link>

        {/* Botón hamburguesa (mobile) */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {!open ? (
            // Icono hamburguesa
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          ) : (
            // Icono cerrar
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          )}
        </button>

        {/* Navegación (desktop) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Nav to="/">Inicio</Nav>
          <Nav to="/reservas">Reservas</Nav>
          <Nav to="/register">Registro</Nav>
          <Nav to="/login">Iniciar sesión</Nav>
        </nav>
      </div>

      {/* Menú desplegable (mobile) */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-gradient-to-b from-green-800 to-amber-900/90 backdrop-blur ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          <MobileNav to="/" onClick={() => setOpen(false)}>Inicio</MobileNav>
          <MobileNav to="/reservas" onClick={() => setOpen(false)}>Reservas</MobileNav>
          <MobileNav to="/register" onClick={() => setOpen(false)}>Registro</MobileNav>
          <MobileNav to="/login" onClick={() => setOpen(false)}>Iniciar sesión</MobileNav>
        </div>
      </div>
    </header>
  )
}

/** Link de navegación (desktop) con estilos activos */
function Nav({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'text-amber-200 border-b-2 border-amber-200 pb-1'
          : 'text-white hover:text-amber-200 transition'
      }
    >
      {children}
    </NavLink>
  )
}

/** Link de navegación (mobile) con estilo táctil y separación */
function MobileNav({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-base ${
          isActive
            ? 'bg-white/10 text-amber-200'
            : 'text-white/90 hover:bg-white/10 hover:text-amber-200'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
