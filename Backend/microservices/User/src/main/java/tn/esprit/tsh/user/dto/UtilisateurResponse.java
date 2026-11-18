package tn.esprit.tsh.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import tn.esprit.tsh.user.entity.RoleType;

import java.util.UUID;

@Schema(description = "Profil utilisateur retourne par l'API")
public record UtilisateurResponse(

        @Schema(example = "a8511fef-229e-4fdf-ab8f-fd10dae360c0")
        UUID id,

        @Schema(description = "Nom complet", example = "Etudiant Test")
        String nom,

        @Schema(description = "Adresse email", example = "etudiant@tsh.tn")
        String email,

        @Schema(description = "Telephone (optionnel)", example = "21622334455", nullable = true)
        String telephone,

        @Schema(description = "Role applicatif", example = "ROLE_USER")
        RoleType role,

        @Schema(description = "Profil verifie", example = "true")
        Boolean verifie,

        @Schema(description = "URL de la photo de profil", nullable = true,
                example = "http://localhost:9000/tsh-avatars/avatars/kc-123/uuid.jpg")
        String photoUrl
) {
}
