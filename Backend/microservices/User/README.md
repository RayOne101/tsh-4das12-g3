# Microservice User & Infrastructure Backend TSH

Ce document explique le fonctionnement, l'architecture et le démarrage complet du microservice **User** et de l'infrastructure associée (**Eureka Discovery, Spring Cloud Gateway, Keycloak IAM, PostgreSQL et MinIO**) pour toute l'équipe.

---

## 1. Vue d'ensemble de l'Architecture

```
                                  +------------------------------------+
                                  |    Client Frontend (Port 5173)     |
                                  +-----------------+------------------+
                                                    |
                         Direct Login (ROPC)        | Appels API (/api/**)
                       +----------------------------+
                       |                            v
                       v              +-----------------------------+
             +--------------------+   | Spring Cloud Gateway (8083) |
             |   Keycloak (8085)  |   +--------------+--------------+
             |    (Realm 'tsh')   |                  |
             +--------------------+                  | Découverte (lb://USER)
                       ^                             v
                       |              +-----------------------------+   Enregistrement   +---------------+
        Validation JWT |              |     User Service (8762)     |<------------------>| Eureka (8761) |
                       +--------------+-------+-------------+-------+                    +---------------+
                                              |             |
                                              v             v
                                     +------------+   +-----------+
                                     | PostgreSQL |   |   MinIO   |
                                     |   (5433)   |   | (9000/01) |
                                     +------------+   +-----------+
```

### Rôles des composants :
- **Eureka (Port 8761)** : Annuaire de découverte des microservices. Chaque microservice s'y enregistre automatiquement au démarrage.
- **Spring Cloud Gateway (Port 8083)** : Point d'entrée unique de toutes les requêtes frontales. Il résout dynamiquement les routes via Eureka (`lb://SERVICE_NAME`), gère les en-têtes CORS centralisés et évite d'exposer les microservices directement.
  - `/api/utilisateurs/**` ➔ `lb://USER`
  - `/api/logements/**` ➔ `lb://HOUSING`
  - `/api/colocations/**` ➔ `lb://COLOCATION`
  - `/api/contrats/**` ➔ `lb://CONTRACT`
  - `/api/messages/**` ➔ `lb://COMMUNICATION`
  - `/api/avis/**` ➔ `lb://REVIEW`
  - `/api/meubles/**` ➔ `lb://MARKETPLACE`
  - `/api/transports/**` ➔ `lb://TRANSPORT`
- **Keycloak IAM (Port 8085)** : Gère l'authentification (login, tokens JWT, hash des mots de passe, rôles `ROLE_USER` et `ROLE_ADMIN`). Le frontend communique directement avec Keycloak via Resource Owner Password Credentials (ROPC) pour garder le design customisé TSH.
- **User Service (Port 8762)** : Microservice métier qui stocke les profils utilisateurs (`nom`, `email`, `telephone`, `role`, `verifie`, `photoUrl`).
  - **Auto-provisioning** : Au premier appel authentifié avec un JWT (`GET /api/utilisateurs/me`), l'utilisateur est automatiquement synchronisé et créé en base PostgreSQL s'il n'existait pas encore.
- **PostgreSQL (Port 5433)** : Base de données hébergeant deux bases distinctes : `tsh_users` (pour le service User) et `keycloak` (pour Keycloak).
- **MinIO S3 (Ports 9000/9001)** : Stockage d'objets compatible AWS S3 avec buckets pré-créés : `tsh-avatars` (profils), `tsh-housing` (logements), `tsh-marketplace` (meubles), `tsh-contracts` (contrats).

---

## 2. Prérequis

- **Java 17** (JDK 17) installé et configuré (`java -version`).
- **Maven** (3.8+) installé ou accessible via `.freebuff/tools/apache-maven-3.9.9`.
- **Docker Desktop** démarré.
- **Node.js 18+** (pour exécuter le Frontend).

---

## 3. Démarrage des Services (Manuel via IDE ou Terminal)

