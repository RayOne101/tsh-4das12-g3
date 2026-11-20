import { useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  FileSignature,
  FileText,
  Info,
  Receipt,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { PageHeader, Panel } from '@/components/AppBits'
import { StatCard } from '@/components/ui'
import { contracts as seed, TND, type Contract } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const tabs = ['Contrats', 'Paiements', 'Reçus'] as const
type Tab = (typeof tabs)[number]

const statusStyle: Record<Contract['status'], string> = {
  Actif: 'bg-sage-soft text-sage',
  'En signature': 'bg-clay-soft text-clay-deep',
  Terminé: 'bg-cream-deep text-ink-soft',
}

const schedule = [
  { label: 'Novembre 2026', amount: 620, status: 'Payé', date: '01 nov. 2026' },
  { label: 'Décembre 2026', amount: 620, status: 'À venir', date: '01 déc. 2026' },
  { label: 'Janvier 2027', amount: 620, status: 'Planifié', date: '01 janv. 2027' },
  { label: 'Février 2027', amount: 620, status: 'Planifié', date: '01 févr. 2027' },
]

export function Contracts() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('Contrats')
  const [contracts, setContracts] = useState(seed)

  const sign = (id: string) => {
    setContracts((current) =>
      current.map((contract) =>
        contract.id === id ? { ...contract, status: 'Actif', paid: true } : contract,
      ),
    )
    toast('Contrat signé — une copie PDF est disponible', 'success')
  }

  return (
    <>
      <PageHeader
        eyebrow="Location"
        title="Contrats & paiements"
        description="Un seul endroit pour tes baux, tes échéances et tes reçus. Les documents sont archivés et téléchargeables à tout moment."
        actions={
          <button
            type="button"
            onClick={() => toast('Export comptable généré (PDF)', 'success')}
            className="btn-ghost btn-sm"
          >
            <Download className="size-3.5" />
            Exporter
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Loyer actuel" value={TND(620)} hint="charges incluses" icon={<Wallet className="size-4" />} />
        <StatCard label="Prochaine échéance" value="1 déc." hint={TND(620)} icon={<CalendarDays className="size-4" />} />
        <StatCard label="Total payé (2026)" value={TND(4340)} hint="7 reçus disponibles" icon={<Receipt className="size-4" />} />
        <StatCard label="Dépôt de garantie" value={TND(620)} hint="restituable en fin de bail" icon={<ShieldCheck className="size-4" />} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {tabs.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn('chip', tab === value && 'chip-active')}
            >
              {value}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10.5px] font-medium text-ink-soft">
          <ShieldCheck className="size-3.5 text-sage" />
          Paiements protégés par TSH
        </span>
      </div>

      {tab === 'Contrats' && (
        <div className="mt-4 space-y-3">
          {contracts.map((contract) => (
            <article
              key={contract.id}
              className="rounded-[1.5rem] border border-ink/[0.07] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-full px-2.5 py-1 text-[9.5px] font-semibold', statusStyle[contract.status])}>
                      {contract.status}
                    </span>
                    <span className="text-[9.5px] text-ink-soft">Réf. {contract.reference}</span>
                  </div>
                  <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.02em]">{contract.listing}</h3>
                  <p className="mt-0.5 text-[11.5px] text-ink-soft">
                    {contract.landlord} · {contract.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[20px] font-semibold tracking-[-0.04em]">
                    {TND(contract.rent)}
                    <span className="text-[10px] font-normal text-ink-soft"> /mois</span>
                  </p>
                  <p className="text-[10px] text-ink-soft">+ {TND(contract.charges)} charges</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 border-t border-ink/[0.06] pt-4 text-[10.5px] sm:grid-cols-3">
                <div>
                  <p className="text-ink-soft">Début du bail</p>
                  <p className="mt-0.5 font-semibold">{new Date(contract.start).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-ink-soft">Fin du bail</p>
                  <p className="mt-0.5 font-semibold">{new Date(contract.end).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-ink-soft">Prochaine échéance</p>
                  <p className="mt-0.5 font-semibold">
                    {contract.status === 'Terminé' ? '—' : new Date(contract.nextPayment).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {contract.status === 'En signature' ? (
                  <>
                    <button type="button" onClick={() => sign(contract.id)} className="btn-primary btn-sm">
                      <FileSignature className="size-3.5" />
                      Signer le bail
                    </button>
                    <button
                      type="button"
                      onClick={() => toast('Aperçu du contrat ouvert', 'info')}
                      className="btn-ghost btn-sm"
                    >
                      <FileText className="size-3.5" />
                      Relire
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast(`Téléchargement de ${contract.reference}.pdf`, 'success')}
                    className="btn-ghost btn-sm"
                  >
                    <Download className="size-3.5" />
                    Télécharger le PDF
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toast('Détail du contrat — prototype', 'info')}
                  className="btn-ghost btn-sm"
                >
                  Voir le détail
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </article>
          ))}

          <div className="flex items-start gap-3 rounded-[1.4rem] border border-dashed border-ink/15 bg-white/50 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-ink-soft" />
            <p className="text-[10.5px] leading-relaxed text-ink-soft">
              Un bail signé ne peut plus être modifié. Pour un avenant (colocataire supplémentaire,
              changement de charges), contacte le support : un document annexe sera généré.
            </p>
          </div>
        </div>
      )}

      {tab === 'Paiements' && (
        <Panel className="mt-4" padded={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.06] px-5 py-3.5">
            <div>
              <p className="text-[12.5px] font-semibold">Échéancier · Studio à Ariana</p>
              <p className="text-[10px] text-ink-soft">TSH-2026-0184 · 620 DT/mois</p>
            </div>
            <span className="rounded-full bg-sage-soft px-2.5 py-1 text-[9.5px] font-semibold text-sage">
              1 paiement à venir
            </span>
          </div>
          <div className="divide-y divide-ink/[0.05]">
            {schedule.map((row) => (
              <div key={row.label} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span
                  className={cn(
                    'grid size-8 place-items-center rounded-full',
                    row.status === 'Payé'
                      ? 'bg-sage-soft text-sage'
                      : row.status === 'À venir'
                        ? 'bg-clay-soft text-clay-deep'
                        : 'bg-cream-deep text-ink-soft',
                  )}
                >
                  {row.status === 'Payé' ? <Check className="size-3.5" /> : <CalendarDays className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold">{row.label}</p>
                  <p className="text-[9.5px] text-ink-soft">{row.date}</p>
                </div>
                <p className="text-[12.5px] font-semibold">{TND(row.amount)}</p>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[9.5px] font-semibold',
                    row.status === 'Payé'
                      ? 'bg-sage-soft text-sage'
                      : row.status === 'À venir'
                        ? 'bg-clay-soft text-clay-deep'
                        : 'bg-cream-deep text-ink-soft',
                  )}
                >
                  {row.status}
                </span>
                <button
                  type="button"
                  onClick={() => toast(row.status === 'Payé' ? 'Reçu téléchargé' : 'Paiement — prototype', 'info')}
                  className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                  aria-label="Télécharger"
                >
                  {row.status === 'Payé' ? <Download className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-ink/[0.06] bg-cream/60 px-5 py-3">
            <ShieldCheck className="size-3.5 text-sage" />
            <p className="text-[9.5px] text-ink-soft">
              Le paiement est libéré au propriétaire 24 h après validation. Un reçu est généré
              automatiquement.
            </p>
          </div>
        </Panel>
      )}

      {tab === 'Reçus' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { month: 'Novembre 2026', amount: 620, ref: 'REC-2026-11-0184' },
            { month: 'Octobre 2026', amount: 620, ref: 'REC-2026-10-0184' },
            { month: 'Septembre 2026', amount: 620, ref: 'REC-2026-09-0184' },
            { month: 'Août 2026', amount: 390, ref: 'REC-2026-08-0097' },
          ].map((receipt) => (
            <button
              key={receipt.ref}
              type="button"
              onClick={() => toast(`${receipt.ref}.pdf téléchargé`, 'success')}
              className="flex items-center gap-3 rounded-[1.4rem] border border-ink/[0.07] bg-white p-4 text-left transition hover:border-ink/20"
            >
              <span className="grid size-10 place-items-center rounded-full bg-cream text-ink-soft">
                <Receipt className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold">Loyer · {receipt.month}</p>
                <p className="text-[9.5px] text-ink-soft">{receipt.ref}</p>
              </div>
              <p className="text-[12px] font-semibold">{TND(receipt.amount)}</p>
              <Download className="size-4 text-ink-soft" />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
