export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Overview of your logistics operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Shipment Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Delivered', pct: 68, color: 'bg-green-500' },
              { label: 'In Transit', pct: 22, color: 'bg-blue-500' },
              { label: 'Pending', pct: 10, color: 'bg-orange-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-800">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-semibold text-slate-800">€ 48,320</span>
            </li>
            <li className="flex justify-between">
              <span>Avg. Delivery Time</span>
              <span className="font-semibold text-slate-800">2.4 days</span>
            </li>
            <li className="flex justify-between">
              <span>On-time Rate</span>
              <span className="font-semibold text-green-600">94%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
