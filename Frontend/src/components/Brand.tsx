import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Brand({
  className,
  compact = false,
  invert = false,
}: {
  className?: string
  compact?: boolean
  invert?: boolean
}) {
  return (
    <Link
      to="/"
      aria-label="TSH — accueil"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-[14px] transition-colors duration-300',
          invert ? 'bg-cream text-ink' : 'bg-ink text-cream group-hover:bg-clay group-hover:text-ink',
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M4 20V9.5L12 3l8 6.5V20"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15h16M12 20v-5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            className="text-clay"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-[22px] font-bold tracking-[-0.06em]">TSH</span>
        {!compact && (
          <span
            className={cn(
              'mt-1 block text-[9px] font-semibold uppercase tracking-[0.2em]',
              invert ? 'text-cream/55' : 'text-ink-soft',
            )}
          >
            Student Housing
          </span>
        )}
      </span>
    </Link>
  )
}
