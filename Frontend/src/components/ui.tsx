import { BadgeCheck, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Verified({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sage">
      <BadgeCheck className="size-3" />
      {!compact && 'Vérifié'}
    </span>
  )
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink">
      <Star className="size-3.5 fill-clay text-clay" />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-normal text-ink-soft">({count})</span>}
    </span>
  )
}

export function Pill({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'clay' | 'sage' | 'rust' | 'sky' | 'ink'
  className?: string
}) {
  const tones = {
    neutral: 'bg-cream-deep text-ink-soft',
    clay: 'bg-clay-soft text-clay-deep',
    sage: 'bg-sage-soft text-sage',
    rust: 'bg-rust-soft text-rust',
    sky: 'bg-sky-soft text-sky',
    ink: 'bg-ink text-cream',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl" data-reveal>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="display text-[clamp(2rem,4.4vw,3.6rem)]">{title}</h2>
        {description && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">{description}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
          {action}
        </div>
      )}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
      <div className="mb-5 grid size-14 place-items-center rounded-full bg-cream-deep text-ink-soft">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-2xl', className)} />
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-cream-deep', className)}>
      <div
        className="h-full rounded-full bg-clay transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-ink-soft sm:text-[11px] sm:tracking-[0.16em]">
          {label}
        </p>
        {icon && <span className="shrink-0 text-ink-soft">{icon}</span>}
      </div>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-[-0.05em] [word-spacing:0.12em] sm:text-[30px]">
        {value}
      </p>
      {hint && <p className="mt-2 text-[11px] leading-snug text-ink-soft sm:text-xs">{hint}</p>}
    </div>
  )
}
