package tn.esprit.tsh.marketplace.mapper;

import tn.esprit.tsh.marketplace.dto.AnnonceResponse;
import tn.esprit.tsh.marketplace.entity.AnnonceMeuble;

public final class AnnonceMapper {

    private AnnonceMapper() {
    }

    public static AnnonceResponse toResponse(AnnonceMeuble a) {
        if (a == null) {
            return null;
        }
        return new AnnonceResponse(
                a.getId(), a.getVendeurId(), a.getVendeurNom(), a.getTitre(), a.getDescription(),
                a.getCategorie(), a.getTypeOffre(), a.getEtat(), a.getPrix(), a.getVille(),
                a.getStatut(), a.getDatePublication());
    }
}
