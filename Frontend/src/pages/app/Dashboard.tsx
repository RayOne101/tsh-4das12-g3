import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  Eye,
  FileSignature,
  Heart,
  Inbox,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { PageHeader, Panel, ViewAll } from '@/components/AppBits'
import { ButtonLink } from '@/components/ButtonLink'
import { ListingCard } from '@/components/ListingCard'
import { Progress, StatCard, Verified } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { avatar, listings, TND } from '@/lib/data'

export function Dashboard() {
  const { session } = useAuth()
  if (!session) return null
  if (session.role === 'owner') return <OwnerDashboard />
  return <StudentDashboard />
}

function StudentDashboard() {
  const { session } = useAuth()
  const recommended = listings.slice(0, 3)

  return (
    <>
      <PageHeader
        eyebrow={`Mardi 17 novembre · ${session?.name.split(' ')[0]}`}
        title={
          <>
            Bonjour {session?.name.split(' ')[0]},
            <br />
            <span className="font-serif italic text-clay-deep">où en est ta recherche ?</span>
          </>
        }
        description="Deux visites cette semaine, un contrat à signer et une sélection qui bouge."
        actions={
          <>
            <ButtonLink to="/logements" variant="ink" className="btn-sm">
              Explorer les logements
              <ArrowUpRight className="size-3.5" />
            </ButtonLink>
            <ButtonLink to="/app/annonces/nouvelle" variant="ghost" className="btn-sm">
              <Plus className="size-3.5" />
              Publier
            </ButtonLink>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-4 rounded-[1.5rem] border border-ink/[0.07] bg-white p-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-1 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-clay-soft text-clay-deep">
            <BadgeCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12.5px] font-semibold">Ton profil est vérifié à 80 %</p>
              <span className="text-[10.5px] font-semibold text-ink-soft">80 %</span>
            </div>
            <Progress value={80} className="mt-2" />
            <p className="mt-1.5 text-[10.5px] text-ink-soft">
              Ajoute ta carte étudiante pour débloquer le badge et les annonces prioritaires.
            </p>
          </div>
        </div>
        <Link to="/app/profil" className="btn-ghost btn-sm shrink-0">
          Compléter
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Visites à venir" value="2" hint="Samedi 22 · La Marsa" icon={<CalendarDays className="size-4" />} />
        <StatCard label="Favoris" value="5" hint="3 nouvelles annonces" icon={<Heart className="size-4" />} />
        <StatCard label="Messages" value="2" hint="Amel · Karim" icon={<MessageSquare className="size-4" />} />
        <StatCard label="Loyer mensuel" value={TND(620)} hint="Prochaine échéance 1 déc." icon={<CreditCard className="size-4" />} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Ta semaine" action={<ViewAll to="/app/messages" label="Messagerie" />}>
          <div className="space-y-0">
            {[
              {
                icon: CalendarDays,
                title: 'Visite · Studio à Ariana',
                detail: 'Samedi 22 novembre à 10 h avec Karim T.',
                meta: 'Dans 5 jours',
                tone: 'clay',
              },
              {
                icon: FileSignature,
                title: 'Signature du bail · TSH-2026-0211',
                detail: 'Colocation Khezama Est · en attente de ta signature.',
                meta: 'Action requise',
                tone: 'sage',
              },
              {
                icon: CreditCard,
                title: 'Loyer de décembre',
                detail: '620 DT · prélèvement le 1er décembre.',
                meta: '1 déc.',
                tone: 'neutral',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 py-3.5 ${i > 0 ? 'border-t border-ink/[0.06]' : ''}`}
              >
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${
                    item.tone === 'clay'
                      ? 'bg-clay-soft text-clay-deep'
                      : item.tone === 'sage'
                        ? 'bg-sage-soft text-sage'
                        : 'bg-cream-deep text-ink-soft'
                  }`}
                >
                  <item.icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">{item.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-cream px-2 py-1 text-[9.5px] font-semibold text-ink-soft">
                  {item.meta}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-cream p-3">
            <Clock3 className="size-4 shrink-0 text-ink-soft" />
            <p className="text-[10.5px] text-ink-soft">
              Rappel : les visites sont gratuites et sans engagement. Signale toute demande de paiement
              anticipé.
            </p>
          </div>
        </Panel>

        <Panel title="Derniers messages" action={<ViewAll to="/app/messages" />}>
          <div className="space-y-1">
            {[
              { name: 'Amel Ben Salah', text: 'Samedi 10 h me convient. Je vous envoie…', time: '09:42', unread: true, img: 47 },
              { name: 'Karim Trabelsi', text: 'Oui, une visite est possible en visio…', time: 'Hier', unread: false, img: 12 },
              { name: 'Mehdi Bouazizi', text: 'On organise un appel jeudi si ça vous dit.', time: 'Lun.', unread: true, img: 33 },
            ].map((msg) => (
              <Link
                key={msg.name}
                to="/app/messages"
                className="flex items-center gap-3 rounded-xl px-1 py-2.5 transition hover:bg-cream"
              >
                <img src={avatar(msg.img)} alt="" className="size-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold">
                    {msg.name}
                    {msg.unread && <span className="size-1.5 rounded-full bg-clay" />}
                  </p>
                  <p className="truncate text-[10.5px] text-ink-soft">{msg.text}</p>
                </div>
                <span className="text-[9.5px] text-ink-soft">{msg.time}</span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Recommandé</p>
          <h2 className="text-[19px] font-semibold tracking-[-0.03em]">Pour ton profil</h2>
        </div>
        <ViewAll to="/logements" label="Voir tout" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommended.map((listing) => (
          <ListingCard key={listing.id} listing={listing} compact />
        ))}
      </div>
    </>
  )
}

function OwnerDashboard() {
  const { session } = useAuth()
  const myListings = listings.slice(0, 3)
  const bars = [42, 58, 51, 69, 62, 78, 84, 91]
  const months = ['Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov']

  return (
    <>
      <PageHeader
        eyebrow="Espace propriétaire"
        title={
          <>
            Bonjour {session?.name.split(' ')[0]},
            <br />
            <span className="font-serif italic text-clay-deep">vos biens se portent bien.</span>
          </>
        }
        description="412 vues cette semaine, 12 demandes de visite et un contrat en attente de signature."
        actions={
          <>
            <ButtonLink to="/app/annonces/nouvelle" variant="ink" className="btn-sm">
              <Plus className="size-3.5" />
              Nouvelle annonce
            </ButtonLink>
            <ButtonLink to="/app/contrats" variant="ghost" className="btn-sm">
              Contrats
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Annonces actives" value="6" hint="2 en attente de validation" icon={<Eye className="size-4" />} />
        <StatCard label="Vues (30 j)" value="1 284" hint="+18 % vs octobre" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Demandes de visite" value="12" hint="4 à traiter aujourd’hui" icon={<Inbox className="size-4" />} />
        <StatCard label="Revenu mensuel" value={TND(3480)} hint="3 contrats actifs" icon={<CreditCard className="size-4" />} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Vues de tes annonces" action={<span className="text-[10.5px] text-ink-soft">8 derniers mois</span>}>
          <div className="flex h-44 items-end gap-2 sm:gap-3">
            {bars.map((height, i) => (
              <div key={months[i]} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      i === bars.length - 1 ? 'bg-clay' : 'bg-cream-deep group-hover:bg-clay/50'
                    }`}
                    style={{ height: `${Math.round(height * 1.45)}px` }}
                  />
                </div>
                <span className="text-[9px] text-ink-soft">{months[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.06] pt-4">
            <div className="flex items-center gap-4 text-[10.5px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-clay" /> Novembre
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cream-deep" /> Historique
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-sage">
              <TrendingUp className="size-3" />
              +18 % de vues
            </span>
          </div>
        </Panel>

        <Panel title="Dernières demandes" action={<ViewAll to="/app/annonces" label="Annonces" />}>
          <div className="space-y-2">
            {[
              { name: 'Yasmine C.', listing: 'Studio · Ariana', time: 'il y a 2 h', status: 'Nouveau', img: 44 },
              { name: 'Adam R.', listing: 'Appartement · La Marsa', time: 'il y a 5 h', status: 'Nouveau', img: 15 },
              { name: 'Farah Z.', listing: 'Studio · Sfax', time: 'hier', status: 'Visite prévue', img: 32 },
              { name: 'Nour H.', listing: 'Appartement · La Marsa', time: 'hier', status: 'Répondu', img: 25 },
            ].map((row) => (
              <div key={row.name} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
                <img src={avatar(row.img)} alt="" className="size-8 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold">{row.name}</p>
                  <p className="truncate text-[10px] text-ink-soft">{row.listing}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-ink-soft">{row.time}</p>
                  <p
                    className={`text-[9px] font-semibold ${
                      row.status === 'Nouveau' ? 'text-clay-deep' : row.status === 'Visite prévue' ? 'text-sage' : 'text-ink-soft'
                    }`}
                  >
                    {row.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-clay-soft p-3">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-clay-deep">
              <Sparkles className="size-3.5" />
              Conseil : réponds sous 2 h
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-clay-deep/75">
              Les propriétaires qui répondent vite obtiennent 3× plus de visites confirmées.
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Tes biens</p>
          <h2 className="text-[19px] font-semibold tracking-[-0.03em]">Annonces actives</h2>
        </div>
        <ViewAll to="/app/annonces" label="Gérer" />
      </div>
      <div className="mt-4 space-y-2">
        {myListings.map((listing) => (
          <div key={listing.id} className="flex flex-wrap items-center gap-4 rounded-[1.4rem] border border-ink/[0.07] bg-white p-3">
            <img src={listing.image} alt="" className="size-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {listing.city}
                {listing.verified && <Verified compact />}
              </p>
              <p className="truncate text-[13px] font-semibold">{listing.title}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-soft">
                {listing.views} vues · {listing.messages} messages · {TND(listing.price)}/mois
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sage-soft px-2.5 py-1 text-[9.5px] font-semibold text-sage">
                Publiée
              </span>
              <Link to="/app/annonces" className="btn-ghost btn-sm">
                Gérer
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

