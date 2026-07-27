import { Link } from 'react-router'

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-800">FAZ-TRACK V2</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Notifications"
        >
          🔔
        </button>

        <Link
          to="/settings"
          className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
            FT
          </span>
          <span className="hidden sm:inline font-medium">Admin</span>
        </Link>
      </div>
    </header>
  )
}
