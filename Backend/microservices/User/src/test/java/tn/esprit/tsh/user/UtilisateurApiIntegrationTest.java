package tn.esprit.tsh.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.repository.UtilisateurRepository;
import tn.esprit.tsh.user.service.KeycloakAdminService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UtilisateurApiIntegrationTest {

    private static final MediaType PROBLEM_JSON = MediaType.parseMediaType("application/problem+json");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @MockBean
    private KeycloakAdminService keycloakAdminService;

    @TestConfiguration
    static class JwtTestConfig {

        @Bean
        JwtDecoder jwtDecoder() {
            return token -> Jwt.withTokenValue(token)
                    .header("alg", "none")
                    .claim("scope", "test")
                    .build();
        }
    }

    @BeforeEach
    void cleanDatabase() {
        utilisateurRepository.deleteAll();
        reset(keycloakAdminService);
    }

    @Test
    void meWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/utilisateurs/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsProfileWithoutKeycloakId() throws Exception {
        mockMvc.perform(get("/api/utilisateurs/me")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@tsh.tn"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"))
                .andExpect(jsonPath("$.verifie").value(true))
                .andExpect(jsonPath("$.keycloakId").doesNotExist());
    }

    @Test
    void suspendedUserCannotReadProfile() throws Exception {
        persist("kc-user", "user@tsh.tn", false);

        mockMvc.perform(get("/api/utilisateurs/me")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void studentCannotListUsers() throws Exception {
        mockMvc.perform(get("/api/utilisateurs")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanListUsers() throws Exception {
        persist("kc-target", "target@tsh.tn", true);

        mockMvc.perform(get("/api/utilisateurs")
                        .with(token("kc-admin", "admin@tsh.tn", "ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("target@tsh.tn"))
                .andExpect(jsonPath("$[0].verifie").value(true))
                .andExpect(jsonPath("$[0].keycloakId").doesNotExist());
    }

    @Test
    void invalidProfileReturns400ProblemDetail() throws Exception {
        mockMvc.perform(put("/api/utilisateurs/me")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"\",\"email\":\"bad\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Validation failed"))
                .andExpect(jsonPath("$.errors.nom").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void duplicateEmailReturns409ProblemDetail() throws Exception {
        persist("kc-user", "user@tsh.tn", true);
        persist("kc-other", "taken@tsh.tn", true);

        mockMvc.perform(put("/api/utilisateurs/me")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"User\",\"email\":\"taken@tsh.tn\"}"))
                .andExpect(status().isConflict())
                .andExpect(content().contentTypeCompatibleWith(PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Conflict"))
                .andExpect(jsonPath("$.detail").value("Adresse email deja utilisee"));
    }

    @Test
    void studentCannotChangeStatus() throws Exception {
        Utilisateur target = persist("kc-target", "target@tsh.tn", true);

        mockMvc.perform(patch("/api/admin/utilisateurs/{id}/statut", target.getId())
                        .param("verifie", "false")
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanSuspendUser() throws Exception {
        Utilisateur target = persist("kc-target", "target@tsh.tn", true);

        mockMvc.perform(patch("/api/admin/utilisateurs/{id}/statut", target.getId())
                        .param("verifie", "false")
                        .with(token("kc-admin", "admin@tsh.tn", "ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verifie").value(false));

        verify(keycloakAdminService).setEnabled("kc-target", false);
        assertThat(utilisateurRepository.findById(target.getId()).orElseThrow().getVerifie()).isFalse();
    }

    @Test
    void adminPatchUnknownUserReturns404() throws Exception {
        mockMvc.perform(patch("/api/admin/utilisateurs/{id}/statut", UUID.randomUUID())
                        .param("verifie", "false")
                        .with(token("kc-admin", "admin@tsh.tn", "ROLE_ADMIN")))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Resource not found"));
    }

    @Test
    void adminPatchInvalidUuidReturns400() throws Exception {
        mockMvc.perform(patch("/api/admin/utilisateurs/not-a-uuid/statut")
                        .param("verifie", "false")
                        .with(token("kc-admin", "admin@tsh.tn", "ROLE_ADMIN")))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Invalid parameter"));
    }

    private Utilisateur persist(String keycloakId, String email, boolean verifie) {
        return utilisateurRepository.save(Utilisateur.builder()
                .keycloakId(keycloakId)
                .nom("User " + keycloakId)
                .email(email)
                .role(RoleType.ROLE_USER)
                .verifie(verifie)
                .build());
    }

    private static RequestPostProcessor token(String subject, String email, String role) {
        return jwt()
                .jwt(builder -> builder
                        .subject(subject)
                        .claim("email", email)
                        .claim("name", "Test " + role)
                        .claim("preferred_username", email)
                        .claim("realm_access", Map.of("roles", List.of(role))))
                .authorities(new SimpleGrantedAuthority(role));
    }
}
