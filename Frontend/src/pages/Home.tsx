import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  CreditCard,
  FileSignature,
  Headphones,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sofa,
  Star,
  Truck,
  Users,
} from 'lucide-react'
import { ButtonLink } from '@/components/ButtonLink'
import { ListingCard } from '@/components/ListingCard'
import { Photo } from '@/components/Photo'
import { SectionHeading } from '@/components/ui'
import { faq, furniture, listings, photo, avatar, stats, TND, testimonials } from '@/lib/data'

const cityOptions = ['Toutes les villes', 'Tunis', 'La Marsa', 'Ariana', 'Sousse', 'Monastir', 'Sfax']
const budgetOptions = ['Tous budgets', '≤ 450 DT', '450 – 700 DT', '700 – 1 000 DT', '1 000 DT et +']
const kindOptions = ['Tous les types', 'Appartement', 'Studio', 'Chambre', 'Colocation']

const marquee = [
  { icon: ShieldCheck, label: 'Annonces vérifiées' },
  { icon: CreditCard, label: 'Paiements tracés' },
  { icon: FileSignature, label: 'Bail numérique' },
  { icon: Users, label: 'Matching colocation' },
  { icon: Sofa, label: 'Meubles d’occasion' },
  { icon: Truck, label: 'Déménagement local' },
  { icon: Headphones, label: 'Assistance 7j/7' },
]

const pathways = [
  {
    n: '01',
    title: 'Se loger',
    text: 'Des appartements et studios visités, vérifiés et comparés au prix du marché.',
    to: '/logements',
    image: photo('1522708323590-d24dbb6b0267'),
    tag: '4 200 annonces',
  },
  {
    n: '02',
    title: 'Partager',
    text: 'Un profil de compatibilité, pas un tirage au sort. Rencontre des colocataires qui te ressemblent.',
    to: '/colocation',
    image: photo('1554995207-c18c203602cb'),
    tag: 'Matching à 91 %',
  },
  {
    n: '03',
    title: 'S’installer',
    text: 'Meubles d’occasion à deux pas, déménagement au juste prix, contrat et paiements au même endroit.',
    to: '/meubles',
    image: photo('1555041469-a586c61ea9bc'),
    tag: 'Meubles dès 45 DT',
  },
]

const steps = [
  {
    n: '01',
    title: 'Crée ton profil',
    text: 'Budget, ville, campus, rythme de vie. Trois minutes, pas plus.',
  },
  {
    n: '02',
    title: 'Explore sans arnaque',
    text: 'Chaque annonce affiche son niveau de vérification, ses photos réelles et son historique.',
  },
  {
    n: '03',
    title: 'Visite et compare',
    text: 'Réserve une visite en ligne, pose tes questions, reçois une réponse sous 24 h.',
  },
  {
    n: '04',
    title: 'Signe et emménage',
    text: 'Bail numérique, échéancier, reçus archivés. Le propriétaire a le même tableau de bord que toi.',
  },
]

