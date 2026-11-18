import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DemoPanel } from '@/components/DemoPanel'
import { useReveal } from '@/lib/utils'

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function PublicLayout() {
  const { pathname } = useLocation()
  useReveal([pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <DemoPanel />
    </div>
  )
}

export function AppLayout() {
  return <Outlet />
}
