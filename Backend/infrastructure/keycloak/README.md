# Keycloak

Configuration du realm `tsh` utilisée par le microservice User.

Le fichier `tsh-realm.json` est monté dans le conteneur Keycloak par
`Backend/microservices/User/docker-compose.yml` et importé au démarrage
(`start-dev --import-realm`).

## Accès

- Console : http://localhost:8085/admin
- Admin bootstrap : `admin` / `admin`
- Realm applicatif : `tsh`

## Contenu du realm

### Rôles

- `ROLE_ADMIN`
- `ROLE_USER` (rôle par défaut à l'inscription)

Les rôles sont lus depuis le claim `realm_access.roles` du JWT.

### Clients

| Client | Type | Usage |
|---|---|---|
| `tsh-web` | Public, PKCE | Frontend React, redirect `http://localhost:5173/*` |
| `tsh-cli` | Public | Password grant pour les tests HTTP |
| `tsh-user-service` | Confidentiel | API Admin Keycloak (suspension de compte) |

Le secret de `tsh-user-service` est `change-me` en développement. Il doit être
remplacé hors développement via `KEYCLOAK_CLIENT_SECRET`.

### Comptes de développement

| Username | Mot de passe | Rôle |
|---|---|---|
| `admin` | `admin123` | `ROLE_ADMIN` |
| `etudiant@tsh.tn` | `etudiant123` | `ROLE_USER` |

Le username est l'email. L'inscription libre est activée et attribue `ROLE_USER`.

## Réimporter le realm

Keycloak n'importe le JSON que si le realm n'existe pas encore. Après une
modification de `tsh-realm.json` :

```powershell
cd Backend/microservices/User
docker compose down
docker compose up -d
```

Le volume PostgreSQL est conservé. Keycloak utilise un stockage éphémère en
mode `start-dev`, donc le realm est recréé à partir du JSON.

## Production

- Changer les mots de passe admin et le secret du client confidentiel.
- Désactiver `start-dev`.
- Utiliser une base Keycloak persistante.
- Configurer HTTPS et un hostname réel.
