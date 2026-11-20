import { useState } from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  FileSignature,
  Fingerprint,
  Headphones,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { ButtonLink } from '@/components/ButtonLink'
import { SectionHeading } from '@/components/ui'
import { faq } from '@/lib/data'
import { cn } from '@/lib/utils'

const verification = [
  {
    icon: ScanFace,
    title: 'Identité',
    text: 'Pièce d’identité et selfie contrôlés. Un propriétaire = une identité, pas un pseudonyme.',
    level: 'Niveau 1',
  },
  {
    icon: Fingerprint,
    title: 'Bien',
    text: 'Titre de propriété, mandat ou contrat de location vérifié par notre équipe sous 48 h.',
    level: 'Niveau 2',
  },
  {
    icon: BadgeCheck,
    title: 'Annonce',
    text: 'Photos réelles, prix comparé au marché local, adresse confirmée. Le badge n’apparaît qu’après ces trois contrôles.',
    level: 'Niveau 3',
  },
]

const plans = [
  {
    name: 'Étudiant',
    price: '0 DT',
    detail: 'pour toujours',
    features: [
      'Recherche et favoris illimités',
      'Visites sans frais',
      'Messagerie et alertes',
      'Profil de compatibilité colocation',
      'Bail numérique et reçus',
    ],
    cta: 'Créer mon compte',
    to: '/connexion',
    tone: 'light' as const,
  },
  {
    name: 'Propriétaire',
    price: '0 DT',
    detail: 'les 3 premières annonces',
    features: [
      'Publication en 5 minutes',
      'Vérification du bien incluse',
      'Candidatures triées et vérifiées',
      'Contrats et échéanciers',
      'Support prioritaire',
    ],
    cta: 'Publier une annonce',
    to: '/connexion?returnTo=/app/annonces/nouvelle',
    tone: 'dark' as const,
  },
  {
    name: 'Agence',
    price: '79 DT',
    detail: 'par mois, sans engagement',
    features: [
      'Annonces illimitées',
      'Tableau de bord multi-biens',
      'Marque vérifiée',
      'Export comptable',
      'Accompagnement dédié',
    ],
    cta: 'Parler à l’équipe',
    to: '/comment-ca-marche#faq',
    tone: 'light' as const,
  },
]

