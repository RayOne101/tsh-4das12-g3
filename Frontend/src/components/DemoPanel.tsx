import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, RotateCcw, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const roles: { value: Role; label: string }[] = [
  { value: 'guest', label: 'Visiteur' },
  { value: 'user', label: 'Membre TSH' },
]

export function DemoPanel() {
  const [open, setOpen] = useState(false)
  const { session, switchRole, expire } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const current = session?.role ?? 'guest'

  return (
    <div className="fixed bottom-4 right-3 z-[70] hidden flex-col items-end gap-2 lg:bottom-6 lg:right-6 lg:flex">
      {open && (
        <div className="w-[19rem] rounded-[1.5rem] border border-ink/10 bg-white/95 p-4 shadow-lift backdrop-blur-xl">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Mode démonstration
              </p>
              <p className="mt-1 text-[13px] font-semibold">Simuler un utilisateur</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le panneau"
              className="grid size-7 place-items-center rounded-full bg-cream-deep text-ink-soft"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  switchRole(role.value)
                  toast(`Rôle simulé : ${role.label}`, 'info')
                }}
                className={cn(
                  'rounded-xl border px-2 py-2 text-[12px] font-semibold transition-colors',
                  current === role.value
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/10 bg-cream text-ink-soft hover:border-ink/25 hover:text-ink',
                )}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className="my-3 h-px bg-ink/10" />

          <button
            type="button"
            onClick={() => {
              expire()
              setOpen(false)
              navigate('/session-expiree')
            }}
            className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-[12.5px] font-medium text-ink-soft transition hover:text-ink"
          >
            Simuler une session expirée
            <span className="size-2 rounded-full bg-clay" />
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('user')
              toast('Démo réinitialisée', 'success')
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-cream px-2 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-cream-deep"
          >
            <RotateCcw className="size-3.5" />
            Réinitialiser
          </button>

          <p className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">
            L’authentification réelle est déléguée à Keycloak (OIDC + PKCE). Ce panneau ne fait que
            simuler les états de session.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`Démo · ${roles.find((r) => r.value === current)?.label}`}
        aria-label="Ouvrir le panneau de démonstration"
        className={cn(
          'relative grid size-11 place-items-center rounded-full border shadow-lift backdrop-blur transition',
          open
            ? 'border-ink bg-white text-ink'
            : 'border-white/20 bg-ink text-cream hover:bg-clay hover:text-ink',
        )}
      >
        {open ? <X className="size-4" /> : <FlaskConical className="size-4" />}
        {!open && (
          <span
            className={cn(
              'absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white',
              current === 'guest' ? 'bg-ink/30' : 'bg-clay',
            )}
          />
        )}
      </button>
    </div>
  )
}
