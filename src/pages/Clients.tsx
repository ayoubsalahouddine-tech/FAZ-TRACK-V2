import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Client = {
  id: number | string
  nom: string | null
  telephone: string | null
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    void loadClients()
  }, [])

  async function loadClients() {
    const { data, error } = await supabase.from('clients').select('*')

    if (error) {
      console.error(error)
    } else {
      setClients((data as Client[]) || [])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
          <p className="text-slate-500 mt-1">Liste des clients enregistres.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="font-semibold">{client.nom}</p>
            <p>{client.telephone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
