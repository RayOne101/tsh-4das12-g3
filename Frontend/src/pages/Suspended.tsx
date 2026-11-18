import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, LifeBuoy, LogOut, Mail, ShieldAlert } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/lib/toast'

export function Suspended() {
  const { session, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [appeal, setAppeal] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Brand />
        <Link to="/" className="text-[12px] font-semibold text-ink-soft transition hover:text-ink">
          Retour à l’accueil
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-4xl flex-1 items-center gap-8 px-5 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-rust-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">
            <ShieldAlert className="size-3.5" />
            Compte suspendu
          </span>
          <h1 className="display mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)]">
            L’accès est
            <br />
            <span className="font-serif italic text-rust">temporairement bloqué.</span>
          </h1>
          <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
            {session?.email ? (
              <>
                Le compte <strong className="text-ink">{session.email}</strong> a été suspendu par la
                modération TSH.
              </>
            ) : (
              <>Ce compte a été suspendu par la modération TSH.</>
            )}{' '}
            Cette mesure intervient après un signalement confirmé ou une vérification d’identité
            échouée. Tes contrats actifs restent consultables en lecture seule.
          </p>

          <div className="mt-6 rounded-[1.4rem] border border-ink/[0.07] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Motif communiqué
            </p>
            <p className="mt-2 text-[13.5px] font-semibold">
              Vérification d’identité incomplète
            </p>
            <p className="mt-1 text-[12px] text-ink-soft">
              Réf. MOD-2026-0412 · décision du 16 novembre 2026
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/connexion')
              }}
              className="btn-ghost btn-sm"
            >
              <LogOut className="size-3.5" />
              Se déconnecter
            </button>
            <a href="mailto:support@tsh.tn" className="btn-ghost btn-sm">
              <Mail className="size-3.5" />
              support@tsh.tn
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-ink/[0.07] bg-white p-6">
          {sent ? (
            <div className="py-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-sage-soft text-sage">
                <LifeBuoy className="size-6" />
              </span>
              <p className="mt-4 text-[15px] font-semibold">Recours enregistré</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
                Un médiateur relit ton dossier sous 72 h ouvrées. Tu recevras une réponse à l’adresse
                associée à ton compte.
              </p>
              <Link to="/" className="link-underline mt-5 text-[12px]">
                Retour à l’accueil
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[15px] font-semibold tracking-[-0.02em]">Déposer un recours</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
                Explique ta situation. Une personne lira ton message — pas un formulaire automatique.
              </p>
              <textarea
                value={appeal}
                onChange={(e) => setAppeal(e.target.value)}
                rows={5}
                placeholder="J’ai envoyé une pièce d’identité le 12 novembre, mais…"
                className="field mt-4 h-auto py-3"
              />
              <button
                type="button"
                disabled={appeal.trim().length < 10}
                onClick={() => {
                  setSent(true)
                  toast('Recours envoyé à la modération', 'success')
                }}
                className="btn-primary mt-4 w-full"
              >
                Envoyer mon recours
              </button>
              <p className="mt-3 text-center text-[10px] text-ink-soft">
                Délai de réponse indicatif : 72 h ouvrées.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
