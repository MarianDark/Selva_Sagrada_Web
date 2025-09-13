import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 nuevo

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const auth = useAuth(); // 👈 estado de auth

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return +(
    <header className="bg-gradient-to-r from-jungle-900 to-earth-800 text-white shadow-md/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* IZQ: Logo + marca (logo pequeño) */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Selva Sagrada"
            className="h-7 w-7 rounded bg-white/90 p-1 shadow-sm group-hover:scale-105 transition"
            loading="eager"
            decoding="async"
          />
          <span className="text-xl font-display font-semibold tracking-tight">
            Selva Sagrada
          </span>
        </Link>

        {/* DER: navegación (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Nav to="/">Inicio</Nav>

          {/* ✅ SOLO con sesión iniciada */}
          {auth.user && <Nav to="/reservas">Reservas</Nav>}

          {/* ✅ Ocultar Registro si hay sesión */}
          {!auth.user && <Nav to="/register">Registro</Nav>}

          {/* Opcional: cambia Login por Mi cuenta si hay sesión */}
          {!auth.user ? (
            <Nav to="/login">Iniciar sesión</Nav>
          ) : (
            <Nav to="/mi-cuenta">Mi cuenta</Nav>
          )}
        </nav>

        {/* Hamburguesa SOLO móvil */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-200"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {!open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span className="sr-only">Abrir menú</span>
        </button>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-gradient-to-b from-jungle-900 to-earth-900/90 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          <MobileNav to="/" onClick={() => setOpen(false)}>
            Inicio
          </MobileNav>
          {auth.user && (
            <MobileNav to="/reservas" onClick={() => setOpen(false)}>
              Reservas
            </MobileNav>
          )}
          {!auth.user && (
            <MobileNav to="/register" onClick={() => setOpen(false)}>
              Registro
            </MobileNav>
          )}
          {!auth.user ? (
            <MobileNav to="/login" onClick={() => setOpen(false)}>
              Iniciar sesión
            </MobileNav>
          ) : (
            <MobileNav to="/mi-cuenta" onClick={() => setOpen(false)}>
              Mi cuenta
            </MobileNav>
          )}
        </div>
      </div>
    </header>
  );
}

/* Link desktop con estado activo elegante */
function Nav({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-1 py-0.5 transition ${
          isActive
            ? "text-amber-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-amber-200 after:rounded-full"
            : "text-white/90 hover:text-amber-200"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

/* Link móvil táctil */
function MobileNav({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-base ${
          isActive
            ? "bg-white/10 text-amber-200"
            : "text-white/90 hover:bg-white/10 hover:text-amber-200"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
