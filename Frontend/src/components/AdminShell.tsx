import { Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'

/**
 * Coquille de la console d'administration : navigation et identite propres,
 * aucun lien visuel vers l'application etudiante (seulement un retour explicite).
 */
export function AdminShell() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/connexion')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f1ec]">
      <header className="border-b border-white/10 bg-ink text-cream">
        <div className="mx-auto flex w-full max-w-[92rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-clay text-ink">
              <ShieldCheck className="size-4.5" />
            </span>
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/45">
                TSH
              </p>
              <p className="text-[14px] font-semibold">Console d’administration</p>
            </div>
            <span className="ml-2 hidden rounded-full bg-white/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cream/60 sm:inline">
              Accès restreint
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-white/[0.07] py-1 pl-2 pr-3 sm:flex">
              <img src={session?.image} alt="" className="size-6 rounded-full object-cover" />
              <span className="text-[11.5px] font-medium text-cream/85">{session?.name}</span>
            </span>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11.5px] font-medium text-cream/75 transition hover:border-white/35 hover:text-cream"
            >
              Site public
              <ExternalLink className="size-3" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium text-rust/90 transition hover:bg-rust/15 hover:text-rust"
            >
              <LogOut className="size-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-ink/[0.07] px-4 py-4 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-[92rem] text-[10px] text-ink-soft">
          Console d’administration TSH · session ROLE_ADMIN · audit des actions conservé
        </p>
      </footer>
    </div>
  )
}
