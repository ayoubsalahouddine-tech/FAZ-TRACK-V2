import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Client = {
  id: string | number
  nom: string | null
  telephone: string | null
  email: string | null
  adresse: string | null
  ville: string | null
  pays: string | null
}

type ClientFormValues = {
  nom: string
  telephone: string
  email: string
  adresse: string
  ville: string
  pays: string
}

const initialFormValues: ClientFormValues = {
  nom: '',
  telephone: '',
  email: '',
  adresse: '',
  ville: '',
  pays: '',
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<ClientFormValues>(initialFormValues)

  useEffect(() => {
    void loadClients()
  }, [])

  async function loadClients() {
    setLoading(true)
    const { data, error } = await supabase.from('clients').select('*').order('nom', { ascending: true })

    if (error) {
      setErrorMessage(`Erreur de chargement des clients : ${error.message}`)
      setClients([])
    } else {
      setClients((data as Client[]) ?? [])
    }

    setLoading(false)
  }

  function openModal() {
    setSuccessMessage(null)
    setErrorMessage(null)
    setFormValues(initialFormValues)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSubmitting(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const payload = {
      nom: formValues.nom.trim(),
      telephone: formValues.telephone.trim(),
      email: formValues.email.trim(),
      adresse: formValues.adresse.trim(),
      ville: formValues.ville.trim(),
      pays: formValues.pays.trim(),
    }

    if (!payload.nom || !payload.telephone || !payload.email || !payload.adresse || !payload.ville || !payload.pays) {
      setErrorMessage('Tous les champs sont obligatoires.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('clients').insert(payload)

    if (error) {
      setErrorMessage(`Erreur lors de l'ajout : ${error.message}`)
      setSubmitting(false)
      return
    }

    await loadClients()
    setSubmitting(false)
    setIsModalOpen(false)
    setFormValues(initialFormValues)
    setSuccessMessage('Client ajouté avec succès.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
          <p className="mt-1 text-slate-500">Liste et gestion des clients connectées à Supabase.</p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          + Ajouter un client
        </button>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Chargement des clients...</div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">Aucun client enregistré.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <article key={client.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">{client.nom}</h3>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Téléphone :</span> {client.telephone || '-'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Email :</span> {client.email || '-'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Adresse :</span> {client.adresse || '-'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Ville :</span> {client.ville || '-'}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Pays :</span> {client.pays || '-'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Ajouter un client</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nom"
                value={formValues.nom}
                onChange={(event) => setFormValues((previous) => ({ ...previous, nom: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:col-span-2"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={formValues.telephone}
                onChange={(event) => setFormValues((previous) => ({ ...previous, telephone: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formValues.email}
                onChange={(event) => setFormValues((previous) => ({ ...previous, email: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={formValues.adresse}
                onChange={(event) => setFormValues((previous) => ({ ...previous, adresse: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Ville"
                value={formValues.ville}
                onChange={(event) => setFormValues((previous) => ({ ...previous, ville: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Pays"
                value={formValues.pays}
                onChange={(event) => setFormValues((previous) => ({ ...previous, pays: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="mt-2 flex items-center justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
