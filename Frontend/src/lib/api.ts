/**
 * Couche d'acces API minimale.
 *
 * Les pages continuent de lire les donnees de demonstration (`lib/data.ts`).
 * Des que l'authentification Keycloak sera branchee, definir
 * `VITE_USE_MOCKS=false` et appeler `setAccessToken(token)` : seul le profil
 * (et l'envoi de photo) passe alors par le backend.
 */
import { loadTokens } from './oidc'

const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

/**
 * Le jeton est aussi relu du stockage : au premier rendu, les effets des pages
 * peuvent s'executer avant celui du fournisseur d'authentification.
 */
function currentAccessToken() {
  return accessToken ?? loadTokens()?.accessToken ?? null
}

export interface Profile {
  id: string
  nom: string
  email: string
  telephone: string | null
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  verifie: boolean
  photoUrl: string | null
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = currentAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    // Le backend renvoie des ProblemDetail (title/detail) : on les remonte tels quels.
    let message = `API ${response.status}`
    try {
      const problem = (await response.json()) as { title?: string; detail?: string }
      message = problem.detail ?? problem.title ?? message
    } catch {
      // reponse sans corps JSON
    }
    throw new Error(message)
  }
  return (await response.json()) as T
}

export function getProfile() {
  return apiFetch<Profile>('/utilisateurs/me')
}

export interface ProfileUpdate {
  nom: string
  email: string
  telephone: string | null
}

export function updateProfile(body: ProfileUpdate) {
  return apiFetch<Profile>('/utilisateurs/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Envoie la photo de profil au microservice User (stockage MinIO). */
export function uploadAvatar(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiFetch<Profile>('/utilisateurs/me/photo', { method: 'POST', body })
}
