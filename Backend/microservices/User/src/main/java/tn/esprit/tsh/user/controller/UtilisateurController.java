package tn.esprit.tsh.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tsh.user.dto.OtpRequest;
import tn.esprit.tsh.user.dto.OtpVerificationRequest;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.service.IUtilisateurService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final IUtilisateurService utilisateurService;

    public UtilisateurController(IUtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // 1. POST /api/utilisateurs : Créer un compte en attente de validation OTP
    @PostMapping
    public ResponseEntity<Utilisateur> creerCompte(@RequestBody Utilisateur utilisateur) {
        Utilisateur cree = utilisateurService.creerCompte(utilisateur);
        utilisateurService.envoyerOtp(cree.getTelephone());
        return new ResponseEntity<>(cree, HttpStatus.CREATED);
    }

    // 2. POST /api/utilisateurs/envoyer-otp : Générer et envoyer un code OTP par SMS
    @PostMapping("/envoyer-otp")
    public ResponseEntity<Map<String, String>> envoyerOtp(@RequestBody OtpRequest request) {
        String code = utilisateurService.envoyerOtp(request.getTelephone());
        return ResponseEntity.ok(Map.of(
                "message", "Code OTP envoyé avec succès",
                "telephone", request.getTelephone(),
                "codeSimulation", code
        ));
    }

    // 3. POST /api/utilisateurs/verifier-otp : Valider le code OTP et activer le compte
    @PostMapping("/verifier-otp")
    public ResponseEntity<Map<String, Object>> verifierOtp(@RequestBody OtpVerificationRequest request) {
        boolean succes = utilisateurService.verifierOtp(request.getTelephone(), request.getCode());
        if (succes) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Numéro de téléphone vérifié et compte activé !"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "FAILED",
                    "message", "Code OTP invalide ou expiré."
            ));
        }
    }

    // 4. GET /api/utilisateurs : Lister tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> listerUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.listerUtilisateurs());
    }

    // 5. GET /api/utilisateurs/{id} : Consulter un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> trouverParId(@PathVariable UUID id) {
        return utilisateurService.trouverParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. GET /api/utilisateurs/me : Consulter son profil utilisateur
    @GetMapping("/me")
    public ResponseEntity<Utilisateur> getProfil(@RequestParam(required = false) UUID id,
                                                 @RequestParam(required = false) String telephone) {
        if (id != null) {
            return utilisateurService.trouverParId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } else if (telephone != null) {
            return utilisateurService.trouverParTelephone(telephone)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.badRequest().build();
    }

    // 7. PUT /api/utilisateurs/me : Mettre à jour ses coordonnées de profil
    @PutMapping("/me")
    public ResponseEntity<Utilisateur> mettreAJourProfil(@RequestParam UUID id,
                                                         @RequestBody Utilisateur modif) {
        Utilisateur updated = utilisateurService.mettreAJourProfil(id, modif);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // 8. PATCH /api/admin/utilisateurs/{id}/statut : Suspendre ou réactiver un utilisateur (admin)
    @PatchMapping("/admin/{id}/statut")
    public ResponseEntity<Utilisateur> changerStatut(@PathVariable UUID id,
                                                     @RequestParam(required = false) RoleType role,
                                                     @RequestParam(required = false) Boolean verifie) {
        Utilisateur updated = utilisateurService.changerStatut(id, role, verifie);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