export function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      <section className="pb-12 pt-10">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl" data-reveal>
            <p className="eyebrow mb-4">Confiance & fonctionnement</p>
            <h1 className="display text-[clamp(2.6rem,5.6vw,4.6rem)]">
              On ne demande pas
              <br />
              <span className="font-serif italic text-clay-deep">de nous croire.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
              Chaque annonce, chaque propriétaire et chaque paiement laisse une trace vérifiable.
              Voilà exactement comment TSH fonctionne — et ce qui se passe quand quelque chose ne va
              pas.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            {[
              ['#verification', 'La vérification'],
              ['#matching', 'Le matching'],
              ['#securite', 'Sécurité & paiements'],
              ['#tarifs', 'Tarifs'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="chip">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="verification" className="scroll-mt-28 border-y border-ink/[0.07] bg-white/60">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-20 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="La vérification"
            title={
              <>
                Trois contrôles,
                <br />
                <span className="font-serif italic text-clay-deep">un seul badge.</span>
              </>
            }
            description="Le badge « Vérifié » n’est pas décoratif. Il signifie que l’identité, le bien et l’annonce ont été contrôlés séparément."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {verification.map((item, i) => (
              <article
                key={item.title}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
                className="rounded-[1.75rem] bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-clay-soft text-clay-deep">
                    <item.icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {item.level}
                  </span>
                </div>
                <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.75rem] border border-ink/[0.07] bg-cream p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sage" />
              <p className="max-w-2xl text-[13px] leading-relaxed text-ink-soft">
                <strong className="text-ink">Et si une annonce est fausse ?</strong> Elle est retirée
                sous 24 h, le compte est suspendu le temps de l’enquête, et toute somme versée via TSH
                est remboursée. Les signalements sont traités par une personne, pas par un robot.
              </p>
            </div>
            <ButtonLink to="/app/admin" variant="ghost" className="btn-sm">
              Voir la modération
              <ArrowUpRight className="size-3.5" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="matching" className="mx-auto w-full max-w-[88rem] scroll-mt-28 px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div data-reveal>
            <p className="eyebrow">Le matching colocation</p>
            <h2 className="display mt-4 text-[clamp(2.1rem,4.2vw,3.5rem)]">
              Le bon logement.
              <br />
              <span className="font-serif italic text-clay-deep">Les bonnes personnes.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
              Un loyer compatible ne suffit pas. Le service Colocation compare ton rythme de vie, ta
              tolérance au désordre, tes invités, tes animaux et ton budget. Le score s’affiche des
              deux côtés — pas seulement du tien.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Aucune coordonnée partagée avant acceptation mutuelle',
                'Score recalculé si l’un de vous modifie son profil',
                'Possibilité de masquer son profil à tout moment',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-sage" />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink to="/colocation" variant="ink" className="mt-7">
              <Users className="size-4" />
              Tester ma compatibilité
            </ButtonLink>
          </div>

          <div className="rounded-[1.9rem] bg-ink p-6 text-cream sm:p-8" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/45">
                Exemple de score
              </p>
              <Sparkles className="size-4 text-clay" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Rythme de vie', 'Aligné', 95],
                ['Propreté', 'Aligné', 90],
                ['Invités', 'Presque', 78],
                ['Budget', 'Aligné', 100],
              ].map(([label, status, score]) => (
                <div key={label as string} className="rounded-2xl bg-white/[0.06] p-3.5">
                  <p className="text-[10.5px] uppercase tracking-[0.1em] text-cream/45">{label}</p>
                  <p className="mt-1.5 text-[13px] font-semibold">{status}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-clay" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.12em] text-cream/45">Score global</p>
                <p className="mt-1 text-[38px] font-semibold leading-none tracking-[-0.06em]">
                  91<span className="text-[18px]">%</span>
                </p>
              </div>
              <span className="rounded-full bg-sage px-3 py-1.5 text-[10.5px] font-semibold text-white">
                Très forte compatibilité
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="securite" className="scroll-mt-28 bg-ink py-20 text-cream">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow !text-cream/45">Sécurité & paiements</p>
            <h2 className="display mt-4 text-[clamp(2.1rem,4.4vw,3.6rem)]">
              L’argent ne circule pas
              <br />
              <span className="font-serif italic text-clay">dans le vide.</span>
            </h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-cream/60">
              Chaque euro ou dinar versé via TSH est rattaché à un contrat, une échéance et un reçu. Le
              propriétaire sait quand il est payé, l’étudiant sait pour quoi.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: CreditCard,
                title: 'Paiement tracé',
                text: 'Chaque loyer et chaque charge laisse une trace horodatée, consultable par les deux parties.',
              },
              {
                icon: FileSignature,
                title: 'Bail numérique',
                text: 'Un contrat clair, signé en ligne, archivé. Les clauses essentielles sont expliquées en français simple.',
              },
              {
                icon: Headphones,
                title: 'Médiation humaine',
                text: 'Un litige ? Un médiateur lit les échanges et le contrat, puis propose une solution sous 72 h.',
              },
            ].map((item, i) => (
              <article
                key={item.title}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <item.icon className="size-5 text-clay" />
                <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-cream/55">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="mx-auto w-full max-w-[88rem] scroll-mt-28 px-5 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Tarifs"
          title={
            <>
              Gratuit pour les étudiants.
              <br />
              <span className="font-serif italic text-clay-deep">Toujours.</span>
            </>
          }
          description="Pas de frais de dossier, pas de commission cachée sur le loyer. Les propriétaires paient pour la visibilité et les outils, jamais les étudiants."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <article
              key={plan.name}
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              className={cn(
                'flex flex-col rounded-[1.75rem] p-6',
                plan.tone === 'dark' ? 'bg-ink text-cream' : 'border border-ink/[0.07] bg-white',
              )}
            >
              <div className="flex items-center justify-between">
                <p className={cn('text-[12px] font-semibold uppercase tracking-[0.14em]', plan.tone === 'dark' ? 'text-cream/50' : 'text-ink-soft')}>
                  {plan.name}
                </p>
                {plan.tone === 'dark' && <Building2 className="size-4 text-clay" />}
              </div>
              <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.06em]">
                {plan.price}
              </p>
              <p className={cn('mt-1 text-[11.5px]', plan.tone === 'dark' ? 'text-cream/50' : 'text-ink-soft')}>
                {plan.detail}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className={cn('flex items-start gap-2 text-[12.5px]', plan.tone === 'dark' ? 'text-cream/75' : 'text-ink-soft')}>
                    <Check className={cn('mt-0.5 size-3.5 shrink-0', plan.tone === 'dark' ? 'text-clay' : 'text-sage')} />
                    {feature}
                  </li>
                ))}
              </ul>
              <ButtonLink
                to={plan.to}
                variant={plan.tone === 'dark' ? 'primary' : 'ghost'}
                className="mt-7 w-full"
              >
                {plan.cta}
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-[88rem] scroll-mt-28 px-5 pb-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div data-reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="display mt-4 text-[clamp(2rem,4vw,3.2rem)]">
              Les vraies
              <br />
              <span className="font-serif italic text-clay-deep">questions.</span>
            </h2>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-ink-soft">
              Une réponse manque ? Écris à bonjour@tsh.tn. Une personne répond, pas un formulaire.
            </p>
          </div>
          <div>
            {faq.map((item, i) => (
              <div key={item.q} className="border-t border-ink/10 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[15.5px] font-semibold tracking-[-0.015em]">{item.q}</span>
                  <span
                    className={cn(
                      'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-300',
                      openFaq === i && 'rotate-180 border-ink bg-ink text-cream',
                    )}
                  >
                    <ChevronDown className="size-3.5" />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    openFaq === i ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <p className="overflow-hidden pr-10 text-[13.5px] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[88rem] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-clay px-6 py-10 text-center sm:flex-row sm:px-10 sm:text-left">
          <div>
            <h2 className="display text-[clamp(1.7rem,3vw,2.5rem)] text-ink">
              Prêt à voir la différence ?
            </h2>
            <p className="mt-2 text-[13.5px] text-ink/65">
              Crée ton profil, explore, et ne paie rien avant ta visite.
            </p>
          </div>
          <ButtonLink to="/logements" variant="ink">
            Explorer les logements
            <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
