import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Photo({
  src,
  alt,
  className,
  imgClassName,
  rounded = 'rounded-[1.25rem]',
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  rounded?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-cream-deep', rounded, className)}>
      {failed ? (
        <div className="grain absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream-deep to-[#d8d1c4] text-ink-soft">
          <ImageOff className="size-6" />
          <span className="px-4 text-center text-[11px] font-medium uppercase tracking-[0.15em]">
            {alt}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn(
            'size-full object-cover transition-transform duration-[900ms] ease-out',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
