import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'
type ShipmentRow = Record<string, string | number | null | undefined>

type ShipmentData = {
  trackingNumber: string
  clientName: string
  sender: string
  recipient: string
  origin: string
  destination: string
  weight: string
  price: string
  shippingDate: string
  deliveryDate: string
  status: ShipmentStatus
}

const statusBadgeClass: Record<ShipmentStatus, string> = {
  Pending: 'bg-slate-100 text-slate-700',
  'In Transit': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const timelineSteps = ['Colis enregistre', 'Pris en charge', 'En transit', 'Arrive a destination', 'Livre']

const reachedStepByStatus: Record<ShipmentStatus, number> = {
  Pending: 0,
  'In Transit': 2,
  Delivered: 4,
  Cancelled: 0,
}

const formatDate = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const parsedDate = new Date(String(value))
  if (Number.isNaN(parsedDate.getTime())) {
    return String(value)
  }

  return parsedDate.toLocaleDateString('fr-FR')
}

const pickString = (row: ShipmentRow, keys: string[]): string => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim() !== '') {
      return value
    }

    if (typeof value === 'number') {
      return String(value)
    }
  }

  return '-'
}

const normalizeStatus = (rawStatus: string): ShipmentStatus => {
  const normalized = rawStatus.trim().toLowerCase()

  if (normalized === 'in transit' || normalized === 'in_transit') {
    return 'In Transit'
  }

  if (normalized === 'delivered') {
    return 'Delivered'
  }

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'Cancelled'
  }

  return 'Pending'
}

const mapShipment = (row: ShipmentRow): ShipmentData => {
  const status = normalizeStatus(pickString(row, ['status']))

  return {
    trackingNumber: pickString(row, ['tracking_number']),
    clientName: pickString(row, ['client_name', 'client_nom', 'client']),
    sender: pickString(row, ['sender_name', 'sender', 'shipper', 'expediteur']),
    recipient: pickString(row, ['receiver_name', 'recipient', 'consignee', 'destinataire']),
    origin: pickString(row, ['origin', 'origine']),
    destination: pickString(row, ['destination']),
    weight: pickString(row, ['weight', 'poids']),
    price: pickString(row, ['price', 'prix']),
    shippingDate: formatDate(row.shipping_date ?? row.date_expedition),
    deliveryDate: formatDate(row.delivery_date ?? row.date_livraison),
    status,
  }
}

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [queryError, setQueryError] = useState<string | null>(null)

  const reachedStep = useMemo(() => (shipment ? reachedStepByStatus[shipment.status] : -1), [shipment])

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedTracking = trackingNumber.trim()
    if (!normalizedTracking) {
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    setQueryError(null)

    const { data, error } = await supabase.from('shipments').select('*').eq('tracking_number', normalizedTracking).limit(1)

    setIsLoading(false)

    if (error) {
      setShipment(null)
      setQueryError("Une erreur s'est produite lors de la recherche.")
      return
    }

    if (!data || data.length === 0) {
      setShipment(null)
      return
    }

    setShipment(mapShipment(data[0] as ShipmentRow))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tracking</h2>
        <p className="text-slate-500 mt-1">Suivez vos expeditions en temps reel.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-slate-200 p-6">
        <label htmlFor="tracking_number" className="block text-sm font-medium text-slate-700 mb-2">
          Numero de suivi
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="tracking_number"
            type="text"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Ex: SH-001"
            autoComplete="off"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || trackingNumber.trim() === ''}
            className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Recherche...
              </>
            ) : (
              'Rechercher'
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Astuce: appuyez sur Entree pour lancer rapidement la recherche.</p>
      </form>

      {queryError ? (
        <div role="status" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {queryError}
        </div>
      ) : null}

      {hasSearched && !isLoading && !shipment && !queryError ? (
        <div role="status" className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-600">
          Aucune expedition trouvee avec ce numero.
        </div>
      ) : null}

      {shipment ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <h3 className="text-lg font-semibold text-slate-800">Details de l&apos;expedition</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusBadgeClass[shipment.status]}`}>
                {shipment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <DetailItem label="Numero de suivi" value={shipment.trackingNumber} />
              <DetailItem label="Nom du client" value={shipment.clientName} />
              <DetailItem label="Expediteur" value={shipment.sender} />
              <DetailItem label="Destinataire" value={shipment.recipient} />
              <DetailItem label="Origine" value={shipment.origin} />
              <DetailItem label="Destination" value={shipment.destination} />
              <DetailItem label="Poids" value={shipment.weight} />
              <DetailItem label="Prix" value={shipment.price} />
              <DetailItem label="Date d'expedition" value={shipment.shippingDate} />
              <DetailItem label="Date de livraison" value={shipment.deliveryDate} />
              <DetailItem label="Statut actuel" value={shipment.status} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const isReached = index <= reachedStep

                return (
                  <div key={step} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${isReached ? 'bg-purple-600' : 'bg-slate-300'}`} />
                    <p className={`text-sm font-medium ${isReached ? 'text-slate-800' : 'text-slate-400'}`}>{step}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="font-medium text-slate-800 break-words">{value}</p>
    </div>
  )
}
