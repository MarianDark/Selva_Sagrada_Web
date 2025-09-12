import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
	<header className="bg-jungle-900 text-white shadow-md sticky top-0 z-50">
	  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
		<div className="text-2xl font-bold tracking-tight">Selva Sagrada</div>
		<button
		  className="md:hidden p-2 rounded-lg hover:bg-jungle-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
		  aria-controls="mobile-menu"
		  aria-expanded={open}
		  onClick={() => setOpen((v) => !v)}
		>
		  {!open ? (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
		  ) : (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
		  )}
		</button>
		<nav className="hidden md:flex gap-6 text-sm font-medium">
		  <Nav to="/">Inicio</Nav>
		  <Nav to="/reservas">Reservas</Nav>
		  <Nav to="/register">Registro</Nav>
		  <Nav to="/login">Iniciar sesión</Nav>
		</nav>
	  </div>
	  <div id="mobile-menu" className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-gradient-to-b from-jungle-800 to-earth-900/90 ${open ? 'max-h-96' : 'max-h-0'}`}>
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


function Nav({ to, children }) {
return (
<NavLink to={to} className={({ isActive }) => (isActive ? 'text-amber-200 border-b-2 border-amber-200 pb-1' : 'text-white hover:text-amber-200 transition')}>
{children}
</NavLink>
)
}


function MobileNav({ to, children, onClick }) {
return (
<NavLink to={to} onClick={onClick} className={({ isActive }) => `block rounded-lg px-3 py-2 text-base ${isActive ? 'bg-white/10 text-amber-200' : 'text-white/90 hover:bg-white/10 hover:text-amber-200'}`}>
{children}
</NavLink>
)
}
