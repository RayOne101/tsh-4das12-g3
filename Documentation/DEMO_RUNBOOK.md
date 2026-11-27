# Guide de Demonstration et Runbook de Soutenance - Projet TSH

Ce document formalise le scenario de demonstration technique et l'ordre de demarrage des composants pour la soutenance du projet TSH (Tunisian Student Housing).

---

## 1. Ordre chronologique de demarrage

Pour garantir que les dependances reseau et de decouverte soient prêtes, demarrez les services dans cet ordre :

### Etape 1 : Infrastructure Docker
Dans un terminal, placez-vous dans le dossier `Backend` :
```bash
cd Backend
docker compose up -d
```
Verifiez que tous les conteneurs sont actifs :
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```
Conteneurs attendus :
- `tsh-postgres-user` (Port 5433)
- `tsh-pgweb` (Port 8082)
- `tsh-pgweb-keycloak` (Port 8086)
- `tsh-minio` (Ports 9000 et 9001)
- `tsh-keycloak` (Port 8085)
- `tsh-kafka` (Port 9092)
- `tsh-kafka-ui` (Port 8088)
- `tsh-zipkin` (Port 9411)
- `tsh-prometheus` (Port 9090)
- `tsh-grafana` (Port 3000)

### Etape 2 : Eureka Discovery Server
Dans votre IDE (ou en ligne de commande) :
- Classe principale : `tn.esprit.tsh.eureka.EurekaServerApplication` (`Backend/infrastructure/Eureka`)
- Verification dans le navigateur : `http://localhost:8761`

### Etape 3 : Spring Cloud Gateway
- Classe principale : `tn.esprit.tsh.gateway.GatewayApplication` (`Backend/infrastructure/Gateway`)
- Verification : `http://localhost:8083/actuator/health` (doit renvoyer `{"status":"UP"}`)
- Swagger UI centralise : `http://localhost:8083/swagger-ui.html`

### Etape 4 : Microservice User
- Classe principale : `tn.esprit.tsh.user.UserApplication` (`Backend/microservices/User`)
- Verification sur Eureka (`http://localhost:8761`) : Le service `USER` doit apparaitre dans la liste des instances enregistrees.

### Etape 5 : Frontend React
Dans un second terminal :
```bash
cd Frontend
npm run dev
```
- Verification dans le navigateur : `http://localhost:5173`

---

## 2. Scenarios cles a presenter au jury

### Scenario 1 : Authentification et Securite JWT (Keycloak)
1. Ouvrez `http://localhost:5173/connexion`.
2. Connectez-vous avec un compte etudiant (ex: `etudiant@tsh.tn` / `etudiant123`).
3. Montrez au jury :
   - L'echange de tokens OAuth2/OIDC.
   - Le stockage du JWT dans le frontend (session).
   - La propagation de l'en-tête `Authorization: Bearer <token>` sur chaque requete HTTP vers la Gateway.

### Scenario 2 : Stockage d'images S3 (MinIO)
1. Accedez a la page de profil : `http://localhost:5173/profile`.
2. Cliquez sur l'avatar et selectionnez une photo (JPEG ou PNG).
3. Cliquez sur Enregistrer.
4. Montrez au jury :
   - L'appel multipart `POST /api/utilisateurs/me/photo`.
   - L'interface web MinIO (`http://localhost:9001`) avec identifiants `minioadmin` / `minioadmin`.
   - L'image stockee dans le bucket `tsh-avatars` sous le chemin `avatars/<keycloakId>/<uuid>.jpg`.
   - La photo qui s'affiche immediatement dans la barre de navigation.

### Scenario 3 : Communication asynchrone par evenements (Apache Kafka)
1. Modifiez une information du profil (par exemple le nom ou le telephone) et validez.
2. Montrez dans la console IntelliJ du microservice User :
   - La publication de l'evenement : `Evenement Kafka publie sur le topic 'user-events' : USER_UPDATED:etudiant@tsh.tn`.
   - La consommation immediate par le consommateur : `[KAFKA CONSUMER] Evenement recu du topic 'user-events' : USER_UPDATED:etudiant@tsh.tn`.
3. Ouvrez le dashboard Kafka UI (`http://localhost:8088`) :
   - Montrez le topic `user-events`.
   - Montrez le message avec sa cle, sa partition et son horodatage.
   - Expliquez que cette architecture decouple completement le service User des autres services (comme Communication ou Notification) sans ralentir la requete de l'utilisateur.

