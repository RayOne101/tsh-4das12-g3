package tn.esprit.tsh.user.service;

import tn.esprit.tsh.user.dto.ProfilUpdateRequest;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUtilisateurService {
    List<UtilisateurResponse> listerUtilisateurs();
    Optional<Utilisateur> trouverParId(UUID id);
    Optional<Utilisateur> trouverOuCreerParKeycloakId(String keycloakId, String email, String nom, RoleType role);
    UtilisateurResponse mettreAJourProfil(UUID id, ProfilUpdateRequest dto);
    UtilisateurResponse mettreAJourPhoto(UUID id, String photoUrl);
}
