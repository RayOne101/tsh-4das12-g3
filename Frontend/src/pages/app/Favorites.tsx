import { useState } from 'react'
import { Heart } from 'lucide-react'
import { PageHeader } from '@/components/AppBits'
import { ButtonLink } from '@/components/ButtonLink'
import { ListingCard } from '@/components/ListingCard'
import { EmptyState } from '@/components/ui'
import { listings } from '@/lib/data'
import { useToast } from '@/lib/toast'

export function Favorites() {
  const { toast } = useToast()
  const [saved, setSaved] = useState<string[]>(listings.slice(0, 5).map((l) => l.id))

  const items = listings.filter((listing) => saved.includes(listing.id))

  return (
    <>
      <PageHeader
        eyebrow="Ta sélection"
        title={
          <>
            Favoris
            <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink/10 px-1.5 align-middle text-[12px] font-semibold tracking-normal text-ink-soft">
              {saved.length}
            </span>
          </>
        }
        description="Les annonces que tu as gardées de côté."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-6" />}
          title="Aucun favori pour le moment"
          description="Touche le cœur sur une annonce pour la retrouver ici."
          action={
            <ButtonLink to="/logements" variant="ink" className="btn-sm">
              Parcourir les logements
            </ButtonLink>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              compact
              favorite
              onFavorite={(id) => {
                setSaved((current) => current.filter((item) => item !== id))
                toast('Retiré de tes favoris', 'info')
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
