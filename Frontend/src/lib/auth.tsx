import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Role } from './data'
import { avatar } from './data'

export interface Session {
  role: Role
  name: string
  email: string
  image: string
  suspended: boolean
  expiresAt: number
}

interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  login: (role?: Role, customData?: Partial<Session>) => void
  logout: () => void
  switchRole: (role: Role) => void
  setSuspended: (value: boolean) => void
  expire: () => void
}

const STORAGE_KEY = 'tsh.demo.session'

const profiles: Record<Exclude<Role, 'guest'>, { name: string; email: string; image: string }> = {
  user: {
    name: 'Yasmine Chaabane',
    email: 'yasmine.c@tsh.tn',
    image: avatar(44),
  },
  student: {
    name: 'Yasmine Chaabane',
    email: 'yasmine.c@tsh.tn',
    image: avatar(44),
  },
  owner: {
    name: 'Amel Ben Salah',
    email: 'amel.bensalah@tsh.tn',
    image: avatar(47),
  },
  admin: {
    name: 'Sami Moderateur',
    email: 'sami.moderateur@tsh.tn',
    image: avatar(60),
  },
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.role || parsed.role === 'guest') return null
    if (parsed.suspended) return parsed
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession())

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  }, [session])

  const login = useCallback((role: Role = 'student', customData?: Partial<Session>) => {
    const safeRole = role === 'guest' ? 'student' : role
    const profile = profiles[safeRole]
    setSession({
      role: safeRole,
      ...profile,
      ...(customData ?? {}),
      suspended: false,
      // Mirrors the 15-minute Keycloak access token used by the real stack.
      expiresAt: Date.now() + 15 * 60 * 1000,
    })
  }, [])

  const logout = useCallback(() => setSession(null), [])

  const switchRole = useCallback(
    (role: Role) => {
      if (role === 'guest') {
        setSession(null)
        return
      }
      const profile = profiles[role]
      setSession((current) => ({
        role,
        ...profile,
        suspended: current?.suspended ?? false,
        expiresAt: Date.now() + 15 * 60 * 1000,
      }))
    },
    [],
  )

  const setSuspended = useCallback((value: boolean) => {
    setSession((current) => (current ? { ...current, suspended: value } : current))
  }, [])

  const expire = useCallback(() => {
    setSession((current) =>
      current ? { ...current, expiresAt: Date.now() - 1000 } : current,
    )
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session: session && !session.suspended ? session : session,
      isAuthenticated: Boolean(session) && !session?.suspended,
      login,
      logout,
      switchRole,
      setSuspended,
      expire,
    }),
    [session, login, logout, switchRole, setSuspended, expire],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function hasRole(role: Role | undefined, required: 'ROLE_ADMIN' | 'ROLE_PROPRIETAIRE' | 'ROLE_USER') {
  if (!role || role === 'guest') return false
  if (role === 'admin') return true
  // Unified Community Model: every registered member can propose housing, colocation, marketplace, and transport
  return required !== 'ROLE_ADMIN'
}
