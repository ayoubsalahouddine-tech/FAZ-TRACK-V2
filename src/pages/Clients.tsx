import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Client = {
  id: string
  nom: string
  telephone: string
  email: string | null
  adresse: string | null
  ville: string | null
  pays: string | null
  created_at: string
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
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<ClientFormValues>(initialFormValues)

  useEffect(() => {
    void loadClients()
  }, [])

  const filteredClients = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    if (!normalizedTerm) {
      return clients
    }

    return clients.filter((client) => {
      return (
        client.nom.toLowerCase().includes(normalizedTerm) ||
        client.telephone.toLowerCase().includes(normalizedTerm)
      )
    })
  }, [clients, searchTerm])

  async function loadClients() {
    setLoading(true)
    setErrorMessage(null)

    const { data, error } = await supabase
      .from('clients')
      .select('id, nom, telephone, email, adresse, ville, pays, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage(`Erreur de chargement des clients : ${error.message}`)
      setClients([])
      setLoading(false)
      return
    }

    setClients(data ?? [])
    setLoading(false)
  }

  function resetForm() {
    setFormValues(initialFormValues)
    setEditingClientId(null)
  }

  function startEdit(client: Client) {
    setEditingClientId(client.id)
    setFormValues({
      nom: client.nom,
      telephone: client.telephone,
      email: client.email ?? '',
      adresse: client.adresse ?? '',
      ville: client.ville ?? '',
      pays: client.pays ?? '',
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const nom = formValues.nom.trim()
    const telephone = formValues.telephone.trim()

    if (!nom || !telephone) {
      setErrorMessage('Le nom et le telephone sont obligatoires.')
      return
    }

    const payload = {
      nom,
      telephone,
      email: formValues.email.trim() || null,
      adresse: formValues.adresse.trim() || null,
      ville: formValues.ville.trim() || null,
      pays: formValues.pays.trim() || null,
    }

    setSubmitting(true)

    if (editingClientId) {
      const { error } = await supabase.from('clients').update(payload).eq('id', editingClientId)

      if (error) {
        setErrorMessage(`Erreur lors de la modification : ${error.message}`)
        setSubmitting(false)
        return
      }
    } else {
      const { error } = await supabase.from('clients').insert(payload)

      if (error) {
        setErrorMessage(`Erreur lors de l'ajout : ${error.message}`)
        setSubmitting(false)
        return
      }
    }

    resetForm()
    await loadClients()
    setSubmitting(false)
  }

  async function handleDelete(client: Client) {
    const confirmed = window.confirm(`Supprimer le client "${client.nom}" ?`)

    if (!confirmed) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    const { error } = await supabase.from('clients').delete().eq('id', client.id)

    if (error) {
      setErrorMessage(`Erreur lors de la suppression : ${error.message}`)
      setSubmitting(false)
      return
    }

    await loadClients()
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
        <p className="text-slate-500">Liste des clients enregistres et gestion complete du repertoire.</p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{editingClientId ? 'Modifier un client' : 'Ajouter un client'}</h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom *"
            value={formValues.nom}
            onChange={(event) => setFormValues((previous) => ({ ...previous, nom: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Telephone *"
            value={formValues.telephone}
            onChange={(event) => setFormValues((previous) => ({ ...previous, telephone: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={formValues.email}
            onChange={(event) => setFormValues((previous) => ({ ...previous, email: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Adresse"
            value={formValues.adresse}
            onChange={(event) => setFormValues((previous) => ({ ...previous, adresse: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Ville"
            value={formValues.ville}
            onChange={(event) => setFormValues((previous) => ({ ...previous, ville: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Pays"
            value={formValues.pays}
            onChange={(event) => setFormValues((previous) => ({ ...previous, pays: event.target.value }))}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'En cours...' : editingClientId ? 'Enregistrer les modifications' : 'Ajouter le client'}
            </button>

            {editingClientId ? (
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

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <input
          type="text"
          placeholder="Rechercher par nom ou telephone"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-600 animate-pulse">Chargement des clients...</div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-500">Aucun client n'existe pour le moment.</div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-500">Aucun client ne correspond a votre recherche.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <article key={client.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <h3 className="font-bold text-lg text-slate-800">{client.nom}</h3>
              <p className="text-sm text-slate-700">{client.telephone}</p>
              <p className="text-sm text-slate-600">{client.email || 'Email non renseigne'}</p>
              <p className="text-sm text-slate-600">{client.adresse || 'Adresse non renseignee'}</p>
              <p className="text-sm text-slate-600">
                {[client.ville, client.pays].filter(Boolean).join(', ') || 'Ville/Pays non renseignes'}
              </p>

              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(client)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(client)}
                  disabled={submitting}
                  className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}