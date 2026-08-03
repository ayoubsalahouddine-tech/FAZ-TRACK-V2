import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Shipments from '../pages/Shipments'
import Tracking from '../pages/Tracking'
import Clients from '../pages/Clients'
import Drivers from '../pages/Drivers'
import Settings from '../pages/Settings'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'shipments', element: <Shipments /> },
      { path: 'tracking', element: <Tracking /> },
      { path: 'clients', element: <Clients /> },
      { path: 'drivers', element: <Drivers /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: '*', element: <NotFoundPage /> },
])

export default router
