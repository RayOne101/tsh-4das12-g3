# Gateway

Point d'entrée HTTP de TSH, basé sur Spring Cloud Gateway.

- Port : `8083`
- Découverte : Eureka (`http://localhost:8761/eureka/`)
- Routes : Java `RouteLocator` dans `GatewayApplication`
- CORS : `CorsConfig`

## Démarrage

L'ordre recommandé :

1. Eureka sur `8761`
2. User sur `8762`
3. Gateway :

```powershell
cd Backend/infrastructure/Gateway
mvn spring-boot:run
```

## Routes

| Préfixe | Destination |
|---|---|
| `/api/utilisateurs/**` | `lb://USER` |
| `/api/admin/**` | `lb://USER` |

Le Gateway ne valide pas les JWT lui-même : il transmet l'en-tête `Authorization`
au microservice User, qui applique Spring Security.

## CORS

Origines autorisées :

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Pour ajouter une origine, modifiez `CorsConfig`.

## Tests HTTP

Le fichier `gateway-tests.http` contient le flux complet :

1. token étudiant via `tsh-cli`
2. `GET /api/utilisateurs/me`
3. token admin
4. liste admin
5. suspension / réactivation

## Variables

| Variable | Défaut |
|---|---|
| `GATEWAY_PORT` | `8083` |
| `EUREKA_URL` | `http://localhost:8761/eureka/` |
