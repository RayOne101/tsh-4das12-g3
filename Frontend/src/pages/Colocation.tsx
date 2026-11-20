import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Heart,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  SearchX,
  SlidersHorizontal,
  User,
  Users,
  X,
} from 'lucide-react'
import { ListingCard } from '@/components/ListingCard'
import { ButtonLink } from '@/components/ButtonLink'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/ui'
import { MyListingsInline } from '@/components/MyListingsInline'
import { colocProfiles, listings, TND, type ColocProfile } from '@/lib/data'
import { useAuth } from '@/lib/auth'
import { useFavorites } from '@/lib/favorites'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const cities = ['Toutes', 'Tunis', 'La Marsa', 'Ariana', 'Sousse', 'Monastir', 'Sfax']
const budgets = [
  { label: '≤ 350 DT', min: 0, max: 350 },
  { label: '350 – 500 DT', min: 350, max: 500 },
  { label: '500 – 700 DT', min: 500, max: 700 },
  { label: '700 DT et +', min: 700, max: 99999 },
]
const amenities = ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Climatisation', 'Balcon', 'Machine à laver']

const quiz = [
  {
    q: 'Quel est ton rythme de vie ?',
    options: ['Lève-tôt, couche-tôt', 'Flexible', 'Nocturne assumé'],
  },
  {
    q: 'Comment vis-tu la propreté ?',
    options: ['Tout doit être rangé', 'Propre sans être maniaque', 'Le désordre ne me gêne pas'],
  },
  {
    q: 'Les invités à la maison ?',
    options: ['Jamais ou presque', 'Occasionnellement', 'Souvent, maison ouverte'],
  },
  {
    q: 'Ton budget par mois, charges comprises ?',
    options: ['≤ 450 DT', '450 – 700 DT', '700 DT et +'],
  },
]

