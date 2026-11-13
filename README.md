# TSH — Trusted Student Housing

Plateforme web de logement étudiant, colocation, marketplace de meubles et déménagement en architecture microservices.

## Structure du projet

```text
tsh/
├── Backend/
│   ├── infrastructure/           # API Gateway, Eureka, Keycloak
│   ├── ms-utilisateurs-otp/      # Inscription, profils, rôles, OTP
│   ├── ms-logements/             # Annonces de logements, photos, recherche
│   ├── ms-colocation/            # Colocation et matching
│   ├── ms-contrats-paiements/    # Contrats PDF et paiements
│   ├── ms-communication/         # Messagerie et notifications
│   ├── ms-avis-reclamations/     # Avis, notes et réclamations
│   ├── ms-furniture/             # Marketplace de meubles
│   └── ms-moving/                # Déménagement et transport
├── Frontend/                     # Application web cliente
├── Documentation/
│   ├── Diagrams/
│   │   ├── architecture-logique.png
│   │   ├── architecture-physique.png
│   │   └── diagramme-classes.png
│   └── TSH_Cahier_des_charges_v1.1.pdf
├── .gitignore
└── README.md
```
