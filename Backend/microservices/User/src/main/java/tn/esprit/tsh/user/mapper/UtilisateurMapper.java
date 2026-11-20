package tn.esprit.tsh.user.mapper;

import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.Utilisateur;

/** Convertit les entites vers les DTOs exposes par l'API. */
public final class UtilisateurMapper {

    private UtilisateurMapper() {
    }

    public static UtilisateurResponse toResponse(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }
        return new UtilisateurResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getEmail(),
                utilisateur.getTelephone(),
                utilisateur.getRole(),
                utilisateur.getVerifie(),
                utilisateur.getPhotoUrl()
        );
    }
}
