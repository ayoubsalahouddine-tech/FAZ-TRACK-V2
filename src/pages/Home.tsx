export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome to FAZ-TRACK V2</h2>
        <p className="text-slate-500 mt-1">Your logistics management platform overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Shipments', value: '1,248', color: 'bg-blue-50 text-blue-700' },
          { label: 'Active Drivers', value: '34', color: 'bg-green-50 text-green-700' },
          { label: 'Clients', value: '156', color: 'bg-purple-50 text-purple-700' },
          { label: 'In Transit', value: '89', color: 'bg-orange-50 text-orange-700' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Recent Activity</h3>
        <p className="text-slate-500 text-sm">No recent activity to display.</p>
      </div>
    </div>
  )
}
