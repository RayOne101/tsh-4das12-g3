package tn.esprit.tsh.user.mapper;

import org.junit.jupiter.api.Test;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UtilisateurMapperTest {

    @Test
    void mapsEntityToResponseWithoutKeycloakId() {
        UUID id = UUID.randomUUID();
        Utilisateur utilisateur = Utilisateur.builder()
                .id(id)
                .keycloakId("keycloak-secret-id")
                .nom("Etudiant Test")
                .email("etudiant@tsh.tn")
                .telephone("21622334455")
                .role(RoleType.ROLE_USER)
                .verifie(true)
                .build();

        UtilisateurResponse response = UtilisateurMapper.toResponse(utilisateur);

        assertThat(response.id()).isEqualTo(id);
        assertThat(response.nom()).isEqualTo("Etudiant Test");
        assertThat(response.email()).isEqualTo("etudiant@tsh.tn");
        assertThat(response.telephone()).isEqualTo("21622334455");
        assertThat(response.role()).isEqualTo(RoleType.ROLE_USER);
        assertThat(response.verifie()).isTrue();
    }
}
