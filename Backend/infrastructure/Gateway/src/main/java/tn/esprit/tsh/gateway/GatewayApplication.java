package tn.esprit.tsh.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Microservice User (Profil, roles, admin)
                .route("user-service", r -> r
                        .path("/api/utilisateurs/**", "/api/users/**", "/api/admin/**")
                        .uri("lb://USER"))

                // Microservice Housing (Annonces logements, recherche, favoris)
                .route("housing-service", r -> r
                        .path("/api/logements/**", "/api/housing/**")
                        .uri("lb://HOUSING"))

                // Microservice Colocation (Annonces colocation, profils colocataires, matching)
                .route("colocation-service", r -> r
                        .path("/api/colocations/**", "/api/colocation/**")
                        .uri("lb://COLOCATION"))

                // Microservice Contract (Contrats de bail, generation PDF, paiements)
                .route("contract-service", r -> r
                        .path("/api/contrats/**", "/api/contracts/**")
                        .uri("lb://CONTRACT"))

                // Microservice Communication (Messagerie instantanee, notifications)
                .route("communication-service", r -> r
                        .path("/api/messages/**", "/api/communication/**", "/ws/**")
                        .uri("lb://COMMUNICATION"))

                // Microservice Review (Avis, notes, reclamations)
                .route("review-service", r -> r
                        .path("/api/avis/**", "/api/reviews/**")
                        .uri("lb://REVIEW"))

                // Microservice Marketplace (Meubles d'occasion)
                .route("marketplace-service", r -> r
                        .path("/api/meubles/**", "/api/marketplace/**")
                        .uri("lb://MARKETPLACE"))

                // Microservice Transport (Demenagement, transporteurs etudiants)
                .route("transport-service", r -> r
                        .path("/api/transports/**", "/api/transport/**", "/api/demenagement/**")
                        .uri("lb://TRANSPORT"))

                // Routes OpenAPI / Swagger pour le portail central Swagger UI (/swagger-ui.html)
                .route("user-docs", r -> r.path("/v3/api-docs/user").filters(f -> f.setPath("/v3/api-docs")).uri("lb://USER"))
                .route("housing-docs", r -> r.path("/v3/api-docs/housing").filters(f -> f.setPath("/v3/api-docs")).uri("lb://HOUSING"))
                .route("colocation-docs", r -> r.path("/v3/api-docs/colocation").filters(f -> f.setPath("/v3/api-docs")).uri("lb://COLOCATION"))
                .route("contract-docs", r -> r.path("/v3/api-docs/contract").filters(f -> f.setPath("/v3/api-docs")).uri("lb://CONTRACT"))
                .route("communication-docs", r -> r.path("/v3/api-docs/communication").filters(f -> f.setPath("/v3/api-docs")).uri("lb://COMMUNICATION"))
                .route("review-docs", r -> r.path("/v3/api-docs/review").filters(f -> f.setPath("/v3/api-docs")).uri("lb://REVIEW"))
                .route("marketplace-docs", r -> r.path("/v3/api-docs/marketplace").filters(f -> f.setPath("/v3/api-docs")).uri("lb://MARKETPLACE"))
                .route("transport-docs", r -> r.path("/v3/api-docs/transport").filters(f -> f.setPath("/v3/api-docs")).uri("lb://TRANSPORT"))

                .build();
    }
}
