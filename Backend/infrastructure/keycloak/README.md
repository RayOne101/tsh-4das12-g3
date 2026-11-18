# Keycloak

Configuration du realm `tsh` utilisée par le microservice User.

Keycloak porte l'authentification (inscription, login, mots de passe, JWT, rôles,
sessions). Le microservice User stocke uniquement le profil métier.

## Base de données

Keycloak utilise PostgreSQL, comme le microservice User, mais dans une base
séparée. En local, les deux bases vivent sur le même serveur PostgreSQL :

| Base | Usage |
|---|---|
| `tsh_users` | Microservice User |
| `keycloak` | Keycloak (realms, clients, rôles, utilisateurs, sessions) |

Le conteneur `postgres-user` crée la base `keycloak` et l'utilisateur
`keycloak` au premier démarrage du volume, via le script :

```text
Backend/microservices/User/postgres/init/01-keycloak-db.sh
```

Sur un volume PostgreSQL déjà existant, ce script ne s'exécute pas. Créer la
base manuellement une seule fois :

```powershell
docker exec -it tsh-postgres-user psql -U postgres `
  -c "CREATE USER keycloak WITH PASSWORD 'keycloak';"

docker exec -it tsh-postgres-user psql -U postgres `
  -c "CREATE DATABASE keycloak OWNER keycloak;"
```

Puis recréer Keycloak :

```powershell
cd Backend/microservices/User
docker compose up -d --force-recreate keycloak
```

Keycloak crée lui-même ses tables dans la base `keycloak`. Ne pas créer les
tables manuellement.

## Accès

- Console : http://localhost:8085/admin
- Admin bootstrap : `admin` / `admin`
- Realm applicatif : `tsh`
- pgweb User : http://localhost:8082
- pgweb Keycloak : http://localhost:8086

## Contenu du realm

### Rôles

- `ROLE_ADMIN`
- `ROLE_USER` (rôle par défaut à l'inscription)

Les rôles sont lus depuis le claim `realm_access.roles` du JWT.

### Clients

| Client | Type | Usage |
|---|---|---|
| `tsh-web` | Public, PKCE | Application étudiante, redirect `http://localhost:5173/*` |
| `tsh-admin-web` | Public, PKCE | Console d'administration, redirect `http://localhost:5173/admin/callback` |
| `tsh-cli` | Public | Password grant pour les tests HTTP |

### Connexion depuis le frontend

Le frontend utilise le flow Authorization Code + PKCE : aucun secret n'est
embarqué dans le navigateur. Il est activé par `Frontend/.env` :

```dotenv
VITE_KEYCLOAK_URL=http://localhost:8085
VITE_KEYCLOAK_REALM=tsh
VITE_KEYCLOAK_CLIENT_ID=tsh-web
VITE_KEYCLOAK_ADMIN_CLIENT_ID=tsh-admin-web
```

L'application étudiante ouvre une session avec `tsh-web`. La console
`/admin/connexion` utilise `tsh-admin-web` et refuse toute session sans le rôle
realm `ROLE_ADMIN`. Sans `VITE_KEYCLOAK_URL`, le frontend retombe sur une
connexion simulée (mode démonstration).

### Comptes de développement

| Username | Mot de passe | Rôle |
|---|---|---|
| `admin` | `admin123` | `ROLE_ADMIN` |
| `etudiant@tsh.tn` | `etudiant123` | `ROLE_USER` |

Le username est l'email. L'inscription libre est activée et attribue `ROLE_USER`.

## Persistance et import du realm

Keycloak n'utilise plus H2 : les données sont stockées dans PostgreSQL et
survivent à un `docker compose down` (sans `-v`).

Le fichier `tsh-realm.json` n'est importé que si le realm `tsh` n'existe pas
encore dans la base. Après une modification du JSON, il faut donc réinitialiser
le realm ou la base Keycloak.

Pour supprimer uniquement la base Keycloak, sans toucher à `tsh_users` :

```powershell
cd Backend/microservices/User

docker compose stop keycloak
docker exec -it tsh-postgres-user psql -U postgres `
  -c "DROP DATABASE keycloak WITH (FORCE);"
docker exec -it tsh-postgres-user psql -U postgres `
  -c "CREATE DATABASE keycloak OWNER keycloak;"
docker compose up -d --force-recreate keycloak
```

Attention : cela supprime les utilisateurs auto-inscrits et les sessions. Les
comptes de développement sont recréés par l'import du realm.

## Production

En production, utiliser une instance PostgreSQL managée avec une base dédiée
`keycloak`. Ne pas utiliser H2 et ne pas exposer PostgreSQL publiquement.

Exemple de variables :

```env
KEYCLOAK_DB_URL=jdbc:postgresql://<host>:5432/keycloak?sslmode=require
KEYCLOAK_DB_USER=keycloak
KEYCLOAK_DB_PASSWORD=<secret>
KEYCLOAK_HOSTNAME=https://auth.example.com
```

Le paramètre `sslmode` dépend du fournisseur. Certains imposent
`sslmode=verify-full` avec un certificat CA.

En production :

- remplacer `start-dev` par `start` (ou une image optimisée),
- configurer HTTPS et un hostname réel,
- mettre Keycloak derrière un reverse proxy TLS,
- définir `KC_PROXY_HEADERS=xforwarded` si le proxy transmet les en-têtes,
- activer `KC_HEALTH_ENABLED=true` si nécessaire,
- stocker les secrets dans un gestionnaire de secrets, pas dans `.env`,
- sauvegarder la base `keycloak` (backups/PITR),
- ne pas exposer le port PostgreSQL,
- ajuster le pool JDBC selon la limite de connexions du fournisseur
  (`KEYCLOAK_DB_POOL_MAX_SIZE`),
- faire partager la même base à tous les nœuds Keycloak (pas une base par nœud).

Éviter les offres PostgreSQL gratuites qui mettent la base en pause : Keycloak
deviendrait indisponible pour le login.

