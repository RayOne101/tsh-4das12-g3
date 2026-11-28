package tn.esprit.tsh.marketplace.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tsh.marketplace.dto.AnnonceRequest;
import tn.esprit.tsh.marketplace.dto.AnnonceResponse;
import tn.esprit.tsh.marketplace.service.IAnnonceMeubleService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/meubles/annonces")
@Tag(name = "Annonces meubles", description = "Publication, recherche et gestion des annonces de meubles")
public class AnnonceMeubleController {

    private final IAnnonceMeubleService service;

    public AnnonceMeubleController(IAnnonceMeubleService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Publier une annonce de meuble")
    public ResponseEntity<AnnonceResponse> creer(@AuthenticationPrincipal Jwt jwt,
                                                 @Valid @RequestBody AnnonceRequest dto) {
        AnnonceResponse cree = service.creer(userId(jwt), nomVendeur(jwt), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(cree);
    }

    @GetMapping
    @Operation(summary = "Lister les annonces actives")
    public ResponseEntity<List<AnnonceResponse>> lister() {
        return ResponseEntity.ok(service.lister());
    }

    @GetMapping("/me")
    @Operation(summary = "Lister mes annonces")
    public ResponseEntity<List<AnnonceResponse>> mesAnnonces(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.listerMesAnnonces(userId(jwt)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detail d'une annonce")
    public ResponseEntity<AnnonceResponse> detail(@PathVariable UUID id) {
        return ResponseEntity.ok(service.trouver(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier son annonce")
    public ResponseEntity<AnnonceResponse> modifier(@AuthenticationPrincipal Jwt jwt,
                                                    @PathVariable UUID id,
                                                    @Valid @RequestBody AnnonceRequest dto) {
        return ResponseEntity.ok(service.modifier(id, userId(jwt), dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Retirer une annonce (vendeur ou admin)")
    public ResponseEntity<Void> retirer(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        service.retirer(id, userId(jwt), estAdmin(jwt));
        return ResponseEntity.noContent().build();
    }

    /** Le vendeur est toujours deduit du jeton, jamais du corps de la requete. */
    private static UUID userId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }

    private static String nomVendeur(Jwt jwt) {
        String name = jwt.getClaimAsString("name");
        return name != null && !name.isBlank() ? name : jwt.getClaimAsString("preferred_username");
    }

    private static boolean estAdmin(Jwt jwt) {
        Map<String, Object> realm = jwt.getClaimAsMap("realm_access");
        return realm != null && realm.get("roles") instanceof List<?> roles && roles.contains("ROLE_ADMIN");
    }
}
