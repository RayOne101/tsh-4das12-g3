import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  Mail,
  Phone,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react'
import { PageHeader, Panel } from '@/components/AppBits'
import { useAuth } from '@/lib/auth'
import { USE_MOCKS, getProfile, updateProfile, uploadAvatar } from '@/lib/api'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function Profile() {
  const { session, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<string | undefined>(session?.image)
  const [saving, setSaving] = useState(false)

  // En mode reel, le profil affiche vient du microservice User (pas des donnees d'API demo).
  useEffect(() => {
    if (USE_MOCKS) return
    getProfile()
      .then((profile) => {
        setForm({ nom: profile.nom, email: profile.email, telephone: profile.telephone ?? '' })
        if (profile.photoUrl) setPhoto(profile.photoUrl)
      })
      .catch((err: unknown) =>
        toast(err instanceof Error ? err.message : 'Profil indisponible', 'error'),
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Sans backend (mode demo), on affiche juste un apercu local.
    if (USE_MOCKS) {
      setPhoto(URL.createObjectURL(file))
      toast('Aperçu local — envoi réel désactivé en mode démo', 'info')
      return
    }

    try {
      const profile = await uploadAvatar(file)
      setPhoto(profile.photoUrl ?? undefined)
      toast('Photo de profil enregistrée', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Envoi de la photo impossible', 'error')
    }
  }

  const handleSave = async () => {
    if (USE_MOCKS) {
      toast('Profil enregistré avec succès', 'success')
      return
    }
    setSaving(true)
    try {
      const profile = await updateProfile({
        nom: form.nom,
        email: form.email,
        telephone: form.telephone.trim(),
      })
      setForm({ nom: profile.nom, email: profile.email, telephone: profile.telephone ?? '' })
      toast('Profil enregistré', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Enregistrement impossible', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Matches backend ProfilUpdateRequest DTO:
  //   nom (String, required), email (String, required), telephone (String, optional)
  const [form, setForm] = useState({
    nom: session?.name ?? '',
    email: session?.email ?? '',
    telephone: '+216 22 123 456',
  })

  const [notifications, setNotifications] = useState({
    messages: true,
    visits: true,
    prices: false,
    newsletter: false,
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <>
      <PageHeader
        eyebrow="Compte"
        title="Mon profil"
        description="Gère tes coordonnées personnelles et tes préférences de compte."
      />

      {/* Avatar card */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-ink/[0.07] bg-white p-5">
        <div className="relative">
          <img src={photo} alt="" className="size-16 rounded-full object-cover" />
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhoto}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-white bg-ink text-cream"
            aria-label="Changer la photo"
          >
            <Upload className="size-3" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[18px] font-semibold tracking-[-0.02em]">{session?.name}</p>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
              {session?.role === 'admin' ? 'Administrateur' : 'Membre TSH'}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-ink-soft">
            {session?.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Personal info form — matches backend PUT /api/utilisateurs/me */}
        <Panel title="Informations personnelles">
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="field-label" htmlFor="nom">
                Nom complet
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => set('nom', e.target.value)}
                  className="field pl-10"
                  placeholder="Prénom Nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="field-label" htmlFor="email">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="email"
                  value={form.email}
                  readOnly
                  className="field cursor-not-allowed bg-cream/60 pl-10 text-ink-soft"
                />
              </div>
              <p className="mt-1.5 text-[11.5px] text-ink-soft">
                L'e-mail est géré par Keycloak. Pour le modifier, contacte l'administration.
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="field-label" htmlFor="telephone">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="telephone"
                  value={form.telephone}
                  onChange={(e) => set('telephone', e.target.value)}
                  className="field pl-10"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-ink/[0.06] pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary btn-sm"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </div>
        </Panel>

        <div className="space-y-6">
          {/* Notifications */}
          <Panel title="Notifications">
            <div className="space-y-1">
              {(
                [
                  ['messages', 'Nouveaux messages', "À chaque message d'un membre"],
                  ['visits', 'Contrats & alertes', 'Rappels et documents'],
                  ['prices', 'Baisses de prix', 'Sur tes favoris uniquement'],
                ] as const
              ).map(([key, label, detail]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-2"
                >
                  <span>
                    <span className="block text-[11px] font-medium">{label}</span>
                    <span className="text-[9px] text-ink-soft">{detail}</span>
                  </span>
                  <span
                    className={cn(
                      'relative h-5 w-9 rounded-full transition-colors',
                      notifications[key] ? 'bg-sage' : 'bg-ink/15',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 size-4 rounded-full bg-white shadow transition-all',
                        notifications[key] ? 'left-[1.1rem]' : 'left-0.5',
                      )}
                    />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={notifications[key]}
                      onChange={(e) =>
                        setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                      }
                    />
                  </span>
                </label>
              ))}
            </div>
          </Panel>

          {/* Danger zone */}
          <div className="rounded-[1.5rem] border border-rust/15 bg-rust-soft/40 p-4">
            <p className="text-[11px] font-semibold text-rust">Zone sensible</p>
            <p className="mt-1 text-[9.5px] leading-relaxed text-ink-soft">
              Suppression définitive de ton compte et de tes données.
            </p>
            <button
              type="button"
              onClick={() => toast('Demande de suppression enregistrée', 'info')}
              className="mt-3 inline-flex items-center gap-1.5 text-[9.5px] font-semibold text-rust underline underline-offset-2"
            >
              <Trash2 className="size-3" />
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/')
        }}
        className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft transition hover:text-rust"
      >
        <LogOut className="size-3.5" />
        Se déconnecter
      </button>
    </>
  )
}
