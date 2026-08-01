import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*");

    if (error) {
      console.error(error);
    } else {
      setClients(data || []);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
          <p className="text-slate-500 mt-1">
            Liste des clients enregistrés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <p className="font-semibold">{c.nom}</p>
            <p>{c.telephone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}