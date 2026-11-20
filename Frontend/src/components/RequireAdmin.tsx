import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

/** Console admin : session obligatoire ET role admin. Redirige vers la connexion admin. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/admin/connexion?returnTo=${returnTo}`} replace />
  }

  if (session?.role !== 'admin') {
    return <Navigate to="/admin/connexion?erreur=role" replace />
  }

  return <>{children}</>
}
