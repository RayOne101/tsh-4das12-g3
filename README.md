# TSH — Trusted Student Housing

Plateforme web communautaire pour étudiants en Tunisie : recherche de logements, colocation avec matching, marketplace de meubles et services de déménagement.

![Java](https://img.shields.io/badge/Java-17-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Keycloak](https://img.shields.io/badge/Keycloak-IAM-red?logo=redhat)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Bus-black?logo=apachekafka)
![MinIO](https://img.shields.io/badge/MinIO-Object_Storage-c72c48?logo=minio)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database_per_Service-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ed?logo=docker)

## Structure du projet

```text
tsh/
├── Backend/
│   ├── infrastructure/
│   │   ├── Eureka/               # Service discovery
│   │   ├── Gateway/              # API Gateway (routes + CORS)
│   │   └── keycloak/             # Realm tsh (auth, rôles, clients)
│   └── microservices/
│       ├── User/                 # Profil et rôles (Keycloak)
│       ├── Housing/              # Annonces logements, recherche, favoris
│       ├── Colocation/           # Annonces colocation, matching Data Science
│       ├── Contract/             # Contrats PDF, paiements et reçus
│       ├── Communication/        # Messagerie temps réel WebSocket & alertes Kafka
│       ├── Review/               # Avis, notations et réclamations
│       ├── Marketplace/          # Marketplace de meubles d'occasion
│       └── Transport/            # Déménagement et transport
├── Frontend/                     # Application web cliente React
├── Documentation/
│   ├── Diagrams/
│   │   ├── architecture-logique.png
│   │   ├── architecture-physique.png
│   │   ├── diagramme-classes.png
│   │   └── class-01-utilisateurs.png ... class-08-moving.png (diagrammes par microservice)
│   ├── TSH_Cahier_des_charges.docx
│   └── TSH_Cahier_des_charges.pdf
├── .env.example                  # Variables locales (copier vers .env)
├── .gitignore
└── README.md
```

> Seul le microservice `User` est implémenté à ce stade. Les autres dossiers
> contiennent les skeletons des microservices à venir : ils démarrent, sont
> découverts par Eureka et exposent leur port, mais n'ont pas encore de logique
> métier ni de base de données.

## Ports

| Service | Port |
|---|---|
| Eureka | 8761 |
| Gateway | 8083 |
| Keycloak | 8085 |
| User | 8762 |
| Housing | 8763 |
| Colocation | 8764 |
| Contract | 8765 |
| Communication | 8766 |
| Review | 8767 |
| Marketplace | 8768 |
| Transport | 8769 |
| Frontend (Vite) | 5173 |
| PostgreSQL | 5433 |
| MinIO (API / console) | 9000 / 9001 |

## Démarrage

### Tout démarrer en une commande

```bash
cd Backend
./start-local.sh --build   # conteneurs + Eureka + User + Gateway

cd ../Frontend
npm install
npm run dev                # http://localhost:5173
```

`./start-local.sh` sans `--build` réutilise les jars existants et ignore les
services déjà lancés. `./stop-local.sh` arrête les trois services Spring
(`--infra` coupe aussi les conteneurs). Logs et PID : `Backend/logs/`.

### Comptes de test (realm `tsh`)

| Compte | Mot de passe | Accès |
|---|---|---|
| `etudiant@tsh.tn` | `etudiant123` | Application étudiante (`/connexion`) |
| `admin@tsh.tn` | `admin123` | Console d'administration (`/admin/connexion`) |

Les formulaires de connexion envoient les identifiants à Keycloak (grant
`password`), qui renvoie le JWT et les rôles : l'utilisateur reste sur les pages
TSH, sans écran Keycloak. C'est actif dès que `VITE_KEYCLOAK_URL` est renseigné
dans `Frontend/.env` (voir `Frontend/.env.example`). Seuls le profil et la photo
passent par l'API ; les autres pages affichent encore les données de démonstration.

### Documentation par composant

- [Microservice User](Backend/microservices/User/README.md)
- [API Gateway](Backend/infrastructure/Gateway/README.md)
- [Keycloak](Backend/infrastructure/keycloak/README.md)
