import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main>
      <h1>404 – Page introuvable</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </main>
  )
}
