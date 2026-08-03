import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import NotFoundPage from '../pages/NotFoundPage'
import Clients from '../pages/Clients'
import Shipments from '../pages/Shipments'
import Tracking from '../pages/Tracking'
import Drivers from '../pages/Drivers'
import Settings from '../pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'clients', element: <Clients /> },
      { path: 'shipments', element: <Shipments /> },
      { path: 'tracking', element: <Tracking /> },
      { path: 'drivers', element: <Drivers /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router
