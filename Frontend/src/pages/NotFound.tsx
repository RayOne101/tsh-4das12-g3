import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react'
import { ButtonLink } from '@/components/ButtonLink'

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-[88rem] flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <div className="relative mb-8">
        <span className="font-serif text-[clamp(6rem,18vw,12rem)] italic leading-none text-clay/25">
          404
        </span>
        <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-cream">
          <Search className="size-6" />
        </span>
      </div>
      <h1 className="display text-[clamp(2rem,4.4vw,3.4rem)]">
        Cette adresse n’existe pas.
        <br />
        <span className="font-serif italic text-clay-deep">La bonne, si.</span>
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
        Le lien a peut-être expiré, ou l’annonce a été retirée. Reprends la recherche depuis le début —
        il y a 4 200 logements vérifiés qui t’attendent.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <ButtonLink to="/logements" variant="ink">
          Explorer les logements
          <ArrowUpRight className="size-4" />
        </ButtonLink>
        <ButtonLink to="/" variant="ghost">
          <ArrowLeft className="size-4" />
          Retour à l’accueil
        </ButtonLink>
      </div>
      <p className="mt-8 text-[11px] text-ink-soft">
        Besoin d’aide ?{' '}
        <Link to="/comment-ca-marche#faq" className="font-semibold text-ink underline underline-offset-2">
          Consulte la FAQ
        </Link>
      </p>
    </div>
  )
}
