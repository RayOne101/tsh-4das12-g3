import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'

type ToastKind = 'success' | 'info' | 'error'

interface Toast {
  id: number
  message: string
  kind: ToastKind
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons = {
  success: Check,
  info: Info,
  error: TriangleAlert,
}

const styles = {
  success: 'bg-sage-soft text-sage border-sage/20',
  info: 'bg-white text-ink border-ink/10',
  error: 'bg-rust-soft text-rust border-rust/20',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4">
        {toasts.map((item) => {
          const Icon = icons[item.kind]
          return (
            <div
              key={item.id}
              className={`animate-fade-up pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-lift ${styles[item.kind]}`}
            >
              <Icon className="size-4 shrink-0" />
              <p className="flex-1 text-sm font-medium">{item.message}</p>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setToasts((current) => current.filter((t) => t.id !== item.id))}
                className="rounded-full p-1 opacity-60 transition hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
