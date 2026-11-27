package tn.esprit.tsh.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.tsh.user.dto.ProfilUpdateRequest;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.exception.ResourceNotFoundException;
import tn.esprit.tsh.user.mapper.UtilisateurMapper;
import tn.esprit.tsh.user.service.IUtilisateurService;
import tn.esprit.tsh.user.service.KeycloakAdminService;
import tn.esprit.tsh.user.service.MediaStorageService;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/utilisateurs")
@Tag(name = "Utilisateurs", description = "Profil de l'utilisateur connecte et liste admin")
public class UtilisateurController {

    private static final Pattern PASSWORD_POLICY = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$");

    private final IUtilisateurService utilisateurService;
    private final MediaStorageService mediaStorageService;
    private final KeycloakAdminService keycloakAdminService;

    public UtilisateurController(IUtilisateurService utilisateurService,
                                 MediaStorageService mediaStorageService,
                                 KeycloakAdminService keycloakAdminService) {
        this.utilisateurService = utilisateurService;
        this.mediaStorageService = mediaStorageService;
        this.keycloakAdminService = keycloakAdminService;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Inscrire un nouvel utilisateur avec photo obligatoire")
    @ApiResponse(responseCode = "201", description = "Compte cree dans Keycloak, photo stockee dans MinIO")
    @ApiResponse(responseCode = "400", description = "Donnees, mot de passe ou photo invalides")
    @ApiResponse(responseCode = "409", description = "Email ou telephone deja utilise")
    public ResponseEntity<UtilisateurResponse> inscrire(
            @RequestParam("nom") String nom,
            @RequestParam("email") String email,
            @RequestParam(value = "telephone", required = false) String telephone,
            @RequestParam("password") String password,
            @RequestParam("file") MultipartFile fichier) {
        if (nom == null || nom.trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nom complet invalide (2 caracteres minimum)");
        }
        if (email == null || !email.contains("@") || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Adresse email invalide");
        }
        if (password == null || !PASSWORD_POLICY.matcher(password).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Mot de passe trop faible (8 caracteres min, majuscule, minuscule, chiffre et caractere special)");
        }

        // Valider l'image avant de creer le compte dans Keycloak
        mediaStorageService.validateAvatar(fichier);

        String keycloakId = keycloakAdminService.creerUtilisateur(nom.trim(), email.trim().toLowerCase(), password);
        String photoUrl = mediaStorageService.uploadAvatar(keycloakId, fichier);
        UtilisateurResponse created = utilisateurService.inscrireUtilisateur(keycloakId, nom, email, telephone, photoUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
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
        return ResponseEntity.ok(UtilisateurMapper.toResponse(profilConnecte(jwt)));
    }

    @PutMapping("/me")
    @Operation(summary = "Mettre a jour le profil de l'utilisateur connecte")
    @ApiResponse(responseCode = "200", description = "Profil mis a jour")
    @ApiResponse(responseCode = "400", description = "Donnees invalides")
    @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    @ApiResponse(responseCode = "409", description = "Email ou telephone deja utilise")
    public ResponseEntity<UtilisateurResponse> mettreAJourProfil(@AuthenticationPrincipal Jwt jwt,
                                                                 @Valid @RequestBody ProfilUpdateRequest dto) {
        return ResponseEntity.ok(utilisateurService.mettreAJourProfil(profilConnecte(jwt).getId(), dto));
    }

    @PostMapping(value = "/me/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Envoyer une photo de profil")
    @ApiResponse(responseCode = "200", description = "Photo enregistree, URL renvoyee dans le profil")
    @ApiResponse(responseCode = "400", description = "Fichier manquant, trop lourd ou format non supporte")
    public ResponseEntity<UtilisateurResponse> televerserPhoto(@AuthenticationPrincipal Jwt jwt,
                                                               @RequestParam("file") MultipartFile fichier) {
        Utilisateur user = profilConnecte(jwt);
        String photoUrl = mediaStorageService.uploadAvatar(user.getKeycloakId(), fichier);
        return ResponseEntity.ok(utilisateurService.mettreAJourPhoto(user.getId(), photoUrl));
    }

    /** Profil lie au JWT : cree au premier appel si Keycloak l'a deja authentifie. */
    private Utilisateur profilConnecte(Jwt jwt) {
        return utilisateurService
                .trouverOuCreerParKeycloakId(jwt.getSubject(), jwt.getClaimAsString("email"), nom(jwt), role(jwt))
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", jwt.getSubject()));
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
