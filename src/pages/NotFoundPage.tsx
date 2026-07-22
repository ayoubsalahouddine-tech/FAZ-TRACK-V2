import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-500">Page introuvable</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
