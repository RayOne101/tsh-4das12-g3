import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/data'

const steps = [
  'Vérification du state OIDC',
  'Échange du code d’autorisation',
  'Lecture des rôles du realm',
]

export function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [done, setDone] = useState(0)

  const returnTo = params.get('returnTo') ?? '/logements'
  const role = (params.get('role') as Role) ?? 'student'

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setDone(1), 500),
      window.setTimeout(() => setDone(2), 1000),
      window.setTimeout(() => setDone(3), 1500),
      window.setTimeout(() => {
        login(role)
        navigate(returnTo, { replace: true })
      }, 2100),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [login, navigate, returnTo, role])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-10">
      <Brand className="mb-10" />
      <div className="w-full max-w-md rounded-[1.75rem] border border-ink/[0.07] bg-white p-7 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-ink text-cream">
            {done >= 3 ? <Check className="size-5" /> : <Loader2 className="size-5 animate-spin" />}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Keycloak · OIDC
            </p>
            <p className="text-[17px] font-semibold tracking-[-0.02em]">
              {done >= 3 ? 'Connexion confirmée' : 'Connexion en cours'}
            </p>
          </div>
        </div>

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

        <div className="mt-6 rounded-xl bg-cream p-3 font-mono text-[10px] leading-relaxed text-ink-soft">
          <p>POST /realms/tsh/protocol/openid-connect/token</p>
          <p className="mt-1 text-ink/70">grant_type=authorization_code</p>
          <p className="text-ink/70">code=•••••&nbsp;&nbsp;code_verifier=•••••</p>
          <p className="mt-1 text-sage">→ 200 · access_token (15 min) · ROLE_USER</p>
        </div>

        {done >= 3 && (
          <button
            type="button"
            onClick={() => navigate(returnTo, { replace: true })}
            className="btn-ink mt-5 w-full"
          >
            Continuer
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[10.5px] text-ink-soft">
        <ShieldCheck className="size-3.5" />
        Cette page simule le retour du serveur Keycloak. En production, le code est validé côté client
        avec PKCE.
      </p>
    </div>
  )
}
