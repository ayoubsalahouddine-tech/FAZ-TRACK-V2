const drivers = [
  { id: 'D-001', name: 'Jean Dupont', vehicle: 'Renault Master', plate: 'AB-123-CD', available: true },
  { id: 'D-002', name: 'Marie Leroy', vehicle: 'Peugeot Boxer', plate: 'EF-456-GH', available: false },
  { id: 'D-003', name: 'Paul Martin', vehicle: 'Ford Transit', plate: 'IJ-789-KL', available: true },
]

export default function Drivers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Drivers</h2>
          <p className="text-slate-500 mt-1">Manage your driver fleet.</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add Driver
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['ID', 'Name', 'Vehicle', 'Plate', 'Status'].map((col) => (
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
            {drivers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{d.id}</td>
                <td className="px-5 py-3 text-slate-700">{d.name}</td>
                <td className="px-5 py-3 text-slate-600">{d.vehicle}</td>
                <td className="px-5 py-3 text-slate-600">{d.plate}</td>
                <td className="px-5 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      d.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {d.available ? 'Available' : 'On Route'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
