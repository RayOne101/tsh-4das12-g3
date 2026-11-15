package tn.esprit.tsh.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tsh.user.dto.ProfilUpdateRequest;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.exception.ResourceNotFoundException;
import tn.esprit.tsh.user.mapper.UtilisateurMapper;
import tn.esprit.tsh.user.service.IUtilisateurService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@Tag(name = "Utilisateurs", description = "Profil de l'utilisateur connecte et liste admin")
public class UtilisateurController {

    private final IUtilisateurService utilisateurService;

    public UtilisateurController(IUtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lister tous les utilisateurs (admin)")
    @ApiResponse(responseCode = "200", description = "Liste des utilisateurs")
    @ApiResponse(responseCode = "403", description = "Acces refuse (ROLE_ADMIN requis)")
    public ResponseEntity<List<UtilisateurResponse>> listerUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.listerUtilisateurs());
    }

    @GetMapping("/me")
    @Operation(summary = "Profil de l'utilisateur connecte")
    @ApiResponse(responseCode = "200", description = "Profil trouve")
    @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    public ResponseEntity<UtilisateurResponse> getProfil(@AuthenticationPrincipal Jwt jwt) {
        Utilisateur user = utilisateurService
                .trouverOuCreerParKeycloakId(jwt.getSubject(), jwt.getClaimAsString("email"), nom(jwt), role(jwt))
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", jwt.getSubject()));
        return ResponseEntity.ok(UtilisateurMapper.toResponse(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Mettre a jour le profil de l'utilisateur connecte")
    @ApiResponse(responseCode = "200", description = "Profil mis a jour")
    @ApiResponse(responseCode = "400", description = "Donnees invalides")
    @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    @ApiResponse(responseCode = "409", description = "Email ou telephone deja utilise")
    public ResponseEntity<UtilisateurResponse> mettreAJourProfil(@AuthenticationPrincipal Jwt jwt,
                                                                 @Valid @RequestBody ProfilUpdateRequest dto) {
        Utilisateur user = utilisateurService
                .trouverOuCreerParKeycloakId(jwt.getSubject(), jwt.getClaimAsString("email"), nom(jwt), role(jwt))
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", jwt.getSubject()));
        return ResponseEntity.ok(utilisateurService.mettreAJourProfil(user.getId(), dto));
    }

    private static String nom(Jwt jwt) {
        String name = jwt.getClaimAsString("name");
        return name != null && !name.isBlank() ? name : jwt.getClaimAsString("preferred_username");
    }

    private static RoleType role(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess != null && realmAccess.get("roles") instanceof List<?> roles
                && roles.contains("ROLE_ADMIN")) {
            return RoleType.ROLE_ADMIN;
        }
        return RoleType.ROLE_USER;
    }
}
