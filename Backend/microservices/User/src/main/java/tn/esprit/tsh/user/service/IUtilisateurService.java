package tn.esprit.tsh.user.service;

import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUtilisateurService {
    Utilisateur creerCompte(Utilisateur utilisateur);
    List<Utilisateur> listerUtilisateurs();
    Optional<Utilisateur> trouverParId(UUID id);
    Optional<Utilisateur> trouverParTelephone(String telephone);
    Optional<Utilisateur> trouverParEmail(String email);
    Utilisateur mettreAJourProfil(UUID id, Utilisateur modif);
    Utilisateur changerStatut(UUID id, RoleType role, Boolean verifie);
    void supprimerUtilisateur(UUID id);

    String envoyerOtp(String telephone);
    boolean verifierOtp(String telephone, String code);
}
