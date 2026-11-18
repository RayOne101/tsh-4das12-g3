import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Maximize,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Train,
  Wallet,
} from 'lucide-react'
import { ListingCard } from '@/components/ListingCard'
import { Modal } from '@/components/Modal'
import { Photo } from '@/components/Photo'
import { Rating } from '@/components/ui'
import { ButtonLink } from '@/components/ButtonLink'
import { listings, photo, TND, avatar } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const reviews = [
  {
    name: 'Nour A.',
    avatar: avatar(25),
    date: 'Octobre 2026',
    rating: 5,
    text: "Visite très bien organisée, l’appartement correspondait exactement aux photos. Amel a répondu à toutes mes questions sur les charges avant la signature.",
  },
  {
    name: 'Bilel M.',
    avatar: avatar(11),
    date: 'Septembre 2026',
    rating: 5,
    text: 'Quartier calme et vraiment proche du TGM. Le bail numérique et l’échéancier ont évité les discussions pénibles en fin de mois.',
  },
  {
    name: 'Sarra K.',
    avatar: avatar(20),
    date: 'Août 2026',
    rating: 4,
    text: 'Très bon rapport qualité-prix pour La Marsa. Un peu de bruit le week-end côté rue, mais rien de bloquant.',
  },
]

export function HousingDetail() {
  const { id } = useParams()
  const listing = listings.find((item) => item.id === id)
  const { toast } = useToast()
  const [favorite, setFavorite] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [slot, setSlot] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')

  if (!listing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">Annonce introuvable</p>
        <h1 className="display mt-4 text-4xl">Cette annonce n’existe plus.</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Elle a peut-être été retirée par son propriétaire ou suspendue par la modération.
        </p>
        <ButtonLink to="/logements" variant="ink" className="mt-6">
          <ArrowLeft className="size-4" />
          Retour aux logements
        </ButtonLink>
      </div>
    )
  }

  const similar = listings.filter((item) => item.id !== listing.id).slice(0, 3)
  const extras = [
    photo('1600210492486-724fe5c67fb0', 900),
    photo('1540518614846-7eded433c457', 900),
    photo('1617806118233-18e1de247200', 900),
    photo('1493663284031-b7e3aefcae8e', 900),
  ]
  const gallery = [...listing.images]
  while (gallery.length < 5) gallery.push(extras[gallery.length % extras.length])
  const listingRef = `TSH-${1040 + listings.indexOf(listing) * 7}`
  const dates = ['Sam. 22 nov.', 'Dim. 23 nov.', 'Mar. 25 nov.', 'Jeu. 27 nov.']
  const slots = ['09:00', '10:30', '14:00', '16:30', '18:00']

  return (
    <>
      <div className="mx-auto w-full max-w-[88rem] px-5 pt-8 sm:px-8 lg:px-12">
        <nav className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Retour aux logements
          </Link>
        </nav>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {listing.badge && (
                <span className="rounded-full bg-clay-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-clay-deep">
                  {listing.badge}
                </span>
              )}
              <span className="text-[11.5px] font-medium text-ink-soft">
                Réf. {listingRef}
              </span>
            </div>
            <h1 className="display mt-4 max-w-3xl text-[clamp(1.9rem,3.6vw,3rem)]">
              {listing.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-clay" />
                {listing.district}, {listing.city}
              </span>
              <Rating value={listing.rating} count={listing.reviews} />
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                Disponible le{' '}
                {new Date(listing.available)
                  .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                  .replace(/^1 /, '1er ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFavorite((v) => !v)
                toast(favorite ? 'Retiré de tes favoris' : 'Ajouté à tes favoris', 'info')
              }}
              className="btn-ghost btn-sm"
            >
              <Heart className={cn('size-4', favorite && 'fill-clay text-clay')} />
              {favorite ? 'Enregistré' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => toast('Lien copié dans le presse-papiers', 'success')}
              className="btn-ghost btn-sm"
            >
              <Share2 className="size-4" />
              Partager
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-7 grid gap-2 overflow-hidden rounded-[1.75rem] md:grid-cols-4 md:grid-rows-2">
          <div className="relative aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto md:h-full">
            <Photo
              src={listing.images[0]}
              alt={listing.title}
              rounded="rounded-none"
              className="size-full"
            />
            <button
              type="button"
              onClick={() => toast('Galerie complète — prototype', 'info')}
              className="absolute bottom-3 right-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold backdrop-blur transition hover:bg-white md:hidden"
            >
              Voir les {gallery.length} photos
            </button>
          </div>
          {gallery.slice(1, 5).map((image, i) => (
            <div key={image} className={cn('relative hidden md:block', i === 1 && 'md:rounded-tr-[1.75rem]', i === 3 && 'md:rounded-br-[1.75rem]')}>
              <Photo src={image} alt={`${listing.title} — photo ${i + 2}`} rounded="rounded-none" className="h-full" />
              {i === 3 && (
                <button
                  type="button"
                  onClick={() => toast('Galerie complète — prototype', 'info')}
                  className="absolute bottom-3 right-3 rounded-full bg-white/92 px-3 py-1.5 text-[11.5px] font-semibold backdrop-blur transition hover:bg-white"
                >
                  Voir les {gallery.length} photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.55fr_0.85fr] lg:px-12">
        <div>
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: BedDouble, label: `${listing.rooms} pièce${listing.rooms > 1 ? 's' : ''}` },
              { icon: Maximize, label: `${listing.surface} m²` },
              { icon: Bath, label: `${listing.rooms > 1 ? 2 : 1} salle${listing.rooms > 1 ? 's' : ''} d’eau` },
              { icon: Sparkles, label: listing.floor },
            ].map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-ink/[0.07] bg-white px-4 py-3.5">
                <fact.icon className="size-4 text-clay" />
                <p className="mt-2 text-[12.5px] font-semibold">{fact.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="text-[20px] font-semibold tracking-[-0.03em]">Le logement</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{listing.description}</p>
          </section>

          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.03em]">Ce que tu trouveras sur place</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {listing.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2.5 text-[13.5px] text-ink/80">
                  <span className="grid size-6 place-items-center rounded-full bg-sage-soft text-sage">
                    <Check className="size-3.5" />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.03em]">L’emplacement</h2>
            <p className="mt-2 text-[13.5px] text-ink-soft">
              {listing.district} · {listing.city}
            </p>
            <div className="relative mt-4 h-64 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-[#e8e1d4]">
              <svg className="absolute inset-0 size-full" viewBox="0 0 800 300" aria-hidden="true">
                <g stroke="#d3c9b8" strokeWidth="9" fill="none">
                  <path d="M-20 90 L820 60" />
                  <path d="M-20 210 L820 240" />
                  <path d="M180 -20 L140 320" />
                  <path d="M540 -20 L590 320" />
                </g>
                <g stroke="#c3b8a4" strokeWidth="3.5" fill="none">
                  <path d="M340 -20 L380 320" />
                  <path d="M-20 150 L820 150" />
                </g>
                <path d="M0 260 Q200 220 400 270 T800 250 L800 300 L0 300 Z" fill="#cfd9cd" opacity="0.75" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="grid size-12 place-items-center rounded-full bg-clay text-ink shadow-lift ring-4 ring-white/70">
                  <MapPin className="size-5" />
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                TGM à 6 min · Campus à 10 min · Épicerie à 2 min
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Train, label: 'TGM La Marsa', value: '6 min à pied' },
                { icon: MapPin, label: 'Campus', value: '10 min à pied' },
                { icon: Wallet, label: 'Supermarché', value: '2 min à pied' },
              ].map((poi) => (
                <div key={poi.label} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
                  <poi.icon className="size-4 text-ink-soft" />
                  <div>
                    <p className="text-[11.5px] font-semibold">{poi.label}</p>
                    <p className="text-[10.5px] text-ink-soft">{poi.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Host */}
          <section className="mt-10 rounded-[1.6rem] border border-ink/[0.07] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start gap-4">
              <img src={listing.owner.avatar} alt="" className="size-14 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[17px] font-semibold tracking-[-0.02em]">{listing.owner.name}</h2>
                </div>
                <p className="mt-1 text-[12.5px] text-ink-soft">
                  Propriétaire depuis {listing.owner.since} · {listing.owner.responseTime}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-3.5 text-sage" /> Identité vérifiée
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-sage" /> Bien contrôlé
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-3.5 fill-clay text-clay" /> {listing.rating} / 5
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => setContactOpen(true)} className="btn-ghost btn-sm">
                <MessageCircle className="size-4" />
                Écrire
              </button>
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-10 border-t border-ink/10 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                Avis des locataires ({listing.reviews})
              </h2>
              <Rating value={listing.rating} />
            </div>
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <article key={review.name} className="rounded-[1.4rem] border border-ink/[0.07] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt="" className="size-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold">{review.name}</p>
                      <p className="text-[11px] text-ink-soft">{review.date}</p>
                    </div>
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn('size-3', i < review.rating ? 'fill-clay text-clay' : 'text-ink/15')}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{review.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky booking */}
        <aside>
          <div className="sticky top-24 rounded-[1.75rem] border border-ink/[0.07] bg-white p-5 sm:p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[32px] font-semibold leading-none tracking-[-0.055em]">
                  {TND(listing.price)}
                  <span className="ml-1 text-[13px] font-normal text-ink-soft">/ mois</span>
                </p>
                <p className="mt-1.5 text-[11.5px] text-ink-soft">Charges comprises · sans frais d’agence</p>
              </div>
              <span className="rounded-full bg-sage-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sage">
                Disponible
              </span>
            </div>

            <div className="my-5 h-px bg-ink/[0.08]" />

            <dl className="space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Loyer mensuel</dt>
                <dd className="font-semibold">{TND(listing.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Dépôt de garantie</dt>
                <dd className="font-semibold">{TND(listing.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Frais de dossier TSH</dt>
                <dd className="font-semibold text-sage">Offerts</dd>
              </div>
            </dl>

            <button type="button" onClick={() => setVisitOpen(true)} className="btn-primary mt-5 w-full">
              <CalendarDays className="size-4" />
              Réserver une visite
            </button>
            <button type="button" onClick={() => setContactOpen(true)} className="btn-ghost mt-2 w-full">
              <MessageCircle className="size-4" />
              Poser une question
            </button>

            <ul className="mt-5 space-y-2.5 border-t border-ink/[0.08] pt-4">
              {[
                'Aucun paiement avant la visite',
                'Annonce contrôlée par TSH',
                'Bail numérique et reçus inclus',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[11.5px] text-ink-soft">
                  <Check className="size-3.5 shrink-0 text-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-[1.4rem] bg-clay-soft p-5">
            <p className="text-[12px] font-semibold text-clay-deep">Besoin d’un coup de main ?</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-clay-deep/80">
              Un conseiller TSH peut t’accompagner dans la visite et la vérification du bail.
            </p>
            <button type="button" onClick={() => toast('Un conseiller te rappelle sous 24 h', 'success')} className="link-underline mt-3 text-[11.5px] text-clay-deep">
              Être rappelé
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </aside>
      </div>

      {/* Similar */}
      <section className="mx-auto w-full max-w-[88rem] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)]">
            Dans le même esprit
          </h2>
          <Link to="/logements" className="link-underline text-[12.5px]">
            Tout voir
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => (
            <ListingCard key={item.id} listing={item} compact />
          ))}
        </div>
      </section>

      {/* Visit modal */}
      <Modal
        open={visitOpen}
        onClose={() => {
          setVisitOpen(false)
          setSent(false)
        }}
        title={sent ? 'Demande envoyée' : 'Réserver une visite'}
      >
        {sent ? (
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-sage-soft text-sage">
              <Check className="size-7" />
            </div>
            <p className="mt-4 text-[15px] font-semibold">
              {slot} · {listing.owner.name.split(' ')[0]} est prévenu(e).
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Tu recevras une confirmation dans ta messagerie TSH. La visite est gratuite et sans
              engagement.
            </p>
            <ButtonLink to="/app/messages" variant="ink" className="mt-5 w-full">
              Ouvrir la messagerie
            </ButtonLink>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-ink-soft">
              Choisis un créneau. La visite dure environ 30 minutes et ne t’engage à rien.
            </p>
            <p className="field-label mt-5">Jour</p>
            <div className="grid grid-cols-2 gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-[12.5px] font-semibold transition',
                    slot?.startsWith(date)
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/12 bg-white text-ink hover:border-ink/30',
                  )}
                  onClick={() => setSlot(`${date} · ${slot?.split(' · ')[1] ?? '09:00'}`)}
                >
                  {date}
                </button>
              ))}
            </div>
            <p className="field-label mt-5">Heure</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((time) => {
                const active = slot?.endsWith(time)
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSlot(`${slot?.split(' · ')[0] ?? dates[0]} · ${time}`)}
                    className={cn(
                      'rounded-full border px-3.5 py-2 text-[12px] font-semibold transition',
                      active
                        ? 'border-clay bg-clay text-ink'
                        : 'border-ink/12 bg-white text-ink-soft hover:border-ink/30 hover:text-ink',
                    )}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 rounded-xl bg-white p-3 text-[11.5px] text-ink-soft">
              <p className="font-semibold text-ink">{listing.title}</p>
              <p className="mt-1">
                {listing.district}, {listing.city} · {TND(listing.price)} / mois
              </p>
            </div>
            <button
              type="button"
              disabled={!slot}
              onClick={() => {
                setSent(true)
                toast('Demande de visite envoyée', 'success')
              }}
              className="btn-primary mt-5 w-full"
            >
              Confirmer le créneau
            </button>
            <p className="mt-3 text-center text-[10.5px] text-ink-soft">
              Aucun paiement ne sera demandé avant la visite.
            </p>
          </>
        )}
      </Modal>

      {/* Contact modal */}
      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={`Écrire à ${listing.owner.name.split(' ')[0]}`}>
        <p className="text-[13px] text-ink-soft">
          Ta question part directement dans la messagerie TSH. Les échanges hors plateforme sont
          déconseillés.
        </p>
        <div className="mt-4 rounded-xl bg-white p-3 text-[11.5px] text-ink-soft">
          <p className="font-semibold text-ink">{listing.title}</p>
          <p className="mt-1">Réf. {listingRef}</p>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Bonjour, je suis intéressé(e) par ce logement et j’aimerais savoir si…"
          className="field mt-4 h-auto py-3"
        />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setContactOpen(false)
              toast('Message envoyé', 'success')
            }}
            className="btn-primary flex-1"
          >
            Envoyer
          </button>
          <button type="button" onClick={() => setContactOpen(false)} className="btn-ghost">
            Annuler
          </button>
        </div>
      </Modal>
    </>
  )
}
