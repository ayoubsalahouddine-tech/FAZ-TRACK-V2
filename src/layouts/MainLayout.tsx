import { Outlet, NavLink } from 'react-router'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6">
        <span className="font-bold text-lg">FAZ-TRACK</span>
        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'
            }
          >
            Connexion
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-300'
            }
          >
            Tableau de bord
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
