import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
} from 'lucide-react'
import { Brand } from '@/components/Brand'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/data'
import { useToast } from '@/lib/toast'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [keycloakLoading, setKeycloakLoading] = useState(false)

  const returnTo = params.get('returnTo') ?? '/logements'

  if (isAuthenticated) return <Navigate to={returnTo} replace />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast('Veuillez renseigner votre e-mail et mot de passe.', 'error')
      return
    }

    setLoading(true)
    setTimeout(() => {
      let selectedRole: Role = 'user'
      let name = 'Utilisateur TSH'
      if (email.includes('owner') || email.includes('amel') || email.includes('proprio')) {
        selectedRole = 'owner'
        name = 'Amel Ben Salah'
      } else {
        name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      }

      login(selectedRole, { name, email })
      toast(`Connexion réussie — Bienvenue ${name} !`, 'success')
      setLoading(false)
      navigate(returnTo)
    }, 450)
  }

  const handleForgotPassword = () => {
    toast(`Un e-mail de réinitialisation a été simulé pour ${email || 'ton adresse'}.`, 'info')
  }

  const goToKeycloak = () => {
    setKeycloakLoading(true)
    setTimeout(() => {
      navigate(`/auth/callback?returnTo=${encodeURIComponent(returnTo)}&role=user`)
    }, 600)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <div className="flex items-center gap-4">
          <Link
            to="/admin/connexion"
            className="text-[11.5px] font-medium text-ink-soft/80 transition hover:text-ink"
          >
            Espace administration
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition hover:text-ink"
          >
            Retour au site
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Centered content */}
      <div className="mx-auto grid w-full max-w-[80rem] flex-1 items-stretch gap-6 px-5 pb-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:content-center">
        {/* Left side — info panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-8 text-cream lg:flex min-h-[26rem]">
          <div className="absolute -right-16 -top-16 size-64 rounded-full border-[40px] border-white/[0.05]" />
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-cream/40">
              Connexion TSH
            </p>
            <h1 className="display mt-4 text-[clamp(2.1rem,3.6vw,3rem)]">
              Ton chez-toi
              <br />
              commence
              <br />
              <span className="font-serif italic text-clay">ici.</span>
            </h1>
            <p className="mt-5 text-[13px] leading-relaxed text-cream/55">
              Accède à tes annonces, messages et contrats en toute sécurité.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10.5px] text-cream/35">
            <span>Connexion sécurisée</span>
            <span>TSH · 2026</span>
          </div>
        </aside>

        {/* Right side — form */}
        <main className="flex min-h-[26rem] flex-col rounded-[2rem] border border-ink/[0.07] bg-white p-6 sm:p-8">
          <p className="eyebrow">Connexion sécurisée</p>
          <h2 className="display mt-2 text-[clamp(1.7rem,3vw,2.3rem)]">
            Heureux de te <span className="font-serif italic text-clay-deep">revoir.</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 flex-1 flex flex-col">
            <div>
              <label className="field-label" htmlFor="email">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.tn"
                  className="field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="field-label mb-0" htmlFor="password">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11.5px] font-medium text-clay-deep transition hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition hover:text-ink"
                  aria-label="Afficher/masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-ink/20 accent-[#d07a3b]"
                />
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-[13.5px] shadow-sm"
            >
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Connexion en cours…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {/* SSO divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-ink/10" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                ou SSO académique
              </span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>

            <button
              type="button"
              onClick={goToKeycloak}
              disabled={keycloakLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 bg-white py-2.5 text-[12.5px] font-semibold text-ink shadow-sm transition hover:border-ink/30 hover:bg-cream"
            >
              <KeyRound className="size-3.5 text-clay-deep" />
              <span>Continuer avec Keycloak SSO</span>
            </button>

            <p className="mt-auto pt-2 text-center text-[12.5px] text-ink-soft">
              Pas encore de compte ?{' '}
              <Link
                to="/bienvenue"
                className="font-semibold text-ink underline decoration-clay decoration-2 underline-offset-2 hover:text-clay-deep"
              >
                Créer un profil gratuitement
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  )
}
