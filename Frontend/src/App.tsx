import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { PublicLayout } from '@/components/Layouts'
import { AppShell } from '@/components/AppShell'
import { RequireAuth } from '@/components/RequireAuth'
import { AdminShell } from '@/components/AdminShell'
import { RequireAdmin } from '@/components/RequireAdmin'
import { ScrollToTop } from '@/components/Layouts'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/data'
import { HousingSearch } from '@/pages/HousingSearch'
import { HousingDetail } from '@/pages/HousingDetail'
import { Colocation } from '@/pages/Colocation'
import { Marketplace } from '@/pages/Marketplace'
import { Transport } from '@/pages/Transport'
import { HowItWorks } from '@/pages/HowItWorks'
import { Login } from '@/pages/Login'
import { AuthCallback } from '@/pages/AuthCallback'
import { SessionExpired } from '@/pages/SessionExpired'
import { Onboarding } from '@/pages/Onboarding'
import { NotFound } from '@/pages/NotFound'
import { Messages } from '@/pages/app/Messages'
import { MyListings } from '@/pages/app/MyListings'
import { ListingWizard } from '@/pages/app/ListingWizard'
import { Contracts } from '@/pages/app/Contracts'
import { Profile } from '@/pages/app/Profile'
import { Admin } from '@/pages/admin/Admin'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminCallback } from '@/pages/admin/AdminCallback'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <DemoAutoLogin />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HousingSearch />} />
          <Route path="/logements" element={<HousingSearch />} />
          <Route path="/logements/:id" element={<HousingDetail />} />
          <Route path="/colocation" element={<Colocation />} />
          <Route path="/meubles" element={<Marketplace />} />
          <Route path="/demenagement" element={<Transport />} />
          <Route path="/comment-ca-marche" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/connexion" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/session-expiree" element={<SessionExpired />} />
        <Route path="/bienvenue" element={<Onboarding />} />

        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/logements" replace />} />
          <Route path="favoris" element={<Navigate to="/logements" replace />} />
          <Route path="messages" element={<Messages />} />
          <Route path="annonces" element={<MyListings />} />
          <Route path="annonces/nouvelle" element={<ListingWizard />} />
          <Route path="contrats" element={<Contracts />} />
          <Route path="profil" element={<Profile />} />
        </Route>

        {/* Console d'administration : interface et pages separees de l'app etudiante. */}
        <Route path="/admin/connexion" element={<AdminLogin />} />
        <Route path="/admin/callback" element={<AdminCallback />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminShell />
            </RequireAdmin>
          }
        >
          <Route index element={<Admin />} />
        </Route>
      </Routes>
    </>
  )
}

/**
 * Dev-only shortcut used to preview role-specific screens without clicking
 * through the mock login: /app?demo=student|owner|admin
 */
function DemoAutoLogin() {
  const [params] = useSearchParams()
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const demo = params.get('demo') as Role | null

  useEffect(() => {
    if (!import.meta.env.DEV || !demo) return
    if (!session) login(demo)
    const next = new URLSearchParams(params)
    next.delete('demo')
    navigate(
      { pathname: location.pathname, search: next.toString() },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo])

  return null
}
