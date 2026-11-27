import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Role } from './data'
import { avatar } from './data'
import { USE_MOCKS, getProfile, setAccessToken } from './api'
import {
  AUTH_ENABLED,
  endSession,
  isAdmin,
  loadTokens,
  refreshTokens,
  signInWithPassword,
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
  /** Verifie les identifiants aupres de Keycloak et ouvre la session. */
  signIn: (
    target: AuthTarget,
    username: string,
    password: string,
    options?: { requireAdmin?: boolean },
  ) => Promise<Tokens>
  logout: () => void
  switchRole: (role: Role) => void
  expire: () => void
  /** Met a jour l'image de profil dans la session et le stockage local. */
  updateSessionImage: (imageUrl: string) => void
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
  const [avatarOverride, setAvatarOverride] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tsh.user.avatar')
    } catch {
      return null
    }
  })
  const [profileOverride, setProfileOverride] = useState<{
    name?: string
    email?: string
    image?: string
  } | null>(null)
  const [demoSession, setDemoSession] = useState<Session | null>(() =>
    AUTH_ENABLED ? null : readSession(),
  )
  const [tokens, setTokens] = useState<Tokens | null>(() => (AUTH_ENABLED ? loadTokens() : null))

  // Le jeton d'acces est lu par lib/api.ts a chaque appel.
  useEffect(() => {
    setAccessToken(tokens?.accessToken ?? null)
  }, [tokens])

  // Synchronise le vrai profil (nom, email, photoUrl MinIO) depuis le microservice User apres connexion.
  useEffect(() => {
    if (!AUTH_ENABLED || USE_MOCKS || !tokens?.accessToken) {
      setProfileOverride(null)
      return
    }
    let cancelled = false
    setAccessToken(tokens.accessToken)
    getProfile()
      .then((profile) => {
        if (cancelled) return
        setProfileOverride({
          name: profile.nom,
          email: profile.email,
          image: profile.photoUrl ?? undefined,
        })
        if (profile.photoUrl) {
          try {
            localStorage.setItem('tsh.user.avatar', profile.photoUrl)
          } catch {
            // ignore
          }
          setAvatarOverride(profile.photoUrl)
        }
      })
      .catch(() => {
        // Si le microservice User est momentannement indisponible, on garde les claims du JWT.
      })
    return () => {
      cancelled = true
    }
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

  const signIn = useCallback(
    async (
      target: AuthTarget,
      username: string,
      password: string,
      options?: { requireAdmin?: boolean },
    ) => {
      try {
        localStorage.removeItem('tsh.user.avatar')
      } catch {
        // ignore
      }
      setAvatarOverride(null)
      setProfileOverride(null)

      const next = await signInWithPassword(target, username, password)
      if (options?.requireAdmin && !isAdmin(next)) {
        storeTokens(null)
        setTokens(null)
        throw new Error('ROLE_ADMIN requis')
      }
      setAccessToken(next.accessToken)
      setTokens(next)
      return next
    },
    [],
  )

  const updateSessionImage = useCallback((imageUrl: string) => {
    try {
      localStorage.setItem('tsh.user.avatar', imageUrl)
    } catch {
      // stockage local indisponible
    }
    setAvatarOverride(imageUrl)
    setDemoSession((current) => (current ? { ...current, image: imageUrl } : current))
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('tsh.user.avatar')
    } catch {
      // stockage local indisponible
    }
    setAvatarOverride(null)
    setProfileOverride(null)
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

  const session = useMemo(() => {
    const base = tokens ? sessionFromTokens(tokens) : demoSession
    if (!base) return null
    return {
      ...base,
      ...(profileOverride?.name ? { name: profileOverride.name } : {}),
      ...(profileOverride?.email ? { email: profileOverride.email } : {}),
      image: avatarOverride || profileOverride?.image || base.image,
    }
  }, [tokens, demoSession, avatarOverride, profileOverride])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      authEnabled: AUTH_ENABLED,
      login,
      signIn,
      logout,
      switchRole,
      expire,
      updateSessionImage,
    }),
    [session, login, signIn, logout, switchRole, expire, updateSessionImage],
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
