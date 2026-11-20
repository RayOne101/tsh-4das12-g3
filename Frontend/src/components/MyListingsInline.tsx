/**
 * MyListingsInline — reusable "Mes annonces" inline panel
 * Dropped into each catalog page when user presses "Mes annonces".
 * Receives a category prop to pre-filter to the right tab.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Building2,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Sofa,
  Trash2,
  Truck,
  Users,
} from 'lucide-react'
import { listings, furniture, TND, type ListingStatus } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export type InlineCategory = 'logements' | 'colocation' | 'meubles' | 'demenagement'

interface MyItem {
  id: string
  title: string
  price: number
  priceSuffix?: string
  city: string
  image?: string
  status: ListingStatus
  views: number
  messages: number
  detailLink: string
}

const categoryIcons: Record<InlineCategory, React.ElementType> = {
  logements: Building2,
  colocation: Users,
  meubles: Sofa,
  demenagement: Truck,
}

const statusMeta: Record<ListingStatus, { label: string; className: string }> = {
  publiee: { label: 'En ligne', className: 'bg-sage-soft text-sage' },
  en_attente: { label: 'En attente', className: 'bg-clay-soft text-clay-deep' },
  suspendue: { label: 'En pause', className: 'bg-rust-soft text-rust' },
}

// Seed data per category
const seedByCategory: Record<InlineCategory, MyItem[]> = {
  logements: [
    {
      id: 'l1',
      title: 'Appartement lumineux à 5 min du campus',
      price: 850,
      priceSuffix: '/ mois',
      city: 'Tunis · El Manar',
      image: listings[0]?.image,
      status: 'publiee',
      views: 342,
      messages: 12,
      detailLink: `/logements/${listings[0]?.id ?? ''}`,
    },
  ],
  colocation: [
    {
      id: 'c1',
      title: 'Chambre dans colocation à Khezama',
      price: 380,
      priceSuffix: '/ mois',
      city: 'Sousse · Khezama',
      image: listings[1]?.image ?? listings[0]?.image,
      status: 'publiee',
      views: 189,
      messages: 7,
      detailLink: `/colocation`,
    },
  ],
  meubles: [
    {
      id: 'f1',
      title: 'Canapé convertible 2 places velours',
      price: 220,
      city: 'Tunis · La Marsa',
      image: furniture[0]?.image,
      status: 'publiee',
      views: 95,
      messages: 4,
      detailLink: `/meubles`,
    },
  ],
  demenagement: [
    {
      id: 't1',
      title: 'Service transport utilitaire 10 m³ (Chauffeur)',
      price: 50,
      priceSuffix: '/ trajet',
      city: 'Grand Tunis',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300',
      status: 'publiee',
      views: 210,
      messages: 9,
      detailLink: `/demenagement`,
    },
  ],
}

export function MyListingsInline({ category }: { category: InlineCategory }) {
  const { toast } = useToast()
  const [items, setItems] = useState<MyItem[]>(seedByCategory[category])

  const CategoryIcon = categoryIcons[category]

  const toggleStatus = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'suspendue' ? 'publiee' : 'suspendue' }
          : item,
      ),
    )
    const target = items.find((item) => item.id === id)
    toast(target?.status === 'suspendue' ? 'Annonce réactivée' : 'Annonce mise en pause', 'info')
  }

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    toast('Annonce supprimée', 'info')
  }

  return (
    <div className="rounded-[1.5rem] border border-ink/[0.08] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <CategoryIcon className="size-4 text-ink-soft" />
          <p className="text-[13px] font-semibold">Mes annonces</p>
          <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
            {items.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toast('Formulaire de dépôt d\'annonce', 'info')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-clay px-3 py-1.5 text-[11.5px] font-semibold text-white transition hover:bg-clay-deep"
        >
          <Plus className="size-3.5" />
          Nouvelle annonce
        </button>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <Package className="size-8 text-ink-soft/40" />
          <p className="text-[13px] font-semibold text-ink">Aucune annonce dans cette catégorie</p>
          <p className="text-[11.5px] text-ink-soft">Dépose ta première annonce en quelques secondes.</p>
          <button
            type="button"
            onClick={() => toast('Formulaire de dépôt d\'annonce', 'info')}
            className="btn-ink btn-sm mt-1"
          >
            <Plus className="size-3.5" />
            Déposer
          </button>
        </div>
      ) : (
        <div className="divide-y divide-ink/[0.05]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 p-4 transition hover:bg-cream/40 sm:flex-nowrap"
            >
              {item.image && (
                <img src={item.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                      statusMeta[item.status].className,
                    )}
                  >
                    {statusMeta[item.status].label}
                  </span>
                  <span className="text-[9.5px] text-ink-soft">{item.city}</span>
                </div>
                <p className="mt-0.5 truncate text-[13px] font-semibold">{item.title}</p>
                <p className="text-[11.5px] text-clay-deep font-semibold">
                  {TND(item.price)}{item.priceSuffix && <span className="text-ink-soft font-normal"> {item.priceSuffix}</span>}
                </p>
              </div>

              {/* Quick stats */}
              <div className="hidden shrink-0 text-center sm:block">
                <p className="text-[12px] font-semibold">{item.views}</p>
                <p className="text-[9px] text-ink-soft">vues</p>
              </div>
              <div className="hidden shrink-0 text-center sm:block mr-2">
                <p className="text-[12px] font-semibold">{item.messages}</p>
                <p className="text-[9px] text-ink-soft">msg</p>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 items-center gap-0.5">
                <Link
                  to={item.detailLink}
                  title="Voir"
                  className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <button
                  type="button"
                  title="Modifier"
                  onClick={() => toast('Formulaire d\'édition prérempli', 'info')}
                  className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  title={item.status === 'suspendue' ? 'Réactiver' : 'Mettre en pause'}
                  onClick={() => toggleStatus(item.id)}
                  className={cn(
                    'grid size-8 place-items-center rounded-full transition',
                    item.status === 'publiee'
                      ? 'text-sage hover:bg-sage-soft'
                      : 'text-ink-soft hover:bg-cream hover:text-sage',
                  )}
                >
                  <ShieldCheck className="size-3.5" />
                </button>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => remove(item.id)}
                  className="grid size-8 place-items-center rounded-full text-rust/60 transition hover:bg-rust-soft hover:text-rust"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
