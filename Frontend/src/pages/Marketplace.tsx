import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Search,
  User,
} from 'lucide-react'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/ui'
import { Photo } from '@/components/Photo'
import { MyListingsInline } from '@/components/MyListingsInline'
import { useAuth } from '@/lib/auth'
import { useFavorites } from '@/lib/favorites'
import { furniture, TND, avatar, type Furniture } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const categories = ['Tout', 'Salon', 'Chambre', 'Bureau', 'Cuisine', 'Rangement', 'Électroménager', 'Déco']

export function Marketplace() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const { favorites, toggleFavorite } = useFavorites()
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [myListingsOpen, setMyListingsOpen] = useState(false)
  const [category, setCategory] = useState('Tout')
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState('Toutes')
  const [maxPrice, setMaxPrice] = useState(500)
  const [sort, setSort] = useState('Pertinence')
  const [cols, setCols] = useState<2 | 3 | 4>(3)
  const [selected, setSelected] = useState<Furniture | null>(null)

  const items = useMemo(() => {
    let list = furniture.filter((item) => {
      if (onlyFavorites && !favorites.includes(item.id)) return false
      if (category !== 'Tout' && item.category !== category) return false
      if (condition !== 'Toutes' && item.condition !== condition) return false
      if (item.price > maxPrice) return false
      if (query && !`${item.title} ${item.city}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })

    if (sort === 'Prix croissant') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'Prix décroissant') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [category, condition, maxPrice, query, sort, onlyFavorites, favorites])

  const activeCount =
    (onlyFavorites ? 1 : 0) +
    (category !== 'Tout' ? 1 : 0) +
    (condition !== 'Toutes' ? 1 : 0) +
    (maxPrice < 500 ? 1 : 0) +
    (query ? 1 : 0)

  return (
    <>
      <section className="border-b border-ink/[0.07] bg-cream">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
          <p className="eyebrow mb-2">Marketplace · meubles d’occasion</p>
          <h1 className="display text-[clamp(2.2rem,4.6vw,3.8rem)]">
            Meuble ton studio, <span className="font-serif italic text-clay-deep">pas ton budget.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside className="hidden lg:block">
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
                  <strong className="text-ink">{items.length}</strong> disponibles
                </span>
              </div>

              {/* Favoris filter toggle directly in sidebar */}
              <div className="mb-5">
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-ink/[0.08] bg-cream/60 px-3.5 py-2.5 transition hover:border-rust/30 hover:bg-cream">
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                    <Heart className={cn('size-4 transition-colors', onlyFavorites ? 'fill-rust text-rust' : 'text-ink-soft')} />
                    Mes favoris
                  </span>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-bold shadow-xs', onlyFavorites ? 'bg-rust text-white' : 'bg-white text-ink-soft')}>
                    {favorites.filter((id) => furniture.find((f) => f.id === id)).length}
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyFavorites}
                    onChange={(e) => setOnlyFavorites(e.target.checked)}
                    className="sr-only"
                  />
                </label>
              </div>

              <label className="field-label">Rechercher</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Canapé, bureau…"
                  className="field pl-9"
                />
              </div>

              <p className="field-label mt-5">Catégorie</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    className={cn('chip', category === value && 'chip-active')}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <p className="field-label mt-5">État</p>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="field">
                {['Toutes', 'Neuf', 'Très bon état', 'Bon état'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Budget max
                </p>
                <span className="text-[12px] font-semibold text-clay-deep">{TND(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-[#d07a3b]"
              />

              <button
                type="button"
                onClick={() => {
                  setCategory('Tout')
                  setCondition('Toutes')
                  setQuery('')
                  setMaxPrice(500)
                }}
                className="mt-5 w-full rounded-xl border border-ink/10 py-2.5 text-[12px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Left side: Mes annonces */}
              <div className="flex flex-wrap items-center gap-3">
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
                    {myListingsOpen ? 'Retour aux meubles' : 'Mes annonces'}
                  </button>
                )}
              </div>

              {/* Right side: Colonnes & Sort */}
              {!myListingsOpen && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Columns toggle */}
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

                  {/* Sort */}
                  <label className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                    Trier par
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-xl border border-ink/10 bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-ink focus:border-clay focus:outline-none"
                    >
                      {['Pertinence', 'Prix croissant', 'Prix décroissant'].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {myListingsOpen ? (
              <MyListingsInline category="meubles" />
            ) : items.length === 0 ? (
              <EmptyState
                icon={<Package className="size-6" />}
                title="Rien dans cette catégorie"
                description="Élargis ton budget ou retire un filtre. De nouveaux objets sont publiés chaque jour."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Tout')
                      setCondition('Toutes')
                      setQuery('')
                      setMaxPrice(500)
                    }}
                    className="btn-ink btn-sm"
                  >
                    Réinitialiser
                  </button>
                }
              />
            ) : (
              <div
                className={cn(
                  'grid gap-4',
                  cols === 2 && 'grid-cols-2',
                  cols === 3 && 'grid-cols-2 lg:grid-cols-3',
                  cols === 4 && 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
                )}
              >
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative p-2">
                      <button type="button" onClick={() => setSelected(item)} className="block w-full">
                        <Photo
                          src={item.image}
                          alt={item.title}
                          rounded="rounded-[1.15rem]"
                          className="aspect-[4/3.3]"
                          imgClassName="group-hover:scale-[1.04]"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.id)}
                        aria-label="Ajouter aux favoris"
                        className={cn(
                          'absolute right-4 top-4 grid size-8 place-items-center rounded-full border backdrop-blur transition',
                          favorites.includes(item.id)
                            ? 'border-clay bg-clay text-ink'
                            : 'border-white/50 bg-white/85 text-ink hover:bg-white',
                        )}
                      >
                        <Heart className={cn('size-3.5', favorites.includes(item.id) && 'fill-ink')} />
                      </button>
                      <span className="absolute bottom-4 left-4 rounded-full bg-ink/90 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-cream">
                        {item.condition}
                      </span>
                    </div>
                    <div className="px-3.5 pb-4 pt-1">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                        {item.category} · {item.city}
                      </p>
                      <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13.5px] font-semibold leading-snug">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex items-baseline">
                        <p className="text-[17px] font-semibold tracking-[-0.03em] text-clay-deep">
                          {TND(item.price)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-ink/[0.07] pt-3">
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-soft">
                          <BadgeCheck className="size-3 text-sage" />
                          {item.seller}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-ink transition hover:text-clay-deep"
                        >
                          Détail
                          <ArrowUpRight className="size-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? ''} size="lg">
        {selected && (
          <div className="grid gap-5 sm:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Photo src={selected.image} alt={selected.title} className="aspect-[4/3]" rounded="rounded-[1.2rem]" />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[selected.image, selected.image, selected.image].map((src, i) => (
                  <Photo key={i} src={src} alt="" className="aspect-square" rounded="rounded-[0.8rem]" />
                ))}
              </div>
            </div>
            <div>
              <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                {selected.condition} · {selected.category}
              </span>
              <p className="mt-4 text-[30px] font-semibold leading-none tracking-[-0.05em] text-clay-deep">
                {TND(selected.price)}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                Objet en {selected.condition.toLowerCase()}, disponible immédiatement à {selected.city} ou livraison via le service Transport.
              </p>
              <div className="mt-4 rounded-xl bg-white p-3">
                <div className="flex items-center gap-2.5">
                  <img src={avatar(13)} alt="" className="size-9 rounded-full object-cover" />
                  <div>
                    <p className="text-[12.5px] font-semibold">{selected.seller}</p>
                    <p className="inline-flex items-center gap-1 text-[10.5px] text-sage">
                      <BadgeCheck className="size-3" /> Profil vérifié
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-ink-soft">
                <MapPin className="size-3.5 text-clay" />
                {selected.city} · publié le {new Date(selected.posted).toLocaleDateString('fr-FR')}
              </div>
              <button
                type="button"
                onClick={() => {
                  toast('Message envoyé au vendeur', 'success')
                  setSelected(null)
                }}
                className="btn-primary mt-5 w-full"
              >
                <MessageCircle className="size-4" />
                Contacter le vendeur
              </button>
              <p className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">
                Ne paie jamais avant d’avoir vu l’objet. Signale toute demande d’acompte hors
                plateforme.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
