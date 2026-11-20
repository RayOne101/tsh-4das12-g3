package tn.esprit.tsh.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Champs modifiables par l'utilisateur connecte.
 * Le role, le statut de verification et le keycloakId ne sont volontairement pas exposes.
 */
@Schema(description = "Champs modifiables par l'utilisateur connecte")
public record ProfilUpdateRequest(

        @Schema(description = "Nom complet", example = "Etudiant Test")
        @NotBlank(message = "nom is required")
        @Size(max = 100)
        String nom,

        @Schema(description = "Adresse email", example = "etudiant@tsh.tn")
        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid email address")
        @Size(max = 255)
        String email,

        @Schema(description = "Telephone (optionnel)", example = "21622334455", nullable = true)
        @Size(max = 20)
        String telephone
) {
}
