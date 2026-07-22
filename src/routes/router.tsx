import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import Accueil from '../pages/Accueil'
import Connexion from '../pages/Connexion'
import TableauDeBord from '../pages/TableauDeBord'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Accueil },
      { path: 'connexion', Component: Connexion },
      { path: 'tableau-de-bord', Component: TableauDeBord },
      { path: '*', Component: NotFound },
    ],
  },
])

export default router
