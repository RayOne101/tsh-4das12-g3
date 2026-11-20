import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Building2,
  Eye,
  Home,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Sofa,
  Trash2,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react'
import { PageHeader, Panel } from '@/components/AppBits'
import { ButtonLink } from '@/components/ButtonLink'
import { EmptyState, StatCard } from '@/components/ui'
import { listings, furniture, TND, type ListingStatus } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export type UnifiedCategory = 'toutes' | 'logements' | 'colocation' | 'meubles' | 'demenagement'

interface UnifiedMyItem {
  id: string
  title: string
  category: 'logements' | 'colocation' | 'meubles' | 'demenagement'
  price: number
  priceSuffix?: string
  city: string
  image?: string
  status: ListingStatus
  views: number
  messages: number
  detailLink: string
}

const initialItems: UnifiedMyItem[] = [
  {
    id: 'l1',
    title: 'Appartement lumineux à 5 min du campus',
    category: 'logements',
    price: 850,
    priceSuffix: '/ mois',
    city: 'Tunis · El Manar',
    image: listings[0].image,
    status: 'publiee',
    views: 342,
    messages: 12,
    detailLink: `/logements/${listings[0].id}`,
  },
  {
    id: 'c1',
    title: 'Chambre dans colocation à Khezama',
    category: 'colocation',
    price: 380,
    priceSuffix: '/ mois',
    city: 'Sousse · Khezama',
    image: listings[1]?.image ?? listings[0].image,
    status: 'publiee',
    views: 189,
    messages: 7,
    detailLink: `/colocation`,
  },
  {
    id: 'f1',
    title: 'Canapé convertible 2 places velours',
    category: 'meubles',
    price: 220,
    city: 'Tunis · La Marsa',
    image: furniture[0].image,
    status: 'publiee',
    views: 95,
    messages: 4,
    detailLink: `/meubles`,
  },
  {
    id: 't1',
    title: 'Service transport utilitaire 10 m³ (Chauffeur)',
    category: 'demenagement',
    price: 50,
    priceSuffix: '/ trajet',
    city: 'Grand Tunis',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300',
    status: 'publiee',
    views: 210,
    messages: 9,
    detailLink: `/demenagement`,
  },
]

const categoryIcons = {
  toutes: Home,
  logements: Building2,
  colocation: Users,
  meubles: Sofa,
  demenagement: Truck,
}

const categoryLabels = {
  toutes: 'Toutes',
  logements: 'Logements',
  colocation: 'Colocation',
  meubles: 'Meubles',
  demenagement: 'Déménagement',
}

const statusMeta: Record<ListingStatus, { label: string; className: string }> = {
  publiee: { label: 'Publiée', className: 'bg-sage-soft text-sage' },
  en_attente: { label: 'En attente', className: 'bg-clay-soft text-clay-deep' },
  suspendue: { label: 'Suspendue', className: 'bg-rust-soft text-rust' },
}

