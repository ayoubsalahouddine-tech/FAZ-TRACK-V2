export default function Tracking() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tracking</h2>
        <p className="text-slate-500 mt-1">Real-time shipment tracking.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label htmlFor="track-input" className="block text-sm font-medium text-slate-700 mb-2">
          Enter Tracking ID
        </label>
        <div className="flex gap-3">
          <input
            id="track-input"
            type="text"
            placeholder="e.g. SH-001"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Track
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Tracking Timeline</h3>
        <div className="space-y-4">
          {[
            { label: 'Order Placed', time: '2024-07-25 08:00', done: true },
            { label: 'Picked Up', time: '2024-07-25 10:30', done: true },
            { label: 'In Transit', time: '2024-07-25 14:00', done: true },
            { label: 'Out for Delivery', time: '2024-07-26 09:00', done: false },
            { label: 'Delivered', time: '—', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full mt-1 shrink-0 ${step.done ? 'bg-purple-600' : 'bg-slate-300'}`}
              />
              <div>
                <p className={`text-sm font-medium ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
