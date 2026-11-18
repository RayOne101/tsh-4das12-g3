package tn.esprit.tsh.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Appels a l'API Admin de Keycloak (client confidentiel "tsh-user-service").
 * Sert uniquement a suspendre / reactiver un compte (AUTH-06).
 */
@Service
public class KeycloakAdminService {

    private final RestClient restClient;
    private final String realm;
    private final String clientId;
    private final String clientSecret;

    public KeycloakAdminService(
            @Value("${keycloak.admin.base-url:http://localhost:8085}") String baseUrl,
            @Value("${keycloak.admin.realm:tsh}") String realm,
            @Value("${keycloak.admin.client-id:tsh-user-service}") String clientId,
            @Value("${keycloak.admin.client-secret:}") String clientSecret) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.realm = realm;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /** Active ou desactive le compte Keycloak (suspension admin = false). */
    public void setEnabled(String keycloakId, boolean enabled) {
        restClient.put()
                .uri("/admin/realms/{realm}/users/{id}", realm, keycloakId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("enabled", enabled))
                .retrieve()
                .toBodilessEntity();
    }

    private String adminToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);

        TokenResponse token = restClient.post()
                .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenResponse.class);

        if (token == null || token.access_token() == null) {
            throw new IllegalStateException("Impossible d'obtenir un token admin Keycloak");
        }
        return token.access_token();
    }

    private record TokenResponse(String access_token) {
    }
}
