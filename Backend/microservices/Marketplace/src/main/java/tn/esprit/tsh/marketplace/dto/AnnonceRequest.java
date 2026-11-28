package tn.esprit.tsh.marketplace.dto;

import jakarta.validation.constraints.*;
import tn.esprit.tsh.marketplace.entity.CategorieMeuble;
import tn.esprit.tsh.marketplace.entity.EtatMeuble;
import tn.esprit.tsh.marketplace.entity.TypeOffre;

import java.math.BigDecimal;

/** Champs modifiables par le vendeur. vendeurId, statut et date sont gérés par le serveur. */
public record AnnonceRequest(

        @NotBlank(message = "titre is required")
        @Size(max = 150)
        String titre,

        @Size(max = 2000)
        String description,

        @NotNull(message = "categorie is required")
        CategorieMeuble categorie,

        @NotNull(message = "typeOffre is required")
        TypeOffre typeOffre,

        @NotNull(message = "etat is required")
        EtatMeuble etat,

        @NotNull(message = "prix is required")
        @PositiveOrZero(message = "prix must be positive or zero")
        BigDecimal prix,

        @NotBlank(message = "ville is required")
        @Size(max = 100)
        String ville
) {
}
