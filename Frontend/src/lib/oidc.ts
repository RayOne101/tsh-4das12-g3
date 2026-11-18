/**
 * Connexion Keycloak (OIDC, Authorization Code + PKCE).
 *
 * Deux clients publics existent dans le realm `tsh` :
 *  - `tsh-web`       : application etudiante, deja utilisee par la console admin
 *                      lorsqu'elle ouvre une session etudiante ;
 *  - `tsh-admin-web` : console d'administration, avec un URI de retour dedie.
 *
 * Aucun secret n'est embarque dans le navigateur : PKCE (S256) protege l'echange
 * du code d'autorisation.
 */

const KEYCLOAK_URL = (import.meta.env.VITE_KEYCLOAK_URL ?? '').replace(/\/$/, '')
const REALM = import.meta.env.VITE_KEYCLOAK_REALM ?? 'tsh'

export const AUTH_ENABLED = Boolean(KEYCLOAK_URL)

const CLIENT_IDS = {
  student: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'tsh-web',
  admin: import.meta.env.VITE_KEYCLOAK_ADMIN_CLIENT_ID ?? 'tsh-admin-web',
} as const

const REDIRECT_PATHS = {
  student: '/auth/callback',
  admin: '/admin/callback',
} as const

export type AuthTarget = keyof typeof CLIENT_IDS

const TOKENS_KEY = 'tsh.oidc.tokens'
const PKCE_PREFIX = 'tsh.oidc.pkce.'

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

function randomString(bytes = 32) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return Array.from(buffer, (b) => b.toString(16).padStart(2, '0')).join('')
}

function base64Url(buffer: ArrayBuffer) {
  let binary = ''
  new Uint8Array(buffer).forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function codeChallenge(verifier: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64Url(digest)
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

function tokensFrom(response: TokenResponse, target: AuthTarget): Tokens {
  return {
    accessToken: response.access_token,
    idToken: response.id_token ?? null,
    refreshToken: response.refresh_token ?? null,
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

function tokenError(response: Response) {
  return response.text().then(
    (body) => new Error(`Keycloak ${response.status}: ${body.slice(0, 200)}`),
    () => new Error(`Keycloak ${response.status}`),
  )
}

/** Redirige le navigateur vers l'ecran de connexion Keycloak. */
export async function beginLogin(target: AuthTarget, returnTo: string) {
  const verifier = randomString(48)
  const state = randomString(16)
  const redirectUri = `${window.location.origin}${REDIRECT_PATHS[target]}`

  sessionStorage.setItem(
    `${PKCE_PREFIX}${target}`,
    JSON.stringify({ verifier, state, redirectUri, returnTo }),
  )

  const url = new URL(endpoint('/auth'))
  url.searchParams.set('client_id', CLIENT_IDS[target])
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', await codeChallenge(verifier))
  url.searchParams.set('code_challenge_method', 'S256')

  window.location.assign(url.toString())
}

// En dev, React monte les effets deux fois : un code d'autorisation ne peut
// etre echange qu'une seule fois, on memorise donc la promesse en cours.
let pendingExchange: Promise<Tokens> | null = null

/** Echange le code recu sur la page de retour contre des jetons. */
export async function finishLogin(target: AuthTarget, search: string): Promise<Tokens> {
  const stored = sessionStorage.getItem(`${PKCE_PREFIX}${target}`)
  const params = new URLSearchParams(search)

  if (!stored) throw new Error('Session de connexion introuvable, recommence la connexion.')
  const { verifier, state, redirectUri, returnTo } = JSON.parse(stored) as {
    verifier: string
    state: string
    redirectUri: string
    returnTo: string
  }

  const code = params.get('code')
  const returnedState = params.get('state')
  if (params.get('error')) throw new Error(params.get('error_description') ?? 'Connexion annulee.')
  if (!code) throw new Error('Code d’autorisation manquant.')
  if (returnedState !== state) throw new Error('State OIDC invalide.')

  sessionStorage.setItem('tsh.oidc.returnTo', returnTo)

  if (!pendingExchange) {
    pendingExchange = fetch(endpoint('/token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_IDS[target],
        redirect_uri: redirectUri,
        code,
        code_verifier: verifier,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw await tokenError(response)
        const tokens = tokensFrom((await response.json()) as TokenResponse, target)
        storeTokens(tokens)
        sessionStorage.removeItem(`${PKCE_PREFIX}${target}`)
        return tokens
      })
      .finally(() => {
        pendingExchange = null
      })
  }

  return pendingExchange
}

/** URL de retour demandee avant la redirection vers Keycloak. */
export function consumeReturnTo(fallback: string) {
  const returnTo = sessionStorage.getItem('tsh.oidc.returnTo') ?? fallback
  sessionStorage.removeItem('tsh.oidc.returnTo')
  return returnTo
}

/** Renouvelle le jeton d'acces a partir du refresh token. */
export async function refreshTokens(tokens: Tokens): Promise<Tokens | null> {
  if (!tokens.refreshToken) return null

  const response = await fetch(endpoint('/token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_IDS[tokens.target],
      refresh_token: tokens.refreshToken,
    }),
  })

  if (!response.ok) {
    storeTokens(null)
    return null
  }
  const responseToken = (await response.json()) as TokenResponse
  // Le refresh ne renvoie pas toujours un id_token : on garde celui de la session.
  const refreshed = {
    ...tokensFrom(responseToken, tokens.target),
    idToken: responseToken.id_token ?? tokens.idToken,
  }
  storeTokens(refreshed)
  return refreshed
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
