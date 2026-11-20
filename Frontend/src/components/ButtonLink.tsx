import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ink' | 'ghost' | 'light'

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  ink: 'btn-ink',
  ghost: 'btn-ghost',
  light: 'btn-light',
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className,
  state,
}: {
  to: string
  children: ReactNode
  variant?: Variant
  className?: string
  state?: unknown
}) {
  return (
    <Link to={to} state={state} className={cn(variants[variant], className)}>
      {children}
    </Link>
  )
}
