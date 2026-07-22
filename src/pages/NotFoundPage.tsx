import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 – Page introuvable</h1>
      <p>La page que vous recherchez n&apos;existe pas.</p>
      <Link to="/">Retour à l&apos;accueil</Link>
    </main>
  )
}
