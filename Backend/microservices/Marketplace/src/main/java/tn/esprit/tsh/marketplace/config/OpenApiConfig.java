package tn.esprit.tsh.marketplace.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI marketplaceOpenApi(@Value("${server.port:8768}") String port) {
        return new OpenAPI()
                .info(new Info()
                        .title("Marketplace Microservice API")
                        .version("1.0.0")
                        .description("Marketplace de meubles d'occasion pour etudiants (Keycloak + Spring Security).")
                        .contact(new Contact().name("TSH")))
                .servers(List.of(new Server().url("http://localhost:" + port).description("Local")));
    }
}
