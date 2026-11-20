import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'

/**
 * Connexion de la console d'administration : interface separee de celle des
 * etudiants, sans inscription ni SSO academique.
 */
export function AdminLogin() {
  const { session, isAuthenticated, login, authEnabled, signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<'credentials' | 'role' | null>(
    params.get('erreur') === 'role' ? 'role' : null,
  )

  const returnTo = params.get('returnTo') ?? '/admin'

  if (isAuthenticated && session?.role === 'admin') {
    return <Navigate to={returnTo} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    // Client Keycloak dedie : le realm verifie les identifiants, on verifie le role.
    if (authEnabled) {
      setLoading(true)
      setError(null)
      try {
        await signIn('admin', email.trim(), password, { requireAdmin: true })
        navigate(returnTo, { replace: true })
      } catch (err) {
        setError(err instanceof Error && err.message === 'ROLE_ADMIN requis' ? 'role' : 'credentials')
      } finally {
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setTimeout(() => {
      login('admin', { name: 'Sami Modérateur', email })
      setLoading(false)
      navigate(returnTo, { replace: true })
    }, 400)
  }

  return (
    <div className="grid min-h-dvh bg-ink text-cream lg:grid-cols-[1fr_27rem]">
      <aside className="hidden flex-col justify-between p-10 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-clay text-ink">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/40">TSH</p>
            <p className="text-[14px] font-semibold">Console d’administration</p>
          </div>
        </div>

        <div>
          <h1 className="display text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05]">
            Espace réservé
            <br />
            à la <span className="font-serif italic text-clay">modération.</span>
          </h1>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-cream/50">
            Accès distinct de l’application étudiante : comptes de la communauté et signalements.
            Toute connexion est journalisée.
          </p>
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-cream/25">
          Accès restreint · ROLE_ADMIN
        </p>
      </aside>

      <main className="flex flex-col justify-center bg-[#f4f1ec] p-6 text-ink sm:p-10">
        <div className="mx-auto w-full max-w-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-cream/70 lg:hidden">
            <ShieldCheck className="size-3" />
            Administration
          </span>

          <h2 className="display mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">Connexion admin</h2>
          <p className="mt-1.5 text-[12px] text-ink-soft">
            Identifiants fournis par l’équipe technique.
          </p>

          {error && (
            <p className="mt-4 rounded-xl border border-rust/25 bg-rust-soft/60 px-3 py-2 text-[11.5px] text-rust">
              {error === 'role'
                ? 'Ce compte n’a pas le rôle administrateur.'
                : 'E-mail ou mot de passe incorrect.'}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="field-label" htmlFor="admin-email">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tsh.tn"
                  className="field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="admin-password">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-ink w-full py-3 text-[13px]">
              {loading ? 'Vérification…' : 'Accéder à la console'}
              {!loading && <ArrowRight className="size-4" />}
            </button>
          </form>

          <p className="mt-6 flex items-start gap-2 text-[10.5px] leading-relaxed text-ink-soft">
            <KeyRound className="mt-0.5 size-3.5 shrink-0 text-clay-deep" />
            {authEnabled
              ? 'Identifiants vérifiés par Keycloak (client tsh-admin-web). Seuls les comptes ROLE_ADMIN ouvrent une session.'
              : 'Démonstration : n’importe quel e-mail et mot de passe ouvre une session admin simulée. Configure VITE_KEYCLOAK_URL pour la connexion réelle.'}
          </p>
        </div>
      </main>
    </div>
  )
}
