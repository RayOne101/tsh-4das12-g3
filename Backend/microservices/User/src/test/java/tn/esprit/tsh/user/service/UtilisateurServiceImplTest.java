package tn.esprit.tsh.user.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.tsh.user.dto.ProfilUpdateRequest;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.exception.ResourceNotFoundException;
import tn.esprit.tsh.user.repository.UtilisateurRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UtilisateurServiceImplTest {

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private UtilisateurServiceImpl service;

    @Test
    void linksPreExistingRowByEmailOnFirstLogin() {
        Utilisateur admin = Utilisateur.builder()
                .id(UUID.randomUUID())
                .email("admin@tsh.tn")
                .telephone("21600000000")
                .nom("Admin")
                .role(RoleType.ROLE_ADMIN)
                .verifie(true)
                .build();

        when(utilisateurRepository.findByKeycloakId("keycloak-admin-id")).thenReturn(Optional.empty());
        when(utilisateurRepository.findByEmail("admin@tsh.tn")).thenReturn(Optional.of(admin));
        when(utilisateurRepository.save(admin)).thenReturn(admin);

        Optional<Utilisateur> found = service.trouverOuCreerParKeycloakId(
                "keycloak-admin-id", "admin@tsh.tn", "Admin", RoleType.ROLE_ADMIN);

        assertThat(found).contains(admin);
        assertThat(admin.getKeycloakId()).isEqualTo("keycloak-admin-id");
        verify(utilisateurRepository).save(admin);
    }

    @Test
    void createsProfileForSelfRegisteredUser() {
        when(utilisateurRepository.findByKeycloakId("keycloak-new-id")).thenReturn(Optional.empty());
        when(utilisateurRepository.findByEmail("new@tsh.tn")).thenReturn(Optional.empty());
        when(utilisateurRepository.save(any(Utilisateur.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Utilisateur> found = service.trouverOuCreerParKeycloakId(
                "keycloak-new-id", "new@tsh.tn", "New User", RoleType.ROLE_USER);

        assertThat(found).isPresent();
        Utilisateur user = found.get();
        assertThat(user.getKeycloakId()).isEqualTo("keycloak-new-id");
        assertThat(user.getEmail()).isEqualTo("new@tsh.tn");
        assertThat(user.getNom()).isEqualTo("New User");
        assertThat(user.getRole()).isEqualTo(RoleType.ROLE_USER);
        assertThat(user.getVerifie()).isTrue();
        assertThat(user.getTelephone()).isNull();
    }

    @Test
    void updateProfileThrowsWhenUserDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(utilisateurRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.mettreAJourProfil(id,
                new ProfilUpdateRequest("New Name", "new@tsh.tn", null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(id.toString());
    }
}
