export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Adresse e-mail"
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}
