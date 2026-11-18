import { useMemo, useState } from 'react'
import {
  Check,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader, Panel } from '@/components/AppBits'
import { StatCard } from '@/components/ui'
import { adminUsers } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

type Tab = 'utilisateurs' | 'signalements'

export function Admin() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('utilisateurs')
  const [users] = useState(adminUsers)
  const [query, setQuery] = useState('')

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [users, query],
  )

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Gestion des utilisateurs & Sécurité"
        description="Consultation des comptes de la communauté et traitement des signalements."
        actions={
          <button
            type="button"
            onClick={() => toast('Liste des comptes actualisée', 'success')}
            className="btn-ghost btn-sm"
          >
            <RefreshCw className="size-3.5" />
            Actualiser
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total comptes" value={String(users.length)} hint="inscrits" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="Comptes actifs" value={String(users.filter((u) => u.status === 'Actif').length)} hint="opérationnels" icon={<Check className="size-4" />} />
        <StatCard label="Signalements" value="2" hint="1 prioritaire" icon={<ShieldAlert className="size-4" />} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {(
            [
              ['utilisateurs', 'Comptes utilisateurs'],
              ['signalements', 'Signalements & Abus'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn('chip', tab === value && 'chip-active')}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-ink-soft">
          <ShieldCheck className="size-3.5 text-sage" />
          Session admin · ROLE_ADMIN
        </span>
      </div>



      {tab === 'utilisateurs' && (
        <Panel className="mt-4" padded={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un compte…"
                className="h-9 w-full rounded-full bg-cream pl-9 pr-3 text-[11.5px] focus:outline-none"
              />
            </div>
            <button type="button" className="btn-ghost btn-sm !min-h-8 !px-3 !text-[10.5px]">
              <Filter className="size-3.5" />
              Filtrer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left">
              <thead>
                <tr className="border-b border-ink/[0.06] text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                  <th className="px-4 py-2.5 font-semibold">Utilisateur</th>
                  <th className="px-3 py-2.5 font-semibold">Rôle</th>
                  <th className="px-3 py-2.5 font-semibold">Vérifié</th>
                  <th className="px-3 py-2.5 font-semibold">Statut</th>
                  <th className="px-3 py-2.5 font-semibold">Inscription</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Annonces</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/[0.05]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-[11px] transition hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-[9.5px] text-ink-soft">{user.email}</p>
                    </td>
                    <td className="px-3 py-3 text-ink-soft">{user.role}</td>
                    <td className="px-3 py-3">
                      {user.verified ? (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-sage">
                          <Check className="size-3" /> Oui
                        </span>
                      ) : (
                        <span className="text-[9.5px] text-ink-soft">Non</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                          user.status === 'Actif'
                            ? 'bg-sage-soft text-sage'
                            : user.status === 'Suspendu'
                              ? 'bg-rust-soft text-rust'
                              : 'bg-clay-soft text-clay-deep',
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-ink-soft">
                      {new Date(user.joined).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right text-[10px] text-ink-soft">{user.listings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 border-t border-ink/[0.06] bg-cream/60 px-4 py-3">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-clay-deep" />
            <p className="text-[9.5px] leading-relaxed text-ink-soft">
              Les comptes proviennent de Keycloak : la console les affiche en lecture seule pour
              l’instant, les actions de modération seront branchées sur l’API admin plus tard.
            </p>
          </div>
        </Panel>
      )}

      {tab === 'signalements' && (
        <div className="mt-4 space-y-3">
          {[
            {
              id: 's1',
              title: 'Tentative de paiement hors plateforme',
              detail: 'Le propriétaire demande un acompte de 200 DT par virement avant visite.',
              target: 'Slim Jaziri · Duplex proche du lac',
              severity: 'Prioritaire',
              date: '16 nov.',
            },
            {
              id: 's2',
              title: 'Photos non conformes',
              detail: 'Les images semblent provenir d’un autre site. Vérification manuelle demandée.',
              target: 'Nadia Ferchichi · Chambre meublée',
              severity: 'À examiner',
              date: '15 nov.',
            },
          ].map((report) => (
            <article key={report.id} className="flex flex-wrap items-start gap-4 rounded-[1.5rem] border border-ink/[0.07] bg-white p-5">
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full',
                  report.severity === 'Prioritaire' ? 'bg-rust-soft text-rust' : 'bg-clay-soft text-clay-deep',
                )}
              >
                <ShieldAlert className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[13.5px] font-semibold">{report.title}</h3>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                      report.severity === 'Prioritaire' ? 'bg-rust-soft text-rust' : 'bg-cream-deep text-ink-soft',
                    )}
                  >
                    {report.severity}
                  </span>
                  <span className="text-[9.5px] text-ink-soft">{report.date}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{report.detail}</p>
                <p className="mt-1.5 text-[9.5px] font-medium text-ink-soft">{report.target}</p>
              </div>
              <button
                type="button"
                onClick={() => toast('Signalement traité et journalisé', 'success')}
                className="btn-ink btn-sm !min-h-8 !px-3 !text-[10.5px]"
              >
                Traiter
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
