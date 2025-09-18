import { Outlet, NavLink } from 'react-router-dom'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function DashboardLayout() {
  const { logout, loggingOut } = useAuth()

  return (
    <div className="flex min-h-[70vh]">
      <aside className="w-64 bg-emerald-700 text-white flex flex-col">
        <div className="p-6 text-center border-b border-emerald-600">
          <h2 className="text-xl font-bold">Panel</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink
            to="/mi-cuenta"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive ? 'bg-emerald-600 font-semibold' : 'hover:bg-emerald-600/60'
              }`
            }
          >
            <User className="w-4 h-4" /> Mi cuenta
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive ? 'bg-emerald-600 font-semibold' : 'hover:bg-emerald-600/60'
              }`
            }
          >
            <Settings className="w-4 h-4" /> Administración
          </NavLink>
        </nav>

        <div className="p-4 border-t border-emerald-600">
          <button
            onClick={logout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-emerald-600/60 disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" /> {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-white">
        <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 bg-zinc-50">
          <h1 className="text-lg font-semibold text-zinc-800">Dashboard</h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
