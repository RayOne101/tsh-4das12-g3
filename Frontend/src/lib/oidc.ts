/**
 * Connexion Keycloak depuis les formulaires TSH (sans redirection).
 *
 * Les identifiants saisis dans l'application sont envoyes au realm avec le grant
 * `password` ; Keycloak verifie le compte et renvoie les jetons (acces, refresh,
 * id). Les clients sont publics : aucun secret n'est embarque dans le navigateur.
 *
 * Deux clients sont utilises :
 *  - `tsh-web`       : application etudiante ;
 *  - `tsh-admin-web` : console d'administration.
 */

const KEYCLOAK_URL = (import.meta.env.VITE_KEYCLOAK_URL ?? '').replace(/\/$/, '')
const REALM = import.meta.env.VITE_KEYCLOAK_REALM ?? 'tsh'

export const AUTH_ENABLED = Boolean(KEYCLOAK_URL)

const CLIENT_IDS = {
  student: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'tsh-web',
  admin: import.meta.env.VITE_KEYCLOAK_ADMIN_CLIENT_ID ?? 'tsh-admin-web',
} as const

export type AuthTarget = keyof typeof CLIENT_IDS

const TOKENS_KEY = 'tsh.oidc.tokens'

export interface Claims {
  sub: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  email?: string
  picture?: string
  realm_access?: { roles?: string[] }
}

export interface Tokens {
  accessToken: string
  idToken: string | null
  refreshToken: string | null
  /** Timestamp (ms) d'expiration du jeton d'acces. */
  expiresAt: number
  claims: Claims
  /** Client Keycloak qui a ouvert la session, utile pour le refresh. */
  target: AuthTarget
}

interface TokenResponse {
  access_token: string
  id_token?: string
  refresh_token?: string
  expires_in?: number
}

function endpoint(path: string) {
  return `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect${path}`
}

export function decodeClaims(accessToken: string): Claims {
  try {
    const payload = accessToken.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as Claims
  } catch {
    return { sub: '' }
  }
}

function tokensFrom(response: TokenResponse, target: AuthTarget, previous?: Tokens): Tokens {
  return {
    accessToken: response.access_token,
    // Le refresh ne renvoie pas toujours un id_token : on garde celui de la session.
    idToken: response.id_token ?? previous?.idToken ?? null,
    refreshToken: response.refresh_token ?? previous?.refreshToken ?? null,
    expiresAt: Date.now() + (response.expires_in ?? 300) * 1000,
    claims: decodeClaims(response.access_token),
    target,
  }
}

export function rolesOf(tokens: Tokens | null) {
  return tokens?.claims.realm_access?.roles ?? []
}

export function isAdmin(tokens: Tokens | null) {
  return rolesOf(tokens).includes('ROLE_ADMIN')
}

export function loadTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Tokens
    if (!parsed.accessToken) return null
    return parsed
  } catch {
    return null
  }
}

export function storeTokens(tokens: Tokens | null) {
  if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
  else localStorage.removeItem(TOKENS_KEY)
}

async function requestTokens(body: Record<string, string>, target: AuthTarget, previous?: Tokens) {
  const response = await fetch(endpoint('/token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  })

  if (!response.ok) {
    let description = `Keycloak ${response.status}`
    try {
      const problem = (await response.json()) as { error_description?: string; error?: string }
      description = problem.error_description ?? problem.error ?? description
    } catch {
      // reponse sans corps JSON
    }
    throw new Error(description)
  }

  const tokens = tokensFrom((await response.json()) as TokenResponse, target, previous)
  storeTokens(tokens)
  return tokens
}

/** Verifie les identifiants aupres du realm et ouvre une session. */
export function signInWithPassword(target: AuthTarget, username: string, password: string) {
  return requestTokens(
    {
      grant_type: 'password',
      client_id: CLIENT_IDS[target],
      username,
      password,
      scope: 'openid profile email',
    },
    target,
  )
}

/** Renouvelle le jeton d'acces a partir du refresh token. */
export async function refreshTokens(tokens: Tokens): Promise<Tokens | null> {
  if (!tokens.refreshToken) return null

  try {
    return await requestTokens(
      {
        grant_type: 'refresh_token',
        client_id: CLIENT_IDS[tokens.target],
        refresh_token: tokens.refreshToken,
      },
      tokens.target,
      tokens,
    )
  } catch {
    storeTokens(null)
    return null
  }
}

/**
 * Termine la session Keycloak puis revient sur l'accueil. L'id_token sert de
 * `id_token_hint` : sans lui, Keycloak affiche une page de confirmation.
 */
export function endSession(target: AuthTarget = 'student', idToken: string | null = null) {
  storeTokens(null)
  if (!AUTH_ENABLED) return

  const url = new URL(endpoint('/logout'))
  url.searchParams.set('client_id', CLIENT_IDS[target])
  url.searchParams.set('post_logout_redirect_uri', `${window.location.origin}/`)
  if (idToken) url.searchParams.set('id_token_hint', idToken)
  window.location.assign(url.toString())
}