### Scenario 4 : Tableau de bord central (Grafana)
1. Ouvrez Grafana : `http://localhost:3000` (identifiants : `admin` / `admin`).
2. Le dashboard "TSH — Vue d'ensemble des Microservices" s'ouvre automatiquement.
3. Montrez au jury :
   - La barre d'etat en haut : chaque microservice affiche "EN LIGNE" (vert) ou "HORS LIGNE" (rouge).
   - Le graphe de requetes HTTP du service User en temps reel apres une modification de profil.
   - Le graphe de latence (p95) qui monte pendant le televersement d'une photo vers MinIO.
   - L'utilisation memoire JVM et le pool de connexions HikariCP a la base de donnees.
4. Expliquez au jury que Grafana rassemble toutes les metriques de tous les microservices : quand vos camarades deployeront leurs services, leurs courbes apparaitront automatiquement.
5. Utilisez les liens rapides en haut du dashboard pour naviguer vers Zipkin, Kafka UI ou Eureka.

### Scenario 5 : Tracabilite distribuee (Zipkin)
1. Ouvrez l'interface Zipkin : `http://localhost:9411`.
2. Cliquez sur "Run Query".
3. Selectionnez la trace recente correspondant a la mise a jour du profil.
4. Montrez au jury :
   - La traversee complete de la requete : `Gateway` -> `User Service`.
   - Le temps de reponse total et le temps passe dans chaque sous-composant.
   - Les identifiants de trace (`TraceId` et `SpanId`) qui assurent l'observabilite dans une architecture microservices.

---

## 3. Questions frequentes du jury et reponses types

### Q1 : Pourquoi avoir choisi Apache Kafka plutot que des appels REST synchrones entre microservices ?
**Reponse :** Les appels REST synchrones creent un couplage fort : si un service cible (comme le service de Notification ou de Statistique) est en panne ou lent, la modification du profil utilisateur echoue ou ralentit. Avec Kafka, le service User emet un evenement en quelques millisecondes et poursuit son execution. Les autres microservices consomment l'evenement a leur propre rythme de maniere totalement asynchrone et resiliente.

### Q2 : Comment la securite est-elle assuree entre le Frontend et les Microservices ?
**Reponse :** Nous utilisons le protocole OpenID Connect via Keycloak. Le frontend obtient un jeton JWT signe. Toutes les requêtes passent par la Gateway (port 8083) qui verifie la validite du jeton. Les microservices en aval agissent en tant que "Resource Server" Spring Security et extraient directement les claims (identifiant utilisateur, email, rôles) sans avoir a interroger la base de donnees d'authentification a chaque requete.

### Q3 : Pourquoi utiliser MinIO plutot que de stocker les images directement dans PostgreSQL ou sur le disque local ?
**Reponse :** Stocker des fichiers binaires dans une base relationnelle alourdit inutilement les tables et degrade les performances des requêtes SQL. Stocker sur le disque local du conteneur pose un problème lors du redemarrage ou de la mise a l'echelle horizontale (scaling). MinIO offre une API compatible Amazon S3 standard, ce qui permet de passer en production sur AWS S3 ou Google Cloud Storage sans modifier une seule ligne de code.

### Q4 : Que se passe-t-il si Kafka est arrete au moment ou un utilisateur met a jour son profil ?
**Reponse :** Le code du producteur (`UserEventProducer`) est protege par un bloc try/catch avec enregistrement d'un log d'avertissement. La transaction de base de donnees de l'utilisateur se termine avec succes et la reponse HTTP 200 est renvoyee a l'etudiant. La continuite de service est garantie.

### Q5 : A quoi sert Grafana par rapport a Zipkin ? Ce ne sont pas les memes outils ?
**Reponse :** Non, ils ont des roles complementaires. Zipkin repond a la question "Pourquoi cette requete a pris 800ms ?" en montrant le chemin detaille de chaque requete HTTP (Gateway -> User). Grafana repond a "Comment se porte le systeme en ce moment ?" en affichant les tendances : nombre de requetes par seconde, memoire JVM, connexions a la base de donnees, taux d'erreurs. Prometheus collecte les donnees brutes, Grafana les visualise. Les trois outils forment une stack d'observabilite complete standard en entreprise.
