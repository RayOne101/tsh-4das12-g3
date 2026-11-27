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
> - Zipkin (Traçabilité distribuée) : http://localhost:9411
> - Kafka Broker : `localhost:9092`
> - Kafka UI (Tableau de bord) : http://localhost:8088
> - **Grafana (Dashboard central)** : http://localhost:3000 (identifiants : `admin` / `admin`)
> - Prometheus (Métriques brutes) : http://localhost:9090

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

### Comment consommer les événements Kafka du service User :
Si votre microservice doit être notifié lorsqu'un utilisateur s'inscrit ou modifie son profil :
1. Ajoutez la dépendance `spring-kafka` dans votre `pom.xml`.
2. Ajoutez dans votre `application.properties` :
```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=votre-service-group
spring.kafka.consumer.auto-offset-reset=earliest
```
3. Créez un composant d'écoute :
```java
@Service
public class UserNotificationConsumer {
    @KafkaListener(topics = "user-events", groupId = "votre-service-group")
    public void onUserEvent(String message) {
        // Traitement (ex: initialiser les preferences de notification, envoyer un email...)
    }
}
```

### Comment sécuriser vos endpoints avec Keycloak :
1. Ajoutez la dépendance `spring-boot-starter-oauth2-resource-server`.
2. Configurez l'émetteur JWT dans `application.properties` :
```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8085/realms/tsh
```
3. Dans votre contrôleur, récupérez l'utilisateur connecté via `@AuthenticationPrincipal Jwt jwt` :
```java
@GetMapping("/mon-action")
public ResponseEntity<?> monAction(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getSubject();
    String email = jwt.getClaimAsString("email");
    return ResponseEntity.ok("Action executee pour " + email);
}
```

### Comment stocker des fichiers dans MinIO :
Les buckets suivants sont créés automatiquement au démarrage :
- `tsh-housing` pour les photos de logements
- `tsh-marketplace` pour les photos de meubles
- `tsh-contracts` pour les documents PDF de baux
- `tsh-avatars` pour les photos de profil

Configuration S3 :
```properties
minio.url=http://localhost:9000
minio.access-key=minioadmin
minio.secret-key=minioadmin
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
