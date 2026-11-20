import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { ButtonLink } from '@/components/ButtonLink'

const columns = [
  {
    title: 'Se loger',
    links: [
      { label: 'Logements vérifiés', to: '/logements' },
      { label: 'Colocations', to: '/colocation' },
      { label: 'Meubles', to: '/meubles' },
      { label: 'Déménagement', to: '/demenagement' },
    ],
  },
  {
    title: 'La plateforme',
    links: [
      { label: 'Comment ça marche', to: '/comment-ca-marche' },
      { label: 'La vérification', to: '/comment-ca-marche#verification' },
      { label: 'Tarifs', to: '/comment-ca-marche#tarifs' },
      { label: 'Confiance & sécurité', to: '/comment-ca-marche#securite' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Se connecter', to: '/connexion' },
      { label: 'Créer un compte', to: '/bienvenue' },
      { label: 'Mon profil', to: '/app/profil' },
      { label: 'Aide', to: '/comment-ca-marche#faq' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="mx-auto w-full max-w-[88rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cream/45">
              Prêt à emménager ?
            </p>
            <h2 className="display text-[clamp(2.4rem,5.5vw,4.8rem)]">
              Trouve ton chez-toi.
              <br />
              <span className="font-serif italic text-clay">Sans les mauvaises surprises.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink to="/logements" variant="primary">
              Explorer les logements
              <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink to="/connexion?returnTo=/app/annonces/nouvelle" variant="light">
              Publier une annonce
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Brand invert />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/55">
              La plateforme communautaire du logement étudiant en Tunisie. Des annonces vérifiées, des
              colocations compatibles, et tout ce qu’il faut pour s’installer.
            </p>
            <div className="mt-6 space-y-2 text-sm text-cream/55">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-clay" /> Tunis · Sousse · Sfax · Monastir
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-clay" /> bonjour@tsh.tn
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/40">
                {column.title}
              </p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream/75 transition-colors hover:text-clay"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-[12px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TSH — Trusted Student Housing. Projet académique ESPRIT.</p>
          <div className="flex flex-wrap gap-5">
            <span>Prototype d’interface</span>
            <span>Authentification déléguée à Keycloak</span>
            <span>Conditions</span>
            <span>Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
