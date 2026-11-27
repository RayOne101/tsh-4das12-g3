package tn.esprit.tsh.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.tsh.user.exception.ConflictException;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Client minimal vers l'API Admin de Keycloak pour creer un compte utilisateur
 * lors de l'inscription depuis le frontend.
 */
@Service
public class KeycloakAdminService {

    private final RestClient restClient;
    private final String keycloakUrl;
    private final String realm;
    private final String adminUsername;
    private final String adminPassword;

    public KeycloakAdminService(
            @Value("${keycloak.url:http://localhost:8085}") String keycloakUrl,
            @Value("${keycloak.realm:tsh}") String realm,
            @Value("${keycloak.admin-username:admin}") String adminUsername,
            @Value("${keycloak.admin-password:admin}") String adminPassword) {
        this.restClient = RestClient.create();
        this.keycloakUrl = keycloakUrl.replaceAll("/+$", "");
        this.realm = realm;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    /**
     * Cree l'utilisateur dans Keycloak avec son mot de passe et retourne son keycloakId (UUID).
     */
    public String creerUtilisateur(String nom, String email, String password) {
        String adminToken = obtenirTokenAdmin();

        String[] parts = nom.trim().split("\\s+", 2);
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "";

        Map<String, Object> payload = Map.of(
                "username", email,
                "email", email,
                "firstName", firstName,
                "lastName", lastName,
                "enabled", true,
                "emailVerified", true,
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", password,
                        "temporary", false))
        );

        try {
            ResponseEntity<Void> response = restClient.post()
                    .uri(keycloakUrl + "/admin/realms/" + realm + "/users")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            URI location = response.getHeaders().getLocation();
            if (location == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Keycloak n'a pas retourne l'identifiant utilisateur");
            }
            String path = location.getPath();
            return path.substring(path.lastIndexOf('/') + 1);
        } catch (HttpClientErrorException.Conflict e) {
            throw new ConflictException("Un compte existe deja avec cette adresse email");
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creation du compte refusee par Keycloak");
        } catch (ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Serveur d'authentification Keycloak indisponible", e);
        }
    }

    @SuppressWarnings("unchecked")
    private String obtenirTokenAdmin() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", "admin-cli");
        form.add("username", adminUsername);
        form.add("password", adminPassword);

        try {
            Map<String, Object> body = restClient.post()
                    .uri(keycloakUrl + "/realms/master/protocol/openid-connect/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(Map.class);
            if (body == null || !(body.get("access_token") instanceof String token)) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Token admin Keycloak introuvable");
            }
            return token;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Serveur d'authentification Keycloak indisponible", e);
        }
    }
}
