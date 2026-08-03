import { FormEvent, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type Shipment = {
  id: string
  tracking_number: string
  sender_name: string
  receiver_name: string
  origin: string
  destination: string
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'
  shipping_date: string
  delivery_date: string | null
  created_at: string
}

type TimelineStep = {
  label: string
  time: string
  done: boolean
}

const formatDate = (value: string | null) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString()
}

const buildTimeline = (shipment: Shipment): TimelineStep[] => {
  const isPending = shipment.status === 'Pending'
  const isInTransit = shipment.status === 'In Transit'
  const isDelivered = shipment.status === 'Delivered'
  const isCancelled = shipment.status === 'Cancelled'

  return [
    {
      label: 'Shipment Created',
      time: formatDate(shipment.created_at),
      done: true,
    },
    {
      label: 'Picked Up',
      time: formatDate(shipment.shipping_date),
      done: !isCancelled,
    },
    {
      label: 'In Transit',
      time: isPending ? 'Pending status update' : formatDate(shipment.shipping_date),
      done: isInTransit || isDelivered,
    },
    {
      label: 'Delivered',
      time: isDelivered ? formatDate(shipment.delivery_date) : isCancelled ? 'Shipment cancelled' : 'Pending delivery',
      done: isDelivered,
    },
  ]
}

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const timeline = useMemo(() => {
    if (!shipment) return []
    return buildTimeline(shipment)
  }, [shipment])

  const handleTrack = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedTracking = trackingNumber.trim()
    if (!normalizedTracking) {
      setShipment(null)
      setError('Please enter a tracking number.')
      return
    }

    setIsLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('shipments')
      .select(
        'id, tracking_number, sender_name, receiver_name, origin, destination, status, shipping_date, delivery_date, created_at'
      )
      .eq('tracking_number', normalizedTracking)
      .maybeSingle()

    setIsLoading(false)

    if (queryError) {
      setShipment(null)
      setError('Unable to load shipment data right now. Please try again.')
      return
    }

    if (!data) {
      setShipment(null)
      setError('No shipment found for this tracking number.')
      return
    }

    setShipment(data as Shipment)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tracking</h2>
        <p className="text-slate-500 mt-1">Real-time shipment tracking.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleTrack} className="space-y-3">
          <label htmlFor="track-input" className="block text-sm font-medium text-slate-700 mb-2">
            Enter Tracking ID
          </label>
          <div className="flex gap-3">
            <input
              id="track-input"
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="e.g. SH-001"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </form>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Tracking Timeline</h3>

        {!shipment ? (
          <p className="text-sm text-slate-500">Search a tracking number to view shipment details.</p>
        ) : (
          <>
            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Tracking:</span> {shipment.tracking_number}
              </p>
              <p>
                <span className="font-semibold">Route:</span> {shipment.origin} → {shipment.destination}
              </p>
              <p>
                <span className="font-semibold">From:</span> {shipment.sender_name} |{' '}
                <span className="font-semibold">To:</span> {shipment.receiver_name}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {shipment.status}
              </p>
            </div>

            <div className="space-y-4">
              {timeline.map((step) => (
                <div key={step.label} className="flex items-start gap-3">
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
          </>
        )}
      </div>
    </div>
  )
}
