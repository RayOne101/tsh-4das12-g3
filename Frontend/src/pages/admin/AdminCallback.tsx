import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { consumeReturnTo } from '@/lib/oidc'

/**
 * Retour de Keycloak pour la console admin (client `tsh-admin-web`).
 * Le compte doit porter le role realm ROLE_ADMIN, sinon la session est refusee.
 */
export function AdminCallback() {
  const navigate = useNavigate()
  const { finishKeycloakLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const returnTo = consumeReturnTo('/admin')
    finishKeycloakLogin('admin', { requireAdmin: true })
      .then(() => navigate(returnTo, { replace: true }))
      .catch(() =>
        setError("Ce compte n'a pas le rôle administrateur (ROLE_ADMIN)."),
      )
  }, [finishKeycloakLogin, navigate])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-5 py-10 text-cream">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-clay text-ink">
            {error ? <TriangleAlert className="size-5" /> : <Loader2 className="size-5 animate-spin" />}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/40">
              Console · tsh-admin-web
            </p>
            <p className="text-[16px] font-semibold">
              {error ? 'Accès refusé' : 'Vérification du rôle…'}
            </p>
          </div>
        </div>

        {error && (
          <>
            <p className="mt-5 rounded-xl border border-rust/30 bg-rust/10 px-3 py-2 text-[12px] text-cream/80">
              {error}
            </p>
            <Link
              to="/admin/connexion?erreur=role"
              className="btn-primary mt-4 w-full justify-center py-2.5 text-[13px]"
            >
              Retour à la connexion admin
              <ArrowRight className="size-4" />
            </Link>
          </>
        )}

        <p className="mt-6 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-cream/40">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
          Accès réservé aux comptes du realm `tsh` ayant le rôle ROLE_ADMIN.
        </p>
      </div>
    </div>
  )
}
