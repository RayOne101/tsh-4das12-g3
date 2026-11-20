import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { conversations } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Brand } from '@/components/Brand'
import { ButtonLink } from '@/components/ButtonLink'

const links = [
  { to: '/', label: 'Logements', end: true },
  { to: '/colocation', label: 'Colocation', end: false },
  { to: '/meubles', label: 'Meubles', end: false },
  { to: '/demenagement', label: 'Déménagement', end: false },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { session, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unread ?? 0), 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleOutside)
    }
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [userMenuOpen])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            'mx-auto flex max-w-[92rem] items-center justify-between gap-4 rounded-[1.4rem] border px-4 py-2.5 transition-all duration-300 sm:px-5',
            scrolled
              ? 'border-ink/[0.08] bg-white/92 shadow-[0_10px_30px_rgb(34_33_31/0.07)] backdrop-blur-xl'
              : 'border-transparent bg-cream/70 backdrop-blur-md',
          )}
        >
          <Brand className="shrink-0" />

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors',
                    isActive ? 'bg-cream-deep text-ink' : 'text-ink-soft hover:bg-cream-deep/60 hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {/* Icon shortcuts — only when logged in */}
            {isAuthenticated && (
              <div className="flex items-center gap-1 rounded-full border border-ink/[0.08] bg-white/70 p-1 backdrop-blur">
                <Link
                  to="/app/messages"
                  title="Messages"
                  className="relative grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  <MessageSquare className="size-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-clay text-[8.5px] font-bold text-ink ring-1 ring-white">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <Link
                  to="/app/contrats"
                  title="Contrats & paiements"
                  className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  <FileText className="size-4" />
                </Link>
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="relative flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-2 pr-3 shadow-sm transition hover:border-ink/25"
                >
                  <img
                    src={session?.image}
                    alt=""
                    className="size-7 rounded-full object-cover"
                  />
                  <span className="max-w-[7.5rem] truncate text-[12.5px] font-semibold text-ink">
                    {session?.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn('size-3.5 text-ink-soft transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-ink/[0.08] bg-white p-2 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-ink/[0.06] px-3 py-2.5">
                      <p className="text-[13px] font-semibold text-ink">{session?.name}</p>
                      <p className="truncate text-[11px] text-ink-soft">{session?.email}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-cream-deep px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-ink-soft">
                        Membre TSH
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/app/profil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] font-medium text-ink transition hover:bg-cream"
                      >
                        <User className="size-4 text-ink-soft" />
                        Mon profil & Sécurité
                      </Link>

                    </div>

                    <div className="border-t border-ink/[0.06] pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] font-medium text-rust transition hover:bg-rust-soft/40"
                      >
                        <LogOut className="size-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ButtonLink to="/connexion" variant="ink" className="btn-sm">
                Se connecter
              </ButtonLink>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="grid size-10 place-items-center rounded-full bg-white text-ink md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-8 pt-24 text-cream md:hidden">
          <nav className="flex flex-col divide-y divide-white/10">
            {links.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-baseline justify-between py-4 text-[24px] font-semibold tracking-[-0.03em]"
              >
                {link.label}
                <span className="text-[11px] font-medium tracking-[0.15em] text-cream/40">
                  0{i + 1}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/app/profil"
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  <span>Mon profil ({session?.name})</span>
                  <User className="size-4" />
                </Link>
                <Link
                  to="/app/messages"
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  <span>Messages</span>
                  <MessageSquare className="size-4" />
                </Link>
                <Link
                  to="/app/contrats"
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  <span>Contrats</span>
                  <FileText className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 text-center text-xs font-semibold text-cream/60 hover:text-white"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <ButtonLink to="/connexion" variant="primary" className="w-full">
                  Se connecter
                </ButtonLink>
                <ButtonLink to="/bienvenue" variant="light" className="w-full">
                  Créer un compte
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
