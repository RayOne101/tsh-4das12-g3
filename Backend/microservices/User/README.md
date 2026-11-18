# User

Microservice de profil utilisateur de TSH.

Keycloak porte toute l'authentification (inscription, login, mots de passe, JWT, rôles,
sessions). Ce service stocke le profil métier et expose la modération administrateur.
Il ne gère pas l'OTP.

## Prérequis

- Java 17
- Maven
- Docker Desktop

## Démarrage

### 1. Infrastructure

```powershell
cd Backend/microservices/User

# Optionnel : surcharger les valeurs par défaut
Copy-Item ..\..\..\.env.example .env

docker compose up -d
```

| Service | URL |
|---|---|
| PostgreSQL | `localhost:5433` (bases `tsh_users` et `keycloak`) |
| pgweb User | http://localhost:8082 |
| pgweb Keycloak | http://localhost:8086 |
| Keycloak | http://localhost:8085 |

Les valeurs par défaut suffisent : `postgres` / `postgres`, admin Keycloak `admin` / `admin`.
Keycloak utilise la base `keycloak` sur le même serveur PostgreSQL, et non la base `tsh_users`.

### 2. Microservice

```powershell
cd Backend/microservices/User
mvn spring-boot:run
```

Le service écoute sur `http://localhost:8762`.

### 3. Swagger

- UI : http://localhost:8762/swagger-ui.html
- JSON : http://localhost:8762/v3/api-docs

Swagger est public en développement. En production, retirez l'autorisation
`/swagger-ui/**` et `/v3/api-docs/**` de `SecurityConfig`.

## Keycloak

- Console : http://localhost:8085/admin — `admin` / `admin`
- Realm : `tsh`
- Comptes de développement :
  - `admin` / `admin123` (`admin@tsh.tn`, `ROLE_ADMIN`)
  - `etudiant@tsh.tn` / `etudiant123` (`ROLE_USER`)
- Le username est l'email : `etudiant` seul ne fonctionne pas.
- Clients :
  - `tsh-web` : public, Authorization Code + PKCE, redirect `http://localhost:5173/*`
  - `tsh-cli` : public, password grant, utilisé par les tests HTTP
  - `tsh-user-service` : confidentiel, secret `change-me`, API Admin Keycloak

Le realm est importé depuis `Backend/infrastructure/keycloak/tsh-realm.json`.
Keycloak persiste ses données dans la base PostgreSQL `keycloak` ; le realm
n'est importé que si cette base est vide.
Voir `Backend/infrastructure/keycloak/README.md` pour le détail.

## API

| Méthode | Chemin | Accès | Description |
|---|---|---|---|
| `GET` | `/api/utilisateurs` | `ROLE_ADMIN` | Lister tous les profils |
| `GET` | `/api/utilisateurs/me` | JWT valide | Profil de l'utilisateur connecté |
| `PUT` | `/api/utilisateurs/me` | JWT valide | Mettre à jour `nom`, `email`, `telephone` |
| `PATCH` | `/api/admin/utilisateurs/{id}/statut?verifie=false` | `ROLE_ADMIN` | Suspendre / réactiver un compte |

`PUT /me` exige `nom` et `email`. Le téléphone reste optionnel.

La suspension (`verifie=false`) désactive aussi le compte dans Keycloak : l'utilisateur
ne peut plus se connecter.

## Erreurs

Les erreurs utilisent le format RFC 7807 `application/problem+json`.

| Statut | Cas |
|---|---|
| `400` | Validation, JSON invalide, UUID invalide |
| `401` | JWT absent ou invalide |
| `403` | Rôle insuffisant, ou compte suspendu sur `/api/utilisateurs/me` |
| `404` | Utilisateur introuvable |
| `409` | Email ou téléphone déjà utilisé |

Exemple de validation :

```json
{
  "type": "about:blank",
  "title": "Validation failed",
  "status": 400,
  "detail": "Un ou plusieurs champs sont invalides",
  "instance": "/api/utilisateurs/me",
  "errors": {
    "email": "email must be a valid email address",
    "nom": "nom is required"
  }
}
```

## Tests

```powershell
mvn test
```

19 tests :

- tests unitaires : mapper, validation, service, converter de rôles Keycloak
- tests d'intégration MockMvc : `401`, `403`, `/me`, compte suspendu, PATCH admin, `400`, `404`, `409`

Les tests d'intégration utilisent H2 en mémoire (`application-test.properties`) et
mockent `KeycloakAdminService`.

## Variables

| Variable | Défaut | Usage |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Connexion PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Connexion PostgreSQL |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5433/tsh_users` | URL JDBC |
| `KEYCLOAK_DB_USER` | `keycloak` | Utilisateur de la base Keycloak |
| `KEYCLOAK_DB_PASSWORD` | `keycloak` | Mot de passe de la base Keycloak |
| `KEYCLOAK_DB_URL` | vide (local) | URL JDBC de la base Keycloak ; à définir pour une base managée |
| `KEYCLOAK_DB_POOL_MAX_SIZE` | `10` | Taille max du pool JDBC Keycloak |
| `KEYCLOAK_URL` | `http://localhost:8085` | API Admin Keycloak |
| `KEYCLOAK_ISSUER_URI` | `http://localhost:8085/realms/tsh` | Validation JWT |
| `KEYCLOAK_CLIENT_SECRET` | `change-me` | Client `tsh-user-service` |
| `EUREKA_URL` | `http://localhost:8761/eureka/` | Découverte de services |
