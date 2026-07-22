import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
