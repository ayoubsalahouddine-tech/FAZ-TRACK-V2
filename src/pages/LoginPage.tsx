export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form className="flex flex-col gap-4">
        <label htmlFor="email" className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            Adresse e-mail
          </span>
          <input
            id="email"
            type="email"
            placeholder="exemple@domaine.com"
            className="border rounded px-3 py-2"
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            Mot de passe
          </span>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="border rounded px-3 py-2"
          />
        </label>
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
