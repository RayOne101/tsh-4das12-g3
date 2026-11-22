# Guide de Développement — Équipe TSH

Ce guide simple explique comment lancer le projet et développer votre microservice sans vous soucier de la configuration des autres services.

---

## 1. Architecture globale simplifiée

- **Keycloak** (port `8085`) : Gère l'authentification (login, tokens JWT, rôles).
- **PostgreSQL** (port `5433`) : Base de données.
- **MinIO** (port `9000` / console `9001`) : Stockage S3 des images/documents.
- **Eureka** (port `8761`) : Annuaire des microservices.
- **Gateway** (port `8083`) : Point d'entrée unique de toutes les requêtes frontend `/api/...`.
- **Frontend** (port `5173`) : Interface React (Vite).

---

## 2. Démarrer l'infrastructure partagée

Avant de lancer votre microservice dans votre IDE (IntelliJ ou Eclipse) :

```bash
# 1. Aller dans le dossier Backend
cd Backend

# 2. Démarrer Keycloak, PostgreSQL et MinIO
docker compose up -d
```

> **Vérification rapide :**
> - Keycloak : http://localhost:8085 (identifiants admin : `admin` / `admin`)
> - PgWeb (base de données) : http://localhost:8082
> - MinIO Console : http://localhost:9001 (identifiants : `minioadmin` / `minioadmin`)

---

## 3. Démarrer Eureka & la Gateway

1. Ouvrez le projet `Backend` dans votre IDE.
2. Démarrez **EurekaServerApplication** (`Backend/infrastructure/Eureka`).
   - Dashboard visible sur : http://localhost:8761
3. Démarrez **GatewayApplication** (`Backend/infrastructure/Gateway`).
   - Accessible sur : http://localhost:8083

---

## 4. Développer votre Microservice

Chaque membre a son propre microservice dans `Backend/microservices/<NomService>` :

| Microservice | Port local suggéré | Préfixe d'URL Gateway |
|---|---|---|
| **User** | `8762` | `/api/utilisateurs/**` |
| **Housing** | `8763` | `/api/logements/**` |
| **Colocation** | `8764` | `/api/colocations/**` |
| **Contract** | `8765` | `/api/contrats/**` |
| **Communication** | `8766` | `/api/messages/**` |
| **Review** | `8767` | `/api/avis/**` |
| **Marketplace** | `8768` | `/api/meubles/**` |
| **Transport** | `8769` | `/api/transports/**` |

### Configuration dans votre `application.properties` :
Pour que la Gateway trouve votre service automatiquement, vérifiez ces 2 lignes :
```properties
spring.application.name=HOUSING        # Mettre le nom en majuscules (ex: HOUSING, COLOCATION, etc.)
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

---

## 5. Lancer le Frontend

```bash
cd Frontend
npm install
npm run dev
```
Accessible sur : http://localhost:5173

- **Mode démo (sans backend)** : activé par défaut si Keycloak n'est pas configuré.
- **Mode connecté (réel)** : ajoutez un fichier `Frontend/.env` avec :
  ```env
  VITE_KEYCLOAK_URL=http://localhost:8085
  VITE_API_URL=http://localhost:8083/api
  VITE_USE_MOCKS=false
  ```

---

## 6. Règles Git simples

1. Travaillez sur la branche dédiée à votre microservice (ex: `Housing`, `Colocation`...).
2. Faites des commits réguliers avec un message clair :
   ```bash
   git commit -m "feat: ajout du contrôleur de recherche de logement"
   ```
3. Poussez sur votre branche :
   ```bash
   git push origin <VotreBranche>
   ```
