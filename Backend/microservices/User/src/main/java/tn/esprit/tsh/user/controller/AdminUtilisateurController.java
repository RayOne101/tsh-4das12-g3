package tn.esprit.tsh.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.exception.ResourceNotFoundException;
import tn.esprit.tsh.user.service.IUtilisateurService;
import tn.esprit.tsh.user.service.KeycloakAdminService;

import java.util.UUID;

/**
 * Moderation reservee a ROLE_ADMIN (claim realm_access.roles du JWT Keycloak).
 */
@RestController
@RequestMapping("/api/admin/utilisateurs")
@Tag(name = "Administration utilisateurs", description = "Suspension et reactivation des comptes")
public class AdminUtilisateurController {

    private final IUtilisateurService utilisateurService;
    private final KeycloakAdminService keycloakAdminService;

    public AdminUtilisateurController(IUtilisateurService utilisateurService,
                                      KeycloakAdminService keycloakAdminService) {
        this.utilisateurService = utilisateurService;
        this.keycloakAdminService = keycloakAdminService;
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Suspendre ou reactiver un utilisateur")
    @ApiResponse(responseCode = "200", description = "Statut mis a jour")
    @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    public ResponseEntity<UtilisateurResponse> changerStatut(@PathVariable UUID id,
                                                             @RequestParam(required = false) Boolean verifie) {
        Utilisateur existant = utilisateurService.trouverParId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));

        // Suspension / reactivation cote Keycloak : le compte ne peut plus se connecter.
        if (verifie != null && existant.getKeycloakId() != null) {
            keycloakAdminService.setEnabled(existant.getKeycloakId(), verifie);
        }

        return ResponseEntity.ok(utilisateurService.changerStatut(id, verifie));
    }
}
