const shipments = [
  { id: 'SH-001', origin: 'Paris', destination: 'Lyon', status: 'In Transit', date: '2024-07-25' },
  { id: 'SH-002', origin: 'Marseille', destination: 'Nice', status: 'Delivered', date: '2024-07-24' },
  { id: 'SH-003', origin: 'Bordeaux', destination: 'Toulouse', status: 'Pending', date: '2024-07-26' },
]

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Pending: 'bg-orange-100 text-orange-700',
}

export default function Shipments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Shipments</h2>
          <p className="text-slate-500 mt-1">Manage and track all shipments.</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          + New Shipment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['ID', 'Origin', 'Destination', 'Status', 'Date'].map((col) => (
                <th
                  key={col}
                  className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{s.id}</td>
                <td className="px-5 py-3 text-slate-600">{s.origin}</td>
                <td className="px-5 py-3 text-slate-600">{s.destination}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
