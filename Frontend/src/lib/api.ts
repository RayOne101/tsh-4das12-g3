/**
 * Couche d'acces API minimale.
 *
 * Les pages continuent de lire les donnees de demonstration (`lib/data.ts`).
 * Des que l'authentification Keycloak sera branchee, definir
 * `VITE_USE_MOCKS=false` et appeler `setAccessToken(token)` : seul le profil
 * (et l'envoi de photo) passe alors par le backend.
 */
const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
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
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    throw new Error(`API ${response.status}`)
  }
  return (await response.json()) as T
}

export function getProfile() {
  return apiFetch<Profile>('/utilisateurs/me')
}

/** Envoie la photo de profil au microservice User (stockage MinIO). */
export function uploadAvatar(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiFetch<Profile>('/utilisateurs/me/photo', { method: 'POST', body })
}
