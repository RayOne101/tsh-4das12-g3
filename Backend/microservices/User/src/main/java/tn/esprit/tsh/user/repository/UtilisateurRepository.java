package tn.esprit.tsh.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tsh.user.entity.Utilisateur;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {
    Optional<Utilisateur> findByTelephone(String telephone);
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByKeycloakId(String keycloakId);
    boolean existsByTelephone(String telephone);
    boolean existsByEmail(String email);
}
