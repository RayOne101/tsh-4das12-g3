import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DemoPanel } from '@/components/DemoPanel'
import { useAuth } from '@/lib/auth'
import { useReveal } from '@/lib/utils'

export function AppShell() {
  const { session, authEnabled } = useAuth()
  const location = useLocation()
  useReveal([location.pathname, session?.role])

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <SiteFooter />
      {!authEnabled && <DemoPanel />}
    </div>
  )
}