export function Colocation() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [myListingsOpen, setMyListingsOpen] = useState(false)
  const [city, setCity] = useState('Toutes')
  const [budget, setBudget] = useState<string | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sort, setSort] = useState('Pertinence')
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [cols, setCols] = useState<2 | 3 | 4>(2)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Quiz state
  const [quizOpen, setQuizOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<number | null>(null)

  const colocListings = useMemo(() => {
    let items = listings.filter((l) => l.kind === 'colocation')
    if (onlyFavorites) items = items.filter((l) => favorites.includes(l.id))
    if (city !== 'Toutes') items = items.filter((l) => l.city === city)
    if (selectedAmenities.length) {
      items = items.filter((l) => selectedAmenities.every((a) => l.amenities.includes(a)))
    }
    if (budget) {
      const range = budgets.find((b) => b.label === budget)
      if (range) items = items.filter((l) => l.price >= range.min && l.price <= range.max)
    }

    if (sort === 'Prix croissant') items = [...items].sort((a, b) => a.price - b.price)
    if (sort === 'Prix décroissant') items = [...items].sort((a, b) => b.price - a.price)
    if (sort === 'Mieux notés') items = [...items].sort((a, b) => b.rating - a.rating)
    return items
  }, [city, budget, selectedAmenities, sort, onlyFavorites, favorites])

  const reset = () => {
    setCity('Toutes')
    setBudget(null)
    setSelectedAmenities([])
    setOnlyFavorites(false)
  }

  const toggleAmenity = (value: string) =>
    setSelectedAmenities((current) =>
      current.includes(value) ? current.filter((a) => a !== value) : [...current, value],
    )

  const activeCount =
    (onlyFavorites ? 1 : 0) +
    (city !== 'Toutes' ? 1 : 0) +
    (budget ? 1 : 0) +
    selectedAmenities.length

  const answer = (option: number) => {
    const next = [...answers, option]
    setAnswers(next)
    if (step === quiz.length - 1) {
      const score = Math.min(97, 74 + next.filter((v) => v === 1).length * 6 + (next[0] === 1 ? 4 : 0))
      setResult(score)
    } else {
      setStep(step + 1)
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers([])
    setResult(null)
  }

  const filters = (
    <div className="space-y-6">
      {/* Favoris filter toggle directly in sidebar */}
      <div>
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-ink/[0.08] bg-cream/60 px-3.5 py-2.5 transition hover:border-rust/30 hover:bg-cream">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
            <Heart className={cn('size-4 transition-colors', onlyFavorites ? 'fill-rust text-rust' : 'text-ink-soft')} />
            Mes favoris
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-bold shadow-xs', onlyFavorites ? 'bg-rust text-white' : 'bg-white text-ink-soft')}>
            {favorites.filter((id) => listings.find((l) => l.id === id && l.kind === 'colocation')).length}
          </span>
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>
      {/* City */}
      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Ville
        </p>
        <div className="flex flex-wrap gap-1.5">
          {cities.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCity(value)}
              className={cn('chip', city === value && 'chip-active')}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Budget mensuel
        </p>
        <div className="space-y-1">
          {budgets.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-[12.5px] text-ink-soft transition hover:text-ink"
            >
              <span
                className={cn(
                  'grid size-4 place-items-center rounded-full border transition-colors',
                  budget === range.label ? 'border-ink bg-ink text-cream' : 'border-ink/25',
                )}
              >
                {budget === range.label && <Check className="size-2.5" />}
              </span>
              <input
                type="radio"
                name="budget-coloc"
                className="sr-only"
                checked={budget === range.label}
                onChange={() => setBudget(budget === range.label ? null : range.label)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Équipements
        </p>
        <div className="space-y-1">
          {amenities.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 py-0.5 text-[12px] text-ink-soft transition hover:text-ink"
            >
              <span
                className={cn(
                  'grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors',
                  selectedAmenities.includes(value) ? 'border-ink bg-ink text-cream' : 'border-ink/25',
                )}
              >
                {selectedAmenities.includes(value) && <Check className="size-2.5" />}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedAmenities.includes(value)}
                onChange={() => toggleAmenity(value)}
              />
              {value}
            </label>
          ))}
        </div>
      </div>

      {/* Compatibility test card */}
      <div className="rounded-[1.4rem] bg-sage-soft/70 p-4">
        <div className="flex items-center gap-2 text-sage">
          <Users className="size-4" />
          <p className="text-[11.5px] font-semibold">Test de compatibilité</p>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
          Trouve des colocs alignés sur ton rythme et tes habitudes en 3 minutes.
        </p>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="btn-ink btn-sm mt-3 w-full"
        >
          Faire le test
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-ink/10 py-2 text-[12px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink"
        >
          <X className="size-3.5" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* ── Top Header matching HousingSearch exactly ── */}
      <section className="border-b border-ink/[0.07] bg-cream">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
          <p className="eyebrow mb-2">Colocation · matching</p>
          <h1 className="display text-[clamp(2.2rem,4.6vw,3.8rem)]">
            Trouve ta colocation <span className="font-serif italic text-clay-deep">idéale.</span>
          </h1>
        </div>
      </section>

      {/* ── Main content with filters sidebar & cards grid ── */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[16rem_1fr] lg:grid-cols-[17rem_1fr]">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-[1.6rem] border border-ink/[0.06] bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold">Filtres</p>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[10px] font-semibold text-clay-deep">
                      {activeCount}
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] font-medium text-ink-soft">
                  <strong className="text-ink">{colocListings.length}</strong> disponibles
                </span>
              </div>
              {filters}
            </div>
          </aside>

          {/* Results column */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Left side: Mes annonces + Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setMyListingsOpen((v) => !v)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition shadow-sm',
                      myListingsOpen
                        ? 'bg-ink text-cream'
                        : 'border border-ink/10 bg-white text-ink hover:border-ink/25 hover:bg-cream',
                    )}
                  >
                    <User className="size-3.5" />
                    {myListingsOpen ? 'Retour aux colocations' : 'Mes annonces'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="btn-ghost btn-sm md:hidden"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filtres {activeCount > 0 && `(${activeCount})`}
                </button>
                {city !== 'Toutes' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-cream">
                    {city}
                    <button type="button" onClick={() => setCity('Toutes')}>
                      <X className="size-3 opacity-60 hover:opacity-100" />
                    </button>
                  </span>
                )}
                {budget && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-cream">
                    {budget}
                    <button type="button" onClick={() => setBudget(null)}>
                      <X className="size-3 opacity-60 hover:opacity-100" />
                    </button>
                  </span>
                )}
                {selectedAmenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-cream"
                  >
                    {a}
                    <button type="button" onClick={() => toggleAmenity(a)}>
                      <X className="size-3 opacity-60 hover:opacity-100" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Right side: Colonnes first, then Grille/Carte, then Trier par */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Columns toggle swapped BEFORE Grille/Carte */}
                {view === 'grid' && !myListingsOpen && (
                  <div className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white p-1 sm:flex">
                    <span className="pl-2.5 pr-1 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                      Colonnes :
                    </span>
                    {([2, 3, 4] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCols(n)}
                        className={cn(
                          'flex size-7 items-center justify-center rounded-full text-[11.5px] font-bold transition-colors',
                          cols === n ? 'bg-ink text-cream shadow-sm' : 'text-ink-soft hover:bg-cream hover:text-ink',
                        )}
                        title={`${n} cartes par ligne`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}

                {/* View toggle (Grille / Carte) */}
                {!myListingsOpen && (
                  <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setView('grid')}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
                        view === 'grid' ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      <LayoutGrid className="size-3.5" /> Grille
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('map')}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
                        view === 'map' ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      <MapIcon className="size-3.5" /> Carte
                    </button>
                  </div>
                )}

                {/* Sort */}
                {!myListingsOpen && (
                  <label className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                    Trier par
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-xl border border-ink/10 bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-ink focus:border-clay focus:outline-none"
                    >
                      {['Pertinence', 'Prix croissant', 'Prix décroissant', 'Mieux notés'].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>

            {myListingsOpen ? (
              <MyListingsInline category="colocation" />
            ) : (
            <>

            {/* Results Grid or Map */}
            {colocListings.length === 0 ? (
              <EmptyState
                icon={<SearchX className="size-6" />}
                title="Aucune colocation trouvée"
                description="Essaie d'élargir ton budget ou de choisir une autre ville."
                action={
                  <button type="button" onClick={reset} className="btn-ink btn-sm">
                    Réinitialiser les filtres
                  </button>
                }
              />
            ) : view === 'map' ? (
              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <MapPreview listings={colocListings} />
                <div className="space-y-4">
                  {colocListings.map((listing) => (
                    <ButtonLink
                      key={listing.id}
                      to={`/logements/${listing.id}`}
                      variant="ghost"
                      className="!block !min-h-0 !w-full !rounded-[1.5rem] !border-ink/[0.06] !bg-white !p-3 !text-left"
                    >
                      <div className="flex gap-3">
                        <img
                          src={listing.image}
                          alt=""
                          className="size-24 shrink-0 rounded-[1rem] object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                            {listing.district} · {listing.city}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug">
                            {listing.title}
                          </p>
                          <p className="mt-2 text-[15px] font-semibold">
                            {TND(listing.price)}
                            <span className="text-[11px] font-normal text-ink-soft"> / mois</span>
                          </p>
                        </div>
                      </div>
                    </ButtonLink>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'grid gap-4',
                  cols === 2 && 'sm:grid-cols-2',
                  cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
                  cols === 4 && 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
                )}
              >
                {colocListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    compact={cols >= 3}
                    favorite={isFavorite(listing.id)}
                    onFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Roommate Profiles Showcase */}
            <div className="mt-12 border-t border-ink/[0.08] pt-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow mb-1">Communauté coloc</p>
                  <h2 className="text-[20px] font-semibold tracking-[-0.025em]">
                    Profils d'étudiants cherchant une colocation
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizOpen(true)}
                  className="link-underline text-[12px] font-semibold text-clay-deep"
                >
                  Calculer ma compatibilité
                  <ArrowUpRight className="inline size-3.5 ml-1" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {colocProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onContact={() => toast(`Demande envoyée à ${profile.name}`, 'success')}
                  />
                ))}
              </div>
            </div>
          </>
          )}
        </div>
      </div>
    </section>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[1.75rem] bg-cream p-5">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[17px] font-semibold">Filtres colocation</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-white"
                aria-label="Fermer les filtres"
              >
                <X className="size-4" />
              </button>
            </div>
            {filters}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              Voir les colocations ({colocListings.length})
            </button>
          </div>
        </div>
      )}

      {/* Compatibility quiz modal */}
      <Modal
        open={quizOpen}
        onClose={() => {
          setQuizOpen(false)
          restart()
        }}
        title={result ? 'Ton profil de compatibilité' : 'Test de compatibilité'}
      >
        {result ? (
          <div className="text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full border-[6px] border-sage-soft text-sage">
              <span className="text-[26px] font-semibold tracking-[-0.05em]">{result}%</span>
            </div>
            <p className="mt-4 text-[15px] font-semibold">Trois profils te correspondent à Sousse.</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Ton rythme et ton budget s'alignent avec des colocataires déjà installés.
            </p>
            <div className="mt-5 space-y-2">
              {colocProfiles.slice(0, 2).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 text-left">
                  <img src={p.avatar} alt="" className="size-9 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-[12.5px] font-semibold">{p.name}, {p.age}</p>
                    <p className="text-[10.5px] text-ink-soft">{p.studies}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-sage">{p.match}%</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setQuizOpen(false)}
              className="btn-ink mt-5 w-full"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-2">
              {quiz.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    i <= step ? 'bg-clay' : 'bg-ink/10',
                  )}
                />
              ))}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Question {step + 1} sur {quiz.length}
            </p>
            <p className="mt-2 text-[18px] font-semibold tracking-[-0.02em]">{quiz[step].q}</p>
            <div className="mt-4 space-y-2">
              {quiz[step].options.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => answer(i)}
                  className="flex w-full items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3 text-left text-[13px] font-medium transition hover:border-ink/30 hover:bg-cream/60"
                >
                  {option}
                  <ArrowRight className="size-4 text-ink-soft" />
                </button>
              ))}
            </div>
            <p className="mt-4 text-[10.5px] text-ink-soft">
              Aucune réponse n'est partagée sans ton accord.
            </p>
          </>
        )}
      </Modal>
    </>
  )
}

