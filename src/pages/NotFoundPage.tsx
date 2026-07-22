import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 – Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  )
}
