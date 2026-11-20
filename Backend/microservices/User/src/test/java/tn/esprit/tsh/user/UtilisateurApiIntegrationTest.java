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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.repository.UtilisateurRepository;
import tn.esprit.tsh.user.service.MediaStorageService;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
    private MediaStorageService mediaStorageService;

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
    void uploadAvatarStoresUrlOnProfile() throws Exception {
        when(mediaStorageService.uploadAvatar(anyString(), any()))
                .thenReturn("http://localhost:9000/tsh-avatars/avatars/kc-user/photo.png");
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png", new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/utilisateurs/me/photo").file(file)
                        .with(token("kc-user", "user@tsh.tn", "ROLE_USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photoUrl")
                        .value("http://localhost:9000/tsh-avatars/avatars/kc-user/photo.png"));
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