export function Home() {
  const navigate = useNavigate()
  const [city, setCity] = useState(cityOptions[0])
  const [budget, setBudget] = useState(budgetOptions[0])
  const [kind, setKind] = useState(kindOptions[0])
  const [filter, setFilter] = useState('Tous')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const featured = useMemo(() => {
    if (filter === 'Tous') return listings.slice(0, 3)
    return listings
      .filter((l) => l.kind.toLowerCase().startsWith(filter.toLowerCase().slice(0, 5)))
      .slice(0, 3)
  }, [filter])

  const search = () => {
    const params = new URLSearchParams()
    if (city !== cityOptions[0]) params.set('ville', city)
    if (budget !== budgetOptions[0]) params.set('budget', budget)
    if (kind !== kindOptions[0]) params.set('type', kind)
    navigate(`/logements?${params.toString()}`)
  }

  return (
    <>
      {/* ---------------- HERO (Forma Inspired Clean Aesthetic) ---------------- */}
      <section className="relative overflow-hidden pb-16 pt-8 sm:pt-14 lg:pb-24">
        <div className="mx-auto grid w-full max-w-[88rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-12">
          <div>
            {/* Top Minimalist Pill Badge (Forma Style) */}
            <div className="mb-6 flex flex-wrap items-center gap-3" data-reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-[11.5px] font-medium text-ink shadow-sm backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Plateforme collaborative étudiante · Tunisie</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
                <Star className="size-3.5 fill-clay text-clay" />
                4,8 / 5 · 2 140 avis vérifiés
              </span>
            </div>

            {/* Bold, Clean Typography */}
            <h1
              className="display text-[clamp(2.6rem,5vw,4.4rem)] font-bold tracking-tight text-ink"
              data-reveal
              style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
            >
              Le logement étudiant,
              <br />
              <span className="font-serif font-normal italic text-clay-deep">
                simple, vérifié et sans stress.
              </span>
            </h1>

            <p
              className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft"
              data-reveal
              style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            >
              Studios près des campus, colocations compatibles, meubles d'occasion et déménagement solidaire. Une communauté universitaire unifiée, sans frais d'agence ni mauvaises surprises.
            </p>

            {/* Direct Dual CTAs (Forma signature style) */}
            <div
              className="mt-7 flex flex-wrap items-center gap-3"
              data-reveal
              style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
            >
              <ButtonLink to="/logements" variant="ink" className="btn-md rounded-full px-6 shadow-sm">
                Trouver un logement
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                to="/app/annonces/nouvelle"
                variant="ghost"
                className="btn-md rounded-full border border-ink/15 bg-white px-5 shadow-sm transition hover:border-ink/30 hover:bg-cream"
              >
                <Plus className="size-4 text-clay-deep" />
                Déposer une annonce ou un service
              </ButtonLink>
            </div>

            {/* Floating Search Bar */}
            <div
              className="mt-8 rounded-[1.6rem] border border-ink/[0.08] bg-white p-2 shadow-[0_18px_50px_-24px_rgb(34_33_31/0.2)]"
              data-reveal
              style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
            >
              <div className="grid gap-1 md:grid-cols-[1fr_1fr_1fr_auto]">
                <Field label="Où" value={city} onChange={setCity} options={cityOptions} icon={<MapPin className="size-3.5" />} />
                <Field label="Budget" value={budget} onChange={setBudget} options={budgetOptions} />
                <Field label="Type" value={kind} onChange={setKind} options={kindOptions} />
                <button
                  type="button"
                  onClick={search}
                  className="btn-primary m-1 min-h-[3.6rem] rounded-[1.15rem] px-6"
                >
                  <Search className="size-4" />
                  <span className="md:hidden lg:inline">Rechercher</span>
                </button>
              </div>
            </div>

            {/* Social Proof & Guarantees */}
            <div
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
              data-reveal
              style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
            >
              <div className="flex items-center">
                {[44, 32, 15, 47].map((n, i) => (
                  <img
                    key={n}
                    src={avatar(n)}
                    alt=""
                    className="size-8 rounded-full border-2 border-cream object-cover"
                    style={{ marginLeft: i === 0 ? 0 : -10 }}
                  />
                ))}
                <span className="ml-2.5 text-[12.5px] font-medium text-ink-soft">
                  <strong className="text-ink">9 800+</strong> étudiants déjà logés
                </span>
              </div>
              <span className="hidden h-4 w-px bg-ink/15 sm:block" />
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft">
                <BadgeCheck className="size-4 text-sage" />
                Bail certifié & zéro frais cachés
              </span>
            </div>
          </div>

          {/* Hero Visual Showcase (Forma Inspired Clean Showcase) */}
          <div
            className="relative mx-auto w-full max-w-[34rem] lg:max-w-none"
            data-reveal
            style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
          >
            <div className="relative overflow-hidden rounded-[2.2rem] border border-ink/[0.08] bg-white p-3 shadow-[0_30px_70px_-30px_rgb(34_33_31/0.25)]">
              <div className="relative overflow-hidden rounded-[1.8rem]">
                <Photo
                  src={photo('1522708323590-d24dbb6b0267', 1200)}
                  alt="Logement étudiant vérifié à La Marsa"
                  className="aspect-[1.1] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                {/* Verified badge inside image */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-md backdrop-blur">
                  <BadgeCheck className="size-3.5 text-sage" />
                  <span>Annonce vérifiée TSH</span>
                </div>

                {/* Info Card at bottom of photo */}
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lift backdrop-blur-md">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      La Marsa · Proche Campus
                    </span>
                    <p className="mt-0.5 text-[15px] font-semibold text-ink">Studio moderne & lumineux</p>
                    <p className="mt-0.5 text-[11px] text-ink-soft">Meublé · Wifi inclus · Disponible</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-ink-soft">Loyer</span>
                    <p className="text-[18px] font-bold tracking-tight text-clay-deep">
                      {TND(650)}
                      <span className="text-[11px] font-normal text-ink-soft"> /mois</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <section className="border-y border-ink/[0.07] bg-cream-deep/50 py-4">
        <div className="marquee">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((item, i) => (
              <span
                key={i}
                className="mx-3 inline-flex items-center gap-2 whitespace-nowrap px-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft"
              >
                <item.icon className="size-4 text-clay" />
                {item.label}
                <span className="ml-5 size-1 rounded-full bg-ink/20" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              className="border-l border-ink/12 pl-5"
            >
              <p className="text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-none tracking-[-0.055em] [word-spacing:0.14em]">
                {stat.value}
              </p>
              <p className="mt-2 text-[12.5px] font-medium text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PATHWAYS ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 pb-8 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Une plateforme, trois façons de t’installer"
          title={
            <>
              Tout ce qu’il te faut,
              <br />
              <span className="font-serif italic text-clay-deep">au même endroit.</span>
            </>
          }
          description="Chercher un logement ne devrait pas vouloir dire jongler entre dix groupes Facebook et trois inconnus au téléphone."
          action={
            <ButtonLink to="/logements" variant="ghost">
              Voir toutes les annonces
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pathways.map((path, i) => (
            <ButtonLink
              key={path.n}
              to={path.to}
              variant="ghost"
              className="group !block !min-h-0 !rounded-[1.75rem] !border-ink/[0.06] !bg-white !p-2.5 !text-left"
            >
              <div className="relative overflow-hidden rounded-[1.4rem]">
                <Photo
                  src={path.image}
                  alt={path.title}
                  rounded="rounded-[1.4rem]"
                  className="aspect-[4/3.4]"
                  imgClassName="group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
                  {path.tag}
                </span>
                <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-ink text-cream transition-colors group-hover:bg-clay group-hover:text-ink">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="flex items-start gap-4 px-3 pb-4 pt-5" data-reveal style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}>
                <span className="pt-1 text-[11px] font-semibold text-ink-soft">{path.n}</span>
                <div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.035em]">{path.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{path.text}</p>
                </div>
              </div>
            </ButtonLink>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED LISTINGS ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Sélection de la semaine"
          title={
            <>
              Des logements qu’on a
              <br />
              <span className="font-serif italic text-clay-deep">vraiment visités.</span>
            </>
          }
          action={
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Appartement', 'Studio', 'Colocation'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`chip ${filter === item ? 'chip-active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing, i) => (
            <div key={listing.id} data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ButtonLink to="/logements" variant="ink">
            Explorer les 4 200 annonces
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>

      {/* ---------------- COLOCATION MATCH ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-cream sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-clay/20 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div data-reveal>
              <p className="eyebrow !text-cream/45">Colocation · matching</p>
              <h2 className="display mt-4 text-[clamp(2.1rem,4.4vw,3.7rem)]">
                On ne choisit pas
                <br />
                <span className="font-serif italic text-clay">au hasard.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/60">
                Douze questions sur ton rythme de vie, ta propreté, tes invités et ton budget. Le
                service Colocation calcule un score de compatibilité et ne te montre que les profils
                au-dessus de 70 %.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <ButtonLink to="/colocation" variant="primary">
                  Trouver ma colocation
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
                <ButtonLink to="/comment-ca-marche#matching" variant="light">
                  Comment ça marche
                </ButtonLink>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  ['12', 'questions'],
                  ['70 %', 'score minimum'],
                  ['3 j', 'délai moyen'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-[24px] font-semibold tracking-[-0.04em]">{value}</p>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-cream/45">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
              <div className="rounded-[1.75rem] bg-cream p-5 text-ink shadow-lift">
                <div className="flex items-center gap-4">
                  <img
                    src={avatar(44)}
                    alt="Yasmine, profil de colocation"
                    className="size-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[18px] font-semibold tracking-[-0.02em]">Yasmine, 21</p>
                      <BadgeCheck className="size-4 text-sage" />
                    </div>
                    <p className="text-[12.5px] text-ink-soft">Médecine · 3e année · Sousse</p>
                  </div>
                  <MatchRing value={94} />
                </div>

                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
                  « Lève-tôt, cuisine beaucoup, cherche une colocation calme pour préparer les
                  partiels. »
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['Calme', 'Non-fumeuse', 'Sans animaux', 'Budget 450 DT'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-ink/10 px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                  <div className="flex -space-x-2">
                    {[32, 15].map((n) => (
                      <img
                        key={n}
                        src={avatar(n)}
                        alt=""
                        className="size-7 rounded-full border-2 border-cream object-cover"
                      />
                    ))}
                    <span className="grid size-7 place-items-center rounded-full border-2 border-cream bg-cream-deep text-[10px] font-semibold">
                      +2
                    </span>
                  </div>
                  <span className="text-[11.5px] font-medium text-ink-soft">
                    Appartement à Khezama Est
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-lift">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Compatibilité
                </p>
                <p className="mt-1 text-[20px] font-semibold leading-none tracking-[-0.04em] text-sage">
                  Très forte
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MARKETPLACE ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Marketplace"
          title={
            <>
              Meuble ton studio
              <br />
              <span className="font-serif italic text-clay-deep">pour moins de 500 DT.</span>
            </>
          }
          description="Des meubles d’occasion vérifiés, vendus par des étudiants qui déménagent. Livraison possible avec le service Transport."
          action={
            <ButtonLink to="/meubles" variant="ghost">
              Explorer la marketplace
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {furniture.slice(0, 4).map((item, i) => (
            <ButtonLink
              key={item.id}
              to="/meubles"
              variant="ghost"
              className="group !block !min-h-0 !rounded-[1.5rem] !border-ink/[0.06] !bg-white !p-2 !text-left"
            >
              <div data-reveal style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                <Photo
                  src={item.image}
                  alt={item.title}
                  rounded="rounded-[1.15rem]"
                  className="aspect-[4/3.2]"
                  imgClassName="group-hover:scale-[1.05]"
                />
                <div className="px-2 pb-3 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {item.condition}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13.5px] font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-[15px] font-semibold text-clay-deep">{TND(item.price)}</span>
                    {item.oldPrice && (
                      <span className="text-[11px] text-ink-soft line-through">{TND(item.oldPrice)}</span>
                    )}
                  </p>
                </div>
              </div>
            </ButtonLink>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="border-y border-ink/[0.07] bg-white/50">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-20 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal>
              <p className="eyebrow">Le parcours</p>
              <h2 className="display mt-4 text-[clamp(2.1rem,4.4vw,3.7rem)]">
                Quatre étapes.
                <br />
                <span className="font-serif italic text-clay-deep">Zéro stress.</span>
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                Le même parcours pour les étudiants et les propriétaires. Chaque étape laisse une
                trace, chaque engagement est écrit.
              </p>
              <ButtonLink to="/comment-ca-marche" variant="ink" className="mt-8">
                Voir le détail du parcours
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>

            <div>
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
                  className="group flex items-start gap-5 border-t border-ink/10 py-6 last:border-b sm:gap-8"
                >
                  <span className="w-8 shrink-0 pt-1 text-[12px] font-semibold text-ink-soft">
                    {step.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[19px] font-semibold tracking-[-0.025em] transition-colors group-hover:text-clay-deep">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
                      {step.text}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-ink/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-20 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Ils ont emménagé"
          title={
            <>
              Des histoires,
              <br />
              <span className="font-serif italic text-clay-deep">pas des annonces.</span>
            </>
          }
          action={
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink-soft">
              <Star className="size-4 fill-clay text-clay" />
              4,8 / 5 sur 2 140 avis
            </div>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
              className="flex flex-col rounded-[1.75rem] border border-ink/[0.06] bg-white p-6"
            >
              <div className="mb-5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-3.5 fill-clay text-clay" />
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/85">
                « {item.quote} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/[0.07] pt-5">
                <img src={item.avatar} alt="" className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-[13.5px] font-semibold">{item.name}</p>
                  <p className="text-[11.5px] text-ink-soft">{item.detail}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="mx-auto w-full max-w-[88rem] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="eyebrow">Questions fréquentes</p>
            <h2 className="display mt-4 text-[clamp(2.1rem,4.2vw,3.4rem)]">
              Tout est clair,
              <br />
              <span className="font-serif italic text-clay-deep">sauf peut-être ça.</span>
            </h2>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              Une autre question ? Écris-nous à bonjour@tsh.tn, on répond sous 24 h.
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
                  <span className="text-[16px] font-semibold tracking-[-0.015em]">{item.q}</span>
                  <span
                    className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-300 ${
                      openFaq === i ? 'rotate-180 border-ink bg-ink text-cream' : ''
                    }`}
                  >
                    <ChevronDown className="size-3.5" />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-400 ease-out ${
                    openFaq === i ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden pr-10 text-[14px] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-clay px-6 py-14 sm:px-12 lg:py-20"
          data-reveal
        >
          <div className="absolute -right-20 -top-20 size-72 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-24 left-1/3 size-64 rounded-full border-[30px] border-ink/5" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/50">
              Ton prochain chez-toi
            </p>
            <h2 className="display mt-5 text-[clamp(2.3rem,5vw,4.2rem)] text-ink">
              Commence par une visite.
              <br />
              <span className="font-serif italic">Le reste suivra.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink/65">
              Crée ton profil en trois minutes et reçois une sélection d’annonces vérifiées adaptée à
              ton budget et à ton campus.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <ButtonLink to="/connexion" variant="ink">
                Créer mon profil
                <ArrowUpRight className="size-4" />
              </ButtonLink>
              <ButtonLink to="/logements" variant="light">
                Explorer sans compte
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  icon?: React.ReactNode
}) {
  return (
    <label className="group relative flex min-h-[3.6rem] cursor-pointer flex-col justify-center rounded-[1.15rem] px-4 py-2 transition-colors hover:bg-cream/70">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {icon}
        {label}
      </span>
      <span className="mt-1 flex items-center gap-1 whitespace-nowrap text-[13.5px] font-semibold text-ink">
        {value}
        <ChevronDown className="size-3.5 shrink-0 text-ink-soft transition-transform group-focus-within:rotate-180" />
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function MatchRing({ value }: { value: number }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#eae5dc" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#356b49"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[13px] font-semibold text-sage">
        {value}%
      </span>
    </div>
  )
}
