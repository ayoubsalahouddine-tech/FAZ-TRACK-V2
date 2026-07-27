export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue="admin@faztrack.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Preferences</h3>
          <div className="space-y-3">
            {['Email notifications', 'SMS alerts', 'Weekly report'].map((pref) => (
              <label key={pref} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-purple-600 w-4 h-4" />
                <span className="text-sm text-slate-700">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 flex justify-end">
          <button
            type="button"
            className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
