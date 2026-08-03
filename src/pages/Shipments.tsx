import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'

type ShipmentRow = {
  id: string
  tracking_number: string
  client_id: string | null
  sender_name: string
  receiver_name: string
  origin: string
  destination: string
  weight: number | null
  price: number | null
  status: ShipmentStatus | string
  shipping_date: string | null
  delivery_date: string | null
  created_at: string
}

type ClientOption = {
  id: string
  nom: string
}

type ShipmentFormValues = {
  client_id: string
  sender_name: string
  receiver_name: string
  origin: string
  destination: string
  status: ShipmentStatus
  weight: string
  price: string
  shipping_date: string
  delivery_date: string
}

const statusOptions: ShipmentStatus[] = ['Pending', 'In Transit', 'Delivered', 'Cancelled']

const statusColors: Record<ShipmentStatus, string> = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Transit': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const initialFormValues: ShipmentFormValues = {
  client_id: '',
  sender_name: '',
  receiver_name: '',
  origin: '',
  destination: '',
  status: 'Pending',
  weight: '',
  price: '',
  shipping_date: '',
  delivery_date: '',
}

const pageSize = 6

function toOptionalDate(value: string): string | null {
  return value.trim() ? value : null
}

function normalizeStatus(value: string): ShipmentStatus {
  return statusOptions.includes(value as ShipmentStatus) ? (value as ShipmentStatus) : 'Pending'
}

