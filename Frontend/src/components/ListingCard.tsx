import { Link } from 'react-router-dom'
import { ArrowUpRight, Bath, BedDouble, Heart, MapPin, Maximize } from 'lucide-react'
import type { Listing } from '@/lib/data'
import { TND } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Photo } from './Photo'
import { Rating } from './ui'

export function ListingCard({
  listing,
  onFavorite,
  favorite = false,
  className,
  compact = false,
}: {
  listing: Listing
  onFavorite?: (id: string) => void
  favorite?: boolean
  className?: string
  compact?: boolean
}) {
  const href = `/logements/${listing.id}`

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative">
        <Link to={href} className="block overflow-hidden rounded-[1.55rem] p-1.5">
          <Photo
            src={listing.image}
            alt={listing.title}
            rounded="rounded-[1.4rem]"
            className={compact ? 'aspect-[4/3]' : 'aspect-[5/4]'}
            imgClassName="group-hover:scale-[1.04]"
          />
        </Link>

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
          {listing.badge && (
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream backdrop-blur">
              {listing.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onFavorite?.(listing.id)}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorite}
          className={cn(
            'absolute right-4 top-4 grid size-9 place-items-center rounded-full border backdrop-blur transition-all duration-300',
            favorite
              ? 'border-clay bg-clay text-ink'
              : 'border-white/40 bg-white/85 text-ink hover:bg-white',
          )}
        >
          <Heart className={cn('size-4', favorite && 'fill-ink')} />
        </button>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          <MapPin className="size-3 text-clay" />
          {listing.district} · {listing.city}
        </div>

        <Link to={href} className="mt-2 block">
          <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-clay-deep">
            {listing.title}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" /> {listing.rooms} pièce{listing.rooms > 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="size-3.5" /> {listing.surface} m²
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5" /> {listing.rooms > 1 ? 2 : 1} sdb
          </span>
          <Rating value={listing.rating} count={listing.reviews} />
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink/[0.07] pt-4">
          <p className="text-[19px] font-semibold tracking-[-0.03em]">
            {TND(listing.price)}
            <span className="ml-1 text-[12px] font-normal text-ink-soft">/ mois</span>
          </p>
          <span className="grid size-9 place-items-center rounded-full bg-cream-deep text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-cream">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}