### Étape 1 : Démarrer l'infrastructure Docker
À la racine de `Backend/` :
```powershell
docker compose up -d
```
Cela lance :
- PostgreSQL sur `localhost:5433` (bases `tsh_users` et `keycloak`)
- Keycloak sur `http://localhost:8085` (import automatique du realm `tsh`)
- MinIO sur `http://localhost:9000` (API) et `http://localhost:9001` (Console)
- Pgweb sur `http://localhost:8082` (User) et `http://localhost:8086` (Keycloak)

Pour arrêter les conteneurs : `docker compose down`.

### Étape 2 : Démarrer Eureka Discovery (Port 8761)
Dans IntelliJ IDEA : exécuter `EurekaServerApplication` (ou en ligne de commande : `cd Backend/infrastructure/Eureka && mvn spring-boot:run`).  
Tableau de bord : **http://localhost:8761**

### Étape 3 : Démarrer le microservice User (Port 8762)
Dans IntelliJ IDEA : exécuter `UserApplication` (ou `cd Backend/microservices/User && mvn spring-boot:run`).  
Le service s'enregistre auprès d'Eureka sous le nom `USER`.

### Étape 4 : Démarrer la Gateway (Port 8083)
Dans IntelliJ IDEA : exécuter `GatewayApplication` (ou `cd Backend/infrastructure/Gateway && mvn spring-boot:run`).

### Étape 5 : Démarrer le Frontend (Port 5173)
```powershell
cd Frontend
npm run dev
```
Accessible sur **http://localhost:5173**.

---

## 4. Comptes de Test & Keycloak

Le realm `tsh` est préconfiguré dans `Backend/infrastructure/keycloak/tsh-realm.json`.

| Compte | Mot de passe | Rôle | Usage |
|---|---|---|---|
| `etudiant@tsh.tn` | `etudiant123` | `ROLE_USER` | Espace étudiant classique (`/connexion`) |
| `admin@tsh.tn` | `admin123` | `ROLE_ADMIN` | Console d'administration (`/admin/connexion`) |

- **Console Admin Keycloak** : http://localhost:8085/admin
  - Identifiants : `admin` / `admin`
  - Realm : `tsh`
- **Clients Keycloak** :
  - `tsh-web` : Client public pour l'application étudiante.
  - `tsh-admin-web` : Client public pour l'administration.

---

## 5. Documentation de l'API REST (User)

Swagger UI interactif (accessible en local) :
- **Swagger UI** : http://localhost:8762/swagger-ui.html
- **OpenAPI JSON** : http://localhost:8762/v3/api-docs

### Endpoints exposés :

| Méthode | Route | Accès requis | Description |
|---|---|---|---|
| `GET` | `/api/utilisateurs` | `ROLE_ADMIN` | Lister tous les utilisateurs enregistrés |
| `GET` | `/api/utilisateurs/me` | JWT valide (`ROLE_USER` ou `ROLE_ADMIN`) | Consulter le profil connecté (auto-provisionné au premier appel) |
| `PUT` | `/api/utilisateurs/me` | JWT valide | Mettre à jour `nom`, `email`, `telephone` |
| `POST` | `/api/utilisateurs/me/photo` | JWT valide | Téléverser un avatar (format multipart `file`, 2 Mo max, png/jpg/webp). Uploadé dans MinIO. |

### Exemple de corps pour `PUT /api/utilisateurs/me` :
```json
{
  "nom": "Yasmine Chaabane",
  "email": "yasmine.chaabane@esprit.tn",
  "telephone": "+216 22 123 456"
}
```

---

## 6. Tests Automatisés

Le microservice comporte **18 tests automatisés** complets :
- Tests unitaires (Mappers, Services, Validation DTO, Storage MinIO, Sécurité).
- Tests d'intégration avec base H2 en mémoire et simulation MockMvc.

Pour exécuter tous les tests :
```powershell
cd Backend/microservices/User
mvn test
```

Tous les tests doivent afficher `BUILD SUCCESS` (0 failures, 0 errors).
