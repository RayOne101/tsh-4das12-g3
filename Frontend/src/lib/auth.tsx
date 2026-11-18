import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Role } from './data'
import { avatar } from './data'
import { setAccessToken } from './api'
import {
  AUTH_ENABLED,
  beginLogin,
  endSession,
  finishLogin,
  isAdmin,
  loadTokens,
  refreshTokens,
  storeTokens,
  type AuthTarget,
  type Tokens,
} from './oidc'

export interface Session {
  role: Role
  name: string
  email: string
  image: string
  expiresAt: number
}

interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  /** true si la connexion reelle Keycloak est configuree (VITE_KEYCLOAK_URL). */
  authEnabled: boolean
  login: (role?: Role, customData?: Partial<Session>) => void
  loginWithKeycloak: (target: AuthTarget, returnTo: string) => Promise<void>
  finishKeycloakLogin: (target: AuthTarget, options?: { requireAdmin?: boolean }) => Promise<Tokens>
  logout: () => void
  switchRole: (role: Role) => void
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
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

/** Traduit les jetons Keycloak en session affichee par l'interface. */
function sessionFromTokens(tokens: Tokens): Session {
  const claims = tokens.claims
  const name =
    claims.name ||
    [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
    claims.preferred_username ||
    'Utilisateur TSH'

  return {
    role: isAdmin(tokens) ? 'admin' : 'student',
    name,
    email: claims.email ?? claims.preferred_username ?? '',
    image: claims.picture ?? avatar(44),
    expiresAt: tokens.expiresAt,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [demoSession, setDemoSession] = useState<Session | null>(() =>
    AUTH_ENABLED ? null : readSession(),
  )
  const [tokens, setTokens] = useState<Tokens | null>(() => (AUTH_ENABLED ? loadTokens() : null))

  // Le jeton d'acces est lu par lib/api.ts a chaque appel.
  useEffect(() => {
    setAccessToken(tokens?.accessToken ?? null)
  }, [tokens])

  useEffect(() => {
    if (AUTH_ENABLED) return
    if (demoSession) localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSession))
    else localStorage.removeItem(STORAGE_KEY)
  }, [demoSession])

  // Renouvelle le jeton une minute avant expiration (duree Keycloak : 15 min).
  useEffect(() => {
    if (!tokens) return
    const delay = Math.max(tokens.expiresAt - Date.now() - 60_000, 0)
    const timer = window.setTimeout(async () => {
      const refreshed = await refreshTokens(tokens)
      setTokens(refreshed)
      if (!refreshed) storeTokens(null)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [tokens])

  const login = useCallback((role: Role = 'student', customData?: Partial<Session>) => {
    if (AUTH_ENABLED) return
    const safeRole = role === 'guest' ? 'student' : role
    const profile = profiles[safeRole]
    setDemoSession({
      role: safeRole,
      ...profile,
      ...(customData ?? {}),
      // Mirrors the 15-minute Keycloak access token used by the real stack.
      expiresAt: Date.now() + 15 * 60 * 1000,
    })
  }, [])

  const loginWithKeycloak = useCallback(async (target: AuthTarget, returnTo: string) => {
    await beginLogin(target, returnTo)
  }, [])

  const finishKeycloakLogin = useCallback(
    async (target: AuthTarget, options?: { requireAdmin?: boolean }) => {
      const next = await finishLogin(target, window.location.search)
      if (options?.requireAdmin && !isAdmin(next)) {
        storeTokens(null)
        setTokens(null)
        throw new Error('ROLE_ADMIN requis')
      }
      setTokens(next)
      return next
    },
    [],
  )

  const logout = useCallback(() => {
    if (AUTH_ENABLED) {
      setTokens(null)
      storeTokens(null)
      setAccessToken(null)
      endSession(tokens?.target ?? 'student', tokens?.idToken ?? null)
      return
    }
    setDemoSession(null)
  }, [tokens])

  const switchRole = useCallback(
    (role: Role) => {
      if (AUTH_ENABLED) return
      if (role === 'guest') {
        setDemoSession(null)
        return
      }
      const profile = profiles[role]
      setDemoSession({
        role,
        ...profile,
        expiresAt: Date.now() + 15 * 60 * 1000,
      })
    },
    [],
  )

  const expire = useCallback(() => {
    setDemoSession((current) =>
      current ? { ...current, expiresAt: Date.now() - 1000 } : current,
    )
  }, [])

  const session = useMemo(
    () => (tokens ? sessionFromTokens(tokens) : demoSession),
    [tokens, demoSession],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      authEnabled: AUTH_ENABLED,
      login,
      loginWithKeycloak,
      finishKeycloakLogin,
      logout,
      switchRole,
      expire,
    }),
    [session, login, loginWithKeycloak, finishKeycloakLogin, logout, switchRole, expire],
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
