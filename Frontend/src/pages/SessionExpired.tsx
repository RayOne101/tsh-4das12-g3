import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock3, ShieldCheck } from 'lucide-react'
import { Brand } from '@/components/Brand'

export function SessionExpired() {
  const [params] = useSearchParams()
  const returnTo = params.get('returnTo') ?? '/app'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5">
      <Brand className="mb-8" />
      <div className="w-full max-w-md rounded-[1.75rem] border border-ink/[0.07] bg-white p-7 text-center shadow-soft">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-clay-soft text-clay-deep">
          <Clock3 className="size-6" />
        </span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Session expirée
        </p>
        <h1 className="display mt-2 text-[clamp(1.8rem,3.4vw,2.4rem)]">
          On t’a gardé ta place.
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
          Ton jeton d’accès a expiré après 15 minutes d’inactivité. Reconnecte-toi pour retrouver ta
          recherche, tes favoris et tes messages — rien n’a été perdu.
        </p>
        <Link
          to={`/connexion?returnTo=${encodeURIComponent(returnTo)}`}
          className="btn-primary mt-6 w-full"
        >
          Se reconnecter
          <ArrowRight className="size-4" />
        </Link>
        <Link to="/" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
          Continuer en visiteur
        </Link>
        <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-ink/[0.07] pt-4 text-[10px] text-ink-soft">
          <ShieldCheck className="size-3.5" />
          Refresh token Keycloak · SSO silencieux disponible
        </p>
      </div>
    </div>
  )
}