function generateTrackingNumber(): string {
  const datePart = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .replaceAll('-', '')

  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SH-${datePart}-${randomPart}`
}

export default function Shipments() {
  const [shipments, setShipments] = useState<ShipmentRow[]>([])
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ShipmentStatus>('all')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<ShipmentFormValues>(initialFormValues)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    void loadData()
  }, [])

  const clientsById = useMemo(() => {
    return clients.reduce<Record<string, string>>((accumulator, client) => {
      accumulator[client.id] = client.nom
      return accumulator
    }, {})
  }, [clients])

  const filteredShipments = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    return shipments.filter((shipment) => {
      const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter

      if (!normalizedTerm) {
        return matchesStatus
      }

      const clientName = clientsById[shipment.client_id ?? ''] ?? ''
      const searchableText = [
        shipment.tracking_number,
        clientName,
        shipment.sender_name,
        shipment.receiver_name,
        shipment.origin,
        shipment.destination,
        shipment.status,
      ]
        .join(' ')
        .toLowerCase()

      return matchesStatus && searchableText.includes(normalizedTerm)
    })
  }, [clientsById, searchTerm, shipments, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / pageSize))

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredShipments.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredShipments])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  async function loadData() {
    setLoading(true)
    setErrorMessage(null)

    const [shipmentsResponse, clientsResponse] = await Promise.all([
      supabase
        .from('shipments')
        .select('id, tracking_number, client_id, sender_name, receiver_name, origin, destination, weight, price, status, shipping_date, delivery_date, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('clients').select('id, nom').order('nom', { ascending: true }),
    ])

    if (shipmentsResponse.error) {
      setErrorMessage(`Erreur de chargement des expeditions : ${shipmentsResponse.error.message}`)
      setShipments([])
    } else {
      setShipments((shipmentsResponse.data ?? []).map((shipment) => ({
        ...shipment,
        status: normalizeStatus(shipment.status),
      })))
    }

    if (clientsResponse.error) {
      setErrorMessage((previous) => previous ?? `Erreur de chargement des clients : ${clientsResponse.error.message}`)
      setClients([])
    } else {
      setClients(clientsResponse.data ?? [])
    }

    setLoading(false)
  }

  function resetForm() {
    setFormValues(initialFormValues)
    setEditingShipmentId(null)
  }

  function startEdit(shipment: ShipmentRow) {
    setEditingShipmentId(shipment.id)
    setFormValues({
      client_id: shipment.client_id ?? '',
      sender_name: shipment.sender_name ?? '',
      receiver_name: shipment.receiver_name ?? '',
      origin: shipment.origin ?? '',
      destination: shipment.destination ?? '',
      status: normalizeStatus(shipment.status),
      weight: shipment.weight?.toString() ?? '',
      price: shipment.price?.toString() ?? '',
      shipping_date: shipment.shipping_date ?? '',
      delivery_date: shipment.delivery_date ?? '',
    })
    setErrorMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const clientId = formValues.client_id.trim()
    const senderName = formValues.sender_name.trim()
    const receiverName = formValues.receiver_name.trim()
    const origin = formValues.origin.trim()
    const destination = formValues.destination.trim()
    const shippingDate = formValues.shipping_date.trim()
    const weight = Number(formValues.weight)
    const price = Number(formValues.price)

    if (!clientId || !senderName || !receiverName || !origin || !destination || !shippingDate) {
      setErrorMessage('Les champs client, expéditeur, destinataire, origine, destination et date d expedition sont obligatoires.')
      return
    }

    if (!Number.isFinite(weight) || weight < 0 || !Number.isFinite(price) || price < 0) {
      setErrorMessage('Le poids et le prix doivent être des nombres positifs.')
      return
    }

    const payload = {
      client_id: clientId,
      sender_name: senderName,
      receiver_name: receiverName,
      origin,
      destination,
      weight,
      price,
      status: formValues.status,
      shipping_date: shippingDate,
      delivery_date: toOptionalDate(formValues.delivery_date),
    }

    setSubmitting(true)

    if (editingShipmentId) {
      const { error } = await supabase.from('shipments').update(payload).eq('id', editingShipmentId)

      if (error) {
        setErrorMessage(`Erreur lors de la modification : ${error.message}`)
        setSubmitting(false)
        return
      }
    } else {
      const { error } = await supabase.from('shipments').insert({
        ...payload,
        tracking_number: generateTrackingNumber(),
      })

      if (error) {
        setErrorMessage(`Erreur lors de l'ajout : ${error.message}`)
        setSubmitting(false)
        return
      }
    }

    resetForm()
    await loadData()
    setSubmitting(false)
  }

  async function handleDelete(shipment: ShipmentRow) {
    const confirmed = window.confirm(`Supprimer l expedition ${shipment.tracking_number} ?`)

    if (!confirmed) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    const { error } = await supabase.from('shipments').delete().eq('id', shipment.id)

    if (error) {
      setErrorMessage(`Erreur lors de la suppression : ${error.message}`)
      setSubmitting(false)
      return
    }

    await loadData()
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Shipments</h2>
        <p className="text-slate-500">Gestion des expeditions connectee a Supabase.</p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {editingShipmentId ? 'Modifier une expedition' : 'Ajouter une expedition'}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formValues.client_id}
            onChange={(event) => setFormValues((previous) => ({ ...previous, client_id: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selectionner un client *</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nom}
              </option>
            ))}
          </select>

          <select
            value={formValues.status}
            onChange={(event) => setFormValues((previous) => ({ ...previous, status: event.target.value as ShipmentStatus }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Expediteur *"
            value={formValues.sender_name}
            onChange={(event) => setFormValues((previous) => ({ ...previous, sender_name: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Destinataire *"
            value={formValues.receiver_name}
            onChange={(event) => setFormValues((previous) => ({ ...previous, receiver_name: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Origine *"
            value={formValues.origin}
            onChange={(event) => setFormValues((previous) => ({ ...previous, origin: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Destination *"
            value={formValues.destination}
            onChange={(event) => setFormValues((previous) => ({ ...previous, destination: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Poids (kg) *"
            value={formValues.weight}
            onChange={(event) => setFormValues((previous) => ({ ...previous, weight: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Prix *"
            value={formValues.price}
            onChange={(event) => setFormValues((previous) => ({ ...previous, price: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            value={formValues.shipping_date}
            onChange={(event) => setFormValues((previous) => ({ ...previous, shipping_date: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            value={formValues.delivery_date}
            onChange={(event) => setFormValues((previous) => ({ ...previous, delivery_date: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'En cours...' : editingShipmentId ? 'Enregistrer les modifications' : 'Ajouter expedition'}
            </button>

            {editingShipmentId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Rechercher par tracking, client ou statut"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
            setCurrentPage(1)
          }}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as 'all' | ShipmentStatus)
            setCurrentPage(1)
          }}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Tous les statuts</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-600 animate-pulse">Chargement des expeditions...</div>
      ) : shipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-500">Aucune expedition n'existe pour le moment.</div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-500">Aucune expedition ne correspond aux filtres.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedShipments.map((shipment) => (
              <article key={shipment.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800">{shipment.tracking_number}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[normalizeStatus(shipment.status)]}`}>
                    {normalizeStatus(shipment.status)}
                  </span>
                </div>

                <p className="text-sm text-slate-700">Client: {clientsById[shipment.client_id ?? ''] ?? 'Client inconnu'}</p>
                <p className="text-sm text-slate-700">{shipment.origin} -&gt; {shipment.destination}</p>
                <p className="text-sm text-slate-600">Expediteur: {shipment.sender_name}</p>
                <p className="text-sm text-slate-600">Destinataire: {shipment.receiver_name}</p>
                <p className="text-sm text-slate-600">Poids: {shipment.weight ?? 'N/A'} kg</p>
                <p className="text-sm text-slate-600">Prix: {shipment.price ?? 'N/A'}</p>
                <p className="text-sm text-slate-600">Expedition: {shipment.shipping_date ?? 'N/A'}</p>
                <p className="text-sm text-slate-600">Livraison: {shipment.delivery_date || 'Non planifiee'}</p>

                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(shipment)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(shipment)}
                    disabled={submitting}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-600">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                Precedent
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
