package tn.esprit.tsh.user.config;

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
    public OpenAPI userOpenApi(@Value("${server.port:8762}") String port) {
        return new OpenAPI()
                .info(new Info()
                        .title("User Microservice API")
                        .version("1.0.0")
                        .description("Profil utilisateur et moderation administrative (Keycloak + Spring Security).")
                        .contact(new Contact().name("TSH")))
                .servers(List.of(new Server().url("http://localhost:" + port).description("Local")));
    }
}
