package tn.esprit.tsh.marketplace.dto;

import tn.esprit.tsh.marketplace.entity.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AnnonceResponse(
        UUID id,
        UUID vendeurId,
        String vendeurNom,
        String titre,
        String description,
        CategorieMeuble categorie,
        TypeOffre typeOffre,
        EtatMeuble etat,
        BigDecimal prix,
        String ville,
        StatutMeuble statut,
        LocalDateTime datePublication
) {
}
