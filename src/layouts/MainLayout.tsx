import { Outlet, Link } from 'react-router'

export default function MainLayout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/dashboard">Tableau de bord</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
