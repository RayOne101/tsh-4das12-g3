import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Upload,
  User,
} from 'lucide-react'
import { Brand } from '@/components/Brand'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { USE_MOCKS, registerProfile } from '@/lib/api'

export function Onboarding() {
  const navigate = useNavigate()
  const { login, updateSessionImage } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<Role>('student')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  })
  const [consent, setConsent] = useState(false)

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast('Format non supporté (JPEG, PNG ou WebP uniquement)', 'error')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast('Image trop lourde (2 Mo maximum)', 'error')
      return
    }
    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)
  }

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const totalSteps = 2

  const canContinue =
    step === 1 ||
    (step === 2 &&
      form.nom.trim().length > 1 &&
      form.email.includes('@') &&
      form.password.trim().length >= 6 &&
      form.password === form.confirmPassword &&
      consent)

  const finish = async () => {
    // En mode réel (Keycloak actif) : on sauvegarde le profil dans le microservice User.
    // En mode démo : on simule juste la connexion sans appel réseau.
    if (!USE_MOCKS) {
      try {
        await registerProfile(
          form.nom || 'Étudiant TSH',
          form.email || 'etudiant@tsh.tn',
          form.telephone.trim() || null,
        )
      } catch {
        // Si le microservice est indisponible, on continue quand même.
        // Le profil sera créé automatiquement au premier appel /me (JIT).
      }
    }

    if (avatarPreview) {
      updateSessionImage(avatarPreview)
    }

    login(role, {
      name: form.nom || 'Étudiant TSH',
      email: form.email || 'etudiant@tsh.tn',
      image: avatarPreview || undefined,
    })
    toast(`Bienvenue sur TSH, ${form.nom.split(' ')[0] || ''} ! Ton compte est prêt.`, 'success')
    navigate('/logements')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <button
          type="button"
          onClick={() => navigate('/connexion')}
          className="text-[12px] font-semibold text-ink-soft transition hover:text-ink"
        >
          J'ai déjà un compte · <span className="text-clay-deep underline">Se connecter</span>
        </button>
      </div>

      {/* Centered content */}
      <div className="mx-auto grid w-full max-w-[80rem] flex-1 items-stretch gap-6 px-5 pb-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:content-center">
        {/* Left side — info panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-8 text-cream lg:flex min-h-[26rem]">
          <div className="absolute -right-16 -top-16 size-64 rounded-full border-[40px] border-white/[0.05]" />
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-cream/40">
              Inscription TSH
            </p>
            <h1 className="display mt-4 text-[clamp(2.1rem,3.6vw,3rem)]">
              Trois minutes
              <br />
              pour bien
              <br />
              <span className="font-serif italic text-clay">commencer.</span>
            </h1>
            <p className="mt-5 text-[13px] leading-relaxed text-cream/55">
              Crée ton compte et rejoins la communauté TSH : logements vérifiés, colocataires
              compatibles et déménageurs étudiants.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10.5px] text-cream/35">
            <span>Étape {step} sur {totalSteps}</span>
            <span>TSH · 2026</span>
          </div>
        </aside>

        {/* Right side — stepper form */}
        <main className="flex min-h-[26rem] flex-col rounded-[2rem] border border-ink/[0.07] bg-white p-6 sm:p-8">
          {/* Stepper progress bar */}
          <div className="mb-6 flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i + 1 <= step ? 'bg-clay' : 'bg-ink/10',
                )}
              />
            ))}
          </div>

          {/* Fixed-height step container */}
          <div className="flex flex-1 flex-col">
            {/* STEP 1: Rôle */}
            {step === 1 && (
              <div className="flex flex-1 flex-col animate-fade-up">
                <p className="eyebrow">Étape 1 sur {totalSteps} · Ton profil</p>
                <h2 className="display mt-2 text-[clamp(1.7rem,3vw,2.3rem)]">
                  Tu viens ici pour…
                </h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: 'student' as Role,
                      icon: GraduationCap,
                      title: 'Trouver un logement',
                      text: 'Étudiant, colocation, meubles et transport.',
                    },
                    {
                      value: 'owner' as Role,
                      icon: Building2,
                      title: 'Publier des offres',
                      text: 'Propriétaire, bailleur ou transporteur.',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={cn(
                        'rounded-[1.4rem] border p-5 text-left transition',
                        role === option.value
                          ? 'border-ink bg-ink text-cream shadow-md'
                          : 'border-ink/10 bg-cream/40 hover:border-ink/30',
                      )}
                    >
                      <option.icon
                        className={cn('size-5', role === option.value ? 'text-clay' : 'text-ink-soft')}
                      />
                      <p className="mt-3 text-[15px] font-semibold">{option.title}</p>
                      <p
                        className={cn(
                          'mt-1 text-[12px] leading-relaxed',
                          role === option.value ? 'text-cream/65' : 'text-ink-soft',
                        )}
                      >
                        {option.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Coordonnées & Mot de passe */}
            {step === 2 && (
              <div className="flex flex-1 flex-col animate-fade-up">
                <p className="eyebrow">Étape 2 sur {totalSteps} · Coordonnées</p>
                <h2 className="display mt-2 text-[clamp(1.7rem,3vw,2.3rem)]">
                  Création de ton compte
                </h2>

                <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                  {/* Photo de profil (optionnel) */}
                  <div className="flex items-center gap-4 rounded-2xl border border-ink/[0.08] bg-white p-3.5 sm:col-span-2">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-ink/10 bg-cream">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Apercu" className="size-full object-cover" />
                      ) : (
                        <div className="grid size-full place-items-center text-ink-soft">
                          <User className="size-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-ink">
                        Photo de profil <span className="font-normal text-ink-soft">(optionnel)</span>
                      </p>
                      <p className="text-[11px] text-ink-soft">JPG, PNG ou WebP (max 2 Mo)</p>
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-white px-3 py-1.5 text-[11.5px] font-medium text-ink transition hover:bg-cream"
                    >
                      <Upload className="size-3 text-ink-soft" />
                      {avatarPreview ? 'Changer' : 'Ajouter'}
                    </button>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="nom">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        id="nom"
                        required
                        value={form.nom}
                        onChange={(e) => set('nom', e.target.value)}
                        placeholder="Yasmine Chaabane"
                        className="field pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="reg-email">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="nom@exemple.tn"
                        className="field pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="reg-phone">
                      Téléphone <span className="text-ink-soft font-normal">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => set('telephone', e.target.value)}
                        placeholder="+216 22 123 456"
                        className="field pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="reg-password">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        id="reg-password"
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="••••••••"
                        className="field pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="reg-confirm">
                      Confirmer mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                      <input
                        id="reg-confirm"
                        type="password"
                        required
                        value={form.confirmPassword}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="field pl-9"
                      />
                    </div>
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-cream p-3.5 transition hover:bg-cream-deep/40">
                  <span
                    className={cn(
                      'mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors',
                      consent ? 'border-ink bg-ink text-cream' : 'border-ink/25',
                    )}
                  >
                    {consent && <Check className="size-2.5" />}
                  </span>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-[11.5px] leading-relaxed text-ink-soft">
                    J'accepte les Conditions Générales d'Utilisation et la politique de
                    confidentialité de TSH.
                  </span>
                </label>
              </div>
            )}

            {/* Stepper navigation */}
            <div className="mt-auto flex items-center justify-between border-t border-ink/[0.07] pt-5">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="btn-ghost btn-sm disabled:invisible"
              >
                <ArrowLeft className="size-3.5" />
                Retour
              </button>
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="btn-primary btn-sm"
                >
                  Continuer
                  <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  disabled={!canContinue}
                  className="btn-primary btn-sm"
                >
                  Créer mon compte TSH
                  <Check className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