export function MyListings() {
  const { toast } = useToast()

  const [items, setItems] = useState<UnifiedMyItem[]>(initialItems)
  const [selectedCategory, setSelectedCategory] = useState<UnifiedCategory>('toutes')
  const [statusTab, setStatusTab] = useState<'toutes' | ListingStatus>('toutes')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'toutes' && item.category !== selectedCategory) return false
      if (statusTab !== 'toutes' && item.status !== statusTab) return false
      return true
    })
  }, [items, selectedCategory, statusTab])

  const toggleStatus = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'suspendue' ? 'publiee' : 'suspendue' }
          : item,
      ),
    )
    const target = items.find((item) => item.id === id)
    toast(
      target?.status === 'suspendue' ? 'Annonce réactivée en ligne' : 'Annonce mise en pause',
      'info',
    )
  }

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    toast('Annonce supprimée', 'info')
  }

  const countsByCategory = {
    toutes: items.length,
    logements: items.filter((i) => i.category === 'logements').length,
    colocation: items.filter((i) => i.category === 'colocation').length,
    meubles: items.filter((i) => i.category === 'meubles').length,
    demenagement: items.filter((i) => i.category === 'demenagement').length,
  }

  return (
    <>
      <PageHeader
        eyebrow="Gestion de mes annonces"
        title={
          <>
            Mes annonces &amp; services
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/10 px-1.5 align-middle text-[12px] font-semibold tracking-normal text-ink-soft">
              {items.length}
            </span>
          </>
        }
        description="Gère toutes les offres que tu as publiées sur la plateforme (logements, colocations, meubles d'occasion ou services de transport)."
        actions={
          <ButtonLink to="/app/annonces/nouvelle" variant="ink" className="btn-sm">
            <Plus className="size-3.5" />
            + Déposer une annonce
          </ButtonLink>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Vues totales" value="836" hint="sur tes annonces" icon={<Eye className="size-4" />} />
        <StatCard label="Messages reçus" value="32" hint="demandes d'acheteurs/locataires" icon={<MessageSquare className="size-4" />} />
        <StatCard label="Taux de réponse" value="100 %" hint="rapide" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Annonces actives" value={String(items.filter((i) => i.status === 'publiee').length)} hint="visibles sur le site" icon={<ShieldCheck className="size-4" />} />
      </div>

      {/* Category Filter Pills (Logements, Colocation, Meubles, Déménagement) */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.08] pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['toutes', 'logements', 'colocation', 'meubles', 'demenagement'] as const).map((cat) => {
            const Icon = categoryIcons[cat]
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold transition',
                  selectedCategory === cat
                    ? 'bg-ink text-cream shadow-sm'
                    : 'text-ink-soft hover:bg-cream hover:text-ink',
                )}
              >
                <Icon className="size-3.5" />
                <span>{categoryLabels[cat]}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px]',
                    selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-cream text-ink-soft',
                  )}
                >
                  {countsByCategory[cat]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Status sub-filter */}
        <div className="flex items-center gap-1 text-[12px]">
          {(['toutes', 'publiee', 'suspendue'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusTab(st)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[11.5px] font-medium transition',
                statusTab === st ? 'bg-white font-semibold text-ink shadow-xs' : 'text-ink-soft hover:text-ink',
              )}
            >
              {st === 'toutes' ? 'Tous statuts' : st === 'publiee' ? 'En ligne' : 'En pause'}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <Panel className="mt-4" padded={false}>
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Package className="size-6" />}
              title="Aucune annonce trouvée dans cette catégorie"
              description="Tu n'as pas encore déposé d'annonce ici. Dépose une offre en quelques secondes !"
              action={
                <ButtonLink to="/app/annonces/nouvelle" variant="ink" className="btn-sm">
                  <Plus className="size-3.5" />
                  Déposer une annonce
                </ButtonLink>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-ink/[0.06]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-wrap items-center gap-4 p-4 transition hover:bg-cream/40 sm:flex-nowrap"
              >
                {item.image && (
                  <Link to={item.detailLink} className="shrink-0">
                    <img src={item.image} alt="" className="size-16 rounded-xl object-cover sm:size-20" />
                  </Link>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                        statusMeta[item.status].className,
                      )}
                    >
                      {statusMeta[item.status].label}
                    </span>
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[9.5px] font-semibold text-ink-soft uppercase tracking-wider">
                      {categoryLabels[item.category]}
                    </span>
                    <span className="text-[10px] text-ink-soft">{item.city}</span>
                  </div>

                  <Link to={item.detailLink}>
                    <p className="mt-1 truncate text-[14px] font-semibold hover:text-clay-deep">
                      {item.title}
                    </p>
                  </Link>
                </div>

                {/* Stats */}
                <div className="hidden w-20 text-center sm:block">
                  <p className="text-[13px] font-semibold">{item.views}</p>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-ink-soft">vues</p>
                </div>

                <div className="hidden w-20 text-center sm:block">
                  <p className="text-[13px] font-semibold">{item.messages}</p>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-ink-soft">messages</p>
                </div>

                {/* Price */}
                <div className="w-24 text-right">
                  <p className="text-[15px] font-semibold text-clay-deep">{TND(item.price)}</p>
                  {item.priceSuffix && <p className="text-[9px] text-ink-soft">{item.priceSuffix}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    to={item.detailLink}
                    title="Voir l'annonce"
                    className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>

                  <button
                    type="button"
                    title="Modifier l'annonce"
                    onClick={() => toast('Formulaire d’édition prérempli', 'info')}
                    className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                  >
                    <Pencil className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    title={item.status === 'suspendue' ? 'Réactiver en ligne' : 'Mettre en pause'}
                    onClick={() => toggleStatus(item.id)}
                    className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                  >
                    <ShieldCheck className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Supprimer l'annonce"
                    onClick={() => remove(item.id)}
                    className="grid size-8 place-items-center rounded-full text-rust transition hover:bg-rust-soft"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}
