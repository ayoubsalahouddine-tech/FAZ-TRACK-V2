const clients = [
  { id: 'C-001', name: 'Acme Corp', email: 'contact@acme.com', shipments: 42, status: 'Active' },
  { id: 'C-002', name: 'Global Trade', email: 'info@globaltrade.fr', shipments: 27, status: 'Active' },
  { id: 'C-003', name: 'EuroLogistics', email: 'ops@eurologistics.eu', shipments: 15, status: 'Inactive' },
]

export default function Clients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
          <p className="text-slate-500 mt-1">Manage your client accounts.</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                {c.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">{c.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{c.shipments} shipments</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
