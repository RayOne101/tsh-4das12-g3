import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  Check,
  Heart,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { ListingCard } from '@/components/ListingCard'
import { ButtonLink } from '@/components/ButtonLink'
import { EmptyState, Skeleton } from '@/components/ui'
import { MyListingsInline } from '@/components/MyListingsInline'
import { listings, TND, type ListingKind } from '@/lib/data'
import { useAuth } from '@/lib/auth'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'

const cities = ['Toutes', 'Tunis', 'La Marsa', 'Ariana', 'Sousse', 'Monastir', 'Sfax']
const types: { label: string; value: ListingKind }[] = [
  { label: 'Appartement', value: 'appartement' },
  { label: 'Studio', value: 'studio' },
  { label: 'Chambre', value: 'chambre' },
  { label: 'Colocation', value: 'colocation' },
]
const budgets = [
  { label: '≤ 450 DT', min: 0, max: 450 },
  { label: '450 – 700 DT', min: 450, max: 700 },
  { label: '700 – 1 000 DT', min: 700, max: 1000 },
  { label: '1 000 DT et +', min: 1000, max: 99999 },
]
const amenities = ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Climatisation', 'Balcon', 'Parking']

export function HousingSearch() {
  const [params, setParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [loading, setLoading] = useState(true)
  const [myListingsOpen, setMyListingsOpen] = useState(false)
  const [city, setCity] = useState(params.get('ville') ?? 'Toutes')
  const [type, setType] = useState<string>(params.get('type') ?? 'Tous')
  const [budget, setBudget] = useState<string | null>(params.get('budget') ?? null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sort, setSort] = useState('Pertinence')
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [cols, setCols] = useState<2 | 3 | 4>(2)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 550)
    return () => window.clearTimeout(timer)
  }, [])

  const results = useMemo(() => {
    let items = listings.filter((listing) => {
      if (onlyFavorites && !favorites.includes(listing.id)) return false
      if (city !== 'Toutes' && listing.city !== city) return false
      if (type !== 'Tous' && listing.kind !== type.toLowerCase()) return false
      if (selectedAmenities.length && !selectedAmenities.every((a) => listing.amenities.includes(a)))
        return false
      if (budget) {
        const range = budgets.find((b) => b.label === budget)
        if (range && (listing.price < range.min || listing.price > range.max)) return false
      }
      return true
    })

    if (sort === 'Prix croissant') items = [...items].sort((a, b) => a.price - b.price)
    if (sort === 'Prix décroissant') items = [...items].sort((a, b) => b.price - a.price)
    if (sort === 'Mieux notés') items = [...items].sort((a, b) => b.rating - a.rating)
    return items
  }, [city, type, budget, selectedAmenities, sort, onlyFavorites, favorites])

  const reset = () => {
    setCity('Toutes')
    setType('Tous')
    setBudget(null)
    setSelectedAmenities([])
    setOnlyFavorites(false)
    setParams({})
  }

  const toggleAmenity = (value: string) =>
    setSelectedAmenities((current) =>
      current.includes(value) ? current.filter((a) => a !== value) : [...current, value],
    )

  const activeCount =
    (onlyFavorites ? 1 : 0) +
    (city !== 'Toutes' ? 1 : 0) +
    (type !== 'Tous' ? 1 : 0) +
    (budget ? 1 : 0) +
    selectedAmenities.length

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
            {favorites.length}
          </span>
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>
      <FilterBlock title="Ville">
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
      </FilterBlock>

      <FilterBlock title="Budget mensuel">
        <div className="space-y-1">
          {budgets.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-[13px] text-ink-soft transition-colors hover:text-ink"
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
                name="budget"
                className="sr-only"
                checked={budget === range.label}
                onChange={() => setBudget(budget === range.label ? null : range.label)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Type de bien">
        <div className="flex flex-wrap gap-1.5">
          {['Tous', ...types.map((t) => t.label)].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={cn('chip', type === value && 'chip-active')}
            >
              {value}
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Équipements">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {amenities.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] text-ink-soft transition-colors hover:text-ink"
            >
              <span
                className={cn(
                  'grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors',
                  selectedAmenities.includes(value)
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/25',
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
      </FilterBlock>

      <button
        type="button"
        onClick={reset}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 py-2.5 text-[12.5px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink"
      >
        <X className="size-3.5" />
        Réinitialiser les filtres
      </button>
    </div>
  )

  return (
    <>
      <section className="border-b border-ink/[0.07] bg-cream">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
          <p className="eyebrow mb-2">Catalogue des logements</p>
          <h1 className="display text-[clamp(2.2rem,4.6vw,3.8rem)]">
            Trouve ta prochaine <span className="font-serif italic text-clay-deep">adresse.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[16rem_1fr] lg:grid-cols-[17rem_1fr]">
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
                  <strong className="text-ink">{results.length}</strong> disponibles
                </span>
              </div>
              {filters}
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Left side: Mes annonces + Filter tags */}
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
                    {myListingsOpen ? 'Retour aux logements' : 'Mes annonces'}
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
                {city !== 'Toutes' && <FilterTag label={city} onClear={() => setCity('Toutes')} />}
                {type !== 'Tous' && <FilterTag label={type} onClear={() => setType('Tous')} />}
                {budget && <FilterTag label={budget} onClear={() => setBudget(null)} />}
                {selectedAmenities.map((a) => (
                  <FilterTag key={a} label={a} onClear={() => toggleAmenity(a)} />
                ))}
              </div>

              {/* Right side: Colonnes first, then Grille/Carte, then Trier par */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Colonnes toggle swapped BEFORE Grille/Carte */}
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

                {/* Grille / Carte toggle */}
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
              <MyListingsInline category="logements" />
            ) : loading ? (
              <div
                className={cn(
                  'grid gap-4',
                  cols === 2 && 'sm:grid-cols-2',
                  cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
                  cols === 4 && 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
                )}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-[1.75rem] border border-ink/[0.06] bg-white p-2">
                    <Skeleton className="aspect-[5/4] rounded-[1.4rem]" />
                    <div className="space-y-2 p-3">
                      <Skeleton className="h-2.5 w-1/3" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                icon={<SearchX className="size-6" />}
                title="Aucun logement ne correspond"
                description="Essaie d’élargir ton budget ou de retirer un équipement. De nouvelles annonces sont publiées chaque jour."
                action={
                  <button type="button" onClick={reset} className="btn-ink btn-sm">
                    Réinitialiser les filtres
                  </button>
                }
              />
            ) : view === 'map' ? (
              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <MapPreview listings={results} />
                <div className="space-y-4">
                  {results.slice(0, 3).map((listing) => (
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
                {results.map((listing) => (
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

            {!loading && results.length > 0 && (
              <div className="mt-10 flex flex-col items-center gap-3 rounded-[1.5rem] border border-dashed border-ink/15 bg-white/50 px-6 py-8 text-center">
                <Sparkles className="size-5 text-clay" />
                <p className="text-[15px] font-semibold">Tu ne trouves pas exactement ce qu’il te faut ?</p>
                <p className="max-w-md text-[13px] text-ink-soft">
                  Active une alerte : on te prévient dès qu’une annonce correspond à tes critères.
                </p>
                <ButtonLink to="/app" variant="ink" className="btn-sm mt-1">
                  Créer une alerte
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </div>
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
              <p className="text-[17px] font-semibold">Filtres</p>
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
              Voir {results.length} logement{results.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {title}
      </p>
      {children}
    </div>
  )
}

function FilterTag({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-cream">
      {label}
      <button type="button" onClick={onClear} aria-label={`Retirer ${label}`}>
        <X className="size-3 opacity-60 transition hover:opacity-100" />
      </button>
    </span>
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
        {items.length} résultats dans la zone
      </div>

      {items.slice(0, 5).map((listing, i) => {
        const positions = [
          { left: '18%', top: '26%' },
          { left: '58%', top: '18%' },
          { left: '36%', top: '48%' },
          { left: '68%', top: '56%' },
          { left: '24%', top: '68%' },
        ]
        return (
          <div
            key={listing.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={positions[i]}
          >
            <span className="block rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-cream shadow-lift ring-2 ring-white/70">
              {TND(listing.price)}
            </span>
          </div>
        )
      })}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/92 px-4 py-3 shadow-soft backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] text-ink-soft">{items.length} résultats sur la carte</span>
        </div>
        <ArrowUpRight className="size-4 text-ink-soft" />
      </div>
    </div>
  )
}