function MapPreview({ listings: items }: { listings: typeof listings }) {
  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-ink/[0.07] bg-[#e8e1d4]">
      <svg className="absolute inset-0 size-full" viewBox="0 0 600 500" aria-hidden="true">
        <g stroke="#d3c9b8" strokeWidth="10" fill="none">
          <path d="M-20 120 L620 80" />
          <path d="M-20 300 L620 340" />
          <path d="M120 -20 L60 520" />
          <path d="M380 -20 L430 520" />
          <path d="M-20 430 L620 470" />
        </g>
        <g stroke="#c3b8a4" strokeWidth="4" fill="none">
          <path d="M180 -20 L240 520" />
          <path d="M480 -20 L520 520" />
          <path d="M-20 210 L620 190" />
        </g>
        <path d="M0 360 Q160 300 300 380 T600 350 L600 500 L0 500 Z" fill="#cfd9cd" opacity="0.7" />
      </svg>

      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-soft backdrop-blur">
        <MapPin className="mr-1 inline size-3 text-clay" />
        {items.length} colocations dans la zone
      </div>

      {items.slice(0, 5).map((listing, i) => {
        const positions = [
          { left: '25%', top: '35%' },
          { left: '60%', top: '25%' },
          { left: '45%', top: '65%' },
        ]
        return (
          <div
            key={listing.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={positions[i % positions.length]}
          >
            <span className="block rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-cream shadow-lift ring-2 ring-white/70">
              {TND(listing.price)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ProfileCard({
  profile,
  onContact,
}: {
  profile: ColocProfile
  onContact: () => void
}) {
  return (
    <article
      className="group flex flex-col rounded-[1.75rem] border border-ink/[0.06] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img src={profile.avatar} alt="" className="size-14 rounded-full object-cover" />
          <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-white bg-sage text-white">
            <BadgeCheck className="size-3" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold tracking-[-0.02em]">
            {profile.name}, {profile.age}
          </p>
          <p className="text-[11.5px] text-ink-soft">{profile.studies}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-ink-soft">
            <MapPin className="size-3 text-clay" /> {profile.city} · {TND(profile.budget)} max
          </p>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-semibold leading-none tracking-[-0.04em] text-sage">
            {profile.match}%
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-ink-soft">compat.</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">« {profile.bio} »</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-ink-soft">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto flex gap-2 border-t border-ink/[0.07] pt-4">
        <button type="button" onClick={onContact} className="btn-ink btn-sm flex-1">
          <MessageCircle className="size-3.5" />
          Se présenter
        </button>
        <button
          type="button"
          aria-label="Enregistrer le profil"
          className="grid size-9 place-items-center rounded-full border border-ink/10 text-ink-soft transition hover:border-clay hover:text-clay"
        >
          <Heart className="size-4" />
        </button>
      </div>
    </article>
  )
}
