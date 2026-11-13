# TSH — Trusted Student Housing

Plateforme web communautaire pour étudiants en Tunisie : recherche de logements, colocation avec matching, marketplace de meubles et services de déménagement.

![Java](https://img.shields.io/badge/Java-17-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Keycloak](https://img.shields.io/badge/Keycloak-IAM-red?logo=redhat)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Bus-black?logo=apachekafka)
![Redis](https://img.shields.io/badge/Redis-Cache_%26_OTP-dc382d?logo=redis)
![MinIO](https://img.shields.io/badge/MinIO-Object_Storage-c72c48?logo=minio)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database_per_Service-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ed?logo=docker)

## Structure du projet

```text
tsh/
├── Backend/
│   ├── infrastructure/           # API Gateway, Eureka, Keycloak
│   ├── ms-utilisateurs-otp/      # Inscription, rôles, vérification OTP SMS
│   ├── ms-logements/             # Annonces logements, recherche, favoris
│   ├── ms-colocation/            # Annonces colocation, matching Data Science
│   ├── ms-contrats-paiements/    # Contrats PDF, paiements et reçus
│   ├── ms-communication/         # Messagerie temps réel WebSocket & alertes Kafka
│   ├── ms-avis-reclamations/     # Avis, notations et réclamations
│   ├── ms-furniture/             # Marketplace de meubles d'occasion
│   └── ms-moving/                # Déménagement et transport
├── Frontend/                     # Application web cliente React
├── Documentation/
│   ├── Diagrams/
│   │   ├── architecture-logique.png
│   │   ├── architecture-physique.png
│   │   └── diagramme-classes.png
│   ├── TSH_Cahier_des_charges.docx
│   └── TSH_Cahier_des_charges.pdf
├── .gitignore
└── README.md
```
