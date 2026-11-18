import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { useAuth } from '@/lib/auth'
import { consumeReturnTo } from '@/lib/oidc'

const steps = [
  'Vérification du state OIDC',
  'Échange du code d’autorisation',
  'Lecture des rôles du realm',
]

/**
 * Retour de Keycloak pour l'application etudiante (client `tsh-web`).
 * En mode demonstration (pas de VITE_KEYCLOAK_URL), la page rejoue simplement
 * les etapes pour garder l'apercu navigable.
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const { authEnabled, login, finishKeycloakLogin } = useAuth()
  const [done, setDone] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const returnTo = consumeReturnTo('/logements')

    if (!authEnabled) {
      const timers = [
        window.setTimeout(() => setDone(1), 500),
        window.setTimeout(() => setDone(2), 1000),
        window.setTimeout(() => setDone(3), 1500),
        window.setTimeout(() => {
          login('student')
          navigate(returnTo, { replace: true })
        }, 2100),
      ]
      return () => timers.forEach(window.clearTimeout)
    }

    setDone(1)
    finishKeycloakLogin('student')
      .then(() => {
        setDone(3)
        navigate(returnTo, { replace: true })
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Connexion impossible'))
  }, [authEnabled, finishKeycloakLogin, login, navigate])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-10">
      <Brand className="mb-10" />
      <div className="w-full max-w-md rounded-[1.75rem] border border-ink/[0.07] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-ink text-cream">
            {error ? (
              <TriangleAlert className="size-5 text-clay" />
            ) : done >= 3 ? (
              <Check className="size-5" />
            ) : (
              <Loader2 className="size-5 animate-spin" />
            )}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Keycloak · OIDC
            </p>
            <p className="text-[17px] font-semibold tracking-[-0.02em]">
              {error ? 'Connexion refusée' : done >= 3 ? 'Connexion confirmée' : 'Connexion en cours'}
            </p>
          </div>
        </div>

        {error ? (
          <>
            <p className="mt-5 rounded-xl border border-rust/20 bg-rust-soft/50 px-3 py-2 text-[12px] text-rust">
              {error}
            </p>
            <Link to="/connexion" className="btn-primary mt-4 w-full justify-center py-2.5 text-[13px]">
              Réessayer
              <ArrowRight className="size-4" />
            </Link>
          </>
        ) : (
          <div className="mt-6 space-y-2.5">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2.5 text-[12.5px]">
                <span
                  className={`grid size-5 place-items-center rounded-full transition-colors ${
                    done > i ? 'bg-sage-soft text-sage' : 'bg-cream-deep text-ink-soft'
                  }`}
                >
                  {done > i ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}
                </span>
                <span className={done > i ? 'text-ink' : 'text-ink-soft'}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {!error && (
          <div className="mt-6 rounded-xl bg-cream p-3 font-mono text-[10px] leading-relaxed text-ink-soft">
            <p>POST /realms/tsh/protocol/openid-connect/token</p>
            <p className="mt-1 text-ink/70">grant_type=authorization_code</p>
            <p className="text-ink/70">code=•••••&nbsp;&nbsp;code_verifier=•••••</p>
            <p className="mt-1 text-sage">→ 200 · access_token (15 min) · ROLE_USER</p>
          </div>
        )}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[10.5px] text-ink-soft">
        <ShieldCheck className="size-3.5" />
        {authEnabled
          ? 'Le code est échangé côté navigateur avec PKCE (S256).'
          : 'Mode démo : aucun serveur Keycloak configuré, le retour est simulé.'}
      </p>
    </div>
  )
}
