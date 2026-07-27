import { NavLink } from 'react-router'

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/shipments', label: 'Shipments', icon: '📦' },
  { to: '/tracking', label: 'Tracking', icon: '📍' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/drivers', label: 'Drivers', icon: '🚗' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide text-white">
          FAZ-TRACK <span className="text-purple-400">V2</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Logistics Management</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-500">
        © 2024 FAZ-TRACK V2
      </div>
    </aside>
  )
}
