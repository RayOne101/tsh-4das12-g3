import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div data-reveal>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.22]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({
  title,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <section className={cn('rounded-[1.5rem] border border-ink/[0.07] bg-white', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-5 py-3.5">
          {title && <h2 className="text-[13px] font-semibold tracking-[-0.01em]">{title}</h2>}
          {action}
        </div>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function ViewAll({ to, label = 'Tout voir' }: { to: string; label?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft transition hover:text-clay-deep"
    >
      {label}
      <ArrowUpRight className="size-3" />
    </Link>
  )
}

export function LockedArea({
  title,
  description,
  required,
}: {
  title: string
  description: string
  required: string
}) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center">
      <span className="grid size-14 place-items-center rounded-full bg-cream-deep text-ink-soft">
        <Lock className="size-6" />
      </span>
      <h1 className="display mt-5 text-[2rem]">{title}</h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-5 rounded-xl border border-ink/10 bg-white px-4 py-2.5 font-mono text-[10.5px] text-ink-soft">
        Rôle requis : {required}
      </div>
      <p className="mt-4 text-[11px] text-ink-soft">
        Utilise le panneau « Démo » en bas à droite pour changer de rôle.
      </p>
    </div>
  )
}
