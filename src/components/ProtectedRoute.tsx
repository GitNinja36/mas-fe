import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    // Default to /dashboard if no specific path was requested
    const returnPath = location.pathname !== '/' ? location.pathname : '/dashboard'
    return <Navigate to="/login" state={{ from: returnPath }} replace />
  }

  return <>{children}</>
}
